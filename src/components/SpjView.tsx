import React, { useState, useEffect } from 'react';
import {
  Printer,
  Save,
  Plus,
  Trash2,
  Receipt,
  FileText,
  FileCheck2,
  FileClock,
  CreditCard,
  Layers,
  Sparkles,
  CheckCircle,
  Copy,
  UserPlus,
  Users,
  Edit2
} from 'lucide-react';
import {
  SpjDocument,
  SpjType,
  SchoolProfile,
  SpjItem,
  MonthWorksheet,
  ArkasPerubahanMonthWorksheet
} from '../types';
import { SchoolLogo } from './SchoolLogo';
import {
  formatRp,
  terbilang,
  formatTanggalIndo,
  todayISO,
  generateNomorDokumen,
  generateUid,
  buildOfficialSpjFromBelanjaItem,
  parseDateToParts,
  SMPN7_DEFAULT_TEACHERS,
  getDefaultSmpn7TeachersHonorList
} from '../utils/formatters';
import { printSpjDocument } from '../utils/printDocument';
import { TEMA_STANDAR_LIST, SUBTEMA_PROGRAM_LIST } from '../data/standarData';
import { MONTH_NAMES } from '../data/schoolProfile';
import { FlexibleDateControl } from './FlexibleDateControl';

interface SpjViewProps {
  type: SpjType;
  draft: SpjDocument;
  school: SchoolProfile;
  onSaveDoc: (doc: SpjDocument) => void;
  onPrintDoc: (doc: SpjDocument, copy?: string) => void;
  allDocs: SpjDocument[];
  worksheets?: MonthWorksheet[];
  perubahanWorksheets?: ArkasPerubahanMonthWorksheet[];
}

export const SpjView: React.FC<SpjViewProps> = ({
  type,
  draft,
  school,
  onSaveDoc,
  onPrintDoc,
  allDocs,
  worksheets = [],
  perubahanWorksheets = []
}) => {
  const [doc, setDoc] = useState<SpjDocument>(draft);
  const [filterBelanjaMonth, setFilterBelanjaMonth] = useState<number>(0);

  // State khusus Form Input Daftar Pembayaran Guru SMP Negeri 7 Sentani
  const [formGuruNama, setFormGuruNama] = useState<string>('');
  const [formGuruJabatan, setFormGuruJabatan] = useState<string>('Guru');
  const [formGuruMapel, setFormGuruMapel] = useState<string>('Matematika');
  const [formGuruPerBulan, setFormGuruPerBulan] = useState<number>(800000);
  const [formGuruJmlBulan, setFormGuruJmlBulan] = useState<number>(draft.jumlahBulanDefault || 6);
  const [formGuruPerSemester, setFormGuruPerSemester] = useState<number>(800000 * (draft.jumlahBulanDefault || 6));
  const [editingGuruIdx, setEditingGuruIdx] = useState<number | null>(null);

  useEffect(() => {
    setDoc(draft);
    setEditingGuruIdx(null);
  }, [draft]);

  const handleFieldChange = (key: keyof SpjDocument, value: any) => {
    setDoc((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'jumlah' && (Number(value) >= 5000000)) {
        next.materai = true;
      }
      return next;
    });
  };

  const handleItemChange = (index: number, field: keyof SpjItem, val: any) => {
    setDoc((prev) => {
      const items = [...(prev.items || [])];
      const currentItem = { ...items[index], [field]: val };

      if (prev.type === 'daftar') {
        const jmlBln =
          field === 'jumlahBulan'
            ? Number(val) || 1
            : Number(currentItem.jumlahBulan || prev.jumlahBulanDefault || 6);
        if (field === 'honorPerBulan' || field === 'jumlahBulan') {
          const perBln = field === 'honorPerBulan' ? Number(val) || 0 : Number(currentItem.honorPerBulan || 0);
          const totalSem = perBln * jmlBln;
          currentItem.honorPerBulan = perBln;
          currentItem.jumlahBulan = jmlBln;
          currentItem.honorPerSemester = totalSem;
          currentItem.honor = totalSem;
          currentItem.jumlah = totalSem;
        } else if (field === 'honorPerSemester' || field === 'honor') {
          const totalSem = Number(val) || 0;
          currentItem.honorPerSemester = totalSem;
          currentItem.honor = totalSem;
          currentItem.jumlah = totalSem;
        }
      }

      items[index] = currentItem;

      // Auto compute total if nota / faktur / daftar
      if (prev.type === 'nota' || prev.type === 'faktur') {
        const sub = items.reduce((s, it) => s + (Number(it.qty || 0) * Number(it.harga || 0)), 0);
        const ppn = Math.round(sub * (Number(prev.ppnRate || 0) / 100));
        return { ...prev, items, jumlah: sub + ppn };
      } else if (prev.type === 'daftar') {
        const net = items.reduce(
          (s, it) => s + (Number(it.honorPerSemester ?? it.honor ?? 0) - Number(it.pph || 0)),
          0
        );
        return { ...prev, items, jumlah: net };
      }
      return { ...prev, items };
    });
  };

  const handleAddOrUpdateGuruFromForm = () => {
    if (!formGuruNama.trim()) {
      alert('Mohon isi Nama Guru / Penerima terlebih dahulu!');
      return;
    }
    const perBln = Number(formGuruPerBulan) || 0;
    const jmlBln = Math.max(1, Number(formGuruJmlBulan) || 1);
    const totalSem = Number(formGuruPerSemester) || perBln * jmlBln;

    const newItem: SpjItem = {
      nama: formGuruNama.trim(),
      jabatan: formGuruJabatan.trim() || 'Guru',
      mapel: formGuruMapel.trim() || '-',
      honorPerBulan: perBln,
      jumlahBulan: jmlBln,
      honorPerSemester: totalSem,
      honor: totalSem,
      pph: 0,
      jumlah: totalSem
    };

    setDoc((prev) => {
      const items = [...(prev.items || [])];
      if (editingGuruIdx !== null && editingGuruIdx >= 0 && editingGuruIdx < items.length) {
        items[editingGuruIdx] = newItem;
      } else {
        items.push(newItem);
      }
      const totalAll = items.reduce(
        (s, it) => s + (Number(it.honorPerSemester ?? it.honor ?? 0) - Number(it.pph || 0)),
        0
      );
      return {
        ...prev,
        items,
        jumlah: totalAll
      };
    });

    setFormGuruNama('');
    setFormGuruJabatan('Guru');
    setFormGuruMapel('Matematika');
    setEditingGuruIdx(null);
  };

  const handleLoadDefault10TeachersSmpn7 = () => {
    const jmlBln = Number(doc.jumlahBulanDefault || formGuruJmlBulan || 6);
    const perBln = Number(formGuruPerBulan || 800000);
    const defaultList = getDefaultSmpn7TeachersHonorList(perBln, jmlBln);
    const totalAll = defaultList.reduce((s, it) => s + (it.honorPerSemester || 0), 0);
    setDoc((prev) => ({
      ...prev,
      judul: prev.judul || 'TANDA TERIMA HONOR RUTIN GBPNS / GURU',
      periodePembayaran: prev.periodePembayaran || `Januari s/d Juni ${school.tahunAnggaran || '2026'}`,
      desaPembayaran: prev.desaPembayaran || school.desa || 'Hinekombe',
      kecamatanPembayaran: prev.kecamatanPembayaran || school.kecamatan || 'Sentani',
      kabupatenPembayaran: prev.kabupatenPembayaran || school.kabupaten || 'Jayapura',
      labelKolomHonorTotal: prev.labelKolomHonorTotal || 'Per Semester',
      jumlahBulanDefault: jmlBln,
      items: defaultList,
      jumlah: totalAll
    }));
    setEditingGuruIdx(null);
  };

  const handleAddItem = () => {
    setDoc((prev) => {
      const items = [...(prev.items || [])];
      if (prev.type === 'daftar') {
        const jmlBln = prev.jumlahBulanDefault || 6;
        const perBln = 800000;
        items.push({
          nama: '',
          nip: '',
          jabatan: 'Guru',
          mapel: 'Mata Pelajaran',
          honorPerBulan: perBln,
          jumlahBulan: jmlBln,
          honorPerSemester: perBln * jmlBln,
          honor: perBln * jmlBln,
          pph: 0
        });
        const net = items.reduce(
          (s, it) => s + (Number(it.honorPerSemester ?? it.honor ?? 0) - Number(it.pph || 0)),
          0
        );
        return { ...prev, items, jumlah: net };
      } else if (prev.type === 'berita') {
        items.push({ nama: '', qty: 1, satuan: 'kegiatan', ket: 'Selesai' });
      } else {
        items.push({ kode: '', nama: '', qty: 1, satuan: 'buah', harga: 10000 });
      }
      return { ...prev, items };
    });
  };

  const handleDeleteItem = (index: number) => {
    setDoc((prev) => {
      const items = (prev.items || []).filter((_, idx) => idx !== index);
      if (prev.type === 'daftar') {
        const net = items.reduce(
          (s, it) => s + (Number(it.honorPerSemester ?? it.honor ?? 0) - Number(it.pph || 0)),
          0
        );
        return { ...prev, items, jumlah: net };
      }
      return { ...prev, items };
    });
    if (editingGuruIdx === index) {
      setEditingGuruIdx(null);
    }
  };

  const handleSave = () => {
    if (!doc.nomor.trim()) {
      alert('Nomor dokumen tidak boleh kosong!');
      return;
    }
    onSaveDoc(doc);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Form Controls Column */}
      <div className="lg:col-span-5 bg-white p-6 md:p-7 rounded-[28px] border border-[#E0DACE] shadow-xs space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#E0DACE] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C867E]">
              FORMULIR DOKUMEN
            </span>
            <h3 className="text-base font-serif font-bold text-[#2C2A28] capitalize mt-0.5">
              {type === 'kwitansi' && 'Kwitansi Resmi BOSP'}
              {type === 'daftar' && 'Daftar Pembayaran Honor'}
              {type === 'nota' && 'Nota Pembelian Toko'}
              {type === 'faktur' && 'Faktur Barang & Jasa'}
              {type === 'bkk' && 'Bukti Kas Keluar (BKK)'}
              {type === 'berita' && 'Berita Acara'}
              {type === 'sptj' && 'SPTJ Belanja'}
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-serif font-bold bg-[#5A5A40] text-white">
            {doc.triwulan ? `TW ${doc.triwulan}` : 'BOSP'}
          </span>
        </div>

        {/* Sumber Alokasi Anggaran (ARKAS Murni vs ARKAS Perubahan) */}
        <div className="p-3 bg-[#F9F7F2] border border-[#E0DACE] rounded-2xl space-y-1.5">
          <label className="block text-[10px] font-bold text-[#5C5852] uppercase tracking-wider">
            Sumber Alokasi Anggaran (ARKAS)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFieldChange('sourceArkasType', 'murni')}
              className={`py-1.5 px-2.5 rounded-xl font-semibold text-xs border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                (doc.sourceArkasType || 'murni') === 'murni'
                  ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-2xs'
                  : 'bg-white text-[#5C5852] border-[#E0DACE] hover:bg-[#F2EDE4]'
              }`}
            >
              <span>ARKAS Murni</span>
            </button>
            <button
              type="button"
              onClick={() => handleFieldChange('sourceArkasType', 'perubahan')}
              className={`py-1.5 px-2.5 rounded-xl font-semibold text-xs border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                doc.sourceArkasType === 'perubahan'
                  ? 'bg-[#059669] text-white border-[#059669] shadow-2xs'
                  : 'bg-white text-[#059669] border-[#059669]/40 hover:bg-emerald-50'
              }`}
            >
              <span>ARKAS Perubahan</span>
            </button>
          </div>
          <div className="text-[10px] text-[#8C867E]">
            {doc.sourceArkasType === 'perubahan'
              ? '✓ Dokumen SPJ ini diterbitkan dari alokasi belanja ARKAS Perubahan.'
              : '✓ Dokumen SPJ ini diterbitkan dari alokasi belanja ARKAS Murni (Reguler).'}
          </div>

          {/* Pilih Cepat dari Rincian Belanja Bulan Kerja */}
          {(worksheets.length > 0 || perubahanWorksheets.length > 0) && (
            <div className="pt-2 mt-2 border-t border-[#E0DACE] space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label className="text-[10px] font-bold text-[#2C2A28] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#059669]" />
                  <span>Pilih Belanja untuk Terbitkan SPJ Resmi Ini:</span>
                </label>
                <select
                  value={filterBelanjaMonth}
                  onChange={(e) => setFilterBelanjaMonth(Number(e.target.value))}
                  className="text-[10px] font-bold bg-white border border-[#D5CEBF] rounded-lg px-2 py-0.5 text-[#2C2A28]"
                >
                  {MONTH_NAMES.map((m, idx) => (
                    <option key={idx} value={idx}>
                      Bulan {m}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={doc.sourceKertasKerjaId || ''}
                onChange={(e) => {
                  const itemId = e.target.value;
                  if (!itemId) return;
                  const isPerub = doc.sourceArkasType === 'perubahan';
                  const list = isPerub
                    ? perubahanWorksheets[filterBelanjaMonth]?.items.filter(
                        (it) => it.statusPerubahan !== 'DIHILANGKAN'
                      ) || []
                    : worksheets[filterBelanjaMonth]?.items || [];
                  const found = list.find((it) => it.id === itemId);
                  if (found) {
                    const generated = buildOfficialSpjFromBelanjaItem(
                      found,
                      filterBelanjaMonth,
                      isPerub ? 'perubahan' : 'murni',
                      school,
                      allDocs,
                      type
                    );
                    setDoc(generated);
                  }
                }}
                className="w-full p-2 bg-white border border-[#C5BDAF] rounded-xl text-[11px] font-medium text-[#2C2A28] cursor-pointer"
              >
                <option value="">
                  -- Pilih dari Daftar Belanja {MONTH_NAMES[filterBelanjaMonth]} (Semua Belanja Ada SPJ Resmi) --
                </option>
                {(doc.sourceArkasType === 'perubahan'
                  ? perubahanWorksheets[filterBelanjaMonth]?.items.filter(
                      (it) => it.statusPerubahan !== 'DIHILANGKAN'
                    ) || []
                  : worksheets[filterBelanjaMonth]?.items || []
                ).map((it, idx) => (
                  <option key={it.id} value={it.id}>
                    {idx + 1}. [{formatTanggalIndo(it.tanggal, it.tanggalManualText)}] {it.uraian} — {formatRp(it.jumlah)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-3 text-xs">
          {/* Pengisian Tanggal, Bulan, Tahun (Update Otomatis & Manual Kapan Saja) */}
          <FlexibleDateControl
            tanggal={doc.tanggal}
            tanggalManualText={doc.tanggalManualText}
            defaultMonthIndex={parseDateToParts(doc.tanggal).monthIndex}
            defaultYear={school.tahunAnggaran || '2026'}
            compact={true}
            label="Tanggal, Bulan & Tahun Dokumen SPJ (Update & Manual)"
            onChange={(newIsoDate, newManualText) => {
              const p = parseDateToParts(newIsoDate, 0, school.tahunAnggaran || '2026', newManualText);
              const tw = p.monthIndex < 3 ? 'I' : p.monthIndex < 6 ? 'II' : p.monthIndex < 9 ? 'III' : 'IV';
              setDoc((prev) => ({
                ...prev,
                tanggal: newIsoDate,
                tanggalManualText: newManualText,
                triwulan: tw,
                nomor: generateNomorDokumen(prev.type, newIsoDate, allDocs, school)
              }));
            }}
          />

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Dokumen Resmi SPJ</label>
              <input
                type="text"
                value={doc.nomor}
                onChange={(e) => handleFieldChange('nomor', e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl font-mono text-slate-900 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Triwulan</label>
              <select
                value={doc.triwulan || 'I'}
                onChange={(e) => handleFieldChange('triwulan', e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl font-bold"
              >
                <option value="I">Triwulan I</option>
                <option value="II">Triwulan II</option>
                <option value="III">Triwulan III</option>
                <option value="IV">Triwulan IV</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Metode Bayar</label>
              <select
                value={doc.metode || 'Tunai'}
                onChange={(e) => handleFieldChange('metode', e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl font-semibold"
              >
                <option value="Tunai">Tunai</option>
                <option value="Transfer Bank">Transfer Bank</option>
                <option value="Giro / Cek">Giro / Cek</option>
              </select>
            </div>
          </div>

          {/* Conditional Fields per Type */}
          {type === 'kwitansi' && (
            <>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sudah Terima Dari</label>
                <input
                  type="text"
                  value={doc.terimaDari || `Bendahara ${school.sumberDana} ${school.nama}`}
                  onChange={(e) => handleFieldChange('terimaDari', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Penerima</label>
                  <input
                    type="text"
                    value={doc.penerima || ''}
                    onChange={(e) => handleFieldChange('penerima', e.target.value)}
                    placeholder="Nama orang / toko..."
                    className="w-full p-2 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan / Keterangan</label>
                  <input
                    type="text"
                    value={doc.jabatanPenerima || ''}
                    onChange={(e) => handleFieldChange('jabatanPenerima', e.target.value)}
                    placeholder="mis. Guru / Toko / Panitia"
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jumlah Pembayaran (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={doc.jumlah}
                  onChange={(e) => handleFieldChange('jumlah', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-200 rounded-xl font-mono text-sm font-black text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Untuk Pembayaran / Uraian</label>
                <textarea
                  rows={3}
                  value={doc.uraian || ''}
                  onChange={(e) => handleFieldChange('uraian', e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="Uraian lengkap belanja kegiatan / barang / jasa..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PPh (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={doc.pph || 0}
                    onChange={(e) => handleFieldChange('pph', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PPN (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={doc.ppn || 0}
                    onChange={(e) => handleFieldChange('ppn', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doc.materai}
                    onChange={(e) => handleFieldChange('materai', e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span className="text-slate-700 font-semibold">Materai Rp 10.000</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doc.lunas}
                    onChange={(e) => handleFieldChange('lunas', e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span className="text-slate-700 font-semibold">Stempel LUNAS</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doc.rangkap}
                    onChange={(e) => handleFieldChange('rangkap', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-slate-700 font-semibold">Cetak 2 Rangkap (Asli + Arsip)</span>
                </label>
              </div>
            </>
          )}

          {/* Daftar Pembayaran / Honor Form (Sesuai Model Gambar untuk Guru SMP Negeri 7 Sentani) */}
          {type === 'daftar' && (
            <div className="space-y-4">
              {/* 1. Identitas & Header Daftar Pembayaran */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#D9D1C2] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#2C2A28] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>1. Identitas Header Daftar Pembayaran</span>
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    KOP SMPN 7 Sentani
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Judul Daftar Pembayaran / Honorarium
                  </label>
                  <input
                    type="text"
                    value={doc.judul || 'TANDA TERIMA HONOR RUTIN GURU / GBPNS'}
                    onChange={(e) => {
                      handleFieldChange('judul', e.target.value);
                      handleFieldChange('kegiatan', e.target.value);
                    }}
                    className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                    placeholder="TANDA TERIMA HONOR RUTIN GURU / GBPNS"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Desa / Kampung</label>
                    <input
                      type="text"
                      value={doc.desaPembayaran ?? school.desa ?? 'Hinekombe'}
                      onChange={(e) => handleFieldChange('desaPembayaran', e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Kecamatan</label>
                    <input
                      type="text"
                      value={doc.kecamatanPembayaran ?? school.kecamatan ?? 'Sentani'}
                      onChange={(e) => handleFieldChange('kecamatanPembayaran', e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Kabupaten</label>
                    <input
                      type="text"
                      value={doc.kabupatenPembayaran ?? school.kabupaten ?? 'Jayapura'}
                      onChange={(e) => handleFieldChange('kabupatenPembayaran', e.target.value)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Periode Pembayaran (Kanan Atas Tabel)
                    </label>
                    <input
                      type="text"
                      value={doc.periodePembayaran ?? `Januari s/d Juni ${school.tahunAnggaran || '2026'}`}
                      onChange={(e) => handleFieldChange('periodePembayaran', e.target.value)}
                      placeholder="mis. Januari s/d Juni 2026"
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#2C2A28]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Label Kolom Total & Pengali Bulan
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={doc.labelKolomHonorTotal ?? 'Per Semester'}
                        onChange={(e) => handleFieldChange('labelKolomHonorTotal', e.target.value)}
                        className="flex-1 p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                        placeholder="Per Semester"
                      />
                      <select
                        value={doc.jumlahBulanDefault || 6}
                        onChange={(e) => {
                          const newMult = parseInt(e.target.value, 10) || 6;
                          setFormGuruJmlBulan(newMult);
                          setFormGuruPerSemester((formGuruPerBulan || 0) * newMult);
                          setDoc((prev) => {
                            const updatedItems = (prev.items || []).map((it) => {
                              const perBln = Number(it.honorPerBulan ?? it.honor ?? 0);
                              const totalSem = perBln * newMult;
                              return {
                                ...it,
                                honorPerBulan: perBln,
                                jumlahBulan: newMult,
                                honorPerSemester: totalSem,
                                honor: totalSem,
                                jumlah: totalSem
                              };
                            });
                            const totalAll = updatedItems.reduce(
                              (s, it) => s + (Number(it.honorPerSemester ?? it.honor ?? 0) - Number(it.pph || 0)),
                              0
                            );
                            return {
                              ...prev,
                              jumlahBulanDefault: newMult,
                              labelKolomHonorTotal:
                                newMult === 6
                                  ? 'Per Semester'
                                  : newMult === 3
                                  ? 'Per Triwulan'
                                  : newMult === 1
                                  ? 'Jumlah Diterima'
                                  : `${newMult} Bulan`,
                              items: updatedItems,
                              jumlah: totalAll
                            };
                          });
                        }}
                        className="p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#5A5A40] cursor-pointer"
                        title="Pengali otomatis Per Bulan ke Per Semester"
                      >
                        <option value={1}>× 1 Bln</option>
                        <option value={3}>× 3 Bln</option>
                        <option value={6}>× 6 Bln (Semester)</option>
                        <option value={12}>× 12 Bln (Tahun)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. FORM INPUT DATA GURU YANG AKAN TERMUAT DI DAFTAR PEMBAYARAN */}
              <div className="p-4 bg-gradient-to-br from-emerald-50/90 to-[#F9F7F2] border-2 border-[#059669] rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <div className="flex items-center gap-1.5">
                    <UserPlus className="w-4 h-4 text-[#059669]" />
                    <span className="text-xs font-bold text-[#065f46]">
                      {editingGuruIdx !== null
                        ? `Edit Data Guru #${editingGuruIdx + 1} di Daftar Pembayaran`
                        : '2. Form Input Guru (Termuat ke Daftar Pembayaran)'}
                    </span>
                  </div>
                  {editingGuruIdx !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingGuruIdx(null);
                        setFormGuruNama('');
                        setFormGuruJabatan('Guru');
                        setFormGuruMapel('Matematika');
                      }}
                      className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>

                {/* Pilih Cepat Guru SMP Negeri 7 Sentani */}
                <div>
                  <label className="block text-[10px] font-bold text-[#065f46] uppercase mb-1">
                    Pilih Cepat Guru SMP Negeri 7 Sentani (Atau Ketik Manual di Bawah):
                  </label>
                  <select
                    value=""
                    onChange={(e) => {
                      const idxStr = e.target.value;
                      if (idxStr === '') return;
                      const t = SMPN7_DEFAULT_TEACHERS[parseInt(idxStr, 10)];
                      if (t) {
                        setFormGuruNama(t.nama);
                        setFormGuruJabatan(t.jabatan);
                        setFormGuruMapel(t.mapel);
                        const perBln = formGuruPerBulan || t.defaultHonorBulan;
                        setFormGuruPerBulan(perBln);
                        setFormGuruPerSemester(perBln * (formGuruJmlBulan || 6));
                      }
                    }}
                    className="w-full p-2 bg-white border border-emerald-300 rounded-xl text-xs font-semibold text-[#2C2A28] cursor-pointer"
                  >
                    <option value="">-- Klik untuk Pilih Guru SMP Negeri 7 Sentani --</option>
                    {SMPN7_DEFAULT_TEACHERS.map((t, i) => (
                      <option key={i} value={i}>
                        {i + 1}. {t.nama} — {t.jabatan} ({t.mapel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Nama Guru / Penerima *
                    </label>
                    <input
                      type="text"
                      value={formGuruNama}
                      onChange={(e) => setFormGuruNama(e.target.value)}
                      placeholder="Nama Lengkap & Gelar"
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Jabatan
                    </label>
                    <input
                      type="text"
                      value={formGuruJabatan}
                      onChange={(e) => setFormGuruJabatan(e.target.value)}
                      placeholder="Kepsek & Guru / Guru"
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Mata Pelajaran (Mapel)
                    </label>
                    <input
                      type="text"
                      value={formGuruMapel}
                      onChange={(e) => setFormGuruMapel(e.target.value)}
                      placeholder="mis. Matematika, IPA, IPS"
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Honor Per Bulan (Rp)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      value={formGuruPerBulan}
                      onChange={(e) => {
                        const pb = parseFloat(e.target.value) || 0;
                        setFormGuruPerBulan(pb);
                        setFormGuruPerSemester(pb * (formGuruJmlBulan || 1));
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Jumlah Bulan
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={formGuruJmlBulan}
                      onChange={(e) => {
                        const jb = Math.max(1, parseInt(e.target.value, 10) || 1);
                        setFormGuruJmlBulan(jb);
                        setFormGuruPerSemester((formGuruPerBulan || 0) * jb);
                      }}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-mono text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#047857] mb-1">
                      {doc.labelKolomHonorTotal || 'Per Semester'} (Rp)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      value={formGuruPerSemester}
                      onChange={(e) => setFormGuruPerSemester(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 bg-white border border-emerald-400 rounded-xl font-mono text-xs font-black text-[#047857]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleAddOrUpdateGuruFromForm}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {editingGuruIdx !== null
                        ? 'Simpan Perubahan ke Daftar Pembayaran'
                        : 'Masukkan ke Daftar Pembayaran'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadDefault10TeachersSmpn7}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#5A5A40] hover:bg-[#484832] text-white font-bold rounded-xl text-[11px] shadow-xs transition active:scale-95 cursor-pointer"
                    title="Muat otomatis 10 Guru SMP Negeri 7 Sentani sesuai model gambar"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Muat 10 Guru SMPN 7</span>
                  </button>
                </div>
              </div>

              {/* 3. Daftar Guru yang Termuat di Tabel Daftar Pembayaran */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 flex items-center gap-1.5">
                    <span>3. Daftar Guru Termuat ({(doc.items || []).length} Orang)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Baris Kosong
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {(doc.items || []).map((it, idx) => {
                    const perBulanVal = it.honorPerBulan ?? Math.round((it.honor || 0) / (it.jumlahBulan || doc.jumlahBulanDefault || 1));
                    const perSemesterVal = it.honorPerSemester ?? it.honor ?? 0;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border space-y-2 transition ${
                          editingGuruIdx === idx
                            ? 'bg-emerald-50 border-emerald-400'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[11px] text-slate-700">
                            No. {idx + 1} — {it.nama || '(Belum diisi)'}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingGuruIdx(idx);
                                setFormGuruNama(it.nama || '');
                                setFormGuruJabatan(it.jabatan || 'Guru');
                                setFormGuruMapel(it.mapel || '-');
                                setFormGuruPerBulan(perBulanVal);
                                setFormGuruJmlBulan(it.jumlahBulan || doc.jumlahBulanDefault || 6);
                                setFormGuruPerSemester(perSemesterVal);
                              }}
                              className="text-emerald-700 hover:bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" /> Edit di Form
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(idx)}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              title="Hapus baris guru ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={it.nama}
                            onChange={(e) => handleItemChange(idx, 'nama', e.target.value)}
                            placeholder="Nama Guru"
                            className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={it.jabatan || ''}
                            onChange={(e) => handleItemChange(idx, 'jabatan', e.target.value)}
                            placeholder="Jabatan"
                            className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            value={it.mapel || ''}
                            onChange={(e) => handleItemChange(idx, 'mapel', e.target.value)}
                            placeholder="Mapel"
                            className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] uppercase font-bold text-slate-500 mb-0.5">
                              Honor Per Bulan (Rp)
                            </label>
                            <input
                              type="number"
                              value={perBulanVal}
                              onChange={(e) =>
                                handleItemChange(idx, 'honorPerBulan', parseFloat(e.target.value) || 0)
                              }
                              className="w-full p-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase font-bold text-emerald-700 mb-0.5">
                              {doc.labelKolomHonorTotal || 'Per Semester'} (Rp)
                            </label>
                            <input
                              type="number"
                              value={perSemesterVal}
                              onChange={(e) =>
                                handleItemChange(idx, 'honorPerSemester', parseFloat(e.target.value) || 0)
                              }
                              className="w-full p-1.5 bg-white border border-emerald-300 rounded-lg font-mono text-xs font-bold text-emerald-900"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Nota & Faktur Form */}
          {(type === 'nota' || type === 'faktur') && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Toko / Rekanan</label>
                  <input
                    type="text"
                    value={doc.tokoNama || ''}
                    onChange={(e) => handleFieldChange('tokoNama', e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl font-bold"
                    placeholder="mis. Toko Buku Sentani"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Penanggung Jawab</label>
                  <input
                    type="text"
                    value={doc.tokoPic || ''}
                    onChange={(e) => handleFieldChange('tokoPic', e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                    placeholder="Pemilik / Kasir"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Toko</label>
                <input
                  type="text"
                  value={doc.tokoAlamat || ''}
                  onChange={(e) => handleFieldChange('tokoAlamat', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                  placeholder="Jl. Kemiri Sentani..."
                />
              </div>

              {type === 'faktur' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">NPWP Toko</label>
                    <input
                      type="text"
                      value={doc.npwp || ''}
                      onChange={(e) => handleFieldChange('npwp', e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">PPN (%)</label>
                    <input
                      type="number"
                      value={doc.ppnRate || 0}
                      onChange={(e) => handleFieldChange('ppnRate', parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Rincian Barang / Jasa</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Barang
                  </button>
                </div>

                <div className="space-y-2">
                  {(doc.items || []).map((it, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[11px] text-slate-500">Item #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={it.nama}
                        onChange={(e) => handleItemChange(idx, 'nama', e.target.value)}
                        placeholder="Nama Barang / Jasa"
                        className="w-full p-1.5 border border-slate-200 rounded-lg text-xs font-semibold"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          value={it.qty || 1}
                          onChange={(e) => handleItemChange(idx, 'qty', parseFloat(e.target.value) || 1)}
                          placeholder="Qty"
                          className="p-1.5 border border-slate-200 rounded-lg font-mono text-xs"
                        />
                        <input
                          type="text"
                          value={it.satuan || 'buah'}
                          onChange={(e) => handleItemChange(idx, 'satuan', e.target.value)}
                          placeholder="Satuan"
                          className="p-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="number"
                          value={it.harga || 0}
                          onChange={(e) => handleItemChange(idx, 'harga', parseFloat(e.target.value) || 0)}
                          placeholder="Harga Satuan"
                          className="p-1.5 border border-slate-200 rounded-lg font-mono text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* BKK / Berita / SPTJ Form */}
          {(type === 'bkk' || type === 'berita' || type === 'sptj') && (
            <>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {type === 'bkk' ? 'Dibayarkan Kepada' : type === 'berita' ? 'Nama Pihak Kedua' : 'Nama Bendahara'}
                </label>
                <input
                  type="text"
                  value={doc.penerima || doc.pihak2Nama || school.bendaharaNama}
                  onChange={(e) => {
                    handleFieldChange('penerima', e.target.value);
                    handleFieldChange('pihak2Nama', e.target.value);
                  }}
                  className="w-full p-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jumlah Nominal (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={doc.jumlah}
                  onChange={(e) => handleFieldChange('jumlah', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-200 rounded-xl font-mono font-black text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Uraian / Keterangan Belanja</label>
                <textarea
                  rows={4}
                  value={doc.uraian || ''}
                  onChange={(e) => handleFieldChange('uraian', e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="Penjelasan rinci belanja..."
                ></textarea>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#E0DACE] flex items-center gap-2.5">
            <button
              id="btn-save-spj-arsip"
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#5A5A40] hover:bg-[#484832] text-white font-medium py-2.5 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan ke Arsip</span>
            </button>
            <button
              id="btn-print-spj-pdf"
              onClick={() => printSpjDocument(doc, school, doc.rangkap ? 'DUA_RANGKAP' : 'ASLI')}
              className="flex items-center justify-center gap-1.5 bg-[#C06E52] hover:bg-[#A85A3F] text-white font-medium px-4 py-2.5 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
              title="Cetak langsung ke printer atau simpan sebagai PDF standar A4"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview Column */}
      <div className="lg:col-span-7 bg-[#E8E2D6] rounded-[28px] p-6 shadow-xs border border-[#D9D1C2] overflow-x-auto flex flex-col items-center">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between text-[#2C2A28] text-xs mb-3 gap-2 font-semibold">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm">Pratinjau Lembar A4 Cetak Resmi</span>
            <span className="text-[#8C867E] text-[11px] font-mono">210mm × 297mm</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-print-spj-preview-pdf"
              onClick={() => printSpjDocument(doc, school, 'ASLI')}
              className="flex items-center gap-1.5 text-xs bg-white hover:bg-[#F9F7F2] text-[#2C2A28] px-3.5 py-1.5 rounded-lg border border-[#D9D1C2] font-semibold shadow-2xs transition active:scale-95 cursor-pointer"
              title="Cetak atau Simpan PDF Lembar Cetak SPJ A4"
            >
              <Printer className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              type="button"
              onClick={() => onPrintDoc(doc, 'ASLI')}
              className="flex items-center gap-1 text-[11px] bg-[#5A5A40] hover:bg-[#484832] text-white px-3 py-1.5 rounded-lg font-medium shadow-2xs transition active:scale-95 cursor-pointer"
            >
              <span>Modal Cetak</span>
            </button>
          </div>
        </div>

        {/* Paper Container */}
        <div className="w-[210mm] min-h-[297mm] bg-white text-[#2C2A28] p-8 shadow-md rounded-sm text-xs font-serif leading-normal relative select-text border border-[#E0DACE] overflow-hidden">
          {/* Watermark Background with School Logo & Subtle Blur */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <img
              src="/logo_smpn7.png"
              alt=""
              className="w-[360px] h-[360px] object-contain opacity-[0.075] blur-[0.8px] select-none pointer-events-none"
            />
          </div>

          <div className="relative z-10 space-y-4">
            {/* Document Content Render */}
            {type === 'kwitansi' && (
              <div className="space-y-4">
                <div className="p-2 relative space-y-3">
                {/* Stempel Lunas Overlay */}
                {doc.lunas && (
                  <div className="absolute top-12 right-16 border-4 border-emerald-600 text-emerald-600 font-black text-sm px-4 py-1.5 rounded-xl rotate-[-15deg] uppercase tracking-widest opacity-80 pointer-events-none">
                    LUNAS
                  </div>
                )}

                {/* Header Kop */}
                <div className="flex items-center justify-center gap-3 border-b-2 border-slate-900 pb-2.5">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                    <SchoolLogo size={46} showBorder={false} />
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-[10px] font-bold tracking-widest uppercase font-sans">
                      PEMERINTAH KABUPATEN JAYAPURA • {school.dinas.toUpperCase()}
                    </div>
                    <h2 className="text-base font-black font-sans tracking-wide text-slate-950 mt-0.5">
                      {school.nama}
                    </h2>
                    <p className="text-[10px] text-slate-600 font-sans">
                      {school.alamat}, Kec. {school.kecamatan}, Kab. {school.kabupaten}, Prov. {school.provinsi} | NPSN: {school.npsn}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center pt-1">
                  <h1 className="text-xl font-black font-serif tracking-widest uppercase text-slate-950 underline decoration-2">
                    KWITANSI / BUKTI PEMBAYARAN
                  </h1>
                  <p className="text-[11px] font-mono text-slate-600 mt-0.5">
                    Nomor: <b className="text-slate-900">{doc.nomor}</b>
                  </p>
                </div>

                {/* Fields Table */}
                <table className="w-full text-xs mt-2 border-collapse">
                  <tbody>
                    <tr className="align-top">
                      <td className="w-40 py-1.5 font-bold">Sudah Terima Dari</td>
                      <td className="w-3 py-1.5">:</td>
                      <td className="py-1.5 font-semibold">{doc.terimaDari || `Bendahara ${school.sumberDana} ${school.nama}`}</td>
                    </tr>
                    <tr className="align-top">
                      <td className="py-1.5 font-bold">Uang Sejumlah</td>
                      <td className="py-1.5">:</td>
                      <td className="py-1.5 font-serif italic font-bold">
                        " {terbilang(doc.jumlah)} Rupiah "
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="py-1.5 font-bold">Untuk Pembayaran</td>
                      <td className="py-1.5">:</td>
                      <td className="py-1.5 leading-relaxed">
                        {doc.uraian || '-'}
                        {doc.komponen && (
                          <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                            Komponen: {doc.komponen} • Rekening: {doc.rekening || '-'}
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Amount & Signatures */}
                <div className="pt-3 border-t border-slate-900 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500">Jumlah Bersih:</div>
                    <div className="text-base font-black font-mono text-slate-950 border-b-2 border-slate-900 pb-0.5 inline-block">
                      {formatRp(doc.jumlah)},-
                    </div>
                  </div>

                  <div className="text-right text-[11px] font-sans">
                    Sentani, {formatTanggalIndo(doc.tanggal, doc.tanggalManualText)}
                  </div>
                </div>

                {/* 3 Signatures */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-sans pt-4">
                  <div>
                    <div>Mengetahui,</div>
                    <div className="font-bold">Kepala Sekolah</div>
                    <div className="h-16 flex items-center justify-center">
                      <span className="text-slate-300 text-[9px]">(Tanda Tangan & Cap)</span>
                    </div>
                    <div className="font-bold underline">{school.kepsekNama}</div>
                    <div>NIP. {school.kepsekNip}</div>
                  </div>

                  <div>
                    <div>Lunas Dibayar,</div>
                    <div className="font-bold">Bendahara BOSP</div>
                    <div className="h-16 flex items-center justify-center">
                      <span className="text-slate-300 text-[9px]">(Tanda Tangan)</span>
                    </div>
                    <div className="font-bold underline">{school.bendaharaNama}</div>
                    <div>NIP. {school.bendaharaNip}</div>
                  </div>

                  <div>
                    <div>Yang Menerima,</div>
                    <div className="font-bold">{doc.jabatanPenerima || 'Penerima'}</div>
                    <div className="h-16 flex items-center justify-center relative">
                      {doc.materai && (
                        <div className="border border-red-500 text-red-500 text-[8px] font-bold px-1.5 py-0.5 rounded rotate-[-10deg]">
                          MATERAI 10.000
                        </div>
                      )}
                    </div>
                    <div className="font-bold underline">{doc.penerima || '...................'}</div>
                    <div>{doc.penerimaNip ? `NIP. ${doc.penerimaNip}` : ''}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Daftar Honor Preview (Sesuai Gambar Upload: KOP SMPN 7 Sentani + Tabel Honorarium Per Bulan & Per Semester + TTD Kepsek & Bendahara) */}
          {type === 'daftar' && (
            <div className="space-y-3 font-sans text-slate-950">
              {/* KOP SURAT RESMI SMP NEGERI 7 SENTANI */}
              <div className="flex items-center justify-center gap-3 border-b-[3px] border-double border-slate-900 pb-2.5">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <SchoolLogo size={46} showBorder={false} />
                </div>
                <div className="text-center flex-1">
                  <div className="text-[10px] font-bold tracking-widest uppercase">
                    PEMERINTAH KABUPATEN JAYAPURA • {school.dinas.toUpperCase()}
                  </div>
                  <h2 className="text-base font-black tracking-wide text-slate-950 mt-0.5 uppercase">
                    {school.nama}
                  </h2>
                  <p className="text-[9.5px] text-slate-700">
                    {school.alamat}, Kampung {doc.desaPembayaran || school.desa || 'Hinekombe'}, Distrik {doc.kecamatanPembayaran || school.kecamatan || 'Sentani'}, Kab. {doc.kabupatenPembayaran || school.kabupaten || 'Jayapura'} | NPSN: {school.npsn}
                  </p>
                </div>
              </div>

              {/* JUDUL DOKUMEN */}
              <div className="text-center pt-1">
                <h1 className="text-sm font-black uppercase tracking-wide text-slate-950">
                  {doc.judul || 'TANDA TERIMA HONOR RUTIN GURU / GBPNS'}
                </h1>
                <p className="text-[10px] text-slate-600 font-mono">
                  Nomor Dokumen SPJ: <b className="text-slate-900">{doc.nomor}</b>
                </p>
              </div>

              {/* BLOK IDENTITAS SEKOLAH & PERIODE (PERSIS GAMBAR) */}
              <div className="flex items-end justify-between text-[11px] pt-1 pb-1">
                <table className="border-collapse text-[11px]">
                  <tbody>
                    <tr>
                      <td className="pr-4 py-0.5 font-medium">Nama Sekolah</td>
                      <td className="pr-2 py-0.5">:</td>
                      <td className="py-0.5 font-semibold">{school.nama}</td>
                    </tr>
                    <tr>
                      <td className="pr-4 py-0.5 font-medium">Desa / Kampung</td>
                      <td className="pr-2 py-0.5">:</td>
                      <td className="py-0.5">{doc.desaPembayaran || school.desa || 'Hinekombe'}</td>
                    </tr>
                    <tr>
                      <td className="pr-4 py-0.5 font-medium">Kecamatan</td>
                      <td className="pr-2 py-0.5">:</td>
                      <td className="py-0.5">{doc.kecamatanPembayaran || school.kecamatan || 'Sentani'}</td>
                    </tr>
                    <tr>
                      <td className="pr-4 py-0.5 font-medium">Kabupaten</td>
                      <td className="pr-2 py-0.5">:</td>
                      <td className="py-0.5">{doc.kabupatenPembayaran || school.kabupaten || 'Jayapura'}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="pb-0.5 font-semibold text-[11px]">
                  : {doc.periodePembayaran || `Januari s/d Juni ${school.tahunAnggaran || '2026'}`}
                </div>
              </div>

              {/* TABEL DAFTAR PEMBAYARAN HONORARIUM (7 KOLOM SESUAI GAMBAR UPLOAD) */}
              <table className="w-full text-[10.5px] border-collapse border border-slate-900">
                <thead>
                  <tr className="text-center font-semibold bg-white">
                    <th rowSpan={2} className="border border-slate-900 py-2 px-1.5 w-8 align-middle">
                      No
                    </th>
                    <th rowSpan={2} className="border border-slate-900 py-2 px-2.5 align-middle">
                      Nama
                    </th>
                    <th rowSpan={2} className="border border-slate-900 py-2 px-2 w-24 align-middle">
                      Jabatan
                    </th>
                    <th rowSpan={2} className="border border-slate-900 py-2 px-2 w-28 align-middle">
                      Mapel
                    </th>
                    <th colSpan={2} className="border border-slate-900 py-1.5 px-2 align-middle">
                      Honorarium
                    </th>
                    <th rowSpan={2} className="border border-slate-900 py-2 px-2 w-28 align-middle">
                      Tanda Tangan
                    </th>
                  </tr>
                  <tr className="text-center font-semibold bg-white">
                    <th className="border border-slate-900 py-1.5 px-2 w-24">Per Bulan</th>
                    <th className="border border-slate-900 py-1.5 px-2 w-28">
                      {doc.labelKolomHonorTotal || 'Per Semester'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(doc.items || []).map((it, idx) => {
                    const perBln =
                      it.honorPerBulan ??
                      Math.round((it.honor || 0) / (it.jumlahBulan || doc.jumlahBulanDefault || 1));
                    const perSem = it.honorPerSemester ?? it.honor ?? 0;
                    const isOdd = (idx + 1) % 2 === 1;
                    return (
                      <tr key={idx}>
                        <td className="border border-slate-900 py-1.5 px-1.5 text-center">
                          {idx + 1}{idx >= 3 ? '.' : ''}
                        </td>
                        <td className="border border-slate-900 py-1.5 px-2 font-medium">
                          {it.nama || '-'}
                        </td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center">
                          {it.jabatan || 'Guru'}
                        </td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center">
                          {it.mapel || '-'}
                        </td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center font-mono">
                          {formatRp(perBln)}
                        </td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center font-mono">
                          {formatRp(perSem)}
                        </td>
                        <td className="border border-slate-900 py-1.5 px-2 align-top">
                          <div className={isOdd ? 'text-left pl-0.5 text-[9.5px]' : 'text-center pl-4 text-[9.5px]'}>
                            {idx + 1}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {/* BARIS TOTAL PERSIS GAMBAR */}
                  <tr>
                    <td
                      colSpan={5}
                      className="border border-slate-900 py-2 px-3 text-center font-black tracking-wide uppercase"
                    >
                      TOTAL
                    </td>
                    <td className="border border-slate-900 py-2 px-2 text-right font-mono font-black">
                      {formatRp(doc.jumlah)}
                    </td>
                    <td className="border-0"></td>
                  </tr>
                </tbody>
              </table>

              {/* TANDA TANGAN KEPALA SEKOLAH & BENDAHARA SMP NEGERI 7 SENTANI */}
              <div className="grid grid-cols-2 gap-6 pt-5 px-4 text-[11px]">
                <div>
                  <div className="h-4"></div>
                  <div>Kepala {school.nama}</div>
                  <div className="h-16"></div>
                  <div className="font-bold underline uppercase">{school.kepsekNama}</div>
                  <div className="text-[10px]">NIP. {school.kepsekNip}</div>
                </div>

                <div className="pl-8">
                  <div>Lunas dibayar, {formatTanggalIndo(doc.tanggal, doc.tanggalManualText)}</div>
                  <div>Bendahara</div>
                  <div className="h-16"></div>
                  <div className="font-bold underline uppercase">{school.bendaharaNama}</div>
                  <div className="text-[10px]">NIP. {school.bendaharaNip}</div>
                </div>
              </div>
            </div>
          )}

          {/* Nota & Faktur Preview */}
          {(type === 'nota' || type === 'faktur') && (
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-2">
                <div>
                  <div className="text-base font-black uppercase">{doc.tokoNama || 'TOKO PENYEDIA'}</div>
                  <p className="text-[10px] text-slate-600">{doc.tokoAlamat || 'Sentani, Jayapura, Papua'}</p>
                  {doc.npwp && <p className="text-[10px] font-mono">NPWP: {doc.npwp}</p>}
                </div>
                <div className="text-right font-mono">
                  <div className="text-sm font-black uppercase text-slate-900">{type.toUpperCase()}</div>
                  <div className="text-[10px]">No: {doc.nomor}</div>
                  <div className="text-[10px]">{formatTanggalIndo(doc.tanggal, doc.tanggalManualText)}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold">Kepada Yth:</div>
                <div className="text-xs font-bold">{school.nama}</div>
                <div className="text-[10px] text-slate-600">{school.alamat}</div>
              </div>

              <table className="w-full text-[10px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-center font-bold border-y-2 border-slate-900">
                    <th className="p-2 w-8">No</th>
                    <th className="p-2 text-left">Nama Barang / Jasa</th>
                    <th className="p-2 w-12">Qty</th>
                    <th className="p-2 w-16">Satuan</th>
                    <th className="p-2 text-right w-24">Harga</th>
                    <th className="p-2 text-right w-24">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {(doc.items || []).map((it, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="p-2 text-center font-bold">{idx + 1}</td>
                      <td className="p-2 font-semibold">{it.nama || '-'}</td>
                      <td className="p-2 text-center font-mono">{it.qty || 1}</td>
                      <td className="p-2 text-center">{it.satuan || 'buah'}</td>
                      <td className="p-2 text-right font-mono">{formatRp(it.harga || 0)}</td>
                      <td className="p-2 text-right font-mono font-bold">
                        {formatRp((it.qty || 1) * (it.harga || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold border-t-2 border-slate-900">
                    <td colSpan={5} className="p-2 text-right">TOTAL:</td>
                    <td className="p-2 text-right font-mono font-black text-xs">
                      {formatRp(doc.jumlah)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className="flex justify-between items-end pt-4 text-[10px] font-sans">
                <div>
                  <div>Penerima Barang,</div>
                  <div className="font-bold">{school.nama}</div>
                  <div className="h-14"></div>
                  <div className="font-bold underline">{school.bendaharaNama}</div>
                </div>

                <div className="text-right">
                  <div>Hormat Kami,</div>
                  <div className="font-bold">{doc.tokoNama || 'Penyedia Toko'}</div>
                  <div className="h-14"></div>
                  <div className="font-bold underline">{doc.tokoPic || '...................'}</div>
                </div>
              </div>
            </div>
          )}

          {/* BKK / Berita / SPTJ Preview */}
          {(type === 'bkk' || type === 'berita' || type === 'sptj') && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 border-b-2 border-slate-900 pb-2">
                <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center">
                  <SchoolLogo size={42} showBorder={false} />
                </div>
                <div className="text-center flex-1">
                  <div className="text-[10px] font-bold uppercase font-sans">
                    PEMERINTAH KABUPATEN JAYAPURA • {school.dinas.toUpperCase()}
                  </div>
                  <h2 className="text-base font-black font-sans">{school.nama}</h2>
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-base font-black uppercase underline">
                  {type === 'bkk' && 'BUKTI KAS KELUAR (BKK)'}
                  {type === 'berita' && 'BERITA ACARA PEMBAYARAN / SERAH TERIMA'}
                  {type === 'sptj' && 'SURAT PERNYATAAN TANGGUNG JAWAB BELANJA (SPTJ)'}
                </h1>
                <p className="text-[10px] font-mono">Nomor: {doc.nomor}</p>
              </div>

              <div className="py-2 space-y-2 text-xs border-y border-slate-200">
                <p><b>Uraian:</b> {doc.uraian || '-'}</p>
                <p><b>Jumlah:</b> <span className="font-mono font-bold border-b border-slate-900">{formatRp(doc.jumlah)}</span> (<i>{terbilang(doc.jumlah)} Rupiah</i>)</p>
              </div>

              <div className="flex justify-between items-end pt-6 text-[10px] font-sans">
                <div>
                  <div>Mengetahui,</div>
                  <div className="font-bold">Kepala Sekolah</div>
                  <div className="h-16"></div>
                  <div className="font-bold underline">{school.kepsekNama}</div>
                  <div>NIP. {school.kepsekNip}</div>
                </div>

                <div className="text-right">
                  <div>Sentani, {formatTanggalIndo(doc.tanggal, doc.tanggalManualText)}</div>
                  <div className="font-bold">Bendahara BOSP</div>
                  <div className="h-16"></div>
                  <div className="font-bold underline">{school.bendaharaNama}</div>
                  <div>NIP. {school.bendaharaNip}</div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
