import React from 'react';
import { Printer, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { MonthWorksheet, SchoolProfile } from '../types';
import { formatRp } from '../utils/formatters';
import { TEMA_STANDAR_LIST } from '../data/standarData';
import { MONTH_NAMES } from '../data/schoolProfile';
import { printRekapMatrix } from '../utils/printDocument';

interface RekapViewProps {
  school: SchoolProfile;
  worksheets: MonthWorksheet[];
}

export const RekapView: React.FC<RekapViewProps> = ({ school, worksheets }) => {
  const totalPenerimaan = school.totalPenerimaan || 340000000;

  // Calculate Matrix: 8 Standar x 12 Bulan
  const matrix = TEMA_STANDAR_LIST.map((tema) => {
    const monthlyValues = worksheets.map((ws) => {
      return ws.items
        .filter((it) => it.temaId === tema.kode)
        .reduce((sum, it) => sum + it.jumlah, 0);
    });
    const totalStandar = monthlyValues.reduce((a, b) => a + b, 0);
    const pct = totalPenerimaan > 0 ? (totalStandar / totalPenerimaan) * 100 : 0;
    return {
      ...tema,
      monthlyValues,
      totalStandar,
      pct
    };
  });

  const monthlyTotals = worksheets.map((ws) =>
    ws.items.reduce((sum, it) => sum + it.jumlah, 0)
  );

  const grandTotal = monthlyTotals.reduce((a, b) => a + b, 0);

  const handlePrint = () => {
    printRekapMatrix(school, worksheets);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 md:p-7 rounded-[28px] border border-[#E0DACE] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C867E]">
            REKAPITULASI ANGGARAN TAHUN 2026
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2C2A28] mt-0.5">
            Matriks 8 Standar Nasional Pendidikan (12 Bulan)
          </h2>
          <p className="text-xs text-[#6B665E] mt-0.5">
            Sebaran realisasi rincian kertas kerja per bulan dana {school.sumberDana} {school.nama}
          </p>
        </div>

        <button
          id="btn-print-rekap-matriks"
          onClick={handlePrint}
          className="flex items-center gap-1.5 bg-[#5A5A40] hover:bg-[#484832] text-white font-medium px-4 py-2.5 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
          title="Cetak atau Simpan PDF Matriks 8 Standar x 12 Bulan"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-[#E0DACE] shadow-xs">
          <div className="text-xs text-[#6B665E] font-medium mb-1">Total Pagu Penerimaan</div>
          <div className="text-xl font-serif font-bold text-[#2C2A28]">
            {formatRp(totalPenerimaan)}
          </div>
          <div className="text-[11px] text-[#8C867E] mt-1">Sumber: {school.sumberDana} TA {school.tahunAnggaran}</div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-[#E0DACE] shadow-xs">
          <div className="text-xs text-[#6B665E] font-medium mb-1">Total Alokasi Belanja 12 Bulan</div>
          <div className="text-xl font-serif font-bold text-[#5A5A40]">
            {formatRp(grandTotal)}
          </div>
          <div className="text-[11px] text-[#5A5A40] font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Terserap Sempurna</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-[#E0DACE] shadow-xs">
          <div className="text-xs text-[#6B665E] font-medium mb-1">Sisa Anggaran</div>
          <div className="text-xl font-serif font-bold text-[#2C2A28]">
            {formatRp(totalPenerimaan - grandTotal)}
          </div>
          <div className="text-[11px] text-[#8C867E] mt-1">Saldo Akhir Nol (Seimbang)</div>
        </div>
      </div>

      {/* 12-Month Matrix Table */}
      <div className="bg-white p-6 md:p-7 rounded-[28px] border border-[#E0DACE] shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-[#F2EDE4] text-[#2C2A28] text-[10px] uppercase font-bold tracking-wider border-b border-[#E0DACE]">
              <th className="p-3 border-r border-[#E0DACE] w-10 text-center font-serif">Kode</th>
              <th className="p-3 border-r border-[#E0DACE] w-48 font-serif">Tema (Standar)</th>
              {MONTH_NAMES.map((m, idx) => (
                <th key={idx} className="p-3 border-r border-[#E0DACE] text-right font-serif">
                  {m.substring(0, 3)}
                </th>
              ))}
              <th className="p-3 border-r border-[#E0DACE] text-right w-28 font-serif">Total</th>
              <th className="p-3 text-center w-14 font-serif">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0DACE]">
            {matrix.map((row) => (
              <tr key={row.kode} className="hover:bg-[#F9F7F2] transition">
                <td className="p-2.5 font-bold text-center bg-[#F9F7F2] text-[#5A5A40] border-r border-[#E0DACE]">
                  {row.kode}
                </td>
                <td className="p-2.5 font-medium text-[#2C2A28] border-r border-[#E0DACE]">
                  {row.nama}
                </td>
                {row.monthlyValues.map((val, mIdx) => (
                  <td
                    key={mIdx}
                    className={`p-2.5 text-right font-mono border-r border-[#E0DACE] ${
                      val > 0 ? 'text-[#2C2A28] font-semibold' : 'text-[#8C867E]/40'
                    }`}
                  >
                    {val > 0 ? formatRp(val).replace('Rp ', '') : '-'}
                  </td>
                ))}
                <td className="p-2.5 text-right font-mono font-bold text-[#2C2A28] bg-[#F9F7F2] border-r border-[#E0DACE]">
                  {formatRp(row.totalStandar)}
                </td>
                <td className="p-2.5 text-center font-mono font-medium text-[#6B665E]">
                  {row.pct.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#E8E2D6] text-[#2C2A28] font-bold text-xs border-t-2 border-[#D9D1C2]">
              <td colSpan={2} className="p-3 text-right uppercase tracking-wider font-serif">
                Total Belanja Per Bulan:
              </td>
              {monthlyTotals.map((mTot, idx) => (
                <td key={idx} className="p-3 text-right font-mono font-bold text-[#5A5A40]">
                  {formatRp(mTot).replace('Rp ', '')}
                </td>
              ))}
              <td className="p-3 text-right font-mono font-bold text-[#2C2A28] text-sm">
                {formatRp(grandTotal)}
              </td>
              <td className="p-3 text-center font-mono font-bold text-[#5A5A40]">100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
