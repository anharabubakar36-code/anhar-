import { Profile, supabase } from "../lib/supabase";
import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShieldAlert, Send, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface CreateReportProps {
  profile: Profile | null;
}

export default function CreateReport({ profile }: CreateReportProps) {
  const [formData, setFormData] = useState({
    target_name: "",
    incident_date: "",
    incident_location: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("reports")
        .insert({
          reporter_id: profile.id,
          ...formData,
          status: "pending"
        });
      
      if (error) throw error;
      toast.success("Laporan berhasil dikirim. Guru akan segera meninjau.");
      navigate("/app/reports");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="text-purple-600 hover:bg-purple-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-purple-900">Buat Laporan Baru</h1>
            <p className="text-gray-500">Laporkan tindakan bullying yang Anda alami atau saksikan.</p>
          </div>
        </div>

        <Card className="border-purple-100 shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-500" />
          <CardHeader>
            <CardTitle className="text-xl text-purple-900 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-pink-500" /> Form Laporan Bullying
            </CardTitle>
            <CardDescription>
              Isi data di bawah ini dengan jujur. Identitas Anda akan dirahasiakan oleh pihak sekolah.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-template-columns: 1fr 1fr gap-6">
                <div className="space-y-2">
                  <Label htmlFor="target_name">Nama Target / Korban</Label>
                  <Input 
                    id="target_name" 
                    placeholder="Nama lengkap..." 
                    value={formData.target_name}
                    onChange={(e) => setFormData({ ...formData, target_name: e.target.value })}
                    required
                    className="border-purple-200 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incident_date">Tanggal Kejadian</Label>
                  <Input 
                    id="incident_date" 
                    type="date" 
                    value={formData.incident_date}
                    onChange={(e) => setFormData({ ...formData, incident_date: e.target.value })}
                    required
                    className="border-purple-200 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="incident_location">Lokasi Kejadian</Label>
                <Input 
                  id="incident_location" 
                  placeholder="Contoh: Kantin, Kelas X RPL 1, Lapangan..." 
                  value={formData.incident_location}
                  onChange={(e) => setFormData({ ...formData, incident_location: e.target.value })}
                  required
                  className="border-purple-200 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Kejadian</Label>
                <Textarea 
                  id="description" 
                  placeholder="Ceritakan kronologi kejadian secara detail..." 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="min-h-[150px] border-purple-200 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-400 italic">
                  *Sertakan waktu kejadian jika memungkinkan.
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-100 p-6">
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg gap-2"
                disabled={loading}
              >
                {loading ? "Mengirim Laporan..." : (
                  <>
                    Kirim Laporan <Send className="w-5 h-5" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 bg-pink-50 p-6 rounded-2xl border border-pink-100">
          <h4 className="font-bold text-pink-700 mb-2">Penting!</h4>
          <p className="text-sm text-pink-600 leading-relaxed">
            Setiap laporan yang masuk akan diverifikasi oleh Guru BK dan Admin. Laporan palsu atau penyalahgunaan sistem dapat dikenakan sanksi sesuai peraturan sekolah.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
