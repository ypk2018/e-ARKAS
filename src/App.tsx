import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { KertasKerjaView } from './components/KertasKerjaView';
import { TemaExplorerView } from './components/TemaExplorerView';
import { SpjView } from './components/SpjView';
import { RekapView } from './components/RekapView';
import { ArsipView } from './components/ArsipView';
import { IdentitasView } from './components/IdentitasView';
import { UserManagementView } from './components/UserManagementView';
import { LoginView } from './components/LoginView';
import { PrintModal } from './components/PrintModal';
import { ArkasPerubahanView } from './components/ArkasPerubahanView';
import { RekapPerubahanView } from './components/RekapPerubahanView';

import {
  SchoolProfile,
  MonthWorksheet,
  SpjDocument,
  SpjType,
  KertasKerjaItem,
  UserAccount,
  ArkasPerubahanMonthWorksheet,
  ArkasPerubahanItem,
  ActivityLog
} from './types';
import { DEFAULT_SCHOOL_PROFILE, MONTH_NAMES } from './data/schoolProfile';
import { INITIAL_KERTAS_KERJA_DATA } from './data/kertasKerjaData';
import { INITIAL_ARKAS_PERUBAHAN_DATA, initializePerubahanFromMurni } from './data/arkasPerubahanData';
import { INITIAL_USERS } from './data/defaultUsers';
import { generateNomorDokumen, todayISO, generateUid, formatRp } from './utils/formatters';
import { printArkasPerubahanWorksheet } from './utils/printDocument';

export function App() {
  // Local storage keys
  const LS_SCHOOL = 'sibos7_school_profile_v2';
  const LS_WORKSHEETS = 'sibos7_worksheets_v2';
  const LS_PERUBAHAN = 'sibos7_worksheets_perubahan_v2';
  const LS_DOCS = 'sibos7_documents_v2';
  const LS_USERS = 'sibos7_users_v2';
  const LS_LOGS = 'sibos7_logs_v2';
  const LS_CURRENT_USER = 'sibos7_current_user_v2';

  // State: User Accounts
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(LS_USERS);
    if (saved) {
      try {
        const parsed: UserAccount[] = JSON.parse(saved);
        // Ensure updated default passwords kepsek78 & bendahara88 and updated NIP are applied
        return parsed.map((u) => {
          if (u.role === 'KEPSEK') {
            return {
              ...u,
              password: (!u.password || u.password === 'kepsek77') ? 'kepsek78' : u.password
            };
          }
          if (u.role === 'BENDAHARA') {
            return {
              ...u,
              nip: (!u.nip || u.nip === '198812272024202136') ? '198812272024212036' : u.nip,
              password: (!u.password || u.password === 'bendahara77') ? 'bendahara88' : u.password
            };
          }
          return u;
        });
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS;
  });

  // State: Currently Logged In User - ALWAYS start as null so password is required every time the app opens/refreshes
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // State: Real-time Auto-save status feedback
  const [lastSavedTime, setLastSavedTime] = useState<string>('Baru saja');
  const [isAutoSaving, setIsAutoSaving] = useState<boolean>(false);

  // State: School Profile
  const [school, setSchool] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem(LS_SCHOOL);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.bendaharaNip || parsed.bendaharaNip === '198812272024202136') {
          parsed.bendaharaNip = '198812272024212036';
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SCHOOL_PROFILE;
  });

  // State: 12-Month Worksheets
  const [worksheets, setWorksheets] = useState<MonthWorksheet[]>(() => {
    const saved = localStorage.getItem(LS_WORKSHEETS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_KERTAS_KERJA_DATA;
  });

  // State: 12-Month Worksheets ARKAS PERUBAHAN
  const [perubahanWorksheets, setPerubahanWorksheets] = useState<ArkasPerubahanMonthWorksheet[]>(() => {
    const saved = localStorage.getItem(LS_PERUBAHAN);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ARKAS_PERUBAHAN_DATA;
  });

  // State: Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(LS_LOGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // State: SPJ Documents Archive
  const [documents, setDocuments] = useState<SpjDocument[]>(() => {
    const saved = localStorage.getItem(LS_DOCS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'init_doc_1',
        type: 'kwitansi',
        nomor: '001/KW/BOSP/SMPN7/I/2026',
        tanggal: '2026-01-15',
        terimaDari: 'Bendahara BOSP SMP Negeri 7 Sentani',
        penerima: 'Toko ATK Papuamas Sentani',
        penerimaNip: '',
        jabatanPenerima: 'Penyedia Barang',
        jumlah: 4768000,
        uraian: 'Pembayaran belanja alat tulis kantor, kertas HVS, spidol whiteboard, dan supplies administrasi semester genap 2026',
        triwulan: 'I',
        rekening: '5.1.02.01.01.0024',
        komponen: 'Standar 06 - Sarana dan Prasarana',
        lunas: true,
        materai: false,
        rangkap: true
      },
      {
        id: 'init_doc_2',
        type: 'daftar',
        nomor: '001/DP/BOSP/SMPN7/I/2026',
        tanggal: '2026-01-20',
        kegiatan: 'Pemberian Honorarium Guru & Tenaga Kependidikan Non ASN Bulan Januari 2026',
        judul: 'Honorarium GTT & PTT Bulan Januari 2026',
        triwulan: 'I',
        jumlah: 18000000,
        items: [
          { nama: 'Yohanes Tabuni, S.Pd', jabatan: 'Guru Honor IPA', honor: 3000000, pph: 0 },
          { nama: 'Maria Kmur, S.Pd', jabatan: 'Guru Honor Bahasa Inggris', honor: 3000000, pph: 0 },
          { nama: 'Daniel Wenda, S.Kom', jabatan: 'Operator Dapodik / TI', honor: 3000000, pph: 0 },
          { nama: 'Ester Wally', jabatan: 'Tenaga Administrasi', honor: 3000000, pph: 0 },
          { nama: 'Lukas Ohee', jabatan: 'Petugas Keamanan Sekolah', honor: 3000000, pph: 0 },
          { nama: 'Marta Done', jabatan: 'Petugas Kebersihan', honor: 3000000, pph: 0 },
        ]
      }
    ];
  });

  // UI state
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Draft document state for SPJ view
  const [draftDoc, setDraftDoc] = useState<SpjDocument>(() => ({
    id: generateUid(),
    type: 'kwitansi',
    nomor: generateNomorDokumen('kwitansi', todayISO(), [], school),
    tanggal: todayISO(),
    terimaDari: `Bendahara ${school.sumberDana} ${school.nama}`,
    penerima: '',
    jumlah: 1000000,
    uraian: '',
    triwulan: 'I',
    lunas: true,
    materai: false
  }));

  // Print modal state
  const [printModal, setPrintModal] = useState<{
    isOpen: boolean;
    mode: 'worksheet' | 'document';
    worksheet?: MonthWorksheet;
    document?: SpjDocument;
    monthIndex?: number;
  }>({
    isOpen: false,
    mode: 'worksheet'
  });

  // Save changes to LocalStorage and update auto-save timestamp
  useEffect(() => {
    localStorage.setItem(LS_USERS, JSON.stringify(users));
    triggerAutoSaveIndicator();
  }, [users]);

  useEffect(() => {
    localStorage.setItem(LS_SCHOOL, JSON.stringify(school));
    triggerAutoSaveIndicator();
  }, [school]);

  useEffect(() => {
    localStorage.setItem(LS_WORKSHEETS, JSON.stringify(worksheets));
    triggerAutoSaveIndicator();
  }, [worksheets]);

  useEffect(() => {
    localStorage.setItem(LS_PERUBAHAN, JSON.stringify(perubahanWorksheets));
    triggerAutoSaveIndicator();
  }, [perubahanWorksheets]);

  useEffect(() => {
    localStorage.setItem(LS_DOCS, JSON.stringify(documents));
    triggerAutoSaveIndicator();
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(LS_LOGS, JSON.stringify(activityLogs));
  }, [activityLogs]);

  const triggerAutoSaveIndicator = () => {
    setIsAutoSaving(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSavedTime(timeStr);
    const timer = setTimeout(() => {
      setIsAutoSaving(false);
    }, 800);
    return () => clearTimeout(timer);
  };

  // Real-time synchronization across browser tabs/windows (both Kepsek & Bendahara see updates live without refresh)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === LS_SCHOOL) {
          setSchool(JSON.parse(e.newValue));
        } else if (e.key === LS_WORKSHEETS) {
          setWorksheets(JSON.parse(e.newValue));
        } else if (e.key === LS_PERUBAHAN) {
          setPerubahanWorksheets(JSON.parse(e.newValue));
        } else if (e.key === LS_DOCS) {
          setDocuments(JSON.parse(e.newValue));
        } else if (e.key === LS_LOGS) {
          setActivityLogs(JSON.parse(e.newValue));
        } else if (e.key === LS_USERS) {
          setUsers(JSON.parse(e.newValue));
        }
        triggerAutoSaveIndicator();
      } catch (err) {
        console.error('Storage sync error:', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = (user: UserAccount) => {
    const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, lastLogin: new Date().toLocaleString() } : u));
    setUsers(updatedUsers);
    setCurrentUser(user);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
      setCurrentUser(null);
    }
  };

  const handleUpdateUsers = (newUsers: UserAccount[]) => {
    setUsers(newUsers);
    // If current logged-in user was updated, refresh state
    if (currentUser) {
      const refreshed = newUsers.find((u) => u.id === currentUser.id);
      if (refreshed) {
        setCurrentUser(refreshed);
      }
    }
  };

  // Tab switcher with draft init
  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    if (['kwitansi', 'daftar', 'nota', 'faktur', 'bkk', 'berita', 'sptj'].includes(tab)) {
      const type = tab as SpjType;
      setDraftDoc({
        id: generateUid(),
        type,
        nomor: generateNomorDokumen(type, todayISO(), documents, school),
        tanggal: todayISO(),
        terimaDari: `Bendahara ${school.sumberDana} ${school.nama}`,
        penerima: '',
        jumlah: 500000,
        uraian: '',
        triwulan: selectedMonth < 3 ? 'I' : selectedMonth < 6 ? 'II' : selectedMonth < 9 ? 'III' : 'IV',
        lunas: true,
        materai: false,
        items:
          type === 'daftar'
            ? [{ nama: 'Guru Honor 1', jabatan: 'Guru Mata Pelajaran', honor: 1500000, pph: 0 }]
            : type === 'nota' || type === 'faktur'
            ? [{ nama: 'Barang Perlengkapan Sekolah', qty: 1, satuan: 'paket', harga: 500000 }]
            : undefined
      });
    }
  };

  // 1-Click Create SPJ from Item in Kertas Kerja / Tema Explorer
  const handleCreateSpjFromItem = (item: KertasKerjaItem, monthIndex: number) => {
    const isHonor = item.uraian.toLowerCase().includes('honor') || item.uraian.toLowerCase().includes('gtt') || item.uraian.toLowerCase().includes('ptt');
    const type: SpjType = isHonor ? 'daftar' : 'kwitansi';

    const triwulan = monthIndex < 3 ? 'I' : monthIndex < 6 ? 'II' : monthIndex < 9 ? 'III' : 'IV';
    const num = generateNomorDokumen(type, todayISO(), documents, school);

    const doc: SpjDocument = {
      id: generateUid(),
      type,
      nomor: num,
      tanggal: `2026-${String(monthIndex + 1).padStart(2, '0')}-25`,
      terimaDari: `Bendahara ${school.sumberDana} ${school.nama}`,
      penerima: isHonor ? 'Daftar Terlampir' : `Penyedia / Pelaksana [${item.subtemaNama}]`,
      jabatanPenerima: isHonor ? 'Tenaga Pendidik / Kependidikan' : 'Penyedia Barang / Jasa',
      jumlah: item.jumlah,
      uraian: `Pembayaran belanja: ${item.uraian} (${item.volume} ${item.satuan}) untuk bulan ${MONTH_NAMES[monthIndex]} 2026`,
      triwulan,
      rekening: item.kodeRekening,
      komponen: `Standar ${item.temaId} - ${item.subtemaNama}`,
      lunas: true,
      materai: item.jumlah >= 5000000,
      items: isHonor
        ? [
            {
              nama: 'Penerima Honor 1',
              jabatan: 'Guru / Tenaga Kependidikan',
              honor: item.jumlah,
              pph: 0
            }
          ]
        : [
            {
              nama: item.uraian,
              qty: item.volume,
              satuan: item.satuan,
              harga: item.tarifHarga
            }
          ]
    };

    setDraftDoc(doc);
    setCurrentTab(type);
  };

  const handleSaveDocument = (doc: SpjDocument) => {
    setDocuments((prev) => {
      const idx = prev.findIndex((d) => d.id === doc.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = doc;
        return next;
      }
      return [doc, ...prev];
    });
    alert(`Dokumen ${doc.nomor} berhasil disimpan ke arsip!`);
    setCurrentTab('arsip');
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm('Hapus dokumen ini dari arsip SPJ?')) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleOpenDocument = (doc: SpjDocument) => {
    setDraftDoc(doc);
    setCurrentTab(doc.type);
  };

  const handlePrintDocument = (doc: SpjDocument) => {
    setPrintModal({
      isOpen: true,
      mode: 'document',
      document: doc
    });
  };

  const handlePrintWorksheet = (monthIndex: number) => {
    setPrintModal({
      isOpen: true,
      mode: 'worksheet',
      worksheet: worksheets[monthIndex],
      monthIndex
    });
  };

  const handleUpdateWorksheet = (updatedWs: MonthWorksheet) => {
    setWorksheets((prev) =>
      prev.map((ws) => (ws.bulanKey === updatedWs.bulanKey ? updatedWs : ws))
    );
  };

  const handleUpdatePerubahanWorksheet = (updatedWs: ArkasPerubahanMonthWorksheet) => {
    setPerubahanWorksheets((prev) =>
      prev.map((ws) => (ws.bulanIndex === updatedWs.bulanIndex ? updatedWs : ws))
    );
  };

  const handleResetPerubahanFromMurni = () => {
    const newPerub = initializePerubahanFromMurni(worksheets);
    setPerubahanWorksheets(newPerub);
    if (currentUser) {
      handleAddActivityLog({
        actorName: currentUser.nama,
        actorRole: currentUser.role,
        actionType: 'SYNC_PERUBAHAN',
        title: `${currentUser.role === 'KEPSEK' ? 'Kepala Sekolah' : 'Bendahara'} menyinkronkan ARKAS Perubahan dari ARKAS Murni`,
        description: 'Semua bulan pada ARKAS Perubahan dimuat ulang sesuai data mutakhir ARKAS Murni.',
        targetType: 'perubahan'
      });
    }
  };

  const handleCreateSpjFromPerubahanItem = (item: ArkasPerubahanItem, monthIndex: number) => {
    const isHonor = item.uraian.toLowerCase().includes('honor') || item.uraian.toLowerCase().includes('gtt') || item.uraian.toLowerCase().includes('ptt');
    const type: SpjType = isHonor ? 'daftar' : 'kwitansi';
    const triwulan = monthIndex < 3 ? 'I' : monthIndex < 6 ? 'II' : monthIndex < 9 ? 'III' : 'IV';
    const num = generateNomorDokumen(type, todayISO(), documents, school);

    const doc: SpjDocument = {
      id: generateUid(),
      type,
      nomor: num,
      tanggal: `2026-${String(monthIndex + 1).padStart(2, '0')}-25`,
      terimaDari: `Bendahara ${school.sumberDana} ${school.nama}`,
      penerima: item.penerimaDefault || (isHonor ? 'Daftar Terlampir' : `Penyedia / Pelaksana [${item.subtemaNama}]`),
      jabatanPenerima: item.jabatanDefault || (isHonor ? 'Tenaga Pendidik / Kependidikan' : 'Penyedia Barang / Jasa'),
      jumlah: item.jumlah,
      uraian: `Pembayaran belanja ARKAS Perubahan: ${item.uraian} (${item.volume} ${item.satuan}) untuk bulan ${MONTH_NAMES[monthIndex]} 2026`,
      triwulan,
      rekening: item.kodeRekening,
      komponen: `Standar ${item.temaId} - ${item.subtemaNama}`,
      lunas: true,
      materai: item.jumlah >= 5000000,
      rangkap: true,
      sourceKertasKerjaId: item.id,
      sourceArkasType: 'perubahan',
      items: isHonor
        ? [
            {
              nama: item.penerimaDefault || 'Penerima Honor 1',
              jabatan: item.jabatanDefault || 'Guru / Tenaga Kependidikan',
              honor: item.jumlah,
              pph: 0
            }
          ]
        : [
            {
              nama: item.uraian,
              qty: item.volume,
              satuan: item.satuan,
              harga: item.tarifHarga
            }
          ]
    };

    setDraftDoc(doc);
    setCurrentTab(type);
  };

  const handlePrintPerubahanWorksheet = (monthIndex: number) => {
    const ws = perubahanWorksheets[monthIndex];
    if (ws) {
      printArkasPerubahanWorksheet(ws, monthIndex, school);
    }
  };

  const handleAddActivityLog = (logData: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      id: generateUid(),
      timestamp: new Date().toISOString(),
      ...logData
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Restore an eliminated item in Perubahan back to Murni original values
  const handleRestorePerubahanItem = (item: ArkasPerubahanItem, monthIndex: number) => {
    setPerubahanWorksheets((prev) => {
      return prev.map((ws, idx) => {
        if (idx !== monthIndex) return ws;
        return {
          ...ws,
          items: ws.items.map((it) => {
            if (it.id !== item.id) return it;
            return {
              ...it,
              volume: it.semulaVolume,
              satuan: it.semulaSatuan,
              tarifHarga: it.semulaTarif,
              jumlah: it.semulaJumlah,
              selisihJumlah: 0,
              selisihVolume: 0,
              statusPerubahan: 'TETAP' as const,
              alasanPerubahan: 'Dipulihkan kembali ke kondisi semula',
              updatedAt: new Date().toISOString()
            };
          })
        };
      });
    });

    handleAddActivityLog({
      actorName: currentUser?.nama || 'Bendahara',
      actorRole: currentUser?.role || 'BENDAHARA',
      actionType: 'EDIT_PERUBAHAN',
      title: 'Memulihkan rincian belanja di ARKAS Perubahan',
      description: `Rincian "${item.uraian}" dipulihkan (${MONTH_NAMES[monthIndex]})`,
      targetType: 'perubahan',
      targetMonthIndex: monthIndex
    });
  };

  // Simpan / verifikasi item di ARKAS Perubahan
  const handleSavePerubahanItem = (item: ArkasPerubahanItem, monthIndex: number) => {
    setPerubahanWorksheets((prev) => {
      return prev.map((ws, idx) => {
        if (idx !== monthIndex) return ws;
        return {
          ...ws,
          items: ws.items.map((it) => {
            if (it.id !== item.id) return it;
            return {
              ...it,
              isSaved: true,
              savedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          })
        };
      });
    });

    handleAddActivityLog({
      actorName: currentUser?.nama || 'Bendahara',
      actorRole: currentUser?.role || 'BENDAHARA',
      actionType: 'EDIT_PERUBAHAN',
      title: 'Menyimpan rincian belanja di ARKAS Perubahan',
      description: `Rincian "${item.uraian}" (${MONTH_NAMES[monthIndex]}) berhasil disimpan`,
      targetType: 'perubahan',
      targetMonthIndex: monthIndex
    });
  };

  // Edit rincian belanja di ARKAS Perubahan
  const handleEditPerubahanItem = (updatedItem: ArkasPerubahanItem, monthIndex: number) => {
    setPerubahanWorksheets((prev) => {
      return prev.map((ws, idx) => {
        if (idx !== monthIndex) return ws;
        return {
          ...ws,
          items: ws.items.map((it) => (it.id === updatedItem.id ? updatedItem : it))
        };
      });
    });

    handleAddActivityLog({
      actorName: currentUser?.nama || 'Bendahara',
      actorRole: currentUser?.role || 'BENDAHARA',
      actionType: 'EDIT_PERUBAHAN',
      title: 'Memperbarui rincian belanja di ARKAS Perubahan',
      description: `Perubahan data "${updatedItem.uraian}" (${MONTH_NAMES[monthIndex]})`,
      targetType: 'perubahan',
      targetMonthIndex: monthIndex
    });
  };

  // Hilangkan rincian belanja di ARKAS Perubahan
  const handleHilangkanPerubahanItem = (
    item: ArkasPerubahanItem,
    monthIndex: number,
    reason?: string
  ) => {
    const isItemBaru = item.statusPerubahan === 'BARU';

    setPerubahanWorksheets((prev) => {
      return prev.map((ws, idx) => {
        if (idx !== monthIndex) return ws;
        if (isItemBaru) {
          return {
            ...ws,
            items: ws.items.filter((it) => it.id !== item.id)
          };
        }
        return {
          ...ws,
          items: ws.items.map((it) => {
            if (it.id !== item.id) return it;
            return {
              ...it,
              volume: 0,
              jumlah: 0,
              selisihJumlah: -it.semulaJumlah,
              selisihVolume: -it.semulaVolume,
              statusPerubahan: 'DIHILANGKAN' as const,
              alasanPerubahan: reason || 'Dihilangkan / ditiadakan dalam ARKAS Perubahan',
              updatedAt: new Date().toISOString()
            };
          })
        };
      });
    });

    handleAddActivityLog({
      actorName: currentUser?.nama || 'Bendahara',
      actorRole: currentUser?.role || 'BENDAHARA',
      actionType: 'EDIT_PERUBAHAN',
      title: 'Meniadakan belanja di ARKAS Perubahan',
      description: `Penghilangan belanja: "${item.uraian}" (${MONTH_NAMES[monthIndex]})`,
      targetType: 'perubahan',
      targetMonthIndex: monthIndex
    });
  };

  // Pindahkan rincian belanja ke bulan lain di ARKAS Perubahan
  const handleMovePerubahanItem = (
    item: ArkasPerubahanItem,
    fromMonthIndex: number,
    toMonthIndex: number,
    reason?: string
  ) => {
    if (fromMonthIndex === toMonthIndex) return;

    const moveReason =
      reason ||
      `Pergeseran jadwal pelaksanaan dari bulan ${MONTH_NAMES[fromMonthIndex]} ke ${MONTH_NAMES[toMonthIndex]}`;

    setPerubahanWorksheets((prev) => {
      // Nilai efektif volume, satuan, tarif, dan jumlah
      const effectiveVolume =
        item.volume > 0
          ? item.volume
          : item.semulaVolume > 0
          ? item.semulaVolume
          : 1;
      const effectiveSatuan = item.satuan || item.semulaSatuan || 'unit';
      const effectiveTarif =
        item.tarifHarga > 0
          ? item.tarifHarga
          : item.semulaTarif > 0
          ? item.semulaTarif
          : 0;
      const effectiveJumlah =
        item.jumlah > 0
          ? item.jumlah
          : item.semulaJumlah > 0
          ? item.semulaJumlah
          : effectiveVolume * effectiveTarif;

      // Moved item: Nilai Semula (Murni) terisi sama dengan Nilai Menjadi sehingga tidak ada nilai selisih (selisih = 0)
      const movedItem: ArkasPerubahanItem = {
        ...item,
        id: item.id || generateUid(),
        semulaVolume: effectiveVolume,
        semulaSatuan: effectiveSatuan,
        semulaTarif: effectiveTarif,
        semulaJumlah: effectiveJumlah,
        volume: effectiveVolume,
        satuan: effectiveSatuan,
        tarifHarga: effectiveTarif,
        jumlah: effectiveJumlah,
        selisihJumlah: 0,
        selisihVolume: 0,
        statusPerubahan: 'TETAP' as const,
        alasanPerubahan: `Dipindahkan dari ${MONTH_NAMES[fromMonthIndex]}: ${moveReason}`,
        isSaved: true,
        savedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return prev.map((ws, idx) => {
        // 1. Pada bulan asal: data LANGSUNG HILANG dari daftar (tidak ada lagi di daftar asal)
        if (idx === fromMonthIndex) {
          return {
            ...ws,
            items: ws.items.filter((it) => it.id !== item.id)
          };
        }

        // 2. Pada bulan tujuan: ditambahkan dan dipastikan TIDAK ADA PENDOBLAN
        if (idx === toMonthIndex) {
          const existingIndex = ws.items.findIndex(
            (it) =>
              it.id === item.id ||
              (it.kodeRekening.trim() === item.kodeRekening.trim() &&
                it.uraian.trim().toLowerCase() === item.uraian.trim().toLowerCase())
          );

          if (existingIndex >= 0) {
            // Sudah ada di bulan tujuan: perbarui data tanpa mendobelkan baris
            const updatedItems = [...ws.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              ...movedItem,
              id: updatedItems[existingIndex].id,
              noUrut: updatedItems[existingIndex].noUrut
            };
            return {
              ...ws,
              items: updatedItems
            };
          } else {
            // Belum ada: tambahkan ke daftar bulan tujuan
            return {
              ...ws,
              items: [...ws.items, { ...movedItem, noUrut: ws.items.length + 1 }]
            };
          }
        }

        return ws;
      });
    });

    handleAddActivityLog({
      actorName: currentUser?.nama || 'Bendahara',
      actorRole: currentUser?.role || 'BENDAHARA',
      actionType: 'EDIT_PERUBAHAN',
      title: 'Pergeseran bulan rincian belanja di ARKAS Perubahan',
      description: `Memindahkan "${item.uraian}" (${formatRp(
        item.jumlah || item.semulaJumlah
      )}) dari ${MONTH_NAMES[fromMonthIndex]} ke ${MONTH_NAMES[toMonthIndex]} tanpa selisih`,
      targetType: 'perubahan',
      targetMonthIndex: toMonthIndex
    });
  };

  // Hapus total rincian belanja secara permanen dari ARKAS Perubahan
  const handleHapusTotalPerubahanItem = (item: ArkasPerubahanItem, monthIndex: number) => {
    setPerubahanWorksheets((prev) => {
      return prev.map((ws, idx) => {
        if (idx !== monthIndex) return ws;
        return {
          ...ws,
          items: ws.items.filter((it) => it.id !== item.id)
        };
      });
    });

    handleAddActivityLog({
      actorName: currentUser?.nama || 'Bendahara',
      actorRole: currentUser?.role || 'BENDAHARA',
      actionType: 'DELETE_PERUBAHAN_ITEM',
      title: 'Hapus total rincian belanja di ARKAS Perubahan',
      description: `Rincian "${item.uraian}" dihapus total permanen dari bulan ${MONTH_NAMES[monthIndex]}`,
      targetType: 'perubahan',
      targetMonthIndex: monthIndex
    });
  };

  const handleExportJSON = () => {
    const backup = {
      school,
      worksheets,
      perubahanWorksheets,
      documents,
      users: users.map(u => ({ ...u, password: '***' })),
      exportedAt: new Date().toISOString()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `backup_sibos7_bosp_${school.tahunAnggaran}.json`);
    dlAnchorElem.click();
  };

  // If user is not logged in, show login gateway
  if (!currentUser) {
    return <LoginView school={school} users={users} onLogin={handleLogin} />;
  }

  // KPI Calculations (Context-aware for ARKAS Murni vs ARKAS Perubahan)
  const isPerubahanTab = currentTab === 'arkas-perubahan' || currentTab === 'rekap-perubahan';
  const currentMonthTotal = isPerubahanTab
    ? (perubahanWorksheets[selectedMonth]?.items.reduce((s, it) => s + (it.statusPerubahan === 'DIHILANGKAN' ? 0 : it.jumlah), 0) || 0)
    : (worksheets[selectedMonth]?.items.reduce((s, it) => s + it.jumlah, 0) || 0);

  const grandTotalBelanja = isPerubahanTab
    ? perubahanWorksheets.reduce(
        (acc, ws) => acc + ws.items.reduce((s, it) => s + (it.statusPerubahan === 'DIHILANGKAN' ? 0 : it.jumlah), 0),
        0
      )
    : worksheets.reduce(
        (acc, ws) => acc + ws.items.reduce((s, it) => s + it.jumlah, 0),
        0
      );

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col antialiased text-[#2C2A28] selection:bg-[#5A5A40] selection:text-white font-sans">
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          school={school}
          docsCount={documents.length}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <Navbar
            currentTab={currentTab}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            monthlyTotal={currentMonthTotal}
            totalPenerimaan={school.totalPenerimaan || 340000000}
            grandTotalBelanja={grandTotalBelanja}
            school={school}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onPrintWorksheet={() => handlePrintWorksheet(selectedMonth)}
            onExportJSON={handleExportJSON}
            currentUser={currentUser}
            onOpenUserManagement={() => setCurrentTab('users')}
            lastSavedTime={lastSavedTime}
            isAutoSaving={isAutoSaving}
          />

          {/* View Container */}
          <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {currentTab === 'dashboard' && (
              <DashboardView
                school={school}
                worksheets={worksheets}
                perubahanWorksheets={perubahanWorksheets}
                documents={documents}
                onSelectTab={handleSelectTab}
                onSelectMonth={setSelectedMonth}
                onOpenDoc={handleOpenDocument}
                onCreateSpjFromItem={handleCreateSpjFromItem}
                currentUser={currentUser}
              />
            )}

            {currentTab === 'kertas-kerja' && (
              <KertasKerjaView
                school={school}
                worksheets={worksheets}
                selectedMonth={selectedMonth}
                onSelectMonth={setSelectedMonth}
                onUpdateWorksheet={handleUpdateWorksheet}
                onCreateSpjFromItem={handleCreateSpjFromItem}
                onPrintMonth={handlePrintWorksheet}
                searchQuery={searchQuery}
              />
            )}

            {currentTab === 'arkas-perubahan' && (
              <ArkasPerubahanView
                school={school}
                worksheets={perubahanWorksheets}
                murniWorksheets={worksheets}
                selectedMonth={selectedMonth}
                onSelectMonth={setSelectedMonth}
                onUpdateWorksheet={handleUpdatePerubahanWorksheet}
                onResetFromMurni={handleResetPerubahanFromMurni}
                onCreateSpjFromPerubahanItem={handleCreateSpjFromPerubahanItem}
                onPrintMonth={handlePrintPerubahanWorksheet}
                searchQuery={searchQuery}
                documents={documents}
                onOpenSpjDoc={handleOpenDocument}
                onAddActivityLog={handleAddActivityLog}
                currentUser={currentUser}
                onNavigateToRekapPerubahan={() => setCurrentTab('rekap-perubahan')}
                onSaveItem={(item, mIdx) => handleSavePerubahanItem(item, mIdx)}
                onEditItem={(item, mIdx) => handleEditPerubahanItem(item, mIdx)}
                onHilangkanItem={(item, mIdx, reason) => handleHilangkanPerubahanItem(item, mIdx, reason)}
                onMoveItem={(item, fromM, toM, reason) => handleMovePerubahanItem(item, fromM, toM, reason)}
                onHapusTotalItem={(item, mIdx) => handleHapusTotalPerubahanItem(item, mIdx)}
                onRestoreItem={(item, mIdx) => handleRestorePerubahanItem(item, mIdx)}
              />
            )}

            {currentTab === 'rekap-perubahan' && (
              <RekapPerubahanView
                school={school}
                worksheets={perubahanWorksheets}
                murniWorksheets={worksheets}
                onSelectMonthAndTab={(mIdx, tab) => {
                  setSelectedMonth(mIdx);
                  setCurrentTab(tab);
                }}
                onRestoreItem={(item, monthIndex) => {
                  handleRestorePerubahanItem(item, monthIndex);
                }}
                onSaveItem={(item, mIdx) => handleSavePerubahanItem(item, mIdx)}
                onEditItem={(item, mIdx) => handleEditPerubahanItem(item, mIdx)}
                onHilangkanItem={(item, mIdx, reason) => handleHilangkanPerubahanItem(item, mIdx, reason)}
                onMoveItem={(item, fromM, toM, reason) => handleMovePerubahanItem(item, fromM, toM, reason)}
                onHapusTotalItem={(item, mIdx) => handleHapusTotalPerubahanItem(item, mIdx)}
                currentUser={currentUser}
              />
            )}

            {currentTab === 'tema-explorer' && (
              <TemaExplorerView
                worksheets={worksheets}
                onCreateSpjFromItem={handleCreateSpjFromItem}
                onSelectMonthAndTab={(mIdx, tab) => {
                  setSelectedMonth(mIdx);
                  setCurrentTab(tab);
                }}
              />
            )}

            {['kwitansi', 'daftar', 'nota', 'faktur', 'bkk', 'berita', 'sptj'].includes(currentTab) && (
              <SpjView
                type={currentTab as SpjType}
                draft={draftDoc}
                school={school}
                onSaveDoc={handleSaveDocument}
                onPrintDoc={handlePrintDocument}
                allDocs={documents}
              />
            )}

            {currentTab === 'rekap' && (
              <RekapView school={school} worksheets={worksheets} />
            )}

            {currentTab === 'arsip' && (
              <ArsipView
                documents={documents}
                school={school}
                onOpenDoc={handleOpenDocument}
                onPrintDoc={handlePrintDocument}
                onDeleteDoc={handleDeleteDocument}
              />
            )}

            {currentTab === 'identitas' && (
              <IdentitasView
                school={school}
                onUpdateSchool={setSchool}
                currentUser={currentUser}
              />
            )}

            {currentTab === 'users' && (
              <UserManagementView
                currentUser={currentUser}
                users={users}
                school={school}
                onUpdateUsers={handleUpdateUsers}
                onUpdateSchool={setSchool}
              />
            )}
          </main>
        </div>
      </div>

      {/* Print Modal Dialog */}
      {printModal.isOpen && (
        <PrintModal
          mode={printModal.mode}
          worksheet={printModal.worksheet}
          document={printModal.document}
          school={school}
          monthIndex={printModal.monthIndex}
          onClose={() => setPrintModal({ ...printModal, isOpen: false })}
        />
      )}
    </div>
  );
}

export default App;
