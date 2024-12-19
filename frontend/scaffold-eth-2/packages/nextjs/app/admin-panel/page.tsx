"use client";

import { useState } from "react";
import Container from "../components/Container";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const AdminPanel: NextPage = () => {
  const { address } = useAccount();
  const { writeContractAsync: writeCauvas } = useScaffoldWriteContract("CauvasNFTCollection");
  const [giveMinterRoleAddress, setGiveMinterRoleAddress] = useState<string>("");
  const [tokenid, setTokenid] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState("");

  const { data: hasAdminRole } = useScaffoldReadContract({
    contractName: "CauvasNFTCollection",
    functionName: "hasAdminRole",
    args: [address],
  });

  return (
    <Container>
      {hasAdminRole ? (
        <div className="p-10 flex flex-col gap-4 w-full items-center">
          <h1 className="text-xl">Admin Panel</h1>
          <div className="join w-3/4">
            <input
              className="input input-bordered join-item w-full"
              placeholder="Wallet Address"
              value={giveMinterRoleAddress}
              onChange={e => setGiveMinterRoleAddress(e.target.value)}
            />
            <button
              className="btn join-item btn-neutral"
              onClick={async () => {
                await writeCauvas({
                  functionName: "giveMinterRole",
                  args: [giveMinterRoleAddress],
                });
              }}
            >
              Give Minting Rights
            </button>
          </div>
          <div className="join w-3/4">
            <input
              className="input input-bordered join-item w-1/4"
              type="number"
              value={tokenid}
              onChange={e => setTokenid(e.target.value)}
            />
            <input
              className="input input-bordered join-item w-full"
              placeholder="Recipient Wallet Address"
              value={recipientAddress}
              onChange={e => setRecipientAddress(e.target.value)}
            />
            <button
              className="btn join-item btn-neutral"
              onClick={async () => {
                await writeCauvas({
                  functionName: "sendAuctionEarnings",
                  args: [BigInt(tokenid), recipientAddress],
                });
              }}
            >
              Send Auction Earnings
            </button>
          </div>
        </div>
      ) : (
        <div className="p-10">
          <h1 className="text-xl">Access not allowed</h1>
        </div>
      )}
    </Container>
  );
};

export default AdminPanel;
