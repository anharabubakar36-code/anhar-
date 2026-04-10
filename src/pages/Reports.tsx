import { Profile, supabase, Report, FollowUp } from "../lib/supabase";
import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, MessageSquare, History } from "lucide-react";

interface ReportsProps {
  profile: Profile | null;
}

export default function Reports({ profile }: ReportsProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [newFollowUp, setNewFollowUp] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);

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

    const { data, error } = await query;
    if (data) setReports(data as any);
    setLoading(false);
  };

  const fetchFollowUps = async (reportId: string) => {
    const { data } = await supabase
      .from("follow_ups")
      .select("*, handler:profiles(*)")
      .eq("report_id", reportId)
      .order("created_at", { ascending: true });
    
    if (data) setFollowUps(data as any);
  };

  const handleUpdateStatus = async (reportId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("reports")
        .update({ status })
        .eq("id", reportId);
      
      if (error) throw error;
      toast.success("Status laporan diperbarui.");
      fetchReports();
      if (selectedReport?.id === reportId) {
        setSelectedReport({ ...selectedReport, status: status as any });
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleAddFollowUp = async () => {
    if (!selectedReport || !newFollowUp.trim() || !profile) return;

    try {
      const { error } = await supabase
        .from("follow_ups")
        .insert({
          report_id: selectedReport.id,
          handler_id: profile.id,
          content: newFollowUp
        });
      
      if (error) throw error;
      toast.success("Tindak lanjut ditambahkan.");
      setNewFollowUp("");
      fetchFollowUps(selectedReport.id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openDetail = (report: Report) => {
    setSelectedReport(report);
    setIsDetailOpen(true);
  };

  const openFollowUp = (report: Report) => {
    setSelectedReport(report);
    fetchFollowUps(report.id);
    setIsFollowUpOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Laporan Bullying</h1>
          <p className="text-gray-500">Daftar semua laporan tindakan bullying yang masuk.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold text-purple-900">Tanggal</TableHead>
              {profile?.role !== 'siswa' && <TableHead className="font-bold text-purple-900">Pelapor</TableHead>}
              <TableHead className="font-bold text-purple-900">Target</TableHead>
              <TableHead className="font-bold text-purple-900">Lokasi</TableHead>
              <TableHead className="font-bold text-purple-900">Status</TableHead>
              <TableHead className="text-right font-bold text-purple-900">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">Belum ada laporan.</TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-purple-50/30 transition-colors">
                  <TableCell className="text-sm">
                    {new Date(report.created_at).toLocaleDateString()}
                  </TableCell>
                  {profile?.role !== 'siswa' && (
                    <TableCell className="font-medium">{report.reporter?.full_name}</TableCell>
                  )}
                  <TableCell className="font-medium">{report.target_name}</TableCell>
                  <TableCell className="text-sm text-gray-600">{report.incident_location}</TableCell>
                  <TableCell>
                    <Badge className={`uppercase text-[10px] tracking-wider ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                      report.status === 'diproses' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                      report.status === 'selesai' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                      'bg-red-100 text-red-700 hover:bg-red-100'
                    }`}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openDetail(report)} className="text-purple-600 hover:bg-purple-100">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openFollowUp(report)} className="text-pink-600 hover:bg-pink-100">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-purple-900">Detail Laporan</DialogTitle>
            <DialogDescription>Informasi lengkap mengenai tindakan bullying yang dilaporkan.</DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6 py-4">
              <div className="grid grid-template-columns: 1fr 1fr gap-4">
                <div className="space-y-1">
                  <Label className="text-gray-500">Pelapor</Label>
                  <p className="font-bold">{selectedReport.reporter?.full_name || "Siswa"}</p>
                </div>
                <div className="space-y-1 text-right">
                  <Label className="text-gray-500">Status</Label>
                  <div>
                    <Badge className="uppercase">{selectedReport.status}</Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Target Tindakan</Label>
                  <p className="font-bold">{selectedReport.target_name}</p>
                </div>
                <div className="space-y-1 text-right">
                  <Label className="text-gray-500">Tanggal Kejadian</Label>
                  <p className="font-bold">{new Date(selectedReport.incident_date).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Lokasi</Label>
                  <p className="font-bold">{selectedReport.incident_location}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-500">Deskripsi Kejadian</Label>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 leading-relaxed">
                  {selectedReport.description}
                </div>
              </div>

              {profile?.role !== 'siswa' && (
                <div className="space-y-2">
                  <Label className="text-purple-900 font-bold">Update Status</Label>
                  <Select 
                    value={selectedReport.status} 
                    onValueChange={(val) => handleUpdateStatus(selectedReport.id, val)}
                  >
                    <SelectTrigger className="border-purple-200">
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="diproses">Diproses</SelectItem>
                      <SelectItem value="selesai">Selesai</SelectItem>
                      <SelectItem value="ditolak">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Follow Up Dialog */}
      <Dialog open={isFollowUpOpen} onOpenChange={setIsFollowUpOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-purple-900">Tindak Lanjut</DialogTitle>
            <DialogDescription>Respon dan penanganan yang telah diberikan untuk laporan ini.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
              {followUps.length === 0 ? (
                <div className="text-center py-8 text-gray-400 italic">Belum ada tindak lanjut.</div>
              ) : (
                followUps.map((fu) => (
                  <div key={fu.id} className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-purple-900 text-sm">{fu.handler?.full_name}</span>
                      <span className="text-[10px] text-gray-400">{new Date(fu.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-700">{fu.content}</p>
                  </div>
                ))
              )}
            </div>

            {profile?.role !== 'siswa' && (
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <Label className="text-purple-900 font-bold">Tambah Respon Baru</Label>
                <Textarea 
                  placeholder="Tuliskan tindakan atau respon penanganan..." 
                  value={newFollowUp}
                  onChange={(e) => setNewFollowUp(e.target.value)}
                  className="border-purple-200 focus:ring-purple-500"
                />
                <Button 
                  onClick={handleAddFollowUp} 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!newFollowUp.trim()}
                >
                  Kirim Respon
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
