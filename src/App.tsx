import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, CheckCircle2, X, ArrowLeftRight, Bell } from 'lucide-react';
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
import { ManualPerubahanView } from './components/ManualPerubahanView';

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
    mode: 'worksheet' | 'document' | 'arkas-perubahan';
    worksheet?: MonthWorksheet;
    perubahanWorksheet?: ArkasPerubahanMonthWorksheet;
    allPerubahanWorksheets?: ArkasPerubahanMonthWorksheet[];
    document?: SpjDocument;
    monthIndex?: number;
  }>({
    isOpen: false,
    mode: 'worksheet'
  });

  // Central Server Synchronization & Collaborative State
  const [serverVersion, setServerVersion] = useState<number>(1);
  const serverVersionRef = useRef<number>(1);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncPeer, setSyncPeer] = useState<string | null>(null);
  const [liveAlert, setLiveAlert] = useState<{
    id: number;
    message: string;
    actorName: string;
    actorRole: string;
    time: string;
  } | null>(null);

  // Guards to differentiate local user mutations from remote server updates
  const isApplyingRemoteUpdateRef = useRef<boolean>(false);
  const hasInitialLoadedRef = useRef<boolean>(false);
  const saveDebounceTimerRef = useRef<any>(null);

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

  // Push full application state to the central server
  const pushDataToServer = async (actionDescription?: string) => {
    try {
      setIsAutoSaving(true);
      const payload = {
        school,
        worksheets,
        perubahanWorksheets,
        documents,
        users,
        activityLogs,
        modifiedBy: {
          userId: currentUser?.id,
          nama: currentUser?.nama || (currentUser?.role === 'KEPSEK' ? 'Kepala Sekolah' : 'Bendahara BOSP'),
          role: currentUser?.role || 'BENDAHARA',
          action: actionDescription || 'Pembaruan data operasional BOSP'
        }
      };

      const res = await fetch('/api/bosp-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && typeof data.version === 'number') {
        serverVersionRef.current = data.version;
        setServerVersion(data.version);
        triggerAutoSaveIndicator();
      }
    } catch (err) {
      console.warn('Gagal menyimpan otomatis ke server pusat:', err);
    } finally {
      setIsAutoSaving(false);
    }
  };

  // 1. Initial Load: Ambil data mutakhir dari database server pusat saat aplikasi dibuka
  useEffect(() => {
    let isMounted = true;

    const loadInitialServerData = async () => {
      try {
        setIsSyncing(true);
        const res = await fetch('/api/bosp-data');
        const json = await res.json();

        if (json.success && json.data) {
          if (!isMounted) return;
          isApplyingRemoteUpdateRef.current = true;

          if (json.data.school) setSchool(json.data.school);
          if (json.data.worksheets) setWorksheets(json.data.worksheets);
          if (json.data.perubahanWorksheets) setPerubahanWorksheets(json.data.perubahanWorksheets);
          if (json.data.documents) setDocuments(json.data.documents);
          if (json.data.users) setUsers(json.data.users);
          if (json.data.activityLogs) setActivityLogs(json.data.activityLogs);

          if (typeof json.version === 'number') {
            serverVersionRef.current = json.version;
            setServerVersion(json.version);
          }
          if (json.lastModifiedBy) {
            const roleLabel = json.lastModifiedBy.role === 'KEPSEK' ? 'Kepala Sekolah' : json.lastModifiedBy.role === 'BENDAHARA' ? 'Bendahara' : json.lastModifiedBy.role;
            setSyncPeer(`${json.lastModifiedBy.nama} (${roleLabel})`);
          }

          setTimeout(() => {
            isApplyingRemoteUpdateRef.current = false;
            hasInitialLoadedRef.current = true;
          }, 350);
        } else {
          // Jika server masih kosong, inisialisasi server dengan data awal
          hasInitialLoadedRef.current = true;
          await pushDataToServer('Inisialisasi data awal BOSP 2026');
        }
      } catch (err) {
        console.warn('Initial server fetch failed, fallback to local storage:', err);
        hasInitialLoadedRef.current = true;
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };

    loadInitialServerData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Auto-Save to LocalStorage & Debounced Push to Server whenever local user mutates state
  useEffect(() => {
    // Simpan ke local cache peramban sebagai backup cepat
    localStorage.setItem(LS_USERS, JSON.stringify(users));
    localStorage.setItem(LS_SCHOOL, JSON.stringify(school));
    localStorage.setItem(LS_WORKSHEETS, JSON.stringify(worksheets));
    localStorage.setItem(LS_PERUBAHAN, JSON.stringify(perubahanWorksheets));
    localStorage.setItem(LS_DOCS, JSON.stringify(documents));
    localStorage.setItem(LS_LOGS, JSON.stringify(activityLogs));
    triggerAutoSaveIndicator();

    // Jika perubahan datang dari sinkronisasi server (remote), jangan dipush ulang agar tidak looping
    if (!hasInitialLoadedRef.current || isApplyingRemoteUpdateRef.current) {
      return;
    }

    if (saveDebounceTimerRef.current) {
      clearTimeout(saveDebounceTimerRef.current);
    }

    // Debounce save 550ms ke server
    saveDebounceTimerRef.current = setTimeout(() => {
      pushDataToServer();
    }, 550);

    return () => {
      if (saveDebounceTimerRef.current) {
        clearTimeout(saveDebounceTimerRef.current);
      }
    };
  }, [users, school, worksheets, perubahanWorksheets, documents, activityLogs]);

  // 3. Real-time Poller & Multi-user Listener: Mendeteksi perubahan dari pengguna lain (Kepsek <-> Bendahara)
  const checkRemoteSync = async () => {
    if (isApplyingRemoteUpdateRef.current) return;
    try {
      const res = await fetch('/api/bosp-data/status');
      const json = await res.json();

      if (json.success && typeof json.version === 'number') {
        // Jika versi di server lebih tinggi daripada versi lokal kita, berarti ada perubahan dari lawan bicara
        if (json.version > serverVersionRef.current) {
          setIsSyncing(true);
          const fullRes = await fetch('/api/bosp-data');
          const fullJson = await fullRes.json();

          if (fullJson.success && fullJson.data) {
            isApplyingRemoteUpdateRef.current = true;
            serverVersionRef.current = fullJson.version;
            setServerVersion(fullJson.version);

            if (fullJson.data.school) setSchool(fullJson.data.school);
            if (fullJson.data.worksheets) setWorksheets(fullJson.data.worksheets);
            if (fullJson.data.perubahanWorksheets) setPerubahanWorksheets(fullJson.data.perubahanWorksheets);
            if (fullJson.data.documents) setDocuments(fullJson.data.documents);
            if (fullJson.data.users) setUsers(fullJson.data.users);
            if (fullJson.data.activityLogs) setActivityLogs(fullJson.data.activityLogs);

            const modifier = fullJson.lastModifiedBy;
            if (modifier) {
              const roleTitle = modifier.role === 'KEPSEK' ? 'Kepala Sekolah' : modifier.role === 'BENDAHARA' ? 'Bendahara' : 'Pengguna Lain';
              setSyncPeer(`${modifier.nama || roleTitle} (${roleTitle})`);

              // Jika perubahan dibuat oleh akun selain akun saya saat ini, tampilkan notifikasi alert ramah
              if (!currentUser || modifier.userId !== currentUser.id) {
                const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                setLiveAlert({
                  id: Date.now(),
                  message: `Rincian belanja ARKAS Perubahan telah diperbarui otomatis oleh ${roleTitle} (${modifier.nama || ''}).`,
                  actorName: modifier.nama || roleTitle,
                  actorRole: roleTitle,
                  time: nowTime
                });
              }
            }

            triggerAutoSaveIndicator();

            setTimeout(() => {
              isApplyingRemoteUpdateRef.current = false;
            }, 300);
          }
          setIsSyncing(false);
        }
      }
    } catch (e) {
      // Ignored network retry
    }
  };

  useEffect(() => {
    // Polling setiap 2.5 detik
    const interval = setInterval(checkRemoteSync, 2500);

    // Langsung cek sinkronisasi saat jendela browser difokuskan kembali
    const handleWindowFocus = () => {
      checkRemoteSync();
    };

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleWindowFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleWindowFocus);
    };
  }, [currentUser]);

  // Auto-dismiss live alert setelah 7 detik
  useEffect(() => {
    if (liveAlert) {
      const timer = setTimeout(() => {
        setLiveAlert(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [liveAlert]);

  // Manual Trigger: Tombol klik langsung sinkron di navbar
  const handleManualSync = async () => {
    setIsSyncing(true);
    await checkRemoteSync();
    setTimeout(() => {
      setIsSyncing(false);
    }, 450);
  };

  // Sinkronisasi tab lokal dalam browser yang sama (StorageEvent)
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
      setPrintModal({
        isOpen: true,
        mode: 'arkas-perubahan',
        perubahanWorksheet: ws,
        allPerubahanWorksheets: perubahanWorksheets,
        monthIndex
      });
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
            onManualSync={handleManualSync}
            isSyncing={isSyncing}
            syncPeer={syncPeer}
          />

          {/* Live Collaborative Sync Alert Toast */}
          {liveAlert && (
            <div className="mx-6 mt-4 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 shadow-md flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded-md">
                      ⚡ Sinkron Otomatis 2 Arah (Kepsek ↔ Bendahara)
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">pk {liveAlert.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-950 mt-1">
                    {liveAlert.message}
                  </p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Data di layar Anda telah terbarui secara otomatis dan selaras secara real-time.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLiveAlert(null)}
                className="text-emerald-700 hover:text-emerald-900 p-1.5 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
                title="Tutup pemberitahuan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

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
                onNavigateToManualPerubahan={() => setCurrentTab('arkas-perubahan-manual')}
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

            {currentTab === 'arkas-perubahan-manual' && (
              <ManualPerubahanView
                school={school}
                worksheets={perubahanWorksheets}
                murniWorksheets={worksheets}
                onUpdateWorksheet={handleUpdatePerubahanWorksheet}
                onNavigateToPerubahan={(mIdx) => {
                  if (typeof mIdx === 'number') setSelectedMonth(mIdx);
                  setCurrentTab('arkas-perubahan');
                }}
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
          perubahanWorksheet={printModal.perubahanWorksheet}
          allPerubahanWorksheets={printModal.allPerubahanWorksheets}
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
