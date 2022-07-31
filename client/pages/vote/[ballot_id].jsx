import React, { useState, useEffect } from "react";
import { getWeb3 } from "../../utils/getWeb3";
import map from "../../../build/deployments/map.json";
import { useRouter } from "next/router";
import {
  get_ballot_candidates,
  vote,
  get_account,
} from "../../wrapper/wrapper";
// import { Paper, TextField } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { wrapper } from "../../store/store";
import { add_ballot_candidates } from "../../store/ballot_slice";
import {
  login,
  add_connected_account,
  add_chain_id,
  add_web_3,
  add_factory,
} from "../../store/auth-slice";

const Vote = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { ballot_id } = router.query;
  const [selected_candidate, set_selected_candidate] = useState("");

  const [chain_id, set_chain_id] = useState(0);
  const [web_3, set_web_3] = useState({});
  const [voted, set_voted] = useState(false);

  // const chain_id = useSelector((state) => state.auth.chain_id);
  const jamii_factory = useSelector((state) => state.auth.factory);
  const account = useSelector((state) => state.auth.connected_account);

  const ballot_candidates = useSelector(
    (state) => state.ballot.ballot_candidates
  );

  const handle_box_change = (e) => {
    set_selected_candidate(e.target.value);
  };

  const init = async () => {
    const web3 = await getWeb3();
    set_web_3(web3);

    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        const chain_id = parseInt(await web3.eth.getChainId());

        dispatch(login());
        // dispatch(add_web_3(web3));
        // dispatch(add_chain_id(chain_id));

        let _chain_id = 0;
        if (chain_id === 42) {
          _chain_id = 42;
        }
        if (chain_id === 1337) {
          _chain_id = 1337;
        }
        set_chain_id(_chain_id);
      } catch (error) {
        if (error.message == "User rejected the request.") {
          set_error("Connect your Metamask Wallet!");
          // set_notification(!notification);
        } else {
          console.log(error);
          // set_notification(!notification);
          // notify(error, "You have to connect your Metamask Wallet!")
        }
      }
    }
  };

  const load_contract = async (chain, contract_name) => {
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
        `../../../build/deployments/${chain}/${address}.json`
      );
      console.log(contract_artifact);
    } catch (e) {
      console.log(
        `Failed to load contract artifact "../../../build/deployments/${chain}/${address}.json"`
      );
      return undefined;
    }
    console.log("WEB_3# ", web_3);
    return new web_3.eth.Contract(contract_artifact.abi, address);
  };

  const load = async () => {
    const _jamii_factory = await load_contract(chain_id, "JamiiFactory");
    const ballot = await _jamii_factory?.methods.get_ballot(ballot_id).call();
    const candidates = await _jamii_factory?.methods
      .get_candidates(ballot_id)
      .call();
    const account = await get_account();

    dispatch(add_connected_account(account));
    dispatch(add_factory(_jamii_factory));
    dispatch(add_ballot_candidates(candidates));

    console.log("GAGAGAA: ", _jamii_factory);
    console.log("BALLOTELLI: ", ballot);
    console.log("ACCOUNT: ", account);
    console.log("ChAIN_ID: ", chain_id);
    console.log("WEB#: ", web_3);
    console.log("CANDIDATES: : ", candidates);
    return _jamii_factory;
  };

  const cast_vote = async (e) => {
    e.preventDefault();
    await jamii_factory?.methods
      .vote(selected_candidate, ballot_id)
      .send({ from: account, gas: 3000000 })
      .on("receipt", async () => {
        // notification
        set_voted(true);
        console.log("Voter Successfully Voted!!");
      });
  };

  useEffect(() => {
    init();
    load();
  }, []);

  return (
    <>
      {!ballot_candidates ? (
        <>
          <button onClick={() => load()}>Enter Ballot</button>
        </>
      ) : (
        <>
          {!voted ? (
            <form onSubmit={(e) => cast_vote(e)}>
              {ballot_candidates && (
                <>
                  {Object.keys(ballot_candidates)?.map((key) => (
                    <div key={key}>
                      <input
                        type="checkbox"
                        name="candidate"
                        value={ballot_candidates[key]}
                        onChange={handle_box_change}
                      />
                      <label for="candidate">
                        Candidate: {ballot_candidates[key]}
                      </label>
                      <br></br>
                    </div>
                  ))}
                </>
              )}
              <button type="submit">Vote</button>
            </form>
          ) : (
            <>
              <h1>You already cast your vote in this</h1>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Vote;
