import React from 'react';
import { Calendar, Printer, Download, Search, Landmark, ShieldCheck, UserCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { MONTH_NAMES } from '../data/schoolProfile';
import { formatRp } from '../utils/formatters';
import { SchoolProfile, UserAccount } from '../types';

interface NavbarProps {
  currentTab: string;
  selectedMonth: number;
  onSelectMonth: (m: number) => void;
  monthlyTotal: number;
  totalPenerimaan: number;
  grandTotalBelanja: number;
  school: SchoolProfile;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onPrintWorksheet: () => void;
  onExportJSON: () => void;
  currentUser?: UserAccount;
  onOpenUserManagement?: () => void;
  lastSavedTime?: string;
  isAutoSaving?: boolean;
  onManualSync?: () => void;
  isSyncing?: boolean;
  syncPeer?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  selectedMonth,
  onSelectMonth,
  monthlyTotal,
  totalPenerimaan,
  grandTotalBelanja,
  school,
  searchQuery,
  onSearchChange,
  onPrintWorksheet,
  onExportJSON,
  currentUser,
  onOpenUserManagement,
  lastSavedTime,
  isAutoSaving,
  onManualSync,
  isSyncing,
  syncPeer
}) => {
  return (
    <header className="sticky top-0 z-20 bg-[#F2EDE4] border-b border-[#E0DACE] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
      {/* Left: Month selector, Search, Auto-save & Live Sync */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-[#E8E2D6] p-1 rounded-xl border border-[#D9D1C2]">
          <Calendar className="w-4 h-4 ml-2 text-[#5A5A40]" />
          <select
            id="navbar-month-select"
            value={selectedMonth}
            onChange={(e) => onSelectMonth(parseInt(e.target.value, 10))}
            className="bg-transparent text-xs font-semibold text-[#2C2A28] py-1.5 px-2.5 focus:outline-none cursor-pointer"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={idx} value={idx}>
                {name} 2026
              </option>
            ))}
          </select>
        </div>

        {/* Search filter input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="navbar-search-input"
            type="text"
            placeholder="Cari Tema / Subtema / Uraian / Rekening..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs text-[#2C2A28] placeholder-[#8C867E] w-56 md:w-64 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] focus:border-[#5A5A40] transition"
          />
        </div>

        {/* Real-time Collaborative Synchronization Badge (Kepsek <-> Bendahara) */}
        <button
          type="button"
          id="btn-navbar-live-sync"
          onClick={onManualSync}
          title={`Sinkronisasi 2 arah otomatis aktif.\nJika Kepala Sekolah mengisi/mengubah data, langsung otomatis tampil di Bendahara, dan sebaliknya.${syncPeer ? `\nTerakhir disinkronkan oleh: ${syncPeer}` : ''}\nKlik untuk menyinkronkan data sekarang.`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 text-[11px] font-bold text-emerald-900 shadow-2xs transition active:scale-95 cursor-pointer"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="hidden lg:inline">Sinkron Otomatis (Kepsek ↔ Bendahara)</span>
          <span className="lg:hidden">Live Sync</span>
          {isSyncing ? (
            <RefreshCw className="w-3 h-3 text-emerald-700 animate-spin ml-0.5" />
          ) : (
            <RefreshCw className="w-2.5 h-2.5 text-emerald-600 opacity-60 ml-0.5" />
          )}
        </button>

        {/* Real-time Auto-Save Status Badge */}
        <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EAE4D8] border border-[#D9D1C2] text-[10px] font-medium text-[#5C5852]">
          {isAutoSaving ? (
            <RefreshCw className="w-3 h-3 text-[#5A5A40] animate-spin" />
          ) : (
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
          )}
          <span>
            {isAutoSaving ? 'Menyimpan...' : `Tersimpan ${lastSavedTime ? `(${lastSavedTime})` : ''}`}
          </span>
        </div>
      </div>

      {/* Right: Quick KPI badges and actions */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 bg-[#FDFBF7] border border-[#E0DACE] px-3.5 py-1.5 rounded-xl shadow-xs">
          <Landmark className="w-4 h-4 text-[#C06E52] shrink-0" />
          <div className="text-right leading-tight">
            <div className="text-[10px] text-[#8C867E] uppercase font-bold tracking-wider">Penerimaan TA 2026</div>
            <div className="text-xs font-bold text-[#2C2A28]">
              {formatRp(totalPenerimaan)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#5A5A40] text-white px-3.5 py-1.5 rounded-xl shadow-xs">
          <div className="text-right leading-tight">
            <div className="text-[10px] text-[#E0DACE] font-medium uppercase tracking-wider">
              Belanja {MONTH_NAMES[selectedMonth]}
            </div>
            <div className="text-xs font-bold text-white">
              {formatRp(monthlyTotal)}
            </div>
          </div>
        </div>

        <button
          id="btn-navbar-print"
          onClick={onPrintWorksheet}
          className="flex items-center gap-1.5 bg-[#5A5A40] hover:bg-[#484832] text-white font-medium px-4 py-2 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
          title="Cetak atau Simpan PDF Kertas Kerja Bulanan (Format Resmi A4)"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">Cetak / Simpan PDF</span>
        </button>

        <button
          id="btn-navbar-export"
          onClick={onExportJSON}
          className="p-2 text-[#5C5852] hover:text-[#2C2A28] bg-[#E8E2D6] hover:bg-[#D9D1C2] border border-[#D9D1C2] rounded-xl text-xs transition cursor-pointer"
          title="Cadangkan Data Aplikasi (JSON)"
        >
          <Download className="w-4 h-4" />
        </button>

        {currentUser && (
          <button
            type="button"
            onClick={onOpenUserManagement}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
              currentUser.role === 'KEPSEK'
                ? 'bg-[#5A5A40]/10 border-[#5A5A40]/30 text-[#2C2A28] hover:bg-[#5A5A40]/20'
                : 'bg-[#C06E52]/10 border-[#C06E52]/30 text-[#2C2A28] hover:bg-[#C06E52]/20'
            }`}
            title="Buka Pengaturan Akun & Otoritas"
          >
            {currentUser.role === 'KEPSEK' ? (
              <ShieldCheck className="w-4 h-4 text-[#5A5A40]" />
            ) : (
              <UserCheck className="w-4 h-4 text-[#C06E52]" />
            )}
            <span className="hidden md:inline font-bold">
              {currentUser.role === 'KEPSEK' ? 'Kepsek' : 'Bendahara'}
            </span>
          </button>
        )}
      </div>
    </header>
  );
};

