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
  Copy
} from 'lucide-react';
import { SpjDocument, SpjType, SchoolProfile, SpjItem } from '../types';
import { SchoolLogo } from './SchoolLogo';
import {
  formatRp,
  terbilang,
  formatTanggalIndo,
  todayISO,
  generateNomorDokumen,
  generateUid
} from '../utils/formatters';
import { printSpjDocument } from '../utils/printDocument';
import { TEMA_STANDAR_LIST, SUBTEMA_PROGRAM_LIST } from '../data/standarData';

interface SpjViewProps {
  type: SpjType;
  draft: SpjDocument;
  school: SchoolProfile;
  onSaveDoc: (doc: SpjDocument) => void;
  onPrintDoc: (doc: SpjDocument, copy?: string) => void;
  allDocs: SpjDocument[];
}

export const SpjView: React.FC<SpjViewProps> = ({
  type,
  draft,
  school,
  onSaveDoc,
  onPrintDoc,
  allDocs
}) => {
  const [doc, setDoc] = useState<SpjDocument>(draft);

  useEffect(() => {
    setDoc(draft);
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
      items[index] = { ...items[index], [field]: val };
      
      // Auto compute total if nota / faktur / daftar
      if (prev.type === 'nota' || prev.type === 'faktur') {
        const sub = items.reduce((s, it) => s + (Number(it.qty || 0) * Number(it.harga || 0)), 0);
        const ppn = Math.round(sub * (Number(prev.ppnRate || 0) / 100));
        return { ...prev, items, jumlah: sub + ppn };
      } else if (prev.type === 'daftar') {
        const net = items.reduce((s, it) => s + (Number(it.honor || 0) - Number(it.pph || 0)), 0);
        return { ...prev, items, jumlah: net };
      }
      return { ...prev, items };
    });
  };

  const handleAddItem = () => {
    setDoc((prev) => {
      const items = [...(prev.items || [])];
      if (prev.type === 'daftar') {
        items.push({ nama: '', nip: '', jabatan: '', honor: 500000, pph: 25000 });
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
      return { ...prev, items };
    });
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
        </div>

        {/* Form Fields */}
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Dokumen</label>
              <input
                type="text"
                value={doc.nomor}
                onChange={(e) => handleFieldChange('nomor', e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl font-mono text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal</label>
              <input
                type="date"
                value={doc.tanggal}
                onChange={(e) => handleFieldChange('tanggal', e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl"
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

          {/* Daftar Pembayaran / Honor Form */}
          {type === 'daftar' && (
            <>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul / Kegiatan</label>
                <input
                  type="text"
                  value={doc.judul || doc.kegiatan || ''}
                  onChange={(e) => {
                    handleFieldChange('judul', e.target.value);
                    handleFieldChange('kegiatan', e.target.value);
                  }}
                  className="w-full p-2 border border-slate-200 rounded-xl font-bold"
                  placeholder="mis. Honor Pengawas Ujian / Workshop PSP"
                />
              </div>

              {/* Items List */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Daftar Penerima Honor</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Penerima
                  </button>
                </div>

                <div className="space-y-2">
                  {(doc.items || []).map((it, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[11px] text-slate-500">#{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={it.nama}
                          onChange={(e) => handleItemChange(idx, 'nama', e.target.value)}
                          placeholder="Nama Lengkap"
                          className="p-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          value={it.jabatan || ''}
                          onChange={(e) => handleItemChange(idx, 'jabatan', e.target.value)}
                          placeholder="Jabatan"
                          className="p-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={it.honor || 0}
                          onChange={(e) => handleItemChange(idx, 'honor', parseFloat(e.target.value) || 0)}
                          placeholder="Honor (Rp)"
                          className="p-1.5 border border-slate-200 rounded-lg font-mono text-xs"
                        />
                        <input
                          type="number"
                          value={it.pph || 0}
                          onChange={(e) => handleItemChange(idx, 'pph', parseFloat(e.target.value) || 0)}
                          placeholder="PPh (Rp)"
                          className="p-1.5 border border-slate-200 rounded-lg font-mono text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
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
                    Sentani, {formatTanggalIndo(doc.tanggal)}
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

          {/* Daftar Honor Preview */}
          {type === 'daftar' && (
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
                <h1 className="text-base font-black uppercase underline">DAFTAR PENERIMAAN HONORARIUM</h1>
                <p className="text-xs font-bold text-slate-700">{doc.judul || doc.kegiatan}</p>
                <p className="text-[10px] text-slate-500 font-mono">Nomor: {doc.nomor}</p>
              </div>

              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-center font-bold border-y-2 border-slate-900">
                    <th className="p-2 w-8">No</th>
                    <th className="p-2 text-left">Nama Penerima</th>
                    <th className="p-2 w-28">Jabatan</th>
                    <th className="p-2 text-right w-24">Jumlah Bruto</th>
                    <th className="p-2 text-right w-20">PPh 21</th>
                    <th className="p-2 text-right w-24">Jumlah Netto</th>
                    <th className="p-2 text-center w-24">Tanda Tangan</th>
                  </tr>
                </thead>
                <tbody>
                  {(doc.items || []).map((it, idx) => (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="p-2 text-center font-bold">{idx + 1}</td>
                      <td className="p-2 font-bold">{it.nama || '-'}</td>
                      <td className="p-2">{it.jabatan || '-'}</td>
                      <td className="p-2 text-right font-mono">{formatRp(it.honor || 0)}</td>
                      <td className="p-2 text-right font-mono">{formatRp(it.pph || 0)}</td>
                      <td className="p-2 text-right font-mono font-bold">
                        {formatRp((it.honor || 0) - (it.pph || 0))}
                      </td>
                      <td className="p-2 text-center text-slate-400">
                        {idx + 1}. .........
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-end pt-4 text-[10px] font-sans">
                <div>
                  <div>Mengetahui,</div>
                  <div className="font-bold">Kepala Sekolah</div>
                  <div className="h-14"></div>
                  <div className="font-bold underline">{school.kepsekNama}</div>
                  <div>NIP. {school.kepsekNip}</div>
                </div>

                <div className="text-right">
                  <div>Sentani, {formatTanggalIndo(doc.tanggal)}</div>
                  <div className="font-bold">Bendahara BOSP</div>
                  <div className="h-14"></div>
                  <div className="font-bold underline">{school.bendaharaNama}</div>
                  <div>NIP. {school.bendaharaNip}</div>
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
                  <div className="text-[10px]">{formatTanggalIndo(doc.tanggal)}</div>
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
                  <div>Sentani, {formatTanggalIndo(doc.tanggal)}</div>
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
