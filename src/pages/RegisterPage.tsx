import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UserPlus, ArrowLeft } from "lucide-react";
import React from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    nis: "",
    kelas: "",
    jurusan: "" as any
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Sign up user in Supabase Auth
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!user) throw new Error("Registrasi gagal. Silakan coba lagi.");

      // 2. Create profile in profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          full_name: formData.full_name,
          role: "siswa", // Default role for self-registration
          nis: formData.nis,
          kelas: formData.kelas,
          jurusan: formData.jurusan
        });

      if (profileError) throw profileError;

      toast.success("Registrasi berhasil! Silakan cek email Anda untuk verifikasi (jika diaktifkan) atau silakan login.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col items-center justify-center p-4 py-12">
      <Link to="/login" className="mb-8 flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Login
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
            <UserPlus className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-purple-900">Daftar Akun Siswa</h1>
          <p className="text-gray-500 text-center">Lengkapi data diri Anda untuk mulai menggunakan sistem.</p>
        </div>

        <Card className="border-purple-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-900">Registrasi</CardTitle>
            <CardDescription>Silakan isi formulir pendaftaran di bawah ini.</CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nama Lengkap</Label>
                <Input 
                  id="full_name" 
                  placeholder="Masukkan nama lengkap Anda" 
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  className="border-purple-200 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nama@email.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-purple-200 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="border-purple-200 focus:ring-purple-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nis">NIS</Label>
                  <Input 
                    id="nis" 
                    placeholder="NIS Anda" 
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    required
                    className="border-purple-200 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kelas">Kelas</Label>
                  <Input 
                    id="kelas" 
                    placeholder="Contoh: X RPL 1" 
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    required
                    className="border-purple-200 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jurusan">Jurusan</Label>
                <Select 
                  value={formData.jurusan} 
                  onValueChange={(val) => setFormData({ ...formData, jurusan: val })}
                  required
                >
                  <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                    <SelectValue placeholder="Pilih Jurusan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TKJ">TKJ</SelectItem>
                    <SelectItem value="RPL">RPL</SelectItem>
                    <SelectItem value="Multimedia">Multimedia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg"
                disabled={loading}
              >
                {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
              </Button>
              <p className="text-center text-sm text-gray-500">
                Sudah punya akun? <Link to="/login" className="text-purple-600 font-bold hover:underline">Login di sini</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
