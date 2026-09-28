import React, { useState, useEffect } from 'react';
import {
  Calendar,
  RefreshCw,
  Edit3,
  CheckCircle2,
  Receipt,
  Printer,
  ExternalLink,
  X,
  FileText,
  Sparkles
} from 'lucide-react';
import { MONTH_NAMES } from '../data/schoolProfile';
import {
  parseDateToParts,
  composeDateFromParts,
  todayISO,
  formatRp,
  formatTanggalIndo,
  buildOfficialSpjFromExpenditure,
  inferDefaultSpjType
} from '../utils/formatters';
import { SpjType, SpjDocument, SchoolProfile, KertasKerjaItem, ArkasPerubahanItem } from '../types';
import { printSpjDocument } from '../utils/printDocument';

export const SPJ_TYPE_OPTIONS: { value: SpjType; label: string; shortLabel: string }[] = [
  { value: 'kwitansi', label: 'Kwitansi Resmi BOSP', shortLabel: 'Kwitansi' },
  { value: 'daftar', label: 'Daftar Penerimaan Honorarium', shortLabel: 'Daftar Honor' },
  { value: 'nota', label: 'Nota Pembelian Toko', shortLabel: 'Nota Toko' },
  { value: 'faktur', label: 'Faktur Barang & Jasa', shortLabel: 'Faktur' },
  { value: 'bkk', label: 'Bukti Kas Keluar (BKK)', shortLabel: 'BKK' },
  { value: 'berita', label: 'Berita Acara Serah Terima / Pembayaran', shortLabel: 'Berita Acara' },
  { value: 'sptj', label: 'Surat Pernyataan Tanggung Jawab (SPTJ)', shortLabel: 'SPTJ' }
];

interface FlexibleDateControlProps {
  tanggal: string;
  tanggalManualText?: string;
  defaultMonthIndex?: number;
  defaultYear?: string;
  spjDocType?: SpjType;
  showSpjTypeSelector?: boolean;
  showSpjSelector?: boolean;
  onChange: (newIsoDate: string, newManualText: string, newSpjType?: SpjType) => void;
  onChangeSpjDocType?: (newType: SpjType) => void;
  label?: string;
  compact?: boolean;
}

export const FlexibleDateControl: React.FC<FlexibleDateControlProps> = ({
  tanggal,
  tanggalManualText,
  defaultMonthIndex = 0,
  defaultYear = '2026',
  spjDocType = 'kwitansi',
  showSpjTypeSelector = false,
  showSpjSelector = false,
  onChange,
  onChangeSpjDocType,
  label = 'Pengisian Tanggal, Bulan & Tahun Belanja / SPJ (Update & Manual)',
  compact = false
}) => {
  const isSpjSelectorVisible = showSpjTypeSelector || showSpjSelector;
  const parsed = parseDateToParts(tanggal, defaultMonthIndex, defaultYear, tanggalManualText);

  const [dayVal, setDayVal] = useState<string>(String(parsed.day));
  const [monthIdxVal, setMonthIdxVal] = useState<number>(parsed.monthIndex);
  const [customMonthName, setCustomMonthName] = useState<string>(parsed.monthName);
  const [yearVal, setYearVal] = useState<string>(parsed.year);
  const [manualOverrideText, setManualOverrideText] = useState<string>(tanggalManualText || parsed.formatted);
  const [useCustomFreeText, setUseCustomFreeText] = useState<boolean>(false);
  const [selectedSpjType, setSelectedSpjType] = useState<SpjType>(spjDocType);

  useEffect(() => {
    const p = parseDateToParts(tanggal, defaultMonthIndex, defaultYear, tanggalManualText);
    setDayVal(String(p.day));
    setMonthIdxVal(p.monthIndex);
    setCustomMonthName(p.monthName);
    setYearVal(p.year);
    setManualOverrideText(tanggalManualText || p.formatted);
  }, [tanggal, tanggalManualText, defaultMonthIndex, defaultYear]);

  useEffect(() => {
    if (spjDocType) {
      setSelectedSpjType(spjDocType);
    }
  }, [spjDocType]);

  const applyPartsChange = (
    nextDay: string | number,
    nextMonthIdx: number,
    nextYear: string,
    nextSpjType: SpjType = selectedSpjType,
    customMonthStr?: string
  ) => {
    const composed = composeDateFromParts(nextDay, nextMonthIdx, nextYear);
    const mLabel = customMonthStr || MONTH_NAMES[composed.monthIndex] || 'Januari';
    const textFormatted = `${composed.day} ${mLabel} ${composed.year}`;
    setDayVal(String(composed.day));
    setMonthIdxVal(composed.monthIndex);
    setCustomMonthName(mLabel);
    setYearVal(composed.year);
    setManualOverrideText(textFormatted);
    onChange(composed.isoDate, textFormatted, nextSpjType);
  };

  const handleCalendarPickerChange = (isoStr: string) => {
    if (!isoStr) return;
    const p = parseDateToParts(isoStr, defaultMonthIndex, defaultYear);
    setDayVal(String(p.day));
    setMonthIdxVal(p.monthIndex);
    setCustomMonthName(p.monthName);
    setYearVal(p.year);
    setManualOverrideText(p.formatted);
    onChange(p.isoDate, p.formatted, selectedSpjType);
  };

  const handleSetToday = () => {
    const today = todayISO();
    handleCalendarPickerChange(today);
  };

  const handleSyncToWorkMonth = () => {
    applyPartsChange(dayVal || 15, defaultMonthIndex, defaultYear || '2026', selectedSpjType);
  };

  const YEAR_PRESETS = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];

  return (
    <div className={`rounded-2xl border border-[#D5CEBF] bg-gradient-to-br from-[#FAF8F5] to-[#F3EFE6] ${compact ? 'p-3 space-y-2.5' : 'p-3.5 space-y-3'} shadow-2xs`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C2A28]">
          <Calendar className="w-4 h-4 text-[#5A5A40]" />
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleSetToday}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#5A5A40] hover:bg-[#484832] text-white text-[10px] font-bold transition cursor-pointer shadow-2xs"
            title="Update otomatis ke Tanggal, Bulan & Tahun Hari Ini"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Update Hari Ini</span>
          </button>
          <button
            type="button"
            onClick={handleSyncToWorkMonth}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#E8E2D6] text-[#2C2A28] border border-[#C5BDAF] text-[10px] font-semibold transition cursor-pointer"
            title={`Sesuaikan ke Bulan ${MONTH_NAMES[defaultMonthIndex]} ${defaultYear}`}
          >
            <span>Bulan {MONTH_NAMES[defaultMonthIndex]}</span>
          </button>
        </div>
      </div>

      {/* Baris 1: Input Manual Terpisah (Tanggal, Bulan, Tahun) + Kalender Update */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
        {/* Tanggal (Hari 1-31) */}
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold text-[#5C5852] uppercase mb-1">
            Tanggal (1-31)
          </label>
          <input
            type="number"
            min={1}
            max={31}
            value={dayVal}
            onChange={(e) => {
              const raw = e.target.value;
              setDayVal(raw);
              const num = parseInt(raw, 10);
              if (!isNaN(num) && num >= 1 && num <= 31) {
                applyPartsChange(num, monthIdxVal, yearVal, selectedSpjType, customMonthName);
              }
            }}
            onBlur={() => {
              const safeD = Math.max(1, Math.min(31, parseInt(dayVal, 10) || 1));
              applyPartsChange(safeD, monthIdxVal, yearVal, selectedSpjType, customMonthName);
            }}
            placeholder="Tgl"
            className="w-full p-2 bg-white border border-[#C5BDAF] rounded-xl font-mono font-bold text-xs text-center text-[#2C2A28] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
          />
        </div>

        {/* Bulan (Pilih atau Ketik Manual) */}
        <div className="sm:col-span-4">
          <label className="block text-[10px] font-bold text-[#5C5852] uppercase mb-1">
            Bulan (Pilih / Manual)
          </label>
          <select
            value={monthIdxVal}
            onChange={(e) => {
              const mIdx = parseInt(e.target.value, 10);
              applyPartsChange(dayVal, mIdx, yearVal, selectedSpjType, MONTH_NAMES[mIdx]);
            }}
            className="w-full p-2 bg-white border border-[#C5BDAF] rounded-xl font-semibold text-xs text-[#2C2A28] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] cursor-pointer"
          >
            {MONTH_NAMES.map((mName, idx) => (
              <option key={idx} value={idx}>
                {String(idx + 1).padStart(2, '0')} - {mName}
              </option>
            ))}
          </select>
        </div>

        {/* Tahun (Ketik Manual Bebas Kapan Saja + Pilihan Cepat) */}
        <div className="sm:col-span-3">
          <label className="block text-[10px] font-bold text-[#5C5852] uppercase mb-1">
            Tahun (Ketik Manual)
          </label>
          <input
            type="text"
            list="year-presets-list"
            value={yearVal}
            onChange={(e) => {
              const rawY = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
              setYearVal(rawY);
              if (rawY.length === 4) {
                applyPartsChange(dayVal, monthIdxVal, rawY, selectedSpjType, customMonthName);
              }
            }}
            onBlur={() => {
              const safeY = yearVal.length === 4 ? yearVal : defaultYear || '2026';
              applyPartsChange(dayVal, monthIdxVal, safeY, selectedSpjType, customMonthName);
            }}
            placeholder="mis. 2026"
            className="w-full p-2 bg-white border border-[#C5BDAF] rounded-xl font-mono font-bold text-xs text-center text-[#2C2A28] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
          />
          <datalist id="year-presets-list">
            {YEAR_PRESETS.map((yr) => (
              <option key={yr} value={yr} />
            ))}
          </datalist>
        </div>

        {/* Kalender Picker (Update Cepat) */}
        <div className="sm:col-span-3">
          <label className="block text-[10px] font-bold text-[#5C5852] uppercase mb-1">
            Kalender Otomatis
          </label>
          <input
            type="date"
            value={parsed.isoDate}
            onChange={(e) => handleCalendarPickerChange(e.target.value)}
            className="w-full p-1.5 bg-white border border-[#C5BDAF] rounded-xl font-mono text-[11px] text-[#2C2A28] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] cursor-pointer"
          />
        </div>
      </div>

      {/* Baris 2: Pratinjau Hasil & Opsi Ketik Teks Tanggal Manual Bebas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-[#E0DACE]">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-[#6B665E] font-medium">Tercetak di SPJ Resmi:</span>
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
            Sentani, {manualOverrideText || parsed.formatted}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setUseCustomFreeText(!useCustomFreeText)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5A5A40] hover:underline cursor-pointer self-start sm:self-auto"
        >
          <Edit3 className="w-3 h-3" />
          <span>{useCustomFreeText ? 'Sembunyikan Ketik Teks Bebas' : 'Ketik Teks Tanggal Manual Bebas'}</span>
        </button>
      </div>

      {useCustomFreeText && (
        <div className="pt-1">
          <label className="block text-[10px] font-bold text-[#5C5852] mb-1">
            Ketik Manual Format Tanggal, Bulan & Tahun Bebas (Digunakan Langsung pada Dokumen SPJ Resmi):
          </label>
          <input
            type="text"
            value={manualOverrideText}
            onChange={(e) => {
              const txt = e.target.value;
              setManualOverrideText(txt);
              const p = parseDateToParts(tanggal, monthIdxVal, yearVal, txt);
              onChange(p.isoDate, txt, selectedSpjType);
            }}
            placeholder="Contoh: 15 Januari 2026 atau 28 September 2026"
            className="w-full p-2 bg-white border border-[#5A5A40] rounded-xl text-xs font-bold text-[#2C2A28] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
          />
        </div>
      )}

      {/* Baris 3 (Opsional): Pemilihan Jenis Dokumen SPJ Resmi */}
      {isSpjSelectorVisible && (
        <div className="pt-2 border-t border-[#E0DACE]">
          <label className="block text-[10px] font-bold text-[#5C5852] uppercase mb-1.5 flex items-center gap-1">
            <Receipt className="w-3.5 h-3.5 text-[#059669]" />
            <span>Dokumen SPJ Resmi Terhubung untuk Belanja Ini:</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SPJ_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setSelectedSpjType(opt.value);
                  if (onChangeSpjDocType) onChangeSpjDocType(opt.value);
                  onChange(parsed.isoDate, manualOverrideText, opt.value);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                  selectedSpjType === opt.value
                    ? 'bg-[#059669] text-white border-[#059669] shadow-2xs'
                    : 'bg-white text-[#4A463F] border-[#D5CEBF] hover:bg-[#F9F7F2]'
                }`}
              >
                {opt.shortLabel}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface QuickDateSpjModalProps {
  item: KertasKerjaItem | ArkasPerubahanItem;
  monthIndex: number;
  school: SchoolProfile;
  sourceType: 'murni' | 'perubahan';
  existingSpjDoc?: SpjDocument;
  onClose: () => void;
  onSaveDateAndSpj: (
    updatedFields: {
      tanggal: string;
      tanggalManualText: string;
      spjDocType: SpjType;
    },
    generatedDoc: SpjDocument
  ) => void;
  onOpenInSpjEditor: (doc: SpjDocument) => void;
}

export const QuickDateSpjModal: React.FC<QuickDateSpjModalProps> = ({
  item,
  monthIndex,
  school,
  sourceType,
  existingSpjDoc,
  onClose,
  onSaveDateAndSpj,
  onOpenInSpjEditor
}) => {
  const initialType = existingSpjDoc?.type || item.spjDocType || inferDefaultSpjType(item.kodeRekening, item.uraian);
  const parsed = parseDateToParts(item.tanggal, monthIndex, String(school.tahunAnggaran || '2026'), item.tanggalManualText);
  const [isoDate, setIsoDate] = useState<string>(parsed.isoDate);
  const [manualText, setManualText] = useState<string>(item.tanggalManualText || parsed.formatted);
  const [docType, setDocType] = useState<SpjType>(initialType);
  const [savedBanner, setSavedBanner] = useState<boolean>(false);

  useEffect(() => {
    const p = parseDateToParts(item.tanggal, monthIndex, String(school.tahunAnggaran || '2026'), item.tanggalManualText);
    setIsoDate(p.isoDate);
    setManualText(item.tanggalManualText || p.formatted);
    setDocType(existingSpjDoc?.type || item.spjDocType || inferDefaultSpjType(item.kodeRekening, item.uraian));
    setSavedBanner(false);
  }, [item, monthIndex, school.tahunAnggaran, existingSpjDoc]);

  const buildCurrentDoc = (customType: SpjType = docType): SpjDocument => {
    const updatedItem = {
      ...item,
      tanggal: isoDate,
      tanggalManualText: manualText,
      spjDocType: customType
    };
    return buildOfficialSpjFromExpenditure(
      updatedItem,
      monthIndex,
      school,
      sourceType,
      existingSpjDoc,
      customType
    );
  };

  const handleSaveOnly = () => {
    const generatedDoc = buildCurrentDoc(docType);
    onSaveDateAndSpj(
      {
        tanggal: isoDate,
        tanggalManualText: manualText,
        spjDocType: docType
      },
      generatedDoc
    );
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2C2A28]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 shadow-2xl border border-[#E0DACE] space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E0DACE] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ✓ Dokumen SPJ Resmi Tersedia
                </span>
                <span className="text-[10px] font-mono text-[#8C867E]">
                  {sourceType === 'perubahan' ? 'ARKAS Perubahan' : 'ARKAS Murni'}
                </span>
              </div>
              <h3 className="text-base font-serif font-bold text-[#2C2A28] mt-0.5">
                Atur Tanggal, Bulan, Tahun & Dokumen SPJ Resmi
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8C867E] hover:text-[#2C2A28] rounded-xl hover:bg-[#F2EDE4] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Belanja */}
        <div className="p-3.5 bg-[#F9F7F2] rounded-2xl border border-[#E0DACE] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono font-bold text-[#8C867E]">
              Kode Rekening: {item.kodeRekening} &bull; {item.volume} {item.satuan} @ {formatRp(item.tarifHarga)}
            </div>
            <div className="font-bold text-[#2C2A28] text-sm">{item.uraian}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] text-[#8C867E] uppercase font-bold">Total Belanja</div>
            <div className="text-base font-mono font-black text-[#059669]">{formatRp(item.jumlah)}</div>
          </div>
        </div>

        {/* Flexible Date Control (Update & Manual) */}
        <FlexibleDateControl
          tanggal={isoDate}
          tanggalManualText={manualText}
          defaultMonthIndex={monthIndex}
          defaultYear={String(school.tahunAnggaran || '2026')}
          spjDocType={docType}
          showSpjTypeSelector={true}
          onChange={(newIso, newManual, newType) => {
            setIsoDate(newIso);
            setManualText(newManual);
            if (newType) setDocType(newType);
          }}
          label="Pengisian Tanggal, Bulan & Tahun (Bisa Update Otomatis / Ketik Manual Kapan Saja)"
        />

        {savedBanner && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Tanggal ({formatTanggalIndo(isoDate, manualText)}) & Dokumen SPJ Resmi berhasil diperbarui!
            </span>
          </div>
        )}

        {/* Semua Dokumen SPJ Resmi untuk Belanja Ini */}
        <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E0DACE] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2C2A28]">
              <FileText className="w-4 h-4 text-[#059669]" />
              <span>Buka / Cetak 7 Dokumen SPJ Resmi untuk Belanja Ini:</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              No: {buildCurrentDoc(docType).nomor}
            </span>
          </div>

          <p className="text-[11px] text-[#6B665E]">
            Klik salah satu jenis dokumen SPJ resmi di bawah ini untuk langsung membuka editor/pratinjau A4 dengan tanggal{' '}
            <strong className="text-[#2C2A28]">{formatTanggalIndo(isoDate, manualText)}</strong>:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SPJ_TYPE_OPTIONS.map((opt) => {
              const isCurrent = docType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    const generatedDoc = buildCurrentDoc(opt.value);
                    onSaveDateAndSpj(
                      {
                        tanggal: isoDate,
                        tanggalManualText: manualText,
                        spjDocType: opt.value
                      },
                      generatedDoc
                    );
                    onOpenInSpjEditor(generatedDoc);
                    onClose();
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between gap-1 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                      : 'bg-white hover:bg-[#F2EDE4] text-[#2C2A28] border-[#D9D1C2]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Receipt className={`w-3.5 h-3.5 ${isCurrent ? 'text-emerald-300' : 'text-[#5A5A40]'}`} />
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold leading-tight">{opt.shortLabel}</div>
                    <div className={`text-[9px] ${isCurrent ? 'text-white/80' : 'text-[#8C867E]'}`}>
                      Buka SPJ Resmi
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E0DACE]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const generatedDoc = buildCurrentDoc(docType);
                onSaveDateAndSpj(
                  {
                    tanggal: isoDate,
                    tanggalManualText: manualText,
                    spjDocType: docType
                  },
                  generatedDoc
                );
                printSpjDocument(generatedDoc, school, 'ASLI');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C06E52] hover:bg-[#A85A3F] text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF SPJ Sekarang</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5C5852] hover:bg-[#F2EDE4] cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSaveOnly}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simpan Tanggal & SPJ</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const generatedDoc = buildCurrentDoc(docType);
                onSaveDateAndSpj(
                  {
                    tanggal: isoDate,
                    tanggalManualText: manualText,
                    spjDocType: docType
                  },
                  generatedDoc
                );
                onOpenInSpjEditor(generatedDoc);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#484832] text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Simpan & Buka Dokumen SPJ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
