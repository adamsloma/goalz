import React, { useState } from 'react';
import { useRouter } from 'next/router';

import supabase from '../supabase.js';
import { useEffect } from 'react';

export default function App() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
    }
  }

  async function createAccount(e) {
    e.preventDefault();
    const { user, session, error } = await supabase.auth.signUp({
      email: username,
      password: password
    });
  }

  return (
    <form>
      <input onChange={e => setUsername(e.target.value)} type="text" placeholder="username"/> <br />
      <input onChange={e => setPassword(e.target.value)} type="password" placeholder="password"/> <br />
      <button onClick={(e) => signIn(e)}>Sign In</button>
      <button onClick={(e) => createAccount(e)}>Create Account</button>
    </form>
  );
}