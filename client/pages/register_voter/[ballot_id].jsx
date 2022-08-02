import React, { useState, useEffect } from "react";
import { getWeb3 } from "../../utils/getWeb3";
import map from "../../../build/deployments/map.json";

import { useDispatch, useSelector } from "react-redux";
import {
  add_ballot_candidates,
  add_ballot_event,
} from "../../store/ballot_slice";
import {
  login,
  add_factory,
  add_connected_account,
} from "../../store/auth-slice";
import { useRouter } from "next/router";

import CountdownTimer from "../../components/CountdownTimer";

import { ballot_types_map, convert_time_unix } from "../../utils/functions";
import { get_account } from "../../wrapper/wrapper";
import {
  TextField,
  Container,
  Button,
  Chip,
  Typography,
  Box,
  Grid,
} from "@mui/material";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import styles from "../../styles/register_voter.module.css";

const voter_registration = () => {
  const router = useRouter();
  const { ballot_id } = router.query;
  const [account, set_account] = useState("");
  const [ballot, set_ballot] = useState(null);
  const [user_id, set_user_id] = useState(0);
  const [error, set_error] = useState("");
  const [web_3, set_web_3] = useState({});
  const [chain_id, set_chain_id] = useState(0);
  const [voting_link, set_voting_link] = useState(false);

  const dispatch = useDispatch();
  // const ballot_id = useSelector((state) => state.ballot.ballot_ids[0]);

  const factory = useSelector((state) => state.auth.factory);
  const ballot_candidates = useSelector(
    (state) => state.ballot.ballot_candidates
  );

  const user_address = useSelector((state) => state.auth.account);
  const connected_account = useSelector(
    (state) => state.auth.connected_account
  );

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
    const ballot_candidates = await _jamii_factory?.methods
      .get_candidates(ballot_id)
      .call();

    const account = await get_account();

    // set_account(account);
    // set_factory(_jamii_factory);
    set_ballot(ballot);
    dispatch(add_connected_account(account));
    dispatch(add_factory(_jamii_factory));
    dispatch(add_ballot_candidates(ballot_candidates));

    console.log("GAGAGAA: ", _jamii_factory);
    console.log("BALLOTELLI: ", ballot);
    console.log("ACCOUNT: ", account);
    return _jamii_factory;
  };

  const register_new_voter = async (e, _user_id, _ballot_id) => {
    e.preventDefault();
    await factory?.methods
      .register_voter(_user_id, _ballot_id)
      .send({ from: connected_account, gas: 3000000 })
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
    dispatch(add_ballot_event("registration"));
  }, []);

  return (
    <>
      <>
        {!ballot ? (
          <Container maxWidth="sm" sx={{ height: "100vh" }}>
            <small>{error}</small>
            <Typography variant="h3" sx={{ textAlign: "center" }}>
              Ballot Registration
            </Typography>
            <Box sx={{ position: "relative", top: "40%" }}>
              <Chip
                label={ballot_id}
                variant="outlined"
                sx={{
                  padding: "6% 9% 6% 0",
                  position: "relative",
                  left: "2rem",
                  fontSize: "1.2rem",
                }}
                // onClick={handleClick}
              />
              {/* <h4>Ballot {ballot_id}</h4> */}
              <Button
                variant="outlined"
                onClick={() => load()}
                disabled={ballot}
                sx={{
                  borderRadius: "50%",
                  padding: "4% 0",
                }}
              >
                <ArrowForwardIosIcon />
              </Button>
            </Box>
            {/* <button onClick={() => load()} disabled={ballot}>
               Start Registration
             </button> */}
          </Container>
        ) : (
          <>
            {!ballot.expired ? (
              <Container maxWidth="sm" sx={{ height: "100vh" }}>
                <Grid item xs={12} mb={4}>
                  <CountdownTimer
                    target_date={
                      (parseInt(ballot.open_date) +
                        parseInt(ballot.registration_window)) *
                      1000
                    }
                  />
                </Grid>
                <Grid container>
                  <Grid item xs={8} mb={4}>
                    <Typography variant="h5">
                      {ballot.ballot_name}{" "}
                      <Typography variant="caption">{`${ballot_types_map.get(
                        parseInt(ballot.ballot_type)
                      )} Ballot`}</Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Chip
                      label={ballot.ballot_id}
                      sx={{ backgroundColor: status }}
                      // onClick={handleClick}
                    />
                  </Grid>
                </Grid>

                <Grid
                  item
                  mb={4}
                  xs={12}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Typography variant="h5" pr={4}>
                    {" "}
                    Organizer:{" "}
                  </Typography>
                  <Typography variant="body1">{ballot.chair}</Typography>
                </Grid>

                <Grid mb={4} item xs={12}>
                  <div>
                    <Typography variant="h5">Ballot Candidates</Typography>
                  </div>

                  <>
                    {Object.keys(ballot_candidates).map((key) => (
                      <div key={key}>
                        <Typography variant="body1">
                          {ballot_candidates[key]}
                        </Typography>
                      </div>
                    ))}
                  </>
                </Grid>

                <Grid item xs={12}>
                  <form>
                    <TextField
                      id="standard-basic"
                      label="Valid National ID Number"
                      variant="outlined"
                      name="user_id"
                      type="text"
                      value={user_id}
                      onChange={(e) => set_user_id(e.target.value)}
                      InputProps={{
                        className: styles.user_id_input,
                      }}
                      sx={{ height: "13px" }}
                    />
                    <Button
                      variant="contained"
                      onClick={(e) => register_new_voter(e, user_id, ballot_id)}
                      sx={{
                        right: "10px",
                        height: "55px",
                        borderRadius: "0 20px 20px 0",
                      }}
                    >
                      Register
                    </Button>
                  </form>
                </Grid>
                <h1>{user_address}</h1>
                {account === ballot.chair.toLowerCase() && (
                  <Grid item xs={12}>
                    <div>
                      <Typography variant="caption">
                        Registration link:
                      </Typography>{" "}
                    </div>
                    <div className={styles.copy_link}>
                      <input
                        onFocus={(e) => e.target.select()}
                        type="text"
                        className={styles.copy_link_input}
                        value={`register_voter/${ballot_id}`}
                        readonly
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `register_voter/51927f0d-f299-46fa-8336-7742e8b9dbb4`
                          );
                        }}
                        className={styles.copy_link_button}
                      >
                        <span className={styles.material_icons}>
                          <ContentCopyIcon />
                        </span>
                      </button>
                    </div>
                  </Grid>
                )}

                {!voting_link && (
                  <Grid item xs={12}>
                    <div>
                      <Typography variant="caption">Voting Link:</Typography>{" "}
                    </div>
                    <div className={styles.copy_link}>
                      <input
                        onFocus={(e) => e.target.select()}
                        type="text"
                        className={styles.copy_link_input}
                        value={`vote/${ballot_id}`}
                        readonly
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`vote/${ballot_id}`);
                        }}
                        className={styles.copy_link_button}
                      >
                        <span className={styles.material_icons}>
                          <ContentCopyIcon />
                        </span>
                      </button>
                    </div>
                  </Grid>
                )}
              </Container>
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
