import Head from "next/head";
import Web3 from "web3";
import React, { useState, useEffect } from "react";
import map from "../../build/deployments/map.json";
import { getEthereum } from "../getEthereum";
import { getWeb3 } from "../getWeb3";
// import JamiiFactory from "../controller/JamiiFactory";
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
} from "@mui/material";
// import Notification from "../components/Notification";
import TabPanel from "../components/TabPanel";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import styles from "../styles/create_ballot.module.css";

const create_ballot = () => {
  const [value, setValue] = useState(0);
  const [error, set_error] = useState("");
  const [user_addr, set_user_addr] = useState("");
  const [connected, is_connected] = useState(false);
  // const [notification, set_notification] = useState(false);
  // const [web3, setWeb3] = useState(null);
  // const [factory, set_factory] = useState(null);
  let test_ballot_candidates = [
    "0xf9d48aC9eC8F207AEF93518B51D2CdA61e596904",
    "0x6c0A17AEe0a1420583446B77f0c8a55e369Bb07e",
  ];
  const [ballot, set_ballot] = useState({
    ballot_name: "",
    ballot_candidates: test_ballot_candidates,
    ballot_type: "",
    ballot_days: "",
    registration_period: "",
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handle_ballot_data = (e) => {
    const data = e.target.value;
    set_ballot({
      ...ballot,
      [e.target.name]: data,
    });
  };

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

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

  // const create_new_ballot = async () => {
  //   // console.log(ballot);
  //   let ballot_name = ballot.ballot_name;
  //   let candidates = ballot.ballot_candidates;
  //   let ballot_type = ballot.ballot_type;
  //   let ballot_days = ballot.ballot_days;
  //   let registration_period = ballot.registration_period;

  //   console.log(ballot_name);
  //   // console.log(candidates.split(", "));
  //   console.log(ballot_type);
  //   console.log(ballot_days);
  //   console.log(registration_period);
  //   try {
  //     await factory.methods.create_ballot().send({
  //       from: user_addr,
  //       value: web3.utils.toWei("0.01", "ether"),
  //     });
  //     // set_ballots(new_ballot);
  //     // Notification here
  //   } catch (error) {
  //     set_error(error);
  //   }
  // };

  // string memory _ballot_name,
  // address[] memory _ballot_candidates_addr,
  // uint256 _ballot_type,
  // uint256 _days,
  // uint256 _registration_period

  // const disconnect_wallet = () => {
  //   alert("will be disconnected here!");
  // };

  const [web_3, set_web_3] = useState(null);
  const [accounts, set_accounts] = useState(null);
  const [chain_id, set_chain_id] = useState(0);
  const [factory, set_factory] = useState(null);
  const [ballot_id, set_ballot_id] = useState(0);

  const isAccountsUnlocked = accounts ? accounts.length > 0 : false;

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
    // if (chain_id === 1337) {
    //   _chain_id = "dev";
    // }
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
    // Load a deployed contract instance into a web3 contract object
    const web3 = web_3;

    // Get the address of the most recent deployment from the deployment map
    let address;
    try {
      address = map[chain][contract_name][0];
    } catch (e) {
      console.log(
        `Couldn't find any deployed contract "${contract_name}" on the chain "${chain}".`
      );
      return undefined;
    }

    // Load the artifact with the specified address
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
    // const { accounts, factory, ballot_id_input } = this.state;
    e.preventDefault();
    //   // console.log(ballot);
    let ballot_name = ballot.ballot_name;
    let candidates = ballot.ballot_candidates;
    let ballot_type = ballot.ballot_type;
    let ballot_days = ballot.ballot_days;
    let registration_period = ballot.registration_period;

    // const value = parseInt(ballot_id_input);
    // if (isNaN(value)) {
    //   alert("invalid value");
    //   return;
    // }
    await factory.methods
      .create_ballot(
        ballot_name,
        candidates,
        ballot_type,
        ballot_days,
        registration_period
      )
      .send({ from: accounts[0] })
      .on("receipt", async () => {
        // this.setState({
        //   solidityValue: await solidityStorage.methods.get().call(),
        // });
        console.log("Ballot created Successfully!!");
      });
  };

  const get_ballot = async (e) => {
    e.preventDefault();
    const ballot = await factory.methods.get_ballot(ballot_id).call();
    console.log(ballot_id);
    console.log(ballot);
  };

  // const connect_wallet = () => {
  //   init();
  // };

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
            <form onSubmit={(e) => get_ballot(e)}>
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
            <div>Open Ballot</div>
          </main>

          <footer className={styles.left_footer}>
            {/* {connected ? (
              <div className={styles.connect_container}>
                <div>
                  <small>{error}</small>
                </div>
                <div>
                  <Button onClick={() => disconnect_wallet()}>
                    <AccountBalanceWalletOutlinedIcon
                      sx={{ color: "#33FF57" }}
                    />
                  </Button>
                </div>
                <div>Ballot Owner: {user_addr}</div>
              </div>
            ) : (
              <div className={styles.connect_container}>
                <div>
                  <small>{error}</small>
                </div>
                <div>
                  <Button onClick={() => connect_wallet()}>
                    <AccountBalanceWalletOutlinedIcon
                      sx={{ color: "#FF5733" }}
                    />
                  </Button>
                </div>
              </div>
            )} */}
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
                  onChange={handleChange}
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
                  Details about ballot creation.
                  {/* <form onSubmit={create_new_ballot()}> */}
                  <form>
                    <TextField
                      id="filled-basic"
                      label="ballot name"
                      variant="filled"
                      name="ballot_name"
                      value={ballot.ballot_name}
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
                      value={ballot.ballot_type}
                      onChange={handle_ballot_data}
                      label="ballot type"
                      // onChange={handleChange}
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
                        value={ballot.ballot_days}
                        onChange={handle_ballot_data}
                      />
                    </div>
                    <div>
                      <TextField
                        id="filled-basic"
                        label="Registration days"
                        variant="filled"
                        name="registration_period"
                        value={ballot.registration_period}
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
                          value={ballot.ballot_candidates}
                          onChange={handle_ballot_data}
                        />
                      </div>
                      {/* <div>
                        <TextField
                          id="filled-basic"
                          label="candidate address"
                          variant="filled"
                        />
                      </div> */}
                    </div>
                    <button type="submit" disabled={!isAccountsUnlocked}>
                      Submit
                    </button>
                    {/* <Button onClick={create_new_ballot}>Create</Button> */}
                    {/* <Button onClick={create_new_ballot()}>Reset</Button> */}
                    <Button onClick={test}>Reset</Button>
                  </form>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  The status of the ballot.
                </TabPanel>
                <TabPanel value={value} index={2}>
                  After expiry, end the ballot.
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
                <Button
                  variant="outlined"
                  color="success"
                  className={styles.right_btns}
                >
                  Connect Wallet to Create Ballot
                </Button>
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
