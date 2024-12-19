import { abi as CauvasABI } from "./assets/CauvasNFTCollection.json";
import { Abi } from "viem";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {s
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */

const externalContracts = {
  80002: {
    CauvasNFTCollection: {
      address: "0x0C5986B2A9F5E9201917029F6e5bBB898839f30B",
      abi: CauvasABI as Abi,
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
