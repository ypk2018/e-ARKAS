import React, { useState } from 'react';
import {
  Plus,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  Edit2,
  Save,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileCheck2,
  Search,
  Filter
} from 'lucide-react';
import {
  ArkasPerubahanMonthWorksheet,
  ArkasPerubahanItem,
  SchoolProfile,
  UserAccount,
  MonthWorksheet,
  BosRegulerItemTemplate
} from '../types';
import { formatRp, formatTanggalIndo, generateUid, terbilang } from '../utils/formatters';
import { MONTH_NAMES } from '../data/schoolProfile';
import { TEMA_STANDAR_LIST, SUBTEMA_PROGRAM_LIST, BOS_REGULER_ITEM_TEMPLATES } from '../data/standarData';
import { printManualPerubahanForm } from '../utils/printDocument';

interface ManualPerubahanViewProps {
  school: SchoolProfile;
  worksheets: ArkasPerubahanMonthWorksheet[];
  murniWorksheets: MonthWorksheet[];
  onUpdateWorksheet: (ws: ArkasPerubahanMonthWorksheet) => void;
  onNavigateToPerubahan: (monthIndex?: number) => void;
  currentUser?: UserAccount;
}

export const ManualPerubahanView: React.FC<ManualPerubahanViewProps> = ({
  school,
  worksheets,
  murniWorksheets: _murniWorksheets,
  onUpdateWorksheet,
  onNavigateToPerubahan,
  currentUser: _currentUser
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMonth, setFilterMonth] = useState<number | 'all'>('all');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form states
  const [formTemaId, setFormTemaId] = useState<string>('06');
  const [formSubtemaKode, setFormSubtemaKode] = useState<string>('06.05');
  const [formKodeProgram, setFormKodeProgram] = useState<string>('06.05.08');
  const [formKodeRekening, setFormKodeRekening] = useState<string>('5.1.02.01.01.0024');
  const [formUraian, setFormUraian] = useState<string>('');
  const [formVolume, setFormVolume] = useState<number>(1);
  const [formSatuan, setFormSatuan] = useState<string>('paket');
  const [formTarif, setFormTarif] = useState<number>(1500000);
  const [formAlasan, setFormAlasan] = useState<string>('');
  const [formMonth, setFormMonth] = useState<number>(0);

  // Auto-calculated total
  const formTotal = (formVolume || 0) * (formTarif || 0);

  // Quick Preset templates for quick manual entry
  const QUICK_PRESETS: Partial<ArkasPerubahanItem>[] = [
    {
      uraian: 'Pengadaan Tablet Digital Siswa Pendukung Asesmen Nasional CBT',
      kodeRekening: '5.2.02.10.01.0002',
      kodeProgram: '08.04.08',
      temaId: '08',
      subtemaKode: '08.04',
      satuan: 'unit',
      volume: 4,
      tarifHarga: 3500000,
      alasanPerubahan: 'Kebutuhan mendesak digitalisasi asesmen sekolah berbasis CBT dan ANBK 2026'
    },
    {
      uraian: 'Pengadaan Obat-obatan P3K, Termometer Digital & Fasilitas Ruang UKS',
      kodeRekening: '5.1.02.01.01.0031',
      kodeProgram: '05.08.08',
      temaId: '05',
      subtemaKode: '05.08',
      satuan: 'paket',
      volume: 1,
      tarifHarga: 1850000,
      alasanPerubahan: 'Penyediaan sarana kesehatan pertolongan pertama pada siswa di sekolah'
    },
    {
      uraian: 'Pengadaan Tenda Dome & Perlengkapan Kemah Pramuka Siswa',
      kodeRekening: '5.1.02.01.01.0034',
      kodeProgram: '03.03.06',
      temaId: '03',
      subtemaKode: '03.03',
      satuan: 'set',
      volume: 3,
      tarifHarga: 2100000,
      alasanPerubahan: 'Fasilitasi kegiatan ekstrakurikuler wajib kepramukaan siswa'
    },
    {
      uraian: 'Pengadaan Buku Bacaan Pengayaan Literasi dan Pojok Baca Siswa',
      kodeRekening: '5.2.05.01.01.0001',
      kodeProgram: '05.08.03',
      temaId: '05',
      subtemaKode: '05.08',
      satuan: 'eksemplar',
      volume: 80,
      tarifHarga: 75000,
      alasanPerubahan: 'Peningkatan indeks literasi sekolah pada Rapor Pendidikan 2026'
    },
    {
      uraian: 'Perbaikan Instalasi Listrik dan Penggantian MCB Lab Komputer',
      kodeRekening: '5.1.02.03.04.0076',
      kodeProgram: '05.08.10',
      temaId: '05',
      subtemaKode: '05.08',
      satuan: 'paket',
      volume: 1,
      tarifHarga: 2800000,
      alasanPerubahan: 'Pencegahan korsleting dan stabilisasi pasokan daya listrik laboratorium komputer'
    },
    {
      uraian: 'Penyusunan & Penjilidan Laporan Pertanggungjawaban SPJ BOSP Akhir Tahun',
      kodeRekening: '5.1.02.01.01.0024',
      kodeProgram: '06.05.08',
      temaId: '06',
      subtemaKode: '06.05',
      satuan: 'buku',
      volume: 8,
      tarifHarga: 150000,
      alasanPerubahan: 'Penyusunan berkas LPJ BOSP tahunan untuk Dinas Pendidikan dan Inspektorat'
    }
  ];

  const handleApplyPreset = (preset: Partial<ArkasPerubahanItem>) => {
    if (preset.uraian) setFormUraian(preset.uraian);
    if (preset.kodeRekening) setFormKodeRekening(preset.kodeRekening);
    if (preset.kodeProgram) setFormKodeProgram(preset.kodeProgram);
    if (preset.temaId) setFormTemaId(preset.temaId);
    if (preset.subtemaKode) setFormSubtemaKode(preset.subtemaKode);
    if (preset.satuan) setFormSatuan(preset.satuan);
    if (preset.volume) setFormVolume(preset.volume);
    if (preset.tarifHarga) setFormTarif(preset.tarifHarga);
    if (preset.alasanPerubahan) setFormAlasan(preset.alasanPerubahan);
    setIsFormOpen(true);
  };

  const handleApplyBosTemplate = (tmpl: BosRegulerItemTemplate) => {
    setFormUraian(tmpl.uraian);
    setFormKodeRekening(tmpl.kodeRekening);
    setFormKodeProgram(tmpl.kodeProgram);
    setFormTemaId(tmpl.temaKode);
    setFormSubtemaKode(tmpl.subtemaKode);
    setFormSatuan(tmpl.satuan);
    setFormTarif(tmpl.tarifHarga);
    setFormAlasan(`Penambahan alokasi belanja ${tmpl.uraian} sesuai kebutuhan riil satuan pendidikan`);
    setIsFormOpen(true);
  };

  // Collect all manual/new items across all 12 months
  const allManualItems: { item: ArkasPerubahanItem; monthIndex: number; monthName: string }[] = [];
  worksheets.forEach((ws, mIdx) => {
    ws.items.forEach((it) => {
      // Items marked as BARU or items with volume changed manually
      if (it.statusPerubahan === 'BARU' || it.semulaJumlah === 0) {
        allManualItems.push({
          item: it,
          monthIndex: mIdx,
          monthName: MONTH_NAMES[mIdx]
        });
      }
    });
  });

  // Filtered manual items
  const filteredManualItems = allManualItems.filter(({ item, monthIndex, monthName }) => {
    const matchMonth = filterMonth === 'all' || monthIndex === filterMonth;
    const matchQuery =
      searchQuery.trim() === '' ||
      item.uraian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kodeRekening.toLowerCase().includes(searchQuery.toLowerCase()) ||
      monthName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.alasanPerubahan && item.alasanPerubahan.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchMonth && matchQuery;
  });

  const totalManualBudget = allManualItems.reduce((acc, { item }) => acc + item.jumlah, 0);

  // Submit manual item
  const handleSaveManualItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formUraian.trim()) {
      alert('Mohon masukkan uraian belanja / pengadaan.');
      return;
    }
    if (formVolume <= 0 || formTarif <= 0) {
      alert('Volume dan tarif harga satuan harus lebih besar dari 0.');
      return;
    }

    const targetWs = worksheets[formMonth];
    if (!targetWs) return;

    const temaObj = TEMA_STANDAR_LIST.find((t) => t.kode === formTemaId);
    const subtemaObj = SUBTEMA_PROGRAM_LIST.find((s) => s.kode === formSubtemaKode);

    if (editingItemId) {
      // Update existing item
      const updatedItems = targetWs.items.map((it) => {
        if (it.id === editingItemId) {
          const totalJml = formVolume * formTarif;
          return {
            ...it,
            kodeRekening: formKodeRekening,
            kodeProgram: formKodeProgram,
            uraian: formUraian,
            volume: formVolume,
            satuan: formSatuan,
            tarifHarga: formTarif,
            jumlah: totalJml,
            selisihJumlah: totalJml - it.semulaJumlah,
            selisihVolume: formVolume - it.semulaVolume,
            statusPerubahan: 'BARU' as const,
            alasanPerubahan: formAlasan || 'Penambahan belanja manual sesuai kebutuhan satuan pendidikan',
            temaId: formTemaId,
            temaNama: temaObj ? temaObj.nama : it.temaNama,
            subtemaKode: formSubtemaKode,
            subtemaNama: subtemaObj ? subtemaObj.nama : it.subtemaNama
          };
        }
        return it;
      });

      onUpdateWorksheet({
        ...targetWs,
        items: updatedItems,
        totalPerubahan: updatedItems.reduce((acc, it) => acc + (it.statusPerubahan !== 'DIHILANGKAN' ? it.jumlah : 0), 0)
      });
      setSaveSuccessMsg(`Item "${formUraian}" berhasil diperbarui.`);
    } else {
      // Create new manual item
      const newItem: ArkasPerubahanItem = {
        id: `perub_manual_${generateUid()}`,
        noUrut: targetWs.items.length + 1,
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
        jumlah: formTotal,
        selisihJumlah: formTotal,
        selisihVolume: formVolume,
        statusPerubahan: 'BARU',
        alasanPerubahan: formAlasan || 'Penambahan kegiatan baru secara manual sesuai kebutuhan riil satuan pendidikan',
        temaId: formTemaId,
        temaNama: temaObj ? temaObj.nama : 'Standar Pengelolaan',
        subtemaKode: formSubtemaKode,
        subtemaNama: subtemaObj ? subtemaObj.nama : 'Pelaksanaan Administrasi Sekolah',
        kegiatanKode: formKodeProgram,
        kegiatanNama: formUraian
      };

      const updatedItems = [...targetWs.items, newItem];
      onUpdateWorksheet({
        ...targetWs,
        items: updatedItems,
        totalPerubahan: updatedItems.reduce((acc, it) => acc + (it.statusPerubahan !== 'DIHILANGKAN' ? it.jumlah : 0), 0)
      });
      setSaveSuccessMsg(`Item baru "${formUraian}" berhasil ditambahkan ke ARKAS Perubahan ${MONTH_NAMES[formMonth]}.`);
    }

    // Reset and close
    setEditingItemId(null);
    setIsFormOpen(false);
    setFormUraian('');
    setFormAlasan('');
    setFormVolume(1);
    setFormTarif(1000000);

    setTimeout(() => {
      setSaveSuccessMsg(null);
    }, 4000);
  };

  const handleEditItem = (item: ArkasPerubahanItem, monthIdx: number) => {
    setEditingItemId(item.id);
    setFormMonth(monthIdx);
    setFormTemaId(item.temaId || '06');
    setFormSubtemaKode(item.subtemaKode || '06.05');
    setFormKodeProgram(item.kodeProgram || '06.05.08');
    setFormKodeRekening(item.kodeRekening);
    setFormUraian(item.uraian);
    setFormVolume(item.volume);
    setFormSatuan(item.satuan);
    setFormTarif(item.tarifHarga);
    setFormAlasan(item.alasanPerubahan || '');
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteItem = (item: ArkasPerubahanItem, monthIdx: number) => {
    if (!window.confirm(`Hapus kegiatan baru "${item.uraian}" dari ARKAS Perubahan bulan ${MONTH_NAMES[monthIdx]}?`)) {
      return;
    }
    const targetWs = worksheets[monthIdx];
    if (!targetWs) return;

    const updatedItems = targetWs.items.filter((it) => it.id !== item.id);
    onUpdateWorksheet({
      ...targetWs,
      items: updatedItems,
      totalPerubahan: updatedItems.reduce((acc, it) => acc + (it.statusPerubahan !== 'DIHILANGKAN' ? it.jumlah : 0), 0)
    });
    setSaveSuccessMsg(`Item "${item.uraian}" telah dihapus.`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Print all manual items as an official summary table
  const handlePrintAllManual = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>DAFTAR_USULAN_BELANJA_MANUAL_PERUBAHAN_${school.tahunAnggaran}</title>
          <style>
            @page { size: A4 landscape; margin: 12mm; }
            body { font-family: Arial, sans-serif; font-size: 8.5pt; color: #111; margin: 0; line-height: 1.3; }
            .header { border-bottom: 2pt solid #000; padding-bottom: 6pt; margin-bottom: 12pt; text-align: center; }
            .instansi { font-size: 11pt; font-weight: bold; }
            .sekolah { font-size: 14pt; font-weight: bold; }
            .alamat { font-size: 8.5pt; color: #333; }
            .title { text-align: center; font-size: 12pt; font-weight: bold; margin-bottom: 10pt; text-decoration: underline; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 14pt; font-size: 8pt; }
            th, td { border: 0.5pt solid #333; padding: 4pt; }
            th { background: #f0f0f0; text-align: center; font-weight: bold; }
            .sig-grid { display: flex; justify-content: space-between; margin-top: 20pt; }
            .sig-box { width: 220pt; text-align: center; font-size: 9pt; }
            .sig-space { height: 40pt; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="instansi">PEMERINTAH KABUPATEN JAYAPURA - DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
            <div class="sekolah">${school.nama.toUpperCase()}</div>
            <div class="alamat">${school.alamat} • NPSN: ${school.npsn}</div>
          </div>
          <div class="title">REKAPITULASI PENAMBAHAN BELANJA MANUAL ARKAS PERUBAHAN TAHUN ${school.tahunAnggaran}</div>
          <div style="font-size: 9pt; margin-bottom: 8pt;">
            Daftar kegiatan belanja baru yang diisi secara manual sesuai kebutuhan riil satuan pendidikan:
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 25pt;">No</th>
                <th style="width: 65pt;">Bulan</th>
                <th style="width: 90pt;">Kode Rekening</th>
                <th>Uraian Kegiatan Belanja Baru</th>
                <th style="width: 60pt;">Volume</th>
                <th style="width: 75pt;">Tarif (Rp)</th>
                <th style="width: 85pt;">Total (Rp)</th>
                <th>Alasan / Justifikasi Perubahan</th>
              </tr>
            </thead>
            <tbody>
              ${allManualItems.map(({ item, monthName }, idx) => `
                <tr>
                  <td style="text-align: center;">${idx + 1}</td>
                  <td style="text-align: center; font-weight: bold;">${monthName}</td>
                  <td style="font-family: monospace;">${item.kodeRekening}</td>
                  <td style="font-weight: bold;">${item.uraian}</td>
                  <td style="text-align: center;">${item.volume.toLocaleString('id-ID')} ${item.satuan}</td>
                  <td style="text-align: right;">${formatRp(item.tarifHarga)}</td>
                  <td style="text-align: right; font-weight: bold; color: #047857;">${formatRp(item.jumlah)}</td>
                  <td style="font-size: 7.5pt;">${item.alasanPerubahan || '-'}</td>
                </tr>
              `).join('')}
              <tr style="background: #fafafa; font-weight: bold;">
                <td colspan="6" style="text-align: center;">TOTAL USULAN BELANJA MANUAL BARU</td>
                <td style="text-align: right; color: #047857;">${formatRp(totalManualBudget)}</td>
                <td>${allManualItems.length} Kegiatan Baru</td>
              </tr>
            </tbody>
          </table>
          <div class="sig-grid">
            <div class="sig-box">
              <div>Mengetahui,</div>
              <div style="font-weight: bold;">Kepala Sekolah</div>
              <div class="sig-space"></div>
              <div style="font-weight: bold; text-decoration: underline;">${school.kepsekNama}</div>
              <div>NIP. ${school.kepsekNip}</div>
            </div>
            <div class="sig-box">
              <div>Sentani, ${formatTanggalIndo(new Date().toISOString().split('T')[0])}</div>
              <div style="font-weight: bold;">Bendahara BOSP</div>
              <div class="sig-space"></div>
              <div style="font-weight: bold; text-decoration: underline;">${school.bendaharaNama}</div>
              <div>NIP. ${school.bendaharaNip}</div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 300);
    };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast notification */}
      {saveSuccessMsg && (
        <div className="p-3.5 bg-[#059669] text-white rounded-xl shadow-md flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-semibold">{saveSuccessMsg}</span>
        </div>
      )}

      {/* Top Banner / Header */}
      <div className="bg-[#FAF8F5] border border-[#E0DACE] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Submenu ARKAS Perubahan • Tambah Manual
            </div>
            <h1 className="text-xl font-serif font-bold text-[#2C2A28]">
              Tambah Kegiatan & Belanja Baru (Isi Manual)
            </h1>
            <p className="text-xs text-[#6E6A63] mt-1 max-w-3xl">
              Fasilitas pengisian manual kegiatan atau belanja baru di ARKAS Perubahan sesuai kebutuhan riil satuan pendidikan.
              Semua item yang ditambahkan akan otomatis diintegrasikan ke Lembar Kerja 13 Kolom dan Matriks Rekapitulasi Perubahan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* CETAK / SIMPAN PDF BUTTON */}
            <button
              id="btn-print-manual-rekap"
              onClick={handlePrintAllManual}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FAF8F5] hover:bg-[#E8E2D6] text-[#2C2A28] border border-[#D9D1C2] transition-colors shadow-2xs cursor-pointer"
              title="Cetak atau Simpan PDF seluruh usulan belanja manual"
            >
              <Printer className="w-4 h-4 text-[#5A5A40]" />
              <span>Cetak / Simpan PDF</span>
            </button>

            {/* Buka Lembar 13 Kolom */}
            <button
              id="btn-nav-to-13-kolom"
              onClick={() => onNavigateToPerubahan(selectedMonth)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FAF8F5] hover:bg-[#E8E2D6] text-[#2C2A28] border border-[#D9D1C2] transition-colors shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#059669]" />
              <span>Lihat Lembar 13 Kolom</span>
            </button>

            {/* Tombol Buka Form Tambah */}
            <button
              id="btn-open-form-manual"
              onClick={() => {
                setEditingItemId(null);
                setIsFormOpen(!isFormOpen);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#059669] hover:bg-[#047857] text-white shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isFormOpen ? 'Tutup Formulir' : '+ Tambah Belanja Baru'}</span>
            </button>
          </div>
        </div>

        {/* Stats summary bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-[#E0DACE]">
          <div className="bg-white/80 p-3.5 rounded-xl border border-[#E8E2D6]">
            <div className="text-[11px] text-[#8C867E] uppercase tracking-wider font-semibold">
              Total Kegiatan Manual Baru
            </div>
            <div className="text-xl font-bold font-serif text-[#2C2A28] mt-0.5">
              {allManualItems.length} Kegiatan
            </div>
            <div className="text-[10px] text-[#047857] mt-0.5">Status: BARU di ARKAS Perubahan</div>
          </div>

          <div className="bg-[#ecfdf5] p-3.5 rounded-xl border border-[#a7f3d0]">
            <div className="text-[11px] text-[#065f46] uppercase tracking-wider font-semibold">
              Total Nilai Anggaran Manual
            </div>
            <div className="text-xl font-bold font-serif text-[#047857] mt-0.5">
              {formatRp(totalManualBudget)}
            </div>
            <div className="text-[10px] text-[#065f46] mt-0.5">Dialokasikan ke 12 Bulan</div>
          </div>

          <div className="bg-white/80 p-3.5 rounded-xl border border-[#E8E2D6]">
            <div className="text-[11px] text-[#8C867E] uppercase tracking-wider font-semibold">
              Penyimpanan & Sinkronisasi
            </div>
            <div className="text-sm font-bold text-[#2C2A28] flex items-center gap-2 mt-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse"></span>
              Aktif (Lokal & Server)
            </div>
            <div className="text-[10px] text-[#6E6A63] mt-0.5">Tersimpan permanen kapan saja</div>
          </div>
        </div>
      </div>

      {/* FORM INPUT MANUAL (COLLAPSIBLE / EXPANDABLE) */}
      {isFormOpen && (
        <div className="bg-white border-2 border-[#059669] rounded-2xl p-6 shadow-md animate-fade-in">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E0DACE]">
            <div>
              <h2 className="text-base font-serif font-bold text-[#2C2A28] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#059669]" />
                {editingItemId ? 'Edit Kegiatan Belanja Manual' : 'Formulir Penambahan Kegiatan Baru Secara Manual'}
              </h2>
              <p className="text-xs text-[#6E6A63] mt-0.5">
                Isi rincian belanja di bawah ini sesuai kebutuhan nyata sekolah. Kolom Semula akan otomatis bernilai Rp 0.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-[#8C867E] hover:text-[#2C2A28] px-2.5 py-1 rounded-lg border border-[#D9D1C2] cursor-pointer"
            >
              Tutup
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="mb-5 bg-[#F9F7F2] p-4 rounded-xl border border-[#E8E2D6]">
            <div className="text-xs font-bold text-[#5A5A40] flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-[#059669]" />
              Pilih Cepat Contoh Kebutuhan Mendesak Sekolah:
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1.5 text-[11px] bg-white hover:bg-[#ecfdf5] hover:border-[#059669] text-[#3E3C3A] border border-[#D9D1C2] rounded-lg transition-colors text-left cursor-pointer"
                >
                  + {preset.uraian?.substring(0, 42)}...
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveManualItem} className="space-y-4">
            {/* Row 1: Bulan & Standar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3E3C3A] mb-1">
                  Alokasi Bulan Pelaksanaan <span className="text-red-500">*</span>
                </label>
                <select
                  id="select-form-month"
                  value={formMonth}
                  onChange={(e) => setFormMonth(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D9D1C2] bg-white focus:ring-2 focus:ring-[#059669] focus:outline-hidden font-medium"
                >
                  {MONTH_NAMES.map((m, idx) => (
                    <option key={idx} value={idx}>
                      {m} 2026 (Triwulan {Math.floor(idx / 3) + 1})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E3C3A] mb-1">
                  Tema / 8 Standar Nasional <span className="text-red-500">*</span>
                </label>
                <select
                  id="select-form-tema"
                  value={formTemaId}
                  onChange={(e) => {
                    const newTema = e.target.value;
                    setFormTemaId(newTema);
                    const sub = SUBTEMA_PROGRAM_LIST.find((s) => s.temaKode === newTema);
                    if (sub) {
                      setFormSubtemaKode(sub.kode);
                      if (sub.kegiatanList && sub.kegiatanList.length > 0) {
                        const code = sub.kegiatanList[0].split(' ')[0].replace(/\.$/, '');
                        setFormKodeProgram(code);
                      }
                    }
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D9D1C2] bg-white focus:ring-2 focus:ring-[#059669] focus:outline-hidden"
                >
                  {TEMA_STANDAR_LIST.map((t) => (
                    <option key={t.kode} value={t.kode}>
                      {t.kode} - {t.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E3C3A] mb-1">
                  Subtema / Program BOSP <span className="text-red-500">*</span>
                </label>
                <select
                  id="select-form-subtema"
                  value={formSubtemaKode}
                  onChange={(e) => {
                    const newSub = e.target.value;
                    setFormSubtemaKode(newSub);
                    const sub = SUBTEMA_PROGRAM_LIST.find((s) => s.kode === newSub);
                    if (sub && sub.kegiatanList && sub.kegiatanList.length > 0) {
                      const code = sub.kegiatanList[0].split(' ')[0].replace(/\.$/, '');
                      setFormKodeProgram(code);
                    }
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D9D1C2] bg-white focus:ring-2 focus:ring-[#059669] focus:outline-hidden"
                >
                  {SUBTEMA_PROGRAM_LIST.filter((s) => s.temaKode === formTemaId).map((s) => (
                    <option key={s.kode} value={s.kode}>
                      {s.kode} - {s.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Kode Program & Kode Rekening */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#3E3C3A] mb-1">
                  Kode Kegiatan Program (ARKAS)
                </label>
                <input
                  id="input-form-kode-program"
                  type="text"
                  value={formKodeProgram}
                  onChange={(e) => setFormKodeProgram(e.target.value)}
                  placeholder="Contoh: 08.04.08 atau 05.08.01"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D9D1C2] bg-white focus:ring-2 focus:ring-[#059669] focus:outline-hidden font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E3C3A] mb-1">
                  Kode Rekening Belanja <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-form-kode-rekening"
                  type="text"
                  value={formKodeRekening}
                  onChange={(e) => setFormKodeRekening(e.target.value)}
                  placeholder="Contoh: 5.1.02.01.01.0024 atau 5.2.02.10.01.0002"
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D9D1C2] bg-white focus:ring-2 focus:ring-[#059669] focus:outline-hidden font-mono"
                  required
                />
              </div>
            </div>

            {/* Row 3: Uraian Kegiatan */}
            <div>
              <label className="block text-xs font-bold text-[#3E3C3A] mb-1">
                Uraian Kegiatan / Belanja Baru <span className="text-red-500">*</span>
              </label>
              <input
                id="input-form-uraian"
                type="text"
                value={formUraian}
                onChange={(e) => setFormUraian(e.target.value)}
                placeholder="Tuliskan spesifikasi lengkap kegiatan atau barang yang dibutuhkan..."
                className="w-full text-xs p-2.5 rounded-xl border border-[#D9D1C2] bg-white focus:ring-2 focus:ring-[#059669] focus:outline-hidden font-medium"
                required
              />
            </div>

            {/* Row 4: Volume, Satuan, Tarif, Total */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-[#F2EDE4]/60 p-4 rounded-xl border border-[#E0DACE]">
              <div>
                <label className="block text-xs font-bold text-[#3E3C3A] mb-1">
                  Volume <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-form-volume"
                  type="number"
                  min="1"
                  value={formVolume}
                  onChange={(e) => setFormVolume(Math.max(1, Number(e.target.value)))}
                  className="w-full text-xs p-2 rounded-lg border border-[#D9D1C2] bg-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E3C3A] mb-1">
                  Satuan <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-form-satuan"
                  type="text"
                  value={formSatuan}
                  onChange={(e) => setFormSatuan(e.target.value)}
                  placeholder="unit, rim, set, paket"
                  className="w-full text-xs p-2 rounded-lg border border-[#D9D1C2] bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3E3C3A] mb-1">
                  Tarif Satuan (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  id="input-form-tarif"
                  type="number"
                  min="1"
                  step="500"
                  value={formTarif}
                  onChange={(e) => setFormTarif(Math.max(0, Number(e.target.value)))}
                  className="w-full text-xs p-2 rounded-lg border border-[#D9D1C2] bg-white font-bold text-right"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#047857] mb-1">
                  Total Anggaran Baru (Rp)
                </label>
                <div className="text-sm font-serif font-bold text-[#047857] p-2 bg-white rounded-lg border border-[#a7f3d0] text-right">
                  {formatRp(formTotal)}
                </div>
                <div className="text-[9px] text-[#6E6A63] text-right mt-0.5 capitalize truncate">
                  {terbilang(formTotal)} Rupiah
                </div>
              </div>
            </div>

            {/* Row 5: Alasan Perubahan */}
            <div>
              <label className="block text-xs font-bold text-[#3E3C3A] mb-1">
                Alasan / Justifikasi Urgensi Kebutuhan Perubahan <span className="text-red-500">*</span>
              </label>
              <textarea
                id="textarea-form-alasan"
                value={formAlasan}
                onChange={(e) => setFormAlasan(e.target.value)}
                rows={2}
                placeholder="Jelaskan dasar pertimbangan mendesak penambahan kegiatan ini (contoh: pemenuhan sarana digitalisasi asesmen, arahan dinas, perbaikan darurat, dsb)..."
                className="w-full text-xs p-2.5 rounded-xl border border-[#D9D1C2] bg-white focus:ring-2 focus:ring-[#059669] focus:outline-hidden"
                required
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingItemId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5C5852] hover:bg-[#E8E2D6] border border-[#D9D1C2] cursor-pointer"
              >
                Batal
              </button>

              <button
                id="btn-submit-manual-item"
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#059669] hover:bg-[#047857] text-white shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingItemId ? 'Simpan Perubahan' : 'Simpan Belanja Baru ke ARKAS Perubahan'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E0DACE] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#8C867E]" />
          <span className="text-xs font-bold text-[#3E3C3A]">Filter Bulan:</span>
          <select
            id="select-filter-month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="text-xs p-1.5 rounded-lg border border-[#D9D1C2] bg-[#FAF8F5]"
          >
            <option value="all">Semua Bulan (Januari - Desember)</option>
            {MONTH_NAMES.map((m, idx) => (
              <option key={idx} value={idx}>
                {m} 2026
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8C867E] absolute left-3 top-2.5" />
          <input
            id="input-search-manual"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari uraian, kode rekening, alasan..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[#D9D1C2] bg-[#FAF8F5] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#059669]"
          />
        </div>
      </div>

      {/* TABLE OF MANUALLY ENTERED ITEMS */}
      <div className="bg-white border border-[#E0DACE] rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E0DACE] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#059669]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C2A28]">
              Daftar Usulan Kegiatan Belanja Baru (Diinput Manual) — {filteredManualItems.length} Item
            </h3>
          </div>

          <div className="text-xs font-bold text-[#047857]">
            Total: {formatRp(filteredManualItems.reduce((s, { item }) => s + item.jumlah, 0))}
          </div>
        </div>

        {filteredManualItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#2C2A28]">Belum Ada Kegiatan Belanja Manual yang Ditambahkan</h4>
            <p className="text-xs text-[#8C867E] max-w-md mx-auto mt-1 mb-4">
              Klik tombol "+ Tambah Belanja Baru" di atas untuk menambahkan kegiatan atau belanja baru sesuai kebutuhan nyata sekolah.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#059669] hover:bg-[#047857] text-white shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Belanja Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#F2EDE4] text-[#5C5852] font-semibold border-b border-[#E0DACE]">
                  <th className="py-3 px-3 text-center w-10">No</th>
                  <th className="py-3 px-3 w-28">Bulan</th>
                  <th className="py-3 px-3 w-36">Kode Rekening</th>
                  <th className="py-3 px-3">Uraian Belanja / Pengadaan Baru</th>
                  <th className="py-3 px-3 text-center w-24">Volume</th>
                  <th className="py-3 px-3 text-right w-28">Tarif (Rp)</th>
                  <th className="py-3 px-3 text-right w-32">Total Menjadi (Rp)</th>
                  <th className="py-3 px-3 w-48">Alasan / Justifikasi</th>
                  <th className="py-3 px-3 text-center w-36">Aksi & Cetak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DACE]">
                {filteredManualItems.map(({ item, monthIndex, monthName }, idx) => (
                  <tr key={item.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-3 text-center font-mono text-[#8C867E]">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#2C2A28]">
                        <Calendar className="w-3 h-3 text-[#5A5A40]" />
                        {monthName}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-[#5A5A40]">
                      {item.kodeRekening}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#2C2A28]">{item.uraian}</div>
                      <div className="text-[10px] text-[#8C867E] flex items-center gap-2 mt-0.5">
                        <span>{item.kodeProgram}</span>
                        <span>•</span>
                        <span className="text-[#059669] font-bold">STATUS: {item.statusPerubahan}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="font-medium text-[#2C2A28]">
                        {item.volume.toLocaleString('id-ID')}
                      </span>{' '}
                      <span className="text-[#8C867E] text-[10px]">{item.satuan}</span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-[#5C5852]">
                      {formatRp(item.tarifHarga)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-[#047857]">
                      {formatRp(item.jumlah)}
                    </td>

                    <td className="py-3 px-3 text-[11px] text-[#6E6A63] leading-relaxed">
                      {item.alasanPerubahan || '-'}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* CETAK / SIMPAN PDF LEMBAR USULAN MANUAL */}
                        <button
                          onClick={() => printManualPerubahanForm(school, item, monthName)}
                          className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#E8E2D6] text-[#2C2A28] border border-[#D9D1C2] transition-colors cursor-pointer"
                          title="Cetak / Simpan PDF Lembar Usulan Manual"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#5A5A40]" />
                        </button>

                        {/* Edit Item */}
                        <button
                          onClick={() => handleEditItem(item, monthIndex)}
                          className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#E8E2D6] text-[#5A5A40] border border-[#D9D1C2] transition-colors cursor-pointer"
                          title="Edit usulan belanja ini"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Hapus Item */}
                        <button
                          onClick={() => handleDeleteItem(item, monthIndex)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                          title="Hapus usulan belanja baru ini"
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

      {/* Quick catalog of BOS Reguler standard templates */}
      <div className="bg-[#FAF8F5] border border-[#E0DACE] rounded-2xl p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#059669]" />
          Katalog Referensi Standar Belanja BOS Reguler (Pilih Untuk Input Otomatis)
        </h3>
        <p className="text-xs text-[#8C867E] mb-3">
          Klik salah satu barang di bawah ini untuk mengisi formulir penambahan manual secara otomatis:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {BOS_REGULER_ITEM_TEMPLATES.slice(0, 9).map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleApplyBosTemplate(tmpl)}
              className="p-3 bg-white hover:bg-[#ecfdf5] hover:border-[#059669] border border-[#E0DACE] rounded-xl text-left transition-all group cursor-pointer shadow-2xs"
            >
              <div className="text-[10px] font-mono text-[#8C867E] flex items-center justify-between">
                <span>{tmpl.kodeRekening}</span>
                <span className="text-[#059669] font-bold group-hover:underline">Pilih +</span>
              </div>
              <div className="text-xs font-semibold text-[#2C2A28] mt-1 line-clamp-2">
                {tmpl.uraian}
              </div>
              <div className="text-[11px] font-bold text-[#047857] mt-1">
                {formatRp(tmpl.tarifHarga)} / {tmpl.satuan}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
