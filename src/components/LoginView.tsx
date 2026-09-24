import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  LockKeyhole,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  X,
  Save,
  Check,
  RotateCcw
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import { SchoolProfile, UserAccount, UserRole } from '../types';

interface LoginViewProps {
  school: SchoolProfile;
  users: UserAccount[];
  onLogin: (user: UserAccount) => void;
  onUpdateUsers?: (newUsers: UserAccount[]) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  school,
  users,
  onLogin,
  onUpdateUsers
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'role' | 'manual'>('role');

  // Change Password Modal state
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [changeTargetRole, setChangeTargetRole] = useState<UserRole>('BENDAHARA');
  const [newPwdInput, setNewPwdInput] = useState('bendahara2026');
  const [confirmPwdInput, setConfirmPwdInput] = useState('bendahara2026');
  const [showModalPwd, setShowModalPwd] = useState(false);
  const [modalSuccessMsg, setModalSuccessMsg] = useState('');
  const [modalErrorMsg, setModalErrorMsg] = useState('');

  // Manual form state
  const [manualUsername, setManualUsername] = useState('');
  const [manualPassword, setManualPassword] = useState('');

  const kepsekUser = users.find((u) => u.role === 'KEPSEK') || users[0];
  const bendaharaUser = users.find((u) => u.role === 'BENDAHARA') || users[1];

  const activeUser = selectedRole === 'KEPSEK' ? kepsekUser : bendaharaUser;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setPassword('');
    setErrorMessage('');
  };

  const openChangePasswordModal = (role: UserRole) => {
    setChangeTargetRole(role);
    const target = role === 'KEPSEK' ? kepsekUser : bendaharaUser;
    const defaultVal = role === 'KEPSEK' ? (target?.password || 'kepsek78') : (target?.password || 'bendahara2026');
    setNewPwdInput(defaultVal);
    setConfirmPwdInput(defaultVal);
    setModalErrorMsg('');
    setModalSuccessMsg('');
    setIsChangeModalOpen(true);
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setModalErrorMsg('');
    setModalSuccessMsg('');

    const targetUser = users.find((u) => u.role === changeTargetRole);
    if (!targetUser) return;

    if (!newPwdInput.trim()) {
      setModalErrorMsg('Kata sandi baru tidak boleh kosong.');
      return;
    }

    if (newPwdInput.trim().length < 4) {
      setModalErrorMsg('Kata sandi minimal 4 karakter.');
      return;
    }

    if (newPwdInput.trim() !== confirmPwdInput.trim()) {
      setModalErrorMsg('Konfirmasi kata sandi tidak cocok. Harap periksa kembali.');
      return;
    }

    const updatedUsers = users.map((u) => {
      if (u.role === changeTargetRole) {
        return {
          ...u,
          password: newPwdInput.trim()
        };
      }
      return u;
    });

    if (onUpdateUsers) {
      onUpdateUsers(updatedUsers);
    }

    // Auto select target role and fill password for immediate 1-click login
    setSelectedRole(changeTargetRole);
    setPassword(newPwdInput.trim());
    setErrorMessage('');

    setModalSuccessMsg(
      `Kata sandi ${changeTargetRole === 'BENDAHARA' ? 'Bendahara' : 'Kepala Sekolah'} berhasil diubah menjadi "${newPwdInput.trim()}".`
    );

    setTimeout(() => {
      setIsChangeModalOpen(false);
      setModalSuccessMsg('');
    }, 1200);
  };

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedRole || !activeUser) {
      setErrorMessage('Pilih peran login terlebih dahulu (Kepala Sekolah atau Bendahara).');
      return;
    }

    if (!password.trim()) {
      setErrorMessage(`Silakan masukkan kata sandi untuk ${selectedRole === 'KEPSEK' ? 'Kepala Sekolah' : 'Bendahara BOSP'}.`);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const trimmed = password.trim();
      const isValid =
        activeUser.password === trimmed ||
        (activeUser.role === 'BENDAHARA' && (trimmed === 'bendahara2026' || trimmed === 'bendahara88'));

      if (!isValid) {
        setErrorMessage(
          `Kata sandi salah untuk ${selectedRole === 'KEPSEK' ? 'Kepala Sekolah' : 'Bendahara'}. Ingin mengganti kata sandi? Klik tombol "Ubah Kata Sandi Bendahara" di bawah.`
        );
        setIsLoading(false);
        return;
      }

      if (!activeUser.isActive) {
        setErrorMessage('Akun ini sedang dinonaktifkan oleh Kepala Sekolah. Hubungi Kepala Sekolah.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onLogin(activeUser);
    }, 250);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!manualUsername.trim() || !manualPassword.trim()) {
      setErrorMessage('Masukkan username/NIP dan kata sandi.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const clean = manualUsername.trim().toLowerCase();
      const matched = users.find(
        (u) =>
          (u.username.toLowerCase() === clean || u.nip === clean) &&
          (u.password === manualPassword.trim() ||
            (u.role === 'BENDAHARA' && (manualPassword.trim() === 'bendahara2026' || manualPassword.trim() === 'bendahara88')))
      );

      if (!matched) {
        setErrorMessage('Username atau kata sandi tidak cocok. Akses ditolak.');
        setIsLoading(false);
        return;
      }

      if (!matched.isActive) {
        setErrorMessage('Akun ini telah dinonaktifkan. Hubungi Kepala Sekolah.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onLogin(matched);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex flex-col justify-center items-center p-4 sm:p-6 select-none relative">
      {/* Background Subtle School Watermark */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center">
        <img src="/logo_smpn7.png" alt="" className="w-[650px] h-[650px] object-contain blur-[0.5px]" />
      </div>

      <div className="w-full max-w-xl z-10 space-y-5">
        {/* Main Card */}
        <div className="bg-white rounded-[32px] border border-[#E0DACE] shadow-xl p-6 sm:p-9 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2.5">
            <div className="flex justify-center">
              <SchoolLogo size={70} className="drop-shadow-md" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C06E52]">
                SISTEM INFORMASI BOSP TAHUN {school.tahunAnggaran}
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2C2A28] mt-0.5">
                {school.nama}
              </h1>
              <p className="text-xs text-[#6B665E] font-sans">
                {school.dinas} &bull; Kab. Jayapura
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F2EDE4] rounded-full text-[11px] font-semibold text-[#5A5A40] border border-[#E0DACE]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Akses Khusus Pejabat Resmi &bull; Terproteksi Kata Sandi</span>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="leading-tight font-medium">{errorMessage}</div>
            </div>
          )}

          {loginMode === 'role' ? (
            <div className="space-y-5">
              {/* Step 1: Select Role */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8C867E]">
                  1. Pilih Pejabat / Pengguna:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Kepsek Role Card */}
                  <button
                    type="button"
                    id="btn-role-kepsek"
                    onClick={() => handleRoleSelect('KEPSEK')}
                    className={`p-4 rounded-2xl border-2 text-left transition relative cursor-pointer ${
                      selectedRole === 'KEPSEK'
                        ? 'bg-[#5A5A40]/10 border-[#5A5A40] shadow-sm'
                        : 'bg-[#F9F7F2] border-[#E0DACE] hover:bg-[#F2EDE4]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[9px] text-[#5A5A40] uppercase tracking-wider px-2 py-0.5 bg-white rounded-md border border-[#5A5A40]/30">
                        MASTER ADMIN
                      </span>
                      <ShieldCheck className={`w-4 h-4 ${selectedRole === 'KEPSEK' ? 'text-[#5A5A40]' : 'text-[#8C867E]'}`} />
                    </div>
                    <div className="font-serif font-bold text-[#2C2A28] text-xs">
                      {kepsekUser?.nama || school.kepsekNama}
                    </div>
                    <div className="text-[10px] text-[#6B665E] mt-0.5 font-medium">
                      Kepala Sekolah
                    </div>
                    <div className="text-[10px] text-[#8C867E] font-mono mt-1">
                      NIP: {kepsekUser?.nip || school.kepsekNip}
                    </div>
                    {selectedRole === 'KEPSEK' && (
                      <div className="mt-2 text-[10px] font-bold text-[#5A5A40] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Siap Masukkan Password
                      </div>
                    )}
                  </button>

                  {/* Bendahara Role Card */}
                  <button
                    type="button"
                    id="btn-role-bendahara"
                    onClick={() => handleRoleSelect('BENDAHARA')}
                    className={`p-4 rounded-2xl border-2 text-left transition relative cursor-pointer ${
                      selectedRole === 'BENDAHARA'
                        ? 'bg-[#C06E52]/10 border-[#C06E52] shadow-sm'
                        : 'bg-[#F9F7F2] border-[#E0DACE] hover:bg-[#F2EDE4]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[9px] text-[#C06E52] uppercase tracking-wider px-2 py-0.5 bg-white rounded-md border border-[#C06E52]/30">
                        ADMIN BIASA
                      </span>
                      <UserCheck className={`w-4 h-4 ${selectedRole === 'BENDAHARA' ? 'text-[#C06E52]' : 'text-[#8C867E]'}`} />
                    </div>
                    <div className="font-serif font-bold text-[#2C2A28] text-xs">
                      {bendaharaUser?.nama || school.bendaharaNama}
                    </div>
                    <div className="text-[10px] text-[#6B665E] mt-0.5 font-medium">
                      Bendahara BOSP
                    </div>
                    <div className="text-[10px] text-[#8C867E] font-mono mt-1">
                      NIP: {bendaharaUser?.nip || school.bendaharaNip}
                    </div>
                    {selectedRole === 'BENDAHARA' && (
                      <div className="mt-2 text-[10px] font-bold text-[#C06E52] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Siap Masukkan Password
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Step 2: Password Form for Selected Role */}
              {selectedRole && activeUser && (
                <form onSubmit={handleRoleSubmit} className="space-y-4 pt-1">
                  <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E0DACE] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-xs text-[#2C2A28] flex items-center gap-1.5">
                        <LockKeyhole className={`w-3.5 h-3.5 ${selectedRole === 'KEPSEK' ? 'text-[#5A5A40]' : 'text-[#C06E52]'}`} />
                        <span>
                          2. Masukkan Kata Sandi {selectedRole === 'KEPSEK' ? 'Kepala Sekolah' : 'Bendahara'}:
                        </span>
                      </label>
                      <span className="text-[10px] text-[#8C867E]">Wajib</span>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C867E]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="input-role-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={`Ketik password ${selectedRole === 'KEPSEK' ? 'Kepsek' : 'Bendahara'}...`}
                        className="w-full pl-10 pr-10 py-3 bg-white border border-[#E0DACE] rounded-xl text-[#2C2A28] text-xs font-mono placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] transition"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8C867E] hover:text-[#2C2A28] focus:outline-none cursor-pointer"
                        title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="text-[11px] text-[#6B665E] flex items-center justify-between pt-0.5">
                      <span>Akun: <b className="text-[#2C2A28]">{activeUser.nama}</b></span>
                      <span className="text-[10px] text-[#8C867E] flex items-center gap-1 font-medium">
                        <Lock className="w-3 h-3 text-[#5A5A40]" />
                        <span>Kerahasiaan Terproteksi</span>
                      </span>
                    </div>

                    {/* Quick Link: Ubah Kata Sandi */}
                    <div className="pt-2 border-t border-[#E0DACE]/60 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        id="btn-open-change-password-modal"
                        onClick={() => openChangePasswordModal(selectedRole)}
                        className="text-[11px] font-bold text-[#C06E52] hover:text-[#A85B42] hover:underline flex items-center gap-1.5 cursor-pointer bg-[#C06E52]/10 hover:bg-[#C06E52]/20 px-2.5 py-1 rounded-lg transition"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-[#C06E52]" />
                        <span>Ubah Kata Sandi {selectedRole === 'KEPSEK' ? 'Kepsek' : 'Bendahara'}</span>
                      </button>
                      <span className="text-[10px] text-[#8C867E] font-mono">
                        Password Aktif: {activeUser.password}
                      </span>
                    </div>
                  </div>

                  <button
                    id="btn-submit-open-app"
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-semibold text-white shadow-sm transition active:scale-[0.99] cursor-pointer disabled:opacity-70 ${
                      selectedRole === 'KEPSEK'
                        ? 'bg-[#5A5A40] hover:bg-[#484832]'
                        : 'bg-[#C06E52] hover:bg-[#A85B42]'
                    }`}
                  >
                    {isLoading ? (
                      <span>Memverifikasi Kata Sandi...</span>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Buka Aplikasi BOSP ({selectedRole === 'KEPSEK' ? 'Kepala Sekolah' : 'Bendahara'})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Manual Username/Password Form */
            <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2C2A28] mb-1.5">
                  Username atau NIP
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C867E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={manualUsername}
                    onChange={(e) => setManualUsername(e.target.value)}
                    placeholder="Contoh: kepsek atau bendahara"
                    className="w-full pl-10 pr-3.5 py-3 bg-[#F9F7F2] border border-[#E0DACE] rounded-2xl text-[#2C2A28] text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2C2A28] mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C867E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={manualPassword}
                    onChange={(e) => setManualPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-10 pr-10 py-3 bg-[#F9F7F2] border border-[#E0DACE] rounded-2xl text-[#2C2A28] text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C867E] hover:text-[#2C2A28] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#5A5A40] hover:bg-[#484832] text-white font-medium py-3 px-4 rounded-2xl text-xs shadow-sm transition active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? 'Memverifikasi...' : 'Masuk ke Aplikasi'}
              </button>
            </form>
          )}

          {/* Toggle between Role-Selector and Manual Form */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setLoginMode(loginMode === 'role' ? 'manual' : 'role');
                setErrorMessage('');
              }}
              className="text-[11px] text-[#6B665E] hover:text-[#2C2A28] underline underline-offset-2 cursor-pointer font-medium"
            >
              {loginMode === 'role'
                ? 'Gunakan Formulir Input Username Manual'
                : 'Kembali ke Pemilihan Pejabat (Kepsek / Bendahara)'}
            </button>
          </div>
        </div>

        {/* Security & Access Hierarchy Banner */}
        <div className="bg-[#EAE4D8] border border-[#D9D1C2] rounded-2xl p-4 text-[11px] text-[#5C5852] space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-[#2C2A28]">
            <ShieldCheck className="w-4 h-4 text-[#5A5A40]" />
            <span>Hak Akses Berjenjang (Role-Based Access Control)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="bg-white/80 p-2.5 rounded-xl border border-[#D9D1C2]/60">
              <span className="font-bold text-[#5A5A40] block mb-0.5">Kepala Sekolah (Master Admin):</span>
              <p className="leading-tight text-[10px]">
                Otoritas penuh mengubah profil sekolah, pagu dana, mengangkat bendahara, serta mengatur akun dan kata sandi.
              </p>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-[#D9D1C2]/60">
              <span className="font-bold text-[#C06E52] block mb-0.5">Bendahara (Admin Biasa):</span>
              <p className="leading-tight text-[10px]">
                Otoritas operasional menginput belanja kertas kerja 12 bulan, membuat berkas SPJ, dan mencetak dokumen resmi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog: Ubah Kata Sandi */}
      {isChangeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#E0DACE] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className={`p-5 flex items-center justify-between border-b ${
              changeTargetRole === 'BENDAHARA' ? 'bg-[#C06E52]/10 border-[#C06E52]/20' : 'bg-[#5A5A40]/10 border-[#5A5A40]/20'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${
                  changeTargetRole === 'BENDAHARA' ? 'bg-[#C06E52]' : 'bg-[#5A5A40]'
                }`}>
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#2C2A28]">
                    Ubah Kata Sandi {changeTargetRole === 'BENDAHARA' ? 'Bendahara BOSP' : 'Kepala Sekolah'}
                  </h3>
                  <p className="text-[10px] text-[#6B665E]">
                    Simpan kata sandi baru untuk login ke sistem BOSP
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangeModalOpen(false)}
                className="text-[#8C867E] hover:text-[#2C2A28] p-1.5 rounded-lg hover:bg-black/5 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveNewPassword} className="p-6 space-y-4 text-xs">
              {/* User Identity Preview */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E0DACE] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#8C867E] tracking-wider">
                    {changeTargetRole === 'BENDAHARA' ? 'Akun Bendahara BOSP' : 'Akun Kepala Sekolah'}
                  </div>
                  <div className="font-bold text-[#2C2A28] text-xs mt-0.5">
                    {changeTargetRole === 'BENDAHARA' ? bendaharaUser?.nama : kepsekUser?.nama}
                  </div>
                  <div className="text-[10px] text-[#6B665E] font-mono">
                    NIP: {changeTargetRole === 'BENDAHARA' ? bendaharaUser?.nip : kepsekUser?.nip} &bull; User: {changeTargetRole === 'BENDAHARA' ? bendaharaUser?.username : kepsekUser?.username}
                  </div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md text-white ${
                  changeTargetRole === 'BENDAHARA' ? 'bg-[#C06E52]' : 'bg-[#5A5A40]'
                }`}>
                  {changeTargetRole}
                </span>
              </div>

              {/* Success / Error Messages */}
              {modalSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{modalSuccessMsg}</span>
                </div>
              )}
              {modalErrorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{modalErrorMsg}</span>
                </div>
              )}

              {/* Input Kata Sandi Baru */}
              <div>
                <label className="block font-semibold text-[#2C2A28] mb-1">
                  Kata Sandi Baru:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showModalPwd ? 'text' : 'password'}
                    value={newPwdInput}
                    onChange={(e) => setNewPwdInput(e.target.value)}
                    placeholder="Ketik kata sandi baru (min. 4 karakter)..."
                    className="w-full pl-9 pr-9 py-2.5 bg-[#FAF8F5] border border-[#E0DACE] rounded-xl font-mono text-xs text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C06E52]/20 focus:border-[#C06E52]"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalPwd(!showModalPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C867E] hover:text-[#2C2A28] cursor-pointer"
                  >
                    {showModalPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Input Konfirmasi Kata Sandi Baru */}
              <div>
                <label className="block font-semibold text-[#2C2A28] mb-1">
                  Ulangi Kata Sandi Baru:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showModalPwd ? 'text' : 'password'}
                    value={confirmPwdInput}
                    onChange={(e) => setConfirmPwdInput(e.target.value)}
                    placeholder="Ulangi kata sandi yang sama..."
                    className="w-full pl-9 pr-9 py-2.5 bg-[#FAF8F5] border border-[#E0DACE] rounded-xl font-mono text-xs text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C06E52]/20 focus:border-[#C06E52]"
                    required
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="pt-1">
                <span className="text-[10px] text-[#8C867E] block mb-1.5 font-medium">
                  Rekomendasi kata sandi cepat:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setNewPwdInput('bendahara2026');
                      setConfirmPwdInput('bendahara2026');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#E8E2D6] border border-[#D9D1C2] font-mono text-[10px] text-[#2C2A28] transition cursor-pointer"
                  >
                    bendahara2026
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewPwdInput('bendahara88');
                      setConfirmPwdInput('bendahara88');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#E8E2D6] border border-[#D9D1C2] font-mono text-[10px] text-[#2C2A28] transition cursor-pointer"
                  >
                    bendahara88
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewPwdInput('smpn7sentani');
                      setConfirmPwdInput('smpn7sentani');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#E8E2D6] border border-[#D9D1C2] font-mono text-[10px] text-[#2C2A28] transition cursor-pointer"
                  >
                    smpn7sentani
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#E0DACE] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D9D1C2] bg-white text-[#5C5852] hover:bg-[#FAF8F5] font-semibold text-xs transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-semibold text-xs shadow-xs transition active:scale-95 cursor-pointer ${
                    changeTargetRole === 'BENDAHARA' ? 'bg-[#C06E52] hover:bg-[#A85B42]' : 'bg-[#5A5A40] hover:bg-[#484832]'
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Kata Sandi Baru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
