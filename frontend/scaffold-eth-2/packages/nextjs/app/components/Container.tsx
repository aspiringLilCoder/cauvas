"use client";

import { ReactNode } from "react";
import NavBar from "./NavBar";
import type { NextPage } from "next";

interface ContainerProps {
  children: ReactNode;
}

const Container: NextPage<ContainerProps> = ({ children }) => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="mockup-browser bg-base-300 border w-4/5">
          <div className="mockup-browser-toolbar">
            <div className="input">https://cauvas.nft</div>
          </div>
          <div className="bg-base-200 flex flex-col">
            <NavBar />
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Container;
