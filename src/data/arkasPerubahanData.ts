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
 * Contains:
 * - Items marked 'TETAP' (unchanged)
 * - Items marked 'BERTAMBAH' (increased volume/amount)
 * - Items marked 'BERKURANG' (reduced budget)
 * - Items marked 'BARU' (brand new items not present in ARKAS Murni)
 * - Items marked 'DIHILANGKAN' (originally in ARKAS Murni, canceled/removed in Perubahan)
 */
export const INITIAL_ARKAS_PERUBAHAN_DATA: ArkasPerubahanMonthWorksheet[] = (() => {
  const base = initializePerubahanFromMurni(INITIAL_KERTAS_KERJA_DATA);

  // Month 0: Januari
  if (base[0] && base[0].items.length > 3) {
    // 1. Tambahkan item BARU yang tidak ada di ARKAS Murni
    const newItemJan: ArkasPerubahanItem = {
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
    };
    base[0].items.push(newItemJan);

    // 2. Tandai salah satu item sebagai DIHILANGKAN (pembatalan/dihapus)
    const itemToCancel = base[0].items.find((it) => it.kodeRekening === '5.1.02.03.03.0005');
    if (itemToCancel) {
      itemToCancel.volume = 0;
      itemToCancel.jumlah = 0;
      itemToCancel.selisihJumlah = -itemToCancel.semulaJumlah;
      itemToCancel.selisihVolume = -itemToCancel.semulaVolume;
      itemToCancel.statusPerubahan = 'DIHILANGKAN';
      itemToCancel.alasanPerubahan = 'Dihilangkan karena dialihkan ke rehabilitasi darurat ruang kelas pada Triwulan III';
    }

    // 3. Modifikasi item menjadi BERTAMBAH
    const itemToAdd = base[0].items.find((it) => it.kodeRekening === '5.1.02.01.01.0024');
    if (itemToAdd) {
      itemToAdd.volume = 15000;
      itemToAdd.jumlah = 15000 * itemToAdd.tarifHarga;
      itemToAdd.selisihJumlah = itemToAdd.jumlah - itemToAdd.semulaJumlah;
      itemToAdd.selisihVolume = 15000 - itemToAdd.semulaVolume;
      itemToAdd.statusPerubahan = 'BERTAMBAH';
      itemToAdd.alasanPerubahan = 'Peningkatan volume fotokopi modul kurikulum merdeka dan lembar kerja siswa';
    }
  }

  // Month 2: Maret
  if (base[2]) {
    const newItemMar: ArkasPerubahanItem = {
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
    };
    base[2].items.push(newItemMar);
  }

  // Month 6: Juli
  if (base[6] && base[6].items.length > 1) {
    const itemRed = base[6].items[0];
    if (itemRed) {
      const newVol = Math.max(1, Math.floor(itemRed.semulaVolume / 2));
      itemRed.volume = newVol;
      itemRed.jumlah = newVol * itemRed.tarifHarga;
      itemRed.selisihJumlah = itemRed.jumlah - itemRed.semulaJumlah;
      itemRed.selisihVolume = newVol - itemRed.semulaVolume;
      itemRed.statusPerubahan = 'BERKURANG';
      itemRed.alasanPerubahan = 'Efisiensi dan rasionalisasi anggaran belanja untuk penambahan kuota internet sekolah';
    }
  }

  return base;
})();
