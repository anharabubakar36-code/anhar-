import { Profile, supabase, Report } from "../lib/supabase";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  ArrowUpRight
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  profile: Profile | null;
}

export default function Dashboard({ profile }: DashboardProps) {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    diproses: 0,
    selesai: 0,
    ditolak: 0
  });
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentReports();
  }, [profile]);

  const fetchStats = async () => {
    if (!profile) return;
    
    let query = supabase.from("reports").select("*", { count: "exact", head: true });
    
    if (profile.role === "siswa") {
      query = query.eq("reporter_id", profile.id);
    }

    const { count: total } = await query;
    const { count: pending } = await query.eq("status", "pending");
    const { count: diproses } = await query.eq("status", "diproses");
    const { count: selesai } = await query.eq("status", "selesai");
    const { count: ditolak } = await query.eq("status", "ditolak");

    setStats({
      total: total || 0,
      pending: pending || 0,
      diproses: diproses || 0,
      selesai: selesai || 0,
      ditolak: ditolak || 0
    });
  };

  const fetchRecentReports = async () => {
    if (!profile) return;
    
    let query = supabase
      .from("reports")
      .select("*, reporter:profiles(*)")
      .order("created_at", { ascending: false })
      .limit(5);
    
    if (profile.role === "siswa") {
      query = query.eq("reporter_id", profile.id);
    }

    const { data } = await query;
    if (data) setRecentReports(data as any);
    setLoading(false);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-purple-900">Halo, {profile?.full_name}!</h1>
        <p className="text-gray-500">Selamat datang di dashboard {profile?.role} Sistem Laporan Bullying.</p>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-template-columns: repeat(1, 1fr) md:grid-template-columns: repeat(2, 1fr) lg:grid-template-columns: repeat(4, 1fr) gap-6"
      >
        <motion.div variants={item}>
          <Card className="border-purple-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Laporan</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.total}</div>
              <p className="text-xs text-gray-400 mt-1">Laporan masuk sistem</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
              <p className="text-xs text-gray-400 mt-1">Menunggu verifikasi</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Diproses</CardTitle>
              <AlertTriangle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{stats.diproses}</div>
              <p className="text-xs text-gray-400 mt-1">Sedang ditangani</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-green-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Selesai</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{stats.selesai}</div>
              <p className="text-xs text-gray-400 mt-1">Kasus terselesaikan</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid lg:grid-template-columns: 2fr 1fr gap-8">
        {/* Recent Reports */}
        <Card className="border-purple-50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-purple-900">Laporan Terbaru</CardTitle>
            <Link to="/app/reports">
              <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 gap-1">
                Lihat Semua <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : recentReports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Belum ada laporan yang masuk.
              </div>
            ) : (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        report.status === 'diproses' ? 'bg-blue-100 text-blue-600' :
                        report.status === 'selesai' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{report.target_name}</p>
                        <p className="text-xs text-gray-500">
                          {profile?.role !== 'siswa' ? `Oleh: ${report.reporter?.full_name}` : `Lokasi: ${report.incident_location}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        report.status === 'diproses' ? 'bg-blue-100 text-blue-700' :
                        report.status === 'selesai' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {report.status}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-purple-900 text-white border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">Butuh Bantuan?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-purple-200">
                Jika Anda melihat atau mengalami tindakan bullying, jangan ragu untuk melapor. Identitas Anda akan dirahasiakan.
              </p>
              {profile?.role === 'siswa' && (
                <Link to="/app/reports/create">
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white border-none">
                    Buat Laporan Baru
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card className="border-purple-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-purple-900">Info Sekolah</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm text-gray-600">SMK Prima Unggul</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm text-gray-600">Bebas Bullying</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
