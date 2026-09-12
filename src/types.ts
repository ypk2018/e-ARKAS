export interface SchoolProfile {
  nama: string;
  npsn: string;
  akreditasi: string;
  alamat: string;
  dusun: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  telp: string;
  email: string;
  motto: string;
  dinas: string;
  kepsekNama: string;
  kepsekNip: string;
  kepsekPangkat?: string;
  bendaharaNama: string;
  bendaharaNip: string;
  komiteNama: string;
  bankNama: string;
  bankRek: string;
  bankAtasNama: string;
  tahunAnggaran: string;
  sumberDana: string;
  totalPenerimaan: number;
}

export interface KertasKerjaItem {
  id: string;
  noUrut: number;
  kodeRekening: string;
  kodeProgram: string;
  uraian: string;
  volume: number;
  satuan: string;
  tarifHarga: number;
  jumlah: number;
  temaId: string;       // e.g. "04" (Standar Tenaga Kependidikan)
  temaNama: string;     // e.g. "Standar Tenaga Kependidikan"
  subtemaKode: string;  // e.g. "04.06" (Pengembangan Profesi Pendidik dan Tenaga Kependidikan)
  subtemaNama: string;  // e.g. "Pengembangan Profesi Pendidik dan Tenaga Kependidikan"
  kegiatanKode?: string;// e.g. "04.06.02"
  kegiatanNama?: string;// e.g. "Kegiatan Komunitas Belajar antar sekolah"
  penerimaDefault?: string;
  jabatanDefault?: string;
}

export interface MonthWorksheet {
  bulanKey: string;      // "januari" ... "desember"
  bulanNama: string;     // "Januari 2026"
  bulanIndex: number;    // 0..11
  totalPenerimaan: number;
  items: KertasKerjaItem[];
}

export type PerubahanStatus = 'TETAP' | 'BERTAMBAH' | 'BERKURANG' | 'BARU' | 'DIHILANGKAN';

export interface ArkasPerubahanItem {
  id: string;
  originalItemId?: string; // id referensi dari ARKAS Murni (jika ada)
  noUrut: number;
  kodeRekening: string;
  kodeProgram: string;
  uraian: string;

  // Data Semula (ARKAS Murni)
  semulaVolume: number;
  semulaSatuan: string;
  semulaTarif: number;
  semulaJumlah: number;

  // Data Menjadi (ARKAS Perubahan)
  volume: number;
  satuan: string;
  tarifHarga: number;
  jumlah: number; // volume * tarifHarga

  // Selisih
  selisihJumlah: number; // jumlah - semulaJumlah (+ / -)
  selisihVolume: number; // volume - semulaVolume (+ / -)

  statusPerubahan: PerubahanStatus;
  alasanPerubahan?: string; // Penjelasan pergeseran/perubahan/penambahan baru
  isSaved?: boolean;
  savedAt?: string;

  temaId: string;
  temaNama: string;
  subtemaKode: string;
  subtemaNama: string;
  kegiatanKode?: string;
  kegiatanNama?: string;
  penerimaDefault?: string;
  jabatanDefault?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArkasPerubahanMonthWorksheet {
  bulanKey: string;
  bulanNama: string;
  bulanIndex: number;
  totalPenerimaan: number;
  items: ArkasPerubahanItem[];
}

export interface TemaStandar {
  kode: string;          // "01", "02", ..., "08"
  nama: string;          // "Pengembangan Standar Isi", "Standar Proses", etc.
  deskripsi?: string;
}

export interface SubtemaProgram {
  kode: string;          // e.g. "04.06", "05.08", "06.05"
  temaKode: string;      // e.g. "04"
  nama: string;          // e.g. "Pengembangan Profesi Pendidik dan Tenaga Kependidikan"
  kegiatanList?: string[];
}

export interface BosRegulerItemTemplate {
  id: string;
  temaKode: string;
  temaNama: string;
  subtemaKode: string;
  subtemaNama: string;
  kegiatanKode: string;
  kegiatanNama: string;
  kodeRekening: string;
  kodeProgram: string;
  uraian: string;
  satuan: string;
  tarifHarga: number;
  kategori: string;
  penerimaDefault?: string;
  jabatanDefault?: string;
}

export interface SpjItem {
  kode?: string;
  nama: string;
  nip?: string;
  jabatan?: string;
  qty?: number;
  satuan?: string;
  harga?: number;
  honor?: number;
  pph?: number;
  jumlah?: number;
  ket?: string;
}

export type SpjType = "kwitansi" | "daftar" | "nota" | "faktur" | "bkk" | "berita" | "sptj";

export interface SpjDocument {
  id: string;
  type: SpjType;
  nomor: string;
  tanggal: string;       // YYYY-MM-DD
  triwulan?: string;      // "I", "II", "III", "IV"
  komponen?: string;
  rekening?: string;
  uraian?: string;
  catatan?: string;
  kegiatan?: string;
  judul?: string;
  penerima?: string;
  jabatanPenerima?: string;
  penerimaNip?: string;
  terimaDari?: string;
  metode?: string;
  jumlah: number;
  pph?: number;
  ppn?: number;
  ppnRate?: number;
  pajak?: string;
  materai?: boolean;
  lunas?: boolean;
  rangkap?: boolean;
  tempat?: string;
  keterangan?: string;
  tokoNama?: string;
  tokoAlamat?: string;
  tokoTelp?: string;
  tokoPic?: string;
  npwp?: string;
  alamatPenerima?: string;
  pendukung?: string;
  jenis?: string;
  pihak2Nama?: string;
  pihak2Jabatan?: string;
  items?: SpjItem[];
  temaKode?: string;
  subtemaKode?: string;
  sourceKertasKerjaId?: string;
  sourceArkasType?: 'murni' | 'perubahan';
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = 'KEPSEK' | 'BENDAHARA';

export interface ActivityLog {
  id: string;
  timestamp: string;      // ISO string or formatted date
  actorName: string;
  actorRole: UserRole;
  actionType:
    | 'CREATE_SPJ'
    | 'UPDATE_SPJ'
    | 'DELETE_SPJ'
    | 'STATUS_LUNAS'
    | 'EDIT_WORKSHEET'
    | 'ADD_WORKSHEET_ITEM'
    | 'DELETE_WORKSHEET_ITEM'
    | 'EDIT_PERUBAHAN'
    | 'ADD_PERUBAHAN_ITEM'
    | 'DELETE_PERUBAHAN_ITEM'
    | 'SYNC_PERUBAHAN'
    | 'UPDATE_PROFILE'
    | 'UPDATE_USERS';
  title: string;          // e.g. "Bendahara menerbitkan Kwitansi No. 001/KW/..."
  description: string;    // e.g. "Belanja ATK dan Kertas HVS sebesar Rp 4.768.000 (Bulan Januari)"
  targetType: 'spj' | 'worksheet' | 'perubahan' | 'profile' | 'users' | 'rekap';
  targetMonthIndex?: number;
  targetDocId?: string;
  targetDocNomor?: string;
  targetDocType?: SpjType;
}

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  nama: string;
  nip: string;
  jabatan: string;
  pangkat?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  email?: string;
  phone?: string;
}
