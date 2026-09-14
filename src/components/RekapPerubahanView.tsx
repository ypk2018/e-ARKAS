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
  Filter,
  Edit2,
  ArrowRightLeft,
  Trash2,
  Check,
  X,
  Plus
} from 'lucide-react';
import {
  ArkasPerubahanMonthWorksheet,
  MonthWorksheet,
  SchoolProfile,
  ArkasPerubahanItem,
  UserAccount,
  PerubahanStatus,
  BosRegulerItemTemplate
} from '../types';
import { formatRp, formatTanggalIndo } from '../utils/formatters';
import { MONTH_NAMES } from '../data/schoolProfile';
import { TEMA_STANDAR_LIST, SUBTEMA_PROGRAM_LIST, BOS_REGULER_ITEM_TEMPLATES } from '../data/standarData';
import { printRekapPerubahan } from '../utils/printDocument';

interface RekapPerubahanViewProps {
  school: SchoolProfile;
  worksheets: ArkasPerubahanMonthWorksheet[];
  murniWorksheets: MonthWorksheet[];
  onSelectMonthAndTab?: (monthIndex: number, tab: string) => void;
  onRestoreItem?: (item: ArkasPerubahanItem, monthIndex: number) => void;
  onSaveItem?: (item: ArkasPerubahanItem, monthIndex: number) => void;
  onEditItem?: (item: ArkasPerubahanItem, monthIndex: number) => void;
  onHilangkanItem?: (item: ArkasPerubahanItem, monthIndex: number, reason?: string) => void;
  onMoveItem?: (
    item: ArkasPerubahanItem,
    fromMonthIndex: number,
    toMonthIndex: number,
    reason?: string
  ) => void;
  onHapusTotalItem?: (item: ArkasPerubahanItem, monthIndex: number) => void;
  currentUser?: UserAccount;
}

export const RekapPerubahanView: React.FC<RekapPerubahanViewProps> = ({
  school,
  worksheets,
  murniWorksheets,
  onSelectMonthAndTab,
  onRestoreItem,
  onSaveItem,
  onEditItem,
  onHilangkanItem,
  onMoveItem,
  onHapusTotalItem,
  currentUser
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bulan' | 'standar' | 'semua' | 'dihilangkan' | 'baru'>('bulan');
  const [searchQuery, setSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Interactive Modals State
  const [editingItemData, setEditingItemData] = useState<{
    item: ArkasPerubahanItem;
    monthIndex: number;
  } | null>(null);
  const [selectedBosItemId, setSelectedBosItemId] = useState<string>('');
  const [editKodeRekening, setEditKodeRekening] = useState<string>('');
  const [editKodeProgram, setEditKodeProgram] = useState<string>('');
  const [editUraian, setEditUraian] = useState<string>('');
  const [editVolume, setEditVolume] = useState<number>(1);
  const [editSatuan, setEditSatuan] = useState<string>('bulan');
  const [editTarif, setEditTarif] = useState<number>(0);
  const [editAlasan, setEditAlasan] = useState<string>('');
  const [editTemaId, setEditTemaId] = useState<string>('06');
  const [editSubtemaKode, setEditSubtemaKode] = useState<string>('06.05');

  // Auto application of BOS Reguler template item
  const handleApplyBosItem = (itemTemplate: BosRegulerItemTemplate) => {
    setSelectedBosItemId(itemTemplate.id);
    setEditTemaId(itemTemplate.temaKode);
    setEditSubtemaKode(itemTemplate.subtemaKode);
    setEditKodeProgram(itemTemplate.kodeProgram);
    setEditKodeRekening(itemTemplate.kodeRekening);
    setEditUraian(itemTemplate.uraian);
    setEditSatuan(itemTemplate.satuan);
    setEditTarif(itemTemplate.tarifHarga);
  };

  // Synchronized Tema change
  const handleTemaChange = (newTemaKode: string) => {
    setEditTemaId(newTemaKode);
    const availableSubtemas = SUBTEMA_PROGRAM_LIST.filter((s) => s.temaKode === newTemaKode);
    if (availableSubtemas.length > 0) {
      const firstSub = availableSubtemas[0];
      setEditSubtemaKode(firstSub.kode);
      if (firstSub.kegiatanList && firstSub.kegiatanList.length > 0) {
        const progCode = firstSub.kegiatanList[0].split(' ')[0].replace(/\.$/, '');
        if (progCode) setEditKodeProgram(progCode);
      }
    }
  };

  // Synchronized Subtema change
  const handleSubtemaChange = (newSubtemaKode: string) => {
    setEditSubtemaKode(newSubtemaKode);
    const sub = SUBTEMA_PROGRAM_LIST.find((s) => s.kode === newSubtemaKode);
    if (sub && sub.kegiatanList && sub.kegiatanList.length > 0) {
      const progCode = sub.kegiatanList[0].split(' ')[0].replace(/\.$/, '');
      if (progCode) setEditKodeProgram(progCode);
    }
  };

  const [movingItemData, setMovingItemData] = useState<{
    item: ArkasPerubahanItem;
    monthIndex: number;
  } | null>(null);
  const [targetMoveMonth, setTargetMoveMonth] = useState<number>(0);
  const [targetMoveReason, setTargetMoveReason] = useState<string>('');

  const [cancelingItemData, setCancelingItemData] = useState<{
    item: ArkasPerubahanItem;
    monthIndex: number;
  } | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');

  const [deletingItemData, setDeletingItemData] = useState<{
    item: ArkasPerubahanItem;
    monthIndex: number;
  } | null>(null);

  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3200);
  };

  // 12 Months Comparative Data
  const monthlyData = useMemo(() => {
    return MONTH_NAMES.map((mName, mIdx) => {
      const wsPerubahan = worksheets[mIdx];
      const wsMurni = murniWorksheets[mIdx];

      const semula = wsPerubahan
        ? wsPerubahan.items.reduce((s, it) => s + it.semulaJumlah, 0)
        : wsMurni
        ? wsMurni.items.reduce((s, it) => s + it.jumlah, 0)
        : 0;

      // Active items in perubahan: excluding DIHILANGKAN
      const menjadi = wsPerubahan
        ? wsPerubahan.items.reduce(
            (s, it) => s + (it.statusPerubahan === 'DIHILANGKAN' ? 0 : it.jumlah),
            0
          )
        : 0;

      const selisih = menjadi - semula;
      const dihilangkanCount = wsPerubahan
        ? wsPerubahan.items.filter((it) => it.statusPerubahan === 'DIHILANGKAN').length
        : 0;
      const baruCount = wsPerubahan
        ? wsPerubahan.items.filter((it) => it.statusPerubahan === 'BARU').length
        : 0;
      const bertambahCount = wsPerubahan
        ? wsPerubahan.items.filter((it) => it.statusPerubahan === 'BERTAMBAH').length
        : 0;
      const berkurangCount = wsPerubahan
        ? wsPerubahan.items.filter((it) => it.statusPerubahan === 'BERKURANG').length
        : 0;
      const tetapCount = wsPerubahan
        ? wsPerubahan.items.filter((it) => it.statusPerubahan === 'TETAP').length
        : 0;

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
  const totalSemulaAll = useMemo(
    () => monthlyData.reduce((s, m) => s + m.semula, 0),
    [monthlyData]
  );
  const totalMenjadiAll = useMemo(
    () => monthlyData.reduce((s, m) => s + m.menjadi, 0),
    [monthlyData]
  );
  const totalSelisihAll = totalMenjadiAll - totalSemulaAll;

  // Triwulan Groups
  const triwulanData = useMemo(() => {
    return ['I', 'II', 'III', 'IV'].map((tw) => {
      const months = monthlyData.filter((m) => m.triwulan === tw);
      const semula = months.reduce((s, m) => s + m.semula, 0);
      const menjadi = months.reduce((s, m) => s + m.menjadi, 0);
      return {
        tw,
        semula,
        menjadi,
        selisih: menjadi - semula
      };
    });
  }, [monthlyData]);

  // 8 Standar SNP Data
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

  // All Items across 12 months with month info
  const allItemsList = useMemo(() => {
    const list: Array<{ bulan: string; bulanIndex: number; item: ArkasPerubahanItem }> = [];
    worksheets.forEach((ws, mIdx) => {
      ws.items.forEach((it) => {
        list.push({ bulan: MONTH_NAMES[mIdx], bulanIndex: mIdx, item: it });
      });
    });
    return list;
  }, [worksheets]);

  // All Eliminated Items across 12 months
  const allDihilangkanItems = useMemo(() => {
    return allItemsList.filter((x) => x.item.statusPerubahan === 'DIHILANGKAN');
  }, [allItemsList]);

  const totalDihilangkanNilai = useMemo(
    () => allDihilangkanItems.reduce((s, x) => s + x.item.semulaJumlah, 0),
    [allDihilangkanItems]
  );

  // All New Items across 12 months
  const allBaruItems = useMemo(() => {
    return allItemsList.filter((x) => x.item.statusPerubahan === 'BARU');
  }, [allItemsList]);

  const totalBaruNilai = useMemo(
    () => allBaruItems.reduce((s, x) => s + x.item.jumlah, 0),
    [allBaruItems]
  );

  // Filtered All Items for "semua" tab
  const filteredAllItems = useMemo(() => {
    return allItemsList.filter((x) => {
      if (monthFilter !== 'all' && x.bulanIndex !== parseInt(monthFilter, 10)) {
        return false;
      }
      if (statusFilter !== 'all' && x.item.statusPerubahan !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchUraian = x.item.uraian.toLowerCase().includes(q);
        const matchRek = x.item.kodeRekening.toLowerCase().includes(q);
        const matchAlasan = (x.item.alasanPerubahan || '').toLowerCase().includes(q);
        const matchStandar = (x.item.temaNama || '').toLowerCase().includes(q);
        if (!matchUraian && !matchRek && !matchAlasan && !matchStandar) return false;
      }
      return true;
    });
  }, [allItemsList, monthFilter, statusFilter, searchQuery]);

  // Handlers for Modals
  const handleOpenEditModal = (item: ArkasPerubahanItem, monthIndex: number) => {
    setEditingItemData({ item, monthIndex });
    const matched = BOS_REGULER_ITEM_TEMPLATES.find(
      (tpl) => tpl.kodeRekening === item.kodeRekening && tpl.uraian === item.uraian
    );
    setSelectedBosItemId(matched ? matched.id : '');
    setEditKodeRekening(item.kodeRekening);
    setEditKodeProgram(item.kodeProgram || '06.05.08');
    setEditUraian(item.uraian);
    setEditVolume(item.volume > 0 ? item.volume : item.semulaVolume || 1);
    setEditSatuan(item.satuan || item.semulaSatuan || 'rim');
    setEditTarif(item.tarifHarga > 0 ? item.tarifHarga : item.semulaTarif || 0);
    setEditAlasan(item.alasanPerubahan || '');
    setEditTemaId(item.temaId || '06');
    setEditSubtemaKode(item.subtemaKode || '06.05');
  };

  const handleSaveEditModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItemData) return;
    const { item, monthIndex } = editingItemData;

    const jumlahBaru = editVolume * editTarif;
    let newStatus: PerubahanStatus = item.statusPerubahan;
    if (item.statusPerubahan === 'BARU') {
      newStatus = 'BARU';
    } else if (editVolume === 0 || jumlahBaru === 0) {
      newStatus = 'DIHILANGKAN';
    } else if (jumlahBaru > item.semulaJumlah) {
      newStatus = 'BERTAMBAH';
    } else if (jumlahBaru < item.semulaJumlah) {
      newStatus = 'BERKURANG';
    } else {
      newStatus = 'TETAP';
    }

    const temaObj = TEMA_STANDAR_LIST.find((t) => t.kode === editTemaId);
    const subtemaObj = SUBTEMA_PROGRAM_LIST.find((s) => s.kode === editSubtemaKode);

    const updatedItem: ArkasPerubahanItem = {
      ...item,
      kodeRekening: editKodeRekening,
      kodeProgram: editKodeProgram,
      uraian: editUraian,
      volume: editVolume,
      satuan: editSatuan,
      tarifHarga: editTarif,
      jumlah: jumlahBaru,
      selisihJumlah: jumlahBaru - item.semulaJumlah,
      selisihVolume: editVolume - item.semulaVolume,
      statusPerubahan: newStatus,
      alasanPerubahan: editAlasan || 'Penyesuaian dalam rekapitulasi perubahan anggaran',
      temaId: editTemaId,
      temaNama: temaObj?.nama || item.temaNama,
      subtemaKode: editSubtemaKode,
      subtemaNama: subtemaObj?.nama || item.subtemaNama,
      updatedAt: new Date().toISOString()
    };

    if (onEditItem) {
      onEditItem(updatedItem, monthIndex);
    }
    showToast(`Rincian "${editUraian}" berhasil diperbarui`);
    setEditingItemData(null);
  };

  const handleOpenMoveModal = (item: ArkasPerubahanItem, monthIndex: number) => {
    setMovingItemData({ item, monthIndex });
    const nextM = (monthIndex + 1) % 12;
    setTargetMoveMonth(nextM);
    setTargetMoveReason(
      `Pergeseran bulan pelaksanaan dari ${MONTH_NAMES[monthIndex]} ke ${MONTH_NAMES[nextM]}`
    );
  };

  const handleConfirmMove = () => {
    if (!movingItemData) return;
    const { item, monthIndex } = movingItemData;
    if (onMoveItem) {
      onMoveItem(item, monthIndex, targetMoveMonth, targetMoveReason);
    }
    showToast(
      `Rincian "${item.uraian}" berhasil dipindahkan ke bulan ${MONTH_NAMES[targetMoveMonth]}`
    );
    setMovingItemData(null);
  };

  const handleOpenHilangkanModal = (item: ArkasPerubahanItem, monthIndex: number) => {
    setCancelingItemData({ item, monthIndex });
    setCancelReason('Dihilangkan / dialihkan ke kebutuhan prioritas lain dalam perubahan anggaran');
  };

  const handleConfirmHilangkan = () => {
    if (!cancelingItemData) return;
    const { item, monthIndex } = cancelingItemData;
    if (onHilangkanItem) {
      onHilangkanItem(item, monthIndex, cancelReason);
    }
    showToast(`Rincian "${item.uraian}" berhasil dihilangkan (Rp 0)`);
    setCancelingItemData(null);
  };

  const handleOpenHapusTotalModal = (item: ArkasPerubahanItem, monthIndex: number) => {
    setDeletingItemData({ item, monthIndex });
  };

  const handleConfirmHapusTotal = () => {
    if (!deletingItemData) return;
    const { item, monthIndex } = deletingItemData;
    if (onHapusTotalItem) {
      onHapusTotalItem(item, monthIndex);
    }
    showToast(`Rincian "${item.uraian}" dihapus total permanen`);
    setDeletingItemData(null);
  };

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
              Ikhtisar menyeluruh komparasi anggaran semula (Murni) dan menjadi (Perubahan), dilengkapi tombol kendali aksi langsung: Hilangkan, Edit, Pindahkan ke bulan lain, dan Hapus Total di seluruh lembar kerja.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onSelectMonthAndTab && (
              <button
                id="btn-nav-tambah-manual"
                onClick={() => onSelectMonthAndTab(0, 'arkas-perubahan-manual')}
                className="flex items-center gap-1.5 bg-[#059669] hover:bg-[#047857] text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
                title="Tambah Kegiatan Belanja Baru Secara Manual Sesuai Kebutuhan"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Belanja Manual</span>
              </button>
            )}

            <button
              id="btn-print-rekap-perubahan"
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#5A5A40] hover:bg-[#484832] text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
              title="Cetak format cetak resmi A4 Landscape Laporan Rekapitulasi Perubahan Anggaran"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF Rekapan</span>
            </button>

            {onSelectMonthAndTab && (
              <button
                onClick={() => onSelectMonthAndTab(0, 'arkas-perubahan')}
                className="flex items-center gap-1.5 bg-[#F9F7F2] hover:bg-[#F2EDE4] text-[#5C5852] font-semibold px-4 py-2.5 rounded-xl text-xs border border-[#E0DACE] transition cursor-pointer"
                title="Buka Lembar Kerja Bulanan ARKAS Perubahan"
              >
                <span>Ke Lembar Kerja (13 Kolom)</span>
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
              Ditiadakan dari belanja aktif
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
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F2EDE4] p-1 rounded-2xl border border-[#E0DACE]">
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
            onClick={() => setActiveSubTab('semua')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'semua'
                ? 'bg-white text-[#2C2A28] shadow-xs'
                : 'text-[#6B665E] hover:text-[#2C2A28]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>Daftar Rincian Belanja ({allItemsList.length})</span>
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
          Total Rincian: <span className="font-bold text-[#2C2A28]">{allItemsList.length} item</span>
        </div>
      </div>

      {/* TAB 1: 12 Bulan & Triwulan */}
      {activeSubTab === 'bulan' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[28px] border border-[#E0DACE] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E0DACE] bg-[#FAF8F4] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-[#2C2A28]">
                  Tabel Komparasi Anggaran 12 Bulan (Januari - Desember 2026)
                </h3>
                <p className="text-xs text-[#6B665E] mt-0.5">
                  Klik "Buka" pada kolom paling kanan untuk melompat langsung ke lembar kerja bulan tersebut
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
                    <th className="py-3 px-3 w-28 font-serif">Bulan</th>
                    <th className="py-3 px-2 w-14 text-center font-serif">TW</th>
                    <th className="py-3 px-3 text-right w-36 font-serif bg-[#FAF8F4]">Semula (Murni)</th>
                    <th className="py-3 px-3 text-right w-36 font-serif bg-[#EFF5ED]">Menjadi (Perubahan)</th>
                    <th className="py-3 px-3 text-right w-32 font-serif">Selisih (+/-)</th>
                    <th className="py-3 px-3 text-center w-24 font-serif">% Perub</th>
                    <th className="py-3 px-3 text-center w-40 font-serif">Rincian Perubahan</th>
                    <th className="py-3 px-3 text-center w-16 font-serif">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0DACE]">
                  {monthlyData.map((m, idx) => {
                    const pctPerub =
                      m.semula > 0 ? ((m.selisih / m.semula) * 100).toFixed(1) : '0';

                    return (
                      <tr key={m.bulanIndex} className="hover:bg-[#F9F7F2] transition">
                        <td className="py-3 px-3 text-center font-mono text-[#8C867E]">{idx + 1}</td>
                        <td className="py-3 px-3 font-semibold text-[#2C2A28]">
                          {m.bulanNama}
                        </td>
                        <td className="py-3 px-2 text-center font-mono text-[#8C867E]">
                          <span className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E0DACE] text-[10px]">
                            {m.triwulan}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[#5C5852] bg-[#FAF8F4]">
                          {formatRp(m.semula)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#14532d] bg-[#EFF5ED]">
                          {formatRp(m.menjadi)}
                        </td>
                        <td
                          className={`py-3 px-3 text-right font-mono font-bold ${
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
                        <td className="py-3 px-3 text-center font-mono text-xs">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              m.selisih > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : m.selisih < 0
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {m.selisih > 0 ? '+' : ''}
                            {pctPerub}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5 text-[10px]">
                            {m.dihilangkanCount > 0 && (
                              <span
                                className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold"
                                title={`${m.dihilangkanCount} rincian belanja dihilangkan`}
                              >
                                -{m.dihilangkanCount} Hilang
                              </span>
                            )}
                            {m.baruCount > 0 && (
                              <span
                                className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold"
                                title={`${m.baruCount} rincian belanja baru ditambahkan`}
                              >
                                +{m.baruCount} Baru
                              </span>
                            )}
                            {m.dihilangkanCount === 0 && m.baruCount === 0 && (
                              <span className="text-[#8C867E] italic text-[11px]">
                                {m.totalItems} item
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
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

      {/* TAB 3: Semua Rincian Belanja 12 Bulan (Full Interactive Control) */}
      {activeSubTab === 'semua' && (
        <div className="bg-white rounded-[28px] border border-[#E0DACE] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E0DACE] bg-[#FAF8F4] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-base text-[#2C2A28]">
                Daftar Seluruh Rincian Belanja ({filteredAllItems.length} Rincian Ditemukan)
              </h3>
              <p className="text-xs text-[#6B665E] mt-0.5">
                Kelola langsung seluruh item belanja: Hilangkan, Edit, Pindahkan ke bulan lain, dan Hapus Total
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari uraian/rekening..."
                  className="pl-8 pr-3 py-1.5 bg-white border border-[#E0DACE] rounded-xl text-xs text-[#2C2A28] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                />
              </div>

              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="py-1.5 px-3 bg-white border border-[#E0DACE] rounded-xl text-xs font-semibold text-[#2C2A28] focus:outline-none focus:ring-1 focus:ring-[#5A5A40] cursor-pointer"
              >
                <option value="all">Semua Bulan (1-12)</option>
                {MONTH_NAMES.map((name, idx) => (
                  <option key={idx} value={idx}>
                    Bulan {name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1.5 px-3 bg-white border border-[#E0DACE] rounded-xl text-xs font-semibold text-[#2C2A28] focus:outline-none focus:ring-1 focus:ring-[#5A5A40] cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="TETAP">TETAP</option>
                <option value="BARU">BARU</option>
                <option value="BERTAMBAH">BERTAMBAH</option>
                <option value="BERKURANG">BERKURANG</option>
                <option value="DIHILANGKAN">DIHILANGKAN</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F2EDE4] text-[#2C2A28] text-[10px] font-bold uppercase tracking-wider border-b border-[#E0DACE]">
                  <th className="py-3 px-3 w-8 text-center font-serif">No</th>
                  <th className="py-3 px-3 w-24 text-center font-serif">Bulan</th>
                  <th className="py-3 px-3 w-28 font-serif">Kode Rekening</th>
                  <th className="py-3 px-4 font-serif">Uraian Belanja & Program</th>
                  <th className="py-3 px-3 text-center w-24 font-serif">Status</th>
                  <th className="py-3 px-3 text-right w-28 font-serif bg-[#FAF8F4]">Semula</th>
                  <th className="py-3 px-3 text-right w-28 font-serif bg-[#EFF5ED]">Menjadi</th>
                  <th className="py-3 px-3 text-right w-28 font-serif">Selisih</th>
                  <th className="py-3 px-3 text-center w-40 font-serif">Pilihan Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DACE]">
                {filteredAllItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-[#8C867E]">
                      Tidak ada rincian belanja yang cocok dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  filteredAllItems.map((x, idx) => {
                    const it = x.item;
                    const isDihilangkan = it.statusPerubahan === 'DIHILANGKAN';
                    const isBaru = it.statusPerubahan === 'BARU';

                    return (
                      <tr
                        key={`${x.bulanIndex}-${it.id}`}
                        className={`hover:bg-[#F9F7F2] transition ${
                          isDihilangkan ? 'bg-rose-50/30 opacity-80' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center font-mono text-[#8C867E]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-semibold text-[#2C2A28] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E0DACE]">
                            {x.bulan}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-[#5C5852]">
                          {it.kodeRekening}
                        </td>
                        <td className="py-3 px-4">
                          <div
                            className={`font-semibold text-[#2C2A28] ${
                              isDihilangkan ? 'line-through text-rose-900' : ''
                            }`}
                          >
                            {it.uraian}
                          </div>
                          <div className="text-[10px] text-[#6B665E]">
                            Standar {it.temaId} &bull; {it.subtemaNama || 'Program'}
                          </div>
                          {it.alasanPerubahan && (
                            <div className="text-[10px] text-amber-800 italic mt-0.5">
                              Ket: {it.alasanPerubahan}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isDihilangkan
                                ? 'bg-rose-100 text-rose-800'
                                : isBaru
                                ? 'bg-emerald-100 text-emerald-800'
                                : it.statusPerubahan === 'BERTAMBAH'
                                ? 'bg-blue-100 text-blue-800'
                                : it.statusPerubahan === 'BERKURANG'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {it.statusPerubahan}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[#5C5852] bg-[#FAF8F4]">
                          {formatRp(it.semulaJumlah)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#14532d] bg-[#EFF5ED]">
                          {formatRp(isDihilangkan ? 0 : it.jumlah)}
                        </td>
                        <td
                          className={`py-3 px-3 text-right font-mono font-bold ${
                            it.selisihJumlah > 0
                              ? 'text-emerald-700'
                              : it.selisihJumlah < 0
                              ? 'text-rose-700'
                              : 'text-[#8C867E]'
                          }`}
                        >
                          {it.selisihJumlah > 0 ? '+' : ''}
                          {formatRp(it.selisihJumlah)}
                        </td>
                        {/* 4 Action Buttons: Hilangkan, Edit, Pindahkan, Hapus Total */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* 1. Hilangkan / Pulihkan */}
                            {!isDihilangkan ? (
                              <button
                                onClick={() => handleOpenHilangkanModal(it, x.bulanIndex)}
                                className="p-1.5 text-rose-600 hover:bg-rose-100 hover:text-rose-800 rounded-lg transition cursor-pointer"
                                title="Hilangkan belanja ini dari ARKAS Perubahan (Rp 0)"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  onRestoreItem && onRestoreItem(it, x.bulanIndex)
                                }
                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                                title="Pulihkan belanja ini kembali ke pagu semula"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* 2. Edit */}
                            <button
                              onClick={() => handleOpenEditModal(it, x.bulanIndex)}
                              className="p-1.5 text-[#5A5A40] hover:bg-[#E8E2D6] rounded-lg transition cursor-pointer"
                              title="Edit rincian volume / tarif / alasan belanja"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* 3. Pindahkan ke Bulan Lain */}
                            <button
                              onClick={() => handleOpenMoveModal(it, x.bulanIndex)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg transition cursor-pointer"
                              title="Pindahkan rincian belanja ini ke bulan lain"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>

                            {/* 4. Hapus Total */}
                            <button
                              onClick={() => handleOpenHapusTotalModal(it, x.bulanIndex)}
                              className="p-1.5 text-[#8C867E] hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Hapus total rincian belanja ini secara permanen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Belanja yang Dihilangkan (with Action Buttons) */}
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
                Kegiatan belanja ini telah dihilangkan dari lembar kerja aktif ARKAS Perubahan (Rp 0). Anda dapat memulihkan, mengedit, memindahkan ke bulan lain, atau menghapus total.
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
                Bila ada belanja di lembar kerja bulanan yang Anda tekan tombol "Hilangkan", rincian tersebut akan tercatat rapi di sini.
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
                    <th className="py-3 px-3 text-center w-40 font-serif">Pilihan Aksi</th>
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
                        <div className="flex items-center justify-center gap-1">
                          {/* Pulihkan */}
                          {onRestoreItem && (
                            <button
                              onClick={() => onRestoreItem(x.item, x.bulanIndex)}
                              className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition cursor-pointer border border-emerald-200"
                              title="Pulihkan rincian belanja ini kembali ke ARKAS Perubahan"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEditModal(x.item, x.bulanIndex)}
                            className="p-1.5 text-[#5A5A40] hover:bg-[#E8E2D6] rounded-lg transition cursor-pointer"
                            title="Edit rincian volume / tarif / alasan belanja"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Pindahkan */}
                          <button
                            onClick={() => handleOpenMoveModal(x.item, x.bulanIndex)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg transition cursor-pointer"
                            title="Pindahkan rincian belanja ini ke bulan lain"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>

                          {/* Hapus Total */}
                          <button
                            onClick={() => handleOpenHapusTotalModal(x.item, x.bulanIndex)}
                            className="p-1.5 text-[#8C867E] hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Hapus total rincian belanja ini secara permanen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Belanja Baru yang Ditambahkan (with Action Buttons) */}
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
                Kegiatan belanja baru yang sebelumnya tidak tercantum dalam ARKAS Murni. Anda dapat mengedit, memindahkan ke bulan lain, menghilangkan, atau menghapus total.
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
                    <th className="py-3 px-3 text-center w-40 font-serif">Pilihan Aksi</th>
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
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Hilangkan Belanja Baru */}
                          <button
                            onClick={() => handleOpenHilangkanModal(x.item, x.bulanIndex)}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 hover:text-rose-800 rounded-lg transition cursor-pointer"
                            title="Hilangkan / batalkan belanja baru ini"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEditModal(x.item, x.bulanIndex)}
                            className="p-1.5 text-[#5A5A40] hover:bg-[#E8E2D6] rounded-lg transition cursor-pointer"
                            title="Edit rincian volume / tarif / alasan belanja"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Pindahkan */}
                          <button
                            onClick={() => handleOpenMoveModal(x.item, x.bulanIndex)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg transition cursor-pointer"
                            title="Pindahkan rincian belanja ini ke bulan lain"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>

                          {/* Hapus Total */}
                          <button
                            onClick={() => handleOpenHapusTotalModal(x.item, x.bulanIndex)}
                            className="p-1.5 text-[#8C867E] hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Hapus total rincian belanja ini secara permanen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL: Edit Rincian Belanja */}
      {editingItemData && (
        <div className="fixed inset-0 z-50 bg-[#2C2A28]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 max-w-lg w-full shadow-2xl border border-[#E0DACE] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E0DACE] pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#5A5A40]" />
                <div>
                  <h3 className="text-base font-serif font-bold text-[#2C2A28]">
                    Edit Rincian Belanja di Rekapitulasi
                  </h3>
                  <p className="text-xs text-[#6B665E]">
                    Bulan: <b>{MONTH_NAMES[editingItemData.monthIndex]}</b>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingItemData(null)}
                className="p-1.5 text-[#8C867E] hover:text-[#2C2A28] rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditModal} className="space-y-4 text-xs">
              {/* Pemilihan Otomatis Sesuai Item Belanja BOS Reguler Kemendikbudristek */}
              <div className="p-3.5 bg-gradient-to-br from-[#FAF8F5] via-[#F4F0E6] to-[#EAE4D5] rounded-2xl border border-[#D5CEBF] shadow-xs space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C2A28]">
                    <Sparkles className="w-4 h-4 text-[#8C7A3E]" />
                    <span>Pilih Item Belanja BOS Reguler (Otomatis)</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300">
                    Standar Juknis ARKAS BOS Reguler
                  </span>
                </div>
                <p className="text-[11px] text-[#5C5852] leading-relaxed">
                  Pilih item belanja resmi BOS Reguler di bawah ini untuk mengisi <strong>Tema</strong>, <strong>Subtema Program</strong>, <strong>Kode Rekening</strong>, <strong>Kode Program</strong>, <strong>Satuan</strong>, dan <strong>Tarif</strong> secara otomatis.
                </p>

                <div>
                  <select
                    value={selectedBosItemId}
                    onChange={(e) => {
                      const tpl = BOS_REGULER_ITEM_TEMPLATES.find((it) => it.id === e.target.value);
                      if (tpl) {
                        handleApplyBosItem(tpl);
                      } else {
                        setSelectedBosItemId('');
                      }
                    }}
                    className="w-full p-2.5 bg-white border border-[#C5BDAF] rounded-xl font-medium text-[#2C2A28] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] cursor-pointer shadow-xs text-xs"
                  >
                    <option value="">-- Pilih dari Katalog Belanja BOS Reguler ({BOS_REGULER_ITEM_TEMPLATES.length} Item Tersedia) --</option>
                    {TEMA_STANDAR_LIST.map((tema) => {
                      const temaItems = BOS_REGULER_ITEM_TEMPLATES.filter((it) => it.temaKode === tema.kode);
                      if (temaItems.length === 0) return null;
                      return (
                        <optgroup key={tema.kode} label={`Standar ${tema.kode}: ${tema.nama}`}>
                          {temaItems.map((item) => (
                            <option key={item.id} value={item.id}>
                              [{item.subtemaKode}] {item.uraian} &mdash; {formatRp(item.tarifHarga)} / {item.satuan}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                </div>

                {/* Quick chip presets based on current Tema */}
                <div className="pt-0.5">
                  <div className="text-[10px] font-semibold text-[#6B665E] uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Item Belanja Populer Standar {editTemaId}:</span>
                    <span className="text-[10px] text-[#8C867E]">Klik untuk terapkan</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {BOS_REGULER_ITEM_TEMPLATES.filter((it) => it.temaKode === editTemaId).map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => handleApplyBosItem(tpl)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          selectedBosItemId === tpl.id || editUraian === tpl.uraian
                            ? 'bg-[#2C2A28] text-white border-[#2C2A28] font-bold shadow-xs'
                            : 'bg-white text-[#4A463F] border-[#D5CEBF] hover:bg-[#F9F7F2] hover:border-[#5A5A40]'
                        }`}
                      >
                        {tpl.uraian.split('-')[0].trim()} ({formatRp(tpl.tarifHarga)})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-[#2C2A28]">Standar SNP (Tema)</label>
                    <span className="text-[10px] text-[#8C867E]">8 Standar</span>
                  </div>
                  <select
                    value={editTemaId}
                    onChange={(e) => handleTemaChange(e.target.value)}
                    className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] cursor-pointer"
                  >
                    {TEMA_STANDAR_LIST.map((t) => (
                      <option key={t.kode} value={t.kode}>
                        Standar {t.kode} - {t.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-[#2C2A28]">Subtema / Program</label>
                    <span className="text-[10px] text-emerald-700 font-medium">Otomatis Sesuai Tema</span>
                  </div>
                  <select
                    value={editSubtemaKode}
                    onChange={(e) => handleSubtemaChange(e.target.value)}
                    className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] cursor-pointer"
                  >
                    {SUBTEMA_PROGRAM_LIST.filter(
                      (s) => s.temaKode === editTemaId
                    ).map((s) => (
                      <option key={s.kode} value={s.kode}>
                        {s.kode} - {s.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2C2A28] mb-1">Kode Rekening</label>
                <input
                  type="text"
                  value={editKodeRekening}
                  onChange={(e) => setEditKodeRekening(e.target.value)}
                  className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono text-xs text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2C2A28] mb-1">Kode Program / Kegiatan</label>
                <input
                  type="text"
                  value={editKodeProgram}
                  onChange={(e) => setEditKodeProgram(e.target.value)}
                  className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono text-xs text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2C2A28] mb-1">Uraian Belanja</label>
                <textarea
                  rows={2}
                  value={editUraian}
                  onChange={(e) => setEditUraian(e.target.value)}
                  className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                  required
                />
              </div>

              <div className="p-3 bg-[#F2EDE4]/60 border border-[#E0DACE] rounded-xl space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1">Volume</label>
                    <input
                      type="number"
                      min="0"
                      value={editVolume}
                      onChange={(e) =>
                        setEditVolume(Math.max(0, parseInt(e.target.value, 10) || 0))
                      }
                      className="w-full p-2 bg-white border border-[#E0DACE] rounded-xl font-mono font-bold text-[#2C2A28] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1">Satuan</label>
                    <input
                      type="text"
                      value={editSatuan}
                      onChange={(e) => setEditSatuan(e.target.value)}
                      className="w-full p-2 bg-white border border-[#E0DACE] rounded-xl text-[#2C2A28] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1">
                      Tarif (Rp)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={editTarif}
                      onChange={(e) =>
                        setEditTarif(Math.max(0, parseInt(e.target.value, 10) || 0))
                      }
                      className="w-full p-2 bg-white border border-[#E0DACE] rounded-xl font-mono font-bold text-[#2C2A28] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#E0DACE]/60 font-mono text-xs">
                  <span className="text-[#6B665E] font-sans font-semibold">Total Menjadi:</span>
                  <span className="font-bold text-[#059669]">
                    {formatRp(editVolume * editTarif)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2C2A28] mb-1">
                  Alasan / Keterangan Perubahan
                </label>
                <input
                  type="text"
                  value={editAlasan}
                  onChange={(e) => setEditAlasan(e.target.value)}
                  className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                  placeholder="mis. Penyesuaian volume dan harga dalam APBD Perubahan"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E0DACE]">
                <button
                  type="button"
                  onClick={() => setEditingItemData(null)}
                  className="px-4 py-2 text-[#6B665E] hover:bg-[#F2EDE4] rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5A5A40] hover:bg-[#484832] text-white rounded-xl font-semibold shadow-xs cursor-pointer transition active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Pindahkan Belanja ke Bulan Lain */}
      {movingItemData && (
        <div className="fixed inset-0 z-50 bg-[#2C2A28]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 max-w-md w-full shadow-2xl border border-[#E0DACE] space-y-4">
            <div className="flex items-center gap-2 text-indigo-700">
              <ArrowRightLeft className="w-5 h-5" />
              <h3 className="text-base font-serif font-bold text-[#2C2A28]">
                Pindahkan Belanja ke Bulan Lain
              </h3>
            </div>

            <p className="text-xs text-[#5C5852] leading-relaxed">
              Memindahkan rincian belanja dari bulan{' '}
              <b>{MONTH_NAMES[movingItemData.monthIndex]}</b> ke bulan pelaksanaan lain. Di bulan asal anggaran dialihkan/ditiadakan, dan di bulan tujuan ditambahkan secara otomatis.
            </p>

            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-[#2C2A28]">
                {movingItemData.item.uraian}
              </div>
              <div className="text-indigo-900 font-mono text-[11px] flex justify-between">
                <span>
                  Alokasi:{' '}
                  {movingItemData.item.volume || movingItemData.item.semulaVolume}{' '}
                  {movingItemData.item.satuan || movingItemData.item.semulaSatuan}
                </span>
                <span className="font-bold">
                  {formatRp(
                    movingItemData.item.jumlah || movingItemData.item.semulaJumlah
                  )}
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#2C2A28] text-xs mb-1">
                Pilih Bulan Tujuan:
              </label>
              <select
                value={targetMoveMonth}
                onChange={(e) => setTargetMoveMonth(parseInt(e.target.value, 10))}
                className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs font-semibold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {MONTH_NAMES.map((mName, mIdx) => (
                  <option
                    key={mIdx}
                    value={mIdx}
                    disabled={mIdx === movingItemData.monthIndex}
                  >
                    {mName}{' '}
                    {mIdx === movingItemData.monthIndex
                      ? '(Bulan Saat Ini - Asal)'
                      : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#2C2A28] text-xs mb-1">
                Alasan / Keterangan Pergeseran Bulan:
              </label>
              <textarea
                rows={2}
                value={targetMoveReason}
                onChange={(e) => setTargetMoveReason(e.target.value)}
                className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="mis. Penyesuaian jadwal pelaksanaan kegiatan ke bulan tersebut..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E0DACE]">
              <button
                type="button"
                onClick={() => setMovingItemData(null)}
                className="px-4 py-2 text-[#6B665E] hover:bg-[#F2EDE4] rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmMove}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition active:scale-95 flex items-center gap-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Pindahkan ke {MONTH_NAMES[targetMoveMonth]}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Hilangkan Belanja */}
      {cancelingItemData && (
        <div className="fixed inset-0 z-50 bg-[#2C2A28]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 max-w-md w-full shadow-2xl border border-[#E0DACE] space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <Ban className="w-5 h-5" />
              <h3 className="text-base font-serif font-bold text-[#2C2A28]">
                Hilangkan Belanja di ARKAS Perubahan
              </h3>
            </div>

            <p className="text-xs text-[#5C5852] leading-relaxed">
              Rincian belanja berikut akan diubah menjadi <b>Rp 0 (ditiadakan / dihilangkan)</b> pada
              ARKAS Perubahan untuk bulan <b>{MONTH_NAMES[cancelingItemData.monthIndex]}</b>:
            </p>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-[#2C2A28]">
                {cancelingItemData.item.uraian}
              </div>
              <div className="text-rose-800 font-mono text-[11px]">
                Semula: {cancelingItemData.item.semulaVolume}{' '}
                {cancelingItemData.item.semulaSatuan} &bull;{' '}
                <b>{formatRp(cancelingItemData.item.semulaJumlah)}</b>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#2C2A28] text-xs mb-1">
                Alasan Penghilangan / Pembatalan:
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                placeholder="mis. Ditiadakan karena dialihkan ke kegiatan prioritas lain..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E0DACE]">
              <button
                type="button"
                onClick={() => setCancelingItemData(null)}
                className="px-4 py-2 text-[#6B665E] hover:bg-[#F2EDE4] rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmHilangkan}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition active:scale-95 flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Hilangkan Belanja</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Hapus Total Permanen */}
      {deletingItemData && (
        <div className="fixed inset-0 z-50 bg-[#2C2A28]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 max-w-md w-full shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-base font-serif font-bold text-rose-900">
                Hapus Total Rincian Belanja
              </h3>
            </div>

            <p className="text-xs text-[#5C5852] leading-relaxed">
              PERHATIAN: Apakah Anda yakin ingin <b>MENGHAPUS TOTAL</b> rincian belanja berikut secara permanen dari bulan <b>{MONTH_NAMES[deletingItemData.monthIndex]}</b>? Data yang dihapus total tidak akan tercantum lagi pada lembar kerja ARKAS Perubahan.
            </p>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-[#2C2A28]">
                {deletingItemData.item.uraian}
              </div>
              <div className="text-rose-800 font-mono text-[11px]">
                Kode: {deletingItemData.item.kodeRekening} &bull; Nilai:{' '}
                {formatRp(
                  deletingItemData.item.jumlah || deletingItemData.item.semulaJumlah
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E0DACE]">
              <button
                type="button"
                onClick={() => setDeletingItemData(null)}
                className="px-4 py-2 text-[#6B665E] hover:bg-[#F2EDE4] rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmHapusTotal}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition active:scale-95 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Total Permanen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#065f46] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-emerald-400/30 animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastNotice}</span>
        </div>
      )}
    </div>
  );
};
