const ethDefinitions = {
  CrossChainEmitter: {
    abi: [
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "string",
            name: "message",
            type: "string",
          },
        ],
        name: "MessageSent",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "message",
            type: "string",
          },
        ],
        name: "sendMessage",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    address: "0xc90ad29ef1f0a403dbed7f10bbc8e8727069cfcf",
  },
} as const;
export default ethDefinitions;
