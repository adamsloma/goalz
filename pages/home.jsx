import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../supabase.js';
import Hashids from 'hashids';

// TODO: SSR for goals list

async function fetchData() {
  // get reference to the user 
  const user = supabase.auth.user();
  const { data, error } = await supabase
    .from('goal')
    .select('id, user_id, objective, category, description')
    .filter('user_id', 'eq', user.id);
  
  return data ? data : error;
}

function GoalItem(props) {
  return (
    <div onClick={props.onClick}>
      <li><label>{props.goal.objective + " "}</label><label>{props.goal.description + " "}</label><label>{props.goal.category + " "}</label></li>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState({})
  const [goals, setGoals] = useState([]);

  useEffect(async () => {
    const goals = await fetchData();
    setGoals(goals);
    setUser(supabase.auth.user());
  }, []);

  const hashids = new Hashids();

  function encrypt(id) {
    // encrypt goal Id
    const constant = 786732452123; // todo: store in an environment variable
    return hashids.encode(id*constant);
  }

  function signOut() {
    const { error } = supabase.auth.signOut();
    if (!error) {
      router.push('/')
    }
  }

  return (
    <>
      {user.email}
      <ul>
        {goals.map((goal, index) => {
          return <GoalItem
           onClick={() => router.push(`/goal-${encrypt(goal.id)}`)} 
           goal={goal} />})}
      </ul>
      <button onClick={signOut}>Sign Out</button>
    </>
  );
}