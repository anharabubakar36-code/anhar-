import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import React from "react";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Login berhasil!");
      navigate("/app");
    } catch (error: any) {
      toast.error(error.message || "Login gagal. Periksa kembali email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-purple-900">Selamat Datang</h1>
          <p className="text-gray-500">Sistem Laporan Bullying SMK Prima Unggul</p>
        </div>

        <Card className="border-purple-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-900">Login</CardTitle>
            <CardDescription>Masukkan kredensial Anda untuk mengakses sistem.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nama@sekolah.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-purple-200 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-purple-200 focus:ring-purple-500"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Masuk ke Sistem"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center mt-8 text-sm text-gray-500">
          Belum punya akun? <Link to="/register" className="text-purple-600 font-bold hover:underline">Daftar di sini</Link>
        </p>
      </motion.div>
    </div>
  );
}
