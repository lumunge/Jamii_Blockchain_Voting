import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import map from "../../build/deployments/map.json";
import { getEthereum } from "../utils/getEthereum";
import { getWeb3 } from "../utils/getWeb3";
import { get_candidate } from "../wrapper/wrapper";
import { convert_time } from "../utils/functions.js";
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
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
} from "@mui/material";
// import Notification from "../components/Notification";
import TabPanel from "../components/TabPanel";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import styles from "../styles/create_ballot.module.css";

const create_ballot = () => {
  const [value, set_value] = useState(0);
  const [error, set_error] = useState("");
  const router = useRouter();
  let test_ballot_candidates = [
    "0xf9d48aC9eC8F207AEF93518B51D2CdA61e596904",
    "0x6c0A17AEe0a1420583446B77f0c8a55e369Bb07e",
  ];

  const initial_ballot_state = {
    ballot_type: "",
    ballot_name: "",
    ballot_chair: "",
    ballot_candidates: [],
    ballot_days: "",
    registration_period: "",
  };

  const [ballot, set_ballot] = useState(initial_ballot_state);
  const [initial_ballot, set_initial_ballot] = useState(initial_ballot_state);
  const [ballot_candidates, set_ballot_candidates] = useState([]);

  const set_initial_ballot_state = () => {
    set_ballot(initial_ballot_state);
  };

  const ballot_types_map = new Map([
    [0, "open"],
    [1, "closed"],
    [2, "open_secret"],
    [3, "closed_secret"],
  ]);

  const handle_tab_change = async (e, new_value) => {
    set_value(new_value);

    if (new_value == 2) {
      let candidates_data = await get_candidates_data(
        process_candidates(initial_ballot.ballot_candidates)
      );
      set_ballot_candidates(candidates_data);
    }

    console.log("BALLOT CANDIDATES: ", ballot_candidates);

    // console.log(new_value);
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

    console.log("TYPE: ", ballot.ballot_candidates);
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

  // const connect_wallet = async () => {
  //   if (
  //     typeof window !== "undefined" &&
  //     typeof window.ethereum !== "undefined"
  //   ) {
  //     try {
  //       await window.ethereum.request({ method: "eth_requestAccounts" });
  //       web3 = new Web3(window.ethereum);
  //       setWeb3(web3);
  //       const accounts = await web3.eth.getAccounts();
  //       set_user_addr(accounts[0]);
  //       is_connected(true);
  //       const temp_factory = JamiiFactory(web3);
  //       set_factory(temp_factory);
  //       console.log(accounts);
  //       console.log(temp_factory);
  //       // set_notification(true);
  //     } catch (error) {
  //       // set_error(error.message);
  //       if (error.message == "User rejected the request.") {
  //         set_error("Connect your Metamask Wallet!");
  //         // set_notification(!notification);
  //       } else {
  //         set_error(error.message);
  //         // set_notification(!notification);
  //         // notify(error, "You have to connect your Metamask Wallet!")
  //       }
  //     }
  //   }
  // };

  // const disconnect_wallet = () => {
  //   alert("will be disconnected here!");
  // };
  const ballot_fee = 10000000000000000;
  const [web_3, set_web_3] = useState(null);
  const [accounts, set_accounts] = useState(null);
  const [chain_id, set_chain_id] = useState(0);
  const [factory, set_factory] = useState(null);
  const [ballot_id, set_ballot_id] = useState("");

  const connected = accounts ? accounts.length > 0 : false;

  const init = async () => {
    const web3 = await getWeb3();

    try {
      const ethereum = await getEthereum();
      ethereum.enable();
    } catch (e) {
      console.log(`Could not enable accounts. Interaction with contracts not available.
            Use a modern browser with a Web3 plugin to fix this issue.`);
      console.log(e);
    }

    const accounts = await web3.eth.getAccounts();
    const chain_id = parseInt(await web3.eth.getChainId());

    console.log("GOTTEN CHAIN ID: ", chain_id);

    set_web_3(web3);
    set_accounts(accounts);
    set_chain_id(chain_id);

    await load_initial_contracts();
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

    console.log("BEFORE SET!! ", web_3);

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
    return new web3.eth.Contract(contract_artifact.abi, address);
  };

  const create_new_ballot = async (e) => {
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
        set_ballot_id(ballot_id);
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
    e.preventDefault();
    const ballot = await factory.methods.get_ballot(ballot_id).call();
    set_ballot(ballot);
    console.log("BALLOT ID:", ballot_id);
    console.log(ballot);
  };

  const get_candidate_votes = async (_candidate_address) => {
    const candidate = await factory.methods
      .get_candidate(_candidate_address)
      .call();
    const candidate_vote_count = candidate.vote_count;
    console.log("Candidate:", candidate);
    return candidate_vote_count;
  };

  const get_candidates_data = async (_candidates) => {
    let candidates_data = [];
    let n = _candidates.length;
    for (let i = 0; i < n; i++) {
      const candidate = await factory.methods
        .get_candidate(_candidates[i])
        .call();
      candidates_data.push(candidate);
    }
    // set_ballot_candidates(candidates_data);
    // console.log(candidates_data);
    return candidates_data;
  };

  // const get_ballot_with_addr = async (e) => {};

  const process_candidates = (candidates_str) => {
    let candidates_nospace = candidates_str.replaceAll(/\s/g, "");
    let candidates = candidates_nospace.split(",");
    return candidates;
  };

  const test = () => {
    init();
    console.log(web_3);
    console.log(accounts);
    console.log(chain_id);
    console.log(factory);
  };

  // useEffect(() => {
  //   init();
  // }, []);

  return (
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
            <div className={styles.connect_container}>
              <div>
                <small>{error}</small>
              </div>
              <div>
                <Button onClick={test}>
                  <AccountBalanceWalletOutlinedIcon sx={{ color: "#FF5733" }} />
                </Button>
              </div>
            </div>
            {/* )} */}
            {/* <Button onClick={connect_wallet()}>
              <AccountBalanceWalletOutlinedIcon sx={{ color: "#FF5733" }} />
            </Button> */}
            <div>
              <Button>
                <SettingsOutlinedIcon />
              </Button>
            </div>
          </footer>
        </Grid>
        <Grid item xs={10} className={styles.main_bar} sx={{ display: "flex" }}>
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
                  <Tab label="Create Ballot" {...a11yProps(0)} />
                  <Tab label="Open Ballot" {...a11yProps(1)} />
                  <Tab label="End Ballot" {...a11yProps(2)} />
                </Tabs>
              </div>
              <div className={styles.main_panel_actions}>
                <Button className={styles.panel_icons}>
                  <ContentCopyIcon />
                </Button>
                <Button className={styles.panel_icons}>
                  <DeleteOutlineOutlinedIcon />
                </Button>
              </div>
            </Box>
            <div className={styles.ballot_details}>
              <div className={styles.panel_details}>
                <TabPanel value={value} index={0}>
                  Details about ballot creation. ---- BACKGROUND BALLOT IMAGE
                  <form onSubmit={(e) => create_new_ballot(e)}>
                    <TextField
                      id="filled-basic"
                      label="ballot name"
                      variant="filled"
                      name="ballot_name"
                      value={initial_ballot.ballot_name}
                      onChange={handle_ballot_data}
                    />
                    {/* _ballot_candidates_addr ->> array */}
                    <InputLabel id="demo-simple-select-label">
                      ballot type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="ballot_type"
                      value={initial_ballot.ballot_type}
                      onChange={handle_ballot_data}
                      label="ballot type"
                    >
                      <MenuItem value={0}>Open Free</MenuItem>
                      <MenuItem value={1}>Closed Free</MenuItem>
                      <MenuItem value={2}>Open Paid</MenuItem>
                      <MenuItem value={3}>Closed Paid</MenuItem>
                      <MenuItem value={4}>Closed Paid(secret ballot)</MenuItem>
                      <MenuItem value={5}>Closed Paid(secret ballot)</MenuItem>
                      <MenuItem value={6}>Closed Paid(secret ballot)</MenuItem>
                    </Select>
                    <div>
                      <TextField
                        id="filled-basic"
                        label="ballot days"
                        variant="filled"
                        name="ballot_days"
                        value={initial_ballot.ballot_days}
                        onChange={handle_ballot_data}
                      />
                    </div>
                    <div>
                      <TextField
                        id="filled-basic"
                        label="Registration days"
                        variant="filled"
                        name="registration_period"
                        value={initial_ballot.registration_period}
                        onChange={handle_ballot_data}
                        helperText="Once a ballot is created, voter registration starts."
                      />
                    </div>
                    <div>
                      <p>Candidates</p>
                      <div>
                        <TextField
                          id="filled-basic"
                          label="candidate address"
                          variant="filled"
                          name="ballot_candidates"
                          value={initial_ballot.ballot_candidates}
                          onChange={handle_ballot_data}
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={!connected}>
                      Submit
                    </Button>
                    <Button onClick={() => set_initial_ballot_state()}>
                      Reset
                    </Button>
                  </form>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  {ballot_id.length > 1 ? (
                    <>
                      <button onClick={(e) => get_ballot(e)}>
                        reload ballot
                      </button>
                      <h4>Ballot Id: {ballot_id}</h4>
                      <h4>
                        Ballot Type:{" "}
                        {`${ballot_types_map.get(
                          parseInt(ballot.ballot_type)
                        )} Ballot`}{" "}
                      </h4>
                      <h4>Ballot Name: {ballot.ballot_name}</h4>
                      <h4>Ballot Admin: {accounts[0]} </h4>
                      <h4>
                        Ballot Registered Voters:{" "}
                        {ballot_id.length > 1 ? ballot.voters_count : 0}
                      </h4>
                      <h4>
                        Start Date: {convert_time(parseInt(ballot.open_date))}
                      </h4>

                      <h4>
                        Registration Ends on{" "}
                        {convert_time(
                          parseInt(ballot.open_date) +
                            parseInt(ballot.registration_window) * 86400
                        )}{" "}
                      </h4>
                      <h4>
                        Ballot Day:{" "}
                        {convert_time(
                          parseInt(ballot.open_date) +
                            parseInt(ballot.registration_window) * 86400
                        )}
                      </h4>
                      <h4>
                        End Date:{" "}
                        {convert_time(
                          parseInt(ballot.open_date) +
                            parseInt(ballot._days) * 86400
                        )}
                      </h4>
                      <h4>Candidates: {initial_ballot.ballot_candidates}</h4>
                      {/* <Link
                        target="_blank"
                        href={`register_voter/${encodeURIComponent(ballot_id)}`}
                        href="#!"
                        onClick={() =>
                          router.push(`register_voter/${ballot_id}`)
                        }
                      >
                        {`register_voter/${ballot_id}`}
                      </Link> */}
                      <a
                        target="_blank"
                        href={`register_voter/${encodeURIComponent(ballot_id)}`}
                      >{`register_voter/${ballot_id}`}</a>
                      {/* <button
                        onClick={() =>
                          router.push(`register_voter/${ballot_id}`)
                        }
                      >{`register_voter/${ballot_id}`}</button> */}

                      {/* <a
                        href={`jamii_ballots/${ballot_id}`}
                      >{`jamii_ballots/${ballot_id}`}</a> */}
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
                      <button onClick={(e) => get_ballot(e)}>
                        reload ballot
                      </button>
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
                {!connected && (
                  <Paper elevation={4}>Connect Wallet to Create Ballot</Paper>
                )}
              </div>
              <div>3 Free Votes</div>
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default create_ballot;

// export const getServerSideProps = async (pageContext) => {
//   const ballot_id = pageContext.query.ballot_id;

//   return {
//     props: {
//       ballot_id: ballot_id,
//     },
//   };
// };
