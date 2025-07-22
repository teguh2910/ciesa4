package services

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/xuri/excelize/v2"

	"json-response-generator/internal/models"
)

// ExcelHandler service for handling Excel file operations
type ExcelHandler struct {
	requiredSheets map[string][]string
}

// NewExcelHandler creates a new ExcelHandler instance
func NewExcelHandler() *ExcelHandler {
	return &ExcelHandler{
		requiredSheets: map[string][]string{
			"MainData":   getMainDataColumns(),
			"Barang":     getBarangColumns(),
			"Entitas":    getEntitasColumns(),
			"Kemasan":    getKemasanColumns(),
			"Kontainer":  getKontainerColumns(),
			"Dokumen":    getDokumenColumns(),
			"Pengangkut": getPengangkutColumns(),
		},
	}
}

// ParseExcelFile parses an Excel file and returns structured data
func (eh *ExcelHandler) ParseExcelFile(filePath string) (*models.ExcelData, error) {
	f, err := excelize.OpenFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open Excel file: %w", err)
	}
	defer f.Close()

	// Get all sheet names
	sheetNames := f.GetSheetList()

	// Validate required sheets
	missingSheets := []string{}
	for sheetName := range eh.requiredSheets {
		found := false
		for _, name := range sheetNames {
			if name == sheetName {
				found = true
				break
			}
		}
		if !found {
			missingSheets = append(missingSheets, sheetName)
		}
	}

	if len(missingSheets) > 0 {
		return nil, fmt.Errorf("missing required sheets: %v", missingSheets)
	}

	// Parse each sheet
	excelData := &models.ExcelData{}

	for sheetName := range eh.requiredSheets {
		data, err := eh.parseSheet(f, sheetName)
		if err != nil {
			return nil, fmt.Errorf("failed to parse sheet %s: %w", sheetName, err)
		}

		switch sheetName {
		case "MainData":
			excelData.MainData = data
		case "Barang":
			if dataArray, ok := data.([]interface{}); ok {
				excelData.Barang = dataArray
			}
		case "Entitas":
			if dataArray, ok := data.([]interface{}); ok {
				excelData.Entitas = dataArray
			}
		case "Kemasan":
			if dataArray, ok := data.([]interface{}); ok {
				excelData.Kemasan = dataArray
			}
		case "Kontainer":
			if dataArray, ok := data.([]interface{}); ok {
				excelData.Kontainer = dataArray
			}
		case "Dokumen":
			if dataArray, ok := data.([]interface{}); ok {
				excelData.Dokumen = dataArray
			}
		case "Pengangkut":
			if dataArray, ok := data.([]interface{}); ok {
				excelData.Pengangkut = dataArray
			}
		}
	}

	return excelData, nil
}

// parseSheet parses individual sheet data
func (eh *ExcelHandler) parseSheet(f *excelize.File, sheetName string) (interface{}, error) {
	rows, err := f.GetRows(sheetName)
	if err != nil {
		return nil, fmt.Errorf("failed to get rows from sheet %s: %w", sheetName, err)
	}

	if len(rows) == 0 {
		return nil, fmt.Errorf("sheet %s is empty", sheetName)
	}

	// First row should contain headers
	if len(rows) < 2 {
		return nil, fmt.Errorf("sheet %s should contain at least header and one data row", sheetName)
	}

	headers := rows[0]
	dataRows := rows[1:]

	// Remove empty rows
	var validRows [][]string
	for _, row := range dataRows {
		if !isEmptyRow(row) {
			validRows = append(validRows, row)
		}
	}

	if len(validRows) == 0 {
		return nil, fmt.Errorf("sheet %s contains no valid data rows", sheetName)
	}

	if sheetName == "MainData" {
		// Main data should have only one row
		if len(validRows) != 1 {
			return nil, fmt.Errorf("MainData sheet should contain exactly one data row, found %d", len(validRows))
		}
		return eh.rowToMap(headers, validRows[0]), nil
	} else {
		// Other sheets can have multiple rows
		var result []interface{}
		for _, row := range validRows {
			result = append(result, eh.rowToMap(headers, row))
		}
		return result, nil
	}
}

// rowToMap converts a row to a map using headers as keys
func (eh *ExcelHandler) rowToMap(headers []string, row []string) map[string]interface{} {
	result := make(map[string]interface{})

	for i, header := range headers {
		var value interface{}
		if i < len(row) && row[i] != "" {
			// Try to parse as number first
			if floatVal, err := strconv.ParseFloat(row[i], 64); err == nil {
				// Check if it's an integer
				if floatVal == float64(int64(floatVal)) {
					value = int64(floatVal)
				} else {
					value = floatVal
				}
			} else {
				// Keep as string
				value = row[i]
			}
		} else {
			// Empty cell
			value = ""
		}
		result[header] = value
	}

	return result
}

// isEmptyRow checks if a row is empty
func isEmptyRow(row []string) bool {
	for _, cell := range row {
		if cell != "" {
			return false
		}
	}
	return true
}

// GenerateTemplate generates an Excel template file
func (eh *ExcelHandler) GenerateTemplate() (string, error) {
	f := excelize.NewFile()
	defer f.Close()

	// Remove default sheet
	f.DeleteSheet("Sheet1")

	// Create sheets with headers and sample data
	for sheetName, columns := range eh.requiredSheets {
		index, err := f.NewSheet(sheetName)
		if err != nil {
			return "", fmt.Errorf("failed to create sheet %s: %w", sheetName, err)
		}

		// Add headers
		for i, column := range columns {
			cell := fmt.Sprintf("%s1", getColumnName(i))
			f.SetCellValue(sheetName, cell, column)
		}

		// Add sample data
		sampleData := eh.getSampleData(sheetName)
		if sampleData != nil {
			if sheetName == "MainData" {
				// Single row for main data
				if mainData, ok := sampleData.(map[string]interface{}); ok {
					for i, column := range columns {
						cell := fmt.Sprintf("%s2", getColumnName(i))
						if value, exists := mainData[column]; exists {
							f.SetCellValue(sheetName, cell, value)
						}
					}
				}
			} else {
				// Multiple rows for other sheets
				if arrayData, ok := sampleData.([]map[string]interface{}); ok {
					for rowIdx, rowData := range arrayData {
						for i, column := range columns {
							cell := fmt.Sprintf("%s%d", getColumnName(i), rowIdx+2)
							if value, exists := rowData[column]; exists {
								f.SetCellValue(sheetName, cell, value)
							}
						}
					}
				}
			}
		}

		// Set as active sheet if it's the first one
		if index == 0 {
			f.SetActiveSheet(index)
		}
	}

	// Create temporary file
	tempDir := os.TempDir()
	fileName := fmt.Sprintf("customs_data_template_%s.xlsx", time.Now().Format("20060102"))
	filePath := filepath.Join(tempDir, fileName)

	if err := f.SaveAs(filePath); err != nil {
		return "", fmt.Errorf("failed to save template file: %w", err)
	}

	return filePath, nil
}

// getColumnName converts column index to Excel column name (A, B, C, ...)
func getColumnName(index int) string {
	result := ""
	for index >= 0 {
		result = string(rune('A'+index%26)) + result
		index = index/26 - 1
	}
	return result
}

// getSampleData returns sample data for each sheet
func (eh *ExcelHandler) getSampleData(sheetName string) interface{} {
	switch sheetName {
	case "MainData":
		return map[string]interface{}{
			"asalData":            "S",
			"disclaimer":          "1",
			"flagVd":              "Y",
			"idPengguna":          "SAMPLE_USER",
			"cif":                 1000000.0,
			"bruto":               100.0,
			"netto":               95.0,
			"ndpbm":               15000.0,
			"vd":                  100.0,
			"nomorAju":            "SAMPLE123456789",
			"nomorBc11":           "000001",
			"tanggalAju":          "2021-12-25",
			"tanggalBc11":         "2021-12-25",
			"tanggalTiba":         "2021-12-25",
			"tanggalTtd":          "2021-12-25",
			"namaTtd":             "Sample User",
			"jabatanTtd":          "Manager",
			"kotaTtd":             "Jakarta",
			"asuransi":            50000.0,
			"biayaPengurang":      0.0,
			"biayaTambahan":       0.0,
			"fob":                 950000.0,
			"freight":             50000.0,
			"hargaPenyerahan":     1000000.0,
			"jumlahTandaPengaman": 1,
			"nilaiBarang":         1000000.0,
			"nilaiIncoterm":       1000000.0,
			"nilaiMaklon":         0.0,
			"seri":                1,
			"totalDanaSawit":      0.0,
			"volume":              10.0,
			"jumlahKontainer":     1,
			"kodeAsuransi":        "LN",
			"kodeCaraBayar":       "2",
			"kodeDokumen":         "20",
			"kodeIncoterm":        "CIF",
			"kodeJenisImpor":      "1",
			"kodeJenisNilai":      "KMD",
			"kodeJenisProsedur":   "1",
			"kodeKantor":          "051000",
			"kodeTutupPu":         "11",
			"kodeValuta":          "CNY",
		}
	case "Barang":
		return []map[string]interface{}{
			{
				"uraian":          "Sample Product",
				"merk":            "Sample Brand",
				"tipe":            "Type A",
				"ukuran":          "10x10x10 cm",
				"spesifikasiLain": "High quality sample product",
				"kodeHs":          "1234567890",
				"cif":             500000.0,
				"hargaPenyerahan": 500000.0,
				"hargaSatuan":     50000.0,
				"jumlahSatuan":    10.0,
				"kodeBarang":      "SMP001",
				"kondisiBarang":   "1",
				"negaraAsal":      "CN",
				"deskripsiLain":   "Sample description",
			},
		}
	case "Entitas":
		return []map[string]interface{}{
			{
				"jenisEntitas":  "1",
				"namaEntitas":   "Sample Importer",
				"alamatEntitas": "Jl. Sample No. 123, Jakarta",
				"negaraEntitas": "ID",
				"kodeEntitas":   "IMP001",
				"statusApi":     "Y",
				"nib":           "1234567890123",
				"keterangan":    "Sample importer entity",
			},
		}
	default:
		return nil
	}
}

// Column definitions for each sheet
func getMainDataColumns() []string {
	return []string{
		"asalData", "disclaimer", "flagVd", "idPengguna", "cif", "bruto", "netto",
		"ndpbm", "vd", "nomorAju", "nomorBc11", "tanggalAju", "tanggalBc11",
		"tanggalTiba", "tanggalTtd", "namaTtd", "jabatanTtd", "kotaTtd",
		"asuransi", "biayaPengurang", "biayaTambahan", "fob", "freight",
		"hargaPenyerahan", "jumlahTandaPengaman", "nilaiBarang", "nilaiIncoterm",
		"nilaiMaklon", "seri", "totalDanaSawit", "volume", "jumlahKontainer",
		"kodeAsuransi", "kodeCaraBayar", "kodeDokumen", "kodeIncoterm",
		"kodeJenisImpor", "kodeJenisNilai", "kodeJenisProsedur", "kodeKantor",
		"kodePelMuat", "kodePelTransit", "kodePelTujuan", "kodeTps",
		"kodeTutupPu", "kodeValuta", "posBc11", "subPosBc11",
	}
}

func getBarangColumns() []string {
	return []string{
		"uraian", "merk", "tipe", "ukuran", "spesifikasiLain", "kodeHs",
		"cif", "hargaPenyerahan", "hargaSatuan", "jumlahSatuan", "kodeBarang",
		"kondisiBarang", "negaraAsal", "deskripsiLain", "bruto", "netto",
		"volume", "jumlahKemasan", "kodeJenisKemasan", "kodeSatuanBarang",
		"posTarif", "seriBarang", "tahunPembuatan", "asuransi", "diskon",
		"fob", "freight", "hargaEkspor", "hargaPatokan", "hargaPerolehan",
		"hjeCukai", "isiPerKemasan", "jumlahBahanBaku", "jumlahDilekatkan",
		"jumlahPitaCukai", "jumlahRealisasi", "kapasitasSilinder",
		"kodeKondisiBarang", "kodeNegaraAsal", "ndpbm", "nilaiBarang",
		"nilaiDanaSawit", "nilaiDevisa", "nilaiTambah", "pernyataanLartas",
		"persentaseImpor", "saldoAkhir", "saldoAwal", "seriBarangDokAsal",
		"seriIjin", "tarifCukai", "cifRupiah",
	}
}

func getEntitasColumns() []string {
	return []string{
		"jenisEntitas", "namaEntitas", "alamatEntitas", "negaraEntitas",
		"kodeEntitas", "statusApi", "nib", "keterangan", "seriEntitas",
		"kodeJenisApi", "kodeJenisIdentitas", "kodeStatus", "nibEntitas",
		"nomorIdentitas", "kodeNegara",
	}
}

func getKemasanColumns() []string {
	return []string{
		"jumlahKemasan", "kodeJenisKemasan", "merkKemasan", "seriKemasan",
	}
}

func getKontainerColumns() []string {
	return []string{
		"kodeJenisKontainer", "kodeTipeKontainer", "kodeUkuranKontainer",
		"nomorKontainer", "seriKontainer",
	}
}

func getDokumenColumns() []string {
	return []string{
		"idDokumen", "kodeDokumen", "kodeFasilitas", "nomorDokumen",
		"seriDokumen", "tanggalDokumen", "namaFasilitas",
	}
}

func getPengangkutColumns() []string {
	return []string{
		"kodeBendera", "namaPengangkut", "nomorPengangkut", "kodeCaraAngkut",
		"seriPengangkut",
	}
}
