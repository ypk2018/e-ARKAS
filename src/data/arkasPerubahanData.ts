import { MonthWorksheet, ArkasPerubahanMonthWorksheet, ArkasPerubahanItem, KertasKerjaItem } from '../types';
import { INITIAL_KERTAS_KERJA_DATA } from './kertasKerjaData';

/**
 * Helper to convert standard MonthWorksheet[] from ARKAS Murni into ArkasPerubahanMonthWorksheet[]
 */
export function initializePerubahanFromMurni(
  murniWorksheets: MonthWorksheet[]
): ArkasPerubahanMonthWorksheet[] {
  return murniWorksheets.map((ws) => {
    const items: ArkasPerubahanItem[] = ws.items.map((it, idx) => ({
      id: `perub_${it.id}`,
      originalItemId: it.id,
      noUrut: idx + 1,
      kodeRekening: it.kodeRekening,
      kodeProgram: it.kodeProgram,
      uraian: it.uraian,
      semulaVolume: it.volume,
      semulaSatuan: it.satuan,
      semulaTarif: it.tarifHarga,
      semulaJumlah: it.jumlah,
      volume: it.volume,
      satuan: it.satuan,
      tarifHarga: it.tarifHarga,
      jumlah: it.jumlah,
      selisihJumlah: 0,
      selisihVolume: 0,
      statusPerubahan: 'TETAP',
      alasanPerubahan: 'Sesuai pagu dan perencanaan ARKAS Murni',
      temaId: it.temaId,
      temaNama: it.temaNama,
      subtemaKode: it.subtemaKode,
      subtemaNama: it.subtemaNama,
      kegiatanKode: it.kegiatanKode,
      kegiatanNama: it.kegiatanNama,
      penerimaDefault: it.penerimaDefault,
      jabatanDefault: it.jabatanDefault
    }));

    return {
      bulanKey: ws.bulanKey,
      bulanNama: ws.bulanNama,
      bulanIndex: ws.bulanIndex,
      totalPenerimaan: ws.totalPenerimaan,
      items
    };
  });
}

/**
 * Pre-populated realistic sample data for ARKAS Perubahan.
 * Contains noticeable and realistic differences across all 12 months:
 * - Items marked 'TETAP' (unchanged)
 * - Items marked 'BERTAMBAH' (increased volume/amount)
 * - Items marked 'BERKURANG' (reduced budget)
 * - Items marked 'BARU' (brand new items not present in ARKAS Murni)
 * - Items marked 'DIHILANGKAN' (originally in ARKAS Murni, canceled/removed in Perubahan)
 */
export function generateRealisticPerubahanData(murniWorksheets: MonthWorksheet[]): ArkasPerubahanMonthWorksheet[] {
  const base = initializePerubahanFromMurni(murniWorksheets);

  // Month 0: Januari 2026 (TW I)
  if (base[0]) {
    // 1. BARU: Pengadaan Tablet Chromebook CBT/ANBK
    base[0].items.push({
      id: 'perub_new_jan_1',
      noUrut: base[0].items.length + 1,
      kodeRekening: '5.2.02.10.01.0002',
      kodeProgram: '08.04.08',
      uraian: 'Pengadaan Tablet Chromebook & Access Point Pendukung Asesmen Digital Siswa (Penambahan Baru)',
      semulaVolume: 0,
      semulaSatuan: 'unit',
      semulaTarif: 0,
      semulaJumlah: 0,
      volume: 3,
      satuan: 'unit',
      tarifHarga: 3500000,
      jumlah: 10500000,
      selisihJumlah: 10500000,
      selisihVolume: 3,
      statusPerubahan: 'BARU',
      alasanPerubahan: 'Kebutuhan mendesak persiapan digitalisasi asesmen sekolah berbasis CBT / ANBK',
      temaId: '08',
      temaNama: 'Standar Penilaian Pendidikan',
      subtemaKode: '08.04',
      subtemaNama: 'Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran',
      kegiatanKode: '08.04.08',
      kegiatanNama: 'Penyiapan, Uji Coba, dan Pelaksanaan Penilaian/Asesmen Sekolah Berbasis Komputer'
    });

    // 2. DIHILANGKAN: Penggantian atap bocor dialihkan ke TW III
    const itemToCancel = base[0].items.find((it) => it.kodeRekening === '5.1.02.03.03.0005');
    if (itemToCancel) {
      itemToCancel.volume = 0;
      itemToCancel.jumlah = 0;
      itemToCancel.selisihJumlah = -itemToCancel.semulaJumlah;
      itemToCancel.selisihVolume = -itemToCancel.semulaVolume;
      itemToCancel.statusPerubahan = 'DIHILANGKAN';
      itemToCancel.alasanPerubahan = 'Dihilangkan karena dialihkan ke pemeliharaan terpadu ruang kelas pada Triwulan III';
    }

    // 3. BERTAMBAH: Fotokopi modul
    const itemToAdd = base[0].items.find((it) => it.kodeRekening === '5.1.02.01.01.0024');
    if (itemToAdd) {
      itemToAdd.volume = 15000;
      itemToAdd.jumlah = 15000 * itemToAdd.tarifHarga;
      itemToAdd.selisihJumlah = itemToAdd.jumlah - itemToAdd.semulaJumlah;
      itemToAdd.selisihVolume = 15000 - itemToAdd.semulaVolume;
      itemToAdd.statusPerubahan = 'BERTAMBAH';
      itemToAdd.alasanPerubahan = 'Peningkatan volume fotokopi modul kurikulum merdeka dan lembar kerja siswa';
    }

    // 4. BERKURANG: Konsumsi rapat
    const itemToReduce = base[0].items.find((it) => it.kodeRekening === '5.1.02.01.01.0055');
    if (itemToReduce) {
      itemToReduce.tarifHarga = 800000;
      itemToReduce.jumlah = 800000;
      itemToReduce.selisihJumlah = itemToReduce.jumlah - itemToReduce.semulaJumlah;
      itemToReduce.statusPerubahan = 'BERKURANG';
      itemToReduce.alasanPerubahan = 'Efisiensi dan rasionalisasi anggaran konsumsi rapat internal';
    }
  }

  // Month 1: Februari 2026 (TW I)
  if (base[1]) {
    base[1].items.push({
      id: 'perub_new_feb_1',
      noUrut: base[1].items.length + 1,
      kodeRekening: '5.1.02.01.01.0031',
      kodeProgram: '05.08.08',
      uraian: 'Pengadaan Termometer Digital, Obat-obatan P3K & Supplies Ruang UKS (Penambahan Baru)',
      semulaVolume: 0,
      semulaSatuan: 'paket',
      semulaTarif: 0,
      semulaJumlah: 0,
      volume: 1,
      satuan: 'paket',
      tarifHarga: 1450000,
      jumlah: 1450000,
      selisihJumlah: 1450000,
      selisihVolume: 1,
      statusPerubahan: 'BARU',
      alasanPerubahan: 'Penyediaan sarana kesehatan pertolongan pertama pada siswa di sekolah',
      temaId: '05',
      temaNama: 'Standar Sarana dan Prasarana',
      subtemaKode: '05.08',
      subtemaNama: 'Pemeliharaan Sarana dan Prasarana Sekolah',
      kegiatanKode: '05.08.08',
      kegiatanNama: 'Pemeliharaan Perlengkapan UKS dan Sanitasi Kesehatan'
    });

    if (base[1].items.length > 2) {
      const it = base[1].items[2];
      it.volume = Math.round(it.volume * 1.5);
      it.jumlah = it.volume * it.tarifHarga;
      it.selisihJumlah = it.jumlah - it.semulaJumlah;
      it.selisihVolume = it.volume - it.semulaVolume;
      it.statusPerubahan = 'BERTAMBAH';
      it.alasanPerubahan = 'Penyesuaian kebutuhan bahan praktek siswa semester berjalan';
    }
  }

  // Month 2: Maret 2026 (TW I)
  if (base[2]) {
    base[2].items.push({
      id: 'perub_new_mar_1',
      noUrut: base[2].items.length + 1,
      kodeRekening: '5.1.02.01.01.0034',
      kodeProgram: '03.03.06',
      uraian: 'Pengadaan Tenda Dome & Perlengkapan Kemah Pramuka Pelajar (Penambahan Baru)',
      semulaVolume: 0,
      semulaSatuan: 'set',
      semulaTarif: 0,
      semulaJumlah: 0,
      volume: 2,
      satuan: 'set',
      tarifHarga: 2250000,
      jumlah: 4500000,
      selisihJumlah: 4500000,
      selisihVolume: 2,
      statusPerubahan: 'BARU',
      alasanPerubahan: 'Fasilitasi kegiatan kepramukaan perkemahan sabtu-minggu (Persami) sekolah',
      temaId: '03',
      temaNama: 'Standar Proses',
      subtemaKode: '03.03',
      subtemaNama: 'Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler',
      kegiatanKode: '03.03.06',
      kegiatanNama: 'Pelaksanaan Ekstrakurikuler Kepramukaan'
    });
  }

  // Month 3: April 2026 (TW II)
  if (base[3]) {
    base[3].items.push({
      id: 'perub_new_apr_1',
      noUrut: base[3].items.length + 1,
      kodeRekening: '5.2.05.01.01.0001',
      kodeProgram: '05.08.03',
      uraian: 'Pengadaan Buku Bacaan Pengayaan Literasi Kurikulum Merdeka (Penambahan Baru)',
      semulaVolume: 0,
      semulaSatuan: 'eks',
      semulaTarif: 0,
      semulaJumlah: 0,
      volume: 75,
      satuan: 'eks',
      tarifHarga: 85000,
      jumlah: 6375000,
      selisihJumlah: 6375000,
      selisihVolume: 75,
      statusPerubahan: 'BARU',
      alasanPerubahan: 'Peningkatan pojok baca kelas dan koleksi perpustakaan sesuai rapor pendidikan',
      temaId: '05',
      temaNama: 'Standar Sarana dan Prasarana',
      subtemaKode: '05.08',
      subtemaNama: 'Pemeliharaan Sarana dan Prasarana Sekolah',
      kegiatanKode: '05.08.03',
      kegiatanNama: 'Pengadaan Bahan Pustaka dan Buku Pengayaan Literasi'
    });

    if (base[3].items.length > 1) {
      const it = base[3].items[0];
      it.volume = Math.max(1, Math.floor(it.semulaVolume * 0.7));
      it.jumlah = it.volume * it.tarifHarga;
      it.selisihJumlah = it.jumlah - it.semulaJumlah;
      it.selisihVolume = it.volume - it.semulaVolume;
      it.statusPerubahan = 'BERKURANG';
      it.alasanPerubahan = 'Pengalihan efisiensi anggaran ke buku bacaan literasi siswa';
    }
  }

  // Month 4: Mei 2026 (TW II)
  if (base[4]) {
    base[4].items.push({
      id: 'perub_new_mei_1',
      noUrut: base[4].items.length + 1,
      kodeRekening: '5.1.02.03.04.0076',
      kodeProgram: '05.08.10',
      uraian: 'Perbaikan Instalasi Listrik dan Penggantian MCB Lab Komputer (Penambahan Baru)',
      semulaVolume: 0,
      semulaSatuan: 'paket',
      semulaTarif: 0,
      semulaJumlah: 0,
      volume: 1,
      satuan: 'paket',
      tarifHarga: 2800000,
      jumlah: 2800000,
      selisihJumlah: 2800000,
      selisihVolume: 1,
      statusPerubahan: 'BARU',
      alasanPerubahan: 'Pencegahan korsleting dan stabilisasi daya untuk asesmen komputer',
      temaId: '05',
      temaNama: 'Standar Sarana dan Prasarana',
      subtemaKode: '05.08',
      subtemaNama: 'Pemeliharaan Sarana dan Prasarana Sekolah',
      kegiatanKode: '05.08.10',
      kegiatanNama: 'Pemeliharaan Perlengkapan Daya dan Jasa Sekolah'
    });
  }

  // Month 5: Juni 2026 (TW II)
  if (base[5]) {
    base[5].items.push({
      id: 'perub_new_jun_1',
      noUrut: base[5].items.length + 1,
      kodeRekening: '5.1.02.01.01.0024',
      kodeProgram: '06.05.01',
      uraian: 'Cetak Spanduk & Formulir Pendaftaran PPDB Tahun Pelajaran 2026/2027 (Penambahan Baru)',
      semulaVolume: 0,
      semulaSatuan: 'paket',
      semulaTarif: 0,
      semulaJumlah: 0,
      volume: 1,
      satuan: 'paket',
      tarifHarga: 1750000,
      jumlah: 1750000,
      selisihJumlah: 1750000,
      selisihVolume: 1,
      statusPerubahan: 'BARU',
      alasanPerubahan: 'Pelaksanaan kegiatan penerimaan peserta didik baru (PPDB) terpadu',
      temaId: '06',
      temaNama: 'Standar Pengelolaan',
      subtemaKode: '06.05',
      subtemaNama: 'Pelaksanaan Administrasi Kegiatan Sekolah',
      kegiatanKode: '06.05.01',
      kegiatanNama: 'Penerimaan Peserta Didik Baru (PPDB)'
    });
  }

  // Month 6: Juli 2026 (TW III)
  if (base[6]) {
    base[6].items.push({
      id: 'perub_new_jul_1',
      noUrut: base[6].items.length + 1,
      kodeRekening: '5.1.02.03.03.0005',
      kodeProgram: '05.08.01',
      uraian: 'Pengecatan dan Perbaikan Pintu Ruang Kelas 7 dan 8 (Penambahan Baru)',
      semulaVolume: 0,
      semulaSatuan: 'paket',
      semulaTarif: 0,
      semulaJumlah: 0,
      volume: 1,
      satuan: 'paket',
      tarifHarga: 5500000,
      jumlah: 5500000,
      selisihJumlah: 5500000,
      selisihVolume: 1,
      statusPerubahan: 'BARU',
      alasanPerubahan: 'Rehabilitasi ringan ruang belajar untuk menyambut tahun ajaran baru',
      temaId: '05',
      temaNama: 'Standar Sarana dan Prasarana',
      subtemaKode: '05.08',
      subtemaNama: 'Pemeliharaan Sarana dan Prasarana Sekolah',
      kegiatanKode: '05.08.01',
      kegiatanNama: 'Pemeliharaan Prasarana Lahan, Bangunan dan Ruang'
    });

    if (base[6].items.length > 2) {
      const it = base[6].items[0];
      it.volume = Math.max(1, Math.floor(it.semulaVolume / 2));
      it.jumlah = it.volume * it.tarifHarga;
      it.selisihJumlah = it.jumlah - it.semulaJumlah;
      it.selisihVolume = it.volume - it.semulaVolume;
      it.statusPerubahan = 'BERKURANG';
      it.alasanPerubahan = 'Efisiensi dan rasionalisasi anggaran belanja untuk penambahan rehabilitasi kelas';
    }
  }

  // Month 7: Agustus 2026 (TW III)
  if (base[7]) {
    base[7].items.push({
      id: 'perub_new_agu_1',
      noUrut: base[7].items.length + 1,
      kodeRekening: '5.1.02.01.01.0034',
      kodeProgram: '03.03.05',
      uraian: 'Peralatan dan Hadiah Lomba Peringatan HUT Kemerdekaan RI ke-81 (Penambahan Baru)',
      semulaVolume: 0,
      semulaSatuan: 'paket',
      semulaTarif: 0,
      semulaJumlah: 0,
      volume: 1,
      satuan: 'paket',
      tarifHarga: 3200000,
      jumlah: 3200000,
      selisihJumlah: 3200000,
      selisihVolume: 1,
      statusPerubahan: 'BARU',
      alasanPerubahan: 'Kegiatan pengembangan karakter dan nasionalisme peserta didik',
      temaId: '03',
      temaNama: 'Standar Proses',
      subtemaKode: '03.03',
      subtemaNama: 'Pelaksanaan Kegiatan Pembelajaran dan Ekstrakurikuler',
      kegiatanKode: '03.03.05',
      kegiatanNama: 'Pelaksanaan Kegiatan Lomba dan Pembinaan Kesiswaan'
    });
  }

  // Month 8: September 2026 (TW III)
  if (base[8]) {
    base[8].items.push({
      id: 'perub_new_sep_1',
      noUrut: base[8].items.length + 1,
      kodeRekening: '5.1.02.01.01.0055',
      kodeProgram: '08.04.08',
      uraian: 'Konsumsi Pengawas Ruang dan Proktor Utama ANBK 2026 (Penambahan Baru)',
      semulaVolume: 0,
      semulaSatuan: 'orang/hari',
      semulaTarif: 0,
      semulaJumlah: 0,
      volume: 24,
      satuan: 'orang/hari',
      tarifHarga: 65000,
      jumlah: 1560000,
      selisihJumlah: 1560000,
      selisihVolume: 24,
      statusPerubahan: 'BARU',
      alasanPerubahan: 'Fasilitasi konsumsi petugas pelaksanaan ANBK tingkat SMP',
      temaId: '08',
      temaNama: 'Standar Penilaian Pendidikan',
      subtemaKode: '08.04',
      subtemaNama: 'Pelaksanaan Kegiatan Asesmen dan Evaluasi Pembelajaran',
      kegiatanKode: '08.04.08',
      kegiatanNama: 'Pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK)'
    });
  }

  // Month 9: Oktober 2026 (TW IV)
  if (base[9]) {
    base[9].items.push({
      id: 'perub_new_okt_1',
      noUrut: base[9].items.length + 1,
      kodeRekening: '5.1.02.02.01.0013',
      kodeProgram: '04.06.25',
      uraian: 'Honor Narasumber Workshop Implementasi Kurikulum Merdeka Berbasis AI (Penambahan Baru)',
      semulaVolume: 0,
      semulaSatuan: 'orang/kegiatan',
      semulaTarif: 0,
      semulaJumlah: 0,
      volume: 2,
      satuan: 'orang/kegiatan',
      tarifHarga: 1500000,
      jumlah: 3000000,
      selisihJumlah: 3000000,
      selisihVolume: 2,
      statusPerubahan: 'BARU',
      alasanPerubahan: 'Peningkatan kapasitas guru dalam merancang modul ajar interaktif',
      temaId: '04',
      temaNama: 'Standar Tenaga Kependidikan',
      subtemaKode: '04.06',
      subtemaNama: 'Pengembangan Profesi Pendidik dan Tenaga Kependidikan',
      kegiatanKode: '04.06.25',
      kegiatanNama: 'Peningkatan Kompetensi Guru untuk pembelajaran berorientasi pada peserta didik'
    });
  }

  // Month 10: November 2026 (TW IV)
  if (base[10]) {
    if (base[10].items.length > 1) {
      const it = base[10].items[0];
      it.volume = Math.round(it.volume * 1.4);
      it.jumlah = it.volume * it.tarifHarga;
      it.selisihJumlah = it.jumlah - it.semulaJumlah;
      it.selisihVolume = it.volume - it.semulaVolume;
      it.statusPerubahan = 'BERTAMBAH';
      it.alasanPerubahan = 'Peningkatan frekuensi pemeliharaan kebersihan menjelang penilaian akhir tahun';
    }
  }

  // Month 11: Desember 2026 (TW IV)
  if (base[11]) {
    base[11].items.push({
      id: 'perub_new_des_1',
      noUrut: base[11].items.length + 1,
      kodeRekening: '5.1.02.01.01.0024',
      kodeProgram: '06.05.08',
      uraian: 'Penjilidan Buku Laporan Pertanggungjawaban Tahunan BOSP 2026 (Penambahan Baru)',
      semulaVolume: 0,
      semulaSatuan: 'buku',
      semulaTarif: 0,
      semulaJumlah: 0,
      volume: 8,
      satuan: 'buku',
      tarifHarga: 150000,
      jumlah: 1200000,
      selisihJumlah: 1200000,
      selisihVolume: 8,
      statusPerubahan: 'BARU',
      alasanPerubahan: 'Penyusunan berkas LPJ BOSP tahunan untuk Dinas Pendidikan dan Inspektorat',
      temaId: '06',
      temaNama: 'Standar Pengelolaan',
      subtemaKode: '06.05',
      subtemaNama: 'Pelaksanaan Administrasi Kegiatan Sekolah',
      kegiatanKode: '06.05.08',
      kegiatanNama: 'Penyusunan Laporan dan Evaluasi BOSP Sekolah'
    });
  }

  return base;
}

export const INITIAL_ARKAS_PERUBAHAN_DATA: ArkasPerubahanMonthWorksheet[] =
  generateRealisticPerubahanData(INITIAL_KERTAS_KERJA_DATA);

