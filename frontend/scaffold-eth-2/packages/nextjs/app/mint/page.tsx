"use client";

import { useState } from "react";
import Container from "../components/Container";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Mint: NextPage = () => {
  const { address } = useAccount();
  const { writeContractAsync: writeCauvas } = useScaffoldWriteContract("CauvasNFTCollection");
  const { data: agreementsSigned } = useScaffoldReadContract({
    contractName: "CauvasNFTCollection",
    functionName: "minterToCopyrightAgreement",
    args: [address],
  });
  const { data: hasMinterRole } = useScaffoldReadContract({
    contractName: "CauvasNFTCollection",
    functionName: "hasMinterRole",
    args: [address],
  });

  const [file, setFile] = useState("");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [CID, setCID] = useState("");
  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }

      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const ipfsUrl = await uploadRequest.json();
      setUrl(ipfsUrl);
      setUploading(false);
      setCID(ipfsUrl.substring(ipfsUrl.indexOf("/ipfs/") + 6));
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0]);
    setUrl("");
    setCID("");
  };

  return (
    <Container>
      {hasMinterRole ? (
        <div className="p-10 flex flex-col gap-4 w-full items-center">
          <h1 className="text-xl">Mint NFT</h1>
          {!agreementsSigned && (
            <div className="w-3/4">
              <div className="collapse bg-base-200 w-full">
                <input type="checkbox" />
                <div className="collapse-title btn btn-outline self-center w-full">Terms and conditions</div>
                <div className="collapse-content">
                  <p>
                    By minting an NFT on Cauvas, you transfer the ownership and copyright of your artwork to the
                    platform. This allows Cauvas to auction your NFT for charitable purposes.
                  </p>
                  <button
                    type="submit"
                    className="btn btn-neutral w-full"
                    onClick={async () => {
                      await writeCauvas({
                        functionName: "signCopyrightAgreement",
                        args: [],
                      });
                    }}
                  >
                    Agree to our terms and conditions
                  </button>
                </div>
              </div>
            </div>
          )}

          {agreementsSigned && (
            <>
              <input
                type="file"
                className="file-input w-3/4"
                onChange={e => {
                  if (e.target.files) {
                    handleChange(e);
                  }
                }}
              />
              {!url && (
                <button className="btn btn-secondary w-3/4" disabled={uploading} onClick={uploadFile}>
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              )}

              {url && (
                <>
                  <div className="flex justify-center gap-4 w-3/4 items-center">
                    <img src={url} alt="Image from Pinata" className="w-1/4" />
                    <a href={url} className="underline" target="_blank">
                      View Link
                    </a>
                  </div>

                  <button
                    className="btn btn-neutral w-3/4"
                    onClick={async () => {
                      await writeCauvas({
                        functionName: "createToken",
                        args: [CID],
                      });
                    }}
                  >
                    Mint
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="p-10">
          <h1 className="text-xl">Access not allowed</h1>
        </div>
      )}
    </Container>
  );
};

export default Mint;
