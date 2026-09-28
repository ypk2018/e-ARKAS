import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronRight, FolderTree, Receipt, Search, ArrowRight, Sparkles, Printer, Calendar, Edit2 } from 'lucide-react';
import { MonthWorksheet, KertasKerjaItem, SchoolProfile, SpjDocument, SpjType } from '../types';
import { TEMA_STANDAR_LIST, SUBTEMA_PROGRAM_LIST, BOS_REGULER_ITEM_TEMPLATES } from '../data/standarData';
import { formatRp, formatTanggalIndo } from '../utils/formatters';
import { MONTH_NAMES, DEFAULT_SCHOOL_PROFILE } from '../data/schoolProfile';
import { printTemaExplorer } from '../utils/printDocument';
import { QuickDateSpjModal } from './FlexibleDateControl';

interface TemaExplorerViewProps {
  worksheets: MonthWorksheet[];
  school?: SchoolProfile;
  onCreateSpjFromItem: (item: KertasKerjaItem, monthIndex: number, customSpjType?: SpjType) => void;
  onSelectMonthAndTab: (monthIndex: number, tab: string) => void;
  onUpdateWorksheet?: (ws: MonthWorksheet) => void;
  documents?: SpjDocument[];
  onOpenSpjDoc?: (doc: SpjDocument) => void;
  onSaveOrUpdateOfficialSpj?: (doc: SpjDocument) => void;
}

export const TemaExplorerView: React.FC<TemaExplorerViewProps> = ({
  worksheets,
  school = DEFAULT_SCHOOL_PROFILE,
  onCreateSpjFromItem,
  onSelectMonthAndTab,
  onUpdateWorksheet,
  documents = [],
  onOpenSpjDoc,
  onSaveOrUpdateOfficialSpj
}) => {
  const [expandedTema, setExpandedTema] = useState<Record<string, boolean>>({
    '04': true,
    '05': true,
    '06': true,
    '08': true
  });
  const [searchFilter, setSearchFilter] = useState('');
  const [quickDateEntry, setQuickDateEntry] = useState<{
    item: KertasKerjaItem;
    monthIndex: number;
  } | null>(null);

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

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            id="btn-print-tema-explorer"
            onClick={() => printTemaExplorer(school, worksheets)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FAF8F5] hover:bg-[#E8E2D6] text-[#2C2A28] border border-[#D9D1C2] transition-colors shadow-2xs shrink-0 cursor-pointer"
            title="Cetak atau Simpan PDF Matriks Pembagian 8 Standar Nasional Pendidikan"
          >
            <Printer className="w-4 h-4 text-[#5A5A40]" />
            <span>Cetak / Simpan PDF</span>
          </button>

          <div className="relative w-full sm:w-64">
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

                        {/* Official BOS Reguler Kemendikbud Templates Available for this Subtema */}
                        {(() => {
                          const bosTemplates = BOS_REGULER_ITEM_TEMPLATES.filter((tpl) => tpl.subtemaKode === sub.kode);
                          if (bosTemplates.length === 0) return null;
                          return (
                            <div className="pt-1 border-t border-[#E0DACE]/50">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-bold text-[#6B665E] uppercase tracking-wider flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-[#8C7A3E]" />
                                  Katalog Item Belanja BOS Reguler Kemendikbud:
                                </span>
                                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  {bosTemplates.length} item standar
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                                {bosTemplates.map((tpl) => (
                                  <div
                                    key={tpl.id}
                                    className="p-2 rounded-lg bg-[#FAF8F5] border border-[#E8E2D6] text-[11px] flex items-center justify-between gap-2"
                                  >
                                    <div className="min-w-0">
                                      <div className="font-semibold text-[#2C2A28] truncate">{tpl.uraian}</div>
                                      <div className="text-[10px] font-mono text-[#8C867E]">Rek: {tpl.kodeRekening}</div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <div className="font-bold text-[#5A5A40] text-[11px]">{formatRp(tpl.tarifHarga)}</div>
                                      <div className="text-[9px] text-[#8C867E]">/{tpl.satuan}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

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
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-[10px] text-[#5C5852] font-semibold">
                                      {entry.item.kodeRekening}
                                    </span>
                                    <span className="text-[10px] font-semibold text-[#5A5A40] bg-[#5A5A4015] border border-[#5A5A4030] px-2 py-0.2 rounded-full">
                                      Bulan {entry.monthName}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setQuickDateEntry({ item: entry.item, monthIndex: entry.monthIndex })}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white hover:bg-[#5A5A40] text-[#2C2A28] hover:text-white border border-[#D9D1C2] text-[10px] font-semibold transition cursor-pointer"
                                      title="Update / Input Manual Tanggal, Bulan, Tahun & Dokumen SPJ Resmi"
                                    >
                                      <Calendar className="w-2.5 h-2.5 text-[#5A5A40] shrink-0" />
                                      <span>
                                        Tgl:{' '}
                                        {formatTanggalIndo(
                                          entry.item.tanggal || `${school.tahunAnggaran}-${String(entry.monthIndex + 1).padStart(2, '0')}-15`,
                                          entry.item.tanggalManualText
                                        )}
                                      </span>
                                      <Edit2 className="w-2.5 h-2.5 opacity-70" />
                                    </button>
                                  </div>
                                  <div className="font-medium text-[#2C2A28]">{entry.item.uraian}</div>
                                  <div className="text-[11px] text-[#6B665E]">
                                    Vol: {entry.item.volume} {entry.item.satuan} • Tarif: {formatRp(entry.item.tarifHarga)}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <div className="text-right mr-1">
                                    <div className="font-mono font-bold text-[#2C2A28]">
                                      {formatRp(entry.item.jumlah)}
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setQuickDateEntry({ item: entry.item, monthIndex: entry.monthIndex })}
                                    className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold px-2.5 py-1.5 rounded-xl text-[10px] transition cursor-pointer"
                                    title="Atur Tanggal, Bulan, Tahun (Update/Manual) & 7 Dokumen SPJ Resmi"
                                  >
                                    <Calendar className="w-3 h-3" />
                                    <span>Tgl & SPJ</span>
                                  </button>

                                  <button
                                    onClick={() => onCreateSpjFromItem(entry.item, entry.monthIndex, entry.item.spjDocType)}
                                    className="flex items-center gap-1 bg-[#5A5A40] hover:bg-[#484832] text-white font-medium px-3 py-1.5 rounded-xl text-[11px] transition active:scale-95 cursor-pointer shadow-2xs"
                                    title="Buat Kwitansi / SPJ Resmi"
                                  >
                                    <Receipt className="w-3.5 h-3.5" />
                                    <span>SPJ Resmi</span>
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

      {/* Quick Date & Official SPJ Modal */}
      {quickDateEntry && (
        <QuickDateSpjModal
          item={quickDateEntry.item}
          monthIndex={quickDateEntry.monthIndex}
          school={school}
          sourceType="murni"
          existingSpjDoc={documents.find((d) => d.sourceKertasKerjaId === quickDateEntry.item.id)}
          onClose={() => setQuickDateEntry(null)}
          onSaveDateAndSpj={(updatedFields, generatedDoc) => {
            const targetWs = worksheets[quickDateEntry.monthIndex];
            if (targetWs && onUpdateWorksheet) {
              const updatedItems = targetWs.items.map((it) =>
                it.id === quickDateEntry.item.id
                  ? {
                      ...it,
                      tanggal: updatedFields.tanggal,
                      tanggalManualText: updatedFields.tanggalManualText,
                      spjDocType: updatedFields.spjDocType
                    }
                  : it
              );
              onUpdateWorksheet({
                ...targetWs,
                items: updatedItems
              });
            }
            if (onSaveOrUpdateOfficialSpj) {
              onSaveOrUpdateOfficialSpj(generatedDoc);
            }
          }}
          onOpenInSpjEditor={(doc) => {
            if (onSaveOrUpdateOfficialSpj) {
              onSaveOrUpdateOfficialSpj(doc);
            }
            if (onOpenSpjDoc) {
              onOpenSpjDoc(doc);
            } else {
              onCreateSpjFromItem(quickDateEntry.item, quickDateEntry.monthIndex, doc.type);
            }
          }}
        />
      )}
    </div>
  );
};
