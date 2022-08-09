import { getEthereum } from "../utils/getEthereum";
import { getWeb3 } from "../utils/getWeb3";
import map from "../build/deployments/map.json";

let init_chain_id = 0;
let init_web_3 = null;
let init_accounts = null;
let init_factory = null;

export const init = async () => {
  const web3 = await getWeb3();
  init_web_3 = web3;

  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const chain_id = parseInt(await web3.eth.getChainId());

      console.log("GOTTEN CHAIN ID: ", chain_id);

      init_accounts = accounts;
      init_chain_id = chain_id;

      dispatch(login());

      await load_initial_contracts();
    } catch (error) {
      if (error.message == "User rejected the request.") {
        // set_error("Connect your Metamask Wallet!");
        // set_notification(!notification);
        // } else {
        // set_error("Connect Metamask Wallet!!");
        console.log(error);
        // set_notification(!notification);
        // notify(error, "You have to connect your Metamask Wallet!")
      }
    }
  }
};

export const load_initial_contracts = async () => {
  // <=42 to exclude Kovan, <42 to include kovan
  // if (chain_id < 42) {
  //   // Wrong Network!
  //   return;
  // }
  // console.log("CHAIN_ID:", chain_id);

  let _chain_id = 0;
  if (init_chain_id === 42) {
    _chain_id = 42;
  }
  if (init_chain_id === 1337) {
    _chain_id = 1337;
  }
  console.log("_CHAIN_ID:", _chain_id);

  console.log("BEFORE SET!! ", init_web_3);

  const _jamii_factory = await load_contract(_chain_id, "JamiiFactory");
  init_factory = await load_contract(_chain_id, "JamiiFactory");

  if (!_jamii_factory) {
    console.log("FAILED TO GET FACTORY!!");
    return;
  }

  console.log(_jamii_factory);
};

const load_contract = async (chain, contract_name) => {
  const web3 = init_web_3;

  let address;
  try {
    address = map[chain][contract_name][0];
  } catch (e) {
    console.log(
      `Couldn't find any deployed contract "${contract_name}" on the chain "${chain}".`
    );
    return undefined;
  }

  let contract_artifact;
  try {
    contract_artifact = await import(
      `../build/deployments/${chain}/${address}.json`
    );
    console.log(contract_artifact);
  } catch (e) {
    console.log(
      `Failed to load contract artifact "../build/deployments/${chain}/${address}.json"`
    );
    return undefined;
  }
  console.log("WEB_3# ", init_web_3);
  return new web3.eth.Contract(contract_artifact.abi, address);
};

export const create_new_ballot = async (e) => {
  e.preventDefault();
  let ballot_id = uuid();
  let ballot_name = ballot.ballot_name;
  let candidates = process_candidates(ballot.ballot_candidates);
  let ballot_type = ballot.ballot_type;
  let ballot_days = ballot.ballot_days;
  let registration_period = ballot.registration_period;

  // validation here

  await factory.methods
    .create_ballot(
      ballot_id,
      ballot_name,
      candidates,
      ballot_type,
      ballot_days,
      registration_period
    )
    .send({ from: accounts[0], value: ballot_fee, gas: 3000000 })
    .on("receipt", async () => {
      // notification
      //   set_ballot_id(ballot_id);
      console.log("Ballot created Successfully!!");
    });
  console.log(
    ballot_id,
    ballot_name,
    candidates,
    ballot_type,
    ballot_days,
    registration_period
  );
};

export const register_voter = async (_id_number, _ballot_id) => {
  //   e.preventDefault();
  // validation here

  const unique_voter_id = await init_factory?.methods
    .register_voter(_id_number, _ballot_id)
    .send({ from: init_accounts[1], gas: 3000000 })
    .on("receipt", async () => {
      // notification
      console.log("Voter Registered Successfully!!");
    });
  console.log("UVI:", unique_voter_id);

  return unique_voter_id;
};

export const get_account = async () => {
  await window.ethereum.enable();
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = accounts[0];
  console.log(account);
  window.ethereum.on("accountsChanged", function (accounts) {
    // Time to reload your interface with accounts[0]!
    console.log(accounts[0]);
  });
  return account || accounts[0];
};

export const get_ballot = async (ballot_id) => {
  init();
  const ballot = await init_factory?.methods.get_ballot(ballot_id).call();
  //   //   set_ballot(ballot);
  console.log("BALLOT ID:", ballot_id);
  console.log(ballot);
  console.log(init_accounts);
  //   console.log("TESTING GET BALOTT!! ", init_factory);
  return ballot;
};

// export const get_voter = async (_voter_address) => {
//   const voter = await init_factory?.methods
//     .get_voter(_voter_address)
//     .call();
//   console.log("Voter", voter);
// };

export const get_candidate = async (_candidate_address) => {
  const candidate = await init_factory?.methods
    .get_candidate(_candidate_address)
    .call();
  //   //   set_ballot(ballot);
  console.log("Candidate:", candidate);
  return candidate;
};

export const get_candidates_data = async (_candidates) => {
  let candidates_data = [];
  let n = _candidates.length;
  for (let i = 0; i < n; i++) {
    const candidate = await factory.methods
      .get_candidate(_candidates[i])
      .call();
    candidates_data.push(candidate);
  }
  return candidates_data;
};

export const get_ballot_candidates = async (_ballot_id) => {
  init();
  const candidates = await init_factory?.methods
    .get_candidates(_ballot_id)
    .call();
  console.log("Candidates:", candidates);
  return candidates;
};

export const vote = async (_candidate_address, _ballot_id) => {
  init();
  await init_factory?.methods
    .vote(_candidate_address, _ballot_id)
    .send({ from: init_accounts[1], gas: 3000000 })
    .on("receipt", async () => {
      // notification
      console.log("Voter Successfully Voted!!");
    });
};
