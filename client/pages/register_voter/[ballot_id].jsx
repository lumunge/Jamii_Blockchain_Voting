import React, { useState, useEffect } from "react";
import { getWeb3 } from "../../utils/getWeb3";
import map from "../../../build/deployments/map.json";

import { useDispatch, useSelector } from "react-redux";
// import { wrapper } from "../../store/store";
import { login, add_factory } from "../../store/auth-slice";
import { useRouter } from "next/router";

import { url_format, url_format_reg } from "../../utils/functions";
import { get_account } from "../../wrapper/wrapper";
import { TextField } from "@mui/material";

const voter_registration = () => {
  const router = useRouter();
  const { ballot_id } = router.query;
  const [account, set_account] = useState("");
  const [ballot, set_ballot] = useState(null);
  const [user_id, set_user_id] = useState(0);
  const [unique_voter_id, set_unique_voter_id] = useState("");
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState("");
  const [web_3, set_web_3] = useState({});
  const [chain_id, set_chain_id] = useState(0);
  // const [factory, set_factory] = useState({});
  const [voting_link, set_voting_link] = useState(false);

  const dispatch = useDispatch();
  // const ballot_id = useSelector((state) => state.ballot.ballot_ids[0]);

  const factory = useSelector((state) => state.auth.factory);

  const is_connected = useSelector((state) => state.auth.is_connected);
  const user_address = useSelector((state) => state.auth.account);

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
    const web3 = web_3;

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
    console.log("WEB_3# ", web3);
    return new web3.eth.Contract(contract_artifact.abi, address);
  };

  const load = async () => {
    const _jamii_factory = await load_contract(chain_id, "JamiiFactory");
    const ballot = await _jamii_factory?.methods.get_ballot(ballot_id).call();
    const account = await get_account();

    set_account(account);
    // set_factory(_jamii_factory);
    set_ballot(ballot);

    dispatch(add_factory(_jamii_factory));

    console.log("GAGAGAA: ", _jamii_factory);
    console.log("BALLOTELLI: ", ballot);
    console.log("ACCOUNT: ", account);
    return _jamii_factory;
  };

  const register_new_voter = async (e, _user_id, _ballot_id) => {
    e.preventDefault();
    await factory?.methods
      .register_voter(_user_id, _ballot_id)
      .send({ from: account, gas: 3000000 })
      .on("receipt", async () => {
        // notification
        set_voting_link(true);
        console.log("Voter Registered Successfully!!");
      });
  };

  const test = () => {
    console.log(factory);
  };

  useEffect(() => {
    init();
    load();
  }, []);

  return (
    <>
      <>
        {!ballot ? (
          <>
            <small>{error}</small>
            <h4>Ballot {ballot_id}</h4>
            <button onClick={() => load()} disabled={ballot}>
              Start Registration
            </button>
          </>
        ) : (
          <>
            {!ballot.expired ? (
              <>
                <h4>Name: {ballot.ballot_name}</h4>
                <h4>Type: {ballot.ballot_type}</h4>
                <h4>Chair: {ballot.chair}</h4>
                <h4>
                  Days Remaining Till Registration Ends:{" "}
                  {ballot.registration_window}
                </h4>
                <form>
                  <TextField
                    id="standard-basic"
                    label="Valid National ID Number"
                    variant="standard"
                    name="user_id"
                    type="text"
                    value={user_id}
                    onChange={(e) => set_user_id(e.target.value)}
                  />
                  <button
                    type="submit"
                    onClick={(e) => register_new_voter(e, user_id, ballot_id)}
                  >
                    Register
                  </button>
                </form>
                <h1>{user_address}</h1>
                {account === ballot.chair.toLowerCase() && (
                  <p>
                    Copy & Share Link{" "}
                    <em>
                      <b>
                        <a
                          href={url_format(router.pathname, ballot_id)}
                          target="_blank"
                        >
                          {url_format(router.pathname, ballot_id)}
                        </a>
                      </b>
                    </em>
                  </p>
                )}

                {voting_link && (
                  <p>
                    Voting Link{" "}
                    <em>
                      <b>
                        <a
                          href={url_format_reg(router.pathname, ballot_id)}
                          target="_blank"
                        >
                          {url_format_reg(router.pathname, ballot_id)}
                        </a>
                      </b>
                    </em>
                  </p>
                )}
              </>
            ) : (
              <>
                <h4>Registration Closed!</h4>
                <h5>{ballot.voters_count} Peopls Voted.</h5>
              </>
            )}
          </>
        )}
      </>
    </>
  );
};

// export const getServerSideProps = wrapper.getServerSideProps(
// (store) => async () => {
//     const { ballot_id } = router.query;
//     // const get_ballot_details = async () => {
//     const new_ballot = await get_ballot(ballot_id);
//     // set_ballot(new_ballot);
//     console.log("NEW BALLOT", new_ballot);
//     // };
//     store.dispatch(add_ballot(new_ballot));
//     // store.dispatch(add_contract(contract));
//     // store.dispatch(increment());
// }
// );
export default voter_registration;
