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
  ChevronRight
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import { SchoolProfile, UserAccount, UserRole } from '../types';

interface LoginViewProps {
  school: SchoolProfile;
  users: UserAccount[];
  onLogin: (user: UserAccount) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ school, users, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'role' | 'manual'>('role');

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
      if (activeUser.password !== password.trim()) {
        setErrorMessage(
          `Kata sandi salah untuk ${selectedRole === 'KEPSEK' ? 'Kepala Sekolah' : 'Bendahara'}. Akses ditolak!`
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
          u.password === manualPassword.trim()
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
    </div>
  );
};
