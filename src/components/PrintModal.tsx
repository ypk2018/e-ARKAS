import React, { useState } from 'react';
import { Printer, X, FileText, CheckCircle2, Layout, Maximize2 } from 'lucide-react';
import { MonthWorksheet, SchoolProfile, SpjDocument, ArkasPerubahanMonthWorksheet } from '../types';
import { formatRp, formatTanggalIndo, terbilang } from '../utils/formatters';
import { MONTH_NAMES } from '../data/schoolProfile';
import { printSpjDocument, printWorksheet, printArkasPerubahanWorksheet } from '../utils/printDocument';
import { SchoolLogo } from './SchoolLogo';

interface PrintModalProps {
  mode: 'worksheet' | 'document' | 'arkas-perubahan';
  worksheet?: MonthWorksheet;
  perubahanWorksheet?: ArkasPerubahanMonthWorksheet;
  allPerubahanWorksheets?: ArkasPerubahanMonthWorksheet[];
  document?: SpjDocument;
  school: SchoolProfile;
  monthIndex?: number;
  onClose: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  mode,
  worksheet,
  perubahanWorksheet,
  allPerubahanWorksheets,
  document: doc,
  school,
  monthIndex = 0,
  onClose
}) => {
  const [selectedRangkap, setSelectedRangkap] = useState<'ASLI' | 'ARSIP' | 'DUA_RANGKAP'>('ASLI');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [scale, setScale] = useState<number>(1.0);

  const handlePrint = () => {
    if (mode === 'document' && doc) {
      printSpjDocument(doc, school, selectedRangkap);
    } else if (mode === 'worksheet' && worksheet) {
      printWorksheet(worksheet, monthIndex, school);
    } else if (mode === 'arkas-perubahan' && perubahanWorksheet) {
      printArkasPerubahanWorksheet(
        perubahanWorksheet,
        monthIndex,
        school,
        allPerubahanWorksheets,
        { orientation, scale }
      );
    } else {
      window.print();
    }
  };

  const monthTotal = worksheet ? worksheet.items.reduce((s, it) => s + it.jumlah, 0) : 0;

  // Perubahan calculations
  const totalSemula = perubahanWorksheet ? perubahanWorksheet.items.reduce((s, it) => s + it.semulaJumlah, 0) : 0;
  const totalMenjadi = perubahanWorksheet
    ? perubahanWorksheet.items.reduce((s, it) => s + (it.statusPerubahan === 'DIHILANGKAN' ? 0 : it.jumlah), 0)
    : 0;
  const totalSelisih = totalMenjadi - totalSemula;

  const twIndex = Math.floor(monthIndex / 3);
  const twName = ['I', 'II', 'III', 'IV'][twIndex];
  const twMonthIndices = [twIndex * 3, twIndex * 3 + 1, twIndex * 3 + 2];

  let totalSemulaTW = totalSemula;
  let totalMenjadiTW = totalMenjadi;
  let totalSelisihTW = totalSelisih;
  let totalSemulaTahun = totalSemula;
  let totalMenjadiTahun = totalMenjadi;
  let totalSelisihTahun = totalSelisih;

  if (allPerubahanWorksheets && allPerubahanWorksheets.length === 12) {
    totalSemulaTW = twMonthIndices.reduce((s, m) => {
      const ws = allPerubahanWorksheets[m];
      return s + (ws ? ws.items.reduce((acc, it) => acc + it.semulaJumlah, 0) : 0);
    }, 0);
    totalMenjadiTW = twMonthIndices.reduce((s, m) => {
      const ws = allPerubahanWorksheets[m];
      return s + (ws ? ws.items.reduce((acc, it) => acc + (it.statusPerubahan === 'DIHILANGKAN' ? 0 : it.jumlah), 0) : 0);
    }, 0);
    totalSelisihTW = totalMenjadiTW - totalSemulaTW;

    totalSemulaTahun = allPerubahanWorksheets.reduce(
      (s, ws) => s + ws.items.reduce((acc, it) => acc + it.semulaJumlah, 0),
      0
    );
    totalMenjadiTahun = allPerubahanWorksheets.reduce(
      (s, ws) => s + ws.items.reduce((acc, it) => acc + (it.statusPerubahan === 'DIHILANGKAN' ? 0 : it.jumlah), 0),
      0
    );
    totalSelisihTahun = totalMenjadiTahun - totalSemulaTahun;
  }

  const isLandscape = mode === 'arkas-perubahan' ? orientation === 'landscape' : false;

  return (
    <div className="fixed inset-0 z-50 bg-[#2C2A28]/75 backdrop-blur-xs flex flex-col items-center justify-start p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Non-print action bar */}
      <div className={`w-full ${isLandscape ? 'max-w-[297mm]' : 'max-w-4xl'} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#2C2A28] text-white p-4 rounded-2xl mb-4 shadow-lg border border-[#E0DACE]/20 print:hidden shrink-0`}>
        <div className="flex items-center gap-2.5">
          <Printer className="w-5 h-5 text-[#E8E2D6]" />
          <div>
            <span className="font-serif font-bold text-sm tracking-wide block">
              {mode === 'worksheet'
                ? `Pratinjau Cetak Kertas Kerja Bulan ${MONTH_NAMES[monthIndex]} ${school.tahunAnggaran}`
                : mode === 'arkas-perubahan'
                ? `Pratinjau Cetak Kertas Kerja ARKAS Perubahan (${MONTH_NAMES[monthIndex]} ${school.tahunAnggaran})`
                : `Pratinjau Cetak Dokumen SPJ (${doc?.nomor})`}
            </span>
            <span className="text-[11px] text-[#8C867E]">
              {mode === 'arkas-perubahan'
                ? 'Format 13 Kolom Komparatif Semula vs Menjadi & Selisih A4 (Bebas Potong)'
                : 'Format A4 Standar Resmi BOSP Papua'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          {mode === 'arkas-perubahan' && (
            <div className="flex items-center bg-[#3E3C3A] rounded-xl p-1 text-xs border border-[#E0DACE]/20 gap-1">
              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
                  orientation === 'landscape' ? 'bg-[#5A5A40] text-white font-semibold' : 'text-[#8C867E] hover:text-white'
                }`}
                title="A4 Landscape (13 Kolom Penuh)"
              >
                <Layout className="w-3.5 h-3.5 rotate-90" />
                <span>Landscape (Standar)</span>
              </button>
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
                  orientation === 'portrait' ? 'bg-[#5A5A40] text-white font-semibold' : 'text-[#8C867E] hover:text-white'
                }`}
                title="A4 Portrait"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Portrait</span>
              </button>
              <div className="h-4 w-px bg-white/20 mx-1"></div>
              <button
                type="button"
                onClick={() => setScale(scale === 1.0 ? 0.9 : scale === 0.9 ? 0.8 : 1.0)}
                className="px-2.5 py-1 rounded-lg font-medium text-[#E8E2D6] hover:text-white transition cursor-pointer flex items-center gap-1"
                title="Sesuaikan kerapatan cetak"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Skala {Math.round(scale * 100)}%</span>
              </button>
            </div>
          )}

          {mode === 'document' && doc?.type === 'kwitansi' && (
            <div className="flex items-center bg-[#3E3C3A] rounded-xl p-1 text-xs border border-[#E0DACE]/20">
              <button
                type="button"
                onClick={() => setSelectedRangkap('ASLI')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  selectedRangkap === 'ASLI' ? 'bg-[#5A5A40] text-white' : 'text-[#8C867E] hover:text-white'
                }`}
              >
                Lembar Asli
              </button>
              <button
                type="button"
                onClick={() => setSelectedRangkap('ARSIP')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  selectedRangkap === 'ARSIP' ? 'bg-[#5A5A40] text-white' : 'text-[#8C867E] hover:text-white'
                }`}
              >
                Arsip
              </button>
              <button
                type="button"
                onClick={() => setSelectedRangkap('DUA_RANGKAP')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  selectedRangkap === 'DUA_RANGKAP' ? 'bg-[#5A5A40] text-white' : 'text-[#8C867E] hover:text-white'
                }`}
              >
                2 Rangkap
              </button>
            </div>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-[#059669] hover:bg-[#047857] text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Unduh PDF</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-[#8C867E] hover:text-white rounded-xl transition cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* A4 Paper Printable Area */}
      <div
        id="printable-area"
        style={scale < 1 ? { transform: `scale(${scale})`, transformOrigin: 'top center' } : undefined}
        className={`${
          isLandscape ? 'w-[297mm] min-h-[210mm]' : 'w-[210mm] min-h-[297mm]'
        } max-w-full bg-white text-[#2C2A28] p-6 sm:p-8 shadow-2xl rounded-sm text-xs font-serif leading-normal relative select-text border border-[#E0DACE] overflow-visible print:border-none print:shadow-none print:w-full print:p-0`}
      >
        {/* Watermark Background with School Logo & Subtle Blur */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <img
            src="/logo_smpn7.png"
            alt=""
            className="w-[360px] h-[360px] object-contain opacity-[0.075] blur-[0.8px] select-none pointer-events-none"
          />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Mode 1: Kertas Kerja Perbulan Table (ARKAS Murni) */}
          {mode === 'worksheet' && worksheet && (
            <div className="space-y-4">
            {/* Header Kop */}
            <div className="flex items-center justify-center gap-3 border-b-2 border-slate-900 pb-2">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <SchoolLogo size={46} showBorder={false} />
              </div>
              <div className="text-center flex-1">
                <div className="text-[11px] font-bold tracking-widest uppercase font-sans">
                  PEMERINTAH KABUPATEN JAYAPURA • {school.dinas.toUpperCase()}
                </div>
                <h1 className="text-base font-black font-sans tracking-wide text-slate-950 mt-0.5">
                  {school.nama}
                </h1>
                <p className="text-[10px] text-slate-600 font-sans">
                  {school.alamat}, Kec. {school.kecamatan}, Kab. {school.kabupaten}, NPSN: {school.npsn}
                </p>
              </div>
            </div>

            <div className="text-center pt-1 pb-1">
              <h2 className="text-sm font-black font-sans tracking-wider uppercase text-slate-950 underline decoration-1">
                KERTAS KERJA BULAN {MONTH_NAMES[monthIndex].toUpperCase()} TAHUN ANGGARAN {school.tahunAnggaran}
              </h2>
              <p className="text-[10px] text-slate-700 font-sans mt-0.5">
                Sumber Dana: {school.sumberDana} • Berdasarkan Standar & Program Kegiatan
              </p>
            </div>

            {/* Table */}
            <table className="w-full text-left text-[10px] border-collapse">
              <thead>
                <tr className="bg-slate-50 text-center font-bold font-sans border-y-2 border-slate-900">
                  <th className="p-2 w-8">No</th>
                  <th className="p-2 w-28">Kode Rekening</th>
                  <th className="p-2 w-20">Kode Prog</th>
                  <th className="p-2 text-left">Tema / Subtema & Uraian Belanja</th>
                  <th className="p-2 text-center w-12">Vol</th>
                  <th className="p-2 text-center w-16">Satuan</th>
                  <th className="p-2 text-right w-24">Tarif (Rp)</th>
                  <th className="p-2 text-right w-24">Jumlah (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {worksheet.items.map((it, idx) => (
                  <tr key={it.id} className="border-b border-slate-200">
                    <td className="p-2 text-center font-bold">{idx + 1}</td>
                    <td className="p-2 font-mono text-[9px]">{it.kodeRekening || '-'}</td>
                    <td className="p-2 font-mono text-center text-[9px]">{it.kodeProgram || '-'}</td>
                    <td className="p-2">
                      <div className="font-bold text-slate-900 leading-tight">
                        [{it.temaId} - {it.subtemaKode}] {it.uraian}
                      </div>
                    </td>
                    <td className="p-2 text-center font-mono">{it.volume}</td>
                    <td className="p-2 text-center">{it.satuan}</td>
                    <td className="p-2 text-right font-mono">{formatRp(it.tarifHarga)}</td>
                    <td className="p-2 text-right font-mono font-bold">{formatRp(it.jumlah)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold bg-slate-50/50 font-sans border-t-2 border-b-4 border-double border-slate-900">
                  <td colSpan={7} className="p-2 text-right">
                    TOTAL BELANJA BULAN {MONTH_NAMES[monthIndex].toUpperCase()}:
                  </td>
                  <td className="p-2 text-right font-mono font-black text-xs">
                    {formatRp(monthTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* 3 Signatures: Kepala Sekolah, Komite, Bendahara */}
            <div className="pt-4 font-sans text-[10px] space-y-2">
              <div className="text-right">
                Kec. {school.kecamatan}, 30 {MONTH_NAMES[monthIndex]} {school.tahunAnggaran}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div>
                  <div>Mengetahui / Menyetujui,</div>
                  <div className="font-bold">Kepala Sekolah</div>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-slate-300 text-[9px] print:hidden">(Tanda Tangan & Cap)</span>
                  </div>
                  <div className="font-bold underline uppercase">{school.kepsekNama}</div>
                  <div>NIP. {school.kepsekNip}</div>
                </div>

                <div>
                  <div>Menyetujui,</div>
                  <div className="font-bold">Ketua Komite Sekolah</div>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-slate-300 text-[9px] print:hidden">(Tanda Tangan)</span>
                  </div>
                  <div className="font-bold underline uppercase">{school.komiteNama}</div>
                  <div>Komite {school.nama}</div>
                </div>

                <div>
                  <div>Dibuat Oleh,</div>
                  <div className="font-bold">Bendahara BOSP</div>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-slate-300 text-[9px] print:hidden">(Tanda Tangan)</span>
                  </div>
                  <div className="font-bold underline uppercase">{school.bendaharaNama}</div>
                  <div>NIP. {school.bendaharaNip}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode 1.5: ARKAS PERUBAHAN Comparative Worksheet */}
        {mode === 'arkas-perubahan' && perubahanWorksheet && (
          <div className="space-y-3">
            {/* Header Kop */}
            <div className="flex items-center justify-center gap-3 border-b-2 border-slate-900 pb-2">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <SchoolLogo size={44} showBorder={false} />
              </div>
              <div className="text-center flex-1">
                <div className="text-[10px] font-bold tracking-widest uppercase font-sans">
                  PEMERINTAH KABUPATEN JAYAPURA • {school.dinas.toUpperCase()}
                </div>
                <h1 className="text-sm font-black font-sans tracking-wide text-slate-950 mt-0.5">
                  {school.nama}
                </h1>
                <p className="text-[9px] text-slate-600 font-sans">
                  {school.alamat}, Kec. {school.kecamatan}, Kab. {school.kabupaten}, Prov. {school.provinsi} | NPSN: {school.npsn}
                </p>
              </div>
            </div>

            <div className="text-center pt-0.5 pb-1">
              <h2 className="text-xs font-black font-sans tracking-wider uppercase text-slate-950 underline decoration-1">
                KERTAS KERJA PERUBAHAN ANGGARAN (ARKAS PERUBAHAN) BULAN {MONTH_NAMES[monthIndex].toUpperCase()} {school.tahunAnggaran}
              </h2>
              <p className="text-[9px] text-slate-700 font-sans mt-0.5">
                Sumber Dana: <b>{school.sumberDana}</b> • Dokumen Resmi Perubahan Rencana Kerja dan Anggaran Sekolah
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-5 gap-2 text-center font-sans text-[9px]">
              <div className="border border-slate-300 rounded p-1.5 bg-slate-50">
                <div className="text-[8px] text-slate-500 font-bold uppercase">Semula (Murni)</div>
                <div className="font-mono font-bold text-[10px] text-slate-800 mt-0.5">{formatRp(totalSemula)}</div>
              </div>
              <div className="border border-emerald-300 rounded p-1.5 bg-emerald-50">
                <div className="text-[8px] text-emerald-700 font-bold uppercase">Menjadi (Perubahan)</div>
                <div className="font-mono font-bold text-[10px] text-emerald-900 mt-0.5">{formatRp(totalMenjadi)}</div>
              </div>
              <div className={`border rounded p-1.5 ${totalSelisih >= 0 ? 'border-emerald-300 bg-emerald-50' : 'border-rose-300 bg-rose-50'}`}>
                <div className={`text-[8px] font-bold uppercase ${totalSelisih >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>Selisih Bulan Ini</div>
                <div className={`font-mono font-bold text-[10px] mt-0.5 ${totalSelisih >= 0 ? 'text-emerald-900' : 'text-rose-900'}`}>
                  {totalSelisih > 0 ? '+' : ''}{formatRp(totalSelisih)}
                </div>
              </div>
              <div className="border border-blue-300 rounded p-1.5 bg-blue-50">
                <div className="text-[8px] text-blue-700 font-bold uppercase">Total TW {twName}</div>
                <div className="font-mono font-bold text-[10px] text-blue-900 mt-0.5">{formatRp(totalMenjadiTW)}</div>
              </div>
              <div className="border border-purple-300 rounded p-1.5 bg-purple-50">
                <div className="text-[8px] text-purple-700 font-bold uppercase">Total 1 Tahun</div>
                <div className="font-mono font-bold text-[10px] text-purple-900 mt-0.5">{formatRp(totalMenjadiTahun)}</div>
              </div>
            </div>

            {/* 13-Column Comparative Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-[9px] border-collapse table-fixed">
                <colgroup>
                  <col style={{ width: '3.2%' }} />
                  <col style={{ width: '10.5%' }} />
                  <col style={{ width: '5.5%' }} />
                  <col style={{ width: '25.5%' }} />
                  <col style={{ width: '6.8%' }} />
                  <col style={{ width: '3.5%' }} />
                  <col style={{ width: '6.5%' }} />
                  <col style={{ width: '7.5%' }} />
                  <col style={{ width: '3.5%' }} />
                  <col style={{ width: '6.5%' }} />
                  <col style={{ width: '7.5%' }} />
                  <col style={{ width: '7.0%' }} />
                  <col style={{ width: '6.5%' }} />
                </colgroup>
                <thead>
                  <tr className="bg-amber-50 text-center font-bold font-sans border-t border-b border-slate-900">
                    <th rowSpan={2} className="p-1 border border-slate-800">No</th>
                    <th rowSpan={2} className="p-1 border border-slate-800">Kode Rek</th>
                    <th rowSpan={2} className="p-1 border border-slate-800">Kode Prog</th>
                    <th rowSpan={2} className="p-1 border border-slate-800 text-left">Uraian Belanja / Kegiatan</th>
                    <th rowSpan={2} className="p-1 border border-slate-800">Status</th>
                    <th colSpan={3} className="p-1 border border-slate-800 bg-amber-100/50">SEMULA (MURNI)</th>
                    <th colSpan={3} className="p-1 border border-slate-800 bg-emerald-100/50">MENJADI (PERUBAHAN)</th>
                    <th rowSpan={2} className="p-1 border border-slate-800">SELISIH</th>
                    <th rowSpan={2} className="p-1 border border-slate-800">Ket / Alasan</th>
                  </tr>
                  <tr className="bg-amber-50 text-center font-bold font-sans border-b border-slate-900 text-[8px]">
                    <th className="p-1 border border-slate-800">Vol</th>
                    <th className="p-1 border border-slate-800">Tarif</th>
                    <th className="p-1 border border-slate-800">Jumlah</th>
                    <th className="p-1 border border-slate-800">Vol</th>
                    <th className="p-1 border border-slate-800">Tarif</th>
                    <th className="p-1 border border-slate-800">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {perubahanWorksheet.items.map((it, idx) => {
                    const isDihilangkan = it.statusPerubahan === 'DIHILANGKAN';
                    return (
                      <tr key={it.id} className={`border-b border-slate-300 ${isDihilangkan ? 'bg-rose-50/60 text-rose-900' : ''}`}>
                        <td className="p-1 text-center font-bold border-r border-slate-200">{idx + 1}</td>
                        <td className="p-1 font-mono text-[8px] border-r border-slate-200 truncate">{it.kodeRekening || '-'}</td>
                        <td className="p-1 font-mono text-center text-[8px] border-r border-slate-200">{it.kodeProgram || '-'}</td>
                        <td className="p-1 border-r border-slate-200">
                          <div className={`font-semibold leading-tight text-[8.5px] ${isDihilangkan ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {it.uraian}
                          </div>
                          <div className="text-[7.5px] text-slate-500 mt-0.5">
                            [Standar {it.temaId} &bull; {it.subtemaNama || ''}]
                          </div>
                        </td>
                        <td className="p-1 text-center border-r border-slate-200">
                          <span className="text-[7px] font-bold px-1 py-0.5 rounded border uppercase">
                            {it.statusPerubahan}
                          </span>
                        </td>
                        {/* Semula */}
                        <td className="p-1 text-center font-mono border-r border-slate-200">{it.semulaVolume}</td>
                        <td className="p-1 text-right font-mono border-r border-slate-200">
                          {it.semulaTarif > 0 ? formatRp(it.semulaTarif).replace('Rp ', '') : '-'}
                        </td>
                        <td className="p-1 text-right font-mono border-r border-slate-200">
                          {formatRp(it.semulaJumlah).replace('Rp ', '')}
                        </td>
                        {/* Menjadi */}
                        <td className="p-1 text-center font-mono font-bold border-r border-slate-200">{it.volume}</td>
                        <td className="p-1 text-right font-mono border-r border-slate-200">
                          {it.tarifHarga > 0 ? formatRp(it.tarifHarga).replace('Rp ', '') : '-'}
                        </td>
                        <td className="p-1 text-right font-mono font-bold border-r border-slate-200">
                          {formatRp(it.jumlah).replace('Rp ', '')}
                        </td>
                        {/* Selisih */}
                        <td className={`p-1 text-right font-mono font-bold border-r border-slate-200 ${
                          it.selisihJumlah > 0 ? 'text-emerald-700' : it.selisihJumlah < 0 ? 'text-rose-700' : 'text-slate-600'
                        }`}>
                          {it.selisihJumlah > 0 ? '+' : ''}{formatRp(it.selisihJumlah).replace('Rp ', '')}
                        </td>
                        <td className="p-1 text-[7.5px] text-slate-600 leading-tight">
                          {it.alasanPerubahan || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  {/* Baris 1: Total Bulan Ini */}
                  <tr className="bg-amber-100/60 font-bold border-t-2 border-slate-900 font-sans">
                    <td colSpan={7} className="p-1 text-right border-r border-slate-300">
                      1. TOTAL ANGGARAN BULAN {MONTH_NAMES[monthIndex].toUpperCase()}:
                    </td>
                    <td className="p-1 text-right font-mono border-r border-slate-300">
                      {formatRp(totalSemula).replace('Rp ', '')}
                    </td>
                    <td colSpan={2} className="p-1 text-right border-r border-slate-300">
                      MENJADI:
                    </td>
                    <td className="p-1 text-right font-mono font-black border-r border-slate-300">
                      {formatRp(totalMenjadi).replace('Rp ', '')}
                    </td>
                    <td className={`p-1 text-right font-mono font-black border-r border-slate-300 ${totalSelisih >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {totalSelisih > 0 ? '+' : ''}{formatRp(totalSelisih).replace('Rp ', '')}
                    </td>
                    <td className="p-1 text-center text-[7.5px] text-slate-600">
                      {perubahanWorksheet.items.length} Rincian
                    </td>
                  </tr>

                  {/* Baris 2: Total Triwulan */}
                  <tr className="bg-blue-50 font-bold border-t border-slate-300 font-sans">
                    <td colSpan={7} className="p-1 text-right border-r border-slate-300">
                      2. TOTAL KUMULATIF TRIWULAN {twName} ({school.tahunAnggaran}):
                    </td>
                    <td className="p-1 text-right font-mono border-r border-slate-300">
                      {formatRp(totalSemulaTW).replace('Rp ', '')}
                    </td>
                    <td colSpan={2} className="p-1 text-right border-r border-slate-300">
                      MENJADI:
                    </td>
                    <td className="p-1 text-right font-mono font-black border-r border-slate-300">
                      {formatRp(totalMenjadiTW).replace('Rp ', '')}
                    </td>
                    <td className={`p-1 text-right font-mono font-black border-r border-slate-300 ${totalSelisihTW >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {totalSelisihTW > 0 ? '+' : ''}{formatRp(totalSelisihTW).replace('Rp ', '')}
                    </td>
                    <td className="p-1 text-center text-[7.5px] text-blue-700">
                      TW {twName}
                    </td>
                  </tr>

                  {/* Baris 3: Total 1 Tahun Anggaran */}
                  <tr className="bg-purple-50 font-bold border-t border-slate-300 font-sans">
                    <td colSpan={7} className="p-1 text-right border-r border-slate-300">
                      3. TOTAL AKUMULASI 1 TAHUN (12 BULAN):
                    </td>
                    <td className="p-1 text-right font-mono border-r border-slate-300">
                      {formatRp(totalSemulaTahun).replace('Rp ', '')}
                    </td>
                    <td colSpan={2} className="p-1 text-right border-r border-slate-300">
                      MENJADI:
                    </td>
                    <td className="p-1 text-right font-mono font-black border-r border-slate-300">
                      {formatRp(totalMenjadiTahun).replace('Rp ', '')}
                    </td>
                    <td className={`p-1 text-right font-mono font-black border-r border-slate-300 ${totalSelisihTahun >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {totalSelisihTahun > 0 ? '+' : ''}{formatRp(totalSelisihTahun).replace('Rp ', '')}
                    </td>
                    <td className="p-1 text-center text-[7.5px] text-purple-700">
                      Tahun {school.tahunAnggaran}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Terbilang & Tanda Tangan */}
            <div className="pt-2 font-sans text-[9px] space-y-2">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded italic text-[8.5px]">
                Terbilang Anggaran Menjadi Bulan Ini: <b>" {terbilang(totalMenjadi)} Rupiah "</b>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div>
                  <div>Mengetahui / Menyetujui,</div>
                  <div className="font-bold">Kepala Sekolah</div>
                  <div className="h-12 flex items-center justify-center">
                    <span className="text-slate-300 text-[8px] print:hidden">(Tanda Tangan & Cap)</span>
                  </div>
                  <div className="font-bold underline uppercase">{school.kepsekNama}</div>
                  <div>NIP. {school.kepsekNip}</div>
                </div>

                <div>
                  <div>Menyetujui,</div>
                  <div className="font-bold">Ketua Komite Sekolah</div>
                  <div className="h-12 flex items-center justify-center">
                    <span className="text-slate-300 text-[8px] print:hidden">(Tanda Tangan)</span>
                  </div>
                  <div className="font-bold underline uppercase">{school.komiteNama}</div>
                  <div>Komite {school.nama}</div>
                </div>

                <div>
                  <div>Sentani, 30 {MONTH_NAMES[monthIndex]} {school.tahunAnggaran}</div>
                  <div className="font-bold">Bendahara BOSP</div>
                  <div className="h-12 flex items-center justify-center">
                    <span className="text-slate-300 text-[8px] print:hidden">(Tanda Tangan)</span>
                  </div>
                  <div className="font-bold underline uppercase">{school.bendaharaNama}</div>
                  <div>NIP. {school.bendaharaNip}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode 2: Single SPJ Document Print */}
        {mode === 'document' && doc && (
          <div className="space-y-4">
            {/* Kop */}
            <div className="flex items-center justify-center gap-3 border-b-2 border-slate-900 pb-2">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                <SchoolLogo size={46} showBorder={false} />
              </div>
              <div className="text-center flex-1">
                <div className="text-[10px] font-bold uppercase font-sans">
                  PEMERINTAH KABUPATEN JAYAPURA • {school.dinas.toUpperCase()}
                </div>
                <h2 className="text-base font-black font-sans">{school.nama}</h2>
                <p className="text-[10px] text-slate-600 font-sans">
                  {school.alamat}, Kec. {school.kecamatan}, Kab. {school.kabupaten}, Prov. {school.provinsi}
                </p>
              </div>
            </div>

            {/* Document Body */}
            <div className="text-center pt-2">
              <h1 className="text-base font-black uppercase underline tracking-wider font-serif">
                {doc.type === 'kwitansi' && 'KWITANSI / BUKTI PEMBAYARAN BOSP'}
                {doc.type === 'daftar' && 'DAFTAR PENERIMAAN HONORARIUM'}
                {doc.type === 'nota' && 'NOTA PEMBELIAN'}
                {doc.type === 'faktur' && 'FAKTUR BARANG / JASA'}
                {doc.type === 'bkk' && 'BUKTI KAS KELUAR (BKK)'}
                {doc.type === 'berita' && 'BERITA ACARA PEMBAYARAN & SERAH TERIMA'}
                {doc.type === 'sptj' && 'SURAT PERNYATAAN TANGGUNG JAWAB BELANJA'}
              </h1>
              <p className="text-[10px] font-mono text-slate-700">Nomor: {doc.nomor}</p>
            </div>

            {/* Kwitansi Body */}
            {doc.type === 'kwitansi' && (
              <div className="space-y-4 text-xs">
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <tr className="align-top">
                      <td className="w-36 py-1.5 font-bold">Sudah Terima Dari</td>
                      <td className="w-3 py-1.5">:</td>
                      <td className="py-1.5 font-semibold">{doc.terimaDari || `Bendahara ${school.sumberDana} ${school.nama}`}</td>
                    </tr>
                    <tr className="align-top">
                      <td className="py-1.5 font-bold">Uang Sejumlah</td>
                      <td className="py-1.5">:</td>
                      <td className="py-1.5 font-serif italic font-bold">
                        " {terbilang(doc.jumlah)} Rupiah "
                      </td>
                    </tr>
                    <tr className="align-top">
                      <td className="py-1.5 font-bold">Untuk Pembayaran</td>
                      <td className="py-1.5">:</td>
                      <td className="py-1.5 leading-relaxed">
                        {doc.uraian || '-'}
                        {doc.komponen && (
                          <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                            Komponen: {doc.komponen} • Rekening: {doc.rekening || '-'}
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="pt-3 border-t border-slate-900 flex justify-between items-end">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500">Jumlah Bersih:</div>
                    <div className="font-mono font-bold text-base border-b-2 border-slate-900 pb-0.5 inline-block">
                      {formatRp(doc.jumlah)},-
                    </div>
                  </div>
                  <div className="text-right text-[11px] font-sans">
                    Sentani, {formatTanggalIndo(doc.tanggal)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-sans pt-4">
                  <div>
                    <div>Mengetahui,</div>
                    <div className="font-bold">Kepala Sekolah</div>
                    <div className="h-14"></div>
                    <div className="font-bold underline">{school.kepsekNama}</div>
                    <div>NIP. {school.kepsekNip}</div>
                  </div>
                  <div>
                    <div>Lunas Dibayar,</div>
                    <div className="font-bold">Bendahara BOSP</div>
                    <div className="h-14"></div>
                    <div className="font-bold underline">{school.bendaharaNama}</div>
                    <div>NIP. {school.bendaharaNip}</div>
                  </div>
                  <div>
                    <div>Yang Menerima,</div>
                    <div className="font-bold">{doc.jabatanPenerima || 'Penerima'}</div>
                    <div className="h-14 flex items-center justify-center">
                      {doc.materai && (
                        <div className="border border-red-500 text-red-500 text-[8px] font-bold px-1 py-0.5">
                          MATERAI 10.000
                        </div>
                      )}
                    </div>
                    <div className="font-bold underline">{doc.penerima || '...................'}</div>
                    <div>{doc.penerimaNip ? `NIP. ${doc.penerimaNip}` : ''}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Doc Types Fallback in Modal */}
            {doc.type !== 'kwitansi' && (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span><b>Penerima / Toko:</b> {doc.penerima || doc.tokoNama || '-'}</span>
                  <span><b>Tanggal:</b> {formatTanggalIndo(doc.tanggal)}</span>
                </div>
                <p><b>Uraian:</b> {doc.uraian || doc.kegiatan || '-'}</p>
                <div className="pt-2 border-t border-slate-900 flex justify-between items-center">
                  <span className="text-base font-black font-mono border-b-2 border-slate-900 pb-0.5">{formatRp(doc.jumlah)}</span>
                  <span className="font-serif italic text-[11px]">" {terbilang(doc.jumlah)} Rupiah "</span>
                </div>

                <div className="flex justify-between items-end pt-8 text-[10px] font-sans">
                  <div>
                    <div>Mengetahui,</div>
                    <div className="font-bold">Kepala Sekolah</div>
                    <div className="h-14"></div>
                    <div className="font-bold underline">{school.kepsekNama}</div>
                    <div>NIP. {school.kepsekNip}</div>
                  </div>

                  <div className="text-right">
                    <div>Sentani, {formatTanggalIndo(doc.tanggal)}</div>
                    <div className="font-bold">Bendahara BOSP</div>
                    <div className="h-14"></div>
                    <div className="font-bold underline">{school.bendaharaNama}</div>
                    <div>NIP. {school.bendaharaNip}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

