import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Address } from "viem";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;
  const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;

  await deploy("CauvasNFTCollection", {
    from: deployerPrivateKey as Address,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deployYourContract;

deployYourContract.tags = ["CauvasNFTCollection"];
