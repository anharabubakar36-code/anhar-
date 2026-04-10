import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ShieldAlert, Users, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-purple-100 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="font-bold text-xl text-purple-900">SMK Prima Unggul</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#about" className="hover:text-purple-600 transition-colors">Tentang</a>
            <a href="#jurusan" className="hover:text-purple-600 transition-colors">Jurusan</a>
            <a href="#prevention" className="hover:text-purple-600 transition-colors">Pencegahan</a>
            <Link to="/register" className="hover:text-purple-600 transition-colors">Daftar</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full px-6">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 shadow-lg shadow-purple-200">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-template-columns: 1fr 1fr gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-purple-900 leading-tight mb-6">
              Bersama Lawan <span className="text-pink-500">Bullying</span> di Sekolah
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Sistem pelaporan tindakan bullying SMK Prima Unggul. Ciptakan lingkungan belajar yang aman, nyaman, dan penuh rasa hormat untuk semua.
            </p>
            <div className="flex gap-4">
              <Link to="/login">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8">
                  Laporkan Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 rounded-full px-8">
                  Daftar Akun
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://picsum.photos/seed/school/800/800" 
                alt="School Environment" 
                className="w-full h-full object-cover mix-blend-overlay opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldAlert className="w-32 h-32 text-purple-600 opacity-20" />
              </div>
            </div>
            {/* Floating Cards */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-purple-50 max-w-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-pink-600" />
                </div>
                <span className="font-bold text-purple-900">Komunitas Aman</span>
              </div>
              <p className="text-sm text-gray-500">Melindungi setiap siswa dari segala bentuk intimidasi.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-12">Profil SMK Prima Unggul</h2>
          <div className="grid md:grid-template-columns: repeat(3, 1fr) gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-purple-900 mb-4">Visi & Misi</h3>
              <p className="text-gray-600">Menjadi lembaga pendidikan kejuruan yang unggul, berkarakter, dan bebas dari segala bentuk kekerasan.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-purple-100">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-6 mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-purple-900 mb-4">Lingkungan Inklusif</h3>
              <p className="text-gray-600">Menghargai perbedaan dan membangun solidaritas antar siswa dari berbagai latar belakang.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-purple-900 mb-4">Zero Tolerance</h3>
              <p className="text-gray-600">Kebijakan tegas terhadap tindakan bullying untuk menjamin keamanan seluruh warga sekolah.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Jurusan Section */}
      <section id="jurusan" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">Jurusan Unggulan</h2>
            <p className="text-gray-600">Mempersiapkan generasi digital yang kompeten dan beretika.</p>
          </div>
          <div className="grid md:grid-template-columns: repeat(3, 1fr) gap-8">
            {['TKJ', 'RPL', 'Multimedia'].map((item, index) => (
              <motion.div 
                key={item}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-3xl aspect-[4/5]"
              >
                <img 
                  src={`https://picsum.photos/seed/${item}/600/800`} 
                  alt={item} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent flex flex-col justify-end p-8">
                  <span className="text-pink-400 font-bold mb-2">0{index + 1}</span>
                  <h3 className="text-2xl font-bold text-white mb-2">{item}</h3>
                  <p className="text-purple-100 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item === 'TKJ' && 'Teknik Komputer & Jaringan'}
                    {item === 'RPL' && 'Rekayasa Perangkat Lunak'}
                    {item === 'Multimedia' && 'Desain Komunikasi Visual'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prevention Section */}
      <section id="prevention" className="py-20 bg-purple-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Pentingnya Pencegahan Bullying</h2>
          <p className="text-xl text-purple-200 mb-12 leading-relaxed">
            Bullying bukan sekadar "candaan". Dampaknya bisa merusak kesehatan mental, menurunkan prestasi akademik, hingga trauma jangka panjang. Di SMK Prima Unggul, kami berkomitmen untuk mendengarkan setiap suara dan menindaklanjuti setiap laporan dengan serius.
          </p>
          <div className="grid grid-template-columns: repeat(2, 1fr) md:grid-template-columns: repeat(4, 1fr) gap-8">
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">100%</div>
              <div className="text-sm text-purple-300 uppercase tracking-wider font-medium">Kerahasiaan</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">24/7</div>
              <div className="text-sm text-purple-300 uppercase tracking-wider font-medium">Akses Laporan</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">Fast</div>
              <div className="text-sm text-purple-300 uppercase tracking-wider font-medium">Respon Guru</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">Safe</div>
              <div className="text-sm text-purple-300 uppercase tracking-wider font-medium">Environment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="font-bold text-purple-900">SMK Prima Unggul</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 SMK Prima Unggul. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
