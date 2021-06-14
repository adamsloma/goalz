import React, { useState } from 'react';
import KeyResult from "../components/KeyResult";
import { useRouter } from "next/router";
import Hashids from "hashids";
import supabase from "../supabase.js";

function decrypt(id) {
  const constant = 786732452123;
  const hashids = new Hashids();
  const n = hashids.decode(id);

  return n/constant;
}

async function fetchData(id) {
  const { data: goal, error: goalError } = await supabase
    .from('goal')
    .select('id, objective, category, description, inserted_at')
    .filter('id', 'eq', decrypt(id))
    .single();

  const { data: kr, error: krError } = await supabase
    .from('key_results')
    .select('id, name, unit, days')
    .filter('goal_id', 'eq', goal.id);
  
  const { data: fm, error: fmError } = await supabase
    .from('failure_modes')
    .select('id, name')
    .filter('goal_id', 'eq', goal.id);
  
  goal.key_results = kr;
  goal.failure_modes = fm;

  if (!goalError && !krError && !fmError) {
    return goal;
  }
}

export async function getServerSideProps({ params }) {
  const id = params.id.replace("goal-", "");
  const goal = await fetchData(id);

  if (!goal) {
    // maybe something like a not found or something idk
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  } else {
    return {
      props: {
        data: goal
      },
    }
  }
}

export function FailureMode(props) {
  return (
    <li>
      <input onChange={(e) => props.onChange(e)} defaultValue={props.name} type="text" placeholder="Ex. I'd rather watch TV"  />
      <button onClick={(e) => props.onDelete(e)}>x</button>
    </li>
  );
}

export default function Goal({ data }) {
  const router = useRouter();
  const [goal, setGoal] = useState(data);

  function addKeyResult(e) {
    e.preventDefault();
    const temp = goal;
    temp.key_results.push({
      name: "",
      unit: ""
    });
    setGoal({...temp});
  }

  function addFailureMode(e) {
    e.preventDefault();
    const temp = goal;
    temp.failure_modes.push({
      name: "",
    });
    setGoal({...temp});
  }

  function save() {}
  return (
    <form onSubmit={save}>
      <h1>Objective</h1>
        <label>Objective</label> <input type="text" defaultValue={goal.objective}/><br />
        <label>Category</label> <input type="text"  defaultValue={goal.category}/> <br />
        <label>Description</label> <br /> <textarea  defaultValue={goal.description} rows={4} cols={30}></textarea> 
      <h1>Key Results</h1>
        {goal.key_results.map((kr, index) => {
          return <KeyResult
            name={kr.name}
            unit={kr.unit}
            days={kr.days}
            insertedAt={goal.inserted_at}
            onChangeName={(e) => {
              e.preventDefault();
              const temp = goal;
              temp.key_results[index].name = e.target.value;
              setGoal({...temp});
            }}
            onChangeUnit={(e) => {
              e.preventDefault();
              const temp = goal;
              temp.key_results[index].unit = e.target.value;
              setGoal({...temp});
            }}
            onDelete={(e) => {
              e.preventDefault();
              const temp = goal;
              temp.key_results.splice(index, 1);
              setGoal({...temp});
            }}
           />;
        })}
        <button onClick={addKeyResult}>Add</button>
      <h1>Possible Failure Modes</h1>
        {goal.failure_modes.map((fm, index) => {
          return <FailureMode 
            name={fm.name}
            onChange={(e) => {
              e.preventDefault();
              const temp = goal;
              temp.failure_modes[index].name = e.target.value;
              setGoal({...temp});
            }}
            onDelete={(e) => {
              e.preventDefault();
              const temp = goal;
              temp.failure_modes.splice(index, 1);
              setGoal({...temp});
            }}
          />;
        })}
        <button onClick={addFailureMode}>Add</button> <br />
      <input type="submit" value="Save" />
    </form>
  )
}
