"use client";

import Link from "next/link";
import Container from "./components/Container";
import type { NextPage } from "next";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

/* eslint-disable @next/next/no-img-element */

const Home: NextPage = () => {
  const { data: tokenURIs } = useScaffoldReadContract({
    contractName: "CauvasNFTCollection",
    functionName: "getURIs",
  });

  return (
    <Container>
      <h1 className="text-xl text-center mt-5">Cauvas NFT Collection</h1>
      <div className="flex flex-wrap justify-center">
        {tokenURIs?.length > 0 ? (
          tokenURIs?.map((uri, index) => (
            <Link key={index} href={`/nfts/${index}`} className="card card-compact bg-base-100 w-1/5 shadow-xl m-10">
              <figure>
                <img
                  src={`https://white-written-harrier-702.mypinata.cloud/ipfs/${uri}`}
                  alt={`NFT ${index}`}
                  className="card-image"
                />
              </figure>
              <div className="card-body">
                <p>NFT #{index}</p>
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

export default Home;
