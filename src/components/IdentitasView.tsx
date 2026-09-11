import React, { useState } from 'react';
import { School, Save, RotateCcw, Building2, UserCheck, Landmark, Award, ShieldCheck, Lock } from 'lucide-react';
import { SchoolProfile, UserAccount } from '../types';
import { DEFAULT_SCHOOL_PROFILE } from '../data/schoolProfile';
import { formatRp } from '../utils/formatters';
import { SchoolLogo } from './SchoolLogo';

interface IdentitasViewProps {
  school: SchoolProfile;
  onUpdateSchool: (profile: SchoolProfile) => void;
  currentUser?: UserAccount;
}

export const IdentitasView: React.FC<IdentitasViewProps> = ({ school, onUpdateSchool, currentUser }) => {
  const isKepsek = !currentUser || currentUser.role === 'KEPSEK';
  const [form, setForm] = useState<SchoolProfile>({ ...school });

  const handleChange = (key: keyof SchoolProfile, val: any) => {
    if (!isKepsek) return;
    setForm((prev) => {
      const updated = { ...prev, [key]: val };
      onUpdateSchool(updated);
      return updated;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isKepsek) {
      alert('Akses Ditolak: Hanya Kepala Sekolah yang berwenang mengubah identitas dan data pejabat sekolah.');
      return;
    }
    onUpdateSchool(form);
    alert('Perubahan profil berhasil disimpan dan langsung disinkronkan ke seluruh dokumen!');
  };

  const handleReset = () => {
    if (!isKepsek) {
      alert('Akses Ditolak: Hanya Kepala Sekolah yang berwenang mereset identitas.');
      return;
    }
    if (confirm('Kembalikan data identitas ke profil resmi SMP Negeri 7 Sentani?')) {
      setForm({ ...DEFAULT_SCHOOL_PROFILE });
      onUpdateSchool({ ...DEFAULT_SCHOOL_PROFILE });
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 md:p-7 rounded-[28px] border border-[#E0DACE] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SchoolLogo size={56} className="shrink-0 drop-shadow-md" />
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C867E]">
              PROFIL SATUAN PENDIDIKAN
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2C2A28] mt-0.5">
              Identitas Sekolah & Pejabat Pengelola BOSP
            </h2>
            <p className="text-xs text-[#6B665E] mt-0.5">
              Data ini otomatis dicantumkan pada kop surat, kertas kerja, dan dokumen SPJ resmi
            </p>
          </div>
        </div>

        {isKepsek ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-reset-identitas"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-medium text-[#6B665E] hover:text-[#2C2A28] px-3.5 py-2.5 rounded-xl border border-[#E0DACE] hover:bg-[#F9F7F2] transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
            <button
              type="submit"
              id="btn-save-identitas"
              className="flex items-center gap-1.5 bg-[#5A5A40] hover:bg-[#484832] text-white font-medium px-4 py-2.5 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Identitas</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-medium">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Mode Baca (Hanya Master Admin / Kepala Sekolah yang Berwenang Mengubah)</span>
          </div>
        )}
      </div>

      {/* Role Notice Banner */}
      {!isKepsek && (
        <div className="p-4 bg-[#F5F2EB] border border-[#E0DACE] rounded-2xl flex items-start gap-3 text-xs text-[#5C5852]">
          <ShieldCheck className="w-5 h-5 text-[#C06E52] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-bold text-[#2C2A28]">Akses Admin Biasa (Bendahara)</div>
            <p className="leading-relaxed">
              Anda masuk sebagai <b>Bendahara BOSP</b>. Halaman identitas dan pagu anggaran dikunci untuk menjaga validitas data master. Jika terdapat perubahan NPSN, alamat, atau SK penugasan, silakan koordinasikan dengan <b>Kepala Sekolah (Master Admin)</b>.
            </p>
          </div>
        </div>
      )}

      {/* Emblem & Official Info Showcase Card */}
      <div className="bg-[#F2EDE4] p-5 rounded-[24px] border border-[#E0DACE] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <SchoolLogo size="md" />
          <div>
            <div className="font-serif font-bold text-sm text-[#2C2A28]">
              {form.nama} • Sentani, Kab. Jayapura
            </div>
            <div className="text-xs text-[#6B665E] font-medium flex items-center gap-2 mt-0.5">
              <span>Motto: <b className="text-[#5A5A40] font-mono font-bold">"{form.motto}"</b></span>
              <span>•</span>
              <span>Akreditasi: <b className="text-[#C06E52]">{form.akreditasi}</b></span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium bg-white px-3.5 py-2 rounded-xl border border-[#E0DACE] text-[#5A5A40] shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#5A5A40]" />
          <span>Logo Resmi Terintegrasi di Seluruh Dokumen SPJ</span>
        </div>
      </div>

      {/* Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Sekolah Info */}
        <div className="bg-white p-6 md:p-7 rounded-[28px] border border-[#E0DACE] shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-serif font-bold text-[#2C2A28] text-sm border-b border-[#E0DACE] pb-2.5">
            <Building2 className="w-4 h-4 text-[#5A5A40]" />
            <span>Data Satuan Pendidikan</span>
          </div>

          <div>
            <label className="block font-semibold text-[#2C2A28] mb-1">Nama Sekolah</label>
            <input
              type="text"
              disabled={!isKepsek}
              value={form.nama}
              onChange={(e) => handleChange('nama', e.target.value)}
              className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-bold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#2C2A28] mb-1">NPSN</label>
              <input
                type="text"
                disabled={!isKepsek}
                value={form.npsn}
                onChange={(e) => handleChange('npsn', e.target.value)}
                className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono font-bold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#2C2A28] mb-1">Akreditasi</label>
              <input
                type="text"
                disabled={!isKepsek}
                value={form.akreditasi}
                onChange={(e) => handleChange('akreditasi', e.target.value)}
                className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-bold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#2C2A28] mb-1">Alamat Jalan</label>
            <input
              type="text"
              disabled={!isKepsek}
              value={form.alamat}
              onChange={(e) => handleChange('alamat', e.target.value)}
              className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#2C2A28] mb-1">Kecamatan / Distrik</label>
              <input
                type="text"
                disabled={!isKepsek}
                value={form.kecamatan}
                onChange={(e) => handleChange('kecamatan', e.target.value)}
                className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#2C2A28] mb-1">Kabupaten</label>
              <input
                type="text"
                disabled={!isKepsek}
                value={form.kabupaten}
                onChange={(e) => handleChange('kabupaten', e.target.value)}
                className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-bold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#2C2A28] mb-1">Provinsi</label>
              <input
                type="text"
                disabled={!isKepsek}
                value={form.provinsi}
                onChange={(e) => handleChange('provinsi', e.target.value)}
                className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-bold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#2C2A28] mb-1">Motto Sekolah</label>
              <input
                type="text"
                disabled={!isKepsek}
                value={form.motto}
                onChange={(e) => handleChange('motto', e.target.value)}
                className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono text-[#5A5A40] font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#2C2A28] mb-1">Nama Dinas Pendidikan</label>
            <input
              type="text"
              disabled={!isKepsek}
              value={form.dinas}
              onChange={(e) => handleChange('dinas', e.target.value)}
              className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Pejabat & Rekening */}
        <div className="space-y-6">
          <div className="bg-white p-6 md:p-7 rounded-[28px] border border-[#E0DACE] shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-serif font-bold text-[#2C2A28] text-sm border-b border-[#E0DACE] pb-2.5">
              <UserCheck className="w-4 h-4 text-[#5A5A40]" />
              <span>Pejabat & Penandatangan Dokumen</span>
            </div>

            <div>
              <label className="block font-semibold text-[#2C2A28] mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                disabled={!isKepsek}
                value={form.kepsekNama}
                onChange={(e) => handleChange('kepsekNama', e.target.value)}
                className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-bold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#2C2A28] mb-1">NIP Kepala Sekolah</label>
                <input
                  type="text"
                  disabled={!isKepsek}
                  value={form.kepsekNip}
                  onChange={(e) => handleChange('kepsekNip', e.target.value)}
                  className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#2C2A28] mb-1">Pangkat / Golongan</label>
                <input
                  type="text"
                  disabled={!isKepsek}
                  value={form.kepsekPangkat || ''}
                  onChange={(e) => handleChange('kepsekPangkat', e.target.value)}
                  className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#2C2A28] mb-1">Nama Bendahara BOSP</label>
              <input
                type="text"
                disabled={!isKepsek}
                value={form.bendaharaNama}
                onChange={(e) => handleChange('bendaharaNama', e.target.value)}
                className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-bold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2C2A28] mb-1">NIP Bendahara</label>
              <input
                type="text"
                disabled={!isKepsek}
                value={form.bendaharaNip}
                onChange={(e) => handleChange('bendaharaNip', e.target.value)}
                className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2C2A28] mb-1">Nama Ketua Komite Sekolah</label>
              <input
                type="text"
                disabled={!isKepsek}
                value={form.komiteNama}
                onChange={(e) => handleChange('komiteNama', e.target.value)}
                className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-bold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="bg-white p-6 md:p-7 rounded-[28px] border border-[#E0DACE] shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-serif font-bold text-[#2C2A28] text-sm border-b border-[#E0DACE] pb-2.5">
              <Landmark className="w-4 h-4 text-[#5A5A40]" />
              <span>Pagu Anggaran & Penerimaan BOSP</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#2C2A28] mb-1">Tahun Anggaran</label>
                <input
                  type="text"
                  disabled={!isKepsek}
                  value={form.tahunAnggaran}
                  onChange={(e) => handleChange('tahunAnggaran', e.target.value)}
                  className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-bold font-mono text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#2C2A28] mb-1">Total Pagu BOSP (Rp)</label>
                <input
                  type="number"
                  disabled={!isKepsek}
                  value={form.totalPenerimaan}
                  onChange={(e) => handleChange('totalPenerimaan', parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-bold font-mono text-[#5A5A40] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40] disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
