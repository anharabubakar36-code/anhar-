import { Profile, supabase } from "../lib/supabase";
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
import { Search, GraduationCap } from "lucide-react";

interface StudentDataProps {
  profile: Profile | null;
}

export default function StudentData({ profile }: StudentDataProps) {
  const [students, setStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "siswa")
        .order("full_name", { ascending: true });
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.kelas?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-purple-900">Data Siswa</h1>
        <p className="text-gray-500">Daftar seluruh siswa SMK Prima Unggul yang terdaftar di sistem.</p>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Search className="w-5 h-5 text-gray-400" />
        <Input 
          placeholder="Cari nama, NIS, atau kelas..." 
          className="border-none focus:ring-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold text-purple-900">NIS</TableHead>
              <TableHead className="font-bold text-purple-900">Nama Lengkap</TableHead>
              <TableHead className="font-bold text-purple-900">Kelas</TableHead>
              <TableHead className="font-bold text-purple-900">Jurusan</TableHead>
              <TableHead className="text-right font-bold text-purple-900">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-500">Data siswa tidak ditemukan.</TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-purple-50/30 transition-colors">
                  <TableCell className="font-mono text-sm text-purple-600">{student.nis || "-"}</TableCell>
                  <TableCell className="font-medium">{student.full_name}</TableCell>
                  <TableCell className="font-bold text-gray-700">{student.kelas || "-"}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                      student.jurusan === 'TKJ' ? 'bg-blue-100 text-blue-700' :
                      student.jurusan === 'RPL' ? 'bg-pink-100 text-pink-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {student.jurusan || "-"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 text-green-600 text-xs font-bold uppercase tracking-widest">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Aktif
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid md:grid-template-columns: repeat(3, 1fr) gap-6">
        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-purple-600 uppercase font-bold tracking-wider">Total Siswa</p>
            <p className="text-2xl font-bold text-purple-900">{students.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
