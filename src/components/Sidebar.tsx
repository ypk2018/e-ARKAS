import React from 'react';
import {
  LayoutDashboard,
  TableProperties,
  Layers,
  Receipt,
  FileSpreadsheet,
  Archive,
  School,
  FileText,
  CreditCard,
  FileCheck2,
  FileClock,
  Sparkles,
  CheckCircle2,
  Users,
  LogOut,
  ShieldCheck,
  UserCheck,
  GitCompare
} from 'lucide-react';
import { SchoolProfile, UserAccount } from '../types';
import { SchoolLogo } from './SchoolLogo';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  school: SchoolProfile;
  docsCount: number;
  selectedMonth: number;
  onSelectMonth: (m: number) => void;
  currentUser: UserAccount;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  school,
  docsCount,
  currentUser,
  onLogout
}) => {
  const isKepsek = currentUser.role === 'KEPSEK';

  const navItems = [
    { id: 'dashboard', label: 'Beranda & Ringkasan', icon: LayoutDashboard, badge: '2026' },
    { id: 'kertas-kerja', label: 'Kertas Kerja Bulanan (Murni)', icon: TableProperties, highlight: true },
    { id: 'arkas-perubahan', label: 'ARKAS PERUBAHAN', icon: GitCompare, badge: 'PERUBAHAN', badgeColor: 'bg-[#059669]' },
    { id: 'rekap-perubahan', label: 'Rekap ARKAS Perubahan', icon: FileSpreadsheet, badge: 'REKAP', badgeColor: 'bg-[#047857]' },
    { id: 'tema-explorer', label: 'Penjelajah Tema & Subtema', icon: Layers },
    { id: 'rekap', label: 'Rekapitulasi 8 Standar (Murni)', icon: FileSpreadsheet },
  ];

  const spjItems = [
    { id: 'kwitansi', label: 'Kwitansi Resmi BOSP', icon: Receipt },
    { id: 'daftar', label: 'Daftar Pembayaran Honor', icon: FileText },
    { id: 'nota', label: 'Nota Pembelian Toko', icon: FileCheck2 },
    { id: 'faktur', label: 'Faktur Barang & Jasa', icon: FileClock },
    { id: 'bkk', label: 'Bukti Kas Keluar (BKK)', icon: CreditCard },
    { id: 'berita', label: 'Berita Acara Pembayaran', icon: FileText },
    { id: 'sptj', label: 'SPTJ Belanja', icon: FileCheck2 },
  ];

  const systemItems = [
    { id: 'arsip', label: 'Arsip Dokumen SPJ', icon: Archive, badge: docsCount > 0 ? `${docsCount}` : undefined },
    { id: 'identitas', label: 'Identitas Sekolah & Pejabat', icon: School },
    {
      id: 'users',
      label: isKepsek ? 'Kelola Akun & Bendahara' : 'Hak Akses & Otoritas',
      icon: Users,
      badge: isKepsek ? 'ADMIN' : undefined,
      badgeColor: isKepsek ? 'bg-[#5A5A40]' : undefined
    }
  ];

  return (
    <aside className="w-72 bg-[#F9F7F2] text-[#3E3C3A] flex flex-col h-screen sticky top-0 shrink-0 border-r border-[#E0DACE] shadow-sm z-30 select-none overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E0DACE] bg-[#F2EDE4]">
        <div className="flex items-center gap-3">
          <SchoolLogo size={44} className="shrink-0 drop-shadow-sm" />
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C06E52]">
              BOSP {school.tahunAnggaran}
            </div>
            <h1 className="text-sm font-serif font-bold text-[#2C2A28] truncate leading-tight mt-0.5">
              {school.nama}
            </h1>
            <p className="text-[11px] text-[#8C867E] truncate font-sans">
              NPSN: {school.npsn}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="p-4 space-y-6 flex-1">
        {/* Core Menu */}
        <div>
          <div className="px-2 mb-2.5 text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C867E]">
            KERTAS KERJA & ANGGARAN
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#E8E2D6] text-[#2C2A28] border border-[#D9D1C2] font-semibold shadow-xs'
                      : 'text-[#5C5852] hover:bg-[#E8E2D6]/60 hover:text-[#2C2A28]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#5A5A40]' : 'text-[#8C867E]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-[#5A5A40] text-white'
                        : item.badgeColor
                        ? `${item.badgeColor} text-white`
                        : 'bg-[#E0DACE] text-[#5C5852]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* SPJ Generator Menu */}
        <div>
          <div className="px-2 mb-2.5 text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C867E] flex items-center justify-between">
            <span>DOKUMEN SPJ RESMI</span>
            <span className="text-[9px] text-[#C06E52] font-semibold lowercase tracking-normal">a4 siap cetak</span>
          </div>
          <nav className="space-y-1">
            {spjItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#E8E2D6] text-[#2C2A28] border border-[#D9D1C2] font-semibold shadow-xs'
                      : 'text-[#5C5852] hover:bg-[#E8E2D6]/60 hover:text-[#2C2A28]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#5A5A40]' : 'text-[#8C867E]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* System / Master */}
        <div>
          <div className="px-2 mb-2.5 text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C867E]">
            ARSIP & PENGATURAN
          </div>
          <nav className="space-y-1">
            {systemItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#E8E2D6] text-[#2C2A28] border border-[#D9D1C2] font-semibold shadow-xs'
                      : 'text-[#5C5852] hover:bg-[#E8E2D6]/60 hover:text-[#2C2A28]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#5A5A40]' : 'text-[#8C867E]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.badgeColor || (isActive ? 'bg-[#5A5A40] text-white' : 'bg-[#C06E52] text-white')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Natural Theme Informational Card */}
        <div className="p-3.5 bg-[#C06E5215] rounded-2xl border border-[#C06E5230]">
          <p className="text-[11px] text-[#8B4513] leading-relaxed font-serif italic">
            Tema 8 Standar Nasional Pendidikan terintegrasi penuh dengan seluruh kertas kerja 12 bulan dan berkas SPJ.
          </p>
        </div>
      </div>

      {/* Footer Info: User Account & Logout */}
      <div className="p-4 border-t border-[#E0DACE] bg-[#F2EDE4] text-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs ${
              isKepsek ? 'bg-[#5A5A40]' : 'bg-[#C06E52]'
            }`}>
              {isKepsek ? <ShieldCheck className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                  isKepsek ? 'bg-[#5A5A40] text-white' : 'bg-[#C06E52] text-white'
                }`}>
                  {isKepsek ? 'KEPSEK' : 'BENDAHARA'}
                </span>
              </div>
              <div className="text-[#2C2A28] font-serif font-bold text-xs truncate leading-tight mt-0.5">
                {currentUser.nama}
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-[#D9D1C2] hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-[#6B665E] text-[11px] font-medium transition cursor-pointer"
          title="Keluar dari sesi login"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
};

