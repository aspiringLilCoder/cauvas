import Link from "next/link";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

function NavBar() {
  const { address } = useAccount();
  const { data: hasMinterRole } = useScaffoldReadContract({
    contractName: "CauvasNFTCollection",
    functionName: "hasMinterRole",
    args: [address],
  });
  const { data: hasAdminRole } = useScaffoldReadContract({
    contractName: "CauvasNFTCollection",
    functionName: "hasAdminRole",
    args: [address],
  });

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            cauvas
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            {hasAdminRole && (
              <li>
                <Link href="/admin-panel">Admin Panel</Link>
              </li>
            )}
            {hasMinterRole && (
              <li>
                <Link href="/mint">Mint NFT</Link>
              </li>
            )}

            <li>
              <Link href="/my-nfts">My NFTs</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default NavBar;
