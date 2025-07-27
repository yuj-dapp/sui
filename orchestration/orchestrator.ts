import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { getFaucetHost, requestSuiFromFaucetV2 } from "@mysten/sui/faucet";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import * as viem from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import ethDefinitions from "../../definitions";

const SUI_NETWORK = "testnet" as const;

const suiSeed = Bun.env.SUI_SEED;
if (!suiSeed) {
  throw new Error("SUI_SEED environment variable is not set.");
}
const keypair = Ed25519Keypair.deriveKeypair(suiSeed);
const address = keypair.getPublicKey().toSuiAddress();

const sui = {
  packageId:
    "0x4dc34d1ac26c96f98543fcf16924ead765af8b9fe261bd74f895b5851c7e57c5",
  moduleName: "message_sink",
};

const suiClient = new SuiClient({ url: getFullnodeUrl(SUI_NETWORK) });

try {
  await requestSuiFromFaucetV2({
    host: getFaucetHost(SUI_NETWORK),
    recipient: address,
  });
} catch (_) {}

const ethKey = Bun.env.ETH_KEY;
if (!viem.isHex(ethKey)) {
  throw new Error("ETH_KEY environment variable is not set or invalid.");
}

const evmNetwork = sepolia;

const ethClient = viem
  .createWalletClient({
    transport: viem.http(
      `https://sepolia.infura.io/v3/${Bun.env.INFURA_API_KEY}`
    ),
    account: privateKeyToAccount(ethKey),
    chain: evmNetwork,
  })
  .extend(viem.publicActions);

async function sendToSui(message: string) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${sui.packageId}::${sui.moduleName}::${"receive_message"}`,
    arguments: [bcs.String.serialize(message)],
  });

  const result = await suiClient.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: { showEffects: true },
  });

  await suiClient.waitForTransaction({
    digest: result.digest,
  });

  console.log("✅ Sui message sent:", result.digest);
}

async function startRelayer() {
  console.log(
    "🔄 Starting relayer, current block ",
    await ethClient.getBlockNumber()
  );

  console.log(
    "🔄 Watching Ethereum events on contract : ",
    ethDefinitions.CrossChainEmitter.address
  );
  ethClient.watchContractEvent({
    ...ethDefinitions.CrossChainEmitter,
    eventName: "MessageSent",
    onLogs: async (logs) => {
      for (const log of logs) {
        const message = log.args.message as string;
        console.log("📦 Message from Ethereum:", message);
        await sendToSui(message);
      }
    },
  });
}

startRelayer();
