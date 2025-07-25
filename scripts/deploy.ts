import * as viem from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import abi from "../";
import bytecode from "./CrossChainEmitter.bytecode.json";

const pvtKey = Bun.env.PVT_KEY;

if (!viem.isHex(pvtKey)) {
  throw new Error("PVT_KEY must be a valid hex string");
}

const account = privateKeyToAccount(pvtKey);

const client = viem.createWalletClient({
  account,
  chain: sepolia,
  transport: viem.http(sepolia.rpcUrls.default.http[0]),
});

async function deploy() {
  const hash = await client.deployContract({
    abi,
    bytecode: `0x${bytecode.object}`,
    args: [],
  });

  console.log("Contract deployed at tx:", hash);
}

deploy();
