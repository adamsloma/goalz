import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "../supabase.js";
import Hashids from "hashids";
import { Modal, Button } from "reactstrap";
import GoalForm from "./add-goal";
import styles from "../styles/Home.module.css";
import { useClient } from "react-supabase";

async function fetchData(user) {
  // get reference to the user
  const { data, error } = await supabase
    .from("goal")
    .select("id, user_id, objective, category, description")
    .filter("user_id", "eq", user.id);

  return data ? data : error;
}

function GoalItem(props) {
  return (
    <div onClick={props.onClick}>
      <li>
        <label>{props.goal.objective + " "}</label>
        <label>{props.goal.description + " "}</label>
        <label>{props.goal.category + " "}</label>{" "}
        <button className="btn-close" onClick={props.onDelete}></button>
      </li>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const client = useClient();
  const user = client.auth.user();

  const [goals, setGoals] = useState([]);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  useEffect(async () => {
    if (!user) router.push("/login");
    else {
      const goals = await fetchData(user);
      setGoals(goals);
    }
  }, []);

  const hashids = new Hashids();

  function encrypt(id) {
    // encrypt goal Id
    const constant = 786732452123; // todo: store in an environment variable
    return hashids.encode(id * constant);
  }

  function signOut() {
    const { error } = supabase.auth.signOut();
    if (!error) {
      router.push("/login");
    }
  }

  if (!user) return <></>;
  return (
    <div>
      {user.email}
      <button onClick={toggle}>Add goal</button>
      <ul>
        {goals.map((goal, index) => {
          return (
            <GoalItem
              onClick={() => router.push(`/goal-${encrypt(goal.id)}`)}
              goal={goal}
              onDelete={async (e) => {
                e.stopPropagation();
                const temp = goals;
                // update supabase

                // TODO: make a postgres function????
                const { data: krData, error: krError } = await supabase
                  .from("key_result")
                  .delete()
                  .match({ goal_id: temp[index].id });

                const { data: fmData, error: fmError } = await supabase
                  .from("failure_mode")
                  .delete()
                  .match({ goal_id: temp[index].id });

                const { data: goalData, error: goalError } = await supabase
                  .from("goal")
                  .delete()
                  .match({ id: temp[index].id });

                // update state
                temp.splice(index, 1);
                setGoals([...temp]);
              }}
            />
          );
        })}
      </ul>
      <Modal className={styles.modal} isOpen={modal} toggle={toggle}>
        <GoalForm
          onSubmit={async (e) => {
            toggle();

            // reload supabase data
            const goals = await fetchData();
            setGoals([...goals]);
          }}
        ></GoalForm>
      </Modal>
      <Button className={styles.btn} onClick={signOut}>
        Sign Out
      </Button>
    </div>
  );
}
