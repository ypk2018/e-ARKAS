import { SpjDocument, SchoolProfile, MonthWorksheet, ArkasPerubahanMonthWorksheet, ArkasPerubahanItem } from '../types';
import { formatRp, formatTanggalIndo, terbilang } from './formatters';
import { MONTH_NAMES } from '../data/schoolProfile';
import { TEMA_STANDAR_LIST } from '../data/standarData';

/**
 * Builds standard print CSS styling for A4 documents
 */
const getPrintStyles = (): string => `
  @page {
    size: A4 portrait;
    margin: 12mm 14mm 12mm 14mm;
  }
  
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    font-family: 'Times New Roman', Times, 'Newsreader', Georgia, serif;
    font-size: 11pt;
    line-height: 1.35;
    color: #1a1a1a;
    background: #ffffff;
    padding: 0;
    margin: 0;
  }

  .page-container {
    width: 100%;
    max-width: 190mm;
    margin: 0 auto;
    position: relative;
    overflow: visible;
  }

  .watermark-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 280pt;
    height: 280pt;
    opacity: 0.085;
    pointer-events: none;
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .watermark-bg img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: blur(1px);
    -webkit-filter: blur(1px);
  }

  .page-container > *:not(.watermark-bg) {
    position: relative;
    z-index: 1;
  }

  .page-break {
    page-break-after: always;
    break-after: page;
  }

  .header-kop {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12pt;
    border-bottom: 2.5pt double #1a1a1a;
    padding-bottom: 6pt;
    margin-bottom: 10pt;
    font-family: Arial, Helvetica, sans-serif;
  }

  .header-kop .logo-container {
    width: 48pt;
    height: 48pt;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header-kop .logo-container img {
    width: 48pt;
    height: 48pt;
    object-fit: contain;
  }

  .header-kop .kop-text {
    flex: 1;
    text-align: center;
  }

  .header-kop .instansi {
    font-size: 9.5pt;
    font-weight: bold;
    letter-spacing: 0.8pt;
    text-transform: uppercase;
  }

  .header-kop .school-name {
    font-size: 13.5pt;
    font-weight: 900;
    letter-spacing: 0.5pt;
    text-transform: uppercase;
    margin: 2pt 0;
  }

  .header-kop .address {
    font-size: 8.5pt;
    color: #333333;
  }

  .doc-title-container {
    text-align: center;
    margin: 8pt 0 12pt 0;
  }

  .doc-title {
    font-size: 12.5pt;
    font-weight: bold;
    text-decoration: underline;
    text-transform: uppercase;
    letter-spacing: 0.5pt;
  }

  .doc-number {
    font-size: 9.5pt;
    font-family: Arial, Helvetica, sans-serif;
    margin-top: 2pt;
    color: #222222;
  }

  .kwitansi-border {
    border: none;
    padding: 6pt 0;
    position: relative;
  }

  .stamp-lunas {
    position: absolute;
    top: 20pt;
    right: 20pt;
    border: 2pt solid #059669;
    color: #059669;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 900;
    font-size: 11pt;
    padding: 3pt 10pt;
    border-radius: 4pt;
    text-transform: uppercase;
    letter-spacing: 2pt;
    transform: rotate(-12deg);
    opacity: 0.85;
  }

  .copy-badge {
    position: absolute;
    top: 0pt;
    right: 0pt;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 7.5pt;
    font-weight: bold;
    border-bottom: 1pt solid #666666;
    padding: 1pt 4pt;
    text-transform: uppercase;
    color: #444444;
  }

  .info-table {
    width: 100%;
    border-collapse: collapse;
    margin: 10pt 0;
    font-size: 10.5pt;
  }

  .info-table td {
    padding: 4.5pt 0;
    vertical-align: top;
  }

  .info-table .label {
    width: 130pt;
    font-weight: bold;
  }

  .info-table .colon {
    width: 12pt;
    text-align: center;
  }

  .terbilang-box {
    background-color: transparent;
    border: none;
    padding: 2pt 0;
    font-style: italic;
    font-weight: bold;
    color: #111111;
  }

  .amount-box-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 14pt;
    padding-top: 8pt;
    border-top: 1pt solid #1a1a1a;
  }

  .amount-badge {
    border: none;
    background-color: transparent;
    padding: 0;
    display: inline-block;
  }

  .amount-badge .amount-label {
    font-size: 8pt;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    text-transform: uppercase;
    color: #555555;
    margin-bottom: 2pt;
  }

  .amount-badge .amount-value {
    font-family: 'Courier New', Courier, monospace;
    font-size: 14pt;
    font-weight: 900;
    color: #000000;
    letter-spacing: 0.5pt;
    border-bottom: 2pt double #000000;
    padding-bottom: 1pt;
    display: inline-block;
  }

  .date-loc {
    font-size: 10pt;
    text-align: right;
    font-family: Arial, Helvetica, sans-serif;
  }

  .grid-signatures {
    display: table;
    width: 100%;
    margin-top: 18pt;
    table-layout: fixed;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 9pt;
  }

  .grid-signatures .sig-col {
    display: table-cell;
    text-align: center;
    vertical-align: top;
    padding: 0 4pt;
  }

  .sig-space {
    height: 52pt;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .materai-box {
    border: 1pt dashed #dc2626;
    color: #dc2626;
    font-size: 6.5pt;
    font-weight: bold;
    padding: 3pt 5pt;
    transform: rotate(-5deg);
  }

  .sig-name {
    font-weight: bold;
    text-decoration: underline;
    text-transform: uppercase;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 10pt 0;
    font-size: 9.5pt;
  }

  .data-table th {
    border-top: 1.5pt solid #1a1a1a;
    border-bottom: 1.5pt solid #1a1a1a;
    border-left: none;
    border-right: none;
    background-color: #faf9f6;
    padding: 5pt 4pt;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 8.5pt;
    font-weight: bold;
    text-align: center;
  }

  .data-table td {
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 0.5pt solid #e5e0d8;
    padding: 4.5pt 4pt;
    vertical-align: middle;
  }

  .data-table tfoot td {
    border-top: 1.5pt solid #1a1a1a;
    border-bottom: 2pt double #1a1a1a;
    border-left: none;
    border-right: none;
    font-weight: bold;
    background-color: transparent;
    padding: 5pt 4pt;
  }

  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .text-left { text-align: left; }
  .font-mono { font-family: 'Courier New', Courier, monospace; }
  .font-sans { font-family: Arial, Helvetica, sans-serif; }
  .font-bold { font-weight: bold; }

  .attachment-receipt-box {
    margin-top: 10pt;
    border-top: 1.5pt dashed #888888;
    padding-top: 6pt;
    page-break-inside: avoid;
  }

  .attachment-receipt-title {
    text-align: center;
    font-size: 7.5pt;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    color: #555555;
    letter-spacing: 0.8pt;
    margin-bottom: 4pt;
  }

  .attachment-receipt-area {
    border: 1.5pt dashed #aaaaaa;
    height: 120pt;
    background: #faf9f6;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #777777;
    font-size: 8.5pt;
    font-family: Arial, Helvetica, sans-serif;
  }

  @media print {
    html, body {
      width: 100% !important;
      height: auto !important;
      overflow: visible !important;
      background: #ffffff !important;
    }
    .page-container {
      overflow: visible !important;
      max-width: 100% !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    table {
      page-break-inside: auto !important;
      break-inside: auto !important;
    }
    thead {
      display: table-header-group !important;
    }
    tfoot {
      display: table-footer-group !important;
    }
    tr, tbody tr {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .grid-signatures {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
  }
`;

/**
 * Builds HTML for a single SPJ document page
 */
export function generateSingleDocPageHtml(
  doc: SpjDocument,
  school: SchoolProfile,
  copyLabel?: string
): string {
  const isKwitansi = doc.type === 'kwitansi';
  const isDaftar = doc.type === 'daftar';
  const isNota = doc.type === 'nota' || doc.type === 'faktur';
  const isBkk = doc.type === 'bkk';
  const isBerita = doc.type === 'berita';
  const isSptj = doc.type === 'sptj';

  const docTitleMap: Record<string, string> = {
    kwitansi: 'KWITANSI / BUKTI PEMBAYARAN BOSP',
    daftar: 'DAFTAR PENERIMAAN HONORARIUM',
    nota: 'NOTA PEMBELIAN TOKO',
    faktur: 'FAKTUR BARANG & JASA',
    bkk: 'BUKTI KAS KELUAR (BKK)',
    berita: 'BERITA ACARA PEMBAYARAN & SERAH TERIMA',
    sptj: 'SURAT PERNYATAAN TANGGUNG JAWAB BELANJA (SPTJ)'
  };

  const currentDocTitle = docTitleMap[doc.type] || 'DOKUMEN BUKTI BOSP';

  return `
    <div class="page-container">
      <div class="watermark-bg">
        <img src="/logo_smpn7.png" alt="" />
      </div>

      ${copyLabel ? `<div class="copy-badge">${copyLabel}</div>` : ''}

      <!-- KOP SURAT RESMI -->
      <div class="header-kop">
        <div class="logo-container">
          <img src="/logo_smpn7.png" alt="Logo SMP Negeri 7 Sentani" />
        </div>
        <div class="kop-text">
          <div class="instansi">PEMERINTAH KABUPATEN JAYAPURA &bull; ${school.dinas.toUpperCase()}</div>
          <div class="school-name">${school.nama}</div>
          <div class="address">${school.alamat}, Kec. ${school.kecamatan}, Kab. ${school.kabupaten}, Prov. ${school.provinsi} | NPSN: ${school.npsn}</div>
        </div>
      </div>

      <!-- TYPE 1: KWITANSI RESMI BOSP -->
      ${isKwitansi ? `
        <div class="kwitansi-border">
          ${doc.lunas ? `<div class="stamp-lunas">LUNAS</div>` : ''}

          <div class="doc-title-container">
            <div class="doc-title">${currentDocTitle}</div>
            <div class="doc-number">Nomor : <b>${doc.nomor}</b></div>
          </div>

          <table class="info-table">
            <tbody>
              <tr>
                <td class="label">Sudah Terima Dari</td>
                <td class="colon">:</td>
                <td><b>${doc.terimaDari || `Bendahara ${school.sumberDana} ${school.nama}`}</b></td>
              </tr>
              <tr>
                <td class="label">Uang Sejumlah</td>
                <td class="colon">:</td>
                <td>
                  <div class="terbilang-box">" ${terbilang(doc.jumlah)} Rupiah "</div>
                </td>
              </tr>
              <tr>
                <td class="label">Untuk Pembayaran</td>
                <td class="colon">:</td>
                <td style="line-height: 1.45;">
                  ${doc.uraian || '-'}
                  ${doc.komponen ? `<div style="font-size: 8.5pt; color: #555555; margin-top: 3pt; font-family: Arial, sans-serif;">Komponen: <b>${doc.komponen}</b> &bull; Kode Rekening: <b>${doc.rekening || '-'}</b></div>` : ''}
                </td>
              </tr>
              ${(doc.pph || doc.ppn) ? `
                <tr>
                  <td class="label">Potongan Pajak</td>
                  <td class="colon">:</td>
                  <td style="font-size: 9.5pt; font-family: Arial, sans-serif;">
                    ${doc.pph ? `PPh 21/22/23: <b>${formatRp(doc.pph)}</b>` : ''}
                    ${doc.pph && doc.ppn ? ' &bull; ' : ''}
                    ${doc.ppn ? `PPN 11%: <b>${formatRp(doc.ppn)}</b>` : ''}
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>

          <div class="amount-box-container">
            <div class="amount-badge">
              <div class="amount-label">Jumlah Bersih (Rp) :</div>
              <div class="amount-value">${formatRp(doc.jumlah)},-</div>
            </div>
            <div class="date-loc">
              Sentani, ${formatTanggalIndo(doc.tanggal)}
            </div>
          </div>

          <!-- SIGNATURES (3 KOLOM) -->
          <div class="grid-signatures">
            <div class="sig-col">
              <div>Mengetahui / Menyetujui,</div>
              <div class="font-bold">Kepala Sekolah</div>
              <div class="sig-space"></div>
              <div class="sig-name">${school.kepsekNama}</div>
              <div>NIP. ${school.kepsekNip}</div>
            </div>

            <div class="sig-col">
              <div>Lunas Dibayar,</div>
              <div class="font-bold">Bendahara BOSP</div>
              <div class="sig-space"></div>
              <div class="sig-name">${school.bendaharaNama}</div>
              <div>NIP. ${school.bendaharaNip}</div>
            </div>

            <div class="sig-col">
              <div>Yang Menerima,</div>
              <div class="font-bold">${doc.jabatanPenerima || 'Penerima Pembayaran'}</div>
              <div class="sig-space">
                ${doc.materai ? `<div class="materai-box">MATERAI<br>Rp 10.000</div>` : ''}
              </div>
              <div class="sig-name">${doc.penerima || '................................'}</div>
              <div>${doc.penerimaNip ? `NIP. ${doc.penerimaNip}` : ''}</div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- TYPE 2: DAFTAR HONORARIUM -->
      ${isDaftar ? `
        <div class="doc-title-container">
          <div class="doc-title">${currentDocTitle}</div>
          <div style="font-size: 10.5pt; font-weight: bold; margin-top: 2pt;">${doc.judul || doc.kegiatan || 'Penerimaan Honorarium Kegiatan'}</div>
          <div class="doc-number">Nomor : <b>${doc.nomor}</b></div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 24pt;">No</th>
              <th>Nama Penerima</th>
              <th style="width: 90pt;">Jabatan / Tugas</th>
              <th style="width: 75pt;">Honor Bruto</th>
              <th style="width: 60pt;">PPh 21</th>
              <th style="width: 75pt;">Honor Netto</th>
              <th style="width: 80pt;">Tanda Tangan</th>
            </tr>
          </thead>
          <tbody>
            ${(doc.items && doc.items.length > 0 ? doc.items : [{ nama: doc.penerima || 'Tenaga Pendidik', jabatan: doc.jabatanPenerima || 'Guru', honor: doc.jumlah, pph: 0 }]).map((it, idx) => {
              const bruto = it.honor || 0;
              const pph = it.pph || 0;
              const netto = bruto - pph;
              return `
                <tr>
                  <td class="text-center font-bold">${idx + 1}</td>
                  <td><b>${it.nama || '-'}</b></td>
                  <td>${it.jabatan || '-'}</td>
                  <td class="text-right font-mono">${formatRp(bruto)}</td>
                  <td class="text-right font-mono">${formatRp(pph)}</td>
                  <td class="text-right font-mono font-bold">${formatRp(netto)}</td>
                  <td class="text-left" style="font-size: 8pt; color: #555555; padding-left: 8pt;">${idx + 1}. ................</td>
                </tr>
              `;
            }).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right font-bold font-sans">TOTAL KESELURUHAN :</td>
              <td class="text-right font-mono font-bold">${formatRp(doc.jumlah)}</td>
              <td class="text-right font-mono font-bold">${formatRp((doc.items || []).reduce((s, it) => s + (it.pph || 0), 0))}</td>
              <td class="text-right font-mono font-bold" style="font-size: 10pt;">${formatRp(doc.jumlah - (doc.items || []).reduce((s, it) => s + (it.pph || 0), 0))}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <div style="font-size: 9.5pt; font-style: italic; margin-top: 6pt;">
          Terbilang: <b>" ${terbilang(doc.jumlah)} Rupiah "</b>
        </div>

        <div class="grid-signatures" style="margin-top: 20pt;">
          <div class="sig-col" style="width: 50%;">
            <div>Mengetahui,</div>
            <div class="font-bold">Kepala Sekolah</div>
            <div class="sig-space"></div>
            <div class="sig-name">${school.kepsekNama}</div>
            <div>NIP. ${school.kepsekNip}</div>
          </div>
          <div class="sig-col" style="width: 50%;">
            <div>Sentani, ${formatTanggalIndo(doc.tanggal)}</div>
            <div class="font-bold">Bendahara BOSP</div>
            <div class="sig-space"></div>
            <div class="sig-name">${school.bendaharaNama}</div>
            <div>NIP. ${school.bendaharaNip}</div>
          </div>
        </div>
      ` : ''}

      <!-- TYPE 3: NOTA & FAKTUR TOKO -->
      ${isNota ? `
        <div style="display: flex; justify-content: space-between; border-bottom: 1.5pt solid #1a1a1a; padding-bottom: 6pt; margin-bottom: 8pt;">
          <div>
            <div style="font-size: 12pt; font-weight: bold; font-family: Arial, sans-serif; text-transform: uppercase;">${doc.tokoNama || 'TOKO PENYEDIA PERLENGKAPAN'}</div>
            <div style="font-size: 8.5pt; color: #444444;">${doc.tokoAlamat || 'Jl. Raya Sentani, Jayapura, Papua'}</div>
            ${doc.npwp ? `<div style="font-size: 8pt; font-family: 'Courier New', monospace;">NPWP: ${doc.npwp}</div>` : ''}
          </div>
          <div style="text-align: right; font-family: Arial, sans-serif;">
            <div style="font-size: 12pt; font-weight: 900; text-transform: uppercase;">${doc.type.toUpperCase()}</div>
            <div style="font-size: 9pt;">No: <b>${doc.nomor}</b></div>
            <div style="font-size: 9pt;">Tanggal: ${formatTanggalIndo(doc.tanggal)}</div>
          </div>
        </div>

        <div style="margin-bottom: 8pt; font-size: 9.5pt;">
          <div style="font-weight: bold; font-family: Arial, sans-serif; font-size: 8.5pt;">KEPADA YTH :</div>
          <div style="font-weight: bold;">${school.nama}</div>
          <div style="font-size: 8.5pt; color: #444444;">${school.alamat}, Kec. ${school.kecamatan}, Kab. ${school.kabupaten}</div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 24pt;">No</th>
              <th>Nama Barang / Uraian Jasa</th>
              <th style="width: 40pt;">Qty</th>
              <th style="width: 50pt;">Satuan</th>
              <th style="width: 75pt;">Harga Satuan (Rp)</th>
              <th style="width: 80pt;">Jumlah (Rp)</th>
            </tr>
          </thead>
          <tbody>
            ${(doc.items && doc.items.length > 0 ? doc.items : [{ nama: doc.uraian || 'Barang Perlengkapan Sekolah', qty: 1, satuan: 'Paket', harga: doc.jumlah }]).map((it, idx) => `
              <tr>
                <td class="text-center font-bold">${idx + 1}</td>
                <td>${it.nama || '-'}</td>
                <td class="text-center font-mono">${it.qty || 1}</td>
                <td class="text-center">${it.satuan || 'Buah'}</td>
                <td class="text-right font-mono">${formatRp(it.harga || 0)}</td>
                <td class="text-right font-mono font-bold">${formatRp((it.qty || 1) * (it.harga || 0))}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" class="text-right font-bold font-sans">TOTAL PEMBAYARAN :</td>
              <td class="text-right font-mono font-bold" style="font-size: 10.5pt;">${formatRp(doc.jumlah)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="font-size: 9.5pt; font-style: italic; margin-top: 6pt;">
          Terbilang: <b>" ${terbilang(doc.jumlah)} Rupiah "</b>
        </div>

        <div class="grid-signatures" style="margin-top: 20pt;">
          <div class="sig-col" style="width: 50%;">
            <div>Penerima / Pemeriksa Barang,</div>
            <div class="font-bold">${school.nama}</div>
            <div class="sig-space"></div>
            <div class="sig-name">${school.bendaharaNama}</div>
            <div>NIP. ${school.bendaharaNip}</div>
          </div>
          <div class="sig-col" style="width: 50%;">
            <div>Sentani, ${formatTanggalIndo(doc.tanggal)}</div>
            <div class="font-bold">${doc.tokoNama || 'Hormat Kami (Penyedia Toko)'}</div>
            <div class="sig-space"></div>
            <div class="sig-name">${doc.tokoPic || '................................'}</div>
            <div>Stempel & Cap Toko</div>
          </div>
        </div>
      ` : ''}

      <!-- TYPE 4: BKK, BERITA ACARA, SPTJ -->
      ${(isBkk || isBerita || isSptj) ? `
        <div class="doc-title-container">
          <div class="doc-title">${currentDocTitle}</div>
          <div class="doc-number">Nomor : <b>${doc.nomor}</b></div>
        </div>

        <div style="padding: 10pt 0; margin: 8pt 0; font-size: 10.5pt; line-height: 1.6;">
          <p style="margin-bottom: 8pt;">
            Pada hari ini <b>${formatTanggalIndo(doc.tanggal)}</b>, telah dikeluarkan/dipertanggungjawabkan dana ${school.sumberDana} Tahun Anggaran ${school.tahunAnggaran} sebagai berikut:
          </p>

          <table class="info-table" style="margin: 8pt 0;">
            <tbody>
              <tr>
                <td class="label" style="width: 140pt;">Keperluan / Uraian</td>
                <td class="colon">:</td>
                <td><b>${doc.uraian || '-'}</b></td>
              </tr>
              <tr>
                <td class="label">Penerima / Pelaksana</td>
                <td class="colon">:</td>
                <td>${doc.penerima || doc.pihak2Nama || school.bendaharaNama}</td>
              </tr>
              <tr>
                <td class="label">Jumlah Pengeluaran</td>
                <td class="colon">:</td>
                <td>
                  <span style="font-family: 'Courier New', monospace; font-weight: 900; font-size: 12.5pt; border-bottom: 1.5pt solid #000;">
                    ${formatRp(doc.jumlah)},-
                  </span>
                </td>
              </tr>
              <tr>
                <td class="label">Terbilang</td>
                <td class="colon">:</td>
                <td style="font-style: italic; font-weight: bold;">" ${terbilang(doc.jumlah)} Rupiah "</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="grid-signatures" style="margin-top: 24pt;">
          <div class="sig-col" style="width: 50%;">
            <div>Mengetahui,</div>
            <div class="font-bold">Kepala Sekolah</div>
            <div class="sig-space"></div>
            <div class="sig-name">${school.kepsekNama}</div>
            <div>NIP. ${school.kepsekNip}</div>
          </div>
          <div class="sig-col" style="width: 50%;">
            <div>Sentani, ${formatTanggalIndo(doc.tanggal)}</div>
            <div class="font-bold">Bendahara BOSP</div>
            <div class="sig-space"></div>
            <div class="sig-name">${school.bendaharaNama}</div>
            <div>NIP. ${school.bendaharaNip}</div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Builds the complete standalone HTML string for an SPJ Document
 */
export function buildSpjDocumentPrintHtml(
  doc: SpjDocument,
  school: SchoolProfile,
  targetRangkap: 'ASLI' | 'ARSIP' | 'DUA_RANGKAP' = 'ASLI'
): string {
  let pagesHtml = '';

  if (targetRangkap === 'DUA_RANGKAP' || (doc.type === 'kwitansi' && doc.rangkap)) {
    pagesHtml = `
      ${generateSingleDocPageHtml(doc, school, 'LEMBAR 1 : ASLI')}
      <div class="page-break"></div>
      ${generateSingleDocPageHtml(doc, school, 'LEMBAR 2 : ARSIP SEKOLAH')}
    `;
  } else if (targetRangkap === 'ARSIP') {
    pagesHtml = generateSingleDocPageHtml(doc, school, 'LEMBAR 2 : ARSIP SEKOLAH');
  } else {
    pagesHtml = generateSingleDocPageHtml(doc, school, 'LEMBAR 1 : ASLI');
  }

  const docTitle = `${doc.type.toUpperCase()}_${doc.nomor.replace(/[/\\?%*:|"<>]/g, '_')}`;

  return `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${docTitle}</title>
        <style>
          ${getPrintStyles()}
        </style>
      </head>
      <body>
        ${pagesHtml}
      </body>
    </html>
  `;
}

/**
 * Triggers native browser print / save-to-PDF via an isolated hidden iframe
 * ensuring consistent clean styling without interface clipping or background pollution.
 */
export function printSpjDocument(
  doc: SpjDocument,
  school: SchoolProfile,
  targetRangkap: 'ASLI' | 'ARSIP' | 'DUA_RANGKAP' = 'ASLI'
): void {
  const htmlContent = buildSpjDocumentPrintHtml(doc, school, targetRangkap);
  const printDocTitle = `${doc.type.toUpperCase()}_${doc.nomor.replace(/[/\\?%*:|"<>]/g, '_')}`;

  // Check if iframe printing can be created cleanly
  try {
    const existingIframe = document.getElementById('spj-print-frame');
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'spj-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      // Temporarily update main window title for PDF save dialog default naming
      const originalTitle = document.title;
      document.title = printDocTitle;

      const triggerPrint = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          // Fallback to window print
          window.print();
        } finally {
          setTimeout(() => {
            document.title = originalTitle;
            iframe.remove();
          }, 1000);
        }
      };

      if (iframe.contentWindow) {
        iframe.contentWindow.onload = () => {
          setTimeout(triggerPrint, 250);
        };
        // Fallback timeout in case onload fired synchronously
        setTimeout(triggerPrint, 500);
      } else {
        window.print();
        document.title = originalTitle;
      }
    } else {
      window.print();
    }
  } catch (err) {
    console.error('Print utility fallback to window.print():', err);
    window.print();
  }
}

/**
 * Builds HTML for Kertas Kerja Worksheet print
 */
export function buildWorksheetPrintHtml(
  worksheet: MonthWorksheet,
  monthIndex: number,
  school: SchoolProfile
): string {
  const monthTotal = worksheet.items.reduce((s, it) => s + it.jumlah, 0);
  const monthName = MONTH_NAMES[monthIndex] || 'Bulan';

  return `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>KERTAS_KERJA_${monthName.toUpperCase()}_${school.tahunAnggaran}</title>
        <style>
          ${getPrintStyles()}
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          <div class="watermark-bg">
            <img src="/logo_smpn7.png" alt="" />
          </div>

          <div class="header-kop">
            <div class="logo-container">
              <img src="/logo_smpn7.png" alt="Logo SMP Negeri 7 Sentani" />
            </div>
            <div class="kop-text">
              <div class="instansi">PEMERINTAH KABUPATEN JAYAPURA &bull; ${school.dinas.toUpperCase()}</div>
              <div class="school-name">${school.nama}</div>
              <div class="address">${school.alamat}, Kec. ${school.kecamatan}, Kab. ${school.kabupaten}, Prov. ${school.provinsi} | NPSN: ${school.npsn}</div>
            </div>
          </div>

          <div class="doc-title-container">
            <div class="doc-title">KERTAS KERJA BULAN ${monthName.toUpperCase()} TAHUN ANGGARAN ${school.tahunAnggaran}</div>
            <div class="doc-number">Sumber Dana: <b>${school.sumberDana}</b> &bull; Realisasi 8 Standar Nasional Pendidikan</div>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 20pt;">No</th>
                <th style="width: 65pt;">Kode Rek</th>
                <th style="width: 45pt;">Prog</th>
                <th>Tema / Subtema & Uraian Belanja</th>
                <th style="width: 28pt;">Vol</th>
                <th style="width: 40pt;">Satuan</th>
                <th style="width: 65pt;">Tarif (Rp)</th>
                <th style="width: 70pt;">Jumlah (Rp)</th>
              </tr>
            </thead>
            <tbody>
              ${worksheet.items.map((it, idx) => `
                <tr>
                  <td class="text-center font-bold">${idx + 1}</td>
                  <td class="font-mono" style="font-size: 8pt;">${it.kodeRekening || '-'}</td>
                  <td class="font-mono text-center" style="font-size: 8pt;">${it.kodeProgram || '-'}</td>
                  <td>
                    <div style="font-weight: bold; font-size: 8.5pt;">[${it.temaId} - ${it.subtemaKode}] ${it.uraian}</div>
                  </td>
                  <td class="text-center font-mono">${it.volume}</td>
                  <td class="text-center" style="font-size: 8.5pt;">${it.satuan}</td>
                  <td class="text-right font-mono">${formatRp(it.tarifHarga)}</td>
                  <td class="text-right font-mono font-bold">${formatRp(it.jumlah)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="7" class="text-right font-bold font-sans">TOTAL BELANJA BULAN ${monthName.toUpperCase()} :</td>
                <td class="text-right font-mono font-bold" style="font-size: 10pt;">${formatRp(monthTotal)}</td>
              </tr>
            </tfoot>
          </table>

          <div class="grid-signatures" style="margin-top: 16pt;">
            <div class="sig-col">
              <div>Mengetahui / Menyetujui,</div>
              <div class="font-bold">Kepala Sekolah</div>
              <div class="sig-space"></div>
              <div class="sig-name">${school.kepsekNama}</div>
              <div>NIP. ${school.kepsekNip}</div>
            </div>
            <div class="sig-col">
              <div>Menyetujui,</div>
              <div class="font-bold">Ketua Komite Sekolah</div>
              <div class="sig-space"></div>
              <div class="sig-name">${school.komiteNama}</div>
              <div>Komite Sekolah</div>
            </div>
            <div class="sig-col">
              <div>Sentani, 30 ${monthName} ${school.tahunAnggaran}</div>
              <div class="font-bold">Bendahara BOSP</div>
              <div class="sig-space"></div>
              <div class="sig-name">${school.bendaharaNama}</div>
              <div>NIP. ${school.bendaharaNip}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Builds HTML for Rekapitulasi Matriks 8 Standar 12 Bulan print
 */
export function buildRekapMatrixPrintHtml(
  school: SchoolProfile,
  worksheets: MonthWorksheet[]
): string {
  const totalPenerimaan = school.totalPenerimaan || 340000000;
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

  return `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>REKAP_MATRIKS_8_STANDAR_${school.tahunAnggaran}</title>
        <style>
          ${getPrintStyles()}
          @page {
            size: A4 landscape;
            margin: 8mm 10mm;
          }
          .rekap-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 7.5pt;
            margin-top: 8pt;
          }
          .rekap-table th {
            border-top: 1.5pt solid #000000;
            border-bottom: 1.5pt solid #000000;
            border-left: none;
            border-right: none;
            background-color: #faf9f6;
            font-weight: bold;
            text-align: center;
            padding: 4pt 2pt;
          }
          .rekap-table td {
            border-top: none;
            border-left: none;
            border-right: none;
            border-bottom: 0.5pt solid #e5e0d8;
            padding: 3.5pt 2pt;
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          <div class="watermark-bg">
            <img src="/logo_smpn7.png" alt="" />
          </div>

          <div class="header-kop">
            <div class="logo-container">
              <img src="/logo_smpn7.png" alt="Logo SMP Negeri 7 Sentani" />
            </div>
            <div class="kop-text">
              <div class="instansi">PEMERINTAH KABUPATEN JAYAPURA &bull; ${school.dinas.toUpperCase()}</div>
              <div class="school-name">${school.nama}</div>
              <div class="address">${school.alamat}, Kec. ${school.kecamatan}, Kab. ${school.kabupaten}, Prov. ${school.provinsi} | NPSN: ${school.npsn}</div>
            </div>
          </div>

          <div class="doc-title-container">
            <div class="doc-title">REKAPITULASI MATRIKS 8 STANDAR NASIONAL PENDIDIKAN (12 BULAN)</div>
            <div class="doc-number">Tahun Anggaran ${school.tahunAnggaran} &bull; Sumber Dana: <b>${school.sumberDana}</b> &bull; Pagu: ${formatRp(totalPenerimaan)}</div>
          </div>

          <table class="rekap-table">
            <thead>
              <tr>
                <th style="width: 25pt;">Kode</th>
                <th style="text-align: left; padding-left: 4pt; width: 140pt;">Tema / Standar Nasional</th>
                ${MONTH_NAMES.map((m) => `<th style="width: 48pt;">${m.substring(0, 3)}</th>`).join('')}
                <th style="width: 65pt;">Total (Rp)</th>
                <th style="width: 30pt;">%</th>
              </tr>
            </thead>
            <tbody>
              ${matrix.map((row) => `
                <tr>
                  <td style="text-align: center; font-weight: bold;">${row.kode}</td>
                  <td style="font-weight: 600; padding-left: 4pt;">${row.nama}</td>
                  ${row.monthlyValues.map((val) => `
                    <td style="text-align: right; font-family: monospace;">${val > 0 ? formatRp(val).replace('Rp ', '') : '-'}</td>
                  `).join('')}
                  <td style="text-align: right; font-family: monospace; font-weight: bold; background-color: #faf9f6;">${formatRp(row.totalStandar)}</td>
                  <td style="text-align: center; font-weight: bold;">${row.pct.toFixed(1)}%</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="background-color: #e8e2d6; font-weight: bold;">
                <td colspan="2" style="text-align: right; padding-right: 6pt;">TOTAL REALISASI PER BULAN:</td>
                ${monthlyTotals.map((mTot) => `
                  <td style="text-align: right; font-family: monospace; font-weight: bold;">${formatRp(mTot).replace('Rp ', '')}</td>
                `).join('')}
                <td style="text-align: right; font-family: monospace; font-weight: bold; font-size: 8.5pt;">${formatRp(grandTotal)}</td>
                <td style="text-align: center;">100%</td>
              </tr>
            </tfoot>
          </table>

          <div class="grid-signatures" style="margin-top: 14pt;">
            <div class="sig-col">
              <div>Mengetahui / Menyetujui,</div>
              <div class="font-bold">Kepala Sekolah</div>
              <div class="sig-space" style="height: 35pt;"></div>
              <div class="sig-name">${school.kepsekNama}</div>
              <div>NIP. ${school.kepsekNip}</div>
            </div>
            <div class="sig-col">
              <div>Menyetujui,</div>
              <div class="font-bold">Ketua Komite Sekolah</div>
              <div class="sig-space" style="height: 35pt;"></div>
              <div class="sig-name">${school.komiteNama}</div>
              <div>Komite Sekolah</div>
            </div>
            <div class="sig-col">
              <div>Sentani, 31 Desember ${school.tahunAnggaran}</div>
              <div class="font-bold">Bendahara BOSP</div>
              <div class="sig-space" style="height: 35pt;"></div>
              <div class="sig-name">${school.bendaharaNama}</div>
              <div>NIP. ${school.bendaharaNip}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Triggers native browser print / save-to-PDF for Rekap Matriks
 */
export function printRekapMatrix(
  school: SchoolProfile,
  worksheets: MonthWorksheet[]
): void {
  const htmlContent = buildRekapMatrixPrintHtml(school, worksheets);
  const printDocTitle = `REKAP_MATRIKS_8_STANDAR_${school.tahunAnggaran}`;

  try {
    const existingIframe = document.getElementById('rekap-print-frame');
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'rekap-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      const originalTitle = document.title;
      document.title = printDocTitle;

      const triggerPrint = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          window.print();
        } finally {
          setTimeout(() => {
            document.title = originalTitle;
            iframe.remove();
          }, 1000);
        }
      };

      if (iframe.contentWindow) {
        iframe.contentWindow.onload = () => {
          setTimeout(triggerPrint, 250);
        };
        setTimeout(triggerPrint, 500);
      } else {
        window.print();
        document.title = originalTitle;
      }
    } else {
      window.print();
    }
  } catch (err) {
    console.error('Rekap print fallback to window.print():', err);
    window.print();
  }
}

/**
 * Triggers native browser print / save-to-PDF for monthly worksheet
 */
export function printWorksheet(
  worksheet: MonthWorksheet,
  monthIndex: number,
  school: SchoolProfile
): void {
  const htmlContent = buildWorksheetPrintHtml(worksheet, monthIndex, school);
  const monthName = MONTH_NAMES[monthIndex] || 'Bulan';
  const printDocTitle = `KERTAS_KERJA_${monthName.toUpperCase()}_${school.tahunAnggaran}`;

  try {
    const existingIframe = document.getElementById('worksheet-print-frame');
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'worksheet-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      const originalTitle = document.title;
      document.title = printDocTitle;

      const triggerPrint = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          window.print();
        } finally {
          setTimeout(() => {
            document.title = originalTitle;
            iframe.remove();
          }, 1000);
        }
      };

      if (iframe.contentWindow) {
        iframe.contentWindow.onload = () => {
          setTimeout(triggerPrint, 250);
        };
        setTimeout(triggerPrint, 500);
      } else {
        window.print();
        document.title = originalTitle;
      }
    } else {
      window.print();
    }
  } catch (err) {
    console.error('Worksheet print fallback to window.print():', err);
    window.print();
  }
}

/**
 * Builds HTML for ARKAS PERUBAHAN comparative printout (Semula vs Menjadi & Selisih)
 */
export function buildArkasPerubahanPrintHtml(
  worksheet: ArkasPerubahanMonthWorksheet,
  monthIndex: number,
  school: SchoolProfile,
  allWorksheets?: ArkasPerubahanMonthWorksheet[]
): string {
  const monthName = MONTH_NAMES[monthIndex] || 'Bulan';
  const totalSemula = worksheet.items.reduce((s, it) => s + it.semulaJumlah, 0);
  const totalMenjadi = worksheet.items.reduce(
    (s, it) => s + (it.statusPerubahan === 'DIHILANGKAN' ? 0 : it.jumlah),
    0
  );
  const totalSelisih = totalMenjadi - totalSemula;

  const dihilangkanItems = worksheet.items.filter(
    (it) => it.statusPerubahan === 'DIHILANGKAN'
  );
  const totalDihilangkan = dihilangkanItems.reduce(
    (s, it) => s + it.semulaJumlah,
    0
  );

  const baruItems = worksheet.items.filter((it) => it.statusPerubahan === 'BARU');
  const totalBaru = baruItems.reduce((s, it) => s + it.jumlah, 0);

  // Triwulan calculations
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
        return '<span style="background-color: #d1fae5; color: #065f46; font-weight: bold; padding: 1pt 3pt; font-size: 6.5pt; border-radius: 2pt;">BARU</span>';
      case 'DIHILANGKAN':
        return '<span style="background-color: #fee2e2; color: #991b1b; font-weight: bold; padding: 1pt 3pt; font-size: 6.5pt; border-radius: 2pt;">DIHILANGKAN</span>';
      case 'BERTAMBAH':
        return '<span style="background-color: #dbeafe; color: #1e40af; font-weight: bold; padding: 1pt 3pt; font-size: 6.5pt; border-radius: 2pt;">BERTAMBAH</span>';
      case 'BERKURANG':
        return '<span style="background-color: #fef3c7; color: #92400e; font-weight: bold; padding: 1pt 3pt; font-size: 6.5pt; border-radius: 2pt;">BERKURANG</span>';
      default:
        return '<span style="background-color: #f3f4f6; color: #4b5563; padding: 1pt 3pt; font-size: 6.5pt; border-radius: 2pt;">TETAP</span>';
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ARKAS_PERUBAHAN_${monthName.toUpperCase()}_${school.tahunAnggaran}</title>
        <style>
          ${getPrintStyles()}
          @page {
            size: A4 landscape;
            margin: 6mm 7mm;
          }
          html, body {
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: #ffffff !important;
          }
          .page-container {
            max-width: 100% !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            margin: 0 auto !important;
            padding: 0 !important;
          }
          .kpi-row {
            display: flex;
            gap: 6pt;
            margin-bottom: 6pt;
          }
          .kpi-card {
            flex: 1;
            border: 0.75pt solid #cbd5e1;
            padding: 3pt 5pt;
            border-radius: 3pt;
            text-align: center;
          }
          .kpi-title {
            font-size: 6pt;
            font-weight: bold;
            text-transform: uppercase;
          }
          .kpi-value {
            font-size: 8.5pt;
            font-weight: bold;
            font-family: monospace;
            margin-top: 1pt;
          }
          .perub-table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 7pt !important;
            margin-top: 4pt;
            page-break-inside: auto !important;
          }
          .perub-table thead {
            display: table-header-group !important;
          }
          .perub-table tfoot {
            display: table-footer-group !important;
          }
          .perub-table tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .perub-table th {
            border: 0.75pt solid #1a1a1a;
            background-color: #f4efe6;
            font-weight: bold;
            text-align: center;
            padding: 3pt 1.5pt;
          }
          .perub-table td {
            border: 0.5pt solid #c8c2b5;
            padding: 2.5pt 2pt;
            vertical-align: middle;
            word-break: break-word;
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          <div class="watermark-bg">
            <img src="/logo_smpn7.png" alt="" />
          </div>

          <div class="header-kop" style="margin-bottom: 6pt; padding-bottom: 4pt;">
            <div class="logo-container">
              <img src="/logo_smpn7.png" alt="Logo SMP Negeri 7 Sentani" />
            </div>
            <div class="kop-text">
              <div class="instansi">PEMERINTAH KABUPATEN JAYAPURA &bull; ${school.dinas.toUpperCase()}</div>
              <div class="school-name">${school.nama}</div>
              <div class="address">${school.alamat}, Kec. ${school.kecamatan}, Kab. ${school.kabupaten}, Prov. ${school.provinsi} | NPSN: ${school.npsn}</div>
            </div>
          </div>

          <div class="doc-title-container" style="margin-bottom: 4pt;">
            <div class="doc-title" style="font-size: 10.5pt;">KERTAS KERJA PERUBAHAN ANGGARAN (ARKAS PERUBAHAN)</div>
            <div class="doc-number" style="font-size: 8pt;">Bulan ${monthName.toUpperCase()} ${school.tahunAnggaran} &bull; Sumber Dana: <b>${school.sumberDana}</b> &bull; Dokumen Resmi Perubahan Rencana Kerja dan Anggaran Sekolah</div>
          </div>

          <!-- KPI Summary Header in Print -->
          <div class="kpi-row">
            <div class="kpi-card" style="background-color: #f8fafc;">
              <div class="kpi-title" style="color: #475569;">Pagu Semula (Murni) Bulan ${monthName}</div>
              <div class="kpi-value" style="color: #1e293b;">${formatRp(totalSemula)}</div>
            </div>
            <div class="kpi-card" style="background-color: #f0fdf4;">
              <div class="kpi-title" style="color: #166534;">Anggaran Menjadi (Perubahan)</div>
              <div class="kpi-value" style="color: #14532d;">${formatRp(totalMenjadi)}</div>
            </div>
            <div class="kpi-card" style="background-color: ${totalSelisih >= 0 ? '#f0fdf4' : '#fff1f2'};">
              <div class="kpi-title" style="color: ${totalSelisih >= 0 ? '#166534' : '#991b1b'};">Selisih Bulan ${monthName}</div>
              <div class="kpi-value" style="color: ${totalSelisih >= 0 ? '#166534' : '#991b1b'};">
                ${totalSelisih > 0 ? '+' : ''}${formatRp(totalSelisih)}
              </div>
            </div>
            <div class="kpi-card" style="background-color: #eff6ff;">
              <div class="kpi-title" style="color: #1e40af;">Total Triwulan ${twName}</div>
              <div class="kpi-value" style="color: #1e3a8a;">${formatRp(totalMenjadiTW)}</div>
            </div>
            <div class="kpi-card" style="background-color: #faf5ff;">
              <div class="kpi-title" style="color: #6b21a8;">Total 1 Tahun (12 Bulan)</div>
              <div class="kpi-value" style="color: #581c87;">${formatRp(totalMenjadiTahun)}</div>
            </div>
          </div>

          <table class="perub-table">
            <thead>
              <tr>
                <th rowspan="2" style="width: 18pt;">No</th>
                <th rowspan="2" style="width: 55pt;">Kode Rekening</th>
                <th rowspan="2" style="width: 40pt;">Kode Prog</th>
                <th rowspan="2">Uraian Rincian Belanja / Kegiatan</th>
                <th rowspan="2" style="width: 50pt;">Status</th>
                <th colspan="3" style="background-color: #f9f8f5;">SEMULA (ARKAS MURNI)</th>
                <th colspan="3" style="background-color: #eef2eb;">MENJADI (ARKAS PERUBAHAN)</th>
                <th rowspan="2" style="width: 58pt;">SELISIH (+/-)</th>
                <th rowspan="2" style="width: 80pt;">Alasan / Keterangan</th>
              </tr>
              <tr>
                <th style="width: 20pt;">Vol</th>
                <th style="width: 32pt;">Tarif</th>
                <th style="width: 48pt;">Jumlah</th>
                <th style="width: 20pt;">Vol</th>
                <th style="width: 32pt;">Tarif</th>
                <th style="width: 48pt;">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              ${worksheet.items.map((it, idx) => {
                const isDihilangkan = it.statusPerubahan === 'DIHILANGKAN';
                return `
                  <tr style="${isDihilangkan ? 'background-color: #fff1f2; text-decoration: line-through; color: #888;' : ''}">
                    <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
                    <td style="font-family: monospace; font-size: 6.8pt;">${it.kodeRekening || '-'}</td>
                    <td style="font-family: monospace; text-align: center; font-size: 6.8pt;">${it.kodeProgram || '-'}</td>
                    <td>
                      <div style="font-weight: 600;">${it.uraian}</div>
                      <div style="font-size: 6.2pt; color: #555;">[Standar ${it.temaId} - ${it.subtemaNama || ''}]</div>
                    </td>
                    <td style="text-align: center;">${getStatusBadge(it.statusPerubahan)}</td>
                    
                    <!-- Semula -->
                    <td style="text-align: center; font-family: monospace;">${it.semulaVolume}</td>
                    <td style="text-align: right; font-family: monospace;">${it.semulaTarif > 0 ? formatRp(it.semulaTarif).replace('Rp ', '') : '-'}</td>
                    <td style="text-align: right; font-family: monospace;">${formatRp(it.semulaJumlah).replace('Rp ', '')}</td>

                    <!-- Menjadi -->
                    <td style="text-align: center; font-family: monospace; font-weight: bold;">${it.volume}</td>
                    <td style="text-align: right; font-family: monospace;">${it.tarifHarga > 0 ? formatRp(it.tarifHarga).replace('Rp ', '') : '-'}</td>
                    <td style="text-align: right; font-family: monospace; font-weight: bold;">${formatRp(it.jumlah).replace('Rp ', '')}</td>

                    <!-- Selisih -->
                    <td style="text-align: right; font-family: monospace; font-weight: bold; color: ${it.selisihJumlah > 0 ? '#047857' : it.selisihJumlah < 0 ? '#b91c1c' : '#4b5563'};">
                      ${it.selisihJumlah > 0 ? '+' : ''}${formatRp(it.selisihJumlah).replace('Rp ', '')}
                    </td>

                    <!-- Alasan -->
                    <td style="font-size: 6.2pt; color: #374151;">${it.alasanPerubahan || '-'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <!-- Baris 1: Total Bulan Ini -->
              <tr style="background-color: #f2ede4; font-weight: bold; border-top: 1.5pt solid #1a1a1a;">
                <td colspan="7" style="text-align: right; padding-right: 4pt;">1. TOTAL ANGGARAN BULAN ${monthName.toUpperCase()}:</td>
                <td style="text-align: right; font-family: monospace;">${formatRp(totalSemula)}</td>
                <td colspan="2" style="text-align: right; padding-right: 4pt;">MENJADI:</td>
                <td style="text-align: right; font-family: monospace;">${formatRp(totalMenjadi)}</td>
                <td style="text-align: right; font-family: monospace; color: ${totalSelisih >= 0 ? '#047857' : '#b91c1c'};">
                  ${totalSelisih > 0 ? '+' : ''}${formatRp(totalSelisih)}
                </td>
                <td style="font-size: 6pt; color: #555;">${worksheet.items.length} Rincian</td>
              </tr>

              <!-- Baris 2: Total Triwulan -->
              <tr style="background-color: #eff6ff; font-weight: bold;">
                <td colspan="7" style="text-align: right; padding-right: 4pt;">2. TOTAL KUMULATIF TRIWULAN ${twName} (${school.tahunAnggaran}):</td>
                <td style="text-align: right; font-family: monospace;">${formatRp(totalSemulaTW)}</td>
                <td colspan="2" style="text-align: right; padding-right: 4pt;">MENJADI:</td>
                <td style="text-align: right; font-family: monospace;">${formatRp(totalMenjadiTW)}</td>
                <td style="text-align: right; font-family: monospace; color: ${totalSelisihTW >= 0 ? '#047857' : '#b91c1c'};">
                  ${totalSelisihTW > 0 ? '+' : ''}${formatRp(totalSelisihTW)}
                </td>
                <td style="font-size: 6pt; color: #1e40af;">Kumulatif TW ${twName}</td>
              </tr>

              <!-- Baris 3: Total 1 Tahun Anggaran -->
              <tr style="background-color: #fdf2f8; font-weight: bold;">
                <td colspan="7" style="text-align: right; padding-right: 4pt;">3. TOTAL AKUMULASI 1 TAHUN (12 BULAN):</td>
                <td style="text-align: right; font-family: monospace;">${formatRp(totalSemulaTahun)}</td>
                <td colspan="2" style="text-align: right; padding-right: 4pt;">MENJADI:</td>
                <td style="text-align: right; font-family: monospace;">${formatRp(totalMenjadiTahun)}</td>
                <td style="text-align: right; font-family: monospace; color: ${totalSelisihTahun >= 0 ? '#047857' : '#b91c1c'};">
                  ${totalSelisihTahun > 0 ? '+' : ''}${formatRp(totalSelisihTahun)}
                </td>
                <td style="font-size: 6pt; color: #831843;">Tahun ${school.tahunAnggaran}</td>
              </tr>
            </tfoot>
          </table>

          <div style="font-size: 8pt; font-style: italic; margin-top: 5pt;">
            Terbilang Anggaran Menjadi Bulan Ini: <b>" ${terbilang(totalMenjadi)} Rupiah "</b>
          </div>

          <div class="grid-signatures" style="margin-top: 10pt;">
            <div class="sig-col">
              <div>Mengetahui / Menyetujui,</div>
              <div class="font-bold">Kepala Sekolah</div>
              <div class="sig-space" style="height: 32pt;"></div>
              <div class="sig-name">${school.kepsekNama}</div>
              <div>NIP. ${school.kepsekNip}</div>
            </div>
            <div class="sig-col">
              <div>Menyetujui,</div>
              <div class="font-bold">Ketua Komite Sekolah</div>
              <div class="sig-space" style="height: 32pt;"></div>
              <div class="sig-name">${school.komiteNama}</div>
              <div>Komite Sekolah</div>
            </div>
            <div class="sig-col">
              <div>Sentani, 30 ${monthName} ${school.tahunAnggaran}</div>
              <div class="font-bold">Bendahara BOSP</div>
              <div class="sig-space" style="height: 32pt;"></div>
              <div class="sig-name">${school.bendaharaNama}</div>
              <div>NIP. ${school.bendaharaNip}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Triggers native browser print / PDF download for ARKAS Perubahan worksheet
 */
export function printArkasPerubahanWorksheet(
  worksheet: ArkasPerubahanMonthWorksheet,
  monthIndex: number,
  school: SchoolProfile,
  allWorksheets?: ArkasPerubahanMonthWorksheet[]
): void {
  const htmlContent = buildArkasPerubahanPrintHtml(
    worksheet,
    monthIndex,
    school,
    allWorksheets
  );
  const monthName = MONTH_NAMES[monthIndex] || 'Bulan';
  const printDocTitle = `ARKAS_PERUBAHAN_${monthName.toUpperCase()}_${school.tahunAnggaran}`;

  try {
    const existingIframe = document.getElementById('perubahan-print-frame');
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'perubahan-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '-999';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      const originalTitle = document.title;
      document.title = printDocTitle;

      const triggerPrint = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          window.print();
        } finally {
          setTimeout(() => {
            document.title = originalTitle;
            iframe.remove();
          }, 1000);
        }
      };

      if (iframe.contentWindow) {
        iframe.contentWindow.onload = () => {
          setTimeout(triggerPrint, 250);
        };
        setTimeout(triggerPrint, 500);
      } else {
        window.print();
        document.title = originalTitle;
      }
    } else {
      window.print();
    }
  } catch (err) {
    console.error('Arkas Perubahan print fallback to window.print():', err);
    window.print();
  }
}

/**
 * Builds HTML for Printing Rekapitulasi Komparatif ARKAS Perubahan vs ARKAS Murni (A4 Landscape)
 */
export function buildRekapPerubahanPrintHtml(
  school: SchoolProfile,
  worksheets: ArkasPerubahanMonthWorksheet[],
  murniWorksheets: MonthWorksheet[]
): string {
  // Monthly calculations
  const monthlyData = MONTH_NAMES.map((mName, mIdx) => {
    const wsPerubahan = worksheets[mIdx];
    const wsMurni = murniWorksheets[mIdx];
    
    // Semula: sum of semulaJumlah from perubahan items, or sum of items from murni
    const semula = wsPerubahan 
      ? wsPerubahan.items.reduce((s, it) => s + it.semulaJumlah, 0)
      : (wsMurni ? wsMurni.items.reduce((s, it) => s + it.jumlah, 0) : 0);

    // Menjadi: sum of active items in perubahan (excluding DIHILANGKAN or where jumlah > 0)
    const menjadi = wsPerubahan 
      ? wsPerubahan.items.reduce((s, it) => s + (it.statusPerubahan === 'DIHILANGKAN' ? 0 : it.jumlah), 0)
      : 0;

    const selisih = menjadi - semula;
    const dihilangkanCount = wsPerubahan ? wsPerubahan.items.filter(it => it.statusPerubahan === 'DIHILANGKAN').length : 0;
    const baruCount = wsPerubahan ? wsPerubahan.items.filter(it => it.statusPerubahan === 'BARU').length : 0;
    const bertambahCount = wsPerubahan ? wsPerubahan.items.filter(it => it.statusPerubahan === 'BERTAMBAH').length : 0;
    const berkurangCount = wsPerubahan ? wsPerubahan.items.filter(it => it.statusPerubahan === 'BERKURANG').length : 0;

    const triwulan = mIdx < 3 ? 'I' : mIdx < 6 ? 'II' : mIdx < 9 ? 'III' : 'IV';

    return {
      bulanIndex: mIdx,
      bulanNama: mName,
      triwulan,
      semula,
      menjadi,
      selisih,
      dihilangkanCount,
      baruCount,
      bertambahCount,
      berkurangCount
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

  // All Eliminated Items across 12 months
  const allDihilangkanItems: Array<{ bulan: string; item: ArkasPerubahanItem }> = [];
  worksheets.forEach((ws, mIdx) => {
    ws.items.forEach(it => {
      if (it.statusPerubahan === 'DIHILANGKAN') {
        allDihilangkanItems.push({ bulan: MONTH_NAMES[mIdx], item: it });
      }
    });
  });

  const totalDihilangkanNilai = allDihilangkanItems.reduce((s, x) => s + x.item.semulaJumlah, 0);

  // All New Items across 12 months
  const allBaruItems: Array<{ bulan: string; item: ArkasPerubahanItem }> = [];
  worksheets.forEach((ws, mIdx) => {
    ws.items.forEach(it => {
      if (it.statusPerubahan === 'BARU') {
        allBaruItems.push({ bulan: MONTH_NAMES[mIdx], item: it });
      }
    });
  });

  const totalBaruNilai = allBaruItems.reduce((s, x) => s + x.item.jumlah, 0);

  return `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>REKAPITULASI_ARKAS_PERUBAHAN_${school.tahunAnggaran}</title>
        <style>
          ${getPrintStyles()}
          @page {
            size: A4 landscape;
            margin: 6mm 7mm;
          }
          html, body {
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: #ffffff !important;
          }
          .page-container {
            max-width: 100% !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            margin: 0 auto !important;
            padding: 0 !important;
          }
          .rekap-table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 7pt !important;
            margin-top: 5pt !important;
            page-break-inside: auto !important;
          }
          .rekap-table thead {
            display: table-header-group !important;
          }
          .rekap-table tfoot {
            display: table-footer-group !important;
          }
          .rekap-table tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .rekap-table th {
            border: 0.75pt solid #1a1a1a;
            background-color: #f4efe6;
            font-weight: bold;
            text-align: center;
            padding: 3pt 2pt;
          }
          .rekap-table td {
            border: 0.5pt solid #d1cbbf;
            padding: 2.5pt 2.5pt;
            vertical-align: middle;
            word-break: break-word;
          }
          .badge-danger {
            background-color: #fee2e2;
            color: #991b1b;
            font-weight: bold;
            padding: 1pt 4pt;
            border-radius: 2pt;
            font-size: 6.5pt;
          }
          .badge-success {
            background-color: #d1fae5;
            color: #065f46;
            font-weight: bold;
            padding: 1pt 4pt;
            border-radius: 2pt;
            font-size: 6.5pt;
          }
        </style>
      </head>
      <body>
        <div class="page-container" style="max-width: 275mm;">
          <div class="watermark-bg">
            <img src="/logo_smpn7.png" alt="" />
          </div>

          <div class="header-kop">
            <div class="logo-container">
              <img src="/logo_smpn7.png" alt="Logo SMP Negeri 7 Sentani" />
            </div>
            <div class="kop-text">
              <div class="kop-kab">PEMERINTAH KABUPATEN JAYAPURA</div>
              <div class="kop-dinas">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
              <div class="kop-sekolah">${school.nama.toUpperCase()}</div>
              <div class="kop-alamat">${school.alamat} - Sentani, Kab. Jayapura</div>
              <div class="kop-kontak">NPSN: ${school.npsn} &bull; Website/Email: smpn7sentani@kemdikbud.go.id</div>
            </div>
          </div>

          <div style="text-align: center; margin: 8pt 0 4pt 0;">
            <div style="font-family: Arial, Helvetica, sans-serif; font-size: 11pt; font-weight: bold; text-decoration: underline; letter-spacing: 0.5pt;">
              REKAPITULASI KOMPARATIF PERUBAHAN ANGGARAN (ARKAS PERUBAHAN)
            </div>
            <div style="font-size: 8.5pt; font-weight: bold; color: #374151; margin-top: 2pt;">
              SUMBER DANA: ${school.sumberDana.toUpperCase()} - TAHUN ANGGARAN ${school.tahunAnggaran}
            </div>
          </div>

          <!-- KPI Summary Cards in Print -->
          <div style="display: flex; gap: 8pt; margin-bottom: 8pt; margin-top: 6pt;">
            <div style="flex: 1; border: 1pt solid #cbd5e1; background: #f8fafc; padding: 4pt 6pt; border-radius: 4pt; text-align: center;">
              <div style="font-size: 6.5pt; color: #64748b; font-weight: bold; text-transform: uppercase;">Total Anggaran Semula (Murni)</div>
              <div style="font-size: 9pt; font-weight: bold; font-family: monospace; color: #1e293b;">${formatRp(totalSemulaAll)}</div>
            </div>
            <div style="flex: 1; border: 1pt solid #cbd5e1; background: #f0fdf4; padding: 4pt 6pt; border-radius: 4pt; text-align: center;">
              <div style="font-size: 6.5pt; color: #166534; font-weight: bold; text-transform: uppercase;">Total Anggaran Menjadi (Perubahan)</div>
              <div style="font-size: 9pt; font-weight: bold; font-family: monospace; color: #14532d;">${formatRp(totalMenjadiAll)}</div>
            </div>
            <div style="flex: 1; border: 1pt solid #cbd5e1; background: ${totalSelisihAll >= 0 ? '#f0fdf4' : '#fff1f2'}; padding: 4pt 6pt; border-radius: 4pt; text-align: center;">
              <div style="font-size: 6.5pt; color: ${totalSelisihAll >= 0 ? '#166534' : '#991b1b'}; font-weight: bold; text-transform: uppercase;">Selisih Perubahan (Netto)</div>
              <div style="font-size: 9pt; font-weight: bold; font-family: monospace; color: ${totalSelisihAll >= 0 ? '#166534' : '#991b1b'};">
                ${totalSelisihAll > 0 ? '+' : ''}${formatRp(totalSelisihAll)}
              </div>
            </div>
            <div style="flex: 1; border: 1pt solid #cbd5e1; background: #fff1f2; padding: 4pt 6pt; border-radius: 4pt; text-align: center;">
              <div style="font-size: 6.5pt; color: #991b1b; font-weight: bold; text-transform: uppercase;">Belanja Dihilangkan (${allDihilangkanItems.length} Item)</div>
              <div style="font-size: 9pt; font-weight: bold; font-family: monospace; color: #991b1b;">-${formatRp(totalDihilangkanNilai)}</div>
            </div>
            <div style="flex: 1; border: 1pt solid #cbd5e1; background: #f0fdf4; padding: 4pt 6pt; border-radius: 4pt; text-align: center;">
              <div style="font-size: 6.5pt; color: #047857; font-weight: bold; text-transform: uppercase;">Belanja Baru (${allBaruItems.length} Item)</div>
              <div style="font-size: 9pt; font-weight: bold; font-family: monospace; color: #047857;">+${formatRp(totalBaruNilai)}</div>
            </div>
          </div>

          <!-- Section 1: Tabel Per Bulan & Triwulan -->
          <div style="font-size: 8pt; font-weight: bold; margin-top: 6pt; margin-bottom: 2pt; color: #1f2937;">
            I. REKAPITULASI KOMPARATIF PER BULAN & TRIWULAN
          </div>
          <table class="rekap-table">
            <thead>
              <tr>
                <th style="width: 25pt;">No</th>
                <th style="width: 75pt;">Bulan</th>
                <th style="width: 45pt;">Triwulan</th>
                <th style="width: 90pt;">Anggaran Semula (Murni)</th>
                <th style="width: 90pt;">Anggaran Menjadi (Perubahan)</th>
                <th style="width: 80pt;">Selisih (+/-)</th>
                <th style="width: 50pt;">% Perubahan</th>
                <th>Rincian Aktivitas Perubahan</th>
              </tr>
            </thead>
            <tbody>
              ${monthlyData.map((m, idx) => {
                const pctChange = m.semula > 0 ? ((m.menjadi - m.semula) / m.semula) * 100 : (m.menjadi > 0 ? 100 : 0);
                return `
                  <tr style="${idx % 2 === 1 ? 'background-color: #faf8f5;' : ''}">
                    <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
                    <td style="font-weight: 600;">${m.bulanNama}</td>
                    <td style="text-align: center; font-family: monospace;">TW ${m.triwulan}</td>
                    <td style="text-align: right; font-family: monospace;">${formatRp(m.semula).replace('Rp ', '')}</td>
                    <td style="text-align: right; font-family: monospace; font-weight: bold;">${formatRp(m.menjadi).replace('Rp ', '')}</td>
                    <td style="text-align: right; font-family: monospace; font-weight: bold; color: ${m.selisih > 0 ? '#047857' : m.selisih < 0 ? '#b91c1c' : '#4b5563'};">
                      ${m.selisih > 0 ? '+' : ''}${formatRp(m.selisih).replace('Rp ', '')}
                    </td>
                    <td style="text-align: center; font-family: monospace; font-size: 7pt;">
                      ${pctChange > 0 ? '+' : ''}${pctChange.toFixed(1)}%
                    </td>
                    <td style="font-size: 6.5pt;">
                      ${m.dihilangkanCount > 0 ? `<span class="badge-danger">${m.dihilangkanCount} Dihilangkan</span> ` : ''}
                      ${m.baruCount > 0 ? `<span class="badge-success">${m.baruCount} Belanja Baru</span> ` : ''}
                      ${m.bertambahCount > 0 ? `<span style="background: #dbeafe; color: #1e40af; padding: 1pt 3pt; border-radius: 2pt;">${m.bertambahCount} Bertambah</span> ` : ''}
                      ${m.berkurangCount > 0 ? `<span style="background: #fef3c7; color: #92400e; padding: 1pt 3pt; border-radius: 2pt;">${m.berkurangCount} Berkurang</span> ` : ''}
                      ${m.dihilangkanCount === 0 && m.baruCount === 0 && m.bertambahCount === 0 && m.berkurangCount === 0 ? '<span style="color: #9ca3af;">Tidak ada pergeseran</span>' : ''}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
            <tfoot>
              <tr style="background-color: #f2ede4; font-weight: bold;">
                <td colspan="3" style="text-align: right; padding-right: 6pt;">TOTAL ANGGARAN 1 TAHUN:</td>
                <td style="text-align: right; font-family: monospace;">${formatRp(totalSemulaAll)}</td>
                <td style="text-align: right; font-family: monospace;">${formatRp(totalMenjadiAll)}</td>
                <td style="text-align: right; font-family: monospace; color: ${totalSelisihAll >= 0 ? '#047857' : '#b91c1c'};">
                  ${totalSelisihAll > 0 ? '+' : ''}${formatRp(totalSelisihAll)}
                </td>
                <td style="text-align: center; font-family: monospace;">
                  ${totalSemulaAll > 0 ? `${totalSelisihAll >= 0 ? '+' : ''}${((totalSelisihAll / totalSemulaAll) * 100).toFixed(1)}%` : '0%'}
                </td>
                <td style="font-size: 7pt;">
                  Total ${allDihilangkanItems.length} Dihilangkan | ${allBaruItems.length} Baru
                </td>
              </tr>
            </tfoot>
          </table>

          <!-- Section 2: 8 Standar Pendidikan & Triwulan -->
          <div style="display: flex; gap: 10pt; margin-top: 8pt;">
            <!-- Standar Box -->
            <div style="flex: 2;">
              <div style="font-size: 8pt; font-weight: bold; margin-bottom: 2pt; color: #1f2937;">
                II. REKAPITULASI KOMPARATIF 8 STANDAR NASIONAL PENDIDIKAN
              </div>
              <table class="rekap-table">
                <thead>
                  <tr>
                    <th style="width: 25pt;">Kode</th>
                    <th>Standar Pendidikan</th>
                    <th style="width: 75pt;">Semula (Murni)</th>
                    <th style="width: 75pt;">Menjadi (Perubahan)</th>
                    <th style="width: 65pt;">Selisih (+/-)</th>
                    <th style="width: 40pt;">% Porsi</th>
                  </tr>
                </thead>
                <tbody>
                  ${standarData.map(st => `
                    <tr>
                      <td style="text-align: center; font-family: monospace; font-weight: bold;">${st.kode}</td>
                      <td style="font-size: 7pt;">${st.nama}</td>
                      <td style="text-align: right; font-family: monospace;">${formatRp(st.semula).replace('Rp ', '')}</td>
                      <td style="text-align: right; font-family: monospace; font-weight: bold;">${formatRp(st.menjadi).replace('Rp ', '')}</td>
                      <td style="text-align: right; font-family: monospace; color: ${st.selisih > 0 ? '#047857' : st.selisih < 0 ? '#b91c1c' : '#4b5563'};">
                        ${st.selisih > 0 ? '+' : ''}${formatRp(st.selisih).replace('Rp ', '')}
                      </td>
                      <td style="text-align: center; font-family: monospace; font-size: 7pt;">${st.pct.toFixed(1)}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Triwulan Box -->
            <div style="flex: 1;">
              <div style="font-size: 8pt; font-weight: bold; margin-bottom: 2pt; color: #1f2937;">
                III. REKAPITULASI PER TRIWULAN
              </div>
              <table class="rekap-table">
                <thead>
                  <tr>
                    <th>Triwulan</th>
                    <th>Semula</th>
                    <th>Menjadi</th>
                    <th>Selisih</th>
                  </tr>
                </thead>
                <tbody>
                  ${triwulanData.map(tw => `
                    <tr>
                      <td style="font-weight: bold; text-align: center;">TW ${tw.tw}</td>
                      <td style="text-align: right; font-family: monospace; font-size: 7pt;">${formatRp(tw.semula).replace('Rp ', '')}</td>
                      <td style="text-align: right; font-family: monospace; font-size: 7pt; font-weight: bold;">${formatRp(tw.menjadi).replace('Rp ', '')}</td>
                      <td style="text-align: right; font-family: monospace; font-size: 7pt; color: ${tw.selisih >= 0 ? '#047857' : '#b91c1c'};">
                        ${tw.selisih > 0 ? '+' : ''}${formatRp(tw.selisih).replace('Rp ', '')}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          ${allDihilangkanItems.length > 0 ? `
            <!-- Section 3: Daftar Item yang Dihilangkan -->
            <div style="margin-top: 8pt; page-break-inside: avoid;">
              <div style="font-size: 8pt; font-weight: bold; margin-bottom: 2pt; color: #991b1b;">
                IV. DAFTAR BELANJA YANG DIHILANGKAN DARI ANGGARAN (TOTAL: ${formatRp(totalDihilangkanNilai)})
              </div>
              <table class="rekap-table">
                <thead>
                  <tr style="background-color: #fee2e2;">
                    <th style="width: 20pt;">No</th>
                    <th style="width: 50pt;">Bulan</th>
                    <th style="width: 70pt;">Kode Rekening</th>
                    <th>Uraian Belanja Semula</th>
                    <th style="width: 75pt;">Anggaran Semula</th>
                    <th>Alasan Penghilangan</th>
                  </tr>
                </thead>
                <tbody>
                  ${allDihilangkanItems.map((x, idx) => `
                    <tr>
                      <td style="text-align: center;">${idx + 1}</td>
                      <td style="font-weight: bold; text-align: center;">${x.bulan}</td>
                      <td style="font-family: monospace; font-size: 6.5pt;">${x.item.kodeRekening}</td>
                      <td style="font-size: 7pt; font-weight: 600;">${x.item.uraian}</td>
                      <td style="text-align: right; font-family: monospace; font-weight: bold; color: #991b1b;">${formatRp(x.item.semulaJumlah)}</td>
                      <td style="font-size: 6.5pt; color: #4b5563;">${x.item.alasanPerubahan || 'Dihilangkan / dibatalkan'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          <!-- Signatures -->
          <div class="grid-signatures" style="margin-top: 14pt;">
            <div class="sig-col">
              <div>Mengetahui / Menyetujui,</div>
              <div class="font-bold">Kepala Sekolah</div>
              <div class="sig-space" style="height: 35pt;"></div>
              <div class="sig-name">${school.kepsekNama}</div>
              <div>NIP. ${school.kepsekNip}</div>
            </div>
            <div class="sig-col"></div>
            <div class="sig-col">
              <div>Sentani, 31 Desember 2026</div>
              <div class="font-bold">Bendahara BOSP</div>
              <div class="sig-space" style="height: 35pt;"></div>
              <div class="sig-name">${school.bendaharaNama}</div>
              <div>NIP. ${school.bendaharaNip}</div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Triggers browser print for Rekapitulasi ARKAS Perubahan
 */
export function printRekapPerubahan(
  school: SchoolProfile,
  worksheets: ArkasPerubahanMonthWorksheet[],
  murniWorksheets: MonthWorksheet[]
): void {
  const htmlContent = buildRekapPerubahanPrintHtml(school, worksheets, murniWorksheets);
  const printDocTitle = `REKAPITULASI_ARKAS_PERUBAHAN_${school.tahunAnggaran}`;

  try {
    const existingIframe = document.getElementById('rekap-perubahan-print-frame');
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'rekap-perubahan-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.zIndex = '-999';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      const originalTitle = document.title;
      document.title = printDocTitle;

      const triggerPrint = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          window.print();
        } finally {
          setTimeout(() => {
            document.title = originalTitle;
            iframe.remove();
          }, 1000);
        }
      };

      if (iframe.contentWindow) {
        iframe.contentWindow.onload = () => {
          setTimeout(triggerPrint, 250);
        };
        setTimeout(triggerPrint, 500);
      } else {
        window.print();
        document.title = originalTitle;
      }
    } else {
      window.print();
    }
  } catch (err) {
    console.error('Rekap Perubahan print fallback to window.print():', err);
    window.print();
  }
}

