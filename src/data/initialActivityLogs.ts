import { ActivityLog } from '../types';

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log_001',
    timestamp: '2026-08-28 08:30:15',
    actorName: 'Rahel Natalia Done,S.Pd.K',
    actorRole: 'BENDAHARA',
    actionType: 'CREATE_SPJ',
    title: 'Menerbitkan Kwitansi Resmi No: 001/KW/BOSP/SMPN7/I/2026',
    description: 'Belanja ATK Papuamas Sentani sebesar Rp 4.768.000 untuk kebutuhan Kertas Kerja Bulan Januari',
    targetType: 'spj',
    targetDocId: 'init_doc_1',
    targetDocNomor: '001/KW/BOSP/SMPN7/I/2026',
    targetDocType: 'kwitansi',
    targetMonthIndex: 0
  },
  {
    id: 'log_002',
    timestamp: '2026-08-28 09:15:20',
    actorName: 'Rahel Natalia Done,S.Pd.K',
    actorRole: 'BENDAHARA',
    actionType: 'CREATE_SPJ',
    title: 'Menerbitkan Daftar Pembayaran Honorarium GTT & PTT Bulan Januari',
    description: 'Pembayaran honorarium 6 tenaga pendidik & kependidikan non-ASN sebesar Rp 18.000.000',
    targetType: 'spj',
    targetDocId: 'init_doc_2',
    targetDocNomor: '001/DP/BOSP/SMPN7/I/2026',
    targetDocType: 'daftar',
    targetMonthIndex: 0
  },
  {
    id: 'log_003',
    timestamp: '2026-08-28 10:05:40',
    actorName: 'Maikel Paul Wally, S.Pd',
    actorRole: 'KEPSEK',
    actionType: 'STATUS_LUNAS',
    title: 'Menyetujui & Memverifikasi Kwitansi No: 001/KW/BOSP/SMPN7/I/2026',
    description: 'Status pembayaran disahkan LUNAS oleh Kepala Sekolah',
    targetType: 'spj',
    targetDocId: 'init_doc_1',
    targetDocNomor: '001/KW/BOSP/SMPN7/I/2026',
    targetDocType: 'kwitansi',
    targetMonthIndex: 0
  }
];
