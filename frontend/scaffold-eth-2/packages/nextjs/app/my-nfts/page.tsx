"use client";

import Link from "next/link";
import Container from "../components/Container";
import type { NextPage } from "next";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

/* eslint-disable @next/next/no-img-element */

const MyNFTs: NextPage = () => {
  const { data: myNFTData } = useScaffoldReadContract({
    contractName: "CauvasNFTCollection",
    functionName: "fetchMyNFTUrisAndIds",
  });

  const [myNFTUris, myNFTIds] = myNFTData || [[], []];

  return (
    <Container>
      <h1 className="text-xl text-center mt-5">My NFTs</h1>
      <div className="flex flex-wrap justify-center">
        {myNFTUris.length > 0 ? (
          myNFTUris.map((uri, index) => (
            <Link
              key={myNFTIds[index]}
              href={`/nfts/${myNFTIds[index]}`}
              className="card card-compact bg-base-100 w-1/5 shadow-xl m-10"
            >
              <figure>
                <img
                  src={`https://white-written-harrier-702.mypinata.cloud/ipfs/${uri}`}
                  alt={`NFT ${myNFTIds[index]}`}
                  className="card-image"
                />
              </figure>
              <div className="card-body">
                <p>NFT #{myNFTIds[index]}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No NFTs</p>
        )}
      </div>
    </Container>
  );
};

export default MyNFTs;
