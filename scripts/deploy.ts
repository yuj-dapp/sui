import hre from "hardhat";

async function main() {
  const definitions: Record<string, { abi: any; address: string }> = {};

  const [client] = await hre.viem.getWalletClients();

  const CrossChainEmitter = await hre.viem.deployContract(
    "CrossChainEmitter",
    []
  );

  definitions["CrossChainEmitter"] = {
    abi: CrossChainEmitter.abi,
    address: CrossChainEmitter.address,
  };

  await Bun.file("../definitions.ts").write(
    "const ethDefinitions =" +
      JSON.stringify(definitions, null, 2) +
      " as const;\n" +
      "export default ethDefinitions;\n"
  );
}

main()
  .then(() => {
    console.log("Deployment successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
