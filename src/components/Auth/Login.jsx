import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const auth = useAuth();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await auth.login(email, password);
      nav("/");
    } catch (error) {
      setErr(error.response?.data?.detail || error.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-slate-800/60 border border-slate-700 rounded-2xl p-8 shadow-xl">
      <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
      {err && <div className="bg-red-600/30 text-red-300 p-2 rounded mb-3">{err}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
               className="w-full p-3 rounded bg-slate-900 border border-slate-700" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
               type="password"
               className="w-full p-3 rounded bg-slate-900 border border-slate-700" />
        <button className="w-full py-3 rounded bg-emerald-500 hover:bg-emerald-600 font-semibold">Sign in</button>
      </form>
    </div>
  );
}
