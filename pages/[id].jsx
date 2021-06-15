import React, { useState } from 'react';
import KeyResult from "../components/KeyResult";
import { useRouter } from "next/router";
import Hashids from "hashids";
import supabase from "../supabase.js";
import moment from 'moment';

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
    .select('id, name, goal_id')
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
      unit: "", 
      goal_id: goal.id
    });
    setGoal({...temp});
  }

  function addFailureMode(e) {
    e.preventDefault();
    const temp = goal;
    temp.failure_modes.push({
      name: "",
      goal_id: goal.id
    });
    setGoal({...temp});
  }

  // save shit to supabase 
  async function save(e) {
    e.preventDefault();
    console.log(goal);

    // save goal data to goal table
    const g = {
      objective: goal.objective, 
      category: goal.category,  
      description: goal.description,
      updated_at: moment().format().toString()
    }
    const { data: goalData , error: goalError } = await supabase
      .from('goal')
      .update(g)
      .match({ id: goal.id });

    // save kr data to kr table
    goal.key_results.forEach( async (kr) => { 
      const { data: krData , error: krError } = await supabase
        .from('key_results')
        .update(kr)
        .match({ id: kr.id });
    });
    
    // save fm data to fm table
    goal.failure_modes.forEach( async (fm) => {
      const { data: fmData, error: fmError } = await supabase
        .from('failure_modes')
        .upsert(fm)
    })
  }

  return (
    <form onSubmit={save}>
      <h1>Objective</h1>
        <label>Objective</label> <input 
          type="text" 
          defaultValue={goal.objective} 
          onChange={(e) => {
            e.preventDefault();
            const temp = goal;
            temp.objective = e.target.value; 
            setGoal({...temp});
          }}/><br />
        <label>Category</label> <input 
          type="text"  
          defaultValue={goal.category}
          onChange={(e) => {
            e.preventDefault();
            const temp = goal;
            temp.category= e.target.value; 
            setGoal({...temp});
          }}
          /> <br />
        <label>Description</label> <br /> <textarea  
          defaultValue={goal.description} 
          onChange={(e) => {
            e.preventDefault();
            const temp = goal;
            temp.description= e.target.value; 
            setGoal({...temp});
          }}
          rows={4} 
          cols={30}></textarea> 
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
            onChangeDay={(day) => {
              const temp = goal;
              if (!temp.key_results[index].days.includes(day))
                temp.key_results[index].days.push(day);
              // can you do it in one line 
              else 
                temp.key_results[index].days.splice(
                  temp.key_results[index].days.indexOf(day),
                  1
                )
              setGoal({...temp});
              console.log(goal);
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
