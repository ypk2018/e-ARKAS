import { MONTH_NAMES, ROMAN_MONTHS } from '../data/schoolProfile';
import { SchoolProfile, SpjDocument, SpjType } from '../types';

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

export const formatTanggalIndo = (isoDate: string): string => {
  if (!isoDate) return "";
  const parts = isoDate.split("-");
  if (parts.length < 3) return isoDate;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  return `${d} ${MONTH_NAMES[m] || ""} ${y}`;
};

export const todayISO = (): string => {
  const d = new Date();
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};

export const generateNomorDokumen = (
  type: SpjType,
  tanggal: string,
  existingDocs: SpjDocument[],
  school: SchoolProfile
): string => {
  const dt = tanggal ? new Date(tanggal) : new Date();
  const y = dt.getFullYear() || 2026;
  const mIdx = isNaN(dt.getMonth()) ? 0 : dt.getMonth();
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
  const same = existingDocs.filter(
    (d) => d.type === type && (d.tanggal || "").startsWith(String(y))
  );
  const urut = String(same.length + 1).padStart(3, "0");
  return `${urut}/${code}/BOSP/SMPN7/${rom}/${y}`;
};

export const generateUid = (): string =>
  "doc_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36);
