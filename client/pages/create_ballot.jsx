import Head from "next/head";
// import Link from "next/link";
// import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/auth-slice";
import { add_ballot } from "../store/ballot_slice";

import { v4 as uuid } from "uuid";
import map from "../../build/deployments/map.json";
import { getWeb3 } from "../utils/getWeb3";
import {
  convert_time,
  convert_time_unix,
  ballot_types_map,
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
  Paper,
  Modal,
  Checkbox,
  FormControlLabel,
  Chip,
} from "@mui/material";
// import Notification from "../components/Notification";
import TabPanel from "../components/TabPanel";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CachedIcon from "@mui/icons-material/Cached";
import styles from "../styles/create_ballot.module.css";

const create_ballot = () => {
  // const router = useRouter();
  const dispatch = useDispatch();

  const connected = useSelector((state) => state.auth.is_connected);

  const initial_ballot_state = {
    ballot_type: "",
    ballot_name: "",
    ballot_chair: "",
    ballot_candidates: [],
    ballot_days: "",
    registration_period: "",
  };

  const ballot_fee = 10000000000000000;

  let ballot_dates = [];

  const [value, set_value] = useState(0);
  const [error, set_error] = useState("");
  const [wallet_color, set_wallet_color] = useState("red");

  const [web_3, set_web_3] = useState(null);
  const [accounts, set_accounts] = useState(null);
  const [chain_id, set_chain_id] = useState(0);

  const [create_ballot, set_create_ballot] = useState("Create Ballot");
  const [end_ballot, set_end_ballot] = useState("End Ballot");

  const [type_open, set_type_open] = useState(false);
  const [schedule_open, set_schedule_open] = useState(false);
  const [ballot_id, set_ballot_id] = useState("");
  const [ballot, set_ballot] = useState(initial_ballot_state);
  const [initial_ballot, set_initial_ballot] = useState(initial_ballot_state);
  const [ballot_candidates, set_ballot_candidates] = useState([]);
  const [factory, set_factory] = useState(null);
  const [registration_link, set_registration_link] = useState("");

  const [start_registration, set_start_registration] = useState("");
  const [end_registration, set_end_registration] = useState("");
  const [start_voting, set_start_voting] = useState("");

  const [candidates, set_candidates] = useState([
    {
      address: "",
    },
  ]);
  const [candidates_arr, set_candidates_arr] = useState([]);

  const open_ballot_type = () => set_type_open(true);
  const close_ballot_type = () => set_type_open(false);
  const open_ballot_schedule = () => set_schedule_open(true);
  const close_ballot_schedule = () => set_schedule_open(false);

  const set_initial_ballot_state = () => {
    set_ballot(initial_ballot_state);
    set_initial_ballot(initial_ballot_state);
  };

  const handle_ballot_data = (e) => {
    const data = e.target.value;
    set_ballot({
      ...ballot,
      [e.target.name]: data,
    });
    set_initial_ballot({
      ...initial_ballot,
      [e.target.name]: data,
    });
  };

  const handle_ballot_dates = (e) => {
    ballot_dates.push(e.target.value);
  };

  const set_ballot_dates = () => {
    console.log("BALLOT DATES: ", ballot_dates);

    let ballot_begin = convert_time_unix(
      new Date().toISOString().split("T")[0]
    );
    let ballot_end = convert_time_unix(ballot_dates[3]);
    let ballot_days = (ballot_end - ballot_begin) / 86400;

    let registration_period =
      (convert_time_unix(ballot_dates[1]) -
        convert_time_unix(ballot_dates[0])) /
      86400;

    console.log("Ballot Days: ", ballot_days);
    console.log("Registration Window: ", registration_period);

    initial_ballot.ballot_days = ballot_days;
    initial_ballot.registration_period = registration_period;
    ballot.ballot_days = ballot_days;
    ballot.registration_period = registration_period;

    set_start_registration(ballot_dates[0]);
    set_end_registration(ballot_dates[1]);
    set_start_voting(ballot_dates[2]);
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
    console.log("CANDIDATES LIST: ", candidates_arr);
    initial_ballot.ballot_candidates = candidates_arr;
    ballot.ballot_candidates = candidates_arr;
  };
  // end candidates input

  // tabs
  const handle_tab_change = async (e, new_value) => {
    set_value(new_value);

    if (new_value == 2) {
      set_ballot_candidates(candidates_arr);
    }

    console.log("BALLOT CANDIDATES: ", ballot_candidates);
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

        console.log("GOTTEN CHAIN ID: ", chain_id);

        set_web_3(web3);
        set_accounts(accounts);
        set_chain_id(chain_id);
        set_wallet_color("orange");

        dispatch(login());

        await load_initial_contracts();
      } catch (error) {
        if (error.message == "User rejected the request.") {
          set_error("Connect your Metamask Wallet!");
          // set_notification(!notification);
        } else {
          // set_error("Connect Metamask Wallet!!");
          console.log(error);
          // set_notification(!notification);
          // notify(error, "You have to connect your Metamask Wallet!")
        }
      }
    }
  };

  const load_initial_contracts = async () => {
    // <=42 to exclude Kovan, <42 to include kovan
    // if (chain_id < 42) {
    //   // Wrong Network!
    //   return;
    // }
    // console.log("CHAIN_ID:", chain_id);

    let _chain_id = 0;
    if (chain_id === 42) {
      _chain_id = 42;
    }
    if (chain_id === 1337) {
      _chain_id = 1337;
    }
    console.log("_CHAIN_ID:", _chain_id);

    const _jamii_factory = await load_contract(_chain_id, "JamiiFactory");

    if (!_jamii_factory) {
      console.log("FAILED TO GET FACTORY!!");
      return;
    }

    console.log(_jamii_factory);

    set_factory(_jamii_factory);
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
    console.log("WEB_3# ", web_3);
    if (web_3 !== null) {
      set_wallet_color("green");
    }
    return new web3.eth.Contract(contract_artifact.abi, address);
  };

  const create_new_ballot = async (e) => {
    e.preventDefault();
    let ballot_id = uuid();
    let ballot_name = ballot.ballot_name;
    let candidates = ballot.ballot_candidates;
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
        set_ballot_id(ballot_id);
        set_create_ballot(
          `Created Ballot: ${new Date().toString().slice(4, 25)}`
        );
        set_end_ballot(
          `Results: ${convert_time(
            new Date().getTime() / 1000 + ballot_days * 86400
          )}`
        );

        dispatch(add_ballot(ballot));

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

  const get_ballot = async (e) => {
    init();
    e.preventDefault();
    const ballot = await factory.methods.get_ballot(ballot_id).call();
    set_ballot(ballot);
    console.log("BALLOT ID:", ballot_id);
    console.log("THE BALLOT HERE: ", ballot);
  };

  useEffect(() => {
    init();
  }, [ballot.ballot_name]);

  return (
    <>
      <div className={styles.wrapper}>
        <Head>
          <title>Jamii Blockchain Voting</title>
          <meta
            name="description"
            content="A voting system that leverages blockchain technology!"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Grid container>
          <Grid item xs={2} className={styles.left_side_bar}>
            <header className={styles.left_header}>
              <h2>Jamii Ballots</h2>
              <Button variant="outlined" color="success">
                New Ballot
              </Button>
            </header>
            <Divider />
            <main className={styles.left_main}>
              {/* <form onSubmit={(e) => get_ballot(e)}>
              <TextField
                id="standard-basic"
                label="Search Ballots..."
                variant="standard"
                name="ballot_id"
                type="text"
                value={ballot_id}
                onChange={(e) => set_ballot_id(e.target.value)}
              />
              <button type="submit">search</button>
            </form>
            <div>Open Ballot</div>
            <div>Open Ballot</div>
            <div>Open Ballot</div>
            <div>Open Ballot</div>
            <div>Open Ballot</div> */}
              <h4>Ballots here</h4>
            </main>

            <footer className={styles.left_footer}>
              {/* {connected ? (
              <div className={styles.connect_container}>
                <div>
                  <small>{error}</small>
                </div>
                <div>
                  <Button>
                    <AccountBalanceWalletOutlinedIcon
                      sx={{ color: "#33FF57" }}
                    />
                  </Button>
                </div>
                <div>Ballot Owner: {user_addr}</div>
              </div>
            ) : ( */}
              <div>{error && <small>{error}</small>}</div>

              <div className={styles.connect_container}>
                {/* )} */}
                {/* <Button onClick={connect_wallet()}>
              <AccountBalanceWalletOutlinedIcon sx={{ color: "#FF5733" }} />
            </Button> */}
                <div>
                  <Button>
                    <AccountBalanceWalletOutlinedIcon
                      sx={{ color: wallet_color }}
                    />
                  </Button>
                </div>
                <div>
                  <Button>
                    <SettingsOutlinedIcon />
                  </Button>
                </div>
              </div>
            </footer>
          </Grid>
          <Grid
            item
            xs={10}
            className={styles.main_bar}
            sx={{ display: "flex" }}
          >
            <Box sx={{ width: "100%" }}>
              <Box
                className={styles.main_panel}
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div className={styles.main_panel_tabs}>
                  <Tabs
                    value={value}
                    onChange={handle_tab_change}
                    aria-label="basic tabs example"
                  >
                    <Tab label={create_ballot} {...a11yProps(0)} />
                    <Tab label="Open Ballot" {...a11yProps(1)} />
                    <Tab label={end_ballot} {...a11yProps(2)} />
                  </Tabs>
                </div>
                <div className={styles.main_panel_actions}>
                  <Button className={styles.panel_icons}>
                    <ContentCopyIcon />
                  </Button>
                  <Button
                    className={styles.panel_icons}
                    onClick={() => set_initial_ballot_state()}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </Button>
                </div>
              </Box>
              <div className={styles.ballot_details}>
                <div className={styles.panel_details}>
                  <TabPanel value={value} index={0}>
                    <div className={styles.ballot_container}>
                      {ballot_id.length == 0 ? (
                        <div className={styles.ballot_form}>
                          <form onSubmit={(e) => create_new_ballot(e)}>
                            <div className={styles.form_item}>
                              <TextField
                                id="filled-basic"
                                label="ballot name"
                                variant="filled"
                                name="ballot_name"
                                value={initial_ballot.ballot_name}
                                onChange={handle_ballot_data}
                                fullWidth
                              />
                            </div>
                            {/* _ballot_candidates_addr ->> array */}
                            <div
                              className={`${styles.form_item} ${styles.form_item_2}`}
                            >
                              <div>
                                <Button onClick={open_ballot_type}>
                                  Ballot Type
                                </Button>
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
                                            In an open ballot anyone can
                                            register and vote.
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
                                            In a closed ballot, anyone can
                                            register although voters need voting
                                            rights to vote.
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
                                <Button onClick={open_ballot_schedule}>
                                  Schedule Ballot
                                </Button>
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
                                      <Typography
                                        variant="caption"
                                        sx={{ color: "#fff" }}
                                      >
                                        Start Voter Registration:{" "}
                                      </Typography>
                                      <TextField
                                        // label="Start Voter Registration"
                                        type="date"
                                        defaultValue={Date.now()}
                                        className={styles.date_field}
                                        name="start_registration"
                                        onChange={(e) => handle_ballot_dates(e)}
                                        label="dd/mm/yyyy"
                                        InputLabelProps={{
                                          style: {
                                            color: "#fff",
                                          },
                                        }}
                                      />
                                    </div>
                                    <div className={styles.date}>
                                      <Typography
                                        variant="caption"
                                        sx={{ color: "#fff" }}
                                      >
                                        End Voter Registration:{" "}
                                      </Typography>
                                      <TextField
                                        // label="End Voter Registration"
                                        type="date"
                                        className={styles.date_field}
                                        name="end_registration"
                                        onChange={(e) => handle_ballot_dates(e)}
                                        label="dd/mm/yyyy"
                                        InputLabelProps={{
                                          style: {
                                            color: "#fff",
                                          },
                                        }}
                                      />
                                    </div>
                                    <div className={styles.date}>
                                      <Typography
                                        variant="caption"
                                        sx={{ color: "#fff" }}
                                      >
                                        Start Voting:{" "}
                                      </Typography>
                                      <TextField
                                        // label="End Voter Registration"
                                        type="date"
                                        className={styles.date_field}
                                        name="start_voting"
                                        onChange={(e) => handle_ballot_dates(e)}
                                        label="dd/mm/yyyy"
                                        InputLabelProps={{
                                          style: {
                                            color: "#fff",
                                          },
                                        }}
                                      />
                                    </div>
                                    <div className={styles.date}>
                                      <Typography
                                        variant="caption"
                                        sx={{ color: "#fff" }}
                                      >
                                        End Voting:{" "}
                                      </Typography>
                                      <TextField
                                        // label="Ballot End Date"
                                        type="date"
                                        className={styles.date_field}
                                        name="end_ballot"
                                        onChange={(e) => handle_ballot_dates(e)}
                                        label="dd/mm/yyyy"
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
                            </div>
                            <div
                              className={`${styles.form_item} ${styles.form_item_3}`}
                            >
                              <div>
                                <Typography>
                                  Ballot - Type :{" "}
                                  {ballot_types_map.get(
                                    parseInt(initial_ballot.ballot_type)
                                  )}{" "}
                                </Typography>
                              </div>
                              <div>
                                <Typography>
                                  Ballot - Period: {initial_ballot.ballot_days}
                                </Typography>
                                <Typography>
                                  Registration - Period:{" "}
                                  {initial_ballot.registration_period}
                                </Typography>
                              </div>
                            </div>
                            {/* new candidates */}
                            <div>
                              {candidates.map((data, index) => {
                                const { address } = data;
                                return (
                                  <div className={styles.add_candidate}>
                                    <TextField
                                      key={index}
                                      label="candidate address"
                                      variant="filled"
                                      type="text"
                                      onChange={(e) =>
                                        handle_candidates(index, e)
                                      }
                                      value={address}
                                      name="address"
                                      fullWidth
                                      className={styles.candidate_field}
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
                                <Button onClick={(e) => add_candidate(e)}>
                                  <AddCircleOutlineIcon />
                                </Button>
                              </div>
                            </div>
                            {/* end new candidates */}
                            {/* <div className={styles.form_item}>
                          <p>Candidates</p>
                          <div>
                            <TextField
                              id="filled-basic"
                              label="candidate address"
                              variant="filled"
                              name="ballot_candidates"
                              value={initial_ballot.ballot_candidates}
                              onChange={handle_ballot_data}
                              fullWidth
                              helperText="Enter a list of candidate addresses."
                            />
                          </div>
                        </div> */}
                            <div className={styles.create_button}>
                              <Button type="submit" disabled={!factory}>
                                Create Ballot
                              </Button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <div>
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
                                label={ballot_id}
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
                              {accounts[0]}
                            </Typography>
                          </Grid>

                          <Grid mb={4} item xs={12}>
                            <div>
                              <Typography variant="h5">
                                Ballot Candidates
                              </Typography>
                            </div>

                            <>
                              {Object.keys(ballot.ballot_candidates).map(
                                (key) => (
                                  <div key={key}>
                                    <Typography variant="body1">
                                      {ballot.ballot_candidates[key]}
                                    </Typography>
                                  </div>
                                )
                              )}
                            </>
                          </Grid>

                          <Grid item mb={4} xs={12}>
                            <Typography variant="h5" pb={1}>
                              Important Dates
                            </Typography>
                            <div>
                              <Typography variant="h6">
                                Registration:
                              </Typography>{" "}
                              <Typography variant="subtitle1">
                                Starts: {start_registration} Ends:{" "}
                                {end_registration}
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="h6">Voting:</Typography>{" "}
                              <Typography variant="subtitle1">
                                Starts: {start_voting}, Ends: {end_ballot}
                              </Typography>
                            </div>
                          </Grid>
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
                                    `register_voter/${ballot_id}`
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
                        </div>
                      )}
                    </div>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    {ballot_id.length > 1 ? (
                      <>
                        <header className={styles.details_2_header}>
                          <button onClick={(e) => get_ballot(e)}>
                            <CachedIcon />
                          </button>
                          <div>
                            Status:{" "}
                            {ballot.expired ? (
                              <h4>
                                Completed{" "}
                                <span className={styles.status}></span>
                              </h4>
                            ) : (
                              <h4>
                                Open <span className={styles.status}></span>
                              </h4>
                            )}
                          </div>
                        </header>
                        <h4>Ballot Id: {ballot.ballot_id}</h4>
                        <h4>
                          Ballot Type:{" "}
                          {`${ballot_types_map.get(
                            parseInt(ballot.ballot_type)
                          )} Ballot`}{" "}
                        </h4>
                        <h4>Ballot Name: {ballot.ballot_name}</h4>
                        <h4>Ballot Admin: {ballot.chair} </h4>
                        <h4>
                          Ballot Registered Voters:{" "}
                          {ballot_id.length > 1 ? ballot.voters_count : 0}
                        </h4>

                        <a
                          target="_blank"
                          href={`register_voter/${encodeURIComponent(
                            ballot_id
                          )}`}
                        >{`register_voter/${ballot_id}`}</a>
                      </>
                    ) : (
                      <>
                        <h4>You have no active Ballots!!</h4>
                        <small>create one?</small>
                      </>
                    )}
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    {ballot_id.length > 1 ? (
                      <>
                        {/* <button onClick={(e) => get_ballot(e)}>
                        reload ballot
                      </button> */}
                        <button onClick={(e) => handle_tab_change(e, 2)}>
                          reload candidates
                        </button>
                        <div>TIMER HERE</div>
                        <h4>
                          Ballot Status:{" "}
                          {!ballot.expired ? <>Open</> : <>Closed</>}
                        </h4>
                        <h4>
                          Election Date:{" "}
                          {convert_time(
                            parseInt(ballot.open_date) +
                              parseInt(ballot.registration_window) * 86400
                          )}
                        </h4>
                        <h4>
                          Registration Status:{" "}
                          {parseInt(ballot.open_date) +
                            parseInt(ballot.registration_window) >
                          parseInt(Date.now) ? (
                            <span>Ended</span>
                          ) : (
                            <span>Ongoing</span>
                          )}
                        </h4>

                        <h4>Total Votes: {ballot.voters_count}</h4>

                        <>
                          {Object.keys(ballot_candidates).map((key) => (
                            <div key={key}>
                              <h4>Address: {ballot_candidates[key][2]}</h4>
                              <h4>Votes: {ballot_candidates[key][3]}</h4>
                            </div>
                          ))}
                        </>

                        <button>End Ballot</button>
                      </>
                    ) : (
                      <>
                        <h4>You have no active Ballots!!</h4>
                        <small>create one?</small>
                      </>
                    )}
                  </TabPanel>
                </div>
                <div className={styles.panel_actions}>
                  <Button
                    variant="outlined"
                    color="success"
                    className={styles.right_btns}
                  >
                    Preview Ballot
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    className={styles.right_btns}
                  >
                    Print Results
                  </Button>
                  <div>
                    {!connected && (
                      <>
                        <Paper elevation={4} sx={{ padding: "10px" }}>
                          <span>Connect Wallet to Create Ballot</span>
                          <div>{3} Test Ballots Left</div>
                        </Paper>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default create_ballot;
