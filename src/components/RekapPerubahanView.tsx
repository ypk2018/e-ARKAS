import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Printer,
  TrendingUp,
  TrendingDown,
  Ban,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import {
  ArkasPerubahanMonthWorksheet,
  MonthWorksheet,
  SchoolProfile,
  ArkasPerubahanItem,
  UserAccount
} from '../types';
import { formatRp } from '../utils/formatters';
import { MONTH_NAMES } from '../data/schoolProfile';
import { TEMA_STANDAR_LIST } from '../data/standarData';
import { printRekapPerubahan } from '../utils/printDocument';

interface RekapPerubahanViewProps {
  school: SchoolProfile;
  worksheets: ArkasPerubahanMonthWorksheet[];
  murniWorksheets: MonthWorksheet[];
  onSelectMonthAndTab?: (monthIndex: number, tab: string) => void;
  onRestoreItem?: (item: ArkasPerubahanItem, monthIndex: number) => void;
  currentUser?: UserAccount;
}

export const RekapPerubahanView: React.FC<RekapPerubahanViewProps> = ({
  school,
  worksheets,
  murniWorksheets,
  onSelectMonthAndTab,
  onRestoreItem,
  currentUser
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bulan' | 'standar' | 'dihilangkan' | 'baru'>('bulan');
  const [searchQuery, setSearchQuery] = useState('');

  // 12 Months Comparative Data
  const monthlyData = useMemo(() => {
    return MONTH_NAMES.map((mName, mIdx) => {
      const wsPerubahan = worksheets[mIdx];
      const wsMurni = murniWorksheets[mIdx];

      const semula = wsPerubahan
        ? wsPerubahan.items.reduce((s, it) => s + it.semulaJumlah, 0)
        : (wsMurni ? wsMurni.items.reduce((s, it) => s + it.jumlah, 0) : 0);

      // Active items in perubahan: excluding DIHILANGKAN
      const menjadi = wsPerubahan
        ? wsPerubahan.items.reduce((s, it) => s + (it.statusPerubahan === 'DIHILANGKAN' ? 0 : it.jumlah), 0)
        : 0;

      const selisih = menjadi - semula;
      const dihilangkanCount = wsPerubahan ? wsPerubahan.items.filter((it) => it.statusPerubahan === 'DIHILANGKAN').length : 0;
      const baruCount = wsPerubahan ? wsPerubahan.items.filter((it) => it.statusPerubahan === 'BARU').length : 0;
      const bertambahCount = wsPerubahan ? wsPerubahan.items.filter((it) => it.statusPerubahan === 'BERTAMBAH').length : 0;
      const berkurangCount = wsPerubahan ? wsPerubahan.items.filter((it) => it.statusPerubahan === 'BERKURANG').length : 0;
      const tetapCount = wsPerubahan ? wsPerubahan.items.filter((it) => it.statusPerubahan === 'TETAP').length : 0;

      const triwulan = mIdx < 3 ? 'I' : mIdx < 6 ? 'II' : mIdx < 9 ? 'III' : 'IV';

      return {
        bulanIndex: mIdx,
        bulanNama: mName,
        triwulan,
        semula,
        menjadi,
        selisih,
        dihilangkanCount,
        baruCount,
        bertambahCount,
        berkurangCount,
        tetapCount,
        totalItems: wsPerubahan ? wsPerubahan.items.length : 0
      };
    });
  }, [worksheets, murniWorksheets]);

  // Totals
  const totalSemulaAll = useMemo(() => monthlyData.reduce((s, m) => s + m.semula, 0), [monthlyData]);
  const totalMenjadiAll = useMemo(() => monthlyData.reduce((s, m) => s + m.menjadi, 0), [monthlyData]);
  const totalSelisihAll = totalMenjadiAll - totalSemulaAll;

  // Triwulan Groups
  const triwulanData = useMemo(() => {
    return ['I', 'II', 'III', 'IV'].map((tw) => {
      const months = monthlyData.filter((m) => m.triwulan === tw);
      const semula = months.reduce((s, m) => s + m.semula, 0);
      const menjadi = months.reduce((s, m) => s + m.menjadi, 0);
      const selisih = menjadi - semula;
      return { tw, semula, menjadi, selisih };
    });
  }, [monthlyData]);

  // 8 Standar Groups
  const standarData = useMemo(() => {
    return TEMA_STANDAR_LIST.map((st) => {
      let semula = 0;
      let menjadi = 0;

      worksheets.forEach((ws) => {
        ws.items.forEach((it) => {
          if (it.temaId === st.kode) {
            semula += it.semulaJumlah;
            if (it.statusPerubahan !== 'DIHILANGKAN') {
              menjadi += it.jumlah;
            }
          }
        });
      });

      const selisih = menjadi - semula;
      const pct = totalMenjadiAll > 0 ? (menjadi / totalMenjadiAll) * 100 : 0;

      return {
        kode: st.kode,
        nama: st.nama,
        semula,
        menjadi,
        selisih,
        pct
      };
    });
  }, [worksheets, totalMenjadiAll]);

  // All Eliminated Items across 12 months
  const allDihilangkanItems = useMemo(() => {
    const list: Array<{ bulan: string; bulanIndex: number; item: ArkasPerubahanItem }> = [];
    worksheets.forEach((ws, mIdx) => {
      ws.items.forEach((it) => {
        if (it.statusPerubahan === 'DIHILANGKAN') {
          list.push({ bulan: MONTH_NAMES[mIdx], bulanIndex: mIdx, item: it });
        }
      });
    });
    return list;
  }, [worksheets]);

  const totalDihilangkanNilai = useMemo(
    () => allDihilangkanItems.reduce((s, x) => s + x.item.semulaJumlah, 0),
    [allDihilangkanItems]
  );

  // All New Items across 12 months
  const allBaruItems = useMemo(() => {
    const list: Array<{ bulan: string; bulanIndex: number; item: ArkasPerubahanItem }> = [];
    worksheets.forEach((ws, mIdx) => {
      ws.items.forEach((it) => {
        if (it.statusPerubahan === 'BARU') {
          list.push({ bulan: MONTH_NAMES[mIdx], bulanIndex: mIdx, item: it });
        }
      });
    });
    return list;
  }, [worksheets]);

  const totalBaruNilai = useMemo(
    () => allBaruItems.reduce((s, x) => s + x.item.jumlah, 0),
    [allBaruItems]
  );

  const handlePrint = () => {
    printRekapPerubahan(school, worksheets, murniWorksheets);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white p-6 md:p-8 rounded-[28px] border border-[#E0DACE] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#059669] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                <FileSpreadsheet className="w-3 h-3" />
                <span>REKAPITULASI KOMPARATIF ARKAS PERUBAHAN</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C867E]">
                TAHUN ANGGARAN {school.tahunAnggaran}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2C2A28] tracking-tight">
              Rekapitulasi Perubahan Anggaran (APBD-P)
            </h2>
            <p className="text-xs md:text-sm text-[#6B665E] max-w-2xl font-sans">
              Ikhtisar menyeluruh perbandingan alokasi anggaran semula (ARKAS Murni) dan alokasi menjadi (ARKAS Perubahan), mencakup rincian belanja baru, belanja yang dihilangkan, serta pergeseran 8 Standar Nasional Pendidikan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#5A5A40] hover:bg-[#484832] text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
              title="Cetak format cetak resmi A4 Landscape Laporan Rekapitulasi Perubahan Anggaran"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Rekapan A4</span>
            </button>

            {onSelectMonthAndTab && (
              <button
                onClick={() => onSelectMonthAndTab(0, 'arkas-perubahan')}
                className="flex items-center gap-1.5 bg-[#F9F7F2] hover:bg-[#F2EDE4] text-[#5C5852] font-semibold px-4 py-2.5 rounded-xl text-xs border border-[#E0DACE] transition cursor-pointer"
                title="Buka Lembar Kerja Bulanan ARKAS Perubahan"
              >
                <span>Ke Lembar Kerja Bulanan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 5 Executive KPI Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-6 pt-6 border-t border-[#E0DACE]">
          {/* Semula */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D6]">
            <div className="text-[10px] uppercase tracking-wider font-bold text-[#8C867E]">
              Total Anggaran Semula
            </div>
            <div className="text-lg md:text-xl font-mono font-bold text-[#2C2A28] mt-1">
              {formatRp(totalSemulaAll)}
            </div>
            <div className="text-[11px] text-[#8C867E] mt-0.5">
              Dasar ARKAS Murni 2026
            </div>
          </div>

          {/* Menjadi */}
          <div className="bg-[#EFF5ED] p-4 rounded-2xl border border-[#D5E3D1]">
            <div className="text-[10px] uppercase tracking-wider font-bold text-[#047857]">
              Total Anggaran Menjadi
            </div>
            <div className="text-lg md:text-xl font-mono font-bold text-[#14532d] mt-1">
              {formatRp(totalMenjadiAll)}
            </div>
            <div className="text-[11px] text-[#047857] mt-0.5 flex items-center gap-1">
              <span>ARKAS Perubahan Aktif</span>
            </div>
          </div>

          {/* Selisih Netto */}
          <div
            className={`p-4 rounded-2xl border ${
              totalSelisihAll >= 0
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-rose-50/70 border-rose-200'
            }`}
          >
            <div
              className={`text-[10px] uppercase tracking-wider font-bold ${
                totalSelisihAll >= 0 ? 'text-emerald-800' : 'text-rose-800'
              }`}
            >
              Selisih Netto (+ / -)
            </div>
            <div
              className={`text-lg md:text-xl font-mono font-bold mt-1 ${
                totalSelisihAll >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {totalSelisihAll > 0 ? '+' : ''}
              {formatRp(totalSelisihAll)}
            </div>
            <div
              className={`text-[11px] font-semibold mt-0.5 ${
                totalSelisihAll >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {totalSemulaAll > 0
                ? `${totalSelisihAll >= 0 ? '+' : ''}${((totalSelisihAll / totalSemulaAll) * 100).toFixed(2)}%`
                : '0%'}
              {totalSelisihAll === 0 && ' (Berimbang / Realokasi)'}
            </div>
          </div>

          {/* Belanja Dihilangkan */}
          <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-200">
            <div className="text-[10px] uppercase tracking-wider font-bold text-rose-800 flex items-center justify-between">
              <span>Belanja Dihilangkan</span>
              <span className="bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded-full text-[9px]">
                {allDihilangkanItems.length}
              </span>
            </div>
            <div className="text-lg md:text-xl font-mono font-bold text-rose-800 mt-1">
              -{formatRp(totalDihilangkanNilai)}
            </div>
            <div className="text-[11px] text-rose-700 mt-0.5">
              Dihapus dari belanja aktif
            </div>
          </div>

          {/* Belanja Baru */}
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200">
            <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-800 flex items-center justify-between">
              <span>Belanja Baru</span>
              <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full text-[9px]">
                {allBaruItems.length}
              </span>
            </div>
            <div className="text-lg md:text-xl font-mono font-bold text-emerald-800 mt-1">
              +{formatRp(totalBaruNilai)}
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">
              Kegiatan baru ditambahkan
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E0DACE] pb-3">
        <div className="flex items-center gap-1.5 bg-[#F2EDE4] p-1 rounded-2xl border border-[#E0DACE]">
          <button
            onClick={() => setActiveSubTab('bulan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'bulan'
                ? 'bg-white text-[#2C2A28] shadow-xs'
                : 'text-[#6B665E] hover:text-[#2C2A28]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>Komparasi 12 Bulan & Triwulan</span>
          </button>

          <button
            onClick={() => setActiveSubTab('standar')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'standar'
                ? 'bg-white text-[#2C2A28] shadow-xs'
                : 'text-[#6B665E] hover:text-[#2C2A28]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>Matriks 8 Standar Pendidikan</span>
          </button>

          <button
            onClick={() => setActiveSubTab('dihilangkan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'dihilangkan'
                ? 'bg-white text-rose-800 shadow-xs'
                : 'text-[#6B665E] hover:text-rose-800'
            }`}
          >
            <Ban className="w-3.5 h-3.5 text-rose-600" />
            <span>Belanja Dihilangkan ({allDihilangkanItems.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('baru')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'baru'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-[#6B665E] hover:text-emerald-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Belanja Baru Ditambahkan ({allBaruItems.length})</span>
          </button>
        </div>

        <div className="text-xs text-[#8C867E]">
          Total Rincian: <span className="font-bold text-[#2C2A28]">{worksheets.reduce((s, w) => s + w.items.length, 0)} item</span>
        </div>
      </div>

      {/* TAB 1: 12 Bulan & Triwulan */}
      {activeSubTab === 'bulan' && (
        <div className="space-y-6">
          {/* 12-Month Table */}
          <div className="bg-white rounded-[28px] border border-[#E0DACE] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E0DACE] bg-[#FAF8F4] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-[#2C2A28]">
                  Rekapitulasi Komparatif 12 Bulan (Januari s.d. Desember 2026)
                </h3>
                <p className="text-xs text-[#6B665E] mt-0.5">
                  Perbandingan anggaran per bulan antara ARKAS Murni dan ARKAS Perubahan
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#8C867E] bg-white px-3 py-1 rounded-lg border border-[#E0DACE]">
                12 Bulan Lengkap
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F2EDE4] text-[#2C2A28] text-[10px] font-bold uppercase tracking-wider border-b border-[#E0DACE]">
                    <th className="py-3 px-3 w-8 text-center font-serif">No</th>
                    <th className="py-3 px-4 w-36 font-serif">Bulan Anggaran</th>
                    <th className="py-3 px-3 text-center w-20 font-serif">Triwulan</th>
                    <th className="py-3 px-3 text-right w-36 font-serif bg-[#FAF8F4]">Semula (Murni)</th>
                    <th className="py-3 px-3 text-right w-36 font-serif bg-[#EFF5ED]">Menjadi (Perubahan)</th>
                    <th className="py-3 px-3 text-right w-32 font-serif">Selisih (+/-)</th>
                    <th className="py-3 px-3 text-center w-24 font-serif">% Perubahan</th>
                    <th className="py-3 px-4 font-serif">Aktivitas Perubahan Belanja</th>
                    <th className="py-3 px-3 text-center w-24 font-serif">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0DACE]">
                  {monthlyData.map((m, idx) => {
                    const pctChange =
                      m.semula > 0 ? ((m.menjadi - m.semula) / m.semula) * 100 : m.menjadi > 0 ? 100 : 0;
                    return (
                      <tr key={m.bulanIndex} className="hover:bg-[#F9F7F2] transition">
                        <td className="py-3.5 px-3 text-center font-bold text-[#8C867E]">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#2C2A28]">
                          {m.bulanNama}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[#FAF8F5] text-[#5C5852] border border-[#E0DACE]">
                            TW {m.triwulan}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-[#5C5852] bg-[#FAF8F4]">
                          {formatRp(m.semula)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-[#14532d] bg-[#EFF5ED]">
                          {formatRp(m.menjadi)}
                        </td>
                        <td
                          className={`py-3.5 px-3 text-right font-mono font-bold ${
                            m.selisih > 0
                              ? 'text-emerald-700'
                              : m.selisih < 0
                              ? 'text-rose-700'
                              : 'text-[#8C867E]'
                          }`}
                        >
                          {m.selisih > 0 ? '+' : ''}
                          {formatRp(m.selisih)}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-[11px]">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              pctChange > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : pctChange < 0
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {pctChange > 0 ? '+' : ''}
                            {pctChange.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[11px]">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {m.dihilangkanCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                                <Ban className="w-2.5 h-2.5" />
                                <span>{m.dihilangkanCount} Dihilangkan</span>
                              </span>
                            )}
                            {m.baruCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>{m.baruCount} Baru</span>
                              </span>
                            )}
                            {m.bertambahCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                                <TrendingUp className="w-2.5 h-2.5" />
                                <span>{m.bertambahCount} Naik</span>
                              </span>
                            )}
                            {m.berkurangCount > 0 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                <TrendingDown className="w-2.5 h-2.5" />
                                <span>{m.berkurangCount} Turun</span>
                              </span>
                            )}
                            {m.dihilangkanCount === 0 &&
                              m.baruCount === 0 &&
                              m.bertambahCount === 0 &&
                              m.berkurangCount === 0 && (
                                <span className="text-[10px] text-[#8C867E] italic">
                                  Tetap ({m.tetapCount} rincian)
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          {onSelectMonthAndTab && (
                            <button
                              onClick={() => onSelectMonthAndTab(m.bulanIndex, 'arkas-perubahan')}
                              className="text-[10px] font-semibold text-[#5A5A40] hover:text-black hover:underline cursor-pointer inline-flex items-center gap-1"
                            >
                              <span>Buka</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-[#F2EDE4] font-bold text-xs border-t-2 border-[#D9D1C2]">
                    <td colSpan={3} className="py-4 px-4 text-right uppercase tracking-wider font-serif">
                      TOTAL 1 TAHUN ANGGARAN:
                    </td>
                    <td className="py-4 px-3 text-right font-mono text-sm text-[#2C2A28] bg-[#FAF8F4]">
                      {formatRp(totalSemulaAll)}
                    </td>
                    <td className="py-4 px-3 text-right font-mono text-sm text-[#14532d] bg-[#EFF5ED]">
                      {formatRp(totalMenjadiAll)}
                    </td>
                    <td
                      className={`py-4 px-3 text-right font-mono text-sm ${
                        totalSelisihAll >= 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {totalSelisihAll > 0 ? '+' : ''}
                      {formatRp(totalSelisihAll)}
                    </td>
                    <td className="py-4 px-3 text-center font-mono text-xs">
                      {totalSemulaAll > 0
                        ? `${totalSelisihAll >= 0 ? '+' : ''}${((totalSelisihAll / totalSemulaAll) * 100).toFixed(1)}%`
                        : '0%'}
                    </td>
                    <td colSpan={2} className="py-4 px-4 text-[11px] text-[#6B665E]">
                      {allDihilangkanItems.length} Rincian Dihilangkan &bull; {allBaruItems.length} Belanja Baru
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Triwulan Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {triwulanData.map((tw) => (
              <div
                key={tw.tw}
                className="bg-white p-5 rounded-2xl border border-[#E0DACE] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-wider font-bold text-[#5A5A40]">
                    Triwulan {tw.tw}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tw.selisih > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : tw.selisih < 0
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tw.selisih > 0 ? '+' : ''}
                    {formatRp(tw.selisih)}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs pt-1 border-t border-[#F2EDE4]">
                  <div className="flex justify-between text-[#6B665E]">
                    <span>Semula (Murni):</span>
                    <span className="font-mono font-medium text-[#2C2A28]">{formatRp(tw.semula)}</span>
                  </div>
                  <div className="flex justify-between text-[#14532d]">
                    <span className="font-semibold">Menjadi (Perub):</span>
                    <span className="font-mono font-bold">{formatRp(tw.menjadi)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: 8 Standar Nasional Pendidikan */}
      {activeSubTab === 'standar' && (
        <div className="bg-white rounded-[28px] border border-[#E0DACE] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E0DACE] bg-[#FAF8F4] flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-[#2C2A28]">
                Komparasi 8 Standar Nasional Pendidikan (SNP)
              </h3>
              <p className="text-xs text-[#6B665E] mt-0.5">
                Pergeseran alokasi belanja per tema standar pendidikan tahun 2026
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#8C867E] bg-white px-3 py-1 rounded-lg border border-[#E0DACE]">
              8 Standar Nasional
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F2EDE4] text-[#2C2A28] text-[10px] font-bold uppercase tracking-wider border-b border-[#E0DACE]">
                  <th className="py-3 px-3 w-16 text-center font-serif">Kode</th>
                  <th className="py-3 px-4 font-serif">Nama Standar Nasional Pendidikan</th>
                  <th className="py-3 px-3 text-right w-40 font-serif bg-[#FAF8F4]">Semula (Murni)</th>
                  <th className="py-3 px-3 text-right w-40 font-serif bg-[#EFF5ED]">Menjadi (Perubahan)</th>
                  <th className="py-3 px-3 text-right w-36 font-serif">Selisih (+/-)</th>
                  <th className="py-3 px-3 text-center w-28 font-serif">% Porsi Anggaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DACE]">
                {standarData.map((st) => (
                  <tr key={st.kode} className="hover:bg-[#F9F7F2] transition">
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-[#5A5A40]">
                      {st.kode}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#2C2A28]">
                      {st.nama}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[#5C5852] bg-[#FAF8F4]">
                      {formatRp(st.semula)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-[#14532d] bg-[#EFF5ED]">
                      {formatRp(st.menjadi)}
                    </td>
                    <td
                      className={`py-3.5 px-3 text-right font-mono font-bold ${
                        st.selisih > 0
                          ? 'text-emerald-700'
                          : st.selisih < 0
                          ? 'text-rose-700'
                          : 'text-[#8C867E]'
                      }`}
                    >
                      {st.selisih > 0 ? '+' : ''}
                      {formatRp(st.selisih)}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-xs">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#5A5A40] h-1.5 rounded-full"
                            style={{ width: `${Math.min(st.pct, 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{st.pct.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#F2EDE4] font-bold text-xs border-t-2 border-[#D9D1C2]">
                  <td colSpan={2} className="py-4 px-4 text-right uppercase tracking-wider font-serif">
                    TOTAL KESELURUHAN 8 STANDAR:
                  </td>
                  <td className="py-4 px-3 text-right font-mono text-sm text-[#2C2A28] bg-[#FAF8F4]">
                    {formatRp(totalSemulaAll)}
                  </td>
                  <td className="py-4 px-3 text-right font-mono text-sm text-[#14532d] bg-[#EFF5ED]">
                    {formatRp(totalMenjadiAll)}
                  </td>
                  <td
                    className={`py-4 px-3 text-right font-mono text-sm ${
                      totalSelisihAll >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {totalSelisihAll > 0 ? '+' : ''}
                    {formatRp(totalSelisihAll)}
                  </td>
                  <td className="py-4 px-3 text-center font-mono text-xs">100.0%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Belanja yang Dihilangkan */}
      {activeSubTab === 'dihilangkan' && (
        <div className="bg-white rounded-[28px] border border-[#E0DACE] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E0DACE] bg-rose-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-700" />
                <h3 className="font-serif font-bold text-base text-rose-900">
                  Daftar Belanja yang Dihilangkan dari Anggaran ({allDihilangkanItems.length} Rincian Belanja)
                </h3>
              </div>
              <p className="text-xs text-rose-800/80 mt-0.5">
                Kegiatan belanja ini telah dihilangkan dari lembar kerja aktif ARKAS Perubahan dan anggarannya dialihkan ke pos lain.
              </p>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-rose-700">Total Pengurangan Anggaran:</div>
              <div className="text-base font-mono font-bold text-rose-900">
                -{formatRp(totalDihilangkanNilai)}
              </div>
            </div>
          </div>

          {allDihilangkanItems.length === 0 ? (
            <div className="p-12 text-center text-[#8C867E] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-semibold text-sm text-[#2C2A28]">
                Belum ada rincian belanja yang dihilangkan pada ARKAS Perubahan.
              </p>
              <p className="text-xs text-[#6B665E]">
                Bila ada belanja di lembar kerja bulanan yang Anda tekan "Hilangkan", rincian tersebut akan tercatat rapi di sini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F2EDE4] text-[#2C2A28] text-[10px] font-bold uppercase tracking-wider border-b border-[#E0DACE]">
                    <th className="py-3 px-3 w-8 text-center font-serif">No</th>
                    <th className="py-3 px-3 w-28 text-center font-serif">Bulan</th>
                    <th className="py-3 px-3 w-32 font-serif">Kode Rekening</th>
                    <th className="py-3 px-4 font-serif">Uraian Belanja Semula</th>
                    <th className="py-3 px-3 text-right w-36 font-serif">Anggaran Semula</th>
                    <th className="py-3 px-4 font-serif">Alasan Penghilangan</th>
                    <th className="py-3 px-3 text-center w-28 font-serif">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0DACE]">
                  {allDihilangkanItems.map((x, idx) => (
                    <tr key={x.item.id} className="hover:bg-rose-50/40 transition">
                      <td className="py-3 px-3 text-center font-bold text-[#8C867E]">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-semibold text-[#2C2A28] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E0DACE]">
                          {x.bulan}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-[#5C5852]">
                        {x.item.kodeRekening}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#2C2A28]">{x.item.uraian}</div>
                        <div className="text-[10px] text-[#6B665E]">
                          Standar {x.item.temaId} &bull; {x.item.subtemaNama}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-rose-800">
                        {formatRp(x.item.semulaJumlah)}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-[#5C5852] italic">
                        {x.item.alasanPerubahan || 'Dihilangkan dalam ARKAS Perubahan'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {onRestoreItem ? (
                          <button
                            onClick={() => onRestoreItem(x.item, x.bulanIndex)}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 transition cursor-pointer shadow-2xs"
                            title="Pulihkan rincian belanja ini kembali ke ARKAS Perubahan"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Pulihkan</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-[#8C867E]">Dihapus</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Belanja Baru yang Ditambahkan */}
      {activeSubTab === 'baru' && (
        <div className="bg-white rounded-[28px] border border-[#E0DACE] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E0DACE] bg-emerald-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h3 className="font-serif font-bold text-base text-emerald-900">
                  Daftar Belanja Baru di ARKAS Perubahan ({allBaruItems.length} Rincian Belanja)
                </h3>
              </div>
              <p className="text-xs text-emerald-800/80 mt-0.5">
                Kegiatan belanja baru yang sebelumnya tidak tercantum dalam ARKAS Murni
              </p>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-emerald-700">Total Anggaran Belanja Baru:</div>
              <div className="text-base font-mono font-bold text-emerald-900">
                +{formatRp(totalBaruNilai)}
              </div>
            </div>
          </div>

          {allBaruItems.length === 0 ? (
            <div className="p-12 text-center text-[#8C867E] space-y-2">
              <AlertCircle className="w-8 h-8 text-[#8C867E] mx-auto" />
              <p className="font-semibold text-sm text-[#2C2A28]">
                Belum ada belanja baru yang ditambahkan pada ARKAS Perubahan.
              </p>
              <p className="text-xs text-[#6B665E]">
                Gunakan tombol "+ Tambah Belanja Baru" pada lembar kerja bulanan untuk menambah mata anggaran baru.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F2EDE4] text-[#2C2A28] text-[10px] font-bold uppercase tracking-wider border-b border-[#E0DACE]">
                    <th className="py-3 px-3 w-8 text-center font-serif">No</th>
                    <th className="py-3 px-3 w-28 text-center font-serif">Bulan</th>
                    <th className="py-3 px-3 w-32 font-serif">Kode Rekening</th>
                    <th className="py-3 px-4 font-serif">Uraian Belanja Baru</th>
                    <th className="py-3 px-3 text-center w-28 font-serif">Volume & Satuan</th>
                    <th className="py-3 px-3 text-right w-32 font-serif">Tarif Satuan</th>
                    <th className="py-3 px-3 text-right w-36 font-serif">Total Menjadi</th>
                    <th className="py-3 px-4 font-serif">Alasan Penambahan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0DACE]">
                  {allBaruItems.map((x, idx) => (
                    <tr key={x.item.id} className="hover:bg-emerald-50/40 transition">
                      <td className="py-3 px-3 text-center font-bold text-[#8C867E]">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-semibold text-[#2C2A28] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E0DACE]">
                          {x.bulan}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-[#5C5852]">
                        {x.item.kodeRekening}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#2C2A28]">{x.item.uraian}</div>
                        <div className="text-[10px] text-[#6B665E]">
                          Standar {x.item.temaId} &bull; {x.item.subtemaNama}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        {x.item.volume} {x.item.satuan}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#5C5852]">
                        {formatRp(x.item.tarifHarga)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800">
                        {formatRp(x.item.jumlah)}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-[#5C5852]">
                        {x.item.alasanPerubahan || 'Penambahan belanja baru'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
