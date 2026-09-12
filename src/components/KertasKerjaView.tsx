import React, { useState, useMemo } from 'react';
import {
  Printer,
  Plus,
  Trash2,
  Edit2,
  Receipt,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Filter,
  Search,
  ArrowRight,
  Layers,
  Building,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { MonthWorksheet, KertasKerjaItem, SchoolProfile, SpjDocument, UserAccount, BosRegulerItemTemplate } from '../types';
import { formatRp, formatTanggalIndo, generateUid } from '../utils/formatters';
import { TEMA_STANDAR_LIST, SUBTEMA_PROGRAM_LIST, BOS_REGULER_ITEM_TEMPLATES } from '../data/standarData';
import { MONTH_NAMES } from '../data/schoolProfile';

interface KertasKerjaViewProps {
  school: SchoolProfile;
  worksheets: MonthWorksheet[];
  selectedMonth: number;
  onSelectMonth: (m: number) => void;
  onUpdateWorksheet: (ws: MonthWorksheet) => void;
  onCreateSpjFromItem: (item: KertasKerjaItem, monthIndex: number) => void;
  onPrintMonth: (mIndex: number) => void;
  searchQuery: string;
  documents?: SpjDocument[];
  onOpenSpjDoc?: (doc: SpjDocument) => void;
  onAddActivityLog?: (log: any) => void;
  currentUser?: UserAccount;
  onNavigateToTab?: (tab: string) => void;
}

export const KertasKerjaView: React.FC<KertasKerjaViewProps> = ({
  school,
  worksheets,
  selectedMonth,
  onSelectMonth,
  onUpdateWorksheet,
  onCreateSpjFromItem,
  onPrintMonth,
  searchQuery,
  documents = [],
  onOpenSpjDoc,
  onAddActivityLog,
  currentUser,
  onNavigateToTab
}) => {
  const currentWs = worksheets[selectedMonth] || worksheets[0];
  const [selectedTemaFilter, setSelectedTemaFilter] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<KertasKerjaItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // Form states for new/edit item
  const [selectedBosItemId, setSelectedBosItemId] = useState<string>('');
  const [formKodeRekening, setFormKodeRekening] = useState<string>('5.1.02.01.01.0025');
  const [formKodeProgram, setFormKodeProgram] = useState<string>('06.05.08');
  const [formUraian, setFormUraian] = useState<string>('');
  const [formVolume, setFormVolume] = useState<number>(1);
  const [formSatuan, setFormSatuan] = useState<string>('rim');
  const [formTarif, setFormTarif] = useState<number>(65000);
  const [formTemaId, setFormTemaId] = useState<string>('06');
  const [formSubtemaKode, setFormSubtemaKode] = useState<string>('06.05');

  // Handle auto-application of BOS Reguler template item
  const handleApplyBosItem = (itemTemplate: BosRegulerItemTemplate) => {
    setSelectedBosItemId(itemTemplate.id);
    setFormTemaId(itemTemplate.temaKode);
    setFormSubtemaKode(itemTemplate.subtemaKode);
    setFormKodeProgram(itemTemplate.kodeProgram);
    setFormKodeRekening(itemTemplate.kodeRekening);
    setFormUraian(itemTemplate.uraian);
    setFormSatuan(itemTemplate.satuan);
    setFormTarif(itemTemplate.tarifHarga);
  };

  // Handle Tema (Standar) change with automatic Subtema (Program) update
  const handleTemaChange = (newTemaKode: string) => {
    setFormTemaId(newTemaKode);
    const availableSubtemas = SUBTEMA_PROGRAM_LIST.filter((s) => s.temaKode === newTemaKode);
    if (availableSubtemas.length > 0) {
      const firstSub = availableSubtemas[0];
      setFormSubtemaKode(firstSub.kode);
      if (firstSub.kegiatanList && firstSub.kegiatanList.length > 0) {
        const progCode = firstSub.kegiatanList[0].split(' ')[0].replace(/\.$/, '');
        if (progCode) setFormKodeProgram(progCode);
      }
    }
  };

  // Handle Subtema (Program) change with automatic program code update
  const handleSubtemaChange = (newSubtemaKode: string) => {
    setFormSubtemaKode(newSubtemaKode);
    const sub = SUBTEMA_PROGRAM_LIST.find((s) => s.kode === newSubtemaKode);
    if (sub && sub.kegiatanList && sub.kegiatanList.length > 0) {
      const progCode = sub.kegiatanList[0].split(' ')[0].replace(/\.$/, '');
      if (progCode) setFormKodeProgram(progCode);
    }
  };

  // Calculate SPJ Usage status for each month (0..11)
  const monthlySpjStatus = useMemo(() => {
    return worksheets.map((ws, mIdx) => {
      const totalKertasKerja = ws.items.reduce((s, it) => s + it.jumlah, 0);

      // Find documents whose transaction date is in this month OR linked by sourceKertasKerjaId
      const spjDocs = documents.filter((doc) => {
        if (doc.tanggal) {
          const docMonth = new Date(doc.tanggal).getMonth();
          if (docMonth === mIdx) return true;
        }
        // Also check if any item in this month is linked
        return ws.items.some((it) => it.id === doc.sourceKertasKerjaId);
      });

      const totalSpjCreated = spjDocs.reduce((s, d) => s + (d.jumlah || 0), 0);
      const isUsed = spjDocs.length > 0;
      const isFull = isUsed && (totalSpjCreated >= totalKertasKerja || spjDocs.length >= Math.max(1, ws.items.length));
      const isPartial = isUsed && !isFull;

      return {
        monthIndex: mIdx,
        monthName: MONTH_NAMES[mIdx],
        totalKertasKerja,
        totalSpjCreated,
        spjDocs,
        isUsed,
        isFull,
        isPartial,
        docCount: spjDocs.length
      };
    });
  }, [worksheets, documents]);

  const currentMonthStatus = monthlySpjStatus[selectedMonth] || monthlySpjStatus[0];

  // Helper to find matching SPJ for an individual item
  const getItemSpjDoc = (item: KertasKerjaItem): SpjDocument | undefined => {
    return documents.find((doc) => {
      if (doc.sourceKertasKerjaId === item.id) return true;
      // Match by exact amount and month date
      if (doc.tanggal) {
        const docMonth = new Date(doc.tanggal).getMonth();
        if (docMonth === selectedMonth && (doc.jumlah === item.jumlah || (doc.uraian && item.uraian && doc.uraian.toLowerCase().includes(item.uraian.toLowerCase().slice(0, 15))))) {
          return true;
        }
      }
      return false;
    });
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return currentWs.items.filter((item) => {
      if (selectedTemaFilter !== 'all' && item.temaId !== selectedTemaFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const blob = `${item.kodeRekening} ${item.kodeProgram} ${item.uraian} ${item.temaNama} ${item.subtemaNama}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [currentWs, selectedTemaFilter, searchQuery]);

  const totalBelanjaBulan = useMemo(() => {
    return currentWs.items.reduce((s, it) => s + it.jumlah, 0);
  }, [currentWs]);

  const handleOpenAdd = () => {
    setIsAddingNew(true);
    setEditingItem(null);
    setSelectedBosItemId('bos_atk_hvs_a4');
    setFormKodeRekening('5.1.02.01.01.0025');
    setFormKodeProgram('06.05.08');
    setFormUraian('Kertas HVS-Bola Dunia A4 / 70 Gram');
    setFormVolume(1);
    setFormSatuan('rim');
    setFormTarif(65000);
    setFormTemaId('06');
    setFormSubtemaKode('06.05');
  };

  const handleOpenEdit = (it: KertasKerjaItem) => {
    setEditingItem(it);
    setIsAddingNew(false);
    const matched = BOS_REGULER_ITEM_TEMPLATES.find(
      (tpl) => tpl.kodeRekening === it.kodeRekening && tpl.uraian === it.uraian
    );
    setSelectedBosItemId(matched ? matched.id : '');
    setFormKodeRekening(it.kodeRekening);
    setFormKodeProgram(it.kodeProgram);
    setFormUraian(it.uraian);
    setFormVolume(it.volume);
    setFormSatuan(it.satuan);
    setFormTarif(it.tarifHarga);
    setFormTemaId(it.temaId);
    setFormSubtemaKode(it.subtemaKode);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUraian.trim()) {
      alert('Uraian belanja wajib diisi!');
      return;
    }

    const temaObj = TEMA_STANDAR_LIST.find((t) => t.kode === formTemaId);
    const subtemaObj = SUBTEMA_PROGRAM_LIST.find((s) => s.kode === formSubtemaKode);
    const jumlahBaru = formVolume * formTarif;

    if (editingItem) {
      // update
      const updatedItems = currentWs.items.map((it) => {
        if (it.id === editingItem.id) {
          return {
            ...it,
            kodeRekening: formKodeRekening,
            kodeProgram: formKodeProgram,
            uraian: formUraian,
            volume: formVolume,
            satuan: formSatuan,
            tarifHarga: formTarif,
            jumlah: jumlahBaru,
            temaId: formTemaId,
            temaNama: temaObj?.nama || it.temaNama,
            subtemaKode: formSubtemaKode,
            subtemaNama: subtemaObj?.nama || it.subtemaNama
          };
        }
        return it;
      });

      onUpdateWorksheet({
        ...currentWs,
        items: updatedItems
      });

      if (onAddActivityLog && currentUser) {
        onAddActivityLog({
          actorName: currentUser.nama,
          actorRole: currentUser.role,
          actionType: 'EDIT_WORKSHEET',
          title: `${currentUser.role === 'KEPSEK' ? 'Kepala Sekolah' : 'Bendahara'} memperbarui rincian di Kertas Kerja ${MONTH_NAMES[selectedMonth]}`,
          description: `Perubahan rincian: "${formUraian}" senilai ${formatRp(jumlahBaru)}`,
          targetType: 'worksheet',
          targetMonthIndex: selectedMonth
        });
      }
    } else {
      // create new
      const newItem: KertasKerjaItem = {
        id: generateUid(),
        noUrut: currentWs.items.length + 1,
        kodeRekening: formKodeRekening,
        kodeProgram: formKodeProgram,
        uraian: formUraian,
        volume: formVolume,
        satuan: formSatuan,
        tarifHarga: formTarif,
        jumlah: jumlahBaru,
        temaId: formTemaId,
        temaNama: temaObj?.nama || 'Standar ' + formTemaId,
        subtemaKode: formSubtemaKode,
        subtemaNama: subtemaObj?.nama || 'Program ' + formSubtemaKode
      };

      onUpdateWorksheet({
        ...currentWs,
        items: [...currentWs.items, newItem]
      });

      if (onAddActivityLog && currentUser) {
        onAddActivityLog({
          actorName: currentUser.nama,
          actorRole: currentUser.role,
          actionType: 'ADD_WORKSHEET_ITEM',
          title: `${currentUser.role === 'KEPSEK' ? 'Kepala Sekolah' : 'Bendahara'} menambah belanja di Kertas Kerja ${MONTH_NAMES[selectedMonth]}`,
          description: `Belanja baru: "${formUraian}" senilai ${formatRp(jumlahBaru)}`,
          targetType: 'worksheet',
          targetMonthIndex: selectedMonth
        });
      }
    }

    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = currentWs.items.find((it) => it.id === id);
    if (confirm('Hapus baris rincian belanja ini dari kertas kerja?')) {
      const updatedItems = currentWs.items.filter((it) => it.id !== id);
      // re-index noUrut
      const reindexed = updatedItems.map((it, idx) => ({ ...it, noUrut: idx + 1 }));
      onUpdateWorksheet({
        ...currentWs,
        items: reindexed
      });

      if (onAddActivityLog && currentUser && itemToDelete) {
        onAddActivityLog({
          actorName: currentUser.nama,
          actorRole: currentUser.role,
          actionType: 'DELETE_WORKSHEET_ITEM',
          title: `${currentUser.role === 'KEPSEK' ? 'Kepala Sekolah' : 'Bendahara'} menghapus rincian di Kertas Kerja ${MONTH_NAMES[selectedMonth]}`,
          description: `Menghapus rincian: "${itemToDelete.uraian}" senilai ${formatRp(itemToDelete.jumlah)}`,
          targetType: 'worksheet',
          targetMonthIndex: selectedMonth
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Month Navigator Toolbar with Clear SPJ Usage Checkmarks */}
      <div className="bg-white p-4 md:p-5 rounded-[24px] border border-[#E0DACE] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-thin">
          {MONTH_NAMES.map((m, idx) => {
            const isSelected = selectedMonth === idx;
            const status = monthlySpjStatus[idx];

            return (
              <button
                key={idx}
                id={`btn-month-${idx}`}
                onClick={() => onSelectMonth(idx)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#E8E2D6] text-[#2C2A28] border-2 border-[#5A5A40] shadow-2xs font-bold'
                    : 'bg-[#F9F7F2] hover:bg-[#F2EDE4] text-[#5C5852] border border-[#E0DACE]/80'
                }`}
                title={`Kertas Kerja ${m} - ${status.isUsed ? `Sudah Digunakan di ${status.docCount} Dokumen SPJ (${formatRp(status.totalSpjCreated)})` : 'Belum Digunakan di Dokumen SPJ'}`}
              >
                {/* Kode Centangan Status Penggunaan SPJ */}
                {status.isFull ? (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs">
                    ✓
                  </span>
                ) : status.isPartial ? (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    ⚡
                  </span>
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-400 text-slate-400 flex items-center justify-center text-[9px] shrink-0">
                    ○
                  </span>
                )}
                <span>{m}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
          <button
            id="btn-add-item-work-sheet"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-[#5A5A40] hover:bg-[#484832] text-white font-medium px-4 py-2 rounded-xl text-xs shadow-xs cursor-pointer transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Rincian</span>
          </button>

          <button
            id="btn-print-month-worksheet"
            onClick={() => onPrintMonth(selectedMonth)}
            className="flex items-center gap-1.5 bg-[#C06E52] hover:bg-[#A85A3F] text-white font-medium px-4 py-2 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Bulan Ini</span>
          </button>
        </div>
      </div>

      {/* Prominent Status Banner: Pemakaian Belanja di Dokumen SPJ Resmi */}
      <div
        className={`p-5 rounded-[24px] border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
          currentMonthStatus.isFull
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
            : currentMonthStatus.isPartial
            ? 'bg-amber-50/80 border-amber-300 text-amber-950'
            : 'bg-[#F9F7F2] border-[#E0DACE] text-[#3E3C3A]'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs font-bold text-lg ${
              currentMonthStatus.isFull
                ? 'bg-emerald-600 text-white'
                : currentMonthStatus.isPartial
                ? 'bg-amber-500 text-white'
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            {currentMonthStatus.isFull ? '✓' : currentMonthStatus.isPartial ? '⚡' : '○'}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  currentMonthStatus.isFull
                    ? 'bg-emerald-200 text-emerald-900'
                    : currentMonthStatus.isPartial
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {currentMonthStatus.isFull
                  ? 'KERTAS KERJA SUDAH DIGUNAKAN DI SPJ RESMI'
                  : currentMonthStatus.isPartial
                  ? 'KERTAS KERJA DIGUNAKAN SEBAGIAN DI SPJ'
                  : 'KERTAS KERJA BELUM DIGUNAKAN DI SPJ RESMI'}
              </span>
              <span className="text-xs font-bold font-serif">
                Bulan {MONTH_NAMES[selectedMonth]} {school.tahunAnggaran}
              </span>
            </div>

            <p className="text-xs leading-relaxed opacity-90">
              {currentMonthStatus.isFull ? (
                <>
                  Seluruh rincian belanja bulan ini telah diterbitkan menjadi dokumen SPJ resmi (Kwitansi / Daftar Honor / Nota). Total SPJ Terbit:{' '}
                  <strong>{formatRp(currentMonthStatus.totalSpjCreated)}</strong> ({currentMonthStatus.docCount} Dokumen).
                </>
              ) : currentMonthStatus.isPartial ? (
                <>
                  Sebagian belanja sudah diterbitkan ke dokumen SPJ resmi sebesar{' '}
                  <strong>{formatRp(currentMonthStatus.totalSpjCreated)}</strong> dari total anggaran{' '}
                  <strong>{formatRp(currentMonthStatus.totalKertasKerja)}</strong>.
                </>
              ) : (
                <>
                  Belanja bulan {MONTH_NAMES[selectedMonth]} sebesar{' '}
                  <strong>{formatRp(totalBelanjaBulan)}</strong> belum diterbitkan ke dokumen SPJ resmi (Kwitansi / Daftar Honor / Nota Toko).
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          {currentMonthStatus.isUsed && currentMonthStatus.spjDocs.length > 0 && onOpenSpjDoc && (
            <button
              onClick={() => onOpenSpjDoc(currentMonthStatus.spjDocs[0])}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F2EDE4] text-[#2C2A28] border border-[#D9D1C2] text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Lihat Dokumen SPJ Bulan Ini ({currentMonthStatus.docCount})</span>
              <ExternalLink className="w-3 h-3 text-[#8C867E]" />
            </button>
          )}

          {(!currentMonthStatus.isFull || currentMonthStatus.docCount === 0) && currentWs.items.length > 0 && (
            <button
              onClick={() => onCreateSpjFromItem(currentWs.items[0], selectedMonth)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#484832] text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>+ Buat SPJ dari Kertas Kerja Ini</span>
            </button>
          )}
        </div>
      </div>

      {/* Header Info Section per Kertas Kerja */}
      <div className="bg-white p-6 md:p-7 rounded-[28px] border border-[#E0DACE] shadow-xs space-y-4">
        <div className="border-b border-[#E0DACE] pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C867E]">
              RINCIAN KERTAS KERJA PERBULAN
            </div>
            <h2 className="text-xl font-serif font-bold text-[#2C2A28] mt-0.5">
              BULAN {MONTH_NAMES[selectedMonth].toUpperCase()} {school.tahunAnggaran}
            </h2>
            <p className="text-xs text-[#6B665E]">
              {school.nama} • {school.alamat}, Kec. {school.kecamatan}, Kab. {school.kabupaten}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C867E]">Total Belanja Bulan Ini</div>
              <div className="text-xl font-serif font-bold text-[#5A5A40]">
                {formatRp(totalBelanjaBulan)}
              </div>
            </div>
          </div>
        </div>

        {/* Filter by Tema / Standar */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-semibold text-[#8C867E] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#5A5A40]" /> Filter Tema:
          </span>
          <button
            onClick={() => setSelectedTemaFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedTemaFilter === 'all'
                ? 'bg-[#5A5A40] text-white'
                : 'bg-[#F9F7F2] text-[#5C5852] hover:bg-[#E8E2D6] border border-[#E0DACE]'
            }`}
          >
            Semua Tema
          </button>
          {TEMA_STANDAR_LIST.map((t) => (
            <button
              key={t.kode}
              onClick={() => setSelectedTemaFilter(t.kode)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedTemaFilter === t.kode
                  ? 'bg-[#5A5A40] text-white'
                  : 'bg-[#F9F7F2] text-[#5C5852] hover:bg-[#E8E2D6] border border-[#E0DACE]'
              }`}
            >
              Standar {t.kode}
            </button>
          ))}
        </div>

        {/* Worksheet Table with SPJ Status & Linking */}
        <div className="overflow-x-auto rounded-[20px] border border-[#E0DACE]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F2EDE4] text-[#2C2A28] text-[11px] font-serif font-bold uppercase tracking-wider border-b border-[#E0DACE]">
                <th className="py-3 px-3 text-center w-12 border-r border-[#E0DACE]">No.</th>
                <th className="py-3 px-3 w-32 border-r border-[#E0DACE]">Kode Rekening</th>
                <th className="py-3 px-3 w-24 border-r border-[#E0DACE]">Kode Prog</th>
                <th className="py-3 px-3 border-r border-[#E0DACE]">Tema, Subtema & Uraian Belanja</th>
                <th className="py-3 px-2 text-center w-14 border-r border-[#E0DACE]">Vol</th>
                <th className="py-3 px-2 text-center w-20 border-r border-[#E0DACE]">Satuan</th>
                <th className="py-3 px-3 text-right w-24 border-r border-[#E0DACE]">Tarif</th>
                <th className="py-3 px-3 text-right w-28 border-r border-[#E0DACE]">Jumlah</th>
                <th className="py-3 px-3 text-center w-36 border-r border-[#E0DACE]">Status SPJ Resmi</th>
                <th className="py-3 px-3 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0DACE]/60 bg-white">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#8C867E]">
                    Tidak ada rincian belanja pada filter ini.
                  </td>
                </tr>
              ) : (
                filteredItems.map((it, idx) => {
                  const matchedSpj = getItemSpjDoc(it);

                  return (
                    <tr key={it.id} className="hover:bg-[#F9F7F2] transition">
                      <td className="py-2.5 px-3 text-center font-bold text-[#8C867E] border-r border-[#E0DACE]/60">
                        {idx + 1}.
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#5C5852] font-semibold border-r border-[#E0DACE]/60 text-[11px]">
                        {it.kodeRekening || '-'}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#5C5852] font-semibold border-r border-[#E0DACE]/60 text-[11px]">
                        {it.kodeProgram || '-'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-[#E0DACE]/60">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-semibold px-2 py-0.2 rounded-full bg-[#5A5A40] text-white">
                            Tema {it.temaId}
                          </span>
                          <span className="text-[9px] font-medium text-[#8B4513] bg-[#C06E5215] border border-[#C06E5230] px-2 py-0.2 rounded-full">
                            {it.subtemaNama}
                          </span>
                        </div>
                        <div className="font-medium text-[#2C2A28] leading-snug">
                          {it.uraian}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-[#2C2A28] border-r border-[#E0DACE]/60">
                        {it.volume}
                      </td>
                      <td className="py-2.5 px-2 text-center text-[#6B665E] border-r border-[#E0DACE]/60">
                        {it.satuan}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#5C5852] border-r border-[#E0DACE]/60">
                        {formatRp(it.tarifHarga)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#2C2A28] border-r border-[#E0DACE]/60">
                        {formatRp(it.jumlah)}
                      </td>

                      {/* Kolom Kode Centangan & Status Penggunaan SPJ Resmi */}
                      <td className="py-2.5 px-3 text-center border-r border-[#E0DACE]/60">
                        {matchedSpj ? (
                          <div className="space-y-1">
                            <button
                              type="button"
                              onClick={() => onOpenSpjDoc && onOpenSpjDoc(matchedSpj)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold hover:bg-emerald-100 transition cursor-pointer group"
                              title="Klik untuk membuka dan mencetak dokumen SPJ resmi ini"
                            >
                              <span className="text-emerald-600 font-black">✓</span>
                              <span className="truncate max-w-[110px]">SPJ Terbit</span>
                              <ExternalLink className="w-2.5 h-2.5 text-emerald-600 group-hover:scale-110" />
                            </button>
                            <div className="text-[9px] text-slate-500 font-mono truncate max-w-[130px] mx-auto" title={matchedSpj.nomor}>
                              {matchedSpj.nomor}
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onCreateSpjFromItem(it, selectedMonth)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#F2EDE4] hover:bg-[#E8E2D6] text-[#6B665E] hover:text-[#2C2A28] border border-[#D9D1C2] text-[10px] font-medium transition cursor-pointer"
                            title="Item ini belum ada SPJ. Klik untuk membuat kwitansi/daftar honor sekarang"
                          >
                            <span className="text-slate-400">○</span>
                            <span>+ Buat SPJ</span>
                          </button>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onCreateSpjFromItem(it, selectedMonth)}
                            title="1-Klik Buat Kwitansi / Dokumen SPJ"
                            className="p-1.5 text-[#5A5A40] hover:bg-[#E8E2D6] rounded-lg transition cursor-pointer"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(it)}
                            title="Ubah Rincian"
                            className="p-1.5 text-[#6B665E] hover:bg-[#F2EDE4] rounded-lg transition cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(it.id)}
                            title="Hapus Rincian"
                            className="p-1.5 text-[#C06E52] hover:bg-[#FAF2EE] rounded-lg transition cursor-pointer"
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
            <tfoot>
              <tr className="bg-[#F2EDE4] font-bold text-[#2C2A28] text-xs border-t border-[#E0DACE]">
                <td colSpan={7} className="py-3 px-4 text-right font-serif">
                  TOTAL BELANJA BULAN {MONTH_NAMES[selectedMonth].toUpperCase()}:
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-sm text-[#5A5A40]">
                  {formatRp(totalBelanjaBulan)}
                </td>
                <td colSpan={2} className="py-3 px-3 text-center text-[10px] text-[#8C867E] font-sans">
                  {currentMonthStatus.isFull ? '✓ Ter-SPJ Lengkap' : `${currentMonthStatus.docCount} Dokumen SPJ`}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(isAddingNew || editingItem) && (
        <div className="fixed inset-0 z-50 bg-[#2C2A28]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[28px] p-6 max-w-xl w-full shadow-xl border border-[#E0DACE] space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#E0DACE] pb-3">
              <h3 className="text-base font-serif font-bold text-[#2C2A28]">
                {editingItem ? 'Ubah Rincian Kertas Kerja' : 'Tambah Rincian Kertas Kerja'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingItem(null);
                }}
                className="p-1.5 text-[#8C867E] hover:text-[#2C2A28] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs">
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
                    <span>Item Belanja Populer Standar {formTemaId}:</span>
                    <span className="text-[10px] text-[#8C867E]">Klik untuk terapkan</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {BOS_REGULER_ITEM_TEMPLATES.filter((it) => it.temaKode === formTemaId).map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => handleApplyBosItem(tpl)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          selectedBosItemId === tpl.id || formUraian === tpl.uraian
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

              {/* Standar / Tema & Subtema */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-[#2C2A28]">Tema (Standar)</label>
                    <span className="text-[10px] text-[#8C867E]">8 Standar SNP</span>
                  </div>
                  <select
                    value={formTemaId}
                    onChange={(e) => handleTemaChange(e.target.value)}
                    className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-medium text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] cursor-pointer"
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
                    <label className="block font-semibold text-[#2C2A28]">Subtema (Program)</label>
                    <span className="text-[10px] text-emerald-700 font-medium">Otomatis Sesuai Tema</span>
                  </div>
                  <select
                    value={formSubtemaKode}
                    onChange={(e) => handleSubtemaChange(e.target.value)}
                    className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-medium text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] cursor-pointer"
                  >
                    {SUBTEMA_PROGRAM_LIST.filter((s) => s.temaKode === formTemaId).map((s) => (
                      <option key={s.kode} value={s.kode}>
                        {s.kode} - {s.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2C2A28] mb-1">Kode Rekening</label>
                  <input
                    type="text"
                    value={formKodeRekening}
                    onChange={(e) => setFormKodeRekening(e.target.value)}
                    className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    placeholder="mis. 5.1.02.01.01.0024"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2C2A28] mb-1">Kode Program / Kegiatan</label>
                  <input
                    type="text"
                    value={formKodeProgram}
                    onChange={(e) => setFormKodeProgram(e.target.value)}
                    className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    placeholder="mis. 06.05.08"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2C2A28] mb-1">Uraian Belanja / Barang / Jasa</label>
                <textarea
                  rows={3}
                  value={formUraian}
                  onChange={(e) => setFormUraian(e.target.value)}
                  className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-medium text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                  placeholder="Deskripsi rincian belanja kertas kerja..."
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#2C2A28] mb-1">Volume</label>
                  <input
                    type="number"
                    min="1"
                    value={formVolume}
                    onChange={(e) => setFormVolume(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono font-bold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2C2A28] mb-1">Satuan</label>
                  <input
                    type="text"
                    value={formSatuan}
                    onChange={(e) => setFormSatuan(e.target.value)}
                    className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    placeholder="mis. buah, rim, box"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2C2A28] mb-1">Tarif Harga (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={formTarif}
                    onChange={(e) => setFormTarif(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono font-bold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                  />
                </div>
              </div>

              <div className="bg-[#F2EDE4] p-3.5 rounded-xl flex items-center justify-between font-mono border border-[#E0DACE]">
                <span className="text-[#6B665E] font-sans font-semibold">Total Nilai Rincian:</span>
                <span className="text-sm font-bold text-[#5A5A40]">
                  {formatRp(formVolume * formTarif)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 text-[#6B665E] hover:bg-[#F2EDE4] rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5A5A40] hover:bg-[#484832] text-white rounded-xl font-semibold shadow-xs cursor-pointer transition active:scale-95"
                >
                  Simpan Rincian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

