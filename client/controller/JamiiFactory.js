const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_voter",
        type: "address",
      },
    ],
    name: "assigned_voting_rights",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_ballot_type",
        type: "uint256",
      },
    ],
    name: "created_ballot",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_ballot_id",
        type: "uint256",
      },
    ],
    name: "ended_ballot",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "_voter_unique_id",
        type: "bytes32",
      },
    ],
    name: "registered_voter",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "_tie",
        type: "bool",
      },
    ],
    name: "tied_ballot",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_candidate",
        type: "address",
      },
    ],
    name: "voted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_ballot_id",
        type: "uint256",
      },
    ],
    name: "assign_voting_rights",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_ballot_name",
        type: "string",
      },
      {
        internalType: "address[]",
        name: "_ballot_candidates_addr",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_ballot_type",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_days",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_registration_period",
        type: "uint256",
      },
    ],
    name: "create_ballot",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ballot_type",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_ballot_name",
        type: "string",
      },
    ],
    name: "create_ballot_type",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ballot_id",
        type: "uint256",
      },
    ],
    name: "end_ballot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ballot_id",
        type: "uint256",
      },
    ],
    name: "get_ballot",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "ballot_id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ballot_type",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "ballot_name",
            type: "string",
          },
          {
            internalType: "address",
            name: "chair",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "voters_count",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "open_date",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_days",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "expired",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "registration_window",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "current_winner",
            type: "address",
          },
          {
            internalType: "bool",
            name: "tie",
            type: "bool",
          },
        ],
        internalType: "struct IJamiiFactory.Ballot",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ballot_id",
        type: "uint256",
      },
    ],
    name: "get_ballot_owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_candidate_addr",
        type: "address",
      },
    ],
    name: "get_candidate",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "candidate_id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ballot_id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "candidate_address",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "vote_count",
            type: "uint256",
          },
        ],
        internalType: "struct IJamiiFactory.Candidate",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ballot_id",
        type: "uint256",
      },
    ],
    name: "get_candidates",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voter_address",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_ballot_id",
        type: "uint256",
      },
    ],
    name: "get_voter",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "voter_id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "voter_address",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "ballot_id",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "registered",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "rights",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "voted",
            type: "bool",
          },
          {
            internalType: "bytes32",
            name: "unique_voter_id",
            type: "bytes32",
          },
        ],
        internalType: "struct IJamiiFactory.Voter",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ballot_id",
        type: "uint256",
      },
    ],
    name: "get_voters",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ballot_id",
        type: "uint256",
      },
    ],
    name: "get_winner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_arbitrary_text",
        type: "string",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id_number",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_ballot_id",
        type: "uint256",
      },
    ],
    name: "register_voter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_candidate",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_ballot_id",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const JamiiFactory = (web3) => {
  return new web3.eth.Contract(
    abi,
    "0x898Ea14f3eA340231dcBBa105d290BfBa5cAa288"
  );
};

export default JamiiFactory;
