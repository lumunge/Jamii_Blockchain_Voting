import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { getWeb3 } from "../../utils/getWeb3";
import { get_account } from "../../wrapper/wrapper";

import { useDispatch, useSelector } from "react-redux";
import { add_voted_voted } from "../../store/voter_slice";
import { add_notification } from "../../store/notification_slice";
import {
  add_ballot,
  add_ballot_candidates,
  add_ballot_event,
} from "../../store/ballot_slice";
import {
  login,
  add_connected_account,
  add_chain_id,
  add_web_3,
  add_factory,
} from "../../store/auth-slice";

import { ballot_types_map } from "../../utils/functions";
import map from "../../build/deployments/map.json";

import {
  TextField,
  Container,
  Button,
  Chip,
  Typography,
  Box,
  Grid,
  Divider,
} from "@mui/material";

// icons

// components
import CountdownTimer from "../../components/CountdownTimer";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Notification from "../../components/Notification";

// stylesheet
import styles from "../../styles/vote.module.css";

const Vote = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [error, set_error] = useState("");

  const show_notification = useSelector((state) => state.notification.open);

  const { ballot_id } = router.query;
  const [selected_candidate, set_selected_candidate] = useState("");

  const [chain_id, set_chain_id] = useState(0);
  const [web_3, set_web_3] = useState({});
  // const [voted, set_voted] = useState(false);

  // const chain_id = useSelector((state) => state.auth.chain_id);
  const jamii_factory = useSelector((state) => state.auth.factory);
  const account = useSelector((state) => state.auth.connected_account);

  const ballot = useSelector((state) => state.ballot.ballots[2]);

  const current_theme = useSelector((state) => state.theme.current_theme);

  const ballot_candidates = useSelector(
    (state) => state.ballot.ballot_candidates
  );

  const voted = useSelector((state) => state.voter.voted);

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
        if (chain_id === 5) {
          // goerli
          _chain_id = 5;
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
        `../../build/deployments/${chain}/${address}.json`
      );
      console.log(contract_artifact);
    } catch (e) {
      console.log(
        `Failed to load contract artifact "../../build/deployments/${chain}/${address}.json"`
      );
      return undefined;
    }
    console.log("WEB_3# ", web_3);
    return new web_3.eth.Contract(contract_artifact.abi, address);
  };

  const load = async () => {
    const jamii_factory = await load_contract(chain_id, "JamiiFactory");
    const ballot = await jamii_factory?.methods.get_ballot(ballot_id).call();
    const candidates = await jamii_factory?.methods
      .get_candidates(ballot_id)
      .call();
    const account = await get_account();

    dispatch(add_factory(jamii_factory));
    dispatch(add_ballot(ballot));
    dispatch(add_connected_account(account));
    dispatch(add_ballot_candidates(candidates));

    console.log("FACTORY: ", jamii_factory);
    console.log("BALLOT: ", ballot);
    console.log("ACCOUNT: ", account);
    console.log("ChAIN_ID: ", chain_id);
    console.log("WEB#: ", web_3);
    console.log("CANDIDATES: : ", candidates);
    return jamii_factory;
  };

  const cast_vote = async (e) => {
    e.preventDefault();
    try {
      dispatch(
        add_notification({
          open: true,
          type: "success",
          message: "Processing Vote!",
        })
      );
      await jamii_factory?.methods
        .vote(selected_candidate, ballot_id)
        .send({ from: account, gas: 3000000 })
        .on("receipt", async () => {
          // notification
          dispatch(add_voted_voted(true));
          dispatch(
            add_notification({
              open: true,
              type: "success",
              message: "You Voted Successfully!",
            })
          );
          console.log("Voter Successfully Voted!!");
        });
    } catch (error) {
      dispatch(
        add_notification({
          open: true,
          type: "error",
          message: "Failed to process your Vote!",
        })
      );
      console.log(error);
    }
  };

  useEffect(() => {
    init();
    load();
    dispatch(add_ballot_event("voting"));
  }, []);

  return (
    <div className={styles.container} data-theme={current_theme}>
      <Navbar />

      <>
        <Container maxWidth="sm" sx={{ height: "100vh", marginTop: "5rem" }}>
          {!ballot_candidates ? (
            <Container
              maxWidth="sm"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="caption" sx={{ color: "red" }}>
                {error}
              </Typography>

              <Grid item xs={12} textAlign="center">
                <Chip
                  label="jamii ballots"
                  variant="outlined"
                  className={styles.chip_text}
                />
              </Grid>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: { xs: "2rem", sm: "3rem", md: "3rem", lg: "3rem" },
                }}
              >
                Ballot Voting
              </Typography>
              <Typography variant="body1">{ballot_id}</Typography>

              <Image
                src="/vote_nobg.png"
                alt="vote_image"
                width={500}
                height={500}
              />

              <Button
                className={styles.right_btns}
                onClick={() => load()}
                disabled={jamii_factory}
              >
                Proceed to Voting
              </Button>
            </Container>
          ) : (
            <>
              {!voted ? (
                <>
                  <form onSubmit={(e) => cast_vote(e)}>
                    {ballot && (
                      <>
                        <Grid item xs={12} mb={4}>
                          <CountdownTimer
                            target_date={
                              (parseInt(ballot.open_date) +
                                parseInt(ballot._days) / 1000) *
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
                          <Typography variant="body1">
                            {ballot.chair}
                          </Typography>
                        </Grid>

                        <Grid container>
                          <Box mt={2} mb={2}>
                            {show_notification && <Notification />}
                          </Box>
                          <Grid item xs={12}>
                            <Typography variant="h5">
                              Tick a Single Checkbox
                            </Typography>
                          </Grid>
                          <Grid item xs={12} mb={4}>
                            {Object.keys(ballot_candidates)?.map((key) => (
                              <>
                                <Grid
                                  container
                                  key={key}
                                  pt={2}
                                  pb={2}
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    textAlign: "center",
                                  }}
                                >
                                  <Grid item xs={9}>
                                    <label for="candidate">
                                      <Typography variant="body1">
                                        {ballot_candidates[key]}
                                      </Typography>
                                    </label>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <input
                                      type="checkbox"
                                      name="candidate"
                                      value={ballot_candidates[key]}
                                      onChange={handle_box_change}
                                      className={styles.check_box}
                                      disabled={voted}
                                    />
                                  </Grid>
                                  <br></br>
                                </Grid>
                                <Divider />
                              </>
                            ))}
                          </Grid>
                        </Grid>
                      </>
                    )}
                    <Grid
                      item
                      xs={12}
                      mb={4}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        variant="contained"
                        type="submit"
                        className={styles.right_btns}
                        disabled={selected_candidate.length == 0}
                      >
                        Vote
                      </Button>
                    </Grid>
                  </form>
                  {ballot && (
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Typography>Voters: {ballot.voters_count} </Typography>
                    </Grid>
                  )}
                </>
              ) : (
                <Grid container>
                  <Image
                    src="/voted_nobg.png"
                    alt="voted_image"
                    width={500}
                    height={500}
                  />
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "2rem",
                        sm: "3rem",
                        md: "3rem",
                        lg: "3rem",
                      },
                    }}
                  >
                    Your Vote was Cast Successfully!.
                  </Typography>
                  <Button className={styles.right_btns}>Back Home</Button>
                </Grid>
              )}
            </>
          )}
        </Container>
      </>
      <Footer />
    </div>
  );
};

export default Vote;
