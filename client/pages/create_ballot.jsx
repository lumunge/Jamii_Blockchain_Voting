import Head from "next/head";
import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { login, add_connected_account } from "../store/auth-slice";
import {
  add_new_ballot,
  add_ballot,
  add_show_new_ballot,
  add_tab_state,
  add_active_tab,
  add_show_dates,
  add_show_type,
  add_show_form,
  add_ballot_state,
  add_ballot_candidates,
  add_ballot_dates,
  add_ballot_id_chair,
} from "../store/ballot_slice";
import { add_notification } from "../store/notification_slice";

import { v4 as uuid } from "uuid";
import map from "../build/deployments/map.json";

import { getWeb3 } from "../utils/getWeb3";
import {
  convert_time_unix,
  ballot_types_map,
  convert_seconds,
  convert_time,
} from "../utils/functions.js";

import PropTypes from "prop-types";

import {
  Grid,
  Box,
  Tabs,
  Tab,
  Button,
  Typography,
  Divider,
  TextField,
  Modal,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

// icons
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

// Components
import CreatedBallot from "../components/CreatedBallot";
import OpenBallot from "../components/OpenBallot";
import BallotResult from "../components/BallotResult";
import TabPanel from "../components/TabPanel";
import Notification from "../components/Notification";
import NoBallots from "../components/NoBallots";
import MobileNav from "../components/MobileNav";
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from "../components/RightSideBar";

// styleshee
import styles from "../styles/create_ballot.module.css";

const create_ballot = () => {
  const dispatch = useDispatch();

  const initial_ballot_state = useSelector(
    (state) => state.ballot.initial_ballot
  );

  const ballot_fee = 10000000000000000;

  const show_notification = useSelector((state) => state.notification.open);
  const type_notification = useSelector((state) => state.notification.type);
  const message_notification = useSelector(
    (state) => state.notification.message
  );

  const show_dates = useSelector((state) => state.ballot.show_dates);
  const show_type = useSelector((state) => state.ballot.show_type);
  const show_form = useSelector((state) => state.ballot.show_form);
  const ballots = useSelector((state) => state.ballot.ballots);
  const current_theme = useSelector((state) => state.theme.current_theme);

  const show_new_ballot = useSelector((state) => state.ballot.show_new_ballot);

  const active_tab = useSelector((state) => state.ballot.active_tab);

  const [error, set_error] = useState("");

  const [web_3, set_web_3] = useState(null);
  const [accounts, set_accounts] = useState(null);
  const [chain_id, set_chain_id] = useState(0);

  const ballot_text = useSelector((state) => state.ballot.tabs);

  const [type_open, set_type_open] = useState(false);
  const [schedule_open, set_schedule_open] = useState(false);

  const [ballot_candidates, set_ballot_candidates] = useState([]);
  const [factory, set_factory] = useState(null);

  const [start_registration, set_start_registration] = useState("");
  const [end_registration, set_end_registration] = useState("");
  const [start_voting, set_start_voting] = useState("");
  const [end_ballot_1, set_end_ballot_1] = useState("");

  const [candidates, set_candidates] = useState([
    {
      address: "",
    },
  ]);
  const [candidates_arr, set_candidates_arr] = useState([]);

  const open_ballot_type = () => set_type_open(true);
  const close_ballot_type = () => {
    set_type_open(false);
    dispatch(add_show_type(true));
  };
  const open_ballot_schedule = () => set_schedule_open(true);
  const close_ballot_schedule = () => {
    set_schedule_open(false);
  };

  const set_initial_ballot_state = () => {
    dispatch(add_ballot_state(initial_ballot_state));
    dispatch(add_show_dates(false));
    dispatch(add_show_type(false));
    set_candidates([]);
    dispatch(
      add_tab_state({
        tab_1: "Create Ballot",
        tab_2: "Open Ballots",
        tab_3: "End Ballot",
      })
    );
  };

  const handle_ballot_data = (e) => {
    dispatch(
      add_ballot_state({
        ...initial_ballot_state,
        [e.target.name]: e.target.value,
      })
    );
  };

  const handle_new_ballot = async () => {
    dispatch(add_active_tab(0));

    dispatch(add_show_form(true));
    dispatch(add_show_dates(false));
    dispatch(add_show_type(false));

    set_candidates([]);
    dispatch(
      add_tab_state({
        tab_1: "Create Ballot",
        tab_2: "Open Ballots",
        tab_3: "End Ballot",
      })
    );

    dispatch(
      add_new_ballot({
        ballot_name: "",
      })
    );
  };

  const set_ballot_dates = () => {
    let ballot_begin = new Date().getTime();
    let ballot_end = convert_time_unix(end_ballot_1) * 1000;

    let ballot_days = ballot_end - ballot_begin;
    let registration_period =
      convert_time_unix(end_registration) -
      convert_time_unix(start_registration);

    dispatch(
      add_ballot_dates({
        start_registration: start_registration,
        end_registration: end_registration,
        start_voting: start_voting,
        end_voting: end_ballot_1,
        ballot_days: ballot_days,
        registration_period: registration_period,
        open_date: new window.Date(),
      })
    );

    dispatch(add_show_dates(true));

    close_ballot_schedule();
  };

  // candidates input
  const add_candidate = (e) => {
    e.preventDefault();
    set_candidates([
      ...candidates,
      {
        address: "",
      },
    ]);
  };

  const remove_candidate = (e, index) => {
    e.preventDefault();
    const rows = [...candidates];
    rows.splice(index, 1);
    set_candidates(rows);
  };

  const handle_candidates = (index, e) => {
    const { name, value } = e.target;
    const list = [...candidates];
    list[index][name] = value;
    set_candidates(list);
    let candidates_arr = list.map((a) => a.address);
    set_candidates_arr(candidates_arr);
    dispatch(add_ballot_candidates(candidates_arr));
  };
  // end candidates input

  // tabs
  const handle_tab_change = (e, new_value) => {
    dispatch(add_active_tab(new_value));

    if (new_value == 2) {
      set_ballot_candidates(candidates_arr);
    }
  };

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };
  // end tabs

  const init = async () => {
    const web3 = await getWeb3();

    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        const chain_id = parseInt(await web3.eth.getChainId());

        set_web_3(web3);
        set_accounts(accounts);
        set_chain_id(chain_id);
        // set_wallet_color("orange");

        dispatch(login());
        dispatch(add_connected_account(accounts[0]));

        await load_initial_contracts();
        console.log("CONNECTED #1");
      } catch (error) {
        if (error.message == "User rejected the request.") {
          set_error("Connect your Metamask Wallet!");
          dispatch(
            add_notification({
              open: true,
              type: "error",
              message: "You rejected the wallet connection!",
            })
          );
          console.log("ERROR _ 1: ", error);
          console.log("CONNECTED #2");
        } else if (
          error.message ==
          "Request of type 'wallet_requestPermissions' already pending for origin http://localhost:3000. Please wait."
        ) {
          dispatch(
            add_notification({
              open: true,
              type: "info",
              message:
                "Pending connection to Metamask Wallet in browser toolbar!",
            })
          );
          console.log("ERROR _ 2: ", error);
          console.log("CONNECTED #3");
        } else if (error.message == "A request is already in progress") {
          dispatch(
            add_notification({
              open: true,
              type: "error",
              message: "This application requires a Metamask Browser Extension",
            })
          );
        } else {
          // set_error("Connect Metamask Wallet!!");
          dispatch(
            add_notification({
              open: true,
              type: "error",
              message:
                "Please connect your metamask wallet to Goerli/Rinkeby/Kovan testnets",
            })
          );
          console.log("ERROR _ 3: ", error);
          console.log("CONNECTED #4");

          // console.log(error);
          // set_notification(!notification);
          // notify(error, "You have to connect your Metamask Wallet!")
        }
      }
    } else {
      dispatch(
        add_notification({
          open: true,
          type: "error",
          message: "Please use a browser with the Metamask extension!",
        })
      );
    }
  };

  const load_initial_contracts = async () => {
    let _chain_id = 0;
    if (chain_id === 4) {
      // kovan
      _chain_id = 4;
    }
    if (chain_id === 5) {
      // goerli
      _chain_id = 5;
    }
    if (chain_id === 42) {
      // rinkeby
      _chain_id = 42;
    }
    if (chain_id === 1337) {
      // local ganache
      _chain_id = 1337;
    }
    // console.log("_CHAIN_ID:", _chain_id);

    const _jamii_factory = await load_contract(_chain_id, "JamiiFactory");

    if (!_jamii_factory) {
      console.log("FAILED TO GET FACTORY!!");
      return;
    }

    console.log(_jamii_factory);
    console.log("CONNECTED #5");

    set_factory(_jamii_factory);
  };

  const load_contract = async (chain, contract_name) => {
    const web3 = web_3;

    let address;
    try {
      address = map[chain][contract_name][0];
      console.log("CONNECTED #6");
    } catch (e) {
      console.log(
        `Couldn't find any deployed contract "${contract_name}" on the chain "${chain}".`
      );
      console.log("CONNECTED #7");
      return undefined;
    }

    let contract_artifact;
    try {
      contract_artifact = await import(
        `../build/deployments/${chain}/${address}.json`
      );
      console.log(contract_artifact);
      console.log("CONNECTED #8");
    } catch (e) {
      console.log(
        `Failed to load contract artifact "../build/deployments/${chain}/${address}.json"`
      );
      console.log("CONNECTED #9");
      return undefined;
    }
    console.log("WEB_3# ", web_3);
    console.log("CONNECTED #10");
    return new web3.eth.Contract(contract_artifact.abi, address);
  };

  const validate_ballot = (
    ballot_name,
    candidates,
    ballot_type,
    ballot_days,
    registration_period
  ) => {
    // all inputs are required
    // valid ballot name
    // valiid dates
    // valid number of candidates
    // valid format of candidate address
    let bool = true;
    // error handling
    if (ballot_name.length == 0) {
      bool = false;
      dispatch(
        add_notification({
          open: true,
          type: "error",
          message: "Please enter a valid ballot name!",
        })
      );
    }

    if (candidates.length <= 1) {
      bool = false;
      dispatch(
        add_notification({
          open: true,
          type: "error",
          message: "A minimum of two candidates are required for a ballot!",
        })
      );
    }

    if (ballot_type === "") {
      bool = false;
      dispatch(
        add_notification({
          open: true,
          type: "error",
          message: "Please select the ballot type!",
        })
      );
    }

    for (let i = 0; i < candidates.length; i++) {
      if (
        candidates[i].substring(0, 2) !== "0x" ||
        candidates[i].length !== 42
      ) {
        bool = false;
        dispatch(
          add_notification({
            open: true,
            type: "error",
            message: "Wrong candidate address format!",
          })
        );
      }
    }

    if (
      ballot_days.length === 0 ||
      registration_period.length === 0 ||
      Number.isNaN(ballot_days) ||
      Number.isNaN(registration_period) ||
      ballot_days <= 0 ||
      registration_period <= 0 ||
      registration_period >= ballot_days / 1000
    ) {
      bool = false;
      dispatch(
        add_notification({
          open: true,
          type: "error",
          message: "Please enter valid ballot dates!",
        })
      );
    }

    if (convert_seconds(parseInt(ballot_days)) / 1000 === false) {
      bool = false;
      dispatch(
        add_notification({
          open: true,
          type: "error",
          message: "Invalid ballot dates!",
        })
      );
    }

    return bool;
  };

  const create_new_ballot = async (e) => {
    e.preventDefault();

    let ballot_id = uuid();
    let ballot_name = initial_ballot_state.ballot_name;
    let candidates = initial_ballot_state.ballot_candidates;
    let ballot_type = initial_ballot_state.ballot_type;
    let ballot_days = initial_ballot_state.ballot_days;
    let registration_period = initial_ballot_state.registration_period;

    let process_ballot = validate_ballot(
      ballot_name,
      candidates,
      ballot_type,
      ballot_days,
      registration_period
    );

    if (process_ballot === true) {
      try {
        dispatch(
          add_ballot_id_chair({
            ballot_id: ballot_id,
            ballot_chair: accounts[0],
          })
        );
        // validation here
        dispatch(
          add_notification({
            open: true,
            type: "info",
            message: "Publishing Ballot...",
          })
        );
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
            if (ballots.length === 2) {
              dispatch(
                add_notification({
                  open: true,
                  type: "info",
                  message: "Ballot Limit Reached",
                })
              );
            }
          });
        dispatch(
          add_notification({
            open: false,
            type: "",
            message: "",
          })
        );
        dispatch(
          add_tab_state({
            tab_1: `Created Ballot: ${new Date().toString().slice(4, 25)}`,
            tab_2: "Open Ballots",
            tab_3: `Results: ${new Date(end_ballot_1).toDateString()}`,
          })
        );
        dispatch(add_show_new_ballot(true));
        dispatch(
          add_ballot({
            ballot_chair: accounts[0],
            open_date: Date.now(),
            ballot_id: ballot_id,
            ballot_name: ballot_name,
            candidates: candidates,
            ballot_type: ballot_type,
            ballot_days: ballot_days,
            registration_period: registration_period,
          })
        );
        dispatch(add_show_form(false));
      } catch (error) {
        if (error.message.includes("invalid BigNumber string")) {
          validate_ballot(
            ballot_name,
            candidates,
            ballot_type,
            ballot_days,
            registration_period
          );
          dispatch(
            add_notification({
              open: true,
              type: "error",
              message: "Please enter correct ballot details!",
            })
          );
        } else if (
          error.message ===
          "MetaMask Tx Signature: User denied transaction signature."
        ) {
          dispatch(
            add_notification({
              open: true,
              type: "error",
              message: "You have to pay for transaction fees!",
            })
          );
        }
      }
    }
  };

  useEffect(() => {
    init();
  }, [initial_ballot_state.ballot_name]);

  return (
    <div className={styles.wrapper} data-theme={current_theme}>
      <Head>
        <title>Jamii Blockchain Voting</title>
        <meta
          name="description"
          content="A voting system that leverages blockchain technology!"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <MobileNav />
      <Grid container>
        <Grid
          item
          lg={2}
          md={2}
          sm={2}
          sx={{
            display: { xs: "none", sm: "block", md: "block", lg: "block" },
          }}
        >
          <LeftSideBar />
        </Grid>

        <Grid
          item
          lg={10}
          md={10}
          sm={10}
          xs={12}
          sx={{
            height: "100vh",
            marginTop: { xs: "1rem" },
          }}
        >
          <Box>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Grid
                container
                ml={2}
                xs={12}
                sx={{
                  display: "flex",
                }}
              >
                <Tabs
                  value={active_tab}
                  onChange={handle_tab_change}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    padding: "1rem 0",
                  }}
                >
                  <Tab
                    className={styles.tab}
                    label={ballot_text.tab_1}
                    {...a11yProps(0)}
                  />
                  <Tab
                    className={styles.tab}
                    label={ballot_text.tab_2}
                    {...a11yProps(1)}
                  />
                  <Tab
                    className={styles.tab}
                    label={ballot_text.tab_3}
                    {...a11yProps(2)}
                  />
                </Tabs>
              </Grid>
            </Box>

            <Grid
              sx={{
                display: "flex",
              }}
            >
              <Grid
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <TabPanel
                  value={active_tab}
                  index={0}
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "100%" },
                  }}
                >
                  {ballots.length == 0 || show_form === true ? (
                    <Box
                      sx={{
                        padding: "1rem",
                        margin: "0 auto",
                      }}
                    >
                      <Box mb={2}>
                        <Notification
                          open={show_notification}
                          type={type_notification}
                          message={message_notification}
                        />
                      </Box>
                      <form>
                        <Grid xs={12}>
                          <TextField
                            required
                            id="filled-basic"
                            label="ballot name"
                            variant="filled"
                            name="ballot_name"
                            value={initial_ballot_state.ballot_name}
                            onChange={handle_ballot_data}
                            fullWidth
                            InputProps={{
                              className: styles.input,
                            }}
                          />
                        </Grid>
                        {/* _ballot_candidates_addr ->> array */}
                        <Grid
                          container
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: {
                              xs: "column",
                              sm: "column",
                              md: "row",
                              lg: "row",
                            },
                          }}
                        >
                          <div>
                            <Grid
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography variant="caption">
                                Select Ballot Type
                              </Typography>
                              <Button
                                onClick={open_ballot_type}
                                className={styles.right_btns}
                              >
                                Ballot Type
                              </Button>
                              {show_type && (
                                <div>
                                  <Typography variant="captiom" component="p">
                                    {ballot_types_map.get(
                                      parseInt(initial_ballot_state.ballot_type)
                                    )}{" "}
                                  </Typography>
                                </div>
                              )}
                            </Grid>
                            <Modal
                              open={type_open}
                              onClose={close_ballot_type}
                              aria-labelledby="modal-modal-title"
                              aria-describedby="modal-modal-description"
                            >
                              <Box className={styles.ballot_type_box}>
                                <Typography
                                  id="modal-modal-title"
                                  variant="h6"
                                  component="h2"
                                  sx={{
                                    color: "#fff",
                                    textAlign: "center",
                                  }}
                                >
                                  Select a Ballot Type
                                </Typography>
                                <div className={styles.ballot_types}>
                                  <div className={styles.ballot_type}>
                                    <div>
                                      <Typography
                                        variant="button"
                                        className={styles.type_heading}
                                      >
                                        Open Ballot
                                      </Typography>
                                      <Typography
                                        className={styles.type_details}
                                      >
                                        In an open ballot anyone can register
                                        and vote.
                                      </Typography>
                                    </div>
                                    <div>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            type="checkbox"
                                            name="ballot_type"
                                            value="0"
                                            onChange={handle_ballot_data}
                                            sx={{ color: "#fff" }}
                                          />
                                        }
                                        // label="Open Ballot"
                                      />
                                    </div>
                                  </div>
                                  <Divider />
                                  <div className={styles.ballot_type}>
                                    <div>
                                      <Typography
                                        variant="button"
                                        className={styles.type_heading}
                                      >
                                        Closed Ballot
                                      </Typography>
                                      <Typography
                                        className={styles.type_details}
                                      >
                                        In a closed ballot, anyone can register
                                        although voters need voting rights to
                                        vote.
                                      </Typography>
                                    </div>
                                    <div>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            type="checkbox"
                                            name="ballot_type"
                                            value="1"
                                            onChange={handle_ballot_data}
                                            sx={{ color: "#fff" }}
                                          />
                                        }
                                        // label="Closed Ballot"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </Box>
                            </Modal>
                          </div>
                          <div>
                            <Grid
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography variant="caption">
                                Select Ballot Dates
                              </Typography>
                              <Button
                                onClick={open_ballot_schedule}
                                className={styles.right_btns}
                              >
                                Schedule Ballot
                              </Button>
                              {show_dates && (
                                <div>
                                  {convert_seconds(
                                    parseInt(initial_ballot_state.ballot_days) /
                                      1000
                                  ) === false ? (
                                    <Typography
                                      variant="captiom"
                                      component="p"
                                      align="center"
                                      sx={{ color: "red" }}
                                    >
                                      Invalid Ballot Dates
                                    </Typography>
                                  ) : (
                                    <Typography variant="captiom" component="p">
                                      Ballot - Period:{" "}
                                      {convert_seconds(
                                        parseInt(
                                          initial_ballot_state.ballot_days
                                        ) / 1000
                                      )}{" "}
                                    </Typography>
                                  )}

                                  {convert_seconds(
                                    initial_ballot_state.registration_period
                                  ) === false ? (
                                    <Typography
                                      variant="captiom"
                                      align="center"
                                      sx={{ color: "red" }}
                                      component="p"
                                    >
                                      Invalid Registration Dates
                                    </Typography>
                                  ) : (
                                    <Typography variant="captiom" component="p">
                                      Registration - Period:{" "}
                                      {convert_seconds(
                                        initial_ballot_state.registration_period
                                      )}{" "}
                                    </Typography>
                                  )}
                                </div>
                              )}
                            </Grid>
                            <Modal
                              open={schedule_open}
                              onClose={close_ballot_schedule}
                              aria-labelledby="modal-modal-title"
                              aria-describedby="modal-modal-description"
                            >
                              <div className={styles.ballot_dates}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#fff",
                                    textAlign: "center",
                                    marginBottom: "10px",
                                  }}
                                >
                                  Major Ballot Dates
                                </Typography>
                                <div className={styles.date}>
                                  <TextField
                                    // label="Start Voter Registration"
                                    type="datetime-local"
                                    defaultValue={convert_time(
                                      Date.now() / 1000
                                    )}
                                    // className={styles.date_field}
                                    name="start_registration"
                                    // value={start_registration}
                                    onChange={(e) =>
                                      set_start_registration(e.target.value)
                                    }
                                    label="Start Registration"
                                    InputLabelProps={{
                                      style: {
                                        color: "#fff",
                                      },
                                    }}
                                  />
                                </div>
                                <div className={styles.date}>
                                  <TextField
                                    // label="End Voter Registration"
                                    type="datetime-local"
                                    className={styles.date_field}
                                    name="end_registration"
                                    // value={end_registration}
                                    onChange={(e) =>
                                      set_end_registration(e.target.value)
                                    }
                                    label="End Registration"
                                    InputLabelProps={{
                                      style: {
                                        color: "#fff",
                                      },
                                    }}
                                  />
                                </div>
                                <div className={styles.date}>
                                  <TextField
                                    // label="End Voter Registration"
                                    type="datetime-local"
                                    className={styles.date_field}
                                    name="start_voting"
                                    // value={start_voting}
                                    onChange={(e) =>
                                      set_start_voting(e.target.value)
                                    }
                                    label="Start Voting"
                                    InputLabelProps={{
                                      style: {
                                        color: "#fff",
                                      },
                                    }}
                                  />
                                </div>
                                <div className={styles.date}>
                                  <TextField
                                    // label="Ballot End Date"
                                    type="datetime-local"
                                    className={styles.date_field}
                                    name="end_ballot"
                                    // value={end_ballot}
                                    onChange={(e) =>
                                      set_end_ballot_1(e.target.value)
                                    }
                                    label="End Voting"
                                    InputLabelProps={{
                                      style: {
                                        color: "#fff",
                                      },
                                    }}
                                  />
                                </div>
                                <Button onClick={() => set_ballot_dates()}>
                                  Set Dates
                                </Button>
                              </div>
                            </Modal>
                          </div>
                        </Grid>
                        {/* new candidates */}
                        <div>
                          <Typography variant="caption">
                            Select more than 1 Candidate
                          </Typography>
                          {candidates.map((data, index) => {
                            const { address } = data;

                            return (
                              <div className={styles.add_candidate}>
                                <TextField
                                  // helperText="Select more than 1 Candidate"
                                  required
                                  key={index}
                                  label="candidate address 0x..."
                                  variant="filled"
                                  type="text"
                                  onChange={(e) => handle_candidates(index, e)}
                                  value={address}
                                  name="address"
                                  fullWidth
                                  className={styles.candidate_field}
                                  InputProps={{
                                    className: styles.input,
                                  }}
                                />

                                <div>
                                  {candidates.length !== 1 && (
                                    <Button
                                      onClick={(e) => remove_candidate(e)}
                                    >
                                      <DeleteOutlineOutlinedIcon />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          <div>
                            <Button
                              onClick={(e) => add_candidate(e)}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              className={styles.right_btns}
                            >
                              <>
                                <PersonAddAltOutlinedIcon />
                              </>
                              <>
                                <Typography
                                  variant="caption"
                                  pt={1}
                                  pl={1}
                                  sx={{ fontSize: "10px" }}
                                >
                                  new candidate
                                </Typography>
                              </>
                            </Button>
                          </div>
                        </div>
                        {/* end new candidates */}
                        <Grid
                          xs={12}
                          mt={1}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button
                            type="submit"
                            className={styles.right_btns}
                            disabled={
                              !factory ||
                              ballots.length === 3 ||
                              show_notification
                            }
                            onClick={(e) => create_new_ballot(e)}
                          >
                            Create Ballot
                          </Button>
                          <Button
                            className={styles.right_btns}
                            onClick={() => set_initial_ballot_state()}
                          >
                            Reset Form
                          </Button>
                        </Grid>
                      </form>
                    </Box>
                  ) : (
                    <>
                      <CreatedBallot />
                    </>
                  )}
                </TabPanel>
                <TabPanel value={active_tab} index={1}>
                  {ballots.length >= 1 ? <OpenBallot /> : <NoBallots />}
                </TabPanel>
                <TabPanel value={active_tab} index={2}>
                  {ballots.length >= 1 ? <BallotResult /> : <NoBallots />}
                </TabPanel>
              </Grid>
              <>
                {show_new_ballot && (
                  <Button
                    onClick={handle_new_ballot}
                    sx={{
                      position: "absolute",
                      top: "120px",
                      left: 0,
                      right: 0,
                      marginLeft: "auto",
                      marginRight: "auto",
                      textAlign: "center",
                      width: "50px",
                    }}
                  >
                    <AddCircleOutlineOutlinedIcon />
                  </Button>
                )}
              </>

              <Grid
                item
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                    md: "block",
                    lg: "block",
                  },
                }}
              >
                <RightSideBar />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default create_ballot;
