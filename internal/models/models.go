package models

import "time"

// BarangDokumen represents document information for goods
type BarangDokumen struct {
	SeriDokumen string `json:"seriDokumen" validate:"required"`
}

// BarangTarif represents tariff information for goods
type BarangTarif struct {
	JumlahSatuan        float64  `json:"jumlahSatuan" validate:"required"`
	KodeFasilitasTarif  string   `json:"kodeFasilitasTarif" validate:"required"`
	KodeJenisPungutan   string   `json:"kodeJenisPungutan" validate:"required"`
	KodeJenisTarif      string   `json:"kodeJenisTarif" validate:"required"`
	NilaiBayar          float64  `json:"nilaiBayar" validate:"required"`
	NilaiFasilitas      float64  `json:"nilaiFasilitas" validate:"required"`
	SeriBarang          int      `json:"seriBarang" validate:"required"`
	Tarif               float64  `json:"tarif" validate:"required"`
	TarifFasilitas      *float64 `json:"tarifFasilitas,omitempty"`
	JumlahKemasan       *int     `json:"jumlahKemasan,omitempty"`
	KodeKemasan         *string  `json:"kodeKemasan,omitempty"`
	KodeKomoditiCukai   *string  `json:"kodeKomoditiCukai,omitempty"`
	KodeSatuanBarang    *string  `json:"kodeSatuanBarang,omitempty"`
	KodeSubKomoditiCukai *string `json:"kodeSubKomoditiCukai,omitempty"`
	NilaiSudahDilunasi  *float64 `json:"nilaiSudahDilunasi,omitempty"`
}

// BarangVd represents VD information for goods
type BarangVd struct {
	JenisTarif     string  `json:"jenisTarif" validate:"required"`
	Tarif          float64 `json:"tarif" validate:"required"`
	NilaiBarang    float64 `json:"nilaiBarang" validate:"required"`
	NilaiBayar     float64 `json:"nilaiBayar" validate:"required"`
	KodeFasilitas  string  `json:"kodeFasilitas" validate:"required"`
	NilaiFasilitas float64 `json:"nilaiFasilitas" validate:"required"`
}

// Barang represents goods information
type Barang struct {
	Asuransi            float64         `json:"asuransi" validate:"required"`
	Bruto               float64         `json:"bruto" validate:"required"`
	Cif                 float64         `json:"cif" validate:"required"`
	CifRupiah           float64         `json:"cifRupiah" validate:"required"`
	Diskon              float64         `json:"diskon" validate:"required"`
	Fob                 float64         `json:"fob" validate:"required"`
	Freight             float64         `json:"freight" validate:"required"`
	HargaEkspor         float64         `json:"hargaEkspor" validate:"required"`
	HargaPatokan        float64         `json:"hargaPatokan" validate:"required"`
	HargaPenyerahan     float64         `json:"hargaPenyerahan" validate:"required"`
	HargaPerolehan      float64         `json:"hargaPerolehan" validate:"required"`
	HargaSatuan         float64         `json:"hargaSatuan" validate:"required"`
	HjeCukai            float64         `json:"hjeCukai" validate:"required"`
	IsiPerKemasan       float64         `json:"isiPerKemasan" validate:"required"`
	JumlahBahanBaku     float64         `json:"jumlahBahanBaku" validate:"required"`
	JumlahDilekatkan    float64         `json:"jumlahDilekatkan" validate:"required"`
	JumlahKemasan       int             `json:"jumlahKemasan" validate:"required"`
	JumlahPitaCukai     int             `json:"jumlahPitaCukai" validate:"required"`
	JumlahRealisasi     float64         `json:"jumlahRealisasi" validate:"required"`
	JumlahSatuan        float64         `json:"jumlahSatuan" validate:"required"`
	KapasitasSilinder   float64         `json:"kapasitasSilinder" validate:"required"`
	KodeJenisKemasan    string          `json:"kodeJenisKemasan" validate:"required"`
	KodeKondisiBarang   string          `json:"kodeKondisiBarang" validate:"required"`
	KodeNegaraAsal      string          `json:"kodeNegaraAsal" validate:"required"`
	KodeSatuanBarang    string          `json:"kodeSatuanBarang" validate:"required"`
	Merk                string          `json:"merk" validate:"required"`
	Ndpbm               float64         `json:"ndpbm" validate:"required"`
	Netto               float64         `json:"netto" validate:"required"`
	NilaiBarang         float64         `json:"nilaiBarang" validate:"required"`
	NilaiDanaSawit      float64         `json:"nilaiDanaSawit" validate:"required"`
	NilaiDevisa         float64         `json:"nilaiDevisa" validate:"required"`
	NilaiTambah         float64         `json:"nilaiTambah" validate:"required"`
	PernyataanLartas    string          `json:"pernyataanLartas" validate:"required"`
	PersentaseImpor     float64         `json:"persentaseImpor" validate:"required"`
	PosTarif            string          `json:"posTarif" validate:"required"`
	SaldoAkhir          float64         `json:"saldoAkhir" validate:"required"`
	SaldoAwal           float64         `json:"saldoAwal" validate:"required"`
	SeriBarang          int             `json:"seriBarang" validate:"required"`
	SeriBarangDokAsal   int             `json:"seriBarangDokAsal" validate:"required"`
	SeriIjin            int             `json:"seriIjin" validate:"required"`
	TahunPembuatan      int             `json:"tahunPembuatan" validate:"required"`
	TarifCukai          float64         `json:"tarifCukai" validate:"required"`
	Tipe                string          `json:"tipe" validate:"required"`
	Uraian              string          `json:"uraian" validate:"required"`
	Volume              float64         `json:"volume" validate:"required"`
	BarangDokumen       []BarangDokumen `json:"barangDokumen"`
	BarangTarif         []BarangTarif   `json:"barangTarif"`
	BarangVd            []BarangVd      `json:"barangVd"`
	BarangSpekKhusus    []interface{}   `json:"barangSpekKhusus"`
	BarangPemilik       []interface{}   `json:"barangPemilik"`
}

// Entitas represents entity information
type Entitas struct {
	AlamatEntitas        string  `json:"alamatEntitas" validate:"required"`
	KodeEntitas          string  `json:"kodeEntitas" validate:"required"`
	NamaEntitas          string  `json:"namaEntitas" validate:"required"`
	SeriEntitas          int     `json:"seriEntitas" validate:"required"`
	KodeJenisApi         *string `json:"kodeJenisApi,omitempty"`
	KodeJenisIdentitas   *string `json:"kodeJenisIdentitas,omitempty"`
	KodeStatus           *string `json:"kodeStatus,omitempty"`
	NibEntitas           *string `json:"nibEntitas,omitempty"`
	NomorIdentitas       *string `json:"nomorIdentitas,omitempty"`
	KodeNegara           *string `json:"kodeNegara,omitempty"`
}

// Kemasan represents packaging information
type Kemasan struct {
	JumlahKemasan     int    `json:"jumlahKemasan" validate:"required"`
	KodeJenisKemasan  string `json:"kodeJenisKemasan" validate:"required"`
	MerkKemasan       string `json:"merkKemasan" validate:"required"`
	SeriKemasan       int    `json:"seriKemasan" validate:"required"`
}

// Kontainer represents container information
type Kontainer struct {
	KodeJenisKontainer  string `json:"kodeJenisKontainer" validate:"required"`
	KodeTipeKontainer   string `json:"kodeTipeKontainer" validate:"required"`
	KodeUkuranKontainer string `json:"kodeUkuranKontainer" validate:"required"`
	NomorKontainer      string `json:"nomorKontainer" validate:"required"`
	SeriKontainer       int    `json:"seriKontainer" validate:"required"`
}

// Dokumen represents document information
type Dokumen struct {
	IdDokumen       string  `json:"idDokumen" validate:"required"`
	KodeDokumen     string  `json:"kodeDokumen" validate:"required"`
	KodeFasilitas   string  `json:"kodeFasilitas" validate:"required"`
	NomorDokumen    string  `json:"nomorDokumen" validate:"required"`
	SeriDokumen     int     `json:"seriDokumen" validate:"required"`
	TanggalDokumen  string  `json:"tanggalDokumen" validate:"required"`
	NamaFasilitas   *string `json:"namaFasilitas,omitempty"`
}

// Pengangkut represents transportation information
type Pengangkut struct {
	KodeBendera     string `json:"kodeBendera" validate:"required"`
	NamaPengangkut  string `json:"namaPengangkut" validate:"required"`
	NomorPengangkut string `json:"nomorPengangkut" validate:"required"`
	KodeCaraAngkut  string `json:"kodeCaraAngkut" validate:"required"`
	SeriPengangkut  int    `json:"seriPengangkut" validate:"required"`
}

// ResponseData represents the main response structure
type ResponseData struct {
	AsalData            string        `json:"asalData" validate:"required"`
	Asuransi            float64       `json:"asuransi" validate:"required"`
	BiayaPengurang      float64       `json:"biayaPengurang" validate:"required"`
	BiayaTambahan       float64       `json:"biayaTambahan" validate:"required"`
	Bruto               float64       `json:"bruto" validate:"required"`
	Cif                 float64       `json:"cif" validate:"required"`
	Disclaimer          string        `json:"disclaimer" validate:"required"`
	FlagVd              string        `json:"flagVd" validate:"required"`
	Fob                 float64       `json:"fob" validate:"required"`
	Freight             float64       `json:"freight" validate:"required"`
	HargaPenyerahan     float64       `json:"hargaPenyerahan" validate:"required"`
	IdPengguna          string        `json:"idPengguna" validate:"required"`
	JabatanTtd          string        `json:"jabatanTtd" validate:"required"`
	JumlahKontainer     int           `json:"jumlahKontainer" validate:"required"`
	JumlahTandaPengaman int           `json:"jumlahTandaPengaman" validate:"required"`
	KodeAsuransi        string        `json:"kodeAsuransi" validate:"required"`
	KodeCaraBayar       string        `json:"kodeCaraBayar" validate:"required"`
	KodeDokumen         string        `json:"kodeDokumen" validate:"required"`
	KodeIncoterm        string        `json:"kodeIncoterm" validate:"required"`
	KodeJenisImpor      string        `json:"kodeJenisImpor" validate:"required"`
	KodeJenisNilai      string        `json:"kodeJenisNilai" validate:"required"`
	KodeJenisProsedur   string        `json:"kodeJenisProsedur" validate:"required"`
	KodeKantor          string        `json:"kodeKantor" validate:"required"`
	KodePelMuat         string        `json:"kodePelMuat" validate:"required"`
	KodePelTransit      string        `json:"kodePelTransit" validate:"required"`
	KodePelTujuan       string        `json:"kodePelTujuan" validate:"required"`
	KodeTps             string        `json:"kodeTps" validate:"required"`
	KodeTutupPu         string        `json:"kodeTutupPu" validate:"required"`
	KodeValuta          string        `json:"kodeValuta" validate:"required"`
	KotaTtd             string        `json:"kotaTtd" validate:"required"`
	NamaTtd             string        `json:"namaTtd" validate:"required"`
	Ndpbm               float64       `json:"ndpbm" validate:"required"`
	Netto               float64       `json:"netto" validate:"required"`
	NilaiBarang         float64       `json:"nilaiBarang" validate:"required"`
	NilaiIncoterm       float64       `json:"nilaiIncoterm" validate:"required"`
	NilaiMaklon         float64       `json:"nilaiMaklon" validate:"required"`
	NomorAju            string        `json:"nomorAju" validate:"required"`
	NomorBc11           string        `json:"nomorBc11" validate:"required"`
	PosBc11             string        `json:"posBc11" validate:"required"`
	Seri                int           `json:"seri" validate:"required"`
	SubPosBc11          string        `json:"subPosBc11" validate:"required"`
	TanggalAju          string        `json:"tanggalAju" validate:"required"`
	TanggalBc11         string        `json:"tanggalBc11" validate:"required"`
	TanggalTiba         string        `json:"tanggalTiba" validate:"required"`
	TanggalTtd          string        `json:"tanggalTtd" validate:"required"`
	TotalDanaSawit      float64       `json:"totalDanaSawit" validate:"required"`
	Volume              float64       `json:"volume" validate:"required"`
	Vd                  float64       `json:"vd" validate:"required"`
	Barang              []Barang      `json:"barang"`
	Entitas             []Entitas     `json:"entitas"`
	Kemasan             []Kemasan     `json:"kemasan"`
	Kontainer           []Kontainer   `json:"kontainer"`
	Dokumen             []Dokumen     `json:"dokumen"`
	Pengangkut          []Pengangkut  `json:"pengangkut"`
}

// API Response structures
type ApiResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Message string      `json:"message,omitempty"`
	Details interface{} `json:"details,omitempty"`
}

type HealthResponse struct {
	Status    string    `json:"status"`
	Service   string    `json:"service"`
	Version   string    `json:"version"`
	Timestamp time.Time `json:"timestamp"`
}

// Excel data structures
type ExcelData struct {
	MainData   interface{}   `json:"MainData,omitempty"`
	Barang     []interface{} `json:"Barang,omitempty"`
	Entitas    []interface{} `json:"Entitas,omitempty"`
	Kemasan    []interface{} `json:"Kemasan,omitempty"`
	Kontainer  []interface{} `json:"Kontainer,omitempty"`
	Dokumen    []interface{} `json:"Dokumen,omitempty"`
	Pengangkut []interface{} `json:"Pengangkut,omitempty"`
}

// API configuration
type ApiConfig struct {
	Endpoint string `json:"endpoint"`
	APIKey   string `json:"api_key,omitempty"`
	Username string `json:"username,omitempty"`
	Password string `json:"password,omitempty"`
	Timeout  int    `json:"timeout"`
}

// Request structures
type GenerateJsonRequest struct {
	Data interface{} `json:"data" validate:"required"`
}

type SendToApiRequest struct {
	JsonData  ResponseData `json:"json_data" validate:"required"`
	ApiConfig *ApiConfig  `json:"api_config,omitempty"`
	DryRun    bool         `json:"dry_run"`
}

type TestConnectionRequest struct {
	Endpoint string `json:"endpoint,omitempty"`
}
