import React, { useState } from 'react';
import { useRouter } from 'next/router';

import supabase from '../supabase.js';
import { useEffect } from 'react';

import { Input, Alert, Button } from "reactstrap";

import styles from '../styles/Login.module.css';

export default function App() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectCredentials, setIncorrectCredentials] = useState(false);

  useEffect(async () => {
    if (supabase.auth.user()) {
      router.push('/home')
    }
  });

  async function signIn(e) { 
    e.preventDefault();
    const { user, session, error } = await supabase.auth.signIn({
      email: username,
      password: password
    });
    if (!error) {
      router.push('/home')
    } else {
      setIncorrectCredentials(true);
    }
  }

  async function signUp (e) {}
    e.preventDefault();
    const { user, session, error } = await supabase.auth.signUp({
      email: username,
      password: password
    }); 

    if (!error) {
      router.push('/home')
    }
  }

  return (
    <div className={styles.login}>
      <h1>Goalzzzz</h1>
      <Input className={styles.input} onChange={e => setUsername(e.target.value)} type="text" placeholder="username" style={{ marginBottom: 5 }}/>
      <Input className={styles.input} onChange={e => setPassword(e.target.value)} type="password" placeholder="password"/>
      <Alert className={styles.alert} hidden={!incorrectCredentials} color="danger">The account with that username and password is not recognized. Create a new account?</Alert>
      <Button className={styles.btn} onClick={e => signUp(e)}>Create Account</Button>
      <Button className={styles.btn} onClick={e => signIn(e)}>Sign In</Button>
    </div>
  );
}