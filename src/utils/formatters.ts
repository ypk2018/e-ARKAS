import { MONTH_NAMES, ROMAN_MONTHS } from '../data/schoolProfile';
import {
  SchoolProfile,
  SpjDocument,
  SpjType,
  KertasKerjaItem,
  ArkasPerubahanItem,
  MonthWorksheet,
  ArkasPerubahanMonthWorksheet
} from '../types';

export const formatRp = (n: number): string => {
  const num = Math.round(Number(n) || 0);
  const isNeg = num < 0;
  const str = Math.abs(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (isNeg ? "-Rp " : "Rp ") + str;
};

export const terbilang = (n: number): string => {
  const num = Math.floor(Math.abs(Number(n) || 0));
  if (num === 0) return "nol";
  const sat = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];

  const recur = (x: number): string => {
    if (x < 12) return sat[x];
    if (x < 20) return sat[x - 10] + " belas";
    if (x < 100) return sat[Math.floor(x / 10)] + " puluh" + (x % 10 ? " " + sat[x % 10] : "");
    if (x < 200) return "seratus" + (x % 100 ? " " + recur(x % 100) : "");
    if (x < 1000) return sat[Math.floor(x / 100)] + " ratus" + (x % 100 ? " " + recur(x % 100) : "");
    if (x < 2000) return "seribu" + (x % 1000 ? " " + recur(x % 1000) : "");
    if (x < 1e6) return recur(Math.floor(x / 1000)) + " ribu" + (x % 1000 ? " " + recur(x % 1000) : "");
    if (x < 1e9) return recur(Math.floor(x / 1e6)) + " juta" + (x % 1e6 ? " " + recur(x % 1e6) : "");
    if (x < 1e12) return recur(Math.floor(x / 1e9)) + " miliar" + (x % 1e9 ? " " + recur(x % 1e9) : "");
    return recur(Math.floor(x / 1e12)) + " triliun" + (x % 1e12 ? " " + recur(x % 1e12) : "");
  };

  const res = recur(num);
  return res.charAt(0).toUpperCase() + res.slice(1);
};

export const formatTanggalIndo = (isoDate?: string, manualText?: string): string => {
  if (manualText && manualText.trim()) {
    return manualText.trim();
  }
  if (!isoDate) return "";
  const trimmed = isoDate.trim();
  const parts = trimmed.split("-");
  if (parts.length === 3 && /^\d{4}$/.test(parts[0])) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (!isNaN(d) && MONTH_NAMES[m] && !isNaN(y)) {
      return `${d} ${MONTH_NAMES[m]} ${y}`;
    }
  }
  return trimmed;
};

export const todayISO = (): string => {
  const d = new Date();
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};

export interface ParsedDateParts {
  day: number;
  monthIndex: number;
  monthName: string;
  year: string;
  isoDate: string;
  formatted: string;
}

export const parseDateToParts = (
  tanggal?: string,
  fallbackMonthIdx = 0,
  fallbackYear = "2026",
  manualText?: string
): ParsedDateParts => {
  const safeMonthIdx = Math.max(0, Math.min(11, fallbackMonthIdx));
  if (tanggal && /^\d{4}-\d{1,2}-\d{1,2}$/.test(tanggal.trim())) {
    const [yStr, mStr, dStr] = tanggal.trim().split("-");
    const y = yStr || fallbackYear;
    const mIdx = Math.max(0, Math.min(11, (parseInt(mStr, 10) || 1) - 1));
    const d = Math.max(1, Math.min(31, parseInt(dStr, 10) || 15));
    const iso = `${y.padStart(4, "0")}-${String(mIdx + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    return {
      day: d,
      monthIndex: mIdx,
      monthName: MONTH_NAMES[mIdx],
      year: y,
      isoDate: iso,
      formatted: manualText && manualText.trim() ? manualText.trim() : `${d} ${MONTH_NAMES[mIdx]} ${y}`
    };
  }

  // Try parsing Indonesian text like "15 Januari 2026"
  const textToParse = (manualText || tanggal || "").trim();
  if (textToParse) {
    const match = textToParse.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (match) {
      const d = Math.max(1, Math.min(31, parseInt(match[1], 10) || 15));
      const mNameLower = match[2].toLowerCase();
      const foundMIdx = MONTH_NAMES.findIndex((m) => m.toLowerCase().startsWith(mNameLower.slice(0, 3)));
      const mIdx = foundMIdx >= 0 ? foundMIdx : safeMonthIdx;
      const y = match[3] || fallbackYear;
      const iso = `${y}-${String(mIdx + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      return {
        day: d,
        monthIndex: mIdx,
        monthName: MONTH_NAMES[mIdx],
        year: y,
        isoDate: iso,
        formatted: manualText && manualText.trim() ? manualText.trim() : `${d} ${MONTH_NAMES[mIdx]} ${y}`
      };
    }
  }

  const defaultDay = 15;
  const iso = `${fallbackYear}-${String(safeMonthIdx + 1).padStart(2, "0")}-${String(defaultDay).padStart(2, "0")}`;
  return {
    day: defaultDay,
    monthIndex: safeMonthIdx,
    monthName: MONTH_NAMES[safeMonthIdx],
    year: fallbackYear,
    isoDate: iso,
    formatted: manualText && manualText.trim() ? manualText.trim() : `${defaultDay} ${MONTH_NAMES[safeMonthIdx]} ${fallbackYear}`
  };
};

export const composeDateFromParts = (
  day: number | string,
  monthIndex: number,
  year: number | string
): { isoDate: string; formatted: string; day: number; monthIndex: number; year: string } => {
  const safeDay = Math.max(1, Math.min(31, parseInt(String(day), 10) || 1));
  const safeMonth = Math.max(0, Math.min(11, Number(monthIndex) || 0));
  const cleanYear = String(year || "2026").replace(/[^0-9]/g, "").slice(0, 4) || "2026";
  const paddedYear = cleanYear.padStart(4, "2");
  const isoDate = `${paddedYear}-${String(safeMonth + 1).padStart(2, "0")}-${String(safeDay).padStart(2, "0")}`;
  const formatted = `${safeDay} ${MONTH_NAMES[safeMonth]} ${paddedYear}`;
  return {
    isoDate,
    formatted,
    day: safeDay,
    monthIndex: safeMonth,
    year: paddedYear
  };
};

export const detectBestSpjType = (uraian: string, kodeRekening?: string): SpjType => {
  const u = (uraian || "").toLowerCase();
  const rek = (kodeRekening || "").toLowerCase();
  if (
    u.includes("honor") ||
    u.includes("gaji") ||
    u.includes("gtt") ||
    u.includes("ptt") ||
    u.includes("insentif") ||
    rek.includes("5.1.02.02.01.0011") ||
    rek.includes("5.1.02.02.01.0013")
  ) {
    return "daftar";
  }
  return "kwitansi";
};

export const generateNomorDokumen = (
  type: SpjType,
  tanggal: string,
  existingDocs: SpjDocument[],
  _school?: SchoolProfile,
  customSeq?: number
): string => {
  const parts = parseDateToParts(tanggal);
  const y = parts.year || "2026";
  const mIdx = parts.monthIndex;
  const rom = ROMAN_MONTHS[mIdx] || "I";

  const typeCodes: Record<SpjType, string> = {
    kwitansi: "KW",
    daftar: "DP",
    nota: "NT",
    faktur: "FK",
    bkk: "BKK",
    berita: "BA",
    sptj: "SPTJ",
  };

  const code = typeCodes[type] || "BOS";
  if (typeof customSeq === "number" && customSeq > 0) {
    const urut = String(customSeq).padStart(3, "0");
    return `${urut}/${code}/BOSP/SMPN7/${rom}/${y}`;
  }

  const same = existingDocs.filter(
    (d) => d.type === type && (d.tanggal || "").startsWith(String(y))
  );
  const urut = String(same.length + 1).padStart(3, "0");
  return `${urut}/${code}/BOSP/SMPN7/${rom}/${y}`;
};

export const generateUid = (): string =>
  "doc_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36);

/**
 * Builds a complete, official SpjDocument from any expenditure item (KertasKerjaItem or ArkasPerubahanItem)
 */
export const buildOfficialSpjFromBelanjaItem = (
  item: KertasKerjaItem | ArkasPerubahanItem,
  monthIndex: number,
  sourceArkasType: "murni" | "perubahan",
  school: SchoolProfile,
  existingDocs: SpjDocument[],
  overrideType?: SpjType,
  customSeq?: number
): SpjDocument => {
  const type: SpjType = overrideType || item.spjDocType || detectBestSpjType(item.uraian, item.kodeRekening);
  const isHonor = type === "daftar" || detectBestSpjType(item.uraian, item.kodeRekening) === "daftar";

  const parsedDate = parseDateToParts(
    item.tanggal,
    monthIndex,
    school.tahunAnggaran || "2026",
    item.tanggalManualText
  );

  const effectiveMonthIdx = parsedDate.monthIndex;
  const triwulan =
    effectiveMonthIdx < 3 ? "I" : effectiveMonthIdx < 6 ? "II" : effectiveMonthIdx < 9 ? "III" : "IV";

  const nomor = generateNomorDokumen(type, parsedDate.isoDate, existingDocs, school, customSeq);

  const defaultPenerima =
    item.penerimaDefault ||
    (isHonor
      ? item.uraian.replace(/^(Honor|Gaji)\s+(Guru\s+)?(atas\s+nama\s+)?/i, "").trim() || "Daftar Terlampir"
      : `Penyedia / Rekanan [${item.subtemaNama || "BOSP"}]`);

  const defaultJabatan =
    item.jabatanDefault ||
    (isHonor ? "Tenaga Pendidik / Kependidikan" : "Penyedia Barang / Jasa");

  const labelArkas = sourceArkasType === "perubahan" ? "ARKAS Perubahan" : "ARKAS Reguler (Murni)";

  return {
    id: `spj_${sourceArkasType}_${item.id}`,
    type,
    nomor,
    tanggal: parsedDate.isoDate,
    tanggalManualText: item.tanggalManualText || parsedDate.formatted,
    triwulan,
    terimaDari: `Bendahara ${school.sumberDana} ${school.nama}`,
    penerima: defaultPenerima,
    jabatanPenerima: defaultJabatan,
    tokoNama: isHonor ? school.nama : defaultPenerima,
    tokoAlamat: `${school.kecamatan}, ${school.kabupaten}`,
    tokoPic: defaultPenerima,
    pihak2Nama: defaultPenerima,
    pihak2Jabatan: defaultJabatan,
    judul: `${item.uraian} (${parsedDate.monthName} ${parsedDate.year})`,
    kegiatan: item.kegiatanNama || item.subtemaNama || item.uraian,
    jumlah: item.jumlah,
    uraian: `Pembayaran belanja ${labelArkas}: ${item.uraian} (${item.volume} ${item.satuan} @ ${formatRp(
      item.tarifHarga
    )}) pada tanggal ${parsedDate.formatted}`,
    rekening: item.kodeRekening,
    komponen: `Standar ${item.temaId} - ${item.subtemaNama}`,
    temaKode: item.temaId,
    subtemaKode: item.subtemaKode,
    metode: "Tunai",
    lunas: true,
    materai: item.jumlah >= 5000000,
    rangkap: true,
    sourceKertasKerjaId: item.id,
    sourceArkasType,
    items: isHonor
      ? [
          {
            nama: defaultPenerima,
            jabatan: defaultJabatan,
            honor: item.jumlah,
            pph: 0,
            jumlah: item.jumlah
          }
        ]
      : [
          {
            kode: item.kodeRekening,
            nama: item.uraian,
            qty: item.volume,
            satuan: item.satuan,
            harga: item.tarifHarga,
            jumlah: item.jumlah,
            ket: "Lengkap / Sesuai"
          }
        ],
    updatedAt: new Date().toISOString()
  };
};

/**
 * Ensures EVERY expenditure item across all 12 months in both Kertas Kerja Murni and ARKAS Perubahan
 * has an official SPJ Document in the archive, and keeps dates/amounts synced when items are updated.
 */
export const syncAndEnsureAllOfficialSpjDocs = (
  murniWorksheets: MonthWorksheet[],
  perubahanWorksheets: ArkasPerubahanMonthWorksheet[],
  existingDocs: SpjDocument[],
  school: SchoolProfile
): SpjDocument[] => {
  const docMap = new Map<string, SpjDocument>();
  existingDocs.forEach((d) => {
    docMap.set(d.id, d);
  });

  // Track by sourceKertasKerjaId + sourceArkasType
  const bySourceKey = new Map<string, SpjDocument>();
  existingDocs.forEach((d) => {
    if (d.sourceKertasKerjaId) {
      const key = `${d.sourceArkasType || "murni"}_${d.sourceKertasKerjaId}`;
      bySourceKey.set(key, d);
    }
  });

  let seqCounter = existingDocs.length + 1;

  // 1. Ensure every item in ARKAS Murni (12 months) has an official SPJ doc
  murniWorksheets.forEach((ws, mIdx) => {
    ws.items.forEach((item, idx) => {
      const key = `murni_${item.id}`;
      const existing = bySourceKey.get(key) || docMap.get(`spj_murni_${item.id}`);
      const defaultDay = Math.min(28, 5 + (idx % 22));
      const itemWithDate: KertasKerjaItem = {
        ...item,
        tanggal:
          item.tanggal ||
          `${school.tahunAnggaran || "2026"}-${String(mIdx + 1).padStart(2, "0")}-${String(defaultDay).padStart(2, "0")}`
      };

      if (!existing) {
        const created = buildOfficialSpjFromBelanjaItem(
          itemWithDate,
          mIdx,
          "murni",
          school,
          existingDocs,
          item.spjDocType,
          seqCounter++
        );
        docMap.set(created.id, created);
        bySourceKey.set(key, created);
      } else {
        // Sync updated date/amount if item was modified
        const parsed = parseDateToParts(
          itemWithDate.tanggal,
          mIdx,
          school.tahunAnggaran || "2026",
          itemWithDate.tanggalManualText
        );
        const updatedDoc: SpjDocument = {
          ...existing,
          tanggal: item.tanggal ? parsed.isoDate : existing.tanggal,
          tanggalManualText: item.tanggalManualText || (item.tanggal ? parsed.formatted : existing.tanggalManualText),
          jumlah: item.jumlah,
          rekening: item.kodeRekening,
          komponen: `Standar ${item.temaId} - ${item.subtemaNama}`,
          sourceKertasKerjaId: item.id,
          sourceArkasType: "murni"
        };
        docMap.set(existing.id, updatedDoc);
      }
    });
  });

  // 2. Ensure every active item in ARKAS Perubahan (12 months) has an official SPJ doc
  perubahanWorksheets.forEach((ws, mIdx) => {
    ws.items.forEach((item, idx) => {
      const key = `perubahan_${item.id}`;
      const existing = bySourceKey.get(key) || docMap.get(`spj_perubahan_${item.id}`);

      if (item.statusPerubahan === "DIHILANGKAN") {
        // If item is eliminated, remove auto-generated SPJ doc if any
        if (existing && existing.id.startsWith("spj_perubahan_")) {
          docMap.delete(existing.id);
        }
        return;
      }

      const defaultDay = Math.min(28, 5 + (idx % 22));
      const itemWithDate: ArkasPerubahanItem = {
        ...item,
        tanggal:
          item.tanggal ||
          `${school.tahunAnggaran || "2026"}-${String(mIdx + 1).padStart(2, "0")}-${String(defaultDay).padStart(2, "0")}`
      };

      if (!existing) {
        const created = buildOfficialSpjFromBelanjaItem(
          itemWithDate,
          mIdx,
          "perubahan",
          school,
          existingDocs,
          item.spjDocType,
          seqCounter++
        );
        docMap.set(created.id, created);
        bySourceKey.set(key, created);
      } else {
        const parsed = parseDateToParts(
          itemWithDate.tanggal,
          mIdx,
          school.tahunAnggaran || "2026",
          itemWithDate.tanggalManualText
        );
        const updatedDoc: SpjDocument = {
          ...existing,
          tanggal: item.tanggal ? parsed.isoDate : existing.tanggal,
          tanggalManualText: item.tanggalManualText || (item.tanggal ? parsed.formatted : existing.tanggalManualText),
          jumlah: item.jumlah,
          rekening: item.kodeRekening,
          komponen: `Standar ${item.temaId} - ${item.subtemaNama}`,
          sourceKertasKerjaId: item.id,
          sourceArkasType: "perubahan"
        };
        docMap.set(existing.id, updatedDoc);
      }
    });
  });

  return Array.from(docMap.values());
};

export const inferDefaultSpjType = (kodeRekening?: string, uraian?: string): SpjType => {
  return detectBestSpjType(uraian || "", kodeRekening);
};

export const buildOfficialSpjFromExpenditure = (
  item: KertasKerjaItem | ArkasPerubahanItem,
  monthIndex: number,
  school: SchoolProfile,
  sourceArkasType: "murni" | "perubahan" = "murni",
  existingDoc?: SpjDocument,
  overrideType?: SpjType
): SpjDocument => {
  const built = buildOfficialSpjFromBelanjaItem(
    item,
    monthIndex,
    sourceArkasType,
    school,
    existingDoc ? [existingDoc] : [],
    overrideType || existingDoc?.type || item.spjDocType
  );
  if (existingDoc) {
    return {
      ...existingDoc,
      ...built,
      id: existingDoc.id,
      nomor:
        (overrideType && overrideType !== existingDoc.type)
          ? built.nomor
          : existingDoc.nomor || built.nomor
    };
  }
  return built;
};

export const ensureAllExpendituresHaveOfficialSpj = syncAndEnsureAllOfficialSpjDocs;


