"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Container from "../../components/Container";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const NFTDetail = () => {
  const { tokenid } = useParams() as { tokenid: string };
  const { address } = useAccount();
  const { writeContractAsync: writeCauvas } = useScaffoldWriteContract("CauvasNFTCollection");

  const { data: tokenURI } = useScaffoldReadContract({
    contractName: "CauvasNFTCollection",
    functionName: "tokenURI",
    args: [BigInt(tokenid)],
  });

  const { data: hasAdminRole } = useScaffoldReadContract({
    contractName: "CauvasNFTCollection",
    functionName: "hasAdminRole",
    args: [address],
  });

  const { data: auction } = useScaffoldReadContract({
    contractName: "CauvasNFTCollection",
    functionName: "idToAuction",
    args: [BigInt(tokenid)],
  });

  const [startingPrice, setStartingPrice] = useState("");
  const [auctionEndDate, setAuctionEndDate] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  if (!tokenURI) {
    console.log("Loading tokenURI...");
    return <div>Loading...</div>;
  }

  console.log("Fetched tokenURI:", tokenURI);

  const calculateDuration = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    return Math.floor((end - now) / 1000);
  };

  return (
    <Container>
      <div className="p-10 flex flex-col gap-4 w-full items-center">
        <div className="card card-side bg-base-100 shadow-xl w-3/4 justify-center">
          <figure>
            <img
              src={`https://white-written-harrier-702.mypinata.cloud/ipfs/${tokenURI}`}
              alt={`NFT ${tokenid}`}
              className="card-image"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">NFT #{tokenid}</h2>
            {auction && auction[4] === BigInt(0) ? (
              hasAdminRole ? (
                <div className="flex flex-col w-full items-center gap-4">
                  <h2 className="text-l">Start an Auction</h2>
                  <input
                    type="number"
                    placeholder="Starting Price (MATIC)"
                    className="input input-bordered w-full"
                    value={startingPrice}
                    onChange={e => setStartingPrice(e.target.value)}
                  />
                  <input
                    type="datetime-local"
                    placeholder="Auction End Date"
                    className="input input-bordered w-full"
                    value={auctionEndDate}
                    onChange={e => setAuctionEndDate(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-neutral w-full"
                    onClick={async () => {
                      const duration = calculateDuration(auctionEndDate);
                      await writeCauvas({
                        functionName: "createAuction",
                        args: [BigInt(tokenid), parseEther(startingPrice), BigInt(duration)],
                      });
                    }}
                  >
                    Start Auction
                  </button>
                </div>
              ) : (
                <p>Auction has not started yet.</p>
              )
            ) : (
              <>
                <div className="flex flex-col gap-4 w-full">
                  {auction && auction[2] !== BigInt(0) ? (
                    <p className="m-0 p-0">Highest Bid: {formatEther(auction[2]).toString()} MATIC</p>
                  ) : (
                    <p className="m-0 p-0">
                      Starting Price: {auction ? formatEther(auction[1]).toString() : "N/A"} MATIC
                    </p>
                  )}

                  <p className="m-0 p-0">
                    Auction End Date:{" "}
                    {auction && auction[4] ? new Date(Number(auction[4]) * 1000).toLocaleString() : "N/A"}
                  </p>
                  {auction && auction[4] && Number(auction[4]) * 1000 < Date.now() ? (
                    <button
                      type="button"
                      className="btn btn-neutral w-full"
                      onClick={async () => {
                        await writeCauvas({
                          functionName: "endAuction",
                          args: [BigInt(tokenid)],
                        });
                      }}
                    >
                      End Auction
                    </button>
                  ) : (
                    <>
                      {" "}
                      <input
                        type="number"
                        placeholder="Your Bid (MATIC)"
                        className="input input-bordered w-full max-w-xs"
                        value={bidAmount}
                        onChange={e => setBidAmount(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="btn btn-neutral w-full"
                        onClick={async () => {
                          await writeCauvas({
                            functionName: "bid",
                            args: [BigInt(tokenid)],
                            value: parseEther(bidAmount),
                          });
                        }}
                      >
                        Place Bid
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default NFTDetail;
