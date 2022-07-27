import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
// import JamiiWrapper from "../../wrapper/wrapper.js";
import {
  init,
  get_ballot,
  register_voter,
  get_registered_voter,
} from "../../wrapper/wrapper";
import { Paper, TextField } from "@mui/material";

const voter_registration = () => {
  const router = useRouter();
  const { ballot_id } = router.query;

  // const wrapper = new JamiiWrapper();

  const [ballot, set_ballot] = useState(null);
  const [user_id, set_user_id] = useState(0);
  const [unique_voter_id, set_unique_voter_id] = useState("");

  const get_ballot_details = async () => {
    // e.preventDefault();
    // const ballot = await factory.methods.get_ballot(ballot_id).call();
    // set_ballot(ballot);
    // console.log("BALLOT ID:", ballot_id);
    // console.log(ballot);
    // console.log(wrapper);
    init();
    const new_ballot = await get_ballot(ballot_id);
    set_ballot(new_ballot);

    console.log("NEW BALLOT", new_ballot);
  };

  useEffect(() => {
    get_ballot_details();
  }, []);

  const url_format = (_url, _ballot_id) => {
    let res = _url.replace("[ballot_id]", _ballot_id);
    return res;
  };

  const url_format_reg = (_url, _ballot_id) => {
    let res = _url.replace("register_voter", "vote");
    let res1 = res.replace("[ballot_id]", _ballot_id);
    return res1;
  };

  const register_new_voter = async (e, _user_id, _ballot_id) => {
    e.preventDefault();
    await register_voter(_user_id, _ballot_id);
    // set_unique_voter_id(res);
    // console.log("UVI: ", res);
  };

  // const get_registered_voter = async (_voter_address) => {
  //   const accounts = await web3.eth.getAccounts();
  //   const voter = await get_voter(_voter_address);
  //   console.log("VOTER: ", voter);
  // };

  return (
    <>
      <div>{ballot?.ballot_name} </div>
      {ballot ? (
        <>
          {ballot.expired ? (
            <h4>Registration Closed!</h4>
          ) : (
            <h4>Registration is Ongoing</h4>
          )}
          {/* <Paper elevation={2}>{ballot.voters_count} Peopls Voted.</Paper> */}
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
          {/* // only if ballot owner */}
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
        </>
      ) : (
        <button onClick={() => get_ballot_details()}>run</button>
      )}
    </>
  );
};

export default voter_registration;
