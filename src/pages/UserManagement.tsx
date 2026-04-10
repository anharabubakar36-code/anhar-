import { Profile } from "../lib/supabase";
import { useEffect, useState } from "react";
import React from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserPlus, Edit, Trash2, Search, UserCog } from "lucide-react";

interface UserManagementProps {
  profile: Profile | null;
}

export default function UserManagement({ profile }: UserManagementProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "siswa" as any,
    nis: "",
    kelas: "",
    jurusan: "" as any
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setUsers(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("User berhasil ditambahkan.");
      setIsAddOpen(false);
      fetchUsers();
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("User berhasil diperbarui.");
      setIsEditOpen(false);
      fetchUsers();
      resetForm();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("User berhasil dihapus.");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      full_name: "",
      role: "siswa",
      nis: "",
      kelas: "",
      jurusan: ""
    });
    setSelectedUser(null);
  };

  const openEdit = (user: any) => {
    setSelectedUser(user);
    setFormData({
      email: user.email || "",
      password: "", // Password not editable for security
      full_name: user.profile?.full_name || "",
      role: user.profile?.role || "siswa",
      nis: user.profile?.nis || "",
      kelas: user.profile?.kelas || "",
      jurusan: user.profile?.jurusan || ""
    });
    setIsEditOpen(true);
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">User Management</h1>
          <p className="text-gray-500">Kelola semua pengguna sistem dan sinkronisasi dengan Supabase Auth.</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setIsAddOpen(true); }} 
          className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
        >
          <UserPlus className="w-4 h-4" /> Tambah User
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Search className="w-5 h-5 text-gray-400" />
        <Input 
          placeholder="Cari email atau nama..." 
          className="border-none focus:ring-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold text-purple-900">Nama Lengkap</TableHead>
              <TableHead className="font-bold text-purple-900">Email</TableHead>
              <TableHead className="font-bold text-purple-900">Role</TableHead>
              <TableHead className="font-bold text-purple-900">NIS / Kelas</TableHead>
              <TableHead className="text-right font-bold text-purple-900">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-500">User tidak ditemukan.</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-purple-50/30 transition-colors">
                  <TableCell className="font-medium">{user.profile?.full_name}</TableCell>
                  <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                      user.profile?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.profile?.role === 'guru' ? 'bg-pink-100 text-pink-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {user.profile?.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {user.profile?.role === 'siswa' ? `${user.profile?.nis} / ${user.profile?.kelas}` : '-'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(user)} className="text-purple-600 hover:bg-purple-100">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:bg-red-100">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddOpen || isEditOpen} onOpenChange={(open) => { if (!open) { setIsAddOpen(false); setIsEditOpen(false); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-purple-900 flex items-center gap-2">
              <UserCog className="w-6 h-6 text-pink-500" /> {isAddOpen ? "Tambah User Baru" : "Edit User"}
            </DialogTitle>
            <DialogDescription>
              {isAddOpen ? "Buat akun baru untuk siswa, guru, atau admin." : "Perbarui informasi akun pengguna."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={isAddOpen ? handleAddUser : handleEditUser} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="border-purple-200"
              />
            </div>
            {isAddOpen && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="border-purple-200"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input 
                id="full_name" 
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                className="border-purple-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(val) => setFormData({ ...formData, role: val })}
              >
                <SelectTrigger className="border-purple-200">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="guru">Guru</SelectItem>
                  <SelectItem value="siswa">Siswa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === "siswa" && (
              <div className="grid grid-template-columns: 1fr 1fr gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nis">NIS</Label>
                  <Input 
                    id="nis" 
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="border-purple-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kelas">Kelas</Label>
                  <Input 
                    id="kelas" 
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="border-purple-200"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="jurusan">Jurusan</Label>
                  <Select 
                    value={formData.jurusan} 
                    onValueChange={(val) => setFormData({ ...formData, jurusan: val })}
                  >
                    <SelectTrigger className="border-purple-200">
                      <SelectValue placeholder="Pilih Jurusan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TKJ">TKJ</SelectItem>
                      <SelectItem value="RPL">RPL</SelectItem>
                      <SelectItem value="Multimedia">Multimedia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                {isAddOpen ? "Simpan User" : "Perbarui User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
