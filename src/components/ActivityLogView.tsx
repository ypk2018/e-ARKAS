import React, { useState, useMemo } from 'react';
import {
  Activity,
  ShieldCheck,
  UserCheck,
  Receipt,
  FileSpreadsheet,
  Clock,
  Search,
  Filter,
  ExternalLink,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Download,
  Calendar,
  Layers,
  FileText,
  User,
  Users
} from 'lucide-react';
import { ActivityLog, SpjDocument, MonthWorksheet, UserAccount } from '../types';
import { MONTH_NAMES } from '../data/schoolProfile';

interface ActivityLogViewProps {
  logs: ActivityLog[];
  onClearLogs?: () => void;
  onNavigateToSpj: (docId?: string, docType?: string) => void;
  onNavigateToWorksheet: (monthIndex: number) => void;
  onNavigateToTab: (tab: string) => void;
  currentUser: UserAccount;
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({
  logs,
  onClearLogs,
  onNavigateToSpj,
  onNavigateToWorksheet,
  onNavigateToTab,
  currentUser
}) => {
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'KEPSEK' | 'BENDAHARA'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (roleFilter !== 'ALL' && log.actorRole !== roleFilter) {
        return false;
      }
      if (typeFilter !== 'ALL' && log.targetType !== typeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const blob = `${log.actorName} ${log.title} ${log.description} ${log.targetDocNomor || ''}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [logs, roleFilter, typeFilter, searchQuery]);

  const kepsekCount = logs.filter((l) => l.actorRole === 'KEPSEK').length;
  const bendaharaCount = logs.filter((l) => l.actorRole === 'BENDAHARA').length;

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-sibos7-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 md:p-8 rounded-[28px] border border-[#E0DACE] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E0DACE] pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A5A40]/10 text-[#5A5A40] text-xs font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>Sistem Pemantauan Terpadu (Audit Trail & Tracking)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2C2A28]">
              Log Aktivitas & Riwayat Perubahan Bersama
            </h2>
            <p className="text-xs text-[#6B665E] max-w-2xl leading-relaxed">
              Setiap kali <strong className="text-[#5A5A40]">Kepala Sekolah</strong> atau <strong className="text-[#C06E52]">Bendahara</strong> melakukan penambahan, perubahan, maupun penerbitan dokumen belanja SPJ resmi, aktivitas tersebut tercatat secara transparan lengkap dengan tautan link langsung.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportLogs}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F9F7F2] hover:bg-[#F2EDE4] text-[#2C2A28] border border-[#E0DACE] shadow-2xs transition cursor-pointer"
              title="Unduh Catatan Audit Log (JSON)"
            >
              <Download className="w-3.5 h-3.5 text-[#5C5852]" />
              <span>Ekspor Log</span>
            </button>
            {currentUser.role === 'KEPSEK' && onClearLogs && (
              <button
                onClick={() => {
                  if (confirm('Bersihkan seluruh riwayat aktivitas pemantauan?')) {
                    onClearLogs();
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer"
                title="Hapus riwayat (Otoritas Kepala Sekolah)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Log</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E0DACE] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#8C867E] tracking-wider">Total Aktivitas Tercatat</span>
              <div className="text-xl font-serif font-bold text-[#2C2A28]">{logs.length} Tindakan</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#5A5A40]/10 text-[#5A5A40] flex items-center justify-center font-bold text-sm">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E0DACE] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#8C867E] tracking-wider">Aktivitas Bendahara</span>
              <div className="text-xl font-serif font-bold text-[#C06E52]">{bendaharaCount} Tindakan</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#C06E52]/10 text-[#C06E52] flex items-center justify-center font-bold text-sm">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E0DACE] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#8C867E] tracking-wider">Aktivitas Kepala Sekolah</span>
              <div className="text-xl font-serif font-bold text-[#5A5A40]">{kepsekCount} Tindakan</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#5A5A40]/10 text-[#5A5A40] flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 md:p-5 rounded-[24px] border border-[#E0DACE] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-[#8C867E] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#5A5A40]" /> Filter Peran:
          </span>
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              roleFilter === 'ALL'
                ? 'bg-[#2C2A28] text-white shadow-2xs'
                : 'bg-[#F9F7F2] text-[#5C5852] hover:bg-[#E8E2D6] border border-[#E0DACE]'
            }`}
          >
            Semua ({logs.length})
          </button>
          <button
            onClick={() => setRoleFilter('BENDAHARA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              roleFilter === 'BENDAHARA'
                ? 'bg-[#C06E52] text-white shadow-2xs'
                : 'bg-[#F9F7F2] text-[#5C5852] hover:bg-[#E8E2D6] border border-[#E0DACE]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Bendahara ({bendaharaCount})</span>
          </button>
          <button
            onClick={() => setRoleFilter('KEPSEK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              roleFilter === 'KEPSEK'
                ? 'bg-[#5A5A40] text-white shadow-2xs'
                : 'bg-[#F9F7F2] text-[#5C5852] hover:bg-[#E8E2D6] border border-[#E0DACE]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Kepala Sekolah ({kepsekCount})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari aktivitas, nama, no. dokumen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs text-[#2C2A28] placeholder-[#8C867E] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] focus:border-[#5A5A40] transition"
          />
        </div>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white p-6 md:p-8 rounded-[28px] border border-[#E0DACE] shadow-xs space-y-4">
        <h3 className="text-base font-serif font-bold text-[#2C2A28] border-b border-[#E0DACE] pb-3 flex items-center justify-between">
          <span>Daftar Riwayat Perubahan & Perbaikan Terkini</span>
          <span className="text-xs font-sans text-[#8C867E] font-normal">
            Menampilkan {filteredLogs.length} dari {logs.length} catatan
          </span>
        </h3>

        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-[#8C867E] space-y-2">
            <Activity className="w-10 h-10 text-[#C06E52] mx-auto opacity-40" />
            <p className="font-serif text-sm">Belum ada riwayat aktivitas yang sesuai filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const isKepsek = log.actorRole === 'KEPSEK';
              return (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl border border-[#E0DACE] bg-[#FDFBF7] hover:bg-[#F2EDE4]/60 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                        isKepsek ? 'bg-[#5A5A40] text-white' : 'bg-[#C06E52] text-white'
                      }`}
                    >
                      {isKepsek ? <ShieldCheck className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isKepsek ? 'bg-[#5A5A40]/15 text-[#5A5A40]' : 'bg-[#C06E52]/15 text-[#C06E52]'
                          }`}
                        >
                          {isKepsek ? 'Kepala Sekolah' : 'Bendahara'}
                        </span>
                        <span className="text-xs font-bold text-[#2C2A28]">{log.actorName}</span>
                        <span className="text-[10px] text-[#8C867E] flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {log.timestamp}
                        </span>
                      </div>

                      <h4 className="text-xs font-serif font-bold text-[#2C2A28]">{log.title}</h4>
                      <p className="text-[11px] text-[#5C5852] leading-relaxed">{log.description}</p>
                    </div>
                  </div>

                  {/* Interactive Action Links */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0 pt-2 sm:pt-0">
                    {log.targetType === 'spj' && (
                      <button
                        onClick={() => onNavigateToSpj(log.targetDocId, log.targetDocType)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#E8E2D6] text-[#5A5A40] border border-[#D9D1C2] text-xs font-semibold transition cursor-pointer shadow-2xs"
                        title="Buka Dokumen SPJ Resmi Ini"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Buka Dokumen SPJ</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 text-[#8C867E]" />
                      </button>
                    )}

                    {log.targetType === 'worksheet' && typeof log.targetMonthIndex === 'number' && (
                      <button
                        onClick={() => onNavigateToWorksheet(log.targetMonthIndex!)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#E8E2D6] text-[#5A5A40] border border-[#D9D1C2] text-xs font-semibold transition cursor-pointer shadow-2xs"
                        title={`Buka Kertas Kerja Bulan ${MONTH_NAMES[log.targetMonthIndex]}`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Buka Kertas Kerja {MONTH_NAMES[log.targetMonthIndex]}</span>
                        <ArrowRight className="w-3 h-3 ml-0.5 text-[#8C867E]" />
                      </button>
                    )}

                    {log.targetType === 'profile' && (
                      <button
                        onClick={() => onNavigateToTab('identitas')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#E8E2D6] text-[#5A5A40] border border-[#D9D1C2] text-xs font-semibold transition cursor-pointer shadow-2xs"
                      >
                        <span>Lihat Identitas</span>
                        <ArrowRight className="w-3 h-3 ml-0.5" />
                      </button>
                    )}

                    {log.targetType === 'users' && (
                      <button
                        onClick={() => onNavigateToTab('users')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#E8E2D6] text-[#5A5A40] border border-[#D9D1C2] text-xs font-semibold transition cursor-pointer shadow-2xs"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Kelola Akun</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
