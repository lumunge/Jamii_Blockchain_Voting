import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { get_ballot_candidates, vote } from "../../wrapper/wrapper";
// import { Paper, TextField } from "@mui/material";

const Vote = () => {
  const router = useRouter();
  const { ballot_id } = router.query;
  const [ballot_candidates, set_ballot_candidates] = useState([]);
  const [selected_candidate, set_selected_candidate] = useState("");

  const get_candidates = async (_ballot_id) => {
    const candidates = await get_ballot_candidates(_ballot_id);
    set_ballot_candidates(candidates);
    console.log(candidates);
    console.log("CHOSEN ONE", selected_candidate);
  };

  const cast_vote = async (e) => {
    e.preventDefault();
    await vote(selected_candidate, ballot_id);
    console.log("voted!!");
  };

  const handle_box_change = (e) => {
    set_selected_candidate(e.target.value);
  };

  return (
    <>
      <h1>Ballot Id: {ballot_id}</h1>
      <div>
        <h4>Candidates</h4>
        <button onClick={() => get_candidates(ballot_id)}>run</button>
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
                  {/* <h4>Address: {ballot_candidates[key]}</h4> */}
                </div>
              ))}
            </>
          )}
          <button type="submit">Vote</button>
        </form>
      </div>
    </>
  );
};

// export const getServerSideProps = async ({ ballot_id }) => {
//   console.log(ballot_id);
//   const data = await get_ballot_candidates(ballot_id);
//   //   const data = { ballot_id: 5 };

//   return {
//     props: {
//       data,
//     },
//   };
//   // try-catch removed for simplification
// };

// export async function getStaticProps() {
//   const ballot_candidates = await get_ballot_candidates(_ballot_id);
//   return {
//     props: {
//       ballot_candidates,
//     },
//     // paths: [`/vote/6dff1b94-8792-45af-8bc5-df9afc3e8b07`],
//     paths: [{ params: { ballot_id: "ballot_id" } }],
//     fallback: true,
//   };
// }

// export async function getStaticPaths() {
//   // change your API url to get ALL categories
//   const res = await fetch(process.env.APIpath + "/api/public/getCategories");
//   const posts = await res.json();

//   // Get the paths we want to pre-render based on posts, play with params variable you are returning
//   const paths = posts.map((post) => ({
//     params: { id: post._id },
//   }));

//   // We'll pre-render only these paths at build time.
//   // { fallback: blocking } will server-render pages
//   // on-demand if the path doesn't exist.
//   return { paths, fallback: "blocking" };
// }

export default Vote;
