import { TemaStandar, SubtemaProgram } from '../types';

export const TEMA_STANDAR_LIST: TemaStandar[] = [
  { kode: "01", nama: "Standar Kompetensi Lulusan", deskripsi: "Pencapaian standar kompetensi lulusan peserta didik" },
  { kode: "02", nama: "Pengembangan Standar Isi", deskripsi: "Pengembangan kurikulum, modul ajar, dan pemberdayaan perpustakaan" },
  { kode: "03", nama: "Standar Proses", deskripsi: "Pelaksanaan PPDB, pembelajaran aktif, kepramukaan, dan ekstrakurikuler" },
  { kode: "04", nama: "Standar Tenaga Kependidikan", deskripsi: "Pengembangan profesi guru, komunitas belajar KKG/MGMP/MKKS, dan peningkatan kompetensi" },
  { kode: "05", nama: "Standar Sarana dan Prasarana", deskripsi: "Pengadaan buku teks, pemeliharaan gedung/lahan, peralatan olahraga, dan instalasi daya/jasa" },
  { kode: "06", nama: "Standar Pengelolaan", deskripsi: "Administrasi sekolah, konsumsi rapat kedinasan, ATK/bahan habis pakai, langganan daya dan jasa" },
  { kode: "07", nama: "Pengembangan Standar Pembiayaan", deskripsi: "Pembayaran honorarium tenaga penunjang, operator sekolah, dan guru honorer" },
  { kode: "08", nama: "Standar Penilaian Pendidikan", deskripsi: "Asesmen sumatif (UTS/UAS), Ujian Sekolah, Gladi/Utama ANBK, TKA, dan Diseminasi PSP/IHT/P5" }
];

export const SUBTEMA_PROGRAM_LIST: SubtemaProgram[] = [
  { kode: "02.02", temaKode: "02", nama: "Pengembangan Perpustakaan", kegiatanList: ["02.02.01. Kegiatan pemberdayaan perpustakaan terutama untuk pengembangan minat baca peserta didik"] },
  { kode: "02.03", temaKode: "02", nama: "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler", kegiatanList: ["02.03.01. Penyusunan Kurikulum"] },
  { kode: "03.01", temaKode: "03", nama: "Penerimaan Peserta Didik Baru", kegiatanList: ["03.01.01. Pelaksanaan Pendaftaran Peserta Didik Baru (PPDB)"] },
  { kode: "03.03", temaKode: "03", nama: "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler", kegiatanList: ["03.03.06. Pelaksanaan Ekstrakurikuler Kepramukaan"] },
  { kode: "04.06", temaKode: "04", nama: "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", kegiatanList: ["04.06.02. Kegiatan Komunitas Belajar antar sekolah (termasuk KKG, MGMP, MGMPS, MGMPK, KKKS, atau MKKS)", "04.06.25. Peningkatan Kompetensi Guru untuk pembelajaran berorientasi pada peserta didik"] },
  { kode: "05.02", temaKode: "05", nama: "Pengembangan Perpustakaan", kegiatanList: ["05.02.03. Pengadaan Buku Teks Utama/Pendamping Peserta Didik"] },
  { kode: "05.08", temaKode: "05", nama: "Pemeliharaan Sarana dan Prasarana Sekolah", kegiatanList: ["05.08.01. Pemeliharaan Prasarana Lahan, Bangunan dan Ruang", "05.08.02. Pengadaan Peralatan Sekolah diluar komponen penyediaan alat multimedia pembelajaran", "05.08.09. Pengadaan Perlengkapan Daya dan Jasa Sekolah", "05.08.10. Pemeliharaan Perlengkapan Daya dan Jasa Sekolah"] },
  { kode: "06.05", temaKode: "06", nama: "Pelaksanaan Administrasi Kegiatan Sekolah", kegiatanList: ["06.05.06. Konsumsi Rapat Kedinasan dan Tamu Sekolah (diluar kegiatan lain)", "06.05.08. Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah (ATK, Tinta, dsb)"] },
  { kode: "06.07", temaKode: "06", nama: "Pembiayaan Langganan Daya dan Jasa", kegiatanList: ["06.07.01. Pembayaran daya listrik", "06.07.03. Pembayaran langganan air", "06.07.05. Pembayaran jasa internet"] },
  { kode: "07.12", temaKode: "07", nama: "Pembayaran Honor", kegiatanList: ["07.12.03. Pembayaran Honor tenaga administrasi / Operator Sekolah", "07.12.04. Pembayaran honor Tenaga Penunjang atau pelaksana / Guru Honorer"] },
  { kode: "08.04", temaKode: "08", nama: "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", kegiatanList: ["08.04.01. Persiapan, uji coba, simulasi, dan pelaksanaan Asesmen Nasional", "08.04.06. Pelaksanaan penilaian sumatif (ulangan tengah semester/akhir semester/kenaikan kelas)", "08.04.08. Penyiapan, Uji Coba, dan Pelaksanaan Penilaian/Asesmen Sekolah Berbasis Komputer", "08.04.13. Tes kemampuan akademik peserta didik (TKA)"] },
  { kode: "08.06", temaKode: "08", nama: "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", kegiatanList: ["08.06.01. Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Pelatihan, Penugasan, Pengembangan Portofolio, Pelaksanaan P5, dan Workshop)"] }
];
