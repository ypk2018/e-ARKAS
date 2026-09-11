import { MonthWorksheet, KertasKerjaItem } from '../types';

let idCounter = 1;
const makeItem = (
  noUrut: number,
  kodeRek: string,
  kodeProg: string,
  uraian: string,
  vol: number,
  satuan: string,
  tarif: number,
  temaId: string,
  temaNama: string,
  subtemaKode: string,
  subtemaNama: string,
  kegiatanKode = "",
  kegiatanNama = "",
  penerima = "",
  jabatan = ""
): KertasKerjaItem => ({
  id: `kki_${idCounter++}`,
  noUrut,
  kodeRekening: kodeRek,
  kodeProgram: kodeProg,
  uraian,
  volume: vol,
  satuan,
  tarifHarga: tarif,
  jumlah: vol * tarif,
  temaId,
  temaNama,
  subtemaKode,
  subtemaNama,
  kegiatanKode: kegiatanKode || kodeProg,
  kegiatanNama: kegiatanNama || uraian,
  penerimaDefault: penerima,
  jabatanDefault: jabatan,
});

export const INITIAL_KERTAS_KERJA_DATA: MonthWorksheet[] = [
  // 1. JANUARI 2026 (Total: 43.405.000)
  {
    bulanKey: "januari",
    bulanNama: "Januari 2026",
    bulanIndex: 0,
    totalPenerimaan: 340000000,
    items: [
      makeItem(1, "5.1.02.04.01.0003", "04.06.02", "Biaya Transportasi Perjalanan Dinas Dalam Daerah Kabupaten - Transportasi Darat Dari Ibu Kota Kabupaten ke Distrik (PP) Tim - Distrik Sentani/Hinekombe--", 30, "orang / kegiatan", 50000, "04", "Standar Tenaga Kependidikan", "04.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "04.06.02", "Kegiatan Komunitas Belajar antar sekolah (termasuk KKG, MGMP, MGMPS, MGMPK, KKKS, atau MKKS)"),
      makeItem(2, "5.1.02.01.01.0024", "04.06.25", "Foto copy-A4/F4/Qwarto (Hitam putih)", 9000, "lembar", 300, "04", "Standar Tenaga Kependidikan", "04.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "04.06.25", "Peningkatan Kompetensi Guru untuk pembelajaran berorientasi pada peserta didik"),
      makeItem(3, "5.1.02.03.03.0005", "05.08.01", "Penggantian atap bocor, plafon dan pemasangan kawat pengaman Lab. Komputer", 1, "set", 4410000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.01", "Pemeliharaan Prasarana Lahan, Bangunan dan Ruang"),
      makeItem(4, "5.1.02.03.03.0036", "05.08.01", "Biaya Babat rumput taman, lapangan dan lahan kosong", 1, "bulan", 1500000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.01", "Pemeliharaan Prasarana Lahan, Bangunan dan Ruang"),
      makeItem(5, "5.2.02.05.02.0003", "05.08.01", "Mesin babat rumput-Sthil", 1, "buah", 2800000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.01", "Pemeliharaan Prasarana Lahan, Bangunan dan Ruang"),
      makeItem(6, "5.1.02.01.01.0034", "05.08.02", "bola futsal-", 4, "buah", 300000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.02", "Pengadaan Peralatan Sekolah diluar komponen penyediaan alat multimedia pembelajaran"),
      makeItem(7, "5.1.02.01.01.0034", "05.08.02", "bola volly-", 4, "buah", 300000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.02", "Pengadaan Peralatan Sekolah diluar komponen penyediaan alat multimedia pembelajaran"),
      makeItem(8, "5.1.02.01.01.0034", "05.08.02", "bola kaki (lap. Besar)-", 2, "buah", 300000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.02", "Pengadaan Peralatan Sekolah diluar komponen penyediaan alat multimedia pembelajaran"),
      makeItem(9, "5.1.02.01.01.0034", "05.08.02", "net volly-", 1, "set", 350000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.02", "Pengadaan Peralatan Sekolah diluar komponen penyediaan alat multimedia pembelajaran"),
      makeItem(10, "5.1.02.01.01.0034", "05.08.02", "bola basket-", 1, "buah", 350000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.02", "Pengadaan Peralatan Sekolah diluar komponen penyediaan alat multimedia pembelajaran"),
      makeItem(11, "5.1.02.03.04.0076", "05.08.10", "Pembelian Selang hitam 1 roll", 1, "rol", 3500000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.10", "Pemeliharaan Perlengkapan Daya dan Jasa Sekolah (instalasi air, listrik, internet, termasuk genset/panel surya)"),
      makeItem(12, "5.1.02.01.01.0055", "06.05.06", "Belanja makanan dan minuman tamu dan rapat", 1, "bulan", 1200000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.06", "Konsumsi Rapat Kedinasan dan Tamu Sekolah (diluar kegiatan lain)"),
      makeItem(13, "5.1.02.01.01.0024", "06.05.08", "Spidol-Snowman White Board G-12", 120, "buah", 12000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah"),
      makeItem(14, "5.1.02.01.01.0024", "06.05.08", "Map Batik-Map Batik Motif Papua Kertas", 3, "pak", 150000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah"),
      makeItem(15, "5.1.02.01.01.0024", "06.05.08", "Map Kertas-Diamond isi 50 lembar", 4, "pak", 200000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah"),
      makeItem(16, "5.1.02.01.01.0024", "06.05.08", "Penggaris-Butterfly Pelastik 30 cm", 30, "buah", 12000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah"),
      makeItem(17, "5.1.02.01.01.0024", "06.05.08", "Buku Agenda-KIKI Folio 100 Lembar", 5, "buku", 75000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah"),
      makeItem(18, "5.1.02.01.01.0025", "06.05.08", "Kertas HVS-Bola Dunia A4 / 70 Gram", 20, "rim", 65000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah"),
      makeItem(19, "5.1.02.01.01.0025", "06.05.08", "Kertas HVS-Bola Dunia F4 / 70 Gram", 25, "rim", 70000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah"),
      makeItem(20, "5.1.02.03.02.0115", "06.05.08", "Tinta Printer 003 Warna Hitam", 6, "botol", 100000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah"),
      makeItem(21, "5.1.02.03.02.0115", "06.05.08", "TInta Printer 003 warna ( Y / M / C )", 9, "botol", 100000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah"),
      makeItem(22, "5.1.02.02.01.0061", "06.07.01", "Pembayaran Tagihan Listrik Sekolah", 2, "bulan", 1010000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.01", "Pembayaran daya listrik", "PLN UP3 Jayapura", "Penyedia Daya Listrik"),
      makeItem(23, "5.1.02.02.01.0041", "06.07.03", "Iuran langganan air", 1, "bulan", 500000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.03", "Pembayaran langganan air", "PDAM Jayapura", "Penyedia Layanan Air"),
      makeItem(24, "5.1.02.02.01.0063", "06.07.05", "Paket Indihome-", 1, "bulan", 800000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.05", "Pembayaran jasa internet", "Telkom Indihome", "Penyedia Jasa Internet"),
      makeItem(25, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Levina Katerina Fere, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Pembayaran honor Tenaga Penunjang atau pelaksana", "Levina Katerina Fere, S.Pd", "Guru Honorer"),
      makeItem(26, "5.1.02.02.01.0013", "07.12.04", "Gaji Guru atas nama Yoice Dike, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Pembayaran honor Tenaga Penunjang atau pelaksana", "Yoice Dike, S.Pd", "Guru Honorer"),
      makeItem(27, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Kostantina Ovide", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Pembayaran honor Tenaga Penunjang atau pelaksana", "Kostantina Ovide", "Guru Honorer"),
      makeItem(28, "5.1.02.01.01.0026", "08.06.01", "Cetak Spanduk/baliho--", 3, "meter", 50000, "08", "Standar Penilaian Pendidikan", "08.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "08.06.01", "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Pelatihan, Workshop)"),
      makeItem(29, "5.1.02.01.01.0055", "08.06.01", "Makan dan Minum selama pelaksanaan workshop", 90, "box", 40000, "08", "Standar Penilaian Pendidikan", "08.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "08.06.01", "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Pelatihan, Workshop)"),
      makeItem(30, "5.1.02.01.01.0055", "08.06.01", "Kue Coffe Break Selama pelaksanaan Workshop", 90, "orang / paket", 30000, "08", "Standar Penilaian Pendidikan", "08.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "08.06.01", "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Pelatihan, Workshop)"),
      makeItem(31, "5.1.02.02.01.0011", "08.06.01", "Honorarium Pengajar - Penanggungjawab Program-", 1, "kegiatan", 600000, "08", "Standar Penilaian Pendidikan", "08.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "08.06.01", "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Pelatihan, Workshop)"),
      makeItem(32, "5.1.02.02.01.0011", "08.06.01", "Honorarium Pengajar - Benchmarking - Panitia LOKUS-", 3, "kegiatan", 450000, "08", "Standar Penilaian Pendidikan", "08.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "08.06.01", "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Pelatihan, Workshop)")
    ]
  },

  // 2. FEBRUARI 2026 (Total: 39.055.000)
  {
    bulanKey: "februari",
    bulanNama: "Februari 2026",
    bulanIndex: 1,
    totalPenerimaan: 340000000,
    items: [
      makeItem(1, "5.1.02.04.01.0003", "04.06.02", "Biaya Transportasi Perjalanan Dinas Dalam Daerah Kabupaten - Transportasi Darat Dari Ibu Kota Kabupaten ke Distrik (PP) Tim - Distrik Sentani/Hinekombe--", 60, "orang / kegiatan", 50000, "04", "Standar Tenaga Kependidikan", "04.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "04.06.02", "Kegiatan Komunitas Belajar antar sekolah"),
      makeItem(2, "5.2.05.01.01.0004", "05.02.03", "Buku IPS Kelas 7", 15, "eksemplar", 121000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks Utama/Pendamping Peserta Didik"),
      makeItem(3, "5.2.05.01.01.0004", "05.02.03", "Buku IPS Kelas 8", 15, "eksemplar", 121000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks Utama/Pendamping Peserta Didik"),
      makeItem(4, "5.2.05.01.01.0004", "05.02.03", "Buku IPS Kelas 9", 15, "eksemplar", 131000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks Utama/Pendamping Peserta Didik"),
      makeItem(5, "5.2.05.01.01.0005", "05.02.03", "Buku Bahasa Inggris Kelas 7", 15, "eksemplar", 120000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks Utama/Pendamping Peserta Didik"),
      makeItem(6, "5.2.05.01.01.0005", "05.02.03", "Buku Bahasa Inggris Kelas 8", 15, "eksemplar", 120000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks Utama/Pendamping Peserta Didik"),
      makeItem(7, "5.2.05.01.01.0005", "05.02.03", "Buku Bahasa Inggris Kelas 9", 15, "eksemplar", 108000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks Utama/Pendamping Peserta Didik"),
      makeItem(8, "5.2.05.01.01.0006", "05.02.03", "Buku Matematika Kelas 7", 20, "eksemplar", 132000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks Utama/Pendamping Peserta Didik"),
      makeItem(9, "5.2.05.01.01.0006", "05.02.03", "Buku Matematika kelas 8", 20, "eksemplar", 135000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks Utama/Pendamping Peserta Didik"),
      makeItem(10, "5.2.05.01.01.0006", "05.02.03", "Buku Matematika kelas 9", 20, "eksemplar", 135000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks Utama/Pendamping Peserta Didik"),
      makeItem(11, "5.2.05.01.01.0006", "05.02.03", "Buku IPA kelas 7", 15, "eksemplar", 121000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks Utama/Pendamping Peserta Didik"),
      makeItem(12, "5.2.05.01.01.0006", "05.02.03", "Buku IPA Kelas 8", 15, "eksemplar", 121000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks Utama/Pendamping Peserta Didik"),
      makeItem(13, "5.2.05.01.01.0006", "05.02.03", "Buku IPA kelas 9", 15, "eksemplar", 120000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks Utama/Pendamping Peserta Didik"),
      makeItem(14, "5.1.02.03.03.0036", "05.08.01", "Biaya Babat rumput taman, lapangan dan lahan kosong", 1, "bulan", 1500000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.01", "Pemeliharaan Prasarana Lahan, Bangunan dan Ruang"),
      makeItem(15, "5.1.02.01.01.0055", "06.05.06", "Belanja makanan dan minuman tamu dan rapat", 1, "bulan", 1200000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.06", "Konsumsi Rapat Kedinasan dan Tamu Sekolah"),
      makeItem(16, "5.1.02.01.01.0024", "06.05.08", "Pulpen-Faster", 50, "buah", 7000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai ATK"),
      makeItem(17, "5.1.02.01.01.0024", "06.05.08", "Staples-Joyoko HD 10", 30, "buah", 25000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai ATK"),
      makeItem(18, "5.1.02.01.01.0024", "06.05.08", "Isi Staples-Max No.10", 60, "kotak", 10000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai ATK"),
      makeItem(19, "5.1.02.03.02.0411", "06.05.08", "Keyboard Komputer", 6, "buah", 150000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai Multimedia"),
      makeItem(20, "5.1.02.03.02.0411", "06.05.08", "Mouse komputer", 10, "buah", 75000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai Multimedia"),
      makeItem(21, "5.1.02.02.01.0061", "06.07.01", "Pembayaran Tagihan Listrik Sekolah", 2, "bulan", 1010000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.01", "Pembayaran daya listrik"),
      makeItem(22, "5.1.02.02.01.0041", "06.07.03", "Iuran langganan air", 1, "bulan", 500000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.03", "Pembayaran langganan air"),
      makeItem(23, "5.1.02.02.01.0063", "06.07.05", "Paket Indihome-", 1, "bulan", 800000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.05", "Pembayaran jasa internet"),
      makeItem(24, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Levina Katerina Fere, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Levina Katerina Fere, S.Pd", "Guru Honorer"),
      makeItem(25, "5.1.02.02.01.0013", "07.12.04", "Gaji Guru atas nama Yoice Dike, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Yoice Dike, S.Pd", "Guru Honorer"),
      makeItem(26, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Kostantina Ovide", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Kostantina Ovide", "Guru Honorer")
    ]
  },

  // 3. MARET 2026 (Total: 30.830.000)
  {
    bulanKey: "maret",
    bulanNama: "Maret 2026",
    bulanIndex: 2,
    totalPenerimaan: 340000000,
    items: [
      makeItem(1, "5.1.02.04.01.0003", "04.06.02", "Biaya Transportasi Perjalanan Dinas Dalam Daerah Kabupaten - Transportasi Darat Dari Ibu Kota Kabupaten ke Distrik (PP) Tim - Distrik Sentani/Hinekombe--", 30, "orang / kegiatan", 50000, "04", "Standar Tenaga Kependidikan", "04.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "04.06.02", "Kegiatan Komunitas Belajar antar sekolah"),
      makeItem(2, "5.1.02.03.03.0036", "05.08.01", "Biaya Babat rumput taman, lapangan dan lahan kosong", 1, "bulan", 1500000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.01", "Pemeliharaan Prasarana Lahan, Bangunan dan Ruang"),
      makeItem(3, "5.1.02.01.01.0055", "06.05.06", "Belanja makanan dan minuman tamu dan rapat", 1, "bulan", 1200000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.06", "Konsumsi Rapat Kedinasan dan Tamu Sekolah"),
      makeItem(4, "5.1.02.02.01.0061", "06.07.01", "Pembayaran Tagihan Listrik Sekolah", 2, "bulan", 1010000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.01", "Pembayaran daya listrik"),
      makeItem(5, "5.1.02.02.01.0041", "06.07.03", "Iuran langganan air", 1, "bulan", 500000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.03", "Pembayaran langganan air"),
      makeItem(6, "5.1.02.02.01.0063", "06.07.05", "Paket Indihome-", 1, "bulan", 800000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.05", "Pembayaran jasa internet"),
      makeItem(7, "5.1.02.02.01.0011", "07.12.03", "Jasa / Honor Operator Sekolah", 1, "orang", 6000000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.03", "Pembayaran Honor tenaga administrasi", "Operator Sekolah SMPN 7", "Operator Sekolah"),
      makeItem(8, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Levina Katerina Fere, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Levina Katerina Fere, S.Pd", "Guru Honorer"),
      makeItem(9, "5.1.02.02.01.0013", "07.12.04", "Gaji Guru atas nama Yoice Dike, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Yoice Dike, S.Pd", "Guru Honorer"),
      makeItem(10, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Kostantina Ovide", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Kostantina Ovide", "Guru Honorer"),
      makeItem(11, "5.1.02.01.01.0024", "08.04.06", "Foto copy-A4/F4/Qwarto (Hitam putih)", 10800, "lembar", 300, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (ulangan tengah semester/UTS Genap)"),
      makeItem(12, "5.1.02.01.01.0024", "08.04.06", "Cetak Amplop Dinas-Amplop Coklat A3 isi 100 lembar", 1, "pak", 150000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (ulangan tengah semester/UTS Genap)"),
      makeItem(13, "5.1.02.01.01.0026", "08.04.06", "Cetak Spanduk/baliho--", 3, "meter", 50000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (ulangan tengah semester/UTS Genap)"),
      makeItem(14, "5.1.02.01.01.0055", "08.04.06", "Makan dan minum selama pelaksanaan UTS Genap", 150, "box", 40000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (ulangan tengah semester/UTS Genap)"),
      makeItem(15, "5.1.02.01.01.0024", "08.04.13", "Id Card/ Kartu Identitas-Gantung/Jepit", 82, "buah", 10000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.13", "Tes kemampuan akademik peserta didik (TKA)"),
      makeItem(16, "5.1.02.01.01.0026", "08.04.13", "Cetak Spanduk/baliho--", 3, "meter", 50000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.13", "Tes kemampuan akademik peserta didik (TKA)"),
      makeItem(17, "5.1.02.01.01.0055", "08.04.13", "Makan dan Minum selama pelaksanaan TKA", 60, "box", 40000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.13", "Tes kemampuan akademik peserta didik (TKA)"),
      makeItem(18, "5.1.02.02.01.0009", "08.04.13", "Honorarium Penyelenggara Ujian Tingkat Pendidikan Menengah - Pengawas Ujian-", 20, "orang / hari", 100000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.13", "Tes kemampuan akademik peserta didik (TKA)", "Panitia Pengawas TKA", "Pengawas Ujian")
    ]
  },

  // 4. APRIL 2026 (Total: 35.952.000)
  {
    bulanKey: "april",
    bulanNama: "April 2026",
    bulanIndex: 3,
    totalPenerimaan: 340000000,
    items: [
      makeItem(1, "5.1.02.01.01.0001", "02.02.01", "Triplek 120.240. x 9mm WP I (Radius 0 - 20 Km Sentani)-", 2, "lembar", 175000, "02", "Pengembangan Standar Isi", "02.02", "Pengembangan Perpustakaan", "02.02.01", "Kegiatan pemberdayaan perpustakaan terutama untuk pengembangan minat baca peserta didik"),
      makeItem(2, "5.1.02.01.01.0031", "02.02.01", "Stop Kontak-4 LBG + Saklar + Kabel", 4, "buah", 120000, "02", "Pengembangan Standar Isi", "02.02", "Pengembangan Perpustakaan", "02.02.01", "Kegiatan pemberdayaan perpustakaan terutama untuk pengembangan minat baca peserta didik"),
      makeItem(3, "5.1.02.01.01.0031", "02.02.01", "Lampu Philips-Philips 40 W", 2, "buah", 200000, "02", "Pengembangan Standar Isi", "02.02", "Pengembangan Perpustakaan", "02.02.01", "Kegiatan pemberdayaan perpustakaan terutama untuk pengembangan minat baca peserta didik"),
      makeItem(4, "5.1.02.04.01.0003", "04.06.02", "Biaya Transportasi Perjalanan Dinas Dalam Daerah Kabupaten - Transportasi Darat Dari Ibu Kota Kabupaten ke Distrik (PP) Tim - Distrik Sentani/Hinekombe--", 30, "orang / kegiatan", 50000, "04", "Standar Tenaga Kependidikan", "04.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "04.06.02", "Kegiatan Komunitas Belajar antar sekolah"),
      makeItem(5, "5.1.02.03.03.0036", "05.08.01", "Biaya Babat rumput taman, lapangan dan lahan kosong", 1, "bulan", 1500000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.01", "Pemeliharaan Prasarana Lahan, Bangunan dan Ruang"),
      makeItem(6, "5.1.02.01.01.0031", "05.08.09", "Lampu Philips-Philips 18 W", 6, "buah", 65000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.09", "Pengadaan Perlengkapan Daya dan Jasa Sekolah (instalasi air, listrik, telepon, internet)"),
      makeItem(7, "5.1.02.01.01.0031", "05.08.09", "Baterai-Alkaline AA", 8, "pasang", 35000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.09", "Pengadaan Perlengkapan Daya dan Jasa Sekolah (instalasi air, listrik, telepon, internet)"),
      makeItem(8, "5.1.02.01.01.0055", "06.05.06", "Belanja makanan dan minuman tamu dan rapat", 1, "bulan", 1200000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.06", "Konsumsi Rapat Kedinasan dan Tamu Sekolah"),
      makeItem(9, "5.1.02.01.01.0024", "06.05.08", "Map Ordener-Bindex No.402 - 928", 8, "buah", 60000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah"),
      makeItem(10, "5.1.02.01.01.0024", "06.05.08", "Tinta Stampel-Yamura Kecil", 5, "buah", 20000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah"),
      makeItem(11, "5.1.02.01.01.0026", "06.05.08", "Sampul Rapor/Folder Rapor", 100, "pcs", 80000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah"),
      makeItem(12, "5.1.02.03.02.0411", "06.05.08", "Baterai untuk laptop oparator", 1, "buah", 450000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai untuk mendukung pembelajaran dan administrasi sekolah"),
      makeItem(13, "5.1.02.02.01.0061", "06.07.01", "Pembayaran Tagihan Listrik Sekolah", 2, "bulan", 1010000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.01", "Pembayaran daya listrik"),
      makeItem(14, "5.1.02.02.01.0041", "06.07.03", "Iuran langganan air", 1, "bulan", 500000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.03", "Pembayaran langganan air"),
      makeItem(15, "5.1.02.02.01.0063", "06.07.05", "Paket Indihome-", 1, "bulan", 800000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.05", "Pembayaran jasa internet"),
      makeItem(16, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Levina Katerina Fere, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Levina Katerina Fere, S.Pd", "Guru Honorer"),
      makeItem(17, "5.1.02.02.01.0013", "07.12.04", "Gaji Guru atas nama Yoice Dike, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Yoice Dike, S.Pd", "Guru Honorer"),
      makeItem(18, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Kostantina Ovide", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Kostantina Ovide", "Guru Honorer"),
      makeItem(19, "5.1.02.01.01.0024", "08.04.01", "Foto copy-A4/F4/Qwarto (Hitam putih)", 9840, "lembar", 300, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.01", "Persiapan, uji coba, simulasi, dan pelaksanaan Asesmen Nasional"),
      makeItem(20, "5.1.02.01.01.0024", "08.04.01", "Id Card/ Kartu Identitas-Gantung/Jepit", 85, "buah", 10000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.01", "Persiapan, uji coba, simulasi, dan pelaksanaan Asesmen Nasional"),
      makeItem(21, "5.1.02.01.01.0024", "08.04.01", "Cetak Amplop Dinas-Amplop Coklat A3 isi 100 lembar", 1, "pak", 150000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.01", "Persiapan, uji coba, simulasi, dan pelaksanaan Asesmen Nasional"),
      makeItem(22, "5.1.02.01.01.0026", "08.04.01", "Cetak Spanduk/baliho--", 3, "meter", 50000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.01", "Persiapan, uji coba, simulasi, dan pelaksanaan Asesmen Nasional"),
      makeItem(23, "5.1.02.01.01.0055", "08.04.01", "Makan dan minum selama pelaksanaan Ujian Sekolah", 150, "box", 40000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.01", "Persiapan, uji coba, simulasi, dan pelaksanaan Asesmen Nasional"),
      makeItem(24, "5.1.02.02.01.0009", "08.04.01", "Honorarium Penyelenggara Ujian Tingkat Pendidikan Dasar - Pengawas Ujian-", 50, "orang / hari", 100000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.01", "Persiapan, uji coba, simulasi, dan pelaksanaan Asesmen Nasional", "Panitia Pengawas Ujian Sekolah", "Pengawas Ujian")
    ]
  },

  // 5. MEI 2026 (Total: 19.850.000)
  {
    bulanKey: "mei",
    bulanNama: "Mei 2026",
    bulanIndex: 4,
    totalPenerimaan: 340000000,
    items: [
      makeItem(1, "5.1.02.03.03.0036", "05.08.01", "Biaya Babat rumput taman, lapangan dan lahan kosong", 1, "bulan", 1500000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.01", "Pemeliharaan Prasarana Lahan, Bangunan dan Ruang"),
      makeItem(2, "5.1.02.01.01.0055", "06.05.06", "Belanja makanan dan minuman tamu dan rapat", 1, "bulan", 1200000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.06", "Konsumsi Rapat Kedinasan dan Tamu Sekolah"),
      makeItem(3, "5.1.02.02.01.0061", "06.07.01", "Pembayaran Tagihan Listrik Sekolah", 2, "bulan", 1010000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.01", "Pembayaran daya listrik"),
      makeItem(4, "5.1.02.02.01.0041", "06.07.03", "Iuran langganan air", 1, "bulan", 500000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.03", "Pembayaran langganan air"),
      makeItem(5, "5.1.02.02.01.0063", "06.07.05", "Paket Indihome-", 1, "bulan", 800000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.05", "Pembayaran jasa internet"),
      makeItem(6, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Levina Katerina Fere, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Levina Katerina Fere, S.Pd", "Guru Honorer"),
      makeItem(7, "5.1.02.02.01.0013", "07.12.04", "Gaji Guru atas nama Yoice Dike, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Yoice Dike, S.Pd", "Guru Honorer"),
      makeItem(8, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Kostantina Ovide", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Kostantina Ovide", "Guru Honorer"),
      makeItem(9, "5.1.02.01.01.0024", "08.04.06", "Foto copy-A4/F4/Qwarto (Hitam putih)", 17100, "lembar", 300, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (ulangan akhir semester/kenaikan kelas UAS Genap)"),
      makeItem(10, "5.1.02.01.01.0024", "08.04.06", "Cetak Amplop Dinas-Amplop Coklat A3 isi 100 lembar", 1, "pak", 150000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (ulangan akhir semester/kenaikan kelas UAS Genap)"),
      makeItem(11, "5.1.02.01.01.0026", "08.04.06", "Cetak Spanduk/baliho--", 3, "meter", 50000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (ulangan akhir semester/kenaikan kelas UAS Genap)"),
      makeItem(12, "5.1.02.01.01.0055", "08.04.06", "Makan dan minum selama pelaksanaan UAS Genap", 150, "box", 40000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (ulangan akhir semester/kenaikan kelas UAS Genap)")
    ]
  },

  // 6. JUNI 2026 (Total: 17.975.000)
  {
    bulanKey: "juni",
    bulanNama: "Juni 2026",
    bulanIndex: 5,
    totalPenerimaan: 340000000,
    items: [
      makeItem(1, "5.1.02.01.01.0055", "02.03.01", "Makan dan minum selama pelaksanaan kegiatan penyusunan kurikulum", 60, "box", 40000, "02", "Pengembangan Standar Isi", "02.03", "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler", "02.03.01", "Penyusunan Kurikulum"),
      makeItem(2, "5.1.02.01.01.0024", "03.01.01", "Foto copy-A4/F4/Qwarto (Hitam putih)", 600, "lembar", 300, "03", "Standar Proses", "03.01", "Penerimaan Peserta Didik Baru", "03.01.01", "Pelaksanaan Pendaftaran Peserta Didik Baru (PPDB)"),
      makeItem(3, "5.1.02.01.01.0024", "03.01.01", "Map Kertas-Folio /Biasa", 150, "lembar", 2500, "03", "Standar Proses", "03.01", "Penerimaan Peserta Didik Baru", "03.01.01", "Pelaksanaan Pendaftaran Peserta Didik Baru (PPDB)"),
      makeItem(4, "5.1.02.01.01.0026", "03.01.01", "Cetak Spanduk/baliho--", 12, "meter", 50000, "03", "Standar Proses", "03.01", "Penerimaan Peserta Didik Baru", "03.01.01", "Pelaksanaan Pendaftaran Peserta Didik Baru (PPDB)"),
      makeItem(5, "5.1.02.01.01.0055", "03.01.01", "Makan dan minum selama pelaksanaan PPDB", 150, "box", 40000, "03", "Standar Proses", "03.01", "Penerimaan Peserta Didik Baru", "03.01.01", "Pelaksanaan Pendaftaran Peserta Didik Baru (PPDB)"),
      makeItem(6, "5.1.02.03.03.0036", "05.08.01", "Biaya Babat rumput taman, lapangan dan lahan kosong", 1, "bulan", 1500000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.01", "Pemeliharaan Prasarana Lahan, Bangunan dan Ruang"),
      makeItem(7, "5.1.02.01.01.0055", "06.05.06", "Belanja makanan dan minuman tamu dan rapat", 1, "bulan", 1200000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.06", "Konsumsi Rapat Kedinasan dan Tamu Sekolah"),
      makeItem(8, "5.1.02.02.01.0061", "06.07.01", "Pembayaran Tagihan Listrik Sekolah", 2, "bulan", 1010000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.01", "Pembayaran daya listrik"),
      makeItem(9, "5.1.02.02.01.0041", "06.07.03", "Iuran langganan air", 1, "bulan", 500000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.03", "Pembayaran langganan air"),
      makeItem(10, "5.1.02.02.01.0063", "06.07.05", "Paket Indihome-", 1, "bulan", 800000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.05", "Pembayaran jasa internet"),
      makeItem(11, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Levina Katerina Fere, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Levina Katerina Fere, S.Pd", "Guru Honorer"),
      makeItem(12, "5.1.02.02.01.0013", "07.12.04", "Gaji Guru atas nama Yoice Dike, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Yoice Dike, S.Pd", "Guru Honorer"),
      makeItem(13, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Kostantina Ovide", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Kostantina Ovide", "Guru Honorer")
    ]
  },

  // 7. JULI 2026 (Total: 33.610.000)
  {
    bulanKey: "juli",
    bulanNama: "Juli 2026",
    bulanIndex: 6,
    totalPenerimaan: 340000000,
    items: [
      makeItem(1, "5.1.02.01.01.0026", "03.03.06", "Cetak Spanduk/baliho--", 3, "meter", 50000, "03", "Standar Proses", "03.03", "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler", "03.03.06", "Pelaksanaan Ekstrakurikuler Kepramukaan"),
      makeItem(2, "5.1.02.01.01.0055", "03.03.06", "Makan dan minum selama pelaksanaan perkemahan", 120, "box", 40000, "03", "Standar Proses", "03.03", "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler", "03.03.06", "Pelaksanaan Ekstrakurikuler Kepramukaan"),
      makeItem(3, "5.1.02.02.01.0003", "03.03.06", "Honorarium Nara Sumber/Pengajar/Penceramah-", 8, "orang", 250000, "03", "Standar Proses", "03.03", "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler", "03.03.06", "Pelaksanaan Ekstrakurikuler Kepramukaan", "Narasumber Pramuka Kwarcab", "Narasumber"),
      makeItem(4, "5.1.02.02.01.0011", "03.03.06", "Honorarium Penyelenggaraan Kegiatan Pendidikan dan Pelatihan-Honorarium Pengajar", 1, "orang / bulan", 500000, "03", "Standar Proses", "03.03", "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler", "03.03.06", "Pelaksanaan Ekstrakurikuler Kepramukaan", "Pembina Pramuka", "Pelatih Pramuka"),
      makeItem(5, "5.1.02.02.01.0011", "03.03.06", "Honorarium Pengajar - Penanggungjawab Program-", 1, "kegiatan", 600000, "03", "Standar Proses", "03.03", "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler", "03.03.06", "Pelaksanaan Ekstrakurikuler Kepramukaan", "Penanggung Jawab Kemah", "PJ Kegiatan"),
      makeItem(6, "5.1.02.04.01.0003", "04.06.02", "Biaya Transportasi Perjalanan Dinas Dalam Daerah Kabupaten - Transportasi Darat Dari Ibu Kota Kabupaten ke Distrik (PP) Tim - Distrik Sentani/Hinekombe--", 30, "orang / kegiatan", 50000, "04", "Standar Tenaga Kependidikan", "04.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "04.06.02", "Kegiatan Komunitas Belajar antar sekolah"),
      makeItem(7, "5.1.02.03.03.0036", "05.08.01", "Biaya Babat rumput taman, lapangan dan lahan kosong", 1, "bulan", 1500000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.01", "Pemeliharaan Prasarana Lahan, Bangunan dan Ruang"),
      makeItem(8, "5.1.02.01.01.0055", "06.05.06", "Belanja makanan dan minuman tamu dan rapat", 1, "bulan", 1200000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.06", "Konsumsi Rapat Kedinasan dan Tamu Sekolah"),
      makeItem(9, "5.1.02.01.01.0024", "06.05.08", "Spidol-Snowman White Board G-12", 120, "buah", 12000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai ATK"),
      makeItem(10, "5.1.02.01.01.0024", "06.05.08", "Map Batik-Map Batik Motif Papua Kertas", 3, "pak", 150000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai ATK"),
      makeItem(11, "5.1.02.01.01.0024", "06.05.08", "Map Kertas-Diamond isi 50 lembar", 4, "pak", 200000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai ATK"),
      makeItem(12, "5.1.02.01.01.0025", "06.05.08", "Kertas HVS-Bola Dunia A4 / 70 Gram", 20, "rim", 65000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai ATK"),
      makeItem(13, "5.1.02.01.01.0025", "06.05.08", "Kertas HVS-Bola Dunia F4 / 70 Gram", 25, "rim", 70000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai ATK"),
      makeItem(14, "5.1.02.03.02.0115", "06.05.08", "Tinta Printer 003 Warna Hitam", 6, "botol", 100000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai ATK"),
      makeItem(15, "5.1.02.03.02.0115", "06.05.08", "TInta Printer 003 warna ( Y / M / C )", 9, "botol", 100000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai ATK"),
      makeItem(16, "5.1.02.02.01.0061", "06.07.01", "Pembayaran Tagihan Listrik Sekolah", 2, "bulan", 1010000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.01", "Pembayaran daya listrik"),
      makeItem(17, "5.1.02.02.01.0041", "06.07.03", "Iuran langganan air", 1, "bulan", 500000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.03", "Pembayaran langganan air"),
      makeItem(18, "5.1.02.02.01.0063", "06.07.05", "Paket Indihome-", 1, "bulan", 800000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.05", "Pembayaran jasa internet"),
      makeItem(19, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Levina Katerina Fere, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Levina Katerina Fere, S.Pd", "Guru Honorer"),
      makeItem(20, "5.1.02.02.01.0013", "07.12.04", "Gaji Guru atas nama Yoice Dike, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Yoice Dike, S.Pd", "Guru Honorer"),
      makeItem(21, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Kostantina Ovide", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Tenaga Penunjang / Guru", "Kostantina Ovide", "Guru Honorer"),
      makeItem(22, "5.1.02.01.01.0026", "08.06.01", "Cetak Spanduk/baliho--", 3, "meter", 50000, "08", "Standar Penilaian Pendidikan", "08.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "08.06.01", "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Workshop, P5)"),
      makeItem(23, "5.1.02.01.01.0055", "08.06.01", "Makan dan Minum selama pelaksanaan workshop", 90, "box", 40000, "08", "Standar Penilaian Pendidikan", "08.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "08.06.01", "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Workshop, P5)"),
      makeItem(24, "5.1.02.01.01.0055", "08.06.01", "Kue Coffe Break Selama pelaksanaan Workshop", 90, "orang / paket", 30000, "08", "Standar Penilaian Pendidikan", "08.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "08.06.01", "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Workshop, P5)"),
      makeItem(25, "5.1.02.02.01.0011", "08.06.01", "Honorarium Pengajar - Penanggungjawab Program-", 1, "kegiatan", 600000, "08", "Standar Penilaian Pendidikan", "08.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "08.06.01", "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Workshop, P5)"),
      makeItem(26, "5.1.02.02.01.0011", "08.06.01", "Honorarium Pengajar - Benchmarking - Panitia LOKUS-", 3, "kegiatan", 450000, "08", "Standar Penilaian Pendidikan", "08.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "08.06.01", "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Workshop, P5)")
    ]
  },

  // 8. AGUSTUS 2026 (Total: 32.213.000)
  {
    bulanKey: "agustus",
    bulanNama: "Agustus 2026",
    bulanIndex: 7,
    totalPenerimaan: 340000000,
    items: [
      makeItem(1, "5.1.02.02.01.0011", "03.03.06", "Honorarium Penyelenggaraan Kegiatan Pendidikan dan Pelatihan-Honorarium Pengajar", 1, "orang / bulan", 500000, "03", "Standar Proses", "03.03", "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler", "03.03.06", "Pelaksanaan Ekstrakurikuler Kepramukaan"),
      makeItem(2, "5.1.02.04.01.0003", "04.06.02", "Biaya Transportasi Perjalanan Dinas Dalam Daerah Kabupaten - Transportasi Darat Dari Ibu Kota Kabupaten ke Distrik (PP) Tim - Distrik Sentani/Hinekombe--", 60, "orang / kegiatan", 50000, "04", "Standar Tenaga Kependidikan", "04.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "04.06.02", "Kegiatan Komunitas Belajar antar sekolah"),
      makeItem(3, "5.2.05.01.01.0001", "05.02.03", "Buku Pendidikan Pancasila Kelas 7", 15, "eksemplar", 87000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks"),
      makeItem(4, "5.2.05.01.01.0001", "05.02.03", "Buku Pendidikan Pancasila Kelas 8", 15, "eksemplar", 87000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks"),
      makeItem(5, "5.2.05.01.01.0001", "05.02.03", "Buku Pendidikan Pancasila Kelas 9", 15, "eksemplar", 87000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks"),
      makeItem(6, "5.2.05.01.01.0005", "05.02.03", "Buku Bahasa Indonesia Kelas 7", 15, "eksemplar", 130000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks"),
      makeItem(7, "5.2.05.01.01.0005", "05.02.03", "Buku Bahasa Indonesia Kelas 8", 15, "eksemplar", 130000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks"),
      makeItem(8, "5.2.05.01.01.0005", "05.02.03", "Buku Bahasa Indonesia Kelas 9", 15, "eksemplar", 130000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks"),
      makeItem(9, "5.2.05.01.01.0007", "05.02.03", "Buku Pendamping Koding dan KA Kelas 7", 15, "eksemplar", 99200, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks"),
      makeItem(10, "5.2.05.01.01.0008", "05.02.03", "Buku Mari Berolahraga Kelas 7", 15, "eksemplar", 94500, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks"),
      makeItem(11, "5.2.05.01.01.0008", "05.02.03", "Buku Mari Berolahraga Kelas 8", 15, "eksemplar", 94500, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks"),
      makeItem(12, "5.2.05.01.01.0008", "05.02.03", "Buku Mari Berolahraga Kelas 9", 15, "eksemplar", 97000, "05", "Standar Sarana dan Prasarana", "05.02", "Pengembangan Perpustakaan", "05.02.03", "Pengadaan Buku Teks"),
      makeItem(13, "5.1.02.03.03.0036", "05.08.01", "Biaya Babat rumput taman, lapangan dan lahan kosong", 1, "bulan", 1500000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.01", "Pemeliharaan Prasarana Lahan"),
      makeItem(14, "5.1.02.01.01.0055", "06.05.06", "Belanja makanan dan minuman tamu dan rapat", 1, "bulan", 1200000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.06", "Konsumsi Rapat"),
      makeItem(15, "5.1.02.01.01.0024", "06.05.08", "Pulpen-Faster", 50, "buah", 7000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.08", "Pembelian Bahan Habis Pakai ATK"),
      makeItem(16, "5.1.02.02.01.0061", "06.07.01", "Pembayaran Tagihan Listrik Sekolah", 2, "bulan", 1010000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.01", "Pembayaran daya listrik"),
      makeItem(17, "5.1.02.02.01.0041", "06.07.03", "Iuran langganan air", 1, "bulan", 500000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.03", "Pembayaran langganan air"),
      makeItem(18, "5.1.02.02.01.0063", "06.07.05", "Paket Indihome-", 1, "bulan", 800000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.05", "Pembayaran jasa internet"),
      makeItem(19, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Levina Katerina Fere, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Guru", "Levina Katerina Fere, S.Pd", "Guru Honorer"),
      makeItem(20, "5.1.02.02.01.0013", "07.12.04", "Gaji Guru atas nama Yoice Dike, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Guru", "Yoice Dike, S.Pd", "Guru Honorer"),
      makeItem(21, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Kostantina Ovide", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Guru", "Kostantina Ovide", "Guru Honorer"),
      makeItem(22, "5.1.02.01.01.0055", "08.04.08", "Makan dan Minum selama pelaksanaan Gladi ANBK", 60, "box", 40000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.08", "Pelaksanaan Penilaian/Asesmen Sekolah (Gladi ANBK)"),
      makeItem(23, "5.1.02.02.01.0009", "08.04.08", "Honorarium Penyelenggara Ujian Tingkat Pendidikan Menengah - Pengawas Ujian-", 10, "orang / hari", 200000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.08", "Pelaksanaan Penilaian/Asesmen Sekolah (Gladi ANBK)", "Pengawas Gladi ANBK", "Pengawas Ujian")
    ]
  },

  // 9. SEPTEMBER 2026 (Total: 26.360.000)
  {
    bulanKey: "september",
    bulanNama: "September 2026",
    bulanIndex: 8,
    totalPenerimaan: 340000000,
    items: [
      makeItem(1, "5.1.02.02.01.0011", "03.03.06", "Honorarium Penyelenggaraan Kegiatan Pendidikan dan Pelatihan-Honorarium Pengajar", 1, "orang / bulan", 500000, "03", "Standar Proses", "03.03", "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler", "03.03.06", "Pelaksanaan Ekstrakurikuler Kepramukaan"),
      makeItem(2, "5.1.02.04.01.0003", "04.06.02", "Biaya Transportasi Perjalanan Dinas Dalam Daerah Kabupaten - Transportasi Darat Dari Ibu Kota Kabupaten ke Distrik (PP) Tim - Distrik Sentani/Hinekombe--", 60, "orang / kegiatan", 50000, "04", "Standar Tenaga Kependidikan", "04.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "04.06.02", "Kegiatan Komunitas Belajar antar sekolah"),
      makeItem(3, "5.1.02.03.03.0036", "05.08.01", "Biaya Babat rumput taman, lapangan dan lahan kosong", 1, "bulan", 1500000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.01", "Pemeliharaan Prasarana Lahan"),
      makeItem(4, "5.1.02.01.01.0055", "06.05.06", "Belanja makanan dan minuman tamu dan rapat", 1, "bulan", 1200000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.06", "Konsumsi Rapat"),
      makeItem(5, "5.1.02.02.01.0061", "06.07.01", "Pembayaran Tagihan Listrik Sekolah", 2, "bulan", 1010000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.01", "Pembayaran daya listrik"),
      makeItem(6, "5.1.02.02.01.0041", "06.07.03", "Iuran langganan air", 1, "bulan", 500000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.03", "Pembayaran langganan air"),
      makeItem(7, "5.1.02.02.01.0063", "06.07.05", "Paket Indihome-", 1, "bulan", 800000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.05", "Pembayaran jasa internet"),
      makeItem(8, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Levina Katerina Fere, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Guru", "Levina Katerina Fere, S.Pd", "Guru Honorer"),
      makeItem(9, "5.1.02.02.01.0013", "07.12.04", "Gaji Guru atas nama Yoice Dike, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Guru", "Yoice Dike, S.Pd", "Guru Honorer"),
      makeItem(10, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Kostantina Ovide", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Guru", "Kostantina Ovide", "Guru Honorer"),
      makeItem(11, "5.1.02.01.01.0024", "08.04.06", "Foto copy-A4/F4/Qwarto (Hitam putih)", 10800, "lembar", 300, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (UTS Ganjil)"),
      makeItem(12, "5.1.02.01.01.0024", "08.04.06", "Cetak Amplop Dinas-Amplop Coklat A3 isi 100 lembar", 1, "pak", 150000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (UTS Ganjil)"),
      makeItem(13, "5.1.02.01.01.0026", "08.04.06", "Cetak Spanduk/baliho--", 3, "meter", 50000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (UTS Ganjil)"),
      makeItem(14, "5.1.02.01.01.0055", "08.04.06", "Makan dan minum selama pelaksanaan UTS Ganjil", 150, "box", 40000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (UTS Ganjil)"),
      makeItem(15, "5.1.02.01.01.0024", "08.04.08", "Id Card/ Kartu Identitas-Gantung/Jepit", 50, "buah", 10000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.08", "Pelaksanaan Penilaian/Asesmen Sekolah (ANBK Utama)"),
      makeItem(16, "5.1.02.01.01.0055", "08.04.08", "Makan dan minum selama pelaksanaan ANBK Utama", 60, "box", 40000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.08", "Pelaksanaan Penilaian/Asesmen Sekolah (ANBK Utama)"),
      makeItem(17, "5.1.02.02.01.0009", "08.04.08", "Honorarium Penyelenggara Ujian Tingkat Pendidikan Menengah - Pengawas Ujian-", 10, "orang / hari", 200000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.08", "Pelaksanaan Penilaian/Asesmen Sekolah (ANBK Utama)", "Pengawas ANBK Utama", "Pengawas Ujian")
    ]
  },

  // 10. OKTOBER 2026 (Total: 17.920.000)
  {
    bulanKey: "oktober",
    bulanNama: "Oktober 2026",
    bulanIndex: 9,
    totalPenerimaan: 340000000,
    items: [
      makeItem(1, "5.1.02.02.01.0011", "03.03.06", "Honorarium Penyelenggaraan Kegiatan Pendidikan dan Pelatihan-Honorarium Pengajar", 1, "orang / bulan", 500000, "03", "Standar Proses", "03.03", "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler", "03.03.06", "Pelaksanaan Ekstrakurikuler Kepramukaan"),
      makeItem(2, "5.1.02.04.01.0003", "04.06.02", "Biaya Transportasi Perjalanan Dinas Dalam Daerah Kabupaten - Transportasi Darat Dari Ibu Kota Kabupaten ke Distrik (PP) Tim - Distrik Sentani/Hinekombe--", 60, "orang / kegiatan", 50000, "04", "Standar Tenaga Kependidikan", "04.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "04.06.02", "Kegiatan Komunitas Belajar antar sekolah"),
      makeItem(3, "5.1.02.03.03.0036", "05.08.01", "Biaya Babat rumput taman, lapangan dan lahan kosong", 1, "bulan", 1500000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.01", "Pemeliharaan Prasarana Lahan"),
      makeItem(4, "5.1.02.01.01.0055", "06.05.06", "Belanja makanan dan minuman tamu dan rapat", 1, "bulan", 1200000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.06", "Konsumsi Rapat"),
      makeItem(5, "5.1.02.02.01.0061", "06.07.01", "Pembayaran Tagihan Listrik Sekolah", 2, "bulan", 1010000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.01", "Pembayaran daya listrik"),
      makeItem(6, "5.1.02.02.01.0041", "06.07.03", "Iuran langganan air", 1, "bulan", 500000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.03", "Pembayaran langganan air"),
      makeItem(7, "5.1.02.02.01.0063", "06.07.05", "Paket Indihome-", 1, "bulan", 800000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.05", "Pembayaran jasa internet"),
      makeItem(8, "5.1.02.02.01.0011", "07.12.03", "Jasa / Honor Operator Sekolah", 1, "orang", 6000000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.03", "Pembayaran Honor tenaga administrasi", "Operator Sekolah SMPN 7", "Operator"),
      makeItem(9, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Levina Katerina Fere, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Guru", "Levina Katerina Fere, S.Pd", "Guru Honorer"),
      makeItem(10, "5.1.02.02.01.0013", "07.12.04", "Gaji Guru atas nama Yoice Dike, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Guru", "Yoice Dike, S.Pd", "Guru Honorer"),
      makeItem(11, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Kostantina Ovide", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Guru", "Kostantina Ovide", "Guru Honorer")
    ]
  },

  // 11. NOVEMBER 2026 (Total: 25.510.000)
  {
    bulanKey: "november",
    bulanNama: "November 2026",
    bulanIndex: 10,
    totalPenerimaan: 340000000,
    items: [
      makeItem(1, "5.1.02.02.01.0011", "03.03.06", "Honorarium Penyelenggaraan Kegiatan Pendidikan dan Pelatihan-Honorarium Pengajar", 1, "orang / bulan", 500000, "03", "Standar Proses", "03.03", "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler", "03.03.06", "Pelaksanaan Ekstrakurikuler Kepramukaan"),
      makeItem(2, "5.1.02.04.01.0003", "04.06.02", "Biaya Transportasi Perjalanan Dinas Dalam Daerah Kabupaten - Transportasi Darat Dari Ibu Kota Kabupaten ke Distrik (PP) Tim - Distrik Sentani/Hinekombe--", 60, "orang / kegiatan", 50000, "04", "Standar Tenaga Kependidikan", "04.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "04.06.02", "Kegiatan Komunitas Belajar antar sekolah"),
      makeItem(3, "5.1.02.03.03.0036", "05.08.01", "Biaya Babat rumput taman, lapangan dan lahan kosong", 1, "bulan", 1500000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.01", "Pemeliharaan Prasarana Lahan"),
      makeItem(4, "5.1.02.01.01.0055", "06.05.06", "Belanja makanan dan minuman tamu dan rapat", 1, "bulan", 1200000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.06", "Konsumsi Rapat"),
      makeItem(5, "5.1.02.02.01.0061", "06.07.01", "Pembayaran Tagihan Listrik Sekolah", 2, "bulan", 1010000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.01", "Pembayaran daya listrik"),
      makeItem(6, "5.1.02.02.01.0041", "06.07.03", "Iuran langganan air", 1, "bulan", 500000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.03", "Pembayaran langganan air"),
      makeItem(7, "5.1.02.02.01.0063", "06.07.05", "Paket Indihome-", 1, "bulan", 800000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.05", "Pembayaran jasa internet"),
      makeItem(8, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Levina Katerina Fere, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Guru", "Levina Katerina Fere, S.Pd", "Guru Honorer"),
      makeItem(9, "5.1.02.02.01.0013", "07.12.04", "Gaji Guru atas nama Yoice Dike, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Guru", "Yoice Dike, S.Pd", "Guru Honorer"),
      makeItem(10, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Kostantina Ovide", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Guru", "Kostantina Ovide", "Guru Honorer"),
      makeItem(11, "5.1.02.01.01.0024", "08.04.06", "Foto copy-A4/F4/Qwarto (Hitam putih)", 24300, "lembar", 300, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (ulangan tengah semester/akhir semester UAS Ganjil)"),
      makeItem(12, "5.1.02.01.01.0024", "08.04.06", "Cetak Amplop Dinas-Amplop Coklat A3 isi 100 lembar", 1, "pak", 150000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (ulangan akhir semester UAS Ganjil)"),
      makeItem(13, "5.1.02.01.01.0026", "08.04.06", "Cetak Spanduk/baliho--", 3, "meter", 50000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (ulangan akhir semester UAS Ganjil)"),
      makeItem(14, "5.1.02.01.01.0055", "08.04.06", "Makan dan munum selama pelaksanaan UAS Ganjil", 150, "box", 40000, "08", "Standar Penilaian Pendidikan", "08.04", "Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran", "08.04.06", "Pelaksanaan penilaian sumatif (ulangan akhir semester UAS Ganjil)")
    ]
  },

  // 12. DESEMBER 2026 (Total: 17.320.000)
  {
    bulanKey: "desember",
    bulanNama: "Desember 2026",
    bulanIndex: 11,
    totalPenerimaan: 340000000,
    items: [
      makeItem(1, "5.1.02.02.01.0011", "03.03.06", "Honorarium Penyelenggaraan Kegiatan Pendidikan dan Pelatihan-Honorarium Pengajar", 1, "orang / bulan", 500000, "03", "Standar Proses", "03.03", "Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler", "03.03.06", "Pelaksanaan Ekstrakurikuler Kepramukaan"),
      makeItem(2, "5.1.02.03.03.0036", "05.08.01", "Biaya Babat rumput taman, lapangan dan lahan kosong", 1, "bulan", 1500000, "05", "Standar Sarana dan Prasarana", "05.08", "Pemeliharaan Sarana dan Prasarana Sekolah", "05.08.01", "Pemeliharaan Prasarana Lahan"),
      makeItem(3, "5.1.02.01.01.0055", "06.05.06", "Belanja makanan dan minuman tamu dan rapat", 1, "bulan", 1200000, "06", "Standar Pengelolaan", "06.05", "Pelaksanaan Administrasi Kegiatan Sekolah", "06.05.06", "Konsumsi Rapat"),
      makeItem(4, "5.1.02.02.01.0061", "06.07.01", "Pembayaran Tagihan Listrik Sekolah", 2, "bulan", 1010000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.01", "Pembayaran daya listrik"),
      makeItem(5, "5.1.02.02.01.0041", "06.07.03", "Iuran langganan air", 1, "bulan", 500000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.03", "Pembayaran langganan air"),
      makeItem(6, "5.1.02.02.01.0063", "06.07.05", "Paket Indihome-", 1, "bulan", 800000, "06", "Standar Pengelolaan", "06.07", "Pembiayaan Langganan Daya dan Jasa", "06.07.05", "Pembayaran jasa internet"),
      makeItem(7, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Levina Katerina Fere, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Guru", "Levina Katerina Fere, S.Pd", "Guru Honorer"),
      makeItem(8, "5.1.02.02.01.0013", "07.12.04", "Gaji Guru atas nama Yoice Dike, S.Pd", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Guru", "Yoice Dike, S.Pd", "Guru Honorer"),
      makeItem(9, "5.1.02.02.01.0013", "07.12.04", "Honor Guru atas nama Kostantina Ovide", 1, "bulan", 800000, "07", "Pengembangan Standar Pembiayaan", "07.12", "Pembayaran Honor", "07.12.04", "Honor Guru", "Kostantina Ovide", "Guru Honorer"),
      makeItem(10, "5.1.02.01.01.0026", "08.06.01", "Cetak Spanduk/baliho--", 3, "meter", 50000, "08", "Standar Penilaian Pendidikan", "08.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "08.06.01", "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Pelatihan, P5, Workshop)"),
      makeItem(11, "5.1.02.01.01.0055", "08.06.01", "Makan dan Minum selama pelaksanaan workshop", 90, "box", 40000, "08", "Standar Penilaian Pendidikan", "08.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "08.06.01", "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Pelatihan, P5, Workshop)"),
      makeItem(12, "5.1.02.01.01.0055", "08.06.01", "Kue Coffe Break Selama pelaksanaan Workshop", 90, "orang / paket", 30000, "08", "Standar Penilaian Pendidikan", "08.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "08.06.01", "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Pelatihan, P5, Workshop)"),
      makeItem(13, "5.1.02.02.01.0011", "08.06.01", "Honorarium Pengajar - Penanggungjawab Program-", 1, "kegiatan", 600000, "08", "Standar Penilaian Pendidikan", "08.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "08.06.01", "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Pelatihan, P5, Workshop)"),
      makeItem(14, "5.1.02.02.01.0011", "08.06.01", "Honorarium Pengajar - Benchmarking - Panitia LOKUS-", 3, "kegiatan", 450000, "08", "Standar Penilaian Pendidikan", "08.06", "Pengembangan Profesi Pendidik dan Tenaga Kependidikan", "08.06.01", "Fasilitasi pengembangan kompetensi guru melalui diseminasi PSP (IHT, Pelatihan, P5, Workshop)")
    ]
  }
];
