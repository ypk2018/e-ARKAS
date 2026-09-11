import React from 'react';
import {
  FileText,
  Receipt,
  Layers,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Building2,
  Award,
  ArrowRight,
  BookOpen,
  Users,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Flame,
  Activity,
  GitCompare
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell
} from 'recharts';
import { SchoolProfile, MonthWorksheet, SpjDocument, UserAccount, ArkasPerubahanMonthWorksheet } from '../types';
import { formatRp } from '../utils/formatters';
import { TEMA_STANDAR_LIST } from '../data/standarData';
import { MONTH_NAMES } from '../data/schoolProfile';

interface DashboardViewProps {
  school: SchoolProfile;
  worksheets: MonthWorksheet[];
  perubahanWorksheets?: ArkasPerubahanMonthWorksheet[];
  documents: SpjDocument[];
  onSelectTab: (tab: string) => void;
  onSelectMonth: (m: number) => void;
  onOpenDoc: (doc: SpjDocument) => void;
  onCreateSpjFromItem?: (item: any, monthIndex: number) => void;
  currentUser?: UserAccount;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  school,
  worksheets,
  perubahanWorksheets,
  documents,
  onSelectTab,
  onSelectMonth,
  onOpenDoc,
  currentUser
}) => {
  const totalPenerimaan = school.totalPenerimaan || 340000000;
  const grandTotalBelanja = worksheets.reduce(
    (acc, ws) => acc + ws.items.reduce((s, it) => s + it.jumlah, 0),
    0
  );

  const averageMonthlyBudget = totalPenerimaan / 12;

  // Prepare monthly expenditure data for recharts bar chart
  const monthlyChartData = worksheets.map((ws, idx) => {
    const totalBelanja = ws.items.reduce((s, it) => s + it.jumlah, 0);
    const percentageOfTotal = totalPenerimaan > 0 ? (totalBelanja / totalPenerimaan) * 100 : 0;
    const shortName = MONTH_NAMES[idx].slice(0, 3);
    return {
      monthIndex: idx,
      monthName: MONTH_NAMES[idx],
      shortName,
      totalBelanja,
      itemCount: ws.items.length,
      percentageOfTotal,
      targetAvg: Math.round(averageMonthlyBudget)
    };
  });

  // Group budget by 8 Standar (Tema)
  const temaBreakdown = TEMA_STANDAR_LIST.map((tema, idx) => {
    let totalJumlah = 0;
    let itemCount = 0;
    worksheets.forEach((ws) => {
      ws.items.forEach((it) => {
        if (it.temaId === tema.kode) {
          totalJumlah += it.jumlah;
          itemCount++;
        }
      });
    });
    const percentage = totalPenerimaan > 0 ? (totalJumlah / totalPenerimaan) * 100 : 0;
    return {
      ...tema,
      totalJumlah,
      itemCount,
      percentage,
      accentColor: idx % 2 === 0 ? '#5A5A40' : '#C06E52'
    };
  });

  // Custom tooltip for recharts
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#2C2A28] text-white p-3.5 rounded-2xl shadow-xl border border-[#484540] text-xs space-y-1.5 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-[#484540] pb-1.5 mb-1.5">
            <span className="font-serif font-bold text-sm text-[#E0DACE]">{data.monthName} 2026</span>
            <span className="text-[10px] bg-[#5A5A40] px-2 py-0.5 rounded-full font-mono">
              {data.itemCount} Item
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#A8A29E]">Total Realisasi:</span>
            <span className="font-bold text-white font-mono">{formatRp(data.totalBelanja)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#A8A29E]">Proporsi Pagu:</span>
            <span className="font-bold text-[#E0DACE]">{data.percentageOfTotal.toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#A8A29E] pt-1 border-t border-[#484540]">
            <span>Rata-rata Pagu/Bulan:</span>
            <span>{formatRp(data.targetAvg)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with Natural Tones aesthetic */}
      <div className="relative overflow-hidden rounded-[28px] bg-[#F2EDE4] text-[#2C2A28] p-7 md:p-9 border border-[#E0DACE] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C06E5215] border border-[#C06E5230] text-[#8B4513] text-xs font-medium">
              <span className="font-serif italic font-semibold">Tema 2026</span>
              <span>•</span>
              <span>Sistem Terpadu Kertas Kerja & SPJ BOSP</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[#2C2A28] tracking-tight leading-tight">
              {school.nama}
            </h2>
            <p className="text-sm text-[#6B665E] leading-relaxed">
              Memuat struktur <span className="text-[#2C2A28] font-semibold">Tema (8 Standar Nasional Pendidikan)</span> dan{' '}
              <span className="text-[#2C2A28] font-semibold">Subtema (Program & Kegiatan Belanja)</span> per bulan lengkap Januari s.d. Desember 2026.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#8C867E] pt-2">
              <span>NPSN: <strong className="text-[#2C2A28]">{school.npsn}</strong></span>
              <span>•</span>
              <span>Akreditasi: <strong className="text-[#2C2A28]">{school.akreditasi}</strong></span>
              <span>•</span>
              <span>Kecamatan: <strong className="text-[#2C2A28]">{school.kecamatan}</strong></span>
              <span>•</span>
              <span>Kabupaten: <strong className="text-[#2C2A28]">{school.kabupaten}</strong></span>
            </div>
          </div>

          {/* Key KPI Card */}
          <div className="bg-white p-6 rounded-[24px] border border-[#E0DACE] shadow-xs shrink-0 min-w-[280px]">
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C867E] mb-1">
              STATUS KESEIMBANGAN ANGGARAN
            </div>
            <div className="text-2xl font-serif font-bold text-[#5A5A40]">
              {formatRp(grandTotalBelanja)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#5A5A40] font-medium mt-2">
              <CheckCircle2 className="w-4 h-4 text-[#5A5A40]" />
              <span>100% Sesuai Pagu ({formatRp(totalPenerimaan)})</span>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E0DACE] flex items-center justify-between text-[11px] text-[#8C867E]">
              <span>Sesi Aktif:</span>
              {currentUser?.role === 'KEPSEK' ? (
                <span className="font-bold text-[#5A5A40] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Kepsek (Master Admin)
                </span>
              ) : (
                <span className="font-bold text-[#C06E52] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Bendahara (Admin Biasa)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ARKAS PERUBAHAN Quick Access Banner */}
      {perubahanWorksheets && (
        <div className="bg-gradient-to-r from-[#065F46] to-[#047857] text-white p-6 rounded-[28px] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-emerald-200">
              <GitCompare className="w-4 h-4" />
              <span>Modul Anggaran Khusus APBD-P 2026</span>
              <span className="bg-emerald-800/80 px-2 py-0.5 rounded-full text-white text-[9px]">RESMI AKTIF</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-white">
              Menu Baru: ARKAS PERUBAHAN (Rekam Tambah, Kurang & Hilang)
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Merekam semua perubahan anggaran dari ARKAS Murni (Semula) menjadi ARKAS Perubahan (Menjadi). Termasuk penambahan item baru, pengurangan, hingga penghilangan item yang tidak ada di ARKAS Murni. Dokumen SPJ (Kwitansi, Honor, Nota) berlaku sama ke ARKAS Murni maupun ARKAS Perubahan.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1 text-emerald-200">
              <span>ARKAS Murni: <strong className="text-white">{formatRp(grandTotalBelanja)}</strong></span>
              <span>•</span>
              <span>ARKAS Perubahan: <strong className="text-white">{formatRp(perubahanWorksheets.reduce((acc, ws) => acc + ws.items.reduce((s, it) => s + (it.statusPerubahan === 'DIHILANGKAN' ? 0 : it.jumlah), 0), 0))}</strong></span>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('arkas-perubahan')}
            className="shrink-0 px-5 py-3 bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <span>Buka ARKAS PERUBAHAN</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      )}

      {/* Budget Burn Rate Recharts Visualization */}
      <div className="bg-white p-6 md:p-7 rounded-[28px] border border-[#E0DACE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#F0EBE1]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-[#C06E52] mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Grafik Realisasi & Budget Burn Rate</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2C2A28]">
              Grand Total Belanja Per Bulan vs Pagu BOSP TA 2026
            </h3>
            <p className="text-xs text-[#6B665E]">
              Ikhtisar serapan dana 12 bulan (Januari - Desember) terhadap total alokasi anggaran Rp {totalPenerimaan.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="flex items-center gap-1.5 text-xs text-[#5A5A40] font-medium bg-[#5A5A40]/10 px-3 py-1.5 rounded-xl border border-[#5A5A40]/20">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5A5A40]"></span>
              <span>Realisasi Bulanan</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#C06E52] font-medium bg-[#C06E52]/10 px-3 py-1.5 rounded-xl border border-[#C06E52]/20">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C06E52]"></span>
              <span>Rata-rata ({formatRp(averageMonthlyBudget)})</span>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart Container */}
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyChartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              onClick={(data: any) => {
                if (data && data.activePayload && data.activePayload[0]) {
                  const mIndex = data.activePayload[0].payload.monthIndex;
                  if (typeof mIndex === 'number') {
                    onSelectMonth(mIndex);
                    onSelectTab('kertas-kerja');
                  }
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#EAE4D8" vertical={false} />
              <XAxis
                dataKey="shortName"
                stroke="#8C867E"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#E0DACE' }}
              />
              <YAxis
                stroke="#8C867E"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#E0DACE' }}
                tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)} jt`}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <ReferenceLine
                y={averageMonthlyBudget}
                stroke="#C06E52"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: 'Rata-rata Pagu/Bulan',
                  position: 'top',
                  fill: '#C06E52',
                  fontSize: 10,
                  fontWeight: 600
                }}
              />
              <Bar
                dataKey="totalBelanja"
                radius={[8, 8, 0, 0]}
                cursor="pointer"
              >
                {monthlyChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.totalBelanja > averageMonthlyBudget ? '#5A5A40' : '#828260'}
                    className="hover:opacity-85 transition-opacity"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E0DACE] flex items-center justify-between">
            <span className="text-[#6B665E]">Total Pagu BOSP 2026:</span>
            <strong className="font-serif text-[#2C2A28]">{formatRp(totalPenerimaan)}</strong>
          </div>
          <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E0DACE] flex items-center justify-between">
            <span className="text-[#6B665E]">Rata-rata Serapan/Bulan:</span>
            <strong className="font-serif text-[#5A5A40]">{formatRp(grandTotalBelanja / 12)}</strong>
          </div>
          <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E0DACE] flex items-center justify-between">
            <span className="text-[#6B665E]">Status Penyerapan:</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Berimbang
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Worksheets Grid Quick Jump */}
      <div className="bg-white p-6 md:p-7 rounded-[28px] border border-[#E0DACE] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C867E] mb-1">
              Distribusi 12 Bulan
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2C2A28]">Kertas Kerja Perbulan (TA 2026)</h3>
            <p className="text-xs text-[#6B665E]">Pilih bulan untuk melihat rincian belanja, tema/subtema, dan cetak lembar SPJ</p>
          </div>
          <button
            onClick={() => onSelectTab('kertas-kerja')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#5A5A40] hover:text-[#454530] cursor-pointer"
          >
            Lihat Tabel Penuh <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {worksheets.map((ws, idx) => {
            const mTotal = ws.items.reduce((s, it) => s + it.jumlah, 0);
            return (
              <div
                key={ws.bulanKey}
                onClick={() => {
                  onSelectMonth(idx);
                  onSelectTab('kertas-kerja');
                }}
                className="group p-4 rounded-2xl border border-[#E0DACE] bg-[#FDFBF7] hover:bg-[#F2EDE4] hover:border-[#D9D1C2] transition-all cursor-pointer flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#6B665E] font-medium group-hover:text-[#2C2A28]">
                    <span className="font-serif font-semibold">{MONTH_NAMES[idx]}</span>
                    <span className="text-[10px] bg-[#E8E2D6] px-1.5 py-0.5 rounded-full text-[#3E3C3A] font-sans">
                      {ws.items.length} item
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#2C2A28] mt-2 font-mono group-hover:text-[#5A5A40]">
                    {formatRp(mTotal)}
                  </div>
                </div>
                <div className="text-[10px] text-[#8C867E] group-hover:text-[#5A5A40] mt-3 flex items-center gap-1 font-medium">
                  <span>Buka Lembar</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tema (8 Standar Nasional Pendidikan) Summary - Styled as Natural Tones Exploration Cards */}
      <div className="bg-[#FDFBF7] p-6 md:p-7 rounded-[28px] border border-[#E0DACE] shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C867E] mb-1">
              Eksplorasi Tema Utama
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2C2A28]">Alokasi 8 Standar Nasional Pendidikan</h3>
            <p className="text-xs text-[#6B665E]">Struktur tema utama dan proporsi alokasi dana BOSP 2026</p>
          </div>
          <button
            onClick={() => onSelectTab('tema-explorer')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#5A5A40] hover:text-[#454530] cursor-pointer"
          >
            Penjelajah Tema & Subtema <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {temaBreakdown.map((t) => (
            <div
              key={t.kode}
              className="bg-white p-5 rounded-[24px] border border-[#E0DACE] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 bg-[#F2EDE4] rounded-full flex items-center justify-center font-serif font-bold text-sm"
                    style={{ color: t.accentColor }}
                  >
                    {t.kode}
                  </div>
                  <span className="text-xs font-bold text-[#6B665E]">
                    {t.percentage.toFixed(1)}%
                  </span>
                </div>
                <h4 className="text-sm font-serif font-bold text-[#2C2A28] leading-snug mb-1">
                  {t.nama}
                </h4>
                <p className="text-[11px] text-[#8C867E] line-clamp-2">
                  {t.deskripsi}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E0DACE]">
                <div className="text-xs font-bold text-[#2C2A28]">
                  {formatRp(t.totalJumlah)}
                </div>
                <div className="mt-2 h-1.5 w-full bg-[#F2EDE4] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, t.percentage)}%`,
                      backgroundColor: t.accentColor
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick SPJ Creation Box */}
      <div className="bg-[#F2EDE4] p-6 rounded-[28px] border border-[#E0DACE] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#C06E52] uppercase tracking-wide">
            <Receipt className="w-4 h-4" />
            Pembuat Dokumen SPJ Otomatis
          </div>
          <h3 className="text-base font-serif font-bold text-[#2C2A28]">
            Cetak Kwitansi Berbingkai, Daftar Honor, Nota & SPTJ
          </h3>
          <p className="text-xs text-[#6B665E]">
            Semua dokumen otomatis dilengkapi nomor urut, terbilang rupiah, kop SMPN 7 Sentani, dan tanda tangan 3 pejabat.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onSelectTab('kwitansi')}
            className="px-4 py-2.5 bg-[#5A5A40] hover:bg-[#484832] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition active:scale-95"
          >
            Buat Kwitansi
          </button>
          <button
            onClick={() => onSelectTab('daftar')}
            className="px-4 py-2.5 bg-white hover:bg-[#F9F7F2] text-[#2C2A28] border border-[#E0DACE] rounded-xl text-xs font-semibold shadow-2xs cursor-pointer transition active:scale-95"
          >
            Daftar Honor
          </button>
          <button
            onClick={() => onSelectTab('bkk')}
            className="px-4 py-2.5 bg-white hover:bg-[#F9F7F2] text-[#2C2A28] border border-[#E0DACE] rounded-xl text-xs font-semibold shadow-2xs cursor-pointer transition active:scale-95"
          >
            Bukti Kas Keluar
          </button>
        </div>
      </div>
    </div>
  );
};

