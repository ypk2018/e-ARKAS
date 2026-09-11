import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronRight, FolderTree, Receipt, Search, ArrowRight } from 'lucide-react';
import { MonthWorksheet, KertasKerjaItem } from '../types';
import { TEMA_STANDAR_LIST, SUBTEMA_PROGRAM_LIST } from '../data/standarData';
import { formatRp } from '../utils/formatters';
import { MONTH_NAMES } from '../data/schoolProfile';

interface TemaExplorerViewProps {
  worksheets: MonthWorksheet[];
  onCreateSpjFromItem: (item: KertasKerjaItem, monthIndex: number) => void;
  onSelectMonthAndTab: (monthIndex: number, tab: string) => void;
}

export const TemaExplorerView: React.FC<TemaExplorerViewProps> = ({
  worksheets,
  onCreateSpjFromItem,
  onSelectMonthAndTab
}) => {
  const [expandedTema, setExpandedTema] = useState<Record<string, boolean>>({
    '04': true,
    '05': true,
    '06': true,
    '08': true
  });
  const [searchFilter, setSearchFilter] = useState('');

  const toggleTema = (kode: string) => {
    setExpandedTema((prev) => ({ ...prev, [kode]: !prev[kode] }));
  };

  // Compile all items grouped by Tema and Subtema
  const treeData = TEMA_STANDAR_LIST.map((tema) => {
    const subtemas = SUBTEMA_PROGRAM_LIST.filter((s) => s.temaKode === tema.kode);
    
    // Find all items in 12 months belonging to this tema
    const allTemaItems: { item: KertasKerjaItem; monthIndex: number; monthName: string }[] = [];
    worksheets.forEach((ws, mIdx) => {
      ws.items.forEach((it) => {
        if (it.temaId === tema.kode) {
          allTemaItems.push({ item: it, monthIndex: mIdx, monthName: MONTH_NAMES[mIdx] });
        }
      });
    });

    const subtemaNodes = subtemas.map((sub) => {
      const items = allTemaItems.filter((entry) => entry.item.subtemaKode === sub.kode);
      const subTotal = items.reduce((s, entry) => s + entry.item.jumlah, 0);
      return {
        ...sub,
        items,
        subTotal
      };
    });

    const temaTotal = allTemaItems.reduce((s, entry) => s + entry.item.jumlah, 0);

    return {
      ...tema,
      subtemaNodes,
      allTemaItems,
      temaTotal
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 md:p-7 rounded-[28px] border border-[#E0DACE] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C867E]">
            STRUKTUR KURIKULUM & KERTAS KERJA TERPADU
          </div>
          <h2 className="text-xl font-serif font-bold text-[#2C2A28] mt-0.5">
            Penjelajah Tema (8 Standar) dan Subtema (Program & Belanja)
          </h2>
          <p className="text-xs text-[#6B665E]">
            Telusuri rincian belanja dan alokasi dana BOSP 2026 berdasarkan hierarki Standar Pendidikan Nasional
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8C867E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari subtema / rincian / kode..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
          />
        </div>
      </div>

      {/* Tree Explorer Container */}
      <div className="space-y-4">
        {treeData.map((tema, tIdx) => {
          const isExpanded = expandedTema[tema.kode];
          const hasMatchingSearch = searchFilter.trim()
            ? tema.nama.toLowerCase().includes(searchFilter.toLowerCase()) ||
              tema.allTemaItems.some((e) =>
                e.item.uraian.toLowerCase().includes(searchFilter.toLowerCase())
              )
            : true;

          if (!hasMatchingSearch) return null;
          const accentColor = tIdx % 2 === 0 ? '#5A5A40' : '#C06E52';

          return (
            <div
              key={tema.kode}
              className="bg-white rounded-[24px] border border-[#E0DACE] overflow-hidden shadow-xs transition"
            >
              {/* Tema Header */}
              <div
                onClick={() => toggleTema(tema.kode)}
                className="p-4 md:p-5 bg-[#F2EDE4] text-[#2C2A28] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#E8E2D6] transition select-none border-b border-[#E0DACE]"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-serif font-bold text-xs text-white shadow-2xs"
                    style={{ backgroundColor: accentColor }}
                  >
                    {tema.kode}
                  </div>
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#2C2A28]">{tema.nama}</h3>
                    <p className="text-[11px] text-[#6B665E]">{tema.deskripsi}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-[#8C867E] uppercase tracking-wider font-semibold">Total Alokasi</div>
                    <div className="text-sm font-serif font-bold text-[#2C2A28]">
                      {formatRp(tema.temaTotal)}
                    </div>
                  </div>
                  <div className="p-1 text-[#6B665E]">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Subtema Content */}
              {isExpanded && (
                <div className="p-4 md:p-5 bg-[#FDFBF7] space-y-4">
                  {tema.subtemaNodes.map((sub) => {
                    const filteredSubItems = sub.items.filter((entry) => {
                      if (!searchFilter.trim()) return true;
                      const q = searchFilter.toLowerCase();
                      return (
                        sub.nama.toLowerCase().includes(q) ||
                        entry.item.uraian.toLowerCase().includes(q) ||
                        entry.item.kodeRekening.toLowerCase().includes(q)
                      );
                    });

                    if (searchFilter.trim() && filteredSubItems.length === 0) return null;

                    return (
                      <div
                        key={sub.kode}
                        className="bg-white rounded-[20px] border border-[#E0DACE] p-4 shadow-2xs space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-[#E0DACE]/60 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#8B4513] bg-[#C06E5215] border border-[#C06E5230] px-2 py-0.5 rounded-full">
                              Subtema {sub.kode}
                            </span>
                            <h4 className="text-xs font-serif font-bold text-[#2C2A28]">{sub.nama}</h4>
                          </div>
                          <div className="text-xs font-bold text-[#5A5A40]">
                            {formatRp(sub.subTotal)}
                          </div>
                        </div>

                        {/* Items under Subtema */}
                        {filteredSubItems.length === 0 ? (
                          <div className="text-[11px] text-[#8C867E] italic py-1">
                            Belum ada rincian belanja tercatat di bawah subtema ini.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {filteredSubItems.map((entry) => (
                              <div
                                key={entry.item.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#F9F7F2] hover:bg-[#F2EDE4] border border-[#E0DACE]/60 text-xs transition"
                              >
                                <div className="space-y-0.5 max-w-xl">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[10px] text-[#5C5852] font-semibold">
                                      {entry.item.kodeRekening}
                                    </span>
                                    <span className="text-[10px] font-semibold text-[#5A5A40] bg-[#5A5A4015] border border-[#5A5A4030] px-2 py-0.2 rounded-full">
                                      Bulan {entry.monthName}
                                    </span>
                                  </div>
                                  <div className="font-medium text-[#2C2A28]">{entry.item.uraian}</div>
                                  <div className="text-[11px] text-[#6B665E]">
                                    Vol: {entry.item.volume} {entry.item.satuan} • Tarif: {formatRp(entry.item.tarifHarga)}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  <div className="text-right">
                                    <div className="font-mono font-bold text-[#2C2A28]">
                                      {formatRp(entry.item.jumlah)}
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => onCreateSpjFromItem(entry.item, entry.monthIndex)}
                                    className="flex items-center gap-1 bg-[#5A5A40] hover:bg-[#484832] text-white font-medium px-3 py-1.5 rounded-xl text-[11px] transition active:scale-95 cursor-pointer shadow-2xs"
                                    title="Buat Kwitansi / SPJ Resmi"
                                  >
                                    <Receipt className="w-3.5 h-3.5" />
                                    <span>SPJ</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
