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
  Sparkles,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Ban,
  HelpCircle,
  GitCompare,
  ArrowRightLeft,
  Save,
  CalendarDays
} from 'lucide-react';
import {
  ArkasPerubahanMonthWorksheet,
  ArkasPerubahanItem,
  SchoolProfile,
  SpjDocument,
  UserAccount,
  PerubahanStatus,
  MonthWorksheet
} from '../types';
import { formatRp, formatTanggalIndo, generateUid } from '../utils/formatters';
import { TEMA_STANDAR_LIST, SUBTEMA_PROGRAM_LIST } from '../data/standarData';
import { MONTH_NAMES } from '../data/schoolProfile';
import { printArkasPerubahanWorksheet } from '../utils/printDocument';

interface ArkasPerubahanViewProps {
  school: SchoolProfile;
  worksheets: ArkasPerubahanMonthWorksheet[];
  murniWorksheets: MonthWorksheet[];
  selectedMonth: number;
  onSelectMonth: (m: number) => void;
  onUpdateWorksheet: (ws: ArkasPerubahanMonthWorksheet) => void;
  onResetFromMurni: () => void;
  onCreateSpjFromPerubahanItem: (item: ArkasPerubahanItem, monthIndex: number) => void;
  onPrintMonth: (mIndex: number) => void;
  searchQuery: string;
  documents?: SpjDocument[];
  onOpenSpjDoc?: (doc: SpjDocument) => void;
  onAddActivityLog?: (log: any) => void;
  currentUser?: UserAccount;
  onNavigateToRekapPerubahan?: () => void;
  onSaveItem?: (item: ArkasPerubahanItem, monthIndex: number) => void;
  onEditItem?: (item: ArkasPerubahanItem, monthIndex: number) => void;
  onHilangkanItem?: (item: ArkasPerubahanItem, monthIndex: number, reason?: string) => void;
  onMoveItem?: (item: ArkasPerubahanItem, fromMonthIndex: number, toMonthIndex: number, reason?: string) => void;
  onHapusTotalItem?: (item: ArkasPerubahanItem, monthIndex: number) => void;
  onRestoreItem?: (item: ArkasPerubahanItem, monthIndex: number) => void;
}

export const ArkasPerubahanView: React.FC<ArkasPerubahanViewProps> = ({
  school,
  worksheets,
  murniWorksheets,
  selectedMonth,
  onSelectMonth,
  onUpdateWorksheet,
  onResetFromMurni,
  onCreateSpjFromPerubahanItem,
  onPrintMonth,
  searchQuery,
  documents = [],
  onOpenSpjDoc,
  onAddActivityLog,
  currentUser,
  onNavigateToRekapPerubahan,
  onSaveItem,
  onEditItem,
  onHilangkanItem,
  onMoveItem,
  onHapusTotalItem,
  onRestoreItem
}) => {
  const currentWs = worksheets[selectedMonth] || worksheets[0];
  const [selectedTemaFilter, setSelectedTemaFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('AKTIF');
  const [eliminationNotice, setEliminationNotice] = useState<{
    item: ArkasPerubahanItem;
    amount: number;
  } | null>(null);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  // Modal states
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ArkasPerubahanItem | null>(null);
  const [cancelingItem, setCancelingItem] = useState<ArkasPerubahanItem | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [movingItem, setMovingItem] = useState<ArkasPerubahanItem | null>(null);
  const [targetMoveMonth, setTargetMoveMonth] = useState<number>((selectedMonth + 1) % 12);
  const [targetMoveReason, setTargetMoveReason] = useState<string>('');
  const [hapusTotalItem, setHapusTotalItem] = useState<ArkasPerubahanItem | null>(null);

  // Form states for Add / Edit
  const [formKodeRekening, setFormKodeRekening] = useState<string>('5.1.02.01.01.0024');
  const [formKodeProgram, setFormKodeProgram] = useState<string>('06.05.08');
  const [formUraian, setFormUraian] = useState<string>('');
  const [formVolume, setFormVolume] = useState<number>(1);
  const [formSatuan, setFormSatuan] = useState<string>('buah');
  const [formTarif, setFormTarif] = useState<number>(0);
  const [formTemaId, setFormTemaId] = useState<string>('06');
  const [formSubtemaKode, setFormSubtemaKode] = useState<string>('06.05');
  const [formAlasan, setFormAlasan] = useState<string>('');

  // Semula fields (read-only in edit mode if existing item)
  const [semulaVol, setSemulaVol] = useState<number>(0);
  const [semulaSat, setSemulaSat] = useState<string>('');
  const [semulaTar, setSemulaTar] = useState<number>(0);
  const [semulaJum, setSemulaJum] = useState<number>(0);

  // Status SPJ bulanan
  const monthlySpjStatus = useMemo(() => {
    return worksheets.map((ws, mIdx) => {
      const totalKertasKerja = ws.items.reduce((s, it) => s + it.jumlah, 0);

      const spjDocs = documents.filter((doc) => {
        if (doc.sourceArkasType === 'perubahan') {
          if (doc.tanggal) {
            const docMonth = new Date(doc.tanggal).getMonth();
            if (docMonth === mIdx) return true;
          }
          return ws.items.some((it) => it.id === doc.sourceKertasKerjaId);
        }
        return false;
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

  // Helper matching SPJ document for an individual item
  const getItemSpjDoc = (item: ArkasPerubahanItem): SpjDocument | undefined => {
    return documents.find((doc) => {
      if (doc.sourceKertasKerjaId === item.id) return true;
      if (doc.sourceArkasType === 'perubahan' && doc.tanggal) {
        const docMonth = new Date(doc.tanggal).getMonth();
        if (docMonth === selectedMonth && (doc.jumlah === item.jumlah || (doc.uraian && item.uraian && doc.uraian.toLowerCase().includes(item.uraian.toLowerCase().slice(0, 15))))) {
          return true;
        }
      }
      return false;
    });
  };

  // KPIs for current month
  const totalSemulaBulan = useMemo(() => {
    return currentWs.items.reduce((s, it) => s + it.semulaJumlah, 0);
  }, [currentWs]);

  const totalMenjadiBulan = useMemo(() => {
    return currentWs.items.reduce((s, it) => s + it.jumlah, 0);
  }, [currentWs]);

  const selisihBulan = totalMenjadiBulan - totalSemulaBulan;

  // Counts by status
  const counts = useMemo(() => {
    let baru = 0;
    let bertambah = 0;
    let berkurang = 0;
    let dihilangkan = 0;
    let tetap = 0;

    currentWs.items.forEach((it) => {
      if (it.statusPerubahan === 'BARU') baru++;
      else if (it.statusPerubahan === 'BERTAMBAH') bertambah++;
      else if (it.statusPerubahan === 'BERKURANG') berkurang++;
      else if (it.statusPerubahan === 'DIHILANGKAN') dihilangkan++;
      else tetap++;
    });

    return { baru, bertambah, berkurang, dihilangkan, tetap };
  }, [currentWs]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return currentWs.items.filter((item) => {
      if (selectedTemaFilter !== 'all' && item.temaId !== selectedTemaFilter) {
        return false;
      }
      if (selectedStatusFilter === 'AKTIF') {
        if (item.statusPerubahan === 'DIHILANGKAN') return false;
      } else if (selectedStatusFilter !== 'all' && item.statusPerubahan !== selectedStatusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const blob = `${item.kodeRekening} ${item.kodeProgram} ${item.uraian} ${item.temaNama} ${item.subtemaNama} ${item.alasanPerubahan || ''}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [currentWs, selectedTemaFilter, selectedStatusFilter, searchQuery]);

  // Open Add modal (Item baru yang tidak terdapat di Arkas Murni)
  const handleOpenAdd = () => {
    setIsAddingNew(true);
    setEditingItem(null);
    setFormKodeRekening('5.1.02.01.01.0024');
    setFormKodeProgram('06.05.08');
    setFormUraian('');
    setFormVolume(1);
    setFormSatuan('buah');
    setFormTarif(100000);
    setFormTemaId('06');
    setFormSubtemaKode('06.05');
    setFormAlasan('Penambahan belanja baru yang tidak terdapat di ARKAS Murni untuk kebutuhan mendesak');
    setSemulaVol(0);
    setSemulaSat('-');
    setSemulaTar(0);
    setSemulaJum(0);
  };

  // Open Edit modal
  const handleOpenEdit = (it: ArkasPerubahanItem) => {
    setEditingItem(it);
    setIsAddingNew(false);
    setFormKodeRekening(it.kodeRekening);
    setFormKodeProgram(it.kodeProgram);
    setFormUraian(it.uraian);
    setFormVolume(it.volume);
    setFormSatuan(it.satuan);
    setFormTarif(it.tarifHarga);
    setFormTemaId(it.temaId);
    setFormSubtemaKode(it.subtemaKode);
    setFormAlasan(it.alasanPerubahan || '');

    setSemulaVol(it.semulaVolume);
    setSemulaSat(it.semulaSatuan);
    setSemulaTar(it.semulaTarif);
    setSemulaJum(it.semulaJumlah);
  };

  // Save Add / Edit
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
      // Update existing item
      let calculatedStatus: PerubahanStatus = 'TETAP';
      if (editingItem.statusPerubahan === 'BARU') {
        calculatedStatus = 'BARU';
      } else if (formVolume === 0 || jumlahBaru === 0) {
        calculatedStatus = 'DIHILANGKAN';
      } else if (jumlahBaru > editingItem.semulaJumlah) {
        calculatedStatus = 'BERTAMBAH';
      } else if (jumlahBaru < editingItem.semulaJumlah) {
        calculatedStatus = 'BERKURANG';
      } else {
        calculatedStatus = 'TETAP';
      }

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
            selisihJumlah: jumlahBaru - it.semulaJumlah,
            selisihVolume: formVolume - it.semulaVolume,
            statusPerubahan: calculatedStatus,
            alasanPerubahan: formAlasan || 'Penyesuaian volume dan tarif dalam perubahan anggaran',
            temaId: formTemaId,
            temaNama: temaObj?.nama || it.temaNama,
            subtemaKode: formSubtemaKode,
            subtemaNama: subtemaObj?.nama || it.subtemaNama,
            updatedAt: new Date().toISOString()
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
          actionType: 'EDIT_PERUBAHAN',
          title: `${currentUser.role === 'KEPSEK' ? 'Kepala Sekolah' : 'Bendahara'} memperbarui item di ARKAS Perubahan ${MONTH_NAMES[selectedMonth]}`,
          description: `Perubahan: "${formUraian}" menjadi ${formatRp(jumlahBaru)} (Selisih ${formatRp(jumlahBaru - editingItem.semulaJumlah)})`,
          targetType: 'perubahan',
          targetMonthIndex: selectedMonth
        });
      }
    } else {
      // Create new item (BARU)
      const newItem: ArkasPerubahanItem = {
        id: `perub_new_${generateUid()}`,
        noUrut: currentWs.items.length + 1,
        kodeRekening: formKodeRekening,
        kodeProgram: formKodeProgram,
        uraian: formUraian,
        semulaVolume: 0,
        semulaSatuan: formSatuan,
        semulaTarif: 0,
        semulaJumlah: 0,
        volume: formVolume,
        satuan: formSatuan,
        tarifHarga: formTarif,
        jumlah: jumlahBaru,
        selisihJumlah: jumlahBaru,
        selisihVolume: formVolume,
        statusPerubahan: 'BARU',
        alasanPerubahan: formAlasan || 'Penambahan kegiatan baru yang belum tercantum pada ARKAS Murni',
        temaId: formTemaId,
        temaNama: temaObj?.nama || 'Standar ' + formTemaId,
        subtemaKode: formSubtemaKode,
        subtemaNama: subtemaObj?.nama || 'Program ' + formSubtemaKode,
        createdAt: new Date().toISOString()
      };

      onUpdateWorksheet({
        ...currentWs,
        items: [...currentWs.items, newItem]
      });

      if (onAddActivityLog && currentUser) {
        onAddActivityLog({
          actorName: currentUser.nama,
          actorRole: currentUser.role,
          actionType: 'ADD_PERUBAHAN_ITEM',
          title: `${currentUser.role === 'KEPSEK' ? 'Kepala Sekolah' : 'Bendahara'} menambahkan Belanja Baru di ARKAS Perubahan`,
          description: `Penambahan baru: "${formUraian}" senilai ${formatRp(jumlahBaru)} (${MONTH_NAMES[selectedMonth]})`,
          targetType: 'perubahan',
          targetMonthIndex: selectedMonth
        });
      }
    }

    setIsAddingNew(false);
    setEditingItem(null);
  };

  // Open modal to cancel / eliminate item (Penghilangan Belanja)
  const handleOpenCancelModal = (it: ArkasPerubahanItem) => {
    setCancelingItem(it);
    setCancelReason('Dihilangkan / dibatalkan karena dialihkan ke kebutuhan prioritas lain dalam perubahan anggaran');
  };

  // Confirm cancel / eliminate item
  const handleConfirmCancel = () => {
    if (!cancelingItem) return;

    const targetItem = cancelingItem;
    const isItemBaru = targetItem.statusPerubahan === 'BARU';

    let updatedItems: ArkasPerubahanItem[];

    if (isItemBaru) {
      // Jika item baru yang tidak terdapat di Murni, hapus dari daftar
      updatedItems = currentWs.items.filter((it) => it.id !== targetItem.id);
    } else {
      // Jika item dari Murni, set Rp 0 dan beri status DIHILANGKAN
      updatedItems = currentWs.items.map((it) => {
        if (it.id === targetItem.id) {
          return {
            ...it,
            volume: 0,
            jumlah: 0,
            selisihJumlah: -it.semulaJumlah,
            selisihVolume: -it.semulaVolume,
            statusPerubahan: 'DIHILANGKAN' as PerubahanStatus,
            alasanPerubahan: cancelReason || 'Dihilangkan / dibatalkan dalam ARKAS Perubahan',
            updatedAt: new Date().toISOString()
          };
        }
        return it;
      });
    }

    onUpdateWorksheet({
      ...currentWs,
      items: updatedItems
    });

    setEliminationNotice({
      item: targetItem,
      amount: targetItem.semulaJumlah
    });

    if (onAddActivityLog && currentUser) {
      onAddActivityLog({
        actorName: currentUser.nama,
        actorRole: currentUser.role,
        actionType: 'EDIT_PERUBAHAN',
        title: `${currentUser.role === 'KEPSEK' ? 'Kepala Sekolah' : 'Bendahara'} meniadakan belanja di ARKAS Perubahan`,
        description: `Penghilangan belanja: "${targetItem.uraian}" (Pengurangan ${formatRp(targetItem.semulaJumlah)})`,
        targetType: 'perubahan',
        targetMonthIndex: selectedMonth
      });
    }

    setCancelingItem(null);
  };

  // Restore eliminated item back to original Murni
  const handleRestoreItem = (it: ArkasPerubahanItem) => {
    if (!confirm(`Pulihkan rincian belanja "${it.uraian}" kembali ke volume semula (${it.semulaVolume} ${it.semulaSatuan})?`)) {
      return;
    }

    const updatedItems = currentWs.items.map((item) => {
      if (item.id === it.id) {
        return {
          ...item,
          volume: item.semulaVolume,
          satuan: item.semulaSatuan,
          tarifHarga: item.semulaTarif,
          jumlah: item.semulaJumlah,
          selisihJumlah: 0,
          selisihVolume: 0,
          statusPerubahan: 'TETAP' as PerubahanStatus,
          alasanPerubahan: 'Dipulihkan kembali sesuai ARKAS Murni',
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });

    onUpdateWorksheet({
      ...currentWs,
      items: updatedItems
    });
  };

  // Action: Simpan item
  const handleSaveItemClick = (item: ArkasPerubahanItem) => {
    if (onSaveItem) {
      onSaveItem(item, selectedMonth);
    } else {
      const updatedItems = currentWs.items.map((it) =>
        it.id === item.id ? { ...it, isSaved: true, savedAt: new Date().toISOString() } : it
      );
      onUpdateWorksheet({ ...currentWs, items: updatedItems });
    }
    setSavedToast(`Rincian "${item.uraian}" berhasil disimpan & diverifikasi`);
    setTimeout(() => setSavedToast(null), 3000);
  };

  // Action: Pindahkan item ke bulan lain
  const handleOpenMoveModal = (item: ArkasPerubahanItem) => {
    setMovingItem(item);
    const nextM = (selectedMonth + 1) % 12;
    setTargetMoveMonth(nextM);
    setTargetMoveReason(`Pergeseran jadwal pelaksanaan ke bulan ${MONTH_NAMES[nextM]}`);
  };

  const handleConfirmMove = () => {
    if (!movingItem) return;
    if (onMoveItem) {
      onMoveItem(movingItem, selectedMonth, targetMoveMonth, targetMoveReason);
    }
    setSavedToast(`Rincian "${movingItem.uraian}" berhasil dipindahkan ke bulan ${MONTH_NAMES[targetMoveMonth]}`);
    setMovingItem(null);
    setTimeout(() => setSavedToast(null), 3500);
  };

  // Action: Hapus total
  const handleOpenHapusTotal = (item: ArkasPerubahanItem) => {
    setHapusTotalItem(item);
  };

  const handleConfirmHapusTotal = () => {
    if (!hapusTotalItem) return;
    if (onHapusTotalItem) {
      onHapusTotalItem(hapusTotalItem, selectedMonth);
    } else {
      const updatedItems = currentWs.items.filter((it) => it.id !== hapusTotalItem.id);
      onUpdateWorksheet({ ...currentWs, items: updatedItems });
    }
    setSavedToast(`Rincian "${hapusTotalItem.uraian}" telah dihapus total permanen`);
    setHapusTotalItem(null);
    setTimeout(() => setSavedToast(null), 3000);
  };

  // Permanently delete newly added item (BARU)
  const handleDeleteNewItem = (id: string, uraian: string) => {
    if (!confirm(`Hapus permanen rincian belanja baru: "${uraian}"?`)) {
      return;
    }

    const updatedItems = currentWs.items.filter((it) => it.id !== id);
    onUpdateWorksheet({
      ...currentWs,
      items: updatedItems
    });
  };

  const handlePrint = () => {
    printArkasPerubahanWorksheet(currentWs, selectedMonth, school);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white p-6 md:p-8 rounded-[28px] border border-[#E0DACE] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-0.5 rounded-full bg-[#5A5A40] text-white">
                ARKAS PERUBAHAN &bull; APBD-P {school.tahunAnggaran}
              </span>
              <span className="text-[11px] font-semibold text-[#8C867E]">
                SMP Negeri 7 Sentani
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2C2A28] leading-tight">
              Kertas Kerja Perubahan Anggaran (Bulan {MONTH_NAMES[selectedMonth]})
            </h2>
            <p className="text-xs text-[#6B665E] max-w-3xl leading-relaxed">
              Merekam secara lengkap setiap <b>penghilangan belanja</b>, <b>penambahan volume/anggaran</b>, serta{' '}
              <b>belanja baru yang sebelumnya tidak terdapat di ARKAS Murni</b>. Dokumen SPJ resmi (Kwitansi, Honor, Nota)
              berlaku penuh dan sinkron langsung dengan ARKAS Perubahan.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onNavigateToRekapPerubahan && (
              <button
                onClick={onNavigateToRekapPerubahan}
                className="flex items-center gap-1.5 bg-[#047857] hover:bg-[#065f46] text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
                title="Buka Rekapan Komprehensif Perubahan Anggaran 12 Bulan & 8 Standar"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Rekapan Perubahan Anggaran</span>
              </button>
            )}

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
              title="Tambah rincian belanja baru yang sebelumnya tidak ada di ARKAS Murni"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Belanja Baru</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#5A5A40] hover:bg-[#484832] text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
              title="Cetak format perbandingan komparatif RKA-Perubahan A4"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Komparatif A4</span>
            </button>

            <button
              onClick={() => {
                if (
                  confirm(
                    'PERHATIAN: Apakah Anda yakin ingin memuat ulang/menyinkronkan data dari ARKAS Murni ke ARKAS Perubahan? Perubahan kustom yang belum tersimpan akan disesuaikan kembali dengan data ARKAS reguler.'
                  )
                ) {
                  onResetFromMurni();
                }
              }}
              className="flex items-center gap-1.5 bg-[#F9F7F2] hover:bg-[#F2EDE4] text-[#5C5852] font-semibold px-3 py-2.5 rounded-xl text-xs border border-[#E0DACE] transition cursor-pointer"
              title="Sinkronkan dasar data dari ARKAS Murni"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#8C867E]" />
              <span className="hidden sm:inline">Sinkron dari Murni</span>
            </button>
          </div>
        </div>

        {/* 12-Month Selector Strip with Status Badges */}
        <div className="mt-6 pt-5 border-t border-[#E0DACE]">
          <div className="flex items-center justify-between gap-2 mb-2 text-xs font-semibold text-[#8C867E]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>PILIH BULAN KERJA ANGGARAN PERUBAHAN:</span>
            </span>
            <span className="text-[11px] text-[#6B665E]">
              Keterangan: <span className="text-emerald-700 font-bold">✓ SPJ Terbit</span> &bull;{' '}
              <span className="text-[#8C867E]">○ Belum SPJ</span>
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5">
            {MONTH_NAMES.map((name, idx) => {
              const isSelected = selectedMonth === idx;
              const st = monthlySpjStatus[idx];
              const monthItemsCount = worksheets[idx]?.items.length || 0;

              return (
                <button
                  key={idx}
                  onClick={() => onSelectMonth(idx)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs transition cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#5A5A40] text-white font-bold shadow-xs'
                      : 'bg-[#F9F7F2] hover:bg-[#F2EDE4] text-[#2C2A28] border border-[#E0DACE]'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{name.slice(0, 3)}</span>
                    {st && st.isUsed && (
                      <span
                        className={`text-[10px] font-bold ${
                          isSelected ? 'text-emerald-200' : 'text-emerald-700'
                        }`}
                        title="Dokumen SPJ Resmi sudah diterbitkan untuk bulan ini"
                      >
                        ✓
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[9px] mt-0.5 ${
                      isSelected ? 'text-white/80' : 'text-[#8C867E]'
                    }`}
                  >
                    {monthItemsCount} item
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparative Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Semula */}
        <div className="bg-white p-5 rounded-[22px] border border-[#E0DACE] shadow-2xs">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C867E]">
            ANGGARAN SEMULA (ARKAS MURNI)
          </div>
          <div className="text-lg font-serif font-bold text-[#2C2A28] mt-1">
            {formatRp(totalSemulaBulan)}
          </div>
          <div className="text-[11px] text-[#6B665E] mt-0.5">
            Pagu awal bulan {MONTH_NAMES[selectedMonth]}
          </div>
        </div>

        {/* Menjadi */}
        <div className="bg-white p-5 rounded-[22px] border border-[#E0DACE] shadow-2xs">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#059669]">
            ANGGARAN MENJADI (PERUBAHAN)
          </div>
          <div className="text-lg font-serif font-bold text-[#059669] mt-1">
            {formatRp(totalMenjadiBulan)}
          </div>
          <div className="text-[11px] text-[#6B665E] mt-0.5">
            Total realokasi bulan {MONTH_NAMES[selectedMonth]}
          </div>
        </div>

        {/* Selisih */}
        <div className="bg-white p-5 rounded-[22px] border border-[#E0DACE] shadow-2xs">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C867E] flex items-center justify-between">
            <span>SELISIH / PERGESERAN NET</span>
            {selisihBulan > 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            ) : selisihBulan < 0 ? (
              <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            ) : null}
          </div>
          <div
            className={`text-lg font-serif font-bold mt-1 ${
              selisihBulan > 0
                ? 'text-emerald-700'
                : selisihBulan < 0
                ? 'text-rose-700'
                : 'text-[#5C5852]'
            }`}
          >
            {selisihBulan > 0 ? '+' : ''}
            {formatRp(selisihBulan)}
          </div>
          <div className="text-[11px] text-[#6B665E] mt-0.5">
            {selisihBulan > 0
              ? 'Bertambah dari pagu awal'
              : selisihBulan < 0
              ? 'Berkurang dari pagu awal'
              : 'Tidak ada perubahan total nominal'}
          </div>
        </div>

        {/* Rekap Item Perubahan */}
        <div className="bg-[#F9F7F2] p-5 rounded-[22px] border border-[#E0DACE] shadow-2xs flex flex-col justify-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C867E] mb-1.5">
            STATUS PERUBAHAN BULAN INI
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {counts.baru} Baru
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
              {counts.bertambah} Tambah
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
              {counts.berkurang} Kurang
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
              {counts.dihilangkan} Dihilangkan
            </span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {counts.tetap} Tetap
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-[22px] border border-[#E0DACE] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status filter tabs */}
          <div className="flex items-center bg-[#F9F7F2] p-1 rounded-xl border border-[#E0DACE] text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setSelectedStatusFilter('AKTIF')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                selectedStatusFilter === 'AKTIF'
                  ? 'bg-[#5A5A40] text-white shadow-2xs font-bold'
                  : 'text-[#6B665E] hover:text-[#2C2A28]'
              }`}
              title="Menampilkan belanja aktif (item dihilangkan disembunyikan)"
            >
              <span>Belanja Aktif</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${selectedStatusFilter === 'AKTIF' ? 'bg-white/20 text-white' : 'bg-[#E0DACE] text-[#5C5852]'}`}>
                {currentWs.items.length - counts.dihilangkan}
              </span>
            </button>
            <button
              onClick={() => setSelectedStatusFilter('DIHILANGKAN')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                selectedStatusFilter === 'DIHILANGKAN'
                  ? 'bg-rose-700 text-white shadow-2xs font-bold'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
              title="Lihat daftar rincian belanja yang ditiadakan/dihilangkan"
            >
              <Ban className="w-3 h-3" />
              <span>Dihilangkan ({counts.dihilangkan})</span>
            </button>
            <button
              onClick={() => setSelectedStatusFilter('BARU')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                selectedStatusFilter === 'BARU'
                  ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <span>+ Baru ({counts.baru})</span>
            </button>
            <button
              onClick={() => setSelectedStatusFilter('BERTAMBAH')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedStatusFilter === 'BERTAMBAH'
                  ? 'bg-blue-700 text-white shadow-2xs font-bold'
                  : 'text-blue-700 hover:bg-blue-50'
              }`}
            >
              Bertambah ({counts.bertambah})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('BERKURANG')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedStatusFilter === 'BERKURANG'
                  ? 'bg-amber-700 text-white shadow-2xs font-bold'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              Berkurang ({counts.berkurang})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedStatusFilter === 'all'
                  ? 'bg-gray-800 text-white shadow-2xs font-bold'
                  : 'text-[#6B665E] hover:text-[#2C2A28]'
              }`}
              title="Semua rincian termasuk yang dihilangkan"
            >
              Semua ({currentWs.items.length})
            </button>
          </div>

          {/* Standar Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#8C867E]" />
            <select
              value={selectedTemaFilter}
              onChange={(e) => setSelectedTemaFilter(e.target.value)}
              className="bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs font-semibold px-3 py-2 text-[#2C2A28] focus:outline-none"
            >
              <option value="all">Semua Standar (8 Standar)</option>
              {TEMA_STANDAR_LIST.map((t) => (
                <option key={t.kode} value={t.kode}>
                  {t.kode}. {t.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari rekening / uraian / alasan..."
            value={searchQuery}
            onChange={() => {}}
            className="w-full pl-9 pr-3 py-2 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
          />
        </div>
      </div>

      {/* Elimination Notice Toast Banner */}
      {eliminationNotice && (
        <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-900 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Ban className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <span>
                Rincian belanja <strong>"{eliminationNotice.item.uraian}"</strong> telah dihilangkan dari lembar kerja aktif.
                Pengurangan anggaran <strong>{formatRp(eliminationNotice.amount)}</strong> tercatat di Rekapan Perubahan.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => {
                handleRestoreItem(eliminationNotice.item);
                setEliminationNotice(null);
              }}
              className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Pulihkan</span>
            </button>
            {onNavigateToRekapPerubahan && (
              <button
                onClick={onNavigateToRekapPerubahan}
                className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition shadow-2xs"
              >
                <FileSpreadsheet className="w-3 h-3" />
                <span>Lihat Rekapan</span>
              </button>
            )}
            <button
              onClick={() => setEliminationNotice(null)}
              className="p-1 text-rose-500 hover:text-rose-800 cursor-pointer"
              title="Tutup pemberitahuan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Filter Context Information Banner */}
      {selectedStatusFilter === 'AKTIF' && counts.dihilangkan > 0 && (
        <div className="px-4 py-2 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              Terdapat <strong>{counts.dihilangkan} rincian belanja dihilangkan (Rp 0)</strong> yang disembunyikan dari tabel lembar kerja aktif ini.
            </span>
          </div>
          <button
            onClick={() => setSelectedStatusFilter('DIHILANGKAN')}
            className="text-amber-800 hover:text-amber-950 font-bold underline text-[11px] cursor-pointer shrink-0"
          >
            Tampilkan Yang Dihilangkan ({counts.dihilangkan}) &rarr;
          </button>
        </div>
      )}

      {selectedStatusFilter === 'DIHILANGKAN' && (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Ban className="w-4 h-4 text-rose-700 shrink-0" />
            <span>
              Menampilkan <strong>{filteredItems.length} belanja yang dihilangkan</strong> pada bulan {MONTH_NAMES[selectedMonth]}. Belanja ini diubah menjadi Rp 0 dan dikecualikan dari total anggaran berjalan.
            </span>
          </div>
          {onNavigateToRekapPerubahan && (
            <button
              onClick={onNavigateToRekapPerubahan}
              className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 text-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Buka Rekapan Perubahan</span>
            </button>
          )}
        </div>
      )}

      {/* Comparative Master Table */}
      <div className="bg-white rounded-[28px] border border-[#E0DACE] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F2EDE4] text-[#2C2A28] text-[10px] font-bold uppercase tracking-wider border-b border-[#E0DACE]">
                <th className="py-3 px-3 w-8 text-center font-serif">No</th>
                <th className="py-3 px-3 w-24 font-serif">Kode Rekening</th>
                <th className="py-3 px-4 font-serif">Uraian Belanja & Program</th>
                <th className="py-3 px-3 text-center w-28 font-serif">Status</th>
                <th className="py-3 px-3 text-right w-28 font-serif bg-[#FAF8F4]">Semula (Murni)</th>
                <th className="py-3 px-3 text-right w-28 font-serif bg-[#EFF5ED]">Menjadi (Perub)</th>
                <th className="py-3 px-3 text-right w-28 font-serif">Selisih (+/-)</th>
                <th className="py-3 px-3 text-center w-32 font-serif">Status SPJ</th>
                <th className="py-3 px-3 text-center w-44 font-serif">Pilihan Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0DACE]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#8C867E]">
                    Tidak ada rincian belanja yang sesuai dengan kriteria filter pada bulan ini.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const spjDoc = getItemSpjDoc(item);
                  const isDihilangkan = item.statusPerubahan === 'DIHILANGKAN';
                  const isBaru = item.statusPerubahan === 'BARU';

                  return (
                    <tr
                      key={item.id}
                      className={`transition ${
                        isDihilangkan
                          ? 'bg-rose-50/60 hover:bg-rose-50'
                          : isBaru
                          ? 'bg-emerald-50/40 hover:bg-emerald-50/70'
                          : 'hover:bg-[#F9F7F2]'
                      }`}
                    >
                      {/* No */}
                      <td className="py-3 px-3 text-center font-bold text-[#8C867E]">
                        {idx + 1}
                      </td>

                      {/* Kode Rek */}
                      <td className="py-3 px-3 font-mono text-[11px] text-[#5C5852]">
                        <div>{item.kodeRekening}</div>
                        <div className="text-[10px] text-[#8C867E]">{item.kodeProgram}</div>
                      </td>

                      {/* Uraian */}
                      <td className="py-3 px-4 max-w-sm">
                        <div
                          className={`font-semibold text-[#2C2A28] ${
                            isDihilangkan ? 'line-through text-[#8C867E]' : ''
                          }`}
                        >
                          {item.uraian}
                        </div>
                        <div className="text-[10px] text-[#6B665E] mt-0.5">
                          Standar {item.temaId} &bull; {item.subtemaNama}
                        </div>
                        {item.alasanPerubahan && (
                          <div className="text-[10px] italic text-[#8B4513] bg-[#FAF6EE] px-2 py-0.5 rounded mt-1 inline-block border border-[#E0DACE]">
                            Alasan: {item.alasanPerubahan}
                          </div>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3 text-center">
                        {item.statusPerubahan === 'BARU' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>BARU</span>
                          </span>
                        )}
                        {item.statusPerubahan === 'DIHILANGKAN' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                            <Ban className="w-2.5 h-2.5" />
                            <span>DIHILANGKAN</span>
                          </span>
                        )}
                        {item.statusPerubahan === 'BERTAMBAH' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                            <TrendingUp className="w-2.5 h-2.5" />
                            <span>BERTAMBAH</span>
                          </span>
                        )}
                        {item.statusPerubahan === 'BERKURANG' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                            <TrendingDown className="w-2.5 h-2.5" />
                            <span>BERKURANG</span>
                          </span>
                        )}
                        {item.statusPerubahan === 'TETAP' && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                            TETAP
                          </span>
                        )}
                      </td>

                      {/* Semula */}
                      <td className="py-3 px-3 text-right font-mono bg-[#FAF8F4] text-[#5C5852]">
                        <div className="font-bold">{formatRp(item.semulaJumlah)}</div>
                        <div className="text-[10px] text-[#8C867E]">
                          {item.semulaVolume} {item.semulaSatuan} @ {formatRp(item.semulaTarif)}
                        </div>
                      </td>

                      {/* Menjadi */}
                      <td className="py-3 px-3 text-right font-mono bg-[#EFF5ED]">
                        <div
                          className={`font-bold ${
                            isDihilangkan ? 'text-rose-700' : 'text-[#2C2A28]'
                          }`}
                        >
                          {formatRp(item.jumlah)}
                        </div>
                        <div className="text-[10px] text-[#6B665E]">
                          {item.volume} {item.satuan} @ {formatRp(item.tarifHarga)}
                        </div>
                      </td>

                      {/* Selisih */}
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        <span
                          className={`${
                            item.selisihJumlah > 0
                              ? 'text-emerald-700'
                              : item.selisihJumlah < 0
                              ? 'text-rose-700'
                              : 'text-[#8C867E]'
                          }`}
                        >
                          {item.selisihJumlah > 0 ? '+' : ''}
                          {formatRp(item.selisihJumlah)}
                        </span>
                      </td>

                      {/* Status SPJ Resmi */}
                      <td className="py-3 px-3 text-center">
                        {spjDoc ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>✓ SPJ Terbit</span>
                            </span>
                            {onOpenSpjDoc && (
                              <button
                                type="button"
                                onClick={() => onOpenSpjDoc(spjDoc)}
                                className="text-[10px] text-[#5A5A40] hover:underline font-mono mt-0.5 inline-flex items-center gap-0.5 cursor-pointer"
                                title="Buka Dokumen SPJ"
                              >
                                <span>{spjDoc.nomor.slice(0, 14)}...</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        ) : isDihilangkan ? (
                          <span className="text-[10px] text-[#8C867E] italic">Dibatalkan</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onCreateSpjFromPerubahanItem(item, selectedMonth)}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-[#F9F7F2] hover:bg-[#5A5A40] hover:text-white text-[#5A5A40] border border-[#D9D1C2] transition cursor-pointer"
                            title="Buat dokumen Kwitansi / Daftar Honor untuk rincian ini"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>+ Buat SPJ</span>
                          </button>
                        )}
                      </td>

                      {/* Action buttons: Hilangkan, Simpan, Edit, Pindahkan ke bulan lain */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* 1. Hilangkan / Pulihkan */}
                          {!isDihilangkan ? (
                            <button
                              type="button"
                              onClick={() => handleOpenCancelModal(item)}
                              className="p-1.5 text-rose-600 hover:bg-rose-100 hover:text-rose-800 rounded-lg transition cursor-pointer"
                              title="Hilangkan belanja ini pada ARKAS Perubahan (Rp 0)"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRestoreItem(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                              title="Pulihkan belanja ini kembali ke pagu semula"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* 2. Simpan */}
                          <button
                            type="button"
                            onClick={() => handleSaveItemClick(item)}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              item.isSaved
                                ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300'
                                : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-800'
                            }`}
                            title={
                              item.isSaved
                                ? `Tersimpan & diverifikasi ${item.savedAt ? '(' + formatTanggalIndo(item.savedAt.slice(0, 10)) + ')' : ''} - Klik untuk simpan ulang`
                                : 'Simpan / verifikasi rincian belanja ini'
                            }
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>

                          {/* 3. Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-[#5A5A40] hover:bg-[#E8E2D6] rounded-lg transition cursor-pointer"
                            title="Edit rincian volume / tarif / alasan"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* 4. Pindahkan ke bulan lain */}
                          <button
                            type="button"
                            onClick={() => handleOpenMoveModal(item)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg transition cursor-pointer"
                            title="Pindahkan rincian belanja ini ke bulan lain"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </button>

                          {/* 5. Hapus Total */}
                          <button
                            type="button"
                            onClick={() => handleOpenHapusTotal(item)}
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
            <tfoot>
              <tr className="bg-[#F2EDE4] font-bold text-[#2C2A28] border-t-2 border-[#E0DACE]">
                <td colSpan={4} className="py-3 px-4 text-right font-serif">
                  TOTAL REALOKASI BULAN {MONTH_NAMES[selectedMonth].toUpperCase()} :
                </td>
                <td className="py-3 px-3 text-right font-mono bg-[#FAF8F4]">
                  {formatRp(totalSemulaBulan)}
                </td>
                <td className="py-3 px-3 text-right font-mono bg-[#EFF5ED]">
                  {formatRp(totalMenjadiBulan)}
                </td>
                <td
                  className={`py-3 px-3 text-right font-mono ${
                    selisihBulan > 0
                      ? 'text-emerald-700'
                      : selisihBulan < 0
                      ? 'text-rose-700'
                      : 'text-[#2C2A28]'
                  }`}
                >
                  {selisihBulan > 0 ? '+' : ''}
                  {formatRp(selisihBulan)}
                </td>
                <td colSpan={2}></td>
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
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
                <h3 className="text-base font-serif font-bold text-[#2C2A28]">
                  {isAddingNew
                    ? 'Tambah Rincian Belanja Baru (ARKAS Perubahan)'
                    : 'Ubah / Sesuaikan Rincian di ARKAS Perubahan'}
                </h3>
              </div>
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
              {/* Standar / Tema */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2C2A28] mb-1">Tema (Standar)</label>
                  <select
                    value={formTemaId}
                    onChange={(e) => {
                      setFormTemaId(e.target.value);
                      const matchSub = SUBTEMA_PROGRAM_LIST.find((s) => s.temaKode === e.target.value);
                      if (matchSub) setFormSubtemaKode(matchSub.kode);
                    }}
                    className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-medium text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                  >
                    {TEMA_STANDAR_LIST.map((t) => (
                      <option key={t.kode} value={t.kode}>
                        {t.kode}. {t.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#2C2A28] mb-1">Subtema (Program)</label>
                  <select
                    value={formSubtemaKode}
                    onChange={(e) => setFormSubtemaKode(e.target.value)}
                    className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-medium text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                  >
                    {SUBTEMA_PROGRAM_LIST.filter((s) => s.temaKode === formTemaId).map((s) => (
                      <option key={s.kode} value={s.kode}>
                        {s.kode}. {s.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Kode Rekening & Program */}
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
                  <label className="block font-semibold text-[#2C2A28] mb-1">Kode Program</label>
                  <input
                    type="text"
                    value={formKodeProgram}
                    onChange={(e) => setFormKodeProgram(e.target.value)}
                    className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    placeholder="mis. 06.05.08"
                  />
                </div>
              </div>

              {/* Uraian */}
              <div>
                <label className="block font-semibold text-[#2C2A28] mb-1">
                  Uraian Belanja / Kegiatan
                </label>
                <textarea
                  rows={2}
                  value={formUraian}
                  onChange={(e) => setFormUraian(e.target.value)}
                  className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-medium text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                  placeholder="Deskripsikan belanja atau kebutuhan kegiatan..."
                ></textarea>
              </div>

              {/* Komparasi Semula vs Menjadi */}
              <div className="p-3 bg-[#F9F7F2] rounded-2xl border border-[#E0DACE] space-y-2">
                <div className="text-[11px] font-bold text-[#5C5852] uppercase tracking-wider flex items-center justify-between">
                  <span>DATA MENJADI (ANGGARAN PERUBAHAN)</span>
                  {editingItem && (
                    <span className="text-[10px] text-[#8C867E]">
                      Semula: {semulaVol} {semulaSat} ({formatRp(semulaJum)})
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1">Volume</label>
                    <input
                      type="number"
                      min="0"
                      value={formVolume}
                      onChange={(e) => setFormVolume(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full p-2.5 bg-white border border-[#E0DACE] rounded-xl font-mono font-bold text-[#2C2A28] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1">Satuan</label>
                    <input
                      type="text"
                      value={formSatuan}
                      onChange={(e) => setFormSatuan(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#E0DACE] rounded-xl text-[#2C2A28] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
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
                      className="w-full p-2.5 bg-white border border-[#E0DACE] rounded-xl font-mono font-bold text-[#2C2A28] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    />
                  </div>
                </div>

                {/* Total & Selisih Preview */}
                <div className="flex items-center justify-between pt-1 font-mono text-xs">
                  <span className="text-[#6B665E] font-sans font-semibold">Total Nilai Baru:</span>
                  <span className="font-bold text-[#059669]">
                    {formatRp(formVolume * formTarif)}
                  </span>
                </div>
                {editingItem && (
                  <div className="flex items-center justify-between text-xs font-mono pt-0.5 border-t border-[#E0DACE]/60">
                    <span className="text-[#6B665E] font-sans">Selisih (+/-):</span>
                    <span
                      className={`font-bold ${
                        formVolume * formTarif - semulaJum >= 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {formVolume * formTarif - semulaJum >= 0 ? '+' : ''}
                      {formatRp(formVolume * formTarif - semulaJum)}
                    </span>
                  </div>
                )}
              </div>

              {/* Alasan Perubahan */}
              <div>
                <label className="block font-semibold text-[#2C2A28] mb-1">
                  Alasan / Dasar Perubahan Anggaran
                </label>
                <input
                  type="text"
                  value={formAlasan}
                  onChange={(e) => setFormAlasan(e.target.value)}
                  className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                  placeholder="mis. Penambahan baru untuk fasilitas ujian CBT / Rasionalisasi anggaran"
                />
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
                  Simpan ke ARKAS Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Penghilangan Belanja (Hilangkan / Batalkan) */}
      {cancelingItem && (
        <div className="fixed inset-0 z-50 bg-[#2C2A28]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 max-w-md w-full shadow-xl border border-[#E0DACE] space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <Ban className="w-5 h-5" />
              <h3 className="text-base font-serif font-bold text-[#2C2A28]">
                Penghilangan Belanja di Perubahan
              </h3>
            </div>

            <p className="text-xs text-[#5C5852] leading-relaxed">
              Rincian belanja berikut akan diubah menjadi <b>Rp 0 (ditiadakan / dihilangkan)</b> pada
              ARKAS Perubahan, namun tetap terekam komparasinya terhadap ARKAS Murni:
            </p>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-[#2C2A28]">{cancelingItem.uraian}</div>
              <div className="text-rose-800 font-mono text-[11px]">
                Semula: {cancelingItem.semulaVolume} {cancelingItem.semulaSatuan} &bull;{' '}
                <b>{formatRp(cancelingItem.semulaJumlah)}</b>
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
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelingItem(null)}
                className="px-4 py-2 text-[#6B665E] hover:bg-[#F2EDE4] rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition active:scale-95"
              >
                Hilangkan Belanja
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pindahkan Belanja ke Bulan Lain */}
      {movingItem && (
        <div className="fixed inset-0 z-50 bg-[#2C2A28]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 max-w-md w-full shadow-xl border border-[#E0DACE] space-y-4">
            <div className="flex items-center gap-2 text-indigo-700">
              <ArrowRightLeft className="w-5 h-5" />
              <h3 className="text-base font-serif font-bold text-[#2C2A28]">
                Pindahkan Belanja ke Bulan Lain
              </h3>
            </div>

            <p className="text-xs text-[#5C5852] leading-relaxed">
              Memindahkan rincian belanja dari bulan <b>{MONTH_NAMES[selectedMonth]}</b> ke bulan pelaksanaan lain. Di bulan asal belanja akan dialihkan/ditiadakan, dan di bulan tujuan akan ditambahkan secara terstruktur.
            </p>

            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-[#2C2A28]">{movingItem.uraian}</div>
              <div className="text-indigo-900 font-mono text-[11px] flex justify-between">
                <span>Alokasi: {movingItem.volume || movingItem.semulaVolume} {movingItem.satuan || movingItem.semulaSatuan}</span>
                <span className="font-bold">{formatRp(movingItem.jumlah || movingItem.semulaJumlah)}</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#2C2A28] text-xs mb-1">
                Pilih Bulan Tujuan Pemindahan:
              </label>
              <select
                value={targetMoveMonth}
                onChange={(e) => setTargetMoveMonth(parseInt(e.target.value, 10))}
                className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs font-semibold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {MONTH_NAMES.map((mName, mIdx) => (
                  <option key={mIdx} value={mIdx} disabled={mIdx === selectedMonth}>
                    {mName} {mIdx === selectedMonth ? '(Bulan Saat Ini - Asal)' : ''}
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
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMovingItem(null)}
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

      {/* Modal Hapus Total */}
      {hapusTotalItem && (
        <div className="fixed inset-0 z-50 bg-[#2C2A28]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 max-w-md w-full shadow-xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-base font-serif font-bold text-rose-900">
                Hapus Total Rincian Belanja
              </h3>
            </div>

            <p className="text-xs text-[#5C5852] leading-relaxed">
              PERHATIAN: Apakah Anda yakin ingin <b>MENGHAPUS TOTAL</b> rincian belanja berikut secara permanen? Tindakan ini akan menghapus data sepenuhnya dari lembar kerja ARKAS Perubahan.
            </p>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-[#2C2A28]">{hapusTotalItem.uraian}</div>
              <div className="text-rose-800 font-mono text-[11px]">
                Kode: {hapusTotalItem.kodeRekening} &bull; Nilai: {formatRp(hapusTotalItem.jumlah || hapusTotalItem.semulaJumlah)}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setHapusTotalItem(null)}
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

      {/* Floating Save Toast */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#065f46] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-emerald-400/30 animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{savedToast}</span>
        </div>
      )}
    </div>
  );
};
