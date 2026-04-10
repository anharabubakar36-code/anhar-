/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import CreateReport from "./pages/CreateReport";
import UserManagement from "./pages/UserManagement";
import StudentData from "./pages/StudentData";
import RecapReport from "./pages/RecapReport";
import { useEffect, useState } from "react";
import { supabase, Profile } from "./lib/supabase";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    }).catch(err => {
      console.error("Session fetch error:", err);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (uid: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .single();
    
    if (data) setProfile(data);
    setLoading(false);
  };

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={session ? <Navigate to="/app" /> : <LoginPage />} />
        <Route path="/register" element={session ? <Navigate to="/app" /> : <RegisterPage />} />
        
        <Route path="/app" element={session ? <AppLayout profile={profile} /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard profile={profile} />} />
          <Route path="reports" element={<Reports profile={profile} />} />
          <Route path="reports/create" element={<CreateReport profile={profile} />} />
          <Route path="users" element={<UserManagement profile={profile} />} />
          <Route path="students" element={<StudentData profile={profile} />} />
          <Route path="recap" element={<RecapReport profile={profile} />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

