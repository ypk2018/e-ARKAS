import React, { useState, useMemo } from 'react';
import {
  Archive,
  Search,
  Printer,
  Trash2,
  Edit2,
  FileDown,
  Receipt,
  FileText,
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import { SpjDocument, SpjType, SchoolProfile } from '../types';
import { formatRp, formatTanggalIndo } from '../utils/formatters';

interface ArsipViewProps {
  documents: SpjDocument[];
  school: SchoolProfile;
  onOpenDoc: (doc: SpjDocument) => void;
  onPrintDoc: (doc: SpjDocument, copy?: string) => void;
  onDeleteDoc: (id: string) => void;
}

export const ArsipView: React.FC<ArsipViewProps> = ({
  documents,
  school,
  onOpenDoc,
  onPrintDoc,
  onDeleteDoc
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');

  const filteredDocs = useMemo(() => {
    return documents.filter((d) => {
      if (filterType !== 'all' && d.type !== filterType) return false;
      if (filterSource === 'murni' && d.sourceArkasType === 'perubahan') return false;
      if (filterSource === 'perubahan' && d.sourceArkasType !== 'perubahan') return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const blob = `${d.nomor} ${d.penerima} ${d.uraian || ''} ${d.kegiatan || ''} ${d.tokoNama || ''}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [documents, filterType, filterSource, search]);

  const totalArsip = filteredDocs.reduce((s, d) => s + (d.jumlah || 0), 0);

  const handleExportCSV = () => {
    if (documents.length === 0) {
      alert('Belum ada dokumen untuk diekspor!');
      return;
    }

    const headers = ['Nomor', 'Jenis', 'Tanggal', 'Penerima/Uraian', 'Triwulan', 'Jumlah_Rp'];
    const rows = documents.map((d) => [
      `"${d.nomor}"`,
      `"${d.type.toUpperCase()}"`,
      `"${d.tanggal}"`,
      `"${(d.penerima || d.uraian || d.kegiatan || '').replace(/"/g, '""')}"`,
      `"${d.triwulan || 'I'}"`,
      d.jumlah || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `arsip_spj_bosp_smpn7_${school.tahunAnggaran}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 md:p-7 rounded-[28px] border border-[#E0DACE] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C867E]">
            ARSIP BUKTI FISIK & DOKUMEN SPJ
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2C2A28] mt-0.5">
            Daftar Dokumen Tercatat ({documents.length} Dokumen)
          </h2>
          <p className="text-xs text-[#6B665E] mt-0.5">
            Kwitansi, daftar pembayaran, nota, faktur, BKK, berita acara, dan SPTJ tersimpan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-[#F9F7F2] hover:bg-[#F2EDE4] text-[#2C2A28] font-medium px-4 py-2.5 rounded-xl text-xs border border-[#E0DACE] transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#5A5A40]" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#E0DACE] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor / penerima / uraian..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs text-[#2C2A28] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-[#8C867E] shrink-0" />
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs font-semibold px-3 py-2 text-[#2C2A28] focus:outline-none"
          >
            <option value="all">Semua Sumber ARKAS</option>
            <option value="murni">Hanya ARKAS Murni</option>
            <option value="perubahan">Hanya ARKAS Perubahan</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#F9F7F2] border border-[#E0DACE] rounded-xl text-xs font-semibold px-3 py-2 text-[#2C2A28] focus:outline-none"
          >
            <option value="all">Semua Jenis Dokumen</option>
            <option value="kwitansi">Kwitansi</option>
            <option value="daftar">Daftar Honor</option>
            <option value="nota">Nota Pembelian</option>
            <option value="faktur">Faktur</option>
            <option value="bkk">Bukti Kas Keluar</option>
            <option value="berita">Berita Acara</option>
            <option value="sptj">SPTJ</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[28px] border border-[#E0DACE] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F2EDE4] text-[#2C2A28] text-[10px] font-bold uppercase tracking-wider border-b border-[#E0DACE]">
                <th className="py-3 px-4 w-10 text-center font-serif">No</th>
                <th className="py-3 px-4 w-28 font-serif">Tanggal</th>
                <th className="py-3 px-4 w-28 font-serif">Jenis</th>
                <th className="py-3 px-4 w-40 font-serif">Nomor</th>
                <th className="py-3 px-4 font-serif">Uraian / Penerima</th>
                <th className="py-3 px-4 text-right w-32 font-serif">Nominal</th>
                <th className="py-3 px-4 text-center w-28 font-serif">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0DACE]">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8C867E]">
                    Belum ada dokumen yang sesuai dengan pencarian / filter.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-[#F9F7F2] transition">
                    <td className="py-3 px-4 text-center font-bold text-[#8C867E]">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 text-[#6B665E] font-mono">
                      {formatTanggalIndo(doc.tanggal)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#E8E2D6] text-[#2C2A28]">
                          {doc.type}
                        </span>
                        {doc.sourceArkasType === 'perubahan' ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ARKAS Perubahan
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-gray-100 text-gray-600">
                            ARKAS Murni
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#2C2A28]">
                      {doc.nomor}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#2C2A28] max-w-md">
                      <div className="font-bold text-[#2C2A28]">
                        {doc.penerima || doc.tokoNama || doc.judul || '-'}
                      </div>
                      <div className="text-[11px] text-[#6B665E] line-clamp-1">
                        {doc.uraian || doc.kegiatan || '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#2C2A28] text-xs">
                      {formatRp(doc.jumlah)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onPrintDoc(doc, 'ASLI')}
                          className="p-1.5 text-[#5A5A40] hover:bg-[#F2EDE4] rounded-lg transition cursor-pointer"
                          title="Cetak A4"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenDoc(doc)}
                          className="p-1.5 text-[#2C2A28] hover:bg-[#F2EDE4] rounded-lg transition cursor-pointer"
                          title="Ubah Dokumen"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteDoc(doc.id)}
                          className="p-1.5 text-[#C06E52] hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Hapus Dokumen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredDocs.length > 0 && (
              <tfoot>
                <tr className="bg-[#E8E2D6] font-bold text-[#2C2A28] border-t border-[#D9D1C2]">
                  <td colSpan={5} className="py-3 px-4 text-right font-serif">TOTAL:</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-sm text-[#2C2A28]">
                    {formatRp(totalArsip)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
