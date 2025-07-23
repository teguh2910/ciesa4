import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format currency with Indonesian Rupiah format
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Sleep function for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Validate Indonesian date format (YYYY-MM-DD)
 */
export function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Format date to Indonesian format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Validate Indonesian customs codes
 */
export function validateCustomsCode(code: string, type: 'hs' | 'country' | 'port'): boolean {
  switch (type) {
    case 'hs':
      // HS Code should be 8-10 digits
      return /^\d{8,10}$/.test(code);
    case 'country':
      // Country code should be 2 letters
      return /^[A-Z]{2}$/.test(code);
    case 'port':
      // Port code should be 5 characters
      return /^[A-Z]{5}$/.test(code);
    default:
      return false;
  }
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

/**
 * Convert camelCase to Title Case
 */
export function camelToTitle(camelCase: string): string {
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Validate required fields in an object
 */
export function validateRequiredFields(obj: any, requiredFields: string[]): string[] {
  const missingFields: string[] = [];

  requiredFields.forEach(field => {
    if (!obj[field] || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
      missingFields.push(field);
    }
  });

  return missingFields;
}

// BC20 Schema field descriptions and metadata
export interface FieldMetadata {
  description: string;
  message?: string;
  examples?: any[];
  enum?: string[];
  const?: string;
  maxlength?: number;
  multipleOf?: number;
  format?: string;
  pattern?: string;
}

// Field descriptions from bc20-schema-enhanced.json
export const BC20_FIELD_METADATA: Record<string, FieldMetadata> = {
  // Main data fields
  asalData: {
    description: "Asal pengiriman data secara Host to Host. Selalu gunakan nilai 'S'",
    message: "Asal pengiriman data secara Host to Host: S",
    const: "S",
    examples: ["S"]
  },
  asuransi: {
    description: "Nilai asuransi yang dibayarkan untuk pengiriman barang. Sesuai kolom formulir BC 2.0 - D.24 Asuransi LN/DN",
    message: "Nilai asuransi maksimal 24 digit dengan dua angka dibelakang koma",
    maxlength: 24,
    multipleOf: 0.01,
    examples: [1500.00, 2750.50]
  },
  bruto: {
    description: "Berat kotor barang dalam kilogram (kg). Sesuai kolom formulir BC 2.0 - D.29 Berat Kotor (kg)",
    message: "Nilai bruto maksimal 24 digit dengan empat angka dibelakang koma",
    maxlength: 24,
    multipleOf: 0.0001,
    examples: [1000.5000, 2500.7500]
  },
  cif: {
    description: "Cost, Insurance, and Freight - Nilai pabean barang impor. Sesuai kolom formulir BC 2.0 - D.26 Nilai Pabean",
    message: "Nilai cif maksimal 24 digit dengan dua angka dibelakang koma",
    maxlength: 24,
    multipleOf: 0.01,
    examples: [5000.00, 12500.75]
  },
  disclaimer: {
    description: "Persetujuan pengguna dalam kirim dokumen pabean: '1' untuk Ya atau '0' untuk Tidak",
    message: "Persetujuan pengguna dalam kirim dokumen pabean: 1 untuk Ya atau 0 untuk Tidak",
    enum: ["0", "1"],
    examples: ["1"]
  },
  kodeJenisImpor: {
    description: "Kode yang menunjukkan jenis impor yang dilakukan. Lihat Referensi Jenis Impor",
    message: "Format kode sesuai Referensi Jenis Impor",
    examples: ["1", "2", "3"]
  },
  flagVd: {
    description: "Flag Voluntary Declaration: 'Y' jika ada voluntary declaration atau 'T' jika tidak ada",
    message: "Flag Voluntary Declaration: Y untuk Ya atau T untuk Tidak",
    enum: ["Y", "T"],
    examples: ["Y", "T"]
  },
  fob: {
    description: "Free On Board - Nilai barang tidak termasuk biaya pengiriman dan asuransi. Sesuai kolom formulir BC 2.0 - D.23 Nilai",
    message: "Nilai fob maksimal 24 digit dengan dua angka dibelakang koma",
    maxlength: 24,
    multipleOf: 0.01,
    examples: [4500.00, 10000.50]
  },
  freight: {
    description: "Biaya pengangkutan/pengiriman barang. Sesuai kolom formulir BC 2.0 - D.25 Freight",
    message: "Nilai freight maksimal 24 digit dengan dua angka dibelakang koma",
    maxlength: 24,
    multipleOf: 0.01,
    examples: [500.00, 1500.25]
  },
  jabatanTtd: {
    description: "Jabatan pengguna yang menandatangani dokumen impor. Sesuai kolom formulir BC 2.0 - F Jabatan pengguna yang mengajukan dokumen impor",
    message: "Jabatan pengguna yang mengajukan dokumen impor",
    examples: ["Direktur", "Manager Impor", "Kepala Bagian Logistik"]
  },
  jumlahKontainer: {
    description: "Jumlah peti kemas/kontainer yang digunakan untuk mengangkut barang",
    message: "Jumlah kontainer atau peti kemas",
    examples: [1, 5, 10]
  },
  kodeCaraBayar: {
    description: "Kode yang menunjukkan cara pembayaran yang digunakan. Sesuai kolom formulir BC 2.0 - C. Cara Pembayaran. Lihat Referensi Cara Bayar",
    message: "Format kode sesuai Referensi Cara Bayar",
    examples: ["1", "2", "3"]
  },
  kodeKantor: {
    description: "Kode kantor pabean tempat pengajuan dokumen. Sesuai kolom formulir BC 2.0 - Kantor Pabean. Lihat Referensi Kantor",
    message: "Format kode sesuai Referensi Kantor",
    examples: ["040100", "050100"]
  },
  kodePelMuat: {
    description: "Kode pelabuhan tempat barang dimuat. Sesuai kolom formulir BC 2.0 - D.12 Pelabuhan Muat. Lihat Referensi Pelabuhan",
    message: "Format kode pelabuhan muat sesuai Referensi Pelabuhan",
    examples: ["IDTPP", "SGSIN"]
  },
  kodePelTujuan: {
    description: "Kode pelabuhan tujuan pengiriman barang. Sesuai kolom formulir BC 2.0 - D.14 Pelabuhan Tujuan. Lihat Referensi Pelabuhan",
    message: "Format kode pelabuhan tujuan sesuai Referensi Pelabuhan",
    examples: ["IDJKT", "IDBLW"]
  },
  kodeTps: {
    description: "Kode Tempat Penimbunan Sementara. Sesuai kolom formulir BC 2.0 - D.20 Tempat Penimbunan. Kode tps sesuai dengan yang dibuat oleh Kantor Pabean masing-masing",
    message: "Format kode tps sesuai dengan yang dibuat oleh Kantor Pabean masing-masing",
    examples: ["TPSJKT01", "TPSBLW02"]
  },
  kodeTutupPu: {
    description: "Kode dokumen yang digunakan untuk menutup Pemberitahuan Umum (PU). Referensi TutupPu: '11' untuk BC 1.1, '12' untuk BC 1.2, '14' untuk BC 1.4",
    message: "Format kode sesuai Referensi TutupPu",
    enum: ["11", "12", "14"],
    examples: ["11", "12", "14"]
  },
  kodeValuta: {
    description: "Kode mata uang yang digunakan dalam transaksi. Sesuai kolom formulir BC 2.0 - D.21 Valuta. Lihat Referensi Valuta",
    message: "Format kode sesuai Referensi Valuta",
    examples: ["USD", "IDR", "EUR"]
  },
  kotaTtd: {
    description: "Kota tempat dokumen ditandatangani. Sesuai kolom formulir BC 2.0 - F Kota tempat pengguna membuat dokumen impor",
    message: "Kota tempat pengguna membuat dokumen impor",
    examples: ["Jakarta", "Surabaya", "Bandung"]
  },
  namaTtd: {
    description: "Nama lengkap penandatangan dokumen. Sesuai kolom formulir BC 2.0 - F Nama pengguna yang membuat dokumen impor",
    message: "Nama pengguna yang membuat dokumen impor",
    examples: ["John Doe", "Budi Santoso"]
  },
  ndpbm: {
    description: "Nilai Dasar Penghitungan Bea Masuk - kurs yang digunakan untuk menghitung bea masuk. Sesuai kolom formulir BC 2.0 - D.22 NDPBM",
    message: "Ndpbm maksimal 24 digit dengan empat angka dibelakang koma",
    maxlength: 24,
    multipleOf: 0.0001,
    examples: [15500.0000, 14250.7500]
  },
  netto: {
    description: "Berat bersih barang dalam kilogram (kg). Sesuai kolom formulir BC 2.0 - D.30 Berat Bersih (Kg)",
    message: "Nilai netto/berat bersih maksimal 24 digit dengan empat angka dibelakang koma",
    maxlength: 24,
    multipleOf: 0.0001,
    examples: [950.5000, 2400.7500]
  },
  nomorAju: {
    description: "Nomor pengajuan dokumen pabean yang terdiri dari 26 digit: 4 digit kode kantor, 2 digit kode dokumen pabean, 6 digit unik perusahaan, 8 digit tanggal pengajuan (YYYYMMDD), 6 digit nomor urut pengajuan",
    message: "Sesuaikan format nomor pengajuan dokumen impor terdiri 26 digit: 4 digit kode kantor, 2 digit kode dokumen pabean, 6 digit unik perusahaan, 8 digit tanggal pengajuan dengan format YYYYMMDD, 6 digit sequence/nomor urut pengajuan dokumen impor",
    pattern: "^[A-Za-z0-9]{26}$",
    examples: ["0401002012345202307010001", "0501002054321202307020002"]
  },
  tanggalTiba: {
    description: "Perkiraan tanggal kedatangan barang. Sesuai kolom formulir BC 2.0 - D.11 Perkiraan Tanggal Tiba dalam format YYYY-MM-DD",
    message: "Sesuaikan format tanggal perkiraan tiba: YYYY-MM-DD",
    format: "date",
    examples: ["2023-07-10", "2023-07-25"]
  },
  tanggalTtd: {
    description: "Tanggal penandatanganan dokumen pabean. Sesuai kolom formulir BC 2.0 - F Tanggal penandatanganan dokumen pabean dalam format YYYY-MM-DD",
    message: "Sesuaikan format tanggal penandatanganan dokumen: YYYY-MM-DD",
    format: "date",
    examples: ["2023-07-01", "2023-07-15"]
  },
  biayaTambahan: {
    description: "Biaya tambahan yang dikenakan selain nilai barang, freight, dan asuransi",
    message: "Biaya tambahan maksimal 24 digit dengan dua angka dibelakang koma",
    maxlength: 24,
    multipleOf: 0.01,
    examples: [200.00, 500.50]
  },
  biayaPengurang: {
    description: "Biaya pengurang yang mengurangi nilai pabean",
    message: "Biaya pengurang maksimal 24 digit dengan dua angka dibelakang koma",
    maxlength: 24,
    multipleOf: 0.01,
    examples: [100.00, 250.50]
  }
};

// Barang (goods) field metadata
export const BARANG_FIELD_METADATA: Record<string, FieldMetadata> = {
  asuransi: {
    description: "Nilai asuransi untuk barang ini",
    examples: [100.00, 250.50]
  },
  cif: {
    description: "Nilai Cost, Insurance, and Freight untuk barang ini",
    examples: [1000.00, 2500.50]
  },
  fob: {
    description: "Nilai Free On Board untuk barang ini",
    examples: [900.00, 2250.50]
  },
  freight: {
    description: "Biaya pengangkutan untuk barang ini",
    examples: [100.00, 250.50]
  },
  hargaSatuan: {
    description: "Harga per satuan barang",
    examples: [10.00, 25.50]
  },
  jumlahKemasan: {
    description: "Jumlah kemasan untuk barang ini. Sesuai kolom formulir BC 2.0 - D.35 Jumlah Kemasan",
    maxlength: 24,
    multipleOf: 0.01,
    examples: [10.00, 25.00]
  },
  jumlahSatuan: {
    description: "Jumlah barang dalam satuan yang ditentukan. Sesuai kolom formulir BC 2.0 - D.35 Jumlah Satuan Barang",
    maxlength: 24,
    multipleOf: 0.0001,
    examples: [100.0000, 250.0000]
  },
  kodeJenisKemasan: {
    description: "Kode jenis kemasan yang digunakan. Sesuai kolom formulir BC 2.0 - D.35 Jenis Kemasan. Lihat Referensi Jenis Kemasan",
    examples: ["BX", "CT", "PK"]
  },
  kodeSatuanBarang: {
    description: "Kode satuan barang yang digunakan. Sesuai kolom formulir BC 2.0 - D.35 Jenis Satuan Barang. Lihat Referensi Satuan Barang",
    examples: ["PCE", "KGM", "MTR"]
  },
  merk: {
    description: "Merek barang. Sesuai kolom formulir BC 2.0 - D.32 Merek Barang",
    examples: ["Sony", "Samsung", "Apple"]
  },
  posTarif: {
    description: "Pos tarif HS (Harmonized System) barang. Sesuai kolom formulir BC 2.0 - D.32 Pos Tarif HS",
    examples: ["8471.30.10.00", "8517.12.00.00"]
  },
  seriBarang: {
    description: "Nomor urut/seri barang dalam dokumen. Sesuai kolom formulir BC 2.0 - D.31 No. Seri data barang",
    examples: [1, 2, 3]
  },
  tipe: {
    description: "Tipe barang. Sesuai kolom formulir BC 2.0 - D.32 Tipe Barang",
    examples: ["X100", "Galaxy S21", "MacBook Pro"]
  },
  uraian: {
    description: "Uraian/deskripsi barang. Sesuai kolom formulir BC 2.0 - D.32 Uraian Barang",
    examples: ["Laptop 14 inch Core i7", "Smartphone 6.2 inch 8GB RAM"]
  }
};

// Entitas field metadata
export const ENTITAS_FIELD_METADATA: Record<string, FieldMetadata> = {
  alamatEntitas: {
    description: "Alamat lengkap entitas",
    examples: ["Jl. Sudirman No. 123, Jakarta Pusat", "Jl. Gatot Subroto Kav. 56, Jakarta Selatan"]
  },
  kodeEntitas: {
    description: "Kode jenis entitas",
    examples: ["1", "4", "7", "9", "10", "11"]
  },
  namaEntitas: {
    description: "Nama lengkap entitas",
    examples: ["PT. Importir Jaya", "CV. Maju Bersama", "John Doe"]
  },
  nomorIdentitas: {
    description: "Nomor identitas entitas (NPWP, KTP, Paspor, dll)",
    examples: ["01.234.567.8-123.000", "3201012345678901"]
  },
  seriEntitas: {
    description: "Nomor urut/seri entitas dalam dokumen",
    examples: [1, 2, 3]
  }
};

// Kemasan field metadata
export const KEMASAN_FIELD_METADATA: Record<string, FieldMetadata> = {
  jumlahKemasan: {
    description: "Jumlah kemasan",
    examples: [10, 25, 50]
  },
  kodeJenisKemasan: {
    description: "Kode jenis kemasan",
    examples: ["BX", "CT", "PK"]
  },
  merkKemasan: {
    description: "Merek kemasan",
    examples: ["Sony", "Samsung", "Apple"]
  },
  seriKemasan: {
    description: "Nomor urut/seri kemasan dalam dokumen",
    examples: [1, 2, 3]
  }
};

// Dokumen field metadata
export const DOKUMEN_FIELD_METADATA: Record<string, FieldMetadata> = {
  kodeDokumen: {
    description: "Kode dokumen pelengkap",
    examples: ["380", "705", "740"]
  },
  nomorDokumen: {
    description: "Nomor dokumen pelengkap",
    examples: ["INV-001/2023", "BL-002/2023"]
  },
  seriDokumen: {
    description: "Nomor urut/seri dokumen pelengkap dalam dokumen pabean",
    examples: [1, 2, 3]
  },
  tanggalDokumen: {
    description: "Tanggal dokumen pelengkap dalam format YYYY-MM-DD",
    format: "date",
    examples: ["2023-06-15", "2023-06-30"]
  }
};

// Pengangkut field metadata
export const PENGANGKUT_FIELD_METADATA: Record<string, FieldMetadata> = {
  kodeBendera: {
    description: "Kode bendera kapal/pesawat",
    examples: ["ID", "SG", "MY"]
  },
  namaPengangkut: {
    description: "Nama sarana pengangkut",
    examples: ["MV. MERATUS", "GARUDA INDONESIA"]
  },
  nomorPengangkut: {
    description: "Nomor voyage/flight",
    examples: ["VOY-001", "GA-123"]
  },
  kodeCaraAngkut: {
    description: "Kode cara pengangkutan",
    examples: ["1", "4"]
  },
  seriPengangkut: {
    description: "Nomor urut/seri pengangkut dalam dokumen",
    examples: [1, 2, 3]
  }
};

// Helper function to get field metadata
export function getFieldMetadata(fieldName: string, context: 'main' | 'barang' | 'entitas' | 'kemasan' | 'dokumen' | 'pengangkut' = 'main'): FieldMetadata | null {
  switch (context) {
    case 'main':
      return BC20_FIELD_METADATA[fieldName] || null;
    case 'barang':
      return BARANG_FIELD_METADATA[fieldName] || null;
    case 'entitas':
      return ENTITAS_FIELD_METADATA[fieldName] || null;
    case 'kemasan':
      return KEMASAN_FIELD_METADATA[fieldName] || null;
    case 'dokumen':
      return DOKUMEN_FIELD_METADATA[fieldName] || null;
    case 'pengangkut':
      return PENGANGKUT_FIELD_METADATA[fieldName] || null;
    default:
      return null;
  }
}
