import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  UserCog, 
  LogOut, 
  PlusCircle, 
  History,
  ClipboardList,
  GraduationCap,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Profile, supabase } from "../lib/supabase";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AppLayoutProps {
  profile: Profile | null;
}

export default function AppLayout({ profile }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar.");
    navigate("/");
  };

  const menuItems = [
    { 
      title: "Dashboard", 
      path: "/app", 
      icon: LayoutDashboard, 
      roles: ["admin", "guru", "siswa"] 
    },
    { 
      title: "Laporan Bullying", 
      path: "/app/reports", 
      icon: FileText, 
      roles: ["admin", "guru"] 
    },
    { 
      title: "Buat Laporan", 
      path: "/app/reports/create", 
      icon: PlusCircle, 
      roles: ["siswa"] 
    },
    { 
      title: "Riwayat Laporan", 
      path: "/app/reports", 
      icon: History, 
      roles: ["siswa"] 
    },
    { 
      title: "Rekap Laporan", 
      path: "/app/recap", 
      icon: ClipboardList, 
      roles: ["admin", "guru"] 
    },
    { 
      title: "Data Siswa", 
      path: "/app/students", 
      icon: GraduationCap, 
      roles: ["admin"] 
    },
    { 
      title: "User Management", 
      path: "/app/users", 
      icon: UserCog, 
      roles: ["admin"] 
    },
  ];

  const filteredMenu = menuItems.filter(item => profile && item.roles.includes(profile.role));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-purple-900 text-white w-64 flex-shrink-0 transition-all duration-300 flex flex-col fixed inset-y-0 z-50",
        !isSidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-20"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-purple-800">
          <div className={cn("flex items-center gap-3 overflow-hidden", !isSidebarOpen && "lg:hidden")}>
            <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center font-bold">S</div>
            <span className="font-bold whitespace-nowrap">SMK Prima Unggul</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-purple-200 hover:text-white hover:bg-purple-800 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {filteredMenu.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                location.pathname === item.path 
                  ? "bg-pink-500 text-white" 
                  : "text-purple-200 hover:bg-purple-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={cn("font-medium transition-opacity", !isSidebarOpen && "lg:hidden")}>
                {item.title}
              </span>
              {!isSidebarOpen && (
                <div className="hidden lg:group-hover:block absolute left-20 bg-purple-800 text-white px-3 py-1 rounded shadow-lg text-sm whitespace-nowrap z-50">
                  {item.title}
                </div>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-purple-800">
          <div className={cn("flex items-center gap-3 mb-4", !isSidebarOpen && "lg:hidden")}>
            <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center border border-purple-600">
              <Users className="w-5 h-5 text-purple-200" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{profile?.full_name}</p>
              <p className="text-xs text-purple-400 capitalize">{profile?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-500 hidden lg:flex"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="font-bold text-lg text-purple-900">
              {menuItems.find(i => i.path === location.pathname)?.title || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-gray-900">{profile?.full_name}</p>
              <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-purple-200 text-purple-600 hover:bg-purple-50 gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" /> 
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
