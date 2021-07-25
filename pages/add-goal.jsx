import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button } from "reactstrap";
import supabase from "../supabase";
import styles from "../styles/Home.module.css";

export default function GoalForm(props) {
  const router = useRouter();
  const [goal, setGoal] = useState({
    objective: "",
    category: "",
    description: "",
  });

  return (
    <div className={styles.addGoal}>
      <label>Objective</label>
      <input
        onChange={(e) => {
          const temp = goal;
          temp.objective = e.target.value;
        }}
        defaultValue={goal.objective}
        type="text"
      />{" "}
      <br />
      <label>Category</label>
      <input
        onChange={(e) => {
          const temp = goal;
          temp.category = e.target.value;
        }}
        defaultValue={goal.category}
        type="text"
      />{" "}
      <br />
      <label>Description</label>
      <br />{" "}
      <textarea
        onChange={(e) => {
          const temp = goal;
          temp.description = e.target.value;
        }}
        defaultValue={goal.description}
      />
      <br />
      <Button
        className={styles.btn}
        onClick={async (e) => {
          e.preventDefault();
          const { data, error } = await supabase.from("goal").insert([
            {
              objective: goal.objective,
              category: goal.category,
              description: goal.description,
              user_id: supabase.auth.user()?.id,
            },
          ]);

          props.onSubmit();
        }}
      >
        Add
      </Button>
    </div>
  );
}
