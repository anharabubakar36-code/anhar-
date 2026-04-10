import { Profile, supabase, Report } from "../lib/supabase";
import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Download, Filter, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface RecapReportProps {
  profile: Profile | null;
}

export default function RecapReport({ profile }: RecapReportProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    startDate: "",
    endDate: "",
    searchTerm: ""
  });

  useEffect(() => {
    fetchReports();
  }, [profile]);

  const fetchReports = async () => {
    if (!profile) return;
    
    let query = supabase
      .from("reports")
      .select("*, reporter:profiles(*)")
      .order("created_at", { ascending: false });
    
    if (profile.role === "siswa") {
      query = query.eq("reporter_id", profile.id);
    }

    const { data } = await query;
    if (data) setReports(data as any);
    setLoading(false);
  };

  const filteredReports = reports.filter(r => {
    const matchesStatus = filters.status === "all" || r.status === filters.status;
    const matchesSearch = r.target_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         r.reporter?.full_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         r.incident_location.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const reportDate = new Date(r.created_at);
    const matchesStartDate = !filters.startDate || reportDate >= new Date(filters.startDate);
    const matchesEndDate = !filters.endDate || reportDate <= new Date(filters.endDate);

    return matchesStatus && matchesSearch && matchesStartDate && matchesEndDate;
  });

  const stats = {
    total: filteredReports.length,
    selesai: filteredReports.filter(r => r.status === 'selesai').length,
    diproses: filteredReports.filter(r => r.status === 'diproses').length,
    pending: filteredReports.filter(r => r.status === 'pending').length,
  };

  const handleExport = () => {
    // In a real app, this would generate a CSV or PDF
    alert("Fitur ekspor laporan sedang dalam pengembangan.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Rekap Laporan</h1>
          <p className="text-gray-500">Analisis dan filter data laporan tindakan bullying.</p>
        </div>
        <Button onClick={handleExport} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
          <Download className="w-4 h-4" /> Ekspor Data
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-template-columns: repeat(1, 1fr) md:grid-template-columns: repeat(4, 1fr) gap-6">
        <Card className="border-purple-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Filtered</p>
                <p className="text-2xl font-bold text-purple-900">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Selesai</p>
                <p className="text-2xl font-bold text-green-700">{stats.selesai}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Diproses</p>
                <p className="text-2xl font-bold text-blue-700">{stats.diproses}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-100 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
              </div>
              <XCircle className="w-8 h-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 text-purple-900 font-bold mb-2">
          <Filter className="w-5 h-5" /> Filter Laporan
        </div>
        <div className="grid grid-template-columns: 1fr md:grid-template-columns: repeat(4, 1fr) gap-4">
          <div className="space-y-2">
            <Label>Cari</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Target, pelapor, lokasi..." 
                className="pl-9 border-purple-100"
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={filters.status} 
              onValueChange={(val) => setFilters({ ...filters, status: val })}
            >
              <SelectTrigger className="border-purple-100">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="diproses">Diproses</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
                <SelectItem value="ditolak">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Dari Tanggal</Label>
            <Input 
              type="date" 
              className="border-purple-100"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Sampai Tanggal</Label>
            <Input 
              type="date" 
              className="border-purple-100"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold text-purple-900">Tanggal</TableHead>
              <TableHead className="font-bold text-purple-900">Pelapor</TableHead>
              <TableHead className="font-bold text-purple-900">Target</TableHead>
              <TableHead className="font-bold text-purple-900">Lokasi</TableHead>
              <TableHead className="font-bold text-purple-900">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-500">Tidak ada data yang cocok dengan filter.</TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-purple-50/30 transition-colors">
                  <TableCell className="text-sm">
                    {new Date(report.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{report.reporter?.full_name}</TableCell>
                  <TableCell className="font-medium">{report.target_name}</TableCell>
                  <TableCell className="text-sm text-gray-600">{report.incident_location}</TableCell>
                  <TableCell>
                    <Badge className={`uppercase text-[10px] tracking-wider ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      report.status === 'diproses' ? 'bg-blue-100 text-blue-700' :
                      report.status === 'selesai' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {report.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
