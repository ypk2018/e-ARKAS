import React from 'react';
import { SchoolProfile, ArkasPerubahanMonthWorksheet, MonthWorksheet, ArkasPerubahanItem } from '../types';
import { formatRp, terbilang } from '../utils/formatters';
import { MONTH_NAMES } from '../data/schoolProfile';
import { TEMA_STANDAR_LIST } from '../data/standarData';
import { SchoolLogo } from './SchoolLogo';

interface ArkasPerubahanPrintPreviewProps {
  scope: 'all' | 'current' | 'rekap';
  monthIndex: number;
  school: SchoolProfile;
  worksheets: ArkasPerubahanMonthWorksheet[];
  murniWorksheets?: MonthWorksheet[];
}

export const ArkasPerubahanPrintPreview: React.FC<ArkasPerubahanPrintPreviewProps> = ({
  scope,
  monthIndex,
  school,
  worksheets,
  murniWorksheets = []
}) => {
  if (scope === 'current') {
    const ws = worksheets[monthIndex] || worksheets[0];
    return <MonthSheet worksheet={ws} monthIndex={monthIndex} school={school} allWorksheets={worksheets} />;
  }

  if (scope === 'rekap') {
    return <RekapSheet school={school} worksheets={worksheets} murniWorksheets={murniWorksheets} />;
  }

  // scope === 'all': Render all 12 months followed by Rekapitulasi
  return (
    <div className="space-y-8">
      {worksheets.map((ws, idx) => (
        <div key={ws.id || idx} className="space-y-2">
          <div className="flex items-center justify-between bg-slate-100 border border-slate-300 rounded px-3 py-1.5 text-[10px] font-sans font-bold text-slate-700 print:hidden">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              HALAMAN {idx + 1} DARI {worksheets.length + 1} &bull; KERTAS KERJA BULAN {MONTH_NAMES[idx].toUpperCase()} {school.tahunAnggaran}
            </span>
            <span className="text-slate-500 font-normal">
              {ws.items.length} Rincian Belanja
            </span>
          </div>

          <MonthSheet
            worksheet={ws}
            monthIndex={idx}
            school={school}
            allWorksheets={worksheets}
          />

          <div className="h-4 border-b-2 border-dashed border-slate-300 my-4 print:hidden"></div>
        </div>
      ))}

      {/* Final Appendix: Rekapitulasi Tahunan */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between bg-purple-100 border border-purple-300 rounded px-3 py-1.5 text-[10px] font-sans font-bold text-purple-900 print:hidden">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            HALAMAN {worksheets.length + 1} DARI {worksheets.length + 1} &bull; REKAPITULASI TAHUNAN KOMPARATIF
          </span>
          <span className="text-purple-700 font-normal">
            Matriks 12 Bulan & 8 Standar Nasional Pendidikan
          </span>
        </div>

        <RekapSheet school={school} worksheets={worksheets} murniWorksheets={murniWorksheets} />
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Single Month Sheet (A4 Landscape 13-Columns)
// -------------------------------------------------------------
interface MonthSheetProps {
  worksheet: ArkasPerubahanMonthWorksheet;
  monthIndex: number;
  school: SchoolProfile;
  allWorksheets: ArkasPerubahanMonthWorksheet[];
}

const MonthSheet: React.FC<MonthSheetProps> = ({
  worksheet,
  monthIndex,
  school,
  allWorksheets
}) => {
  const monthName = MONTH_NAMES[monthIndex] || 'Bulan';
  const totalSemula = worksheet.items.reduce((s, it) => s + it.semulaJumlah, 0);
  const totalMenjadi = worksheet.items.reduce(
    (s, it) => s + (it.statusPerubahan === 'DIHILANGKAN' ? 0 : it.jumlah),
    0
  );
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

  if (allWorksheets && allWorksheets.length === 12) {
    totalSemulaTW = twMonthIndices.reduce((s, m) => {
      const ws = allWorksheets[m];
      return s + (ws ? ws.items.reduce((acc, it) => acc + it.semulaJumlah, 0) : 0);
    }, 0);

    totalMenjadiTW = twMonthIndices.reduce((s, m) => {
      const ws = allWorksheets[m];
      return (
        s +
        (ws
          ? ws.items.reduce(
              (acc, it) =>
                acc + (it.statusPerubahan === 'DIHILANGKAN' ? 0 : it.jumlah),
              0
            )
          : 0)
      );
    }, 0);
    totalSelisihTW = totalMenjadiTW - totalSemulaTW;

    totalSemulaTahun = allWorksheets.reduce(
      (s, ws) => s + ws.items.reduce((acc, it) => acc + it.semulaJumlah, 0),
      0
    );
    totalMenjadiTahun = allWorksheets.reduce(
      (s, ws) =>
        s +
        ws.items.reduce(
          (acc, it) =>
            acc + (it.statusPerubahan === 'DIHILANGKAN' ? 0 : it.jumlah),
          0
        ),
      0
    );
    totalSelisihTahun = totalMenjadiTahun - totalSemulaTahun;
  }

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'BARU':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-1 py-0.5 rounded text-[7px]">+ BARU</span>;
      case 'DIHILANGKAN':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 font-bold px-1 py-0.5 rounded text-[7px]">&times; HAPUS</span>;
      case 'BERTAMBAH':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 font-bold px-1 py-0.5 rounded text-[7px]">&uarr; NAIK</span>;
      case 'BERKURANG':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 font-bold px-1 py-0.5 rounded text-[7px]">&darr; TURUN</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-300 font-medium px-1 py-0.5 rounded text-[7px]">TETAP</span>;
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded border border-slate-200 shadow-xs space-y-3 print:border-none print:shadow-none print:p-0">
      {/* Header Kop */}
      <div className="flex items-center justify-center gap-3 border-b-2 border-slate-900 pb-2">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
          <SchoolLogo size={44} showBorder={false} />
        </div>
        <div className="text-center flex-1">
          <div className="text-[10px] font-bold tracking-widest uppercase font-sans text-slate-900">
            PEMERINTAH KABUPATEN JAYAPURA &bull; {school.dinas.toUpperCase()}
          </div>
          <h1 className="text-sm font-black font-sans tracking-wide text-slate-950 mt-0.5">
            {school.nama}
          </h1>
          <p className="text-[9px] text-slate-600 font-sans">
            {school.alamat}, Kec. {school.kecamatan}, Kab. {school.kabupaten}, Prov. {school.provinsi} | NPSN: {school.npsn}
          </p>
        </div>
      </div>

      {/* Document Title */}
      <div className="text-center pt-0.5 pb-1">
        <h2 className="text-xs font-black font-sans tracking-wider uppercase text-slate-950 underline decoration-1">
          KERTAS KERJA PERUBAHAN ANGGARAN (ARKAS PERUBAHAN) BULAN {monthName.toUpperCase()} {school.tahunAnggaran}
        </h2>
        <p className="text-[9px] text-slate-700 font-sans mt-0.5">
          Sumber Dana: <b>{school.sumberDana}</b> &bull; Dokumen Resmi Perubahan Rencana Kerja dan Anggaran Sekolah
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-1.5 text-center font-sans text-[8.5px]">
        <div className="border border-slate-300 rounded p-1.5 bg-slate-50">
          <div className="text-[7.5px] text-slate-500 font-bold uppercase">Pagu Semula (Murni)</div>
          <div className="font-mono font-bold text-[9.5px] text-slate-800 mt-0.5">{formatRp(totalSemula)}</div>
        </div>
        <div className="border border-emerald-300 rounded p-1.5 bg-emerald-50">
          <div className="text-[7.5px] text-emerald-700 font-bold uppercase">Anggaran Menjadi</div>
          <div className="font-mono font-bold text-[9.5px] text-emerald-900 mt-0.5">{formatRp(totalMenjadi)}</div>
        </div>
        <div className={`border rounded p-1.5 ${totalSelisih >= 0 ? 'border-emerald-300 bg-emerald-50' : 'border-rose-300 bg-rose-50'}`}>
          <div className={`text-[7.5px] font-bold uppercase ${totalSelisih >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>Selisih Bulan Ini</div>
          <div className={`font-mono font-bold text-[9.5px] mt-0.5 ${totalSelisih >= 0 ? 'text-emerald-900' : 'text-rose-900'}`}>
            {totalSelisih > 0 ? '+' : ''}{formatRp(totalSelisih)}
          </div>
        </div>
        <div className="border border-blue-300 rounded p-1.5 bg-blue-50">
          <div className="text-[7.5px] text-blue-700 font-bold uppercase">Total TW {twName}</div>
          <div className="font-mono font-bold text-[9.5px] text-blue-900 mt-0.5">{formatRp(totalMenjadiTW)}</div>
        </div>
        <div className="border border-purple-300 rounded p-1.5 bg-purple-50">
          <div className="text-[7.5px] text-purple-700 font-bold uppercase">Total 1 Tahun</div>
          <div className="font-mono font-bold text-[9.5px] text-purple-900 mt-0.5">{formatRp(totalMenjadiTahun)}</div>
        </div>
      </div>

      {/* 13-Column Comparative Table */}
      <table className="w-full text-left text-[8px] border-collapse table-fixed font-sans">
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
          <tr className="bg-amber-50 text-center font-bold font-sans border-t border-b border-slate-900 text-[8px]">
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
          <tr className="bg-amber-50 text-center font-bold font-sans border-b border-slate-900 text-[7.5px]">
            <th className="p-1 border border-slate-800">Vol</th>
            <th className="p-1 border border-slate-800">Tarif</th>
            <th className="p-1 border border-slate-800">Jumlah</th>
            <th className="p-1 border border-slate-800">Vol</th>
            <th className="p-1 border border-slate-800">Tarif</th>
            <th className="p-1 border border-slate-800">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {worksheet.items.length === 0 ? (
            <tr>
              <td colSpan={13} className="p-4 text-center text-slate-500 italic border border-slate-300">
                Tidak ada rincian belanja pada bulan {monthName}
              </td>
            </tr>
          ) : (
            worksheet.items.map((it, idx) => {
              const isDihilangkan = it.statusPerubahan === 'DIHILANGKAN';
              return (
                <tr key={it.id || idx} className={`border-b border-slate-300 ${isDihilangkan ? 'bg-rose-50/60 text-rose-900' : ''}`}>
                  <td className="p-1 text-center font-bold border-r border-slate-200">{idx + 1}</td>
                  <td className="p-1 font-mono text-[7.5px] border-r border-slate-200">{it.kodeRekening || '-'}</td>
                  <td className="p-1 font-mono text-center text-[7.5px] border-r border-slate-200">{it.kodeProgram || '-'}</td>
                  <td className="p-1 border-r border-slate-200 break-words">
                    <div className={`font-semibold leading-tight text-[8px] ${isDihilangkan ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {it.uraian}
                    </div>
                    <div className="text-[6.5px] text-slate-500 mt-0.5 leading-tight">
                      [Standar {it.temaId} &bull; {it.subtemaNama || ''}]
                    </div>
                  </td>
                  <td className="p-1 text-center border-r border-slate-200">
                    {getStatusBadge(it.statusPerubahan)}
                  </td>
                  {/* Semula */}
                  <td className="p-1 text-center font-mono border-r border-slate-200 text-[7.5px]">{it.semulaVolume}</td>
                  <td className="p-1 text-right font-mono border-r border-slate-200 text-[7.5px]">
                    {it.semulaTarif > 0 ? formatRp(it.semulaTarif).replace('Rp ', '') : '-'}
                  </td>
                  <td className="p-1 text-right font-mono border-r border-slate-200 text-[7.5px]">
                    {formatRp(it.semulaJumlah).replace('Rp ', '')}
                  </td>
                  {/* Menjadi */}
                  <td className="p-1 text-center font-mono font-bold border-r border-slate-200 text-[7.5px]">{it.volume}</td>
                  <td className="p-1 text-right font-mono border-r border-slate-200 text-[7.5px]">
                    {it.tarifHarga > 0 ? formatRp(it.tarifHarga).replace('Rp ', '') : '-'}
                  </td>
                  <td className="p-1 text-right font-mono font-bold border-r border-slate-200 text-[7.5px]">
                    {formatRp(it.jumlah).replace('Rp ', '')}
                  </td>
                  {/* Selisih */}
                  <td className={`p-1 text-right font-mono font-bold border-r border-slate-200 text-[7.5px] ${
                    it.selisihJumlah > 0 ? 'text-emerald-700' : it.selisihJumlah < 0 ? 'text-rose-700' : 'text-slate-600'
                  }`}>
                    {it.selisihJumlah > 0 ? '+' : ''}{formatRp(it.selisihJumlah).replace('Rp ', '')}
                  </td>
                  <td className="p-1 text-[7px] text-slate-600 leading-tight break-words">
                    {it.alasanPerubahan || '-'}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          {/* Baris 1: Total Bulan Ini */}
          <tr className="bg-amber-100/60 font-bold border-t-2 border-slate-900 font-sans text-[8px]">
            <td colSpan={7} className="p-1 text-right border-r border-slate-300">
              1. TOTAL ANGGARAN BULAN {monthName.toUpperCase()}:
            </td>
            <td className="p-1 text-right font-mono border-r border-slate-300 text-[8px]">
              {formatRp(totalSemula).replace('Rp ', '')}
            </td>
            <td colSpan={2} className="p-1 text-right border-r border-slate-300">
              MENJADI:
            </td>
            <td className="p-1 text-right font-mono font-black border-r border-slate-300 text-[8px]">
              {formatRp(totalMenjadi).replace('Rp ', '')}
            </td>
            <td className={`p-1 text-right font-mono font-black border-r border-slate-300 text-[8px] ${totalSelisih >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
              {totalSelisih > 0 ? '+' : ''}{formatRp(totalSelisih).replace('Rp ', '')}
            </td>
            <td className="p-1 text-center text-[7px] text-slate-600">
              {worksheet.items.length} Rincian
            </td>
          </tr>

          {/* Baris 2: Total Triwulan */}
          <tr className="bg-blue-50 font-bold border-t border-slate-300 font-sans text-[8px]">
            <td colSpan={7} className="p-1 text-right border-r border-slate-300">
              2. TOTAL KUMULATIF TRIWULAN {twName} ({school.tahunAnggaran}):
            </td>
            <td className="p-1 text-right font-mono border-r border-slate-300 text-[8px]">
              {formatRp(totalSemulaTW).replace('Rp ', '')}
            </td>
            <td colSpan={2} className="p-1 text-right border-r border-slate-300">
              MENJADI:
            </td>
            <td className="p-1 text-right font-mono font-black border-r border-slate-300 text-[8px]">
              {formatRp(totalMenjadiTW).replace('Rp ', '')}
            </td>
            <td className={`p-1 text-right font-mono font-black border-r border-slate-300 text-[8px] ${totalSelisihTW >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
              {totalSelisihTW > 0 ? '+' : ''}{formatRp(totalSelisihTW).replace('Rp ', '')}
            </td>
            <td className="p-1 text-center text-[7px] text-blue-700">
              TW {twName}
            </td>
          </tr>

          {/* Baris 3: Total 1 Tahun Anggaran */}
          <tr className="bg-purple-50 font-bold border-t border-slate-300 font-sans text-[8px]">
            <td colSpan={7} className="p-1 text-right border-r border-slate-300">
              3. TOTAL AKUMULASI 1 TAHUN (12 BULAN):
            </td>
            <td className="p-1 text-right font-mono border-r border-slate-300 text-[8px]">
              {formatRp(totalSemulaTahun).replace('Rp ', '')}
            </td>
            <td colSpan={2} className="p-1 text-right border-r border-slate-300">
              MENJADI:
            </td>
            <td className="p-1 text-right font-mono font-black border-r border-slate-300 text-[8px]">
              {formatRp(totalMenjadiTahun).replace('Rp ', '')}
            </td>
            <td className={`p-1 text-right font-mono font-black border-r border-slate-300 text-[8px] ${totalSelisihTahun >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
              {totalSelisihTahun > 0 ? '+' : ''}{formatRp(totalSelisihTahun).replace('Rp ', '')}
            </td>
            <td className="p-1 text-center text-[7px] text-purple-700">
              Tahun {school.tahunAnggaran}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Terbilang & Tanda Tangan */}
      <div className="pt-2 font-sans text-[8.5px] space-y-2">
        <div className="p-1.5 bg-slate-50 border border-slate-200 rounded italic text-[8px]">
          Terbilang Anggaran Menjadi Bulan Ini: <b>" {terbilang(totalMenjadi)} Rupiah "</b>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div>
            <div>Mengetahui / Menyetujui,</div>
            <div className="font-bold">Kepala Sekolah</div>
            <div className="h-10 flex items-center justify-center">
              <span className="text-slate-300 text-[7.5px] print:hidden">(Tanda Tangan & Cap)</span>
            </div>
            <div className="font-bold underline uppercase">{school.kepsekNama}</div>
            <div className="text-[7.5px]">NIP. {school.kepsekNip}</div>
          </div>

          <div>
            <div>Menyetujui,</div>
            <div className="font-bold">Ketua Komite Sekolah</div>
            <div className="h-10 flex items-center justify-center">
              <span className="text-slate-300 text-[7.5px] print:hidden">(Tanda Tangan)</span>
            </div>
            <div className="font-bold underline uppercase">{school.komiteNama}</div>
            <div className="text-[7.5px]">Komite {school.nama}</div>
          </div>

          <div>
            <div>Sentani, 30 {monthName} {school.tahunAnggaran}</div>
            <div className="font-bold">Bendahara BOSP</div>
            <div className="h-10 flex items-center justify-center">
              <span className="text-slate-300 text-[7.5px] print:hidden">(Tanda Tangan)</span>
            </div>
            <div className="font-bold underline uppercase">{school.bendaharaNama}</div>
            <div className="text-[7.5px]">NIP. {school.bendaharaNip}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Rekapitulasi Tahunan Sheet (12 Bulan Komparatif + 8 SNP)
// -------------------------------------------------------------
interface RekapSheetProps {
  school: SchoolProfile;
  worksheets: ArkasPerubahanMonthWorksheet[];
  murniWorksheets: MonthWorksheet[];
}

const RekapSheet: React.FC<RekapSheetProps> = ({
  school,
  worksheets,
  murniWorksheets
}) => {
  const monthlyData = MONTH_NAMES.map((mName, mIdx) => {
    const wsPerubahan = worksheets[mIdx];
    const wsMurni = murniWorksheets[mIdx];
    const semula = wsPerubahan
      ? wsPerubahan.items.reduce((s, it) => s + it.semulaJumlah, 0)
      : (wsMurni ? wsMurni.items.reduce((s, it) => s + it.jumlah, 0) : 0);

    const menjadi = wsPerubahan
      ? wsPerubahan.items.reduce((s, it) => s + (it.statusPerubahan === 'DIHILANGKAN' ? 0 : it.jumlah), 0)
      : semula;

    const selisih = menjadi - semula;
    const countItems = wsPerubahan ? wsPerubahan.items.length : 0;
    const dihilangkanCount = wsPerubahan ? wsPerubahan.items.filter(it => it.statusPerubahan === 'DIHILANGKAN').length : 0;
    const baruCount = wsPerubahan ? wsPerubahan.items.filter(it => it.statusPerubahan === 'BARU').length : 0;

    return {
      index: mIdx,
      nama: mName,
      triwulan: ['I', 'II', 'III', 'IV'][Math.floor(mIdx / 3)],
      semula,
      menjadi,
      selisih,
      countItems,
      dihilangkanCount,
      baruCount
    };
  });

  const totalSemulaAll = monthlyData.reduce((s, m) => s + m.semula, 0);
  const totalMenjadiAll = monthlyData.reduce((s, m) => s + m.menjadi, 0);
  const totalSelisihAll = totalMenjadiAll - totalSemulaAll;

  // Triwulan groupings
  const triwulanData = ['I', 'II', 'III', 'IV'].map(tw => {
    const months = monthlyData.filter(m => m.triwulan === tw);
    const semula = months.reduce((s, m) => s + m.semula, 0);
    const menjadi = months.reduce((s, m) => s + m.menjadi, 0);
    const selisih = menjadi - semula;
    return { tw, semula, menjadi, selisih };
  });

  // Standar groupings (8 Standar)
  const standarData = TEMA_STANDAR_LIST.map(st => {
    let semula = 0;
    let menjadi = 0;

    worksheets.forEach(ws => {
      ws.items.forEach(it => {
        if (it.temaId === st.kode) {
          semula += it.semulaJumlah;
          if (it.statusPerubahan !== 'DIHILANGKAN') {
            menjadi += it.jumlah;
          }
        }
      });
    });

    const selisih = menjadi - semula;
    const pct = totalMenjadiAll > 0 ? (menjadi / totalMenjadiAll) * 100 : 0;

    return {
      kode: st.kode,
      nama: st.nama,
      semula,
      menjadi,
      selisih,
      pct
    };
  });

  return (
    <div className="bg-white p-4 sm:p-6 rounded border border-slate-200 shadow-xs space-y-3 print:border-none print:shadow-none print:p-0 font-sans">
      {/* Header Kop */}
      <div className="flex items-center justify-center gap-3 border-b-2 border-slate-900 pb-2">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
          <SchoolLogo size={44} showBorder={false} />
        </div>
        <div className="text-center flex-1">
          <div className="text-[10px] font-bold tracking-widest uppercase font-sans text-slate-900">
            PEMERINTAH KABUPATEN JAYAPURA &bull; {school.dinas.toUpperCase()}
          </div>
          <h1 className="text-sm font-black font-sans tracking-wide text-slate-950 mt-0.5">
            {school.nama}
          </h1>
          <p className="text-[9px] text-slate-600 font-sans">
            {school.alamat}, Kec. {school.kecamatan}, Kab. {school.kabupaten}, Prov. {school.provinsi} | NPSN: {school.npsn}
          </p>
        </div>
      </div>

      {/* Document Title */}
      <div className="text-center pt-0.5 pb-1">
        <h2 className="text-xs font-black font-sans tracking-wider uppercase text-slate-950 underline decoration-1">
          REKAPITULASI TAHUNAN KOMPARATIF ARKAS PERUBAHAN TAHUN ANGGARAN {school.tahunAnggaran}
        </h2>
        <p className="text-[9px] text-slate-700 font-sans mt-0.5">
          Perbandingan Pagu RKA-Murni vs RKA-Perubahan (12 Bulan, 4 Triwulan & 8 Standar Nasional Pendidikan)
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-2 text-center font-sans text-[9px]">
        <div className="border border-slate-300 rounded p-2 bg-slate-50">
          <div className="text-[8px] text-slate-500 font-bold uppercase">Total Pagu Semula (Murni) 1 Tahun</div>
          <div className="font-mono font-bold text-[11px] text-slate-800 mt-0.5">{formatRp(totalSemulaAll)}</div>
        </div>
        <div className="border border-emerald-300 rounded p-2 bg-emerald-50">
          <div className="text-[8px] text-emerald-700 font-bold uppercase">Total Anggaran Menjadi (Perubahan)</div>
          <div className="font-mono font-bold text-[11px] text-emerald-900 mt-0.5">{formatRp(totalMenjadiAll)}</div>
        </div>
        <div className={`border rounded p-2 ${totalSelisihAll >= 0 ? 'border-emerald-300 bg-emerald-50' : 'border-rose-300 bg-rose-50'}`}>
          <div className={`text-[8px] font-bold uppercase ${totalSelisihAll >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>Total Selisih Anggaran (+/-)</div>
          <div className={`font-mono font-bold text-[11px] mt-0.5 ${totalSelisihAll >= 0 ? 'text-emerald-900' : 'text-rose-900'}`}>
            {totalSelisihAll > 0 ? '+' : ''}{formatRp(totalSelisihAll)}
          </div>
        </div>
      </div>

      {/* Tabel 1: Matriks 12 Bulan */}
      <div>
        <div className="font-bold text-[9px] text-slate-800 mb-1">A. MATRIKS ANGGARAN PER BULAN (JANUARI S.D. DESEMBER)</div>
        <table className="w-full text-left text-[8px] border-collapse table-fixed border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-center font-bold border-b border-slate-300 text-[8px]">
              <th className="p-1 border border-slate-300 w-10">No</th>
              <th className="p-1 border border-slate-300 text-left">Bulan</th>
              <th className="p-1 border border-slate-300 w-16">Triwulan</th>
              <th className="p-1 border border-slate-300 text-right">Semula (Rp)</th>
              <th className="p-1 border border-slate-300 text-right">Menjadi (Rp)</th>
              <th className="p-1 border border-slate-300 text-right">Selisih (+/-)</th>
              <th className="p-1 border border-slate-300 text-center w-28">Status Perubahan</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((m, idx) => (
              <tr key={m.index} className="border-b border-slate-200">
                <td className="p-1 text-center font-bold border-r border-slate-200">{idx + 1}</td>
                <td className="p-1 font-semibold border-r border-slate-200">{m.nama}</td>
                <td className="p-1 text-center border-r border-slate-200">TW {m.triwulan}</td>
                <td className="p-1 text-right font-mono border-r border-slate-200">{formatRp(m.semula)}</td>
                <td className="p-1 text-right font-mono font-bold border-r border-slate-200">{formatRp(m.menjadi)}</td>
                <td className={`p-1 text-right font-mono font-bold border-r border-slate-200 ${m.selisih > 0 ? 'text-emerald-700' : m.selisih < 0 ? 'text-rose-700' : 'text-slate-600'}`}>
                  {m.selisih > 0 ? '+' : ''}{formatRp(m.selisih)}
                </td>
                <td className="p-1 text-center text-[7px] text-slate-600 border-r border-slate-200">
                  {m.dihilangkanCount > 0 && <span className="text-rose-700 font-semibold mr-1">-{m.dihilangkanCount} hapus</span>}
                  {m.baruCount > 0 && <span className="text-emerald-700 font-semibold">+{m.baruCount} baru</span>}
                  {m.dihilangkanCount === 0 && m.baruCount === 0 && <span>{m.countItems} rincian</span>}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-200 font-bold text-[8.5px]">
              <td colSpan={3} className="p-1.5 text-center border-r border-slate-300 uppercase">
                TOTAL TAHUNAN ({school.tahunAnggaran})
              </td>
              <td className="p-1.5 text-right font-mono border-r border-slate-300">{formatRp(totalSemulaAll)}</td>
              <td className="p-1.5 text-right font-mono font-black border-r border-slate-300">{formatRp(totalMenjadiAll)}</td>
              <td className={`p-1.5 text-right font-mono font-black border-r border-slate-300 ${totalSelisihAll >= 0 ? 'text-emerald-900' : 'text-rose-900'}`}>
                {totalSelisihAll > 0 ? '+' : ''}{formatRp(totalSelisihAll)}
              </td>
              <td className="p-1.5 text-center text-[7.5px] text-slate-700">100% Terverifikasi</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Grid 2 Kolom: Triwulan & 8 Standar */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Rekap Triwulan */}
        <div>
          <div className="font-bold text-[9px] text-slate-800 mb-1">B. REKAPITULASI TRIWULAN</div>
          <table className="w-full text-left text-[7.5px] border-collapse table-fixed border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-center font-bold border-b border-slate-300">
                <th className="p-1 border border-slate-300 w-16">Triwulan</th>
                <th className="p-1 border border-slate-300 text-right">Semula (Rp)</th>
                <th className="p-1 border border-slate-300 text-right">Menjadi (Rp)</th>
                <th className="p-1 border border-slate-300 text-right">Selisih (+/-)</th>
              </tr>
            </thead>
            <tbody>
              {triwulanData.map(tw => (
                <tr key={tw.tw} className="border-b border-slate-200">
                  <td className="p-1 text-center font-bold border-r border-slate-200">Triwulan {tw.tw}</td>
                  <td className="p-1 text-right font-mono border-r border-slate-200">{formatRp(tw.semula)}</td>
                  <td className="p-1 text-right font-mono font-bold border-r border-slate-200">{formatRp(tw.menjadi)}</td>
                  <td className={`p-1 text-right font-mono font-bold border-r border-slate-200 ${tw.selisih > 0 ? 'text-emerald-700' : tw.selisih < 0 ? 'text-rose-700' : 'text-slate-600'}`}>
                    {tw.selisih > 0 ? '+' : ''}{formatRp(tw.selisih)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rekap 8 Standar */}
        <div>
          <div className="font-bold text-[9px] text-slate-800 mb-1">C. ALOKASI 8 STANDAR NASIONAL PENDIDIKAN (SNP)</div>
          <table className="w-full text-left text-[7.5px] border-collapse table-fixed border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-center font-bold border-b border-slate-300">
                <th className="p-1 border border-slate-300 text-left">Standar</th>
                <th className="p-1 border border-slate-300 text-right w-20">Semula (Rp)</th>
                <th className="p-1 border border-slate-300 text-right w-20">Menjadi (Rp)</th>
                <th className="p-1 border border-slate-300 text-right w-12">% Pagu</th>
              </tr>
            </thead>
            <tbody>
              {standarData.map(st => (
                <tr key={st.kode} className="border-b border-slate-200">
                  <td className="p-1 border-r border-slate-200 truncate">
                    <span className="font-bold mr-1">{st.kode}.</span>{st.nama}
                  </td>
                  <td className="p-1 text-right font-mono border-r border-slate-200">{formatRp(st.semula)}</td>
                  <td className="p-1 text-right font-mono font-bold border-r border-slate-200">{formatRp(st.menjadi)}</td>
                  <td className="p-1 text-right font-mono border-r border-slate-200">{st.pct.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terbilang & Tanda Tangan */}
      <div className="pt-2 font-sans text-[8.5px] space-y-2">
        <div className="p-1.5 bg-slate-50 border border-slate-200 rounded italic text-[8px]">
          Terbilang Total Anggaran Menjadi 1 Tahun: <b>" {terbilang(totalMenjadiAll)} Rupiah "</b>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-2">
          <div>
            <div>Mengetahui / Menyetujui,</div>
            <div className="font-bold">Kepala Sekolah</div>
            <div className="h-10 flex items-center justify-center">
              <span className="text-slate-300 text-[7.5px] print:hidden">(Tanda Tangan & Cap)</span>
            </div>
            <div className="font-bold underline uppercase">{school.kepsekNama}</div>
            <div className="text-[7.5px]">NIP. {school.kepsekNip}</div>
          </div>

          <div>
            <div>Menyetujui,</div>
            <div className="font-bold">Ketua Komite Sekolah</div>
            <div className="h-10 flex items-center justify-center">
              <span className="text-slate-300 text-[7.5px] print:hidden">(Tanda Tangan)</span>
            </div>
            <div className="font-bold underline uppercase">{school.komiteNama}</div>
            <div className="text-[7.5px]">Komite {school.nama}</div>
          </div>

          <div>
            <div>Sentani, 31 Desember {school.tahunAnggaran}</div>
            <div className="font-bold">Bendahara BOSP</div>
            <div className="h-10 flex items-center justify-center">
              <span className="text-slate-300 text-[7.5px] print:hidden">(Tanda Tangan)</span>
            </div>
            <div className="font-bold underline uppercase">{school.bendaharaNama}</div>
            <div className="text-[7.5px]">NIP. {school.bendaharaNip}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
