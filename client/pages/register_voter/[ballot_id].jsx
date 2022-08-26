import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { getWeb3 } from "../../utils/getWeb3";
import map from "../../build/deployments/map.json";

import { useDispatch, useSelector } from "react-redux";
import {
  add_ballot,
  add_ballot_candidates,
  add_ballot_event,
} from "../../store/ballot_slice";
import { add_voter_registered } from "../../store/voter_slice";
import {
  login,
  add_factory,
  add_connected_account,
} from "../../store/auth-slice";
import { add_notification } from "../../store/notification_slice";

import { ballot_types_map } from "../../utils/functions";
import { get_account } from "../../wrapper/wrapper";
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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

// compoenents
import CountdownTimer from "../../components/CountdownTimer";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Notification from "../../components/Notification";

// stylesheet
import styles from "../../styles/register_voter.module.css";

const voter_registration = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { ballot_id } = router.query;

  let date_now = new Date().getTime();
  const account = useSelector((state) => state.auth.connected_account);
  const ballot = useSelector((state) => state.ballot.ballot);
  const current_theme = useSelector((state) => state.theme.current_theme);

  const show_notification = useSelector((state) => state.notification.open);

  const [disabled, set_disabled] = useState(false);

  const [user_id, set_user_id] = useState(0);
  const [error, set_error] = useState("");
  const [web_3, set_web_3] = useState({});
  const [chain_id, set_chain_id] = useState(0);
  const [copied, set_copied] = useState(false);
  const [copied_1, set_copied_1] = useState(false);

  const domain =
    process.env.NODE_ENV !== "production"
      ? "http://localhost:3000/"
      : "https://jamii-ballots.vercel.app/";

  const factory = useSelector((state) => state.auth.factory);
  const ballot_candidates = useSelector(
    (state) => state.ballot.ballot_candidates
  );

  const user_address = useSelector((state) => state.auth.account);
  const connected_account = useSelector(
    (state) => state.auth.connected_account
  );

  const registered = useSelector((state) => state.voter.registered);

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
        if (chain_id === 5) {
          // goerli
          _chain_id = 5;
        }
        if (chain_id === 1337) {
          _chain_id = 1337;
        }
        set_chain_id(_chain_id);
        console.log(_chain_id);
      } catch (error) {
        if (error.message == "User rejected the request.") {
          set_error("Connect your Metamask Wallet!");
        } else {
          set_error("Connect your Metamask Wallet!");
          console.log(error);
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
        `../../build/deployments/${chain}/${address}.json`
      );
      console.log(contract_artifact);
    } catch (e) {
      console.log(
        `Failed to load contract artifact "../../build/deployments/${chain}/${address}.json"`
      );
      return undefined;
    }
    console.log("WEB_3# ", web3);
    return new web3.eth.Contract(contract_artifact.abi, address);
  };

  const load = async () => {
    try {
      const _jamii_factory = await load_contract(chain_id, "JamiiFactory");
      const ballot = await _jamii_factory?.methods.get_ballot(ballot_id).call();
      const ballot_candidates = await _jamii_factory?.methods
        .get_candidates(ballot_id)
        .call();

      const account = await get_account();

      dispatch(add_ballot(ballot));
      dispatch(add_connected_account(account));
      dispatch(add_factory(_jamii_factory));
      dispatch(add_ballot_candidates(ballot_candidates));

      console.log("FACTORY: ", _jamii_factory);
      console.log("BALLOT: ", ballot);
      console.log("ACCOUNT: ", account);
      console.log("CANDIDATES: ", ballot_candidates);
      return _jamii_factory;
    } catch (error) {
      // console.log("STARTING ERROR: ", error);
      // console.log("FACTORY: ", _jamii_factory);
      console.log("BALLOT: ", ballot);
      console.log("ACCOUNT: ", account);
      console.log("CANDIDATES: ", ballot_candidates);
    }
  };

  const register_new_voter = async (e, _user_id, _ballot_id) => {
    e.preventDefault();

    try {
      dispatch(
        add_notification({
          open: true,
          type: "info",
          message: "Processing Registration...",
        })
      );
      set_disabled(true);
      await factory?.methods
        .register_voter(_user_id, _ballot_id)
        .send({ from: connected_account, gas: 3000000 })
        .on("receipt", async () => {
          dispatch(add_voter_registered(true));
          dispatch(
            add_notification({
              open: true,
              type: "success",
              message: "Registered Successfully!",
            })
          );
        });
    } catch (error) {
      add_notification({
        open: true,
        type: "error",
        message: "Failed to process your Registration!",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    init();
    load();
    dispatch(add_ballot_event("registration"));
  }, []);

  return (
    <div className={styles.container} data-theme={current_theme}>
      <Navbar />
      <>
        {!ballot ? (
          <Container
            maxWidth="sm"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: { xs: "100vh" },
            }}
          >
            <Typography variant="caption" sx={{ color: "red" }}>
              {error}
            </Typography>

            <Grid container justifyContent="center" alignItems="center" mt={10}>
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
                Ballot Registration
              </Typography>
              <Typography variant="body1">{ballot_id}</Typography>

              <Image
                src="/register_2_nobg.png"
                alt="register_image"
                width={500}
                height={500}
              />

              <Button
                className={styles.right_btns}
                onClick={() => load()}
                disabled={ballot}
              >
                Proceed to Registration
              </Button>
            </Grid>
          </Container>
        ) : (
          <>
            {!ballot.expired ? (
              <Container
                maxWidth="sm"
                sx={{ minHeight: "100vh", marginTop: "5rem" }}
              >
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
                      // sx={{ backgroundColor: status }}
                      // onClick={handleClick}
                    />
                  </Grid>
                </Grid>

                <Grid
                  item
                  mb={4}
                  xs={12}
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      sm: "column",
                      md: "column",
                      lg: "row",
                    },
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" pr={4}>
                    {" "}
                    Organizer:{" "}
                  </Typography>
                  <Typography variant="body1">{ballot.chair}</Typography>
                </Grid>

                <Grid container justifyContent="center" mb={4} item xs={12}>
                  <div>
                    <Typography variant="h5">Ballot Candidates</Typography>
                  </div>

                  <>
                    {Object.keys(ballot_candidates).map((key) => (
                      <div key={key}>
                        <Typography variant="body1" mb={2} mt={2}>
                          {ballot_candidates[key]}
                        </Typography>
                        <Divider />
                      </div>
                    ))}
                  </>
                </Grid>

                <Grid
                  container
                  item
                  xs={12}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <Box mb={2} mt={2}>
                    {show_notification && <Notification />}
                  </Box>
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
                    disabled={
                      registered ||
                      date_now >
                        (parseInt(ballot.open_date) +
                          parseInt(ballot.registration_window)) *
                          1000
                    }
                  />
                  <br />
                  <br />
                  <br />
                  <Button
                    className={styles.right_btns}
                    onClick={(e) => register_new_voter(e, user_id, ballot_id)}
                    sx={{ width: "40%", margin: "0 auto" }}
                    disabled={disabled}
                  >
                    Register
                  </Button>
                </Grid>
                <h1>{user_address}</h1>
                {account.toLowerCase() === ballot.chair?.toLowerCase() && (
                  <Grid container justifyContent="center" item xs={12}>
                    <Grid item xs={12} textAlign="center">
                      <Typography variant="caption">
                        Registration link:
                      </Typography>{" "}
                    </Grid>
                    <Grid xs={12} className={styles.copy_link}>
                      <input
                        onFocus={(e) => e.target.select()}
                        type="text"
                        className={styles.copy_link_input}
                        value={`${domain}register_voter/${ballot_id}`}
                        readonly
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${domain}register_voter/${ballot_id}`
                          );
                          set_copied(true);
                        }}
                        className={styles.copy_link_button}
                      >
                        {!copied ? (
                          <span className={styles.material_icons}>
                            <ContentCopyIcon />
                          </span>
                        ) : (
                          <span className={styles.material_icons}>
                            <CheckCircleOutlinedIcon className={styles.check} />
                          </span>
                        )}
                      </button>
                    </Grid>
                  </Grid>
                )}

                {registered && (
                  <Grid container item xs={12} justifyContent="center">
                    <Grid container item justifyContent="center" xs={12}>
                      <Typography variant="caption">Voting Link:</Typography>{" "}
                    </Grid>
                    <Grid
                      container
                      item
                      justifyContent="center"
                      xs={12}
                      className={styles.copy_link}
                    >
                      <input
                        onFocus={(e) => e.target.select()}
                        type="text"
                        className={styles.copy_link_input}
                        value={`${domain}vote/${ballot_id}`}
                        readonly
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${domain}vote/${ballot_id}`
                          );
                          set_copied_1(true);
                        }}
                        className={styles.copy_link_button}
                      >
                        {!copied_1 ? (
                          <span className={styles.material_icons}>
                            <ContentCopyIcon />
                          </span>
                        ) : (
                          <span className={styles.material_icons}>
                            <CheckCircleOutlinedIcon className={styles.check} />
                          </span>
                        )}
                      </button>
                    </Grid>
                  </Grid>
                )}
              </Container>
            ) : (
              <>
                <h4>Registration Closed!</h4>
                <h5>{ballot.voters_count} People Voted.</h5>
              </>
            )}
          </>
        )}
      </>
      <Footer />
    </div>
  );
};

export default voter_registration;
