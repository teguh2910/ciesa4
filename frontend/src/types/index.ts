// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: string[];
}

// OAuth 2.0 Types
export interface OAuthTokenInfo {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  token_type: string;
  scope: string;
}

export interface OAuthConfig {
  token_url: string;
  refresh_url: string;
  username: string;
  password: string;
  has_password?: boolean;
}

export interface OAuthLoginRequest {
  username: string;
  password: string;
}

export interface OAuthStatus {
  authenticated: boolean;
  expires_at?: string;
  token_type?: string;
  scope?: string;
  time_left?: number;
  message?: string;
}

// Configuration Types
export interface ApiConfig {
  endpoint: string;
  api_key?: string;
  username?: string;
  password?: string;
  timeout?: number;
  auth_type?: 'none' | 'api_key' | 'basic' | 'oauth2';
  oauth2_config?: OAuthConfig;
  token_info?: OAuthTokenInfo;
}

export interface AppConfig {
  api_endpoint: string;
  api_timeout: number;
  has_api_key: boolean;
  has_username: boolean;
  has_password: boolean;
  max_file_size: number;
}

// Main Data Types
export interface MainData {
  asalData: string;
  asuransi: number;
  biayaPengurang: number;
  biayaTambahan: number;
  bruto: number;
  cif: number;
  disclaimer: string;
  flagVd: string;
  fob: number;
  freight: number;
  hargaPenyerahan: number;
  idPengguna: string;
  jabatanTtd: string;
  jumlahKontainer: number;
  jumlahTandaPengaman: number;
  kodeAsuransi: string;
  kodeCaraBayar: string;
  kodeDokumen: string;
  kodeIncoterm: string;
  kodeJenisImpor: string;
  kodeJenisNilai: string;
  kodeJenisProsedur: string;
  kodeKantor: string;
  kodePelMuat: string;
  kodePelTransit: string;
  kodePelTujuan: string;
  kodeTps: string;
  kodeTutupPu: string;
  kodeValuta: string;
  kotaTtd: string;
  namaTtd: string;
  ndpbm: number;
  netto: number;
  nilaiBarang: number;
  nilaiIncoterm: number;
  nilaiMaklon: number;
  nomorAju: string;
  nomorBc11: string;
  posBc11: string;
  seri: number;
  subPosBc11: string;
  tanggalAju: string;
  tanggalBc11: string;
  tanggalTiba: string;
  tanggalTtd: string;
  totalDanaSawit: number;
  volume: number;
  vd: number;
}

// Barang Types
export interface BarangTarif {
  jumlahSatuan: number;
  kodeFasilitasTarif: string;
  kodeJenisPungutan: string;
  kodeJenisTarif: string;
  nilaiBayar: number;
  nilaiFasilitas: number;
  seriBarang: number;
  tarif: number;
  tarifFasilitas?: number;
  jumlahKemasan?: number;
  kodeKemasan?: string;
  kodeKomoditiCukai?: string;
  kodeSatuanBarang?: string;
  kodeSubKomoditiCukai?: string;
  nilaiSudahDilunasi?: number;
}

export interface BarangVd {
  kodeJenisVd: string;
  nilaiBarangVd: number;
}

export interface BarangDokumen {
  seriDokumen: string;
}

export interface Barang {
  seriBarang: number;
  asuransi: number;
  bruto: number;
  cif: number;
  cifRupiah: number;
  diskon: number;
  fob: number;
  freight: number;
  hargaEkspor: number;
  hargaPatokan: number;
  hargaPenyerahan: number;
  hargaPerolehan: number;
  hargaSatuan: number;
  hjeCukai: number;
  isiPerKemasan: number;
  jumlahBahanBaku: number;
  jumlahDilekatkan: number;
  jumlahKemasan: number;
  jumlahPitaCukai: number;
  jumlahRealisasi: number;
  jumlahSatuan: number;
  kapasitasSilinder: number;
  kodeJenisKemasan: string;
  kodeKondisiBarang: string;
  kodeNegaraAsal: string;
  kodeSatuanBarang: string;
  merk: string;
  ndpbm: number;
  netto: number;
  nilaiBarang: number;
  nilaiDanaSawit: number;
  nilaiDevisa: number;
  nilaiTambah: number;
  pernyataanLartas: string;
  persentaseImpor: number;
  posTarif: string;
  saldoAkhir: number;
  saldoAwal: number;
  seriBarangDokAsal: number;
  seriIjin: number;
  tahunPembuatan: number;
  tarifCukai: number;
  tipe: string;
  uraian: string;
  volume: number;
  barangDokumen: BarangDokumen[];
  barangTarif: BarangTarif[];
  barangVd: BarangVd[];
  barangSpekKhusus: any[];
  barangPemilik: any[];
}

// Other Entity Types
export interface Entitas {
  seriEntitas: number;
  alamatEntitas: string;
  kodeEntitas: string;
  namaEntitas: string;
  kodeJenisApi?: string;
  kodeJenisIdentitas?: string;
  kodeStatus?: string;
  nibEntitas?: string;
  nomorIdentitas?: string;
  kodeNegara?: string;
}

export interface Kemasan {
  seriKemasan: number;
  jumlahKemasan: number;
  kodeJenisKemasan: string;
  merkKemasan: string;
}

export interface Kontainer {
  seriKontainer: number;
  kodeJenisKontainer: string;
  kodeTipeKontainer: string;
  kodeUkuranKontainer: string;
  nomorKontainer: string;
}

export interface Dokumen {
  seriDokumen: number;
  idDokumen: string;
  kodeDokumen: string;
  kodeFasilitas: string;
  nomorDokumen: string;
  tanggalDokumen: string;
  namaFasilitas?: string;
}

export interface Pengangkut {
  seriPengangkut: number;
  kodeBendera: string;
  namaPengangkut: string;
  nomorPengangkut: string;
  kodeCaraAngkut: string;
}

// Complete Response Data
export interface ResponseData {
  // Main data fields
  asalData: string;
  asuransi: number;
  biayaPengurang: number;
  biayaTambahan: number;
  bruto: number;
  cif: number;
  disclaimer: string;
  flagVd: string;
  fob: number;
  freight: number;
  hargaPenyerahan: number;
  idPengguna: string;
  jabatanTtd: string;
  jumlahKontainer: number;
  jumlahTandaPengaman: number;
  kodeAsuransi: string;
  kodeCaraBayar: string;
  kodeDokumen: string;
  kodeIncoterm: string;
  kodeJenisImpor: string;
  kodeJenisNilai: string;
  kodeJenisProsedur: string;
  kodeKantor: string;
  kodePelMuat: string;
  kodePelTransit: string;
  kodePelTujuan: string;
  kodeTps: string;
  kodeTutupPu: string;
  kodeValuta: string;
  kotaTtd: string;
  namaTtd: string;
  ndpbm: number;
  netto: number;
  nilaiBarang: number;
  nilaiIncoterm: number;
  nilaiMaklon: number;
  nomorAju: string;
  nomorBc11: string;
  posBc11: string;
  seri: number;
  subPosBc11: string;
  tanggalAju: string;
  tanggalBc11: string;
  tanggalTiba: string;
  tanggalTtd: string;
  totalDanaSawit: number;
  volume: number;
  vd: number;
  
  // Array fields
  barang: Barang[];
  entitas: Entitas[];
  kemasan: Kemasan[];
  kontainer: Kontainer[];
  dokumen: Dokumen[];
  pengangkut: Pengangkut[];
}

// Excel Data Types
export interface ExcelData {
  MainData?: MainData;
  Barang?: Barang[];
  Entitas?: Entitas[];
  Kemasan?: Kemasan[];
  Kontainer?: Kontainer[];
  Dokumen?: Dokumen[];
  Pengangkut?: Pengangkut[];
}

// Form Step Types
export interface FormStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

// File Upload Types
export interface FileUploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  message?: string;
}
