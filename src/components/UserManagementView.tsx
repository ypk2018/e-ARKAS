import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  KeyRound,
  Lock,
  User,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  EyeOff,
  Users,
  BadgeCheck,
  FileCheck,
  Check,
  X
} from 'lucide-react';
import { UserAccount, SchoolProfile } from '../types';
import { SchoolLogo } from './SchoolLogo';

interface UserManagementViewProps {
  currentUser: UserAccount;
  users: UserAccount[];
  school: SchoolProfile;
  onUpdateUsers: (newUsers: UserAccount[]) => void;
  onUpdateSchool: (newProfile: SchoolProfile) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  currentUser,
  users,
  school,
  onUpdateUsers,
  onUpdateSchool
}) => {
  const isKepsek = currentUser.role === 'KEPSEK';

  // Find users
  const kepsekUser = users.find((u) => u.role === 'KEPSEK') || users[0];
  const bendaharaUser = users.find((u) => u.role === 'BENDAHARA') || users[1];

  // Forms state
  const [bendaharaForm, setBendaharaForm] = useState({
    username: bendaharaUser?.username || 'bendahara',
    password: bendaharaUser?.password || 'bendahara88',
    nama: bendaharaUser?.nama || school.bendaharaNama,
    nip: bendaharaUser?.nip || school.bendaharaNip,
    pangkat: bendaharaUser?.pangkat || 'Penata Muda / III a',
    jabatan: bendaharaUser?.jabatan || 'Bendahara BOSP',
    email: bendaharaUser?.email || 'raheldone@gmail.com',
    phone: bendaharaUser?.phone || '081398765432',
    isActive: bendaharaUser ? bendaharaUser.isActive : true
  });

  const [kepsekForm, setKepsekForm] = useState({
    username: kepsekUser?.username || 'kepsek',
    password: kepsekUser?.password || 'kepsek78',
    nama: kepsekUser?.nama || school.kepsekNama,
    nip: kepsekUser?.nip || school.kepsekNip,
    pangkat: kepsekUser?.pangkat || school.kepsekPangkat || 'Pembina / IV a',
    email: kepsekUser?.email || 'smpn7sentani@gmail.com',
    phone: kepsekUser?.phone || '081234567890'
  });

  const [showBendaharaPwd, setShowBendaharaPwd] = useState(false);
  const [showKepsekPwd, setShowKepsekPwd] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Save Bendahara Account (Only Kepsek can execute)
  const handleSaveBendahara = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isKepsek) {
      alert('Akses Ditolak: Hanya Kepala Sekolah yang berwenang mengatur akun Bendahara.');
      return;
    }

    const updatedUsers = users.map((u) => {
      if (u.role === 'BENDAHARA') {
        return {
          ...u,
          username: bendaharaForm.username.trim(),
          password: bendaharaForm.password.trim(),
          nama: bendaharaForm.nama.trim(),
          nip: bendaharaForm.nip.trim(),
          pangkat: bendaharaForm.pangkat.trim(),
          jabatan: bendaharaForm.jabatan.trim(),
          email: bendaharaForm.email.trim(),
          phone: bendaharaForm.phone.trim(),
          isActive: bendaharaForm.isActive
        };
      }
      return u;
    });

    onUpdateUsers(updatedUsers);

    // Also synchronize school profile bendahara data so printouts automatically match
    onUpdateSchool({
      ...school,
      bendaharaNama: bendaharaForm.nama.trim(),
      bendaharaNip: bendaharaForm.nip.trim()
    });

    setSuccessMsg('Akun dan penugasan Bendahara BOSP berhasil diperbarui dan disinkronkan ke seluruh dokumen!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Handle Save Kepsek Account
  const handleSaveKepsek = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isKepsek) {
      alert('Akses Ditolak.');
      return;
    }

    const updatedUsers = users.map((u) => {
      if (u.role === 'KEPSEK') {
        return {
          ...u,
          username: kepsekForm.username.trim(),
          password: kepsekForm.password.trim(),
          nama: kepsekForm.nama.trim(),
          nip: kepsekForm.nip.trim(),
          pangkat: kepsekForm.pangkat.trim(),
          email: kepsekForm.email.trim(),
          phone: kepsekForm.phone.trim()
        };
      }
      return u;
    });

    onUpdateUsers(updatedUsers);

    // Also synchronize school profile kepsek data
    onUpdateSchool({
      ...school,
      kepsekNama: kepsekForm.nama.trim(),
      kepsekNip: kepsekForm.nip.trim(),
      kepsekPangkat: kepsekForm.pangkat.trim()
    });

    setSuccessMsg('Akun Kepala Sekolah dan kredensial login berhasil diperbarui!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="bg-white p-6 md:p-7 rounded-[28px] border border-[#E0DACE] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SchoolLogo size={56} className="shrink-0 drop-shadow-md" />
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C867E] flex items-center gap-2">
              <span>MANAJEMEN AKUN & OTORITAS PENGGUNA</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                isKepsek ? 'bg-[#5A5A40] text-white' : 'bg-[#C06E52] text-white'
              }`}>
                {currentUser.role === 'KEPSEK' ? 'KEPALA SEKOLAH (ADMIN UTAMA)' : 'BENDAHARA (OPERATOR)'}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2C2A28] mt-0.5">
              Pengaturan Hak Akses & Akun Pejabat BOSP
            </h2>
            <p className="text-xs text-[#6B665E] mt-0.5">
              {isKepsek
                ? 'Sebagai Kepala Sekolah, Anda memiliki wewenang eksklusif untuk mengatur akun, kata sandi, dan menunjuk Bendahara BOSP.'
                : 'Anda masuk sebagai Bendahara BOSP. Pengaturan akun pengguna dan pengangkatan bendahara diatur oleh Kepala Sekolah.'}
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {!isKepsek ? (
        /* Bendahara Restricted View Notice */
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-6 text-xs text-amber-900 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Otoritas Pengaturan Khusus Kepala Sekolah</span>
            </div>
            <p className="leading-relaxed">
              Sesuai dengan ketentuan tata kelola aplikasi BOSP SMP Negeri 7 Sentani, hanya <b>Kepala Sekolah ({school.kepsekNama})</b> yang memiliki wewenang untuk:
            </p>
            <ul className="list-disc list-inside space-y-1 text-amber-800 ml-2">
              <li>Menunjuk, mengganti, atau menonaktifkan akun <b>Bendahara BOSP</b>.</li>
              <li>Mengubah username dan kata sandi login Bendahara maupun Kepala Sekolah.</li>
              <li>Memperbarui profil pejabat penandatangan utama satuan pendidikan.</li>
            </ul>
            <div className="pt-2 text-[11px] text-amber-700">
              Jika terdapat perubahan data bendahara atau pergantian kata sandi, silakan laporkan langsung kepada Kepala Sekolah.
            </div>
          </div>

          {/* Current Bendahara Profile Preview */}
          <div className="bg-white p-6 rounded-[28px] border border-[#E0DACE] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E0DACE] pb-3">
              <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#2C2A28]">
                <UserCheck className="w-4 h-4 text-[#C06E52]" />
                <span>Data Akun Anda (Bendahara Aktif)</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-[10px] flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" /> Akun Aktif
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#8C867E] block text-[11px]">Nama Bendahara:</span>
                <span className="font-bold text-[#2C2A28] text-sm">{currentUser.nama}</span>
              </div>
              <div>
                <span className="text-[#8C867E] block text-[11px]">NIP:</span>
                <span className="font-mono font-bold text-[#2C2A28]">{currentUser.nip}</span>
              </div>
              <div>
                <span className="text-[#8C867E] block text-[11px]">Username Login:</span>
                <span className="font-mono text-[#2C2A28] bg-[#F2EDE4] px-2 py-0.5 rounded-md font-bold">{currentUser.username}</span>
              </div>
              <div>
                <span className="text-[#8C867E] block text-[11px]">Jabatan:</span>
                <span className="text-[#2C2A28]">{currentUser.jabatan}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Administrative Control for Kepala Sekolah */
        <div className="space-y-6">
          {/* Otoritas Info Badge */}
          <div className="bg-[#5A5A40]/10 border border-[#5A5A40]/30 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs text-[#2C2A28]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#5A5A40] shrink-0" />
              <div>
                <div className="font-bold font-serif text-sm">Hak Akses Super Admin: Kepala Sekolah</div>
                <div className="text-[#5C5852] text-[11px]">
                  Anda memiliki otoritas penuh untuk mengatur akun Bendahara BOSP, mengedit password, dan mengontrol data identitas sekolah.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section 1: Atur Akun & Penugasan Bendahara */}
            <div className="bg-white p-6 md:p-7 rounded-[28px] border-2 border-[#C06E52]/40 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#E0DACE] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#C06E52]/10 flex items-center justify-center text-[#C06E52]">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#2C2A28]">
                      Atur Akun & Pejabat Bendahara BOSP
                    </h3>
                    <p className="text-[10px] text-[#8C867E]">
                      Kepala Sekolah dapat mengganti atau memperbarui data bendahara
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#C06E52] text-white rounded-full">
                  BENDAHARA
                </span>
              </div>

              <form onSubmit={handleSaveBendahara} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-[#2C2A28] mb-1">
                    Nama Lengkap Bendahara BOSP
                  </label>
                  <input
                    type="text"
                    value={bendaharaForm.nama}
                    onChange={(e) => setBendaharaForm({ ...bendaharaForm, nama: e.target.value })}
                    className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-bold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C06E52]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1">
                      NIP Bendahara
                    </label>
                    <input
                      type="text"
                      value={bendaharaForm.nip}
                      onChange={(e) => setBendaharaForm({ ...bendaharaForm, nip: e.target.value })}
                      className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C06E52]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1">
                      Pangkat / Golongan
                    </label>
                    <input
                      type="text"
                      value={bendaharaForm.pangkat}
                      onChange={(e) => setBendaharaForm({ ...bendaharaForm, pangkat: e.target.value })}
                      className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C06E52]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1 flex items-center justify-between">
                      <span>Username Login</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={bendaharaForm.username}
                        onChange={(e) => setBendaharaForm({ ...bendaharaForm, username: e.target.value })}
                        className="w-full pl-8 pr-2.5 py-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono font-bold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C06E52]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1 flex items-center justify-between">
                      <span>Password Login</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showBendaharaPwd ? 'text' : 'password'}
                        value={bendaharaForm.password}
                        onChange={(e) => setBendaharaForm({ ...bendaharaForm, password: e.target.value })}
                        className="w-full pl-8 pr-8 py-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C06E52]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowBendaharaPwd(!showBendaharaPwd)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C867E] hover:text-[#2C2A28] cursor-pointer"
                      >
                        {showBendaharaPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1">
                      No. WhatsApp / HP
                    </label>
                    <input
                      type="text"
                      value={bendaharaForm.phone}
                      onChange={(e) => setBendaharaForm({ ...bendaharaForm, phone: e.target.value })}
                      className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C06E52]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1">
                      Status Akun Bendahara
                    </label>
                    <select
                      value={bendaharaForm.isActive ? '1' : '0'}
                      onChange={(e) => setBendaharaForm({ ...bendaharaForm, isActive: e.target.value === '1' })}
                      className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-semibold text-[#2C2A28] focus:bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="1">Aktif (Diberikan Hak Masuk)</option>
                      <option value="0">Nonaktif (Akses Masuk Dikunci)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#C06E52] hover:bg-[#A95B42] text-white font-medium py-2.5 px-4 rounded-xl text-xs shadow-xs transition active:scale-98 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan & Terapkan Akun Bendahara</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Section 2: Atur Akun Kepala Sekolah Sendiri */}
            <div className="bg-white p-6 md:p-7 rounded-[28px] border-2 border-[#5A5A40]/40 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#E0DACE] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#5A5A40]/10 flex items-center justify-center text-[#5A5A40]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#2C2A28]">
                      Akun Kepala Sekolah (Penanggung Jawab)
                    </h3>
                    <p className="text-[10px] text-[#8C867E]">
                      Kredensial dan profil login Kepala Sekolah
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#5A5A40] text-white rounded-full">
                  KEPSEK
                </span>
              </div>

              <form onSubmit={handleSaveKepsek} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-[#2C2A28] mb-1">
                    Nama Lengkap Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={kepsekForm.nama}
                    onChange={(e) => setKepsekForm({ ...kepsekForm, nama: e.target.value })}
                    className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-bold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1">
                      NIP Kepala Sekolah
                    </label>
                    <input
                      type="text"
                      value={kepsekForm.nip}
                      onChange={(e) => setKepsekForm({ ...kepsekForm, nip: e.target.value })}
                      className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1">
                      Pangkat / Golongan
                    </label>
                    <input
                      type="text"
                      value={kepsekForm.pangkat}
                      onChange={(e) => setKepsekForm({ ...kepsekForm, pangkat: e.target.value })}
                      className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1">
                      Username Kepala Sekolah
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={kepsekForm.username}
                        onChange={(e) => setKepsekForm({ ...kepsekForm, username: e.target.value })}
                        className="w-full pl-8 pr-2.5 py-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono font-bold text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1">
                      Password Kepala Sekolah
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showKepsekPwd ? 'text' : 'password'}
                        value={kepsekForm.password}
                        onChange={(e) => setKepsekForm({ ...kepsekForm, password: e.target.value })}
                        className="w-full pl-8 pr-8 py-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl font-mono text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowKepsekPwd(!showKepsekPwd)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C867E] hover:text-[#2C2A28] cursor-pointer"
                      >
                        {showKepsekPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1">
                      Email Kedinasan
                    </label>
                    <input
                      type="email"
                      value={kepsekForm.email}
                      onChange={(e) => setKepsekForm({ ...kepsekForm, email: e.target.value })}
                      className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2C2A28] mb-1">
                      No. Kontak / HP
                    </label>
                    <input
                      type="text"
                      value={kepsekForm.phone}
                      onChange={(e) => setKepsekForm({ ...kepsekForm, phone: e.target.value })}
                      className="w-full p-2.5 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#5A5A40] hover:bg-[#484832] text-white font-medium py-2.5 px-4 rounded-xl text-xs shadow-xs transition active:scale-98 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Akun Kepala Sekolah</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Section 3: Matriks Hak Akses / Otoritas */}
          <div className="bg-white p-6 md:p-7 rounded-[28px] border border-[#E0DACE] shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-serif font-bold text-[#2C2A28] text-sm border-b border-[#E0DACE] pb-2.5">
              <BadgeCheck className="w-4 h-4 text-[#5A5A40]" />
              <span>Matriks Wewenang & Hak Akses Pengguna</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#F2EDE4] text-[#2C2A28] border-b border-[#E0DACE]">
                    <th className="p-3 font-bold rounded-l-xl">Fitur & Modul Aplikasi</th>
                    <th className="p-3 font-bold text-center w-36">Kepala Sekolah</th>
                    <th className="p-3 font-bold text-center w-36 rounded-r-xl">Bendahara BOSP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0DACE]">
                  <tr>
                    <td className="p-3 font-medium">Lihat Dashboard & Ringkasan Realisasi</td>
                    <td className="p-3 text-center text-emerald-700 font-bold"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-700 font-bold"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Input & Edit Kertas Kerja 12 Bulan (8 Standar)</td>
                    <td className="p-3 text-center text-emerald-700 font-bold"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-700 font-bold"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Buat & Cetak Dokumen SPJ (Kwitansi, Honor, Nota, BKK, SPTJ)</td>
                    <td className="p-3 text-center text-emerald-700 font-bold"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-700 font-bold"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Cetak & Ekspor Laporan PDF (Watermark & Kop Resmi)</td>
                    <td className="p-3 text-center text-emerald-700 font-bold"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-emerald-700 font-bold"><Check className="w-4 h-4 mx-auto" /></td>
                  </tr>
                  <tr className="bg-[#FAF9F6]">
                    <td className="p-3 font-medium">Ubah Profil Satuan Pendidikan & Pejabat Utama</td>
                    <td className="p-3 text-center text-emerald-700 font-bold"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-amber-700 font-semibold">Hanya Lihat</td>
                  </tr>
                  <tr className="bg-[#FDF6F0]">
                    <td className="p-3 font-bold text-[#8B4513]">Atur Akun Pengguna, Password & Angkat Bendahara</td>
                    <td className="p-3 text-center text-emerald-700 font-bold"><Check className="w-4 h-4 mx-auto" /></td>
                    <td className="p-3 text-center text-rose-600 font-bold"><X className="w-4 h-4 mx-auto" /> (Terkunci)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
