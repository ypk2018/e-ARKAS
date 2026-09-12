import { TemaStandar, SubtemaProgram, BosRegulerItemTemplate } from '../types';

export const TEMA_STANDAR_LIST: TemaStandar[] = [
  {
    kode: "01",
    nama: "Standar Kompetensi Lulusan",
    deskripsi: "Pencapaian standar kompetensi lulusan peserta didik, lomba OSN/O2SN/FLS2N, uji kelulusan, dan penguatan karakter P5"
  },
  {
    kode: "02",
    nama: "Pengembangan Standar Isi",
    deskripsi: "Penyusunan Kurikulum Operasional Satuan Pendidikan (KOSP/KTSP), silabus, modul ajar, dan pemberdayaan literasi perpustakaan"
  },
  {
    kode: "03",
    nama: "Standar Proses",
    deskripsi: "Pelaksanaan PPDB, MPLS, pembelajaran aktif, kepramukaan, PMR, UKS, sanggar seni, dan ekstrakurikuler sekolah"
  },
  {
    kode: "04",
    nama: "Standar Tenaga Kependidikan",
    deskripsi: "Pengembangan profesi pendidik, komunitas belajar gugus KKG/MGMP/MKKS/KKKS, dan peningkatan kompetensi guru berorientasi murid"
  },
  {
    kode: "05",
    nama: "Standar Sarana dan Prasarana",
    deskripsi: "Pengadaan buku teks utama/pendamping, pemeliharaan gedung/lahan/toilet, peralatan olahraga, multimedia, serta instalasi daya & jasa"
  },
  {
    kode: "06",
    nama: "Standar Pengelolaan",
    deskripsi: "Administrasi sekolah, konsumsi rapat kedinasan, belanja ATK/bahan habis pakai, penggandaan SPJ/LPJ, dan langganan daya listrik, air & internet"
  },
  {
    kode: "07",
    nama: "Pengembangan Standar Pembiayaan",
    deskripsi: "Pembayaran honorarium guru honorer non-ASN (NUPTK), honor operator Dapodik/ARKAS, petugas kebersihan/satpam, dan penatausahaan BOS"
  },
  {
    kode: "08",
    nama: "Standar Penilaian Pendidikan",
    deskripsi: "Asesmen sumatif (PTS/UTS, PAS/UAS), Ujian Sekolah, Gladi & Utama Asesmen Nasional (ANBK), TKA, serta diseminasi PSP/IHT/P5"
  }
];

export const SUBTEMA_PROGRAM_LIST: SubtemaProgram[] = [
  // --- STANDAR 01 ---
  {
    kode: "01.01",
    temaKode: "01",
    nama: "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler",
    kegiatanList: [
      "01.01.01. Penyelenggaraan Lomba Akademik dan Non-Akademik Peserta Didik (OSN, O2SN, FLS2N, Gala Siswa)",
      "01.01.02. Pembinaan Siswa Berprestasi dan Persiapan Kompetisi Sains & Olahraga"
    ]
  },
  {
    kode: "01.02",
    temaKode: "01",
    nama: "Pelaksanaan Uji Kompetensi dan Penguatan Kelulusan",
    kegiatanList: [
      "01.02.01. Pelaksanaan Uji Kompetensi Kelulusan Peserta Didik",
      "01.02.02. Penulisan dan Pembagian Ijazah / Sertifikat Kelulusan"
    ]
  },
  {
    kode: "01.04",
    temaKode: "01",
    nama: "Penguatan Profil Pelajar Pancasila (P5) dan Karakter",
    kegiatanList: [
      "01.04.01. Gelar Karya dan Pameran Proyek Penguatan Profil Pelajar Pancasila (P5)",
      "01.04.02. Penguatan Pendidikan Karakter dan Budi Pekerti Peserta Didik"
    ]
  },

  // --- STANDAR 02 ---
  {
    kode: "02.01",
    temaKode: "02",
    nama: "Penyusunan Kurikulum Operasional Satuan Pendidikan (KOSP)",
    kegiatanList: [
      "02.01.01. Workshop dan Rapat Kerja Penyusunan Kurikulum Tingkat Satuan Pendidikan (KOSP/KTSP)",
      "02.01.02. Review dan Evaluasi Dokumen Kurikulum Sekolah"
    ]
  },
  {
    kode: "02.02",
    temaKode: "02",
    nama: "Pengembangan Perpustakaan",
    kegiatanList: [
      "02.02.01. Kegiatan pemberdayaan perpustakaan terutama untuk pengembangan minat baca peserta didik",
      "02.02.02. Pengadaan Bahan Bacaan Literasi dan Majalah Sekolah"
    ]
  },
  {
    kode: "02.03",
    temaKode: "02",
    nama: "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler",
    kegiatanList: [
      "02.03.01. Penyusunan Kurikulum dan Pembagian Beban Mengajar Guru",
      "02.03.02. Penyusunan Modul Ajar dan Bahan Ajar Berdiferensiasi"
    ]
  },

  // --- STANDAR 03 ---
  {
    kode: "03.01",
    temaKode: "03",
    nama: "Penerimaan Peserta Didik Baru (PPDB)",
    kegiatanList: [
      "03.01.01. Pelaksanaan Pendaftaran Peserta Didik Baru (PPDB)",
      "03.01.02. Penggandaan Formulir, Brosur, dan Publikasi Spanduk PPDB",
      "03.01.03. Konsumsi Panitia dan Rapat Koordinasi PPDB"
    ]
  },
  {
    kode: "03.02",
    temaKode: "03",
    nama: "Pengenalan Lingkungan Sekolah (MPLS)",
    kegiatanList: [
      "03.02.01. Pelaksanaan Masa Pengenalan Lingkungan Sekolah (MPLS) Peserta Didik Baru",
      "03.02.02. Penyediaan Atribut dan Materi Pembinaan MPLS"
    ]
  },
  {
    kode: "03.03",
    temaKode: "03",
    nama: "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler",
    kegiatanList: [
      "03.03.06. Pelaksanaan Ekstrakurikuler Kepramukaan",
      "03.03.07. Pelaksanaan Kegiatan PMR, UKS, dan Dokter Kecil",
      "03.03.08. Kegiatan Latihan Paskibra dan Sanggar Seni Budaya Sekolah",
      "03.03.09. Pembinaan Ekstrakurikuler Olahraga (Futsal, Bola Voli, Basket)"
    ]
  },
  {
    kode: "03.04",
    temaKode: "03",
    nama: "Penyediaan Bahan dan Media Pembelajaran Aktif",
    kegiatanList: [
      "03.04.01. Pengadaan Bahan Praktik dan Alat Peraga Pembelajaran di Kelas",
      "03.04.02. Penyediaan Bahan Pembelajaran Praktik IPA / Laboratorium"
    ]
  },

  // --- STANDAR 04 ---
  {
    kode: "04.06",
    temaKode: "04",
    nama: "Pengembangan Profesi Pendidik dan Tenaga Kependidikan",
    kegiatanList: [
      "04.06.02. Kegiatan Komunitas Belajar antar sekolah (termasuk KKG, MGMP, MGMPS, MGMPK, KKKS, atau MKKS)",
      "04.06.25. Peningkatan Kompetensi Guru untuk pembelajaran berorientasi pada peserta didik",
      "04.06.26. Pelatihan / In House Training (IHT) Implementasi Kurikulum Merdeka",
      "04.06.27. Workshop Penyusunan Perangkat Asesmen dan Modul Proyek P5"
    ]
  },

  // --- STANDAR 05 ---
  {
    kode: "05.02",
    temaKode: "05",
    nama: "Pengembangan Perpustakaan",
    kegiatanList: [
      "05.02.03. Pengadaan Buku Teks Utama/Pendamping Peserta Didik dan Buku Panduan Guru",
      "05.02.04. Pemeliharaan dan Perawatan Koleksi Buku Perpustakaan"
    ]
  },
  {
    kode: "05.08",
    temaKode: "05",
    nama: "Pemeliharaan Sarana dan Prasarana Sekolah",
    kegiatanList: [
      "05.08.01. Pemeliharaan Prasarana Lahan, Bangunan dan Ruang (atap bocor, plafon, cat, pintu, jendela, babat rumput taman)",
      "05.08.02. Pengadaan Peralatan Sekolah diluar komponen penyediaan alat multimedia pembelajaran (meja kursi, papan tulis, alat olahraga)",
      "05.08.03. Penyediaan Alat Multimedia Pembelajaran (proyektor LCD, layar tripod, sound portable)",
      "05.08.09. Pengadaan Perlengkapan Daya dan Jasa Sekolah (lampu LED, baterai, stop kontak, kabel roll)",
      "05.08.10. Pemeliharaan Perlengkapan Daya dan Jasa Sekolah (instalasi air, pipa kran, pompa, kelistrikan, genset)"
    ]
  },

  // --- STANDAR 06 ---
  {
    kode: "06.05",
    temaKode: "06",
    nama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanList: [
      "06.05.06. Konsumsi Rapat Kedinasan dan Tamu Sekolah (diluar kegiatan lain)",
      "06.05.08. Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah (ATK, Kertas HVS, Tinta Printer, Spidol)",
      "06.05.09. Penggandaan Dokumen Administrasi Sekolah, Laporan SPJ & LPJ BOS Reguler",
      "06.05.10. Pengadaan Perlengkapan Kebersihan dan Sanitasi Sekolah (sapu, pel, sabun, tempat sampah)"
    ]
  },
  {
    kode: "06.07",
    temaKode: "06",
    nama: "Pembiayaan Langganan Daya dan Jasa",
    kegiatanList: [
      "06.07.01. Pembayaran daya listrik PLN Sekolah",
      "06.07.03. Pembayaran langganan air PDAM Sekolah",
      "06.07.05. Pembayaran jasa internet / Wifi / Indihome Sekolah",
      "06.07.06. Langganan Media Informasi dan Koran / Majalah Sekolah"
    ]
  },

  // --- STANDAR 07 ---
  {
    kode: "07.12",
    temaKode: "07",
    nama: "Pembayaran Honor",
    kegiatanList: [
      "07.12.03. Pembayaran Honor tenaga administrasi / Operator Sekolah (Dapodik & ARKAS)",
      "07.12.04. Pembayaran honor Tenaga Penunjang atau pelaksana / Guru Honorer Non-ASN ber-NUPTK",
      "07.12.05. Pembayaran honor Tenaga Kebersihan / Penjaga Sekolah / Petugas Keamanan"
    ]
  },
  {
    kode: "07.13",
    temaKode: "07",
    nama: "Penatausahaan dan Pengelolaan Keuangan BOS",
    kegiatanList: [
      "07.13.01. Pembelian Bea Materai untuk Kelengkapan SPJ dan Perpajakan BOS",
      "07.13.02. Perjalanan Dinas Pengambilan Dana BOS dan Pelaporan Penatausahaan ke Bank / Kemenkeu / Dinas"
    ]
  },

  // --- STANDAR 08 ---
  {
    kode: "08.04",
    temaKode: "08",
    nama: "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran",
    kegiatanList: [
      "08.04.01. Persiapan, uji coba, simulasi, dan pelaksanaan Asesmen Nasional (ANBK) & Ujian Sekolah",
      "08.04.06. Pelaksanaan penilaian sumatif (ulangan tengah semester/UTS, akhir semester/UAS, dan kenaikan kelas)",
      "08.04.08. Penyiapan, Uji Coba, dan Pelaksanaan Penilaian/Asesmen Sekolah Berbasis Komputer (Gladi Bersih ANBK)",
      "08.04.13. Tes kemampuan akademik peserta didik (TKA) dan Try Out Ujian Sekolah"
    ]
  },
  {
    kode: "08.06",
    temaKode: "08",
    nama: "Pengembangan Profesi Pendidik dan Tenaga Kependidikan",
    kegiatanList: [
      "08.06.01. Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Pelatihan, Penugasan, Pengembangan Portofolio, Pelaksanaan P5, dan Workshop)"
    ]
  }
];

// --- KATALOG RESMI ITEM BELANJA BOS REGULER KEMENDIKBUDRISTEK ---
export const BOS_REGULER_ITEM_TEMPLATES: BosRegulerItemTemplate[] = [
  // Standar 06: ATK & Bahan Habis Pakai
  {
    id: "bos_atk_hvs_a4",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.01.01.0025",
    kodeProgram: "06.05.08",
    uraian: "Kertas HVS-Bola Dunia A4 / 70 Gram",
    satuan: "rim",
    tarifHarga: 65000,
    kategori: "ATK & Bahan Habis Pakai"
  },
  {
    id: "bos_atk_hvs_f4",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.01.01.0025",
    kodeProgram: "06.05.08",
    uraian: "Kertas HVS-Bola Dunia F4 / 70 Gram",
    satuan: "rim",
    tarifHarga: 70000,
    kategori: "ATK & Bahan Habis Pakai"
  },
  {
    id: "bos_atk_spidol_wb",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "06.05.08",
    uraian: "Spidol-Snowman White Board G-12",
    satuan: "buah",
    tarifHarga: 12000,
    kategori: "ATK & Bahan Habis Pakai"
  },
  {
    id: "bos_atk_pulpen_faster",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "06.05.08",
    uraian: "Pulpen-Faster",
    satuan: "buah",
    tarifHarga: 7000,
    kategori: "ATK & Bahan Habis Pakai"
  },
  {
    id: "bos_atk_tinta_hitam",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.03.02.0115",
    kodeProgram: "06.05.08",
    uraian: "Tinta Printer 003 Warna Hitam",
    satuan: "botol",
    tarifHarga: 100000,
    kategori: "ATK & Bahan Habis Pakai"
  },
  {
    id: "bos_atk_tinta_warna",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.03.02.0115",
    kodeProgram: "06.05.08",
    uraian: "TInta Printer 003 warna ( Y / M / C )",
    satuan: "botol",
    tarifHarga: 100000,
    kategori: "ATK & Bahan Habis Pakai"
  },
  {
    id: "bos_atk_map_kertas",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "06.05.08",
    uraian: "Map Kertas-Diamond isi 50 lembar",
    satuan: "pak",
    tarifHarga: 200000,
    kategori: "ATK & Bahan Habis Pakai"
  },
  {
    id: "bos_atk_map_batik",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "06.05.08",
    uraian: "Map Batik-Map Batik Motif Papua Kertas",
    satuan: "pak",
    tarifHarga: 150000,
    kategori: "ATK & Bahan Habis Pakai"
  },
  {
    id: "bos_atk_staples",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "06.05.08",
    uraian: "Staples-Joyoko HD 10",
    satuan: "buah",
    tarifHarga: 25000,
    kategori: "ATK & Bahan Habis Pakai"
  },
  {
    id: "bos_atk_isi_staples",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "06.05.08",
    uraian: "Isi Staples-Max No.10",
    satuan: "kotak",
    tarifHarga: 10000,
    kategori: "ATK & Bahan Habis Pakai"
  },
  {
    id: "bos_atk_ordner",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "06.05.08",
    uraian: "Map Ordener-Bindex No.402 - 928",
    satuan: "buah",
    tarifHarga: 60000,
    kategori: "ATK & Bahan Habis Pakai"
  },
  {
    id: "bos_atk_buku_agenda",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "06.05.08",
    uraian: "Buku Agenda-KIKI Folio 100 Lembar",
    satuan: "buku",
    tarifHarga: 75000,
    kategori: "ATK & Bahan Habis Pakai"
  },
  {
    id: "bos_atk_tinta_stempel",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "06.05.08",
    uraian: "Tinta Stampel-Yamura Kecil",
    satuan: "buah",
    tarifHarga: 20000,
    kategori: "ATK & Bahan Habis Pakai"
  },
  {
    id: "bos_atk_sampul_rapor",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.01.01.0026",
    kodeProgram: "06.05.08",
    uraian: "Sampul Rapor/Folder Rapor Kurikulum Merdeka",
    satuan: "pcs",
    tarifHarga: 80000,
    kategori: "ATK & Bahan Habis Pakai"
  },
  {
    id: "bos_atk_fotokopi_admin",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.09",
    kegiatanNama: "Penggandaan Dokumen Administrasi Sekolah, Laporan SPJ & LPJ BOS Reguler",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "06.05.09",
    uraian: "Foto copy-A4/F4/Qwarto Penggandaan Dokumen SPJ & Administrasi BOS",
    satuan: "lembar",
    tarifHarga: 300,
    kategori: "ATK & Bahan Habis Pakai"
  },
  {
    id: "bos_atk_keyboard",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.03.02.0411",
    kodeProgram: "06.05.08",
    uraian: "Keyboard Komputer Administrasi Sekolah",
    satuan: "buah",
    tarifHarga: 150000,
    kategori: "Multimedia & Komputer"
  },
  {
    id: "bos_atk_mouse",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.03.02.0411",
    kodeProgram: "06.05.08",
    uraian: "Mouse komputer Administrasi Sekolah",
    satuan: "buah",
    tarifHarga: 75000,
    kategori: "Multimedia & Komputer"
  },
  {
    id: "bos_atk_baterai_laptop",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.08",
    kegiatanNama: "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah",
    kodeRekening: "5.1.02.03.02.0411",
    kodeProgram: "06.05.08",
    uraian: "Baterai untuk laptop oparator",
    satuan: "buah",
    tarifHarga: 450000,
    kategori: "Multimedia & Komputer"
  },

  // Standar 06: Konsumsi Rapat
  {
    id: "bos_konsumsi_rapat_bulanan",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.06",
    kegiatanNama: "Konsumsi Rapat Kedinasan dan Tamu Sekolah (diluar kegiatan lain)",
    kodeRekening: "5.1.02.01.01.0055",
    kodeProgram: "06.05.06",
    uraian: "Belanja makanan dan minuman tamu dan rapat kedinasan sekolah",
    satuan: "bulan",
    tarifHarga: 1200000,
    kategori: "Konsumsi Rapat"
  },
  {
    id: "bos_konsumsi_rapat_box",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.06",
    kegiatanNama: "Konsumsi Rapat Kedinasan dan Tamu Sekolah (diluar kegiatan lain)",
    kodeRekening: "5.1.02.01.01.0055",
    kodeProgram: "06.05.06",
    uraian: "Makan dan minum rapat dewan guru dan koordinasi komite",
    satuan: "box",
    tarifHarga: 40000,
    kategori: "Konsumsi Rapat"
  },
  {
    id: "bos_konsumsi_snack_rapat",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.05",
    subtemaNama: "Pelaksanaan Administrasi Kegiatan Sekolah",
    kegiatanKode: "06.05.06",
    kegiatanNama: "Konsumsi Rapat Kedinasan dan Tamu Sekolah (diluar kegiatan lain)",
    kodeRekening: "5.1.02.01.01.0055",
    kodeProgram: "06.05.06",
    uraian: "Snack / Kue Rapat Kedinasan dan Tamu Dinas",
    satuan: "box",
    tarifHarga: 25000,
    kategori: "Konsumsi Rapat"
  },

  // Standar 06: Daya dan Jasa
  {
    id: "bos_jasa_listrik",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.07",
    subtemaNama: "Pembiayaan Langganan Daya dan Jasa",
    kegiatanKode: "06.07.01",
    kegiatanNama: "Pembayaran daya listrik PLN Sekolah",
    kodeRekening: "5.1.02.02.01.0061",
    kodeProgram: "06.07.01",
    uraian: "Pembayaran Tagihan Listrik Sekolah",
    satuan: "bulan",
    tarifHarga: 1010000,
    kategori: "Daya dan Jasa",
    penerimaDefault: "PLN UP3 Jayapura",
    jabatanDefault: "Penyedia Daya Listrik"
  },
  {
    id: "bos_jasa_air",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.07",
    subtemaNama: "Pembiayaan Langganan Daya dan Jasa",
    kegiatanKode: "06.07.03",
    kegiatanNama: "Pembayaran langganan air PDAM Sekolah",
    kodeRekening: "5.1.02.02.01.0041",
    kodeProgram: "06.07.03",
    uraian: "Iuran langganan air bersih PDAM Sekolah",
    satuan: "bulan",
    tarifHarga: 500000,
    kategori: "Daya dan Jasa",
    penerimaDefault: "PDAM Jayapura",
    jabatanDefault: "Penyedia Layanan Air"
  },
  {
    id: "bos_jasa_internet",
    temaKode: "06",
    temaNama: "Standar Pengelolaan",
    subtemaKode: "06.07",
    subtemaNama: "Pembiayaan Langganan Daya dan Jasa",
    kegiatanKode: "06.07.05",
    kegiatanNama: "Pembayaran jasa internet / Wifi / Indihome Sekolah",
    kodeRekening: "5.1.02.02.01.0063",
    kodeProgram: "06.07.05",
    uraian: "Paket Indihome- / Langganan Akses Internet Wifi Sekolah",
    satuan: "bulan",
    tarifHarga: 800000,
    kategori: "Daya dan Jasa",
    penerimaDefault: "Telkom Indihome",
    jabatanDefault: "Penyedia Jasa Internet"
  },

  // Standar 07: Pembayaran Honor
  {
    id: "bos_honor_guru",
    temaKode: "07",
    temaNama: "Pengembangan Standar Pembiayaan",
    subtemaKode: "07.12",
    subtemaNama: "Pembayaran Honor",
    kegiatanKode: "07.12.04",
    kegiatanNama: "Pembayaran honor Tenaga Penunjang atau pelaksana / Guru Honorer",
    kodeRekening: "5.1.02.02.01.0013",
    kodeProgram: "07.12.04",
    uraian: "Honor Guru Honorer Non-ASN ber-NUPTK",
    satuan: "bulan",
    tarifHarga: 800000,
    kategori: "Honorarium",
    penerimaDefault: "Guru Honorer Sekolah",
    jabatanDefault: "Guru Mata Pelajaran"
  },
  {
    id: "bos_honor_operator",
    temaKode: "07",
    temaNama: "Pengembangan Standar Pembiayaan",
    subtemaKode: "07.12",
    subtemaNama: "Pembayaran Honor",
    kegiatanKode: "07.12.03",
    kegiatanNama: "Pembayaran Honor tenaga administrasi / Operator Sekolah",
    kodeRekening: "5.1.02.02.01.0011",
    kodeProgram: "07.12.03",
    uraian: "Jasa / Honor Operator Sekolah Pengelola Dapodik & ARKAS",
    satuan: "orang",
    tarifHarga: 6000000,
    kategori: "Honorarium",
    penerimaDefault: "Operator Sekolah SMPN 7",
    jabatanDefault: "Operator Dapodik & ARKAS"
  },
  {
    id: "bos_honor_satpam_kebersihan",
    temaKode: "07",
    temaNama: "Pengembangan Standar Pembiayaan",
    subtemaKode: "07.12",
    subtemaNama: "Pembayaran Honor",
    kegiatanKode: "07.12.05",
    kegiatanNama: "Pembayaran honor Tenaga Kebersihan / Penjaga Sekolah",
    kodeRekening: "5.1.02.02.01.0013",
    kodeProgram: "07.12.05",
    uraian: "Honor Tenaga Kebersihan dan Penjaga Keamanan Sekolah",
    satuan: "bulan",
    tarifHarga: 750000,
    kategori: "Honorarium",
    penerimaDefault: "Penjaga Sekolah",
    jabatanDefault: "Petugas Kebersihan / Keamanan"
  },
  {
    id: "bos_bea_materai",
    temaKode: "07",
    temaNama: "Pengembangan Standar Pembiayaan",
    subtemaKode: "07.13",
    subtemaNama: "Penatausahaan dan Pengelolaan Keuangan BOS",
    kegiatanKode: "07.13.01",
    kegiatanNama: "Pembelian Bea Materai untuk Kelengkapan SPJ dan Perpajakan BOS",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "07.13.01",
    uraian: "Pembelian Bea Materai 10.000 untuk SPJ dan Surat Pertanggungjawaban",
    satuan: "lembar",
    tarifHarga: 10000,
    kategori: "Penatausahaan BOS"
  },

  // Standar 05: Sarana & Prasarana
  {
    id: "bos_sarpras_babat_rumput",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.08",
    subtemaNama: "Pemeliharaan Sarana dan Prasarana Sekolah",
    kegiatanKode: "05.08.01",
    kegiatanNama: "Pemeliharaan Prasarana Lahan, Bangunan dan Ruang",
    kodeRekening: "5.1.02.03.03.0036",
    kodeProgram: "05.08.01",
    uraian: "Biaya Babat rumput taman, lapangan dan lahan kosong",
    satuan: "bulan",
    tarifHarga: 1500000,
    kategori: "Pemeliharaan Bangunan & Lahan"
  },
  {
    id: "bos_sarpras_atap_plafon",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.08",
    subtemaNama: "Pemeliharaan Sarana dan Prasarana Sekolah",
    kegiatanKode: "05.08.01",
    kegiatanNama: "Pemeliharaan Prasarana Lahan, Bangunan dan Ruang",
    kodeRekening: "5.1.02.03.03.0005",
    kodeProgram: "05.08.01",
    uraian: "Penggantian atap bocor, plafon dan pemasangan kawat pengaman Lab. Komputer",
    satuan: "set",
    tarifHarga: 4410000,
    kategori: "Pemeliharaan Bangunan & Lahan"
  },
  {
    id: "bos_sarpras_mesin_babat",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.08",
    subtemaNama: "Pemeliharaan Sarana dan Prasarana Sekolah",
    kegiatanKode: "05.08.01",
    kegiatanNama: "Pemeliharaan Prasarana Lahan, Bangunan dan Ruang",
    kodeRekening: "5.2.02.05.02.0003",
    kodeProgram: "05.08.01",
    uraian: "Mesin babat rumput-Sthil",
    satuan: "buah",
    tarifHarga: 2800000,
    kategori: "Pemeliharaan Bangunan & Lahan"
  },
  {
    id: "bos_sarpras_selang_air",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.08",
    subtemaNama: "Pemeliharaan Sarana dan Prasarana Sekolah",
    kegiatanKode: "05.08.10",
    kegiatanNama: "Pemeliharaan Perlengkapan Daya dan Jasa Sekolah",
    kodeRekening: "5.1.02.03.04.0076",
    kodeProgram: "05.08.10",
    uraian: "Pembelian Selang hitam 1 roll untuk penyiraman dan sanitasi",
    satuan: "rol",
    tarifHarga: 3500000,
    kategori: "Pemeliharaan Daya & Jasa"
  },
  {
    id: "bos_sarpras_lampu_philips18",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.08",
    subtemaNama: "Pemeliharaan Sarana dan Prasarana Sekolah",
    kegiatanKode: "05.08.09",
    kegiatanNama: "Pengadaan Perlengkapan Daya dan Jasa Sekolah",
    kodeRekening: "5.1.02.01.01.0031",
    kodeProgram: "05.08.09",
    uraian: "Lampu Philips-Philips 18 W LED Hemat Energi",
    satuan: "buah",
    tarifHarga: 65000,
    kategori: "Pemeliharaan Daya & Jasa"
  },
  {
    id: "bos_sarpras_lampu_philips40",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.08",
    subtemaNama: "Pemeliharaan Sarana dan Prasarana Sekolah",
    kegiatanKode: "05.08.09",
    kegiatanNama: "Pengadaan Perlengkapan Daya dan Jasa Sekolah",
    kodeRekening: "5.1.02.01.01.0031",
    kodeProgram: "05.08.09",
    uraian: "Lampu Philips-Philips 40 W untuk Ruang Kelas & Aula",
    satuan: "buah",
    tarifHarga: 200000,
    kategori: "Pemeliharaan Daya & Jasa"
  },
  {
    id: "bos_sarpras_stop_kontak",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.08",
    subtemaNama: "Pemeliharaan Sarana dan Prasarana Sekolah",
    kegiatanKode: "05.08.09",
    kegiatanNama: "Pengadaan Perlengkapan Daya dan Jasa Sekolah",
    kodeRekening: "5.1.02.01.01.0031",
    kodeProgram: "05.08.09",
    uraian: "Stop Kontak-4 LBG + Saklar + Kabel 5 meter",
    satuan: "buah",
    tarifHarga: 120000,
    kategori: "Pemeliharaan Daya & Jasa"
  },
  {
    id: "bos_sarpras_baterai_aa",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.08",
    subtemaNama: "Pemeliharaan Sarana dan Prasarana Sekolah",
    kegiatanKode: "05.08.09",
    kegiatanNama: "Pengadaan Perlengkapan Daya dan Jasa Sekolah",
    kodeRekening: "5.1.02.01.01.0031",
    kodeProgram: "05.08.09",
    uraian: "Baterai-Alkaline AA untuk Jam Dinding & Mic Wireless",
    satuan: "pasang",
    tarifHarga: 35000,
    kategori: "Pemeliharaan Daya & Jasa"
  },
  {
    id: "bos_sarpras_bola_futsal",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.08",
    subtemaNama: "Pemeliharaan Sarana dan Prasarana Sekolah",
    kegiatanKode: "05.08.02",
    kegiatanNama: "Pengadaan Peralatan Sekolah diluar komponen penyediaan alat multimedia",
    kodeRekening: "5.1.02.01.01.0034",
    kodeProgram: "05.08.02",
    uraian: "bola futsal- Standar Nasional",
    satuan: "buah",
    tarifHarga: 300000,
    kategori: "Peralatan Olahraga"
  },
  {
    id: "bos_sarpras_bola_voli",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.08",
    subtemaNama: "Pemeliharaan Sarana dan Prasarana Sekolah",
    kegiatanKode: "05.08.02",
    kegiatanNama: "Pengadaan Peralatan Sekolah diluar komponen penyediaan alat multimedia",
    kodeRekening: "5.1.02.01.01.0034",
    kodeProgram: "05.08.02",
    uraian: "bola volly- Mikasa Original",
    satuan: "buah",
    tarifHarga: 300000,
    kategori: "Peralatan Olahraga"
  },
  {
    id: "bos_sarpras_bola_kaki",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.08",
    subtemaNama: "Pemeliharaan Sarana dan Prasarana Sekolah",
    kegiatanKode: "05.08.02",
    kegiatanNama: "Pengadaan Peralatan Sekolah diluar komponen penyediaan alat multimedia",
    kodeRekening: "5.1.02.01.01.0034",
    kodeProgram: "05.08.02",
    uraian: "bola kaki (lap. Besar)-",
    satuan: "buah",
    tarifHarga: 300000,
    kategori: "Peralatan Olahraga"
  },
  {
    id: "bos_sarpras_net_voli",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.08",
    subtemaNama: "Pemeliharaan Sarana dan Prasarana Sekolah",
    kegiatanKode: "05.08.02",
    kegiatanNama: "Pengadaan Peralatan Sekolah diluar komponen penyediaan alat multimedia",
    kodeRekening: "5.1.02.01.01.0034",
    kodeProgram: "05.08.02",
    uraian: "net volly- Standar Pertandingan",
    satuan: "set",
    tarifHarga: 350000,
    kategori: "Peralatan Olahraga"
  },
  {
    id: "bos_sarpras_bola_basket",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.08",
    subtemaNama: "Pemeliharaan Sarana dan Prasarana Sekolah",
    kegiatanKode: "05.08.02",
    kegiatanNama: "Pengadaan Peralatan Sekolah diluar komponen penyediaan alat multimedia",
    kodeRekening: "5.1.02.01.01.0034",
    kodeProgram: "05.08.02",
    uraian: "bola basket- Size 7 Molten",
    satuan: "buah",
    tarifHarga: 350000,
    kategori: "Peralatan Olahraga"
  },

  // Standar 05 & 02: Buku Perpustakaan & Teks Utama
  {
    id: "bos_buku_ips_7",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.02",
    subtemaNama: "Pengembangan Perpustakaan",
    kegiatanKode: "05.02.03",
    kegiatanNama: "Pengadaan Buku Teks Utama/Pendamping Peserta Didik",
    kodeRekening: "5.2.05.01.01.0004",
    kodeProgram: "05.02.03",
    uraian: "Buku IPS Kelas 7 Kurikulum Merdeka",
    satuan: "eksemplar",
    tarifHarga: 121000,
    kategori: "Buku Teks & Perpustakaan"
  },
  {
    id: "bos_buku_bing_7",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.02",
    subtemaNama: "Pengembangan Perpustakaan",
    kegiatanKode: "05.02.03",
    kegiatanNama: "Pengadaan Buku Teks Utama/Pendamping Peserta Didik",
    kodeRekening: "5.2.05.01.01.0005",
    kodeProgram: "05.02.03",
    uraian: "Buku Bahasa Inggris Kelas 7",
    satuan: "eksemplar",
    tarifHarga: 120000,
    kategori: "Buku Teks & Perpustakaan"
  },
  {
    id: "bos_buku_matematika_7",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.02",
    subtemaNama: "Pengembangan Perpustakaan",
    kegiatanKode: "05.02.03",
    kegiatanNama: "Pengadaan Buku Teks Utama/Pendamping Peserta Didik",
    kodeRekening: "5.2.05.01.01.0006",
    kodeProgram: "05.02.03",
    uraian: "Buku Matematika Kelas 7",
    satuan: "eksemplar",
    tarifHarga: 132000,
    kategori: "Buku Teks & Perpustakaan"
  },
  {
    id: "bos_buku_ipa_7",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.02",
    subtemaNama: "Pengembangan Perpustakaan",
    kegiatanKode: "05.02.03",
    kegiatanNama: "Pengadaan Buku Teks Utama/Pendamping Peserta Didik",
    kodeRekening: "5.2.05.01.01.0006",
    kodeProgram: "05.02.03",
    uraian: "Buku IPA kelas 7",
    satuan: "eksemplar",
    tarifHarga: 121000,
    kategori: "Buku Teks & Perpustakaan"
  },
  {
    id: "bos_buku_pancasila_7",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.02",
    subtemaNama: "Pengembangan Perpustakaan",
    kegiatanKode: "05.02.03",
    kegiatanNama: "Pengadaan Buku Teks Utama/Pendamping Peserta Didik",
    kodeRekening: "5.2.05.01.01.0001",
    kodeProgram: "05.02.03",
    uraian: "Buku Pendidikan Pancasila Kelas 7",
    satuan: "eksemplar",
    tarifHarga: 87000,
    kategori: "Buku Teks & Perpustakaan"
  },
  {
    id: "bos_buku_bindo_7",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.02",
    subtemaNama: "Pengembangan Perpustakaan",
    kegiatanKode: "05.02.03",
    kegiatanNama: "Pengadaan Buku Teks Utama/Pendamping Peserta Didik",
    kodeRekening: "5.2.05.01.01.0005",
    kodeProgram: "05.02.03",
    uraian: "Buku Bahasa Indonesia Kelas 7",
    satuan: "eksemplar",
    tarifHarga: 130000,
    kategori: "Buku Teks & Perpustakaan"
  },
  {
    id: "bos_buku_pjok_7",
    temaKode: "05",
    temaNama: "Standar Sarana dan Prasarana",
    subtemaKode: "05.02",
    subtemaNama: "Pengembangan Perpustakaan",
    kegiatanKode: "05.02.03",
    kegiatanNama: "Pengadaan Buku Teks Utama/Pendamping Peserta Didik",
    kodeRekening: "5.2.05.01.01.0008",
    kodeProgram: "05.02.03",
    uraian: "Buku Mari Berolahraga Kelas 7 (PJOK)",
    satuan: "eksemplar",
    tarifHarga: 94500,
    kategori: "Buku Teks & Perpustakaan"
  },

  // Standar 04: Pendidik & Tenaga Kependidikan (KKG/MGMP)
  {
    id: "bos_ptk_transport_mgmp",
    temaKode: "04",
    temaNama: "Standar Tenaga Kependidikan",
    subtemaKode: "04.06",
    subtemaNama: "Pengembangan Profesi Pendidik dan Tenaga Kependidikan",
    kegiatanKode: "04.06.02",
    kegiatanNama: "Kegiatan Komunitas Belajar antar sekolah (termasuk KKG, MGMP, MGMPS, KKKS)",
    kodeRekening: "5.1.02.04.01.0003",
    kodeProgram: "04.06.02",
    uraian: "Biaya Transportasi Perjalanan Dinas Dalam Daerah Kabupaten - Komunitas Belajar MGMP/KKG Distrik (PP)",
    satuan: "orang / kegiatan",
    tarifHarga: 50000,
    kategori: "Pengembangan Guru (KKG/MGMP)"
  },
  {
    id: "bos_ptk_fotokopi_modul",
    temaKode: "04",
    temaNama: "Standar Tenaga Kependidikan",
    subtemaKode: "04.06",
    subtemaNama: "Pengembangan Profesi Pendidik dan Tenaga Kependidikan",
    kegiatanKode: "04.06.25",
    kegiatanNama: "Peningkatan Kompetensi Guru untuk pembelajaran berorientasi pada peserta didik",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "04.06.25",
    uraian: "Foto copy-A4/F4/Qwarto Modul Peningkatan Kompetensi Guru",
    satuan: "lembar",
    tarifHarga: 300,
    kategori: "Pengembangan Guru (KKG/MGMP)"
  },

  // Standar 03: Standar Proses (PPDB, Ekstrakurikuler, Pramuka)
  {
    id: "bos_proses_spanduk_ppdb",
    temaKode: "03",
    temaNama: "Standar Proses",
    subtemaKode: "03.01",
    subtemaNama: "Penerimaan Peserta Didik Baru (PPDB)",
    kegiatanKode: "03.01.01",
    kegiatanNama: "Pelaksanaan Pendaftaran Peserta Didik Baru (PPDB)",
    kodeRekening: "5.1.02.01.01.0026",
    kodeProgram: "03.01.01",
    uraian: "Cetak Spanduk/baliho Sosialisasi PPDB",
    satuan: "meter",
    tarifHarga: 50000,
    kategori: "PPDB (Penerimaan Siswa Baru)"
  },
  {
    id: "bos_proses_fotokopi_ppdb",
    temaKode: "03",
    temaNama: "Standar Proses",
    subtemaKode: "03.01",
    subtemaNama: "Penerimaan Peserta Didik Baru (PPDB)",
    kegiatanKode: "03.01.01",
    kegiatanNama: "Pelaksanaan Pendaftaran Peserta Didik Baru (PPDB)",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "03.01.01",
    uraian: "Foto copy-A4/F4/Qwarto Formulir Pendaftaran PPDB",
    satuan: "lembar",
    tarifHarga: 300,
    kategori: "PPDB (Penerimaan Siswa Baru)"
  },
  {
    id: "bos_proses_konsumsi_ppdb",
    temaKode: "03",
    temaNama: "Standar Proses",
    subtemaKode: "03.01",
    subtemaNama: "Penerimaan Peserta Didik Baru (PPDB)",
    kegiatanKode: "03.01.01",
    kegiatanNama: "Pelaksanaan Pendaftaran Peserta Didik Baru (PPDB)",
    kodeRekening: "5.1.02.01.01.0055",
    kodeProgram: "03.01.01",
    uraian: "Makan dan minum selama pelaksanaan PPDB Panitia Sekolah",
    satuan: "box",
    tarifHarga: 40000,
    kategori: "PPDB (Penerimaan Siswa Baru)"
  },
  {
    id: "bos_proses_honor_pramuka",
    temaKode: "03",
    temaNama: "Standar Proses",
    subtemaKode: "03.03",
    subtemaNama: "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler",
    kegiatanKode: "03.03.06",
    kegiatanNama: "Pelaksanaan Ekstrakurikuler Kepramukaan",
    kodeRekening: "5.1.02.02.01.0011",
    kodeProgram: "03.03.06",
    uraian: "Honorarium Penyelenggaraan Kegiatan Pendidikan - Pembina / Pelatih Pramuka",
    satuan: "orang / bulan",
    tarifHarga: 500000,
    kategori: "Ekstrakurikuler & Kepramukaan",
    penerimaDefault: "Pembina Pramuka Gugus Depan",
    jabatanDefault: "Pembina Pramuka"
  },
  {
    id: "bos_proses_narsum_pramuka",
    temaKode: "03",
    temaNama: "Standar Proses",
    subtemaKode: "03.03",
    subtemaNama: "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler",
    kegiatanKode: "03.03.06",
    kegiatanNama: "Pelaksanaan Ekstrakurikuler Kepramukaan",
    kodeRekening: "5.1.02.02.01.0003",
    kodeProgram: "03.03.06",
    uraian: "Honorarium Nara Sumber/Pengajar/Penceramah Perkemahan Pramuka",
    satuan: "orang",
    tarifHarga: 250000,
    kategori: "Ekstrakurikuler & Kepramukaan",
    penerimaDefault: "Narasumber Kwarcab",
    jabatanDefault: "Narasumber / Instruktur"
  },
  {
    id: "bos_proses_konsumsi_kemah",
    temaKode: "03",
    temaNama: "Standar Proses",
    subtemaKode: "03.03",
    subtemaNama: "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler",
    kegiatanKode: "03.03.06",
    kegiatanNama: "Pelaksanaan Ekstrakurikuler Kepramukaan",
    kodeRekening: "5.1.02.01.01.0055",
    kodeProgram: "03.03.06",
    uraian: "Makan dan minum selama pelaksanaan perkemahan pramuka",
    satuan: "box",
    tarifHarga: 40000,
    kategori: "Ekstrakurikuler & Kepramukaan"
  },

  // Standar 08: Penilaian Pendidikan (Asesmen, ANBK, UTS/UAS)
  {
    id: "bos_penilaian_fotokopi_soal",
    temaKode: "08",
    temaNama: "Standar Penilaian Pendidikan",
    subtemaKode: "08.04",
    subtemaNama: "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran",
    kegiatanKode: "08.04.06",
    kegiatanNama: "Pelaksanaan penilaian sumatif (ulangan tengah semester/akhir semester)",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "08.04.06",
    uraian: "Foto copy-A4/F4/Qwarto Naskah Soal Penilaian Sumatif (UTS/UAS)",
    satuan: "lembar",
    tarifHarga: 300,
    kategori: "Asesmen & Ujian Sekolah"
  },
  {
    id: "bos_penilaian_amplop_soal",
    temaKode: "08",
    temaNama: "Standar Penilaian Pendidikan",
    subtemaKode: "08.04",
    subtemaNama: "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran",
    kegiatanKode: "08.04.06",
    kegiatanNama: "Pelaksanaan penilaian sumatif (ulangan tengah semester/akhir semester)",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "08.04.06",
    uraian: "Cetak Amplop Dinas-Amplop Coklat A3 isi 100 lembar untuk Naskah Ujian",
    satuan: "pak",
    tarifHarga: 150000,
    kategori: "Asesmen & Ujian Sekolah"
  },
  {
    id: "bos_penilaian_spanduk_ujian",
    temaKode: "08",
    temaNama: "Standar Penilaian Pendidikan",
    subtemaKode: "08.04",
    subtemaNama: "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran",
    kegiatanKode: "08.04.06",
    kegiatanNama: "Pelaksanaan penilaian sumatif (ulangan tengah semester/akhir semester)",
    kodeRekening: "5.1.02.01.01.0026",
    kodeProgram: "08.04.06",
    uraian: "Cetak Spanduk/baliho Pelaksanaan Asesmen Sumatif / ANBK",
    satuan: "meter",
    tarifHarga: 50000,
    kategori: "Asesmen & Ujian Sekolah"
  },
  {
    id: "bos_penilaian_konsumsi_ujian",
    temaKode: "08",
    temaNama: "Standar Penilaian Pendidikan",
    subtemaKode: "08.04",
    subtemaNama: "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran",
    kegiatanKode: "08.04.06",
    kegiatanNama: "Pelaksanaan penilaian sumatif (ulangan tengah semester/akhir semester)",
    kodeRekening: "5.1.02.01.01.0055",
    kodeProgram: "08.04.06",
    uraian: "Makan dan minum pengawas selama pelaksanaan Ujian Sekolah / ANBK",
    satuan: "box",
    tarifHarga: 40000,
    kategori: "Asesmen & Ujian Sekolah"
  },
  {
    id: "bos_penilaian_id_card",
    temaKode: "08",
    temaNama: "Standar Penilaian Pendidikan",
    subtemaKode: "08.04",
    subtemaNama: "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran",
    kegiatanKode: "08.04.13",
    kegiatanNama: "Tes kemampuan akademik peserta didik (TKA) dan Try Out",
    kodeRekening: "5.1.02.01.01.0024",
    kodeProgram: "08.04.13",
    uraian: "Id Card/ Kartu Identitas Peserta Ujian - Gantung/Jepit",
    satuan: "buah",
    tarifHarga: 10000,
    kategori: "Asesmen & Ujian Sekolah"
  },
  {
    id: "bos_penilaian_honor_pengawas",
    temaKode: "08",
    temaNama: "Standar Penilaian Pendidikan",
    subtemaKode: "08.04",
    subtemaNama: "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran",
    kegiatanKode: "08.04.08",
    kegiatanNama: "Pelaksanaan Penilaian/Asesmen Sekolah Berbasis Komputer (ANBK)",
    kodeRekening: "5.1.02.02.01.0009",
    kodeProgram: "08.04.08",
    uraian: "Honorarium Pengawas Ujian Asesmen Nasional (ANBK) / Gladi Bersih",
    satuan: "orang / hari",
    tarifHarga: 200000,
    kategori: "Asesmen & Ujian Sekolah",
    penerimaDefault: "Pengawas Ruang ANBK",
    jabatanDefault: "Pengawas Ujian"
  },
  {
    id: "bos_penilaian_workshop_iht",
    temaKode: "08",
    temaNama: "Standar Penilaian Pendidikan",
    subtemaKode: "08.06",
    subtemaNama: "Pengembangan Profesi Pendidik dan Tenaga Kependidikan",
    kegiatanKode: "08.06.01",
    kegiatanNama: "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP",
    kodeRekening: "5.1.02.02.01.0011",
    kodeProgram: "08.06.01",
    uraian: "Honorarium Pengajar - Penanggungjawab Program Workshop Asesmen & P5",
    satuan: "kegiatan",
    tarifHarga: 600000,
    kategori: "Pelatihan & Workshop Asesmen",
    penerimaDefault: "Narasumber IHT Asesmen",
    jabatanDefault: "Instruktur / PJ Workshop"
  },
  {
    id: "bos_penilaian_konsumsi_iht",
    temaKode: "08",
    temaNama: "Standar Penilaian Pendidikan",
    subtemaKode: "08.06",
    subtemaNama: "Pengembangan Profesi Pendidik dan Tenaga Kependidikan",
    kegiatanKode: "08.06.01",
    kegiatanNama: "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP",
    kodeRekening: "5.1.02.01.01.0055",
    kodeProgram: "08.06.01",
    uraian: "Makan dan Minum selama pelaksanaan workshop IHT Asesmen",
    satuan: "box",
    tarifHarga: 40000,
    kategori: "Pelatihan & Workshop Asesmen"
  },
  {
    id: "bos_penilaian_snack_iht",
    temaKode: "08",
    temaNama: "Standar Penilaian Pendidikan",
    subtemaKode: "08.06",
    subtemaNama: "Pengembangan Profesi Pendidik dan Tenaga Kependidikan",
    kegiatanKode: "08.06.01",
    kegiatanNama: "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP",
    kodeRekening: "5.1.02.01.01.0055",
    kodeProgram: "08.06.01",
    uraian: "Kue Coffe Break Selama pelaksanaan Workshop IHT Asesmen",
    satuan: "orang / paket",
    tarifHarga: 30000,
    kategori: "Pelatihan & Workshop Asesmen"
  }
];

// Helper functions for easy lookup
export const getSubtemasByTema = (temaKode: string): SubtemaProgram[] => {
  return SUBTEMA_PROGRAM_LIST.filter((s) => s.temaKode === temaKode);
};

export const getBosItemsByTema = (temaKode: string): BosRegulerItemTemplate[] => {
  return BOS_REGULER_ITEM_TEMPLATES.filter((it) => it.temaKode === temaKode);
};

export const getBosItemsBySubtema = (subtemaKode: string): BosRegulerItemTemplate[] => {
  return BOS_REGULER_ITEM_TEMPLATES.filter((it) => it.subtemaKode === subtemaKode);
};
