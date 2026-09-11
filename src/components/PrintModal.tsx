import React, { useState } from 'react';
import { Printer, X, FileText, CheckCircle2 } from 'lucide-react';
import { MonthWorksheet, SchoolProfile, SpjDocument } from '../types';
import { formatRp, formatTanggalIndo, terbilang } from '../utils/formatters';
import { MONTH_NAMES } from '../data/schoolProfile';
import { printSpjDocument, printWorksheet } from '../utils/printDocument';
import { SchoolLogo } from './SchoolLogo';

interface PrintModalProps {
  mode: 'worksheet' | 'document';
  worksheet?: MonthWorksheet;
  document?: SpjDocument;
  school: SchoolProfile;
  monthIndex?: number;
  onClose: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  mode,
  worksheet,
  document: doc,
  school,
  monthIndex = 0,
  onClose
}) => {
  const [selectedRangkap, setSelectedRangkap] = useState<'ASLI' | 'ARSIP' | 'DUA_RANGKAP'>('ASLI');

  const handlePrint = () => {
    if (mode === 'document' && doc) {
      printSpjDocument(doc, school, selectedRangkap);
    } else if (mode === 'worksheet' && worksheet) {
      printWorksheet(worksheet, monthIndex, school);
    } else {
      window.print();
    }
  };

  const monthTotal = worksheet ? worksheet.items.reduce((s, it) => s + it.jumlah, 0) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#2C2A28]/75 backdrop-blur-xs flex flex-col items-center justify-start p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Non-print action bar */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#2C2A28] text-white p-4 rounded-2xl mb-4 shadow-lg border border-[#E0DACE]/20 print:hidden shrink-0">
        <div className="flex items-center gap-2.5">
          <Printer className="w-5 h-5 text-[#E8E2D6]" />
          <div>
            <span className="font-serif font-bold text-sm tracking-wide block">
              {mode === 'worksheet'
                ? `Pratinjau Cetak Kertas Kerja Bulan ${MONTH_NAMES[monthIndex]} ${school.tahunAnggaran}`
                : `Pratinjau Cetak Dokumen SPJ (${doc?.nomor})`}
            </span>
            <span className="text-[11px] text-[#8C867E]">
              Format A4 Standar Resmi BOSP Papua
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
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
            className="flex items-center gap-1.5 bg-[#5A5A40] hover:bg-[#484832] text-white font-medium px-4 py-2 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
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
        className="w-[210mm] min-h-[297mm] bg-white text-[#2C2A28] p-8 shadow-2xl rounded-sm text-xs font-serif leading-normal relative select-text border border-[#E0DACE] overflow-hidden print:border-none print:shadow-none print:w-full print:p-0"
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
          {/* Mode 1: Kertas Kerja Perbulan Table */}
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

