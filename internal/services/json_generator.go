package services

import (
	"encoding/json"
	"fmt"

	"json-response-generator/internal/models"
)

// JsonGenerator service for generating JSON responses
type JsonGenerator struct {
	defaultDate string
}

// NewJsonGenerator creates a new JsonGenerator instance
func NewJsonGenerator() *JsonGenerator {
	return &JsonGenerator{
		defaultDate: "2021-12-25",
	}
}

// GenerateSampleData generates sample data matching the provided JSON structure
func (jg *JsonGenerator) GenerateSampleData() *models.ResponseData {
	// Create sample barang data
	barangData := []models.Barang{
		jg.createBarang1(),
		jg.createBarang2(),
	}

	// Create sample entitas data
	entitasData := []models.Entitas{
		{
			AlamatEntitas: "JL. RAYA JAKARTA NO. 123",
			KodeEntitas:   "1",
			NamaEntitas:   "PT. SAMPLE IMPORTER",
			SeriEntitas:   1,
		},
		{
			AlamatEntitas: "JL. RAYA SURABAYA NO. 456",
			KodeEntitas:   "2",
			NamaEntitas:   "PT. SAMPLE EXPORTER",
			SeriEntitas:   2,
		},
	}

	// Create sample kemasan data
	kemasanData := []models.Kemasan{
		{
			JumlahKemasan:    10,
			KodeJenisKemasan: "BX",
			MerkKemasan:      "SAMPLE BOX",
			SeriKemasan:      1,
		},
	}

	// Create sample kontainer data
	kontainerData := []models.Kontainer{
		{
			KodeJenisKontainer:  "FCL",
			KodeTipeKontainer:   "DC",
			KodeUkuranKontainer: "20",
			NomorKontainer:      "SAMPLE123456789",
			SeriKontainer:       1,
		},
	}

	// Create sample dokumen data
	dokumenData := []models.Dokumen{
		{
			IdDokumen:      "DOC001",
			KodeDokumen:    "705",
			KodeFasilitas:  "01",
			NomorDokumen:   "SAMPLE/DOC/001",
			SeriDokumen:    1,
			TanggalDokumen: jg.defaultDate,
		},
	}

	// Create sample pengangkut data
	pengangkutData := []models.Pengangkut{
		{
			KodeBendera:     "ID",
			NamaPengangkut:  "SAMPLE SHIPPING LINE",
			NomorPengangkut: "SAMPLE001",
			KodeCaraAngkut:  "1",
			SeriPengangkut:  1,
		},
	}

	// Create main response data
	responseData := &models.ResponseData{
		AsalData:            "S",
		Asuransi:            0,
		BiayaPengurang:      0,
		BiayaTambahan:       0,
		Bruto:               350.71,
		Cif:                 1234567.89,
		Disclaimer:          "1",
		FlagVd:              "Y",
		Fob:                 0,
		Freight:             0,
		HargaPenyerahan:     0,
		IdPengguna:          "ABCDE",
		JabatanTtd:          "MANAGER",
		JumlahKontainer:     1,
		JumlahTandaPengaman: 0,
		KodeAsuransi:        "LN",
		KodeCaraBayar:       "2",
		KodeDokumen:         "20",
		KodeIncoterm:        "CIF",
		KodeJenisImpor:      "1",
		KodeJenisNilai:      "KMD",
		KodeJenisProsedur:   "1",
		KodeKantor:          "051000",
		KodePelMuat:         "CNHSK",
		KodePelTransit:      "CNHSK",
		KodePelTujuan:       "IDJBK",
		KodeTps:             "TPS1",
		KodeTutupPu:         "11",
		KodeValuta:          "CNY",
		KotaTtd:             "JAKARTA",
		NamaTtd:             "AGUS",
		Ndpbm:               1234.56,
		Netto:               342.71,
		NilaiBarang:         0,
		NilaiIncoterm:       0,
		NilaiMaklon:         0,
		NomorAju:            "301017INA9G220220525000025",
		NomorBc11:           "000001",
		PosBc11:             "0001",
		Seri:                1,
		SubPosBc11:          "000001",
		TanggalAju:          jg.defaultDate,
		TanggalBc11:         jg.defaultDate,
		TanggalTiba:         jg.defaultDate,
		TanggalTtd:          jg.defaultDate,
		TotalDanaSawit:      0,
		Volume:              0,
		Vd:                  0,
		Barang:              barangData,
		Entitas:             entitasData,
		Kemasan:             kemasanData,
		Kontainer:           kontainerData,
		Dokumen:             dokumenData,
		Pengangkut:          pengangkutData,
	}

	return responseData
}

// GenerateJsonString generates JSON string from ResponseData object
func (jg *JsonGenerator) GenerateJsonString(data *models.ResponseData) (string, error) {
	if data == nil {
		data = jg.GenerateSampleData()
	}

	jsonBytes, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return "", fmt.Errorf("failed to marshal JSON: %w", err)
	}

	return string(jsonBytes), nil
}

// GenerateFromData generates ResponseData from input data (web forms or Excel)
func (jg *JsonGenerator) GenerateFromData(inputData map[string]interface{}) (*models.ResponseData, error) {
	// Handle different input formats
	if _, exists := inputData["MainData"]; exists {
		// Excel format
		return jg.generateFromExcelData(inputData)
	} else {
		// Web form format
		return jg.generateFromFormData(inputData)
	}
}

// generateFromExcelData generates ResponseData from Excel data format
func (jg *JsonGenerator) generateFromExcelData(excelData map[string]interface{}) (*models.ResponseData, error) {
	// Extract main data
	mainDataInterface, ok := excelData["MainData"]
	if !ok {
		return nil, fmt.Errorf("MainData not found in Excel data")
	}

	mainDataMap, ok := mainDataInterface.(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("MainData is not a valid object")
	}

	// Convert arrays
	barangData := jg.convertToBarangArray(excelData["Barang"])
	entitasData := jg.convertToEntitasArray(excelData["Entitas"])
	kemasanData := jg.convertToKemasanArray(excelData["Kemasan"])
	kontainerData := jg.convertToKontainerArray(excelData["Kontainer"])
	dokumenData := jg.convertToDokumenArray(excelData["Dokumen"])
	pengangkutData := jg.convertToPengangkutArray(excelData["Pengangkut"])

	// Create response data
	responseData := &models.ResponseData{
		Barang:     barangData,
		Entitas:    entitasData,
		Kemasan:    kemasanData,
		Kontainer:  kontainerData,
		Dokumen:    dokumenData,
		Pengangkut: pengangkutData,
	}

	// Map main data fields
	if err := jg.mapMainDataFields(mainDataMap, responseData); err != nil {
		return nil, fmt.Errorf("failed to map main data fields: %w", err)
	}

	return responseData, nil
}

// generateFromFormData generates ResponseData from web form data format
func (jg *JsonGenerator) generateFromFormData(formData map[string]interface{}) (*models.ResponseData, error) {
	// Convert form data to ResponseData
	jsonBytes, err := json.Marshal(formData)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal form data: %w", err)
	}

	var responseData models.ResponseData
	if err := json.Unmarshal(jsonBytes, &responseData); err != nil {
		return nil, fmt.Errorf("failed to unmarshal to ResponseData: %w", err)
	}

	return &responseData, nil
}

// Helper methods for creating sample data
func (jg *JsonGenerator) createBarang1() models.Barang {
	return models.Barang{
		Asuransi:          0,
		Bruto:             175.35,
		Cif:               617283.95,
		CifRupiah:         9259259.25,
		Diskon:            0,
		Fob:               0,
		Freight:           0,
		HargaEkspor:       0,
		HargaPatokan:      0,
		HargaPenyerahan:   0,
		HargaPerolehan:    0,
		HargaSatuan:       61728.395,
		HjeCukai:          0,
		IsiPerKemasan:     1,
		JumlahBahanBaku:   0,
		JumlahDilekatkan:  0,
		JumlahKemasan:     10,
		JumlahPitaCukai:   0,
		JumlahRealisasi:   0,
		JumlahSatuan:      10,
		KapasitasSilinder: 0,
		KodeJenisKemasan:  "BX",
		KodeKondisiBarang: "1",
		KodeNegaraAsal:    "CN",
		KodeSatuanBarang:  "PCE",
		Merk:              "SAMPLE BRAND",
		Ndpbm:             1234.56,
		Netto:             171.35,
		NilaiBarang:       0,
		NilaiDanaSawit:    0,
		NilaiDevisa:       0,
		NilaiTambah:       0,
		PernyataanLartas:  "TIDAK ADA",
		PersentaseImpor:   100,
		PosTarif:          "8471.30.10.00",
		SaldoAkhir:        0,
		SaldoAwal:         0,
		SeriBarang:        1,
		SeriBarangDokAsal: 0,
		SeriIjin:          0,
		TahunPembuatan:    2023,
		TarifCukai:        0,
		Tipe:              "SAMPLE TYPE A",
		Uraian:            "SAMPLE COMPUTER PARTS",
		Volume:            0,
		BarangDokumen:     []models.BarangDokumen{},
		BarangTarif: []models.BarangTarif{
			{
				JumlahSatuan:       10,
				KodeFasilitasTarif: "00",
				KodeJenisPungutan:  "1",
				KodeJenisTarif:     "1",
				NilaiBayar:         61728.395,
				NilaiFasilitas:     0,
				SeriBarang:         1,
				Tarif:              10,
			},
		},
		BarangVd:         []models.BarangVd{},
		BarangSpekKhusus: []interface{}{},
		BarangPemilik:    []interface{}{},
	}
}

// Helper methods for converting Excel data arrays
func (jg *JsonGenerator) convertToBarangArray(data interface{}) []models.Barang {
	if data == nil {
		return []models.Barang{}
	}

	var result []models.Barang
	if items, ok := data.([]interface{}); ok {
		for _, item := range items {
			if itemMap, ok := item.(map[string]interface{}); ok {
				var barang models.Barang
				if jsonBytes, err := json.Marshal(itemMap); err == nil {
					json.Unmarshal(jsonBytes, &barang)
					result = append(result, barang)
				}
			}
		}
	}
	return result
}

func (jg *JsonGenerator) convertToEntitasArray(data interface{}) []models.Entitas {
	if data == nil {
		return []models.Entitas{}
	}

	var result []models.Entitas
	if items, ok := data.([]interface{}); ok {
		for _, item := range items {
			if itemMap, ok := item.(map[string]interface{}); ok {
				var entitas models.Entitas
				if jsonBytes, err := json.Marshal(itemMap); err == nil {
					json.Unmarshal(jsonBytes, &entitas)
					result = append(result, entitas)
				}
			}
		}
	}
	return result
}

func (jg *JsonGenerator) convertToKemasanArray(data interface{}) []models.Kemasan {
	if data == nil {
		return []models.Kemasan{}
	}

	var result []models.Kemasan
	if items, ok := data.([]interface{}); ok {
		for _, item := range items {
			if itemMap, ok := item.(map[string]interface{}); ok {
				var kemasan models.Kemasan
				if jsonBytes, err := json.Marshal(itemMap); err == nil {
					json.Unmarshal(jsonBytes, &kemasan)
					result = append(result, kemasan)
				}
			}
		}
	}
	return result
}

func (jg *JsonGenerator) convertToKontainerArray(data interface{}) []models.Kontainer {
	if data == nil {
		return []models.Kontainer{}
	}

	var result []models.Kontainer
	if items, ok := data.([]interface{}); ok {
		for _, item := range items {
			if itemMap, ok := item.(map[string]interface{}); ok {
				var kontainer models.Kontainer
				if jsonBytes, err := json.Marshal(itemMap); err == nil {
					json.Unmarshal(jsonBytes, &kontainer)
					result = append(result, kontainer)
				}
			}
		}
	}
	return result
}

func (jg *JsonGenerator) convertToDokumenArray(data interface{}) []models.Dokumen {
	if data == nil {
		return []models.Dokumen{}
	}

	var result []models.Dokumen
	if items, ok := data.([]interface{}); ok {
		for _, item := range items {
			if itemMap, ok := item.(map[string]interface{}); ok {
				var dokumen models.Dokumen
				if jsonBytes, err := json.Marshal(itemMap); err == nil {
					json.Unmarshal(jsonBytes, &dokumen)
					result = append(result, dokumen)
				}
			}
		}
	}
	return result
}

func (jg *JsonGenerator) convertToPengangkutArray(data interface{}) []models.Pengangkut {
	if data == nil {
		return []models.Pengangkut{}
	}

	var result []models.Pengangkut
	if items, ok := data.([]interface{}); ok {
		for _, item := range items {
			if itemMap, ok := item.(map[string]interface{}); ok {
				var pengangkut models.Pengangkut
				if jsonBytes, err := json.Marshal(itemMap); err == nil {
					json.Unmarshal(jsonBytes, &pengangkut)
					result = append(result, pengangkut)
				}
			}
		}
	}
	return result
}

// mapMainDataFields maps main data fields from Excel to ResponseData
func (jg *JsonGenerator) mapMainDataFields(mainDataMap map[string]interface{}, responseData *models.ResponseData) error {
	jsonBytes, err := json.Marshal(mainDataMap)
	if err != nil {
		return fmt.Errorf("failed to marshal main data: %w", err)
	}

	// Create a temporary struct to unmarshal main data
	var tempData models.ResponseData
	if err := json.Unmarshal(jsonBytes, &tempData); err != nil {
		return fmt.Errorf("failed to unmarshal main data: %w", err)
	}

	// Copy main data fields (excluding arrays)
	responseData.AsalData = tempData.AsalData
	responseData.Asuransi = tempData.Asuransi
	responseData.BiayaPengurang = tempData.BiayaPengurang
	responseData.BiayaTambahan = tempData.BiayaTambahan
	responseData.Bruto = tempData.Bruto
	responseData.Cif = tempData.Cif
	responseData.Disclaimer = tempData.Disclaimer
	responseData.FlagVd = tempData.FlagVd
	responseData.Fob = tempData.Fob
	responseData.Freight = tempData.Freight
	responseData.HargaPenyerahan = tempData.HargaPenyerahan
	responseData.IdPengguna = tempData.IdPengguna
	responseData.JabatanTtd = tempData.JabatanTtd
	responseData.JumlahKontainer = tempData.JumlahKontainer
	responseData.JumlahTandaPengaman = tempData.JumlahTandaPengaman
	responseData.KodeAsuransi = tempData.KodeAsuransi
	responseData.KodeCaraBayar = tempData.KodeCaraBayar
	responseData.KodeDokumen = tempData.KodeDokumen
	responseData.KodeIncoterm = tempData.KodeIncoterm
	responseData.KodeJenisImpor = tempData.KodeJenisImpor
	responseData.KodeJenisNilai = tempData.KodeJenisNilai
	responseData.KodeJenisProsedur = tempData.KodeJenisProsedur
	responseData.KodeKantor = tempData.KodeKantor
	responseData.KodePelMuat = tempData.KodePelMuat
	responseData.KodePelTransit = tempData.KodePelTransit
	responseData.KodePelTujuan = tempData.KodePelTujuan
	responseData.KodeTps = tempData.KodeTps
	responseData.KodeTutupPu = tempData.KodeTutupPu
	responseData.KodeValuta = tempData.KodeValuta
	responseData.KotaTtd = tempData.KotaTtd
	responseData.NamaTtd = tempData.NamaTtd
	responseData.Ndpbm = tempData.Ndpbm
	responseData.Netto = tempData.Netto
	responseData.NilaiBarang = tempData.NilaiBarang
	responseData.NilaiIncoterm = tempData.NilaiIncoterm
	responseData.NilaiMaklon = tempData.NilaiMaklon
	responseData.NomorAju = tempData.NomorAju
	responseData.NomorBc11 = tempData.NomorBc11
	responseData.PosBc11 = tempData.PosBc11
	responseData.Seri = tempData.Seri
	responseData.SubPosBc11 = tempData.SubPosBc11
	responseData.TanggalAju = tempData.TanggalAju
	responseData.TanggalBc11 = tempData.TanggalBc11
	responseData.TanggalTiba = tempData.TanggalTiba
	responseData.TanggalTtd = tempData.TanggalTtd
	responseData.TotalDanaSawit = tempData.TotalDanaSawit
	responseData.Volume = tempData.Volume
	responseData.Vd = tempData.Vd

	return nil
}

func (jg *JsonGenerator) createBarang2() models.Barang {
	return models.Barang{
		Asuransi:          0,
		Bruto:             175.36,
		Cif:               617283.94,
		CifRupiah:         9259259.1,
		Diskon:            0,
		Fob:               0,
		Freight:           0,
		HargaEkspor:       0,
		HargaPatokan:      0,
		HargaPenyerahan:   0,
		HargaPerolehan:    0,
		HargaSatuan:       61728.394,
		HjeCukai:          0,
		IsiPerKemasan:     1,
		JumlahBahanBaku:   0,
		JumlahDilekatkan:  0,
		JumlahKemasan:     10,
		JumlahPitaCukai:   0,
		JumlahRealisasi:   0,
		JumlahSatuan:      10,
		KapasitasSilinder: 0,
		KodeJenisKemasan:  "BX",
		KodeKondisiBarang: "1",
		KodeNegaraAsal:    "CN",
		KodeSatuanBarang:  "PCE",
		Merk:              "SAMPLE BRAND",
		Ndpbm:             1234.56,
		Netto:             171.36,
		NilaiBarang:       0,
		NilaiDanaSawit:    0,
		NilaiDevisa:       0,
		NilaiTambah:       0,
		PernyataanLartas:  "TIDAK ADA",
		PersentaseImpor:   100,
		PosTarif:          "8471.30.20.00",
		SaldoAkhir:        0,
		SaldoAwal:         0,
		SeriBarang:        2,
		SeriBarangDokAsal: 0,
		SeriIjin:          0,
		TahunPembuatan:    2023,
		TarifCukai:        0,
		Tipe:              "SAMPLE TYPE B",
		Uraian:            "SAMPLE COMPUTER ACCESSORIES",
		Volume:            0,
		BarangDokumen:     []models.BarangDokumen{},
		BarangTarif: []models.BarangTarif{
			{
				JumlahSatuan:       10,
				KodeFasilitasTarif: "00",
				KodeJenisPungutan:  "1",
				KodeJenisTarif:     "1",
				NilaiBayar:         61728.394,
				NilaiFasilitas:     0,
				SeriBarang:         2,
				Tarif:              10,
			},
		},
		BarangVd:         []models.BarangVd{},
		BarangSpekKhusus: []interface{}{},
		BarangPemilik:    []interface{}{},
	}
}
