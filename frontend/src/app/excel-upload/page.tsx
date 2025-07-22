'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Download, FileSpreadsheet, Upload, AlertCircle, CheckCircle, Eye, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { ExcelUploadComponent } from '@/components/upload/ExcelUploadComponent';
import { ExcelDataPreview } from '@/components/upload/ExcelDataPreview';
import { JsonPreviewModal } from '@/components/modals/JsonPreviewModal';
import { useExcelUpload, useJsonGeneration } from '@/hooks/useApi';
import { ExcelData, ResponseData } from '@/types';
import apiClient from '@/lib/api';

export default function ExcelUploadPage() {
  const [uploadedData, setUploadedData] = useState<ExcelData | null>(null);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [generatedJson, setGeneratedJson] = useState('');
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const { execute: uploadExcel, loading: uploading, error: uploadError } = useExcelUpload();
  const { execute: generateJson, loading: generating } = useJsonGeneration();

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await apiClient.healthCheck();
        setApiStatus('online');
      } catch (error) {
        console.warn('API health check failed:', error);
        setApiStatus('offline');
      }
    };

    checkApiStatus();
  }, []);

  const handleFileUpload = async (file: File) => {
    try {
      const result = await uploadExcel(file);
      if (result?.data) {
        setUploadedData(result.data);
        toast.success('Excel file processed successfully!');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error?.message || error?.response?.data?.error || 'Failed to process Excel file';

      if (errorMessage.includes('API client not properly initialized')) {
        toast.error('Application initialization error. Please refresh the page and try again.');
      } else if (errorMessage.includes('Network Error') || errorMessage.includes('ECONNREFUSED')) {
        toast.error('Cannot connect to server. Please ensure the backend is running.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      toast.loading('Downloading template...', { id: 'download-template' });
      const blob = await apiClient.downloadTemplate();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customs_data_template_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Template downloaded successfully!', { id: 'download-template' });
    } catch (error: any) {
      console.error('Download error:', error);
      const errorMessage = error?.message || error?.response?.data?.error || 'Failed to download template';

      if (errorMessage.includes('API client not properly initialized')) {
        toast.error('Application initialization error. Please refresh the page and try again.', { id: 'download-template' });
      } else if (errorMessage.includes('Network Error') || errorMessage.includes('ECONNREFUSED')) {
        toast.error('Cannot connect to server. Please ensure the backend is running.', { id: 'download-template' });
      } else {
        toast.error(errorMessage, { id: 'download-template' });
      }
    }
  };

  const handleGenerateJson = async () => {
    if (!uploadedData) {
      toast.error('No data available to generate JSON');
      return;
    }

    try {
      // Convert ExcelData to ResponseData format
      const responseData: Partial<ResponseData> = {
        ...uploadedData.MainData,
        barang: uploadedData.Barang || [],
        entitas: uploadedData.Entitas || [],
        kemasan: uploadedData.Kemasan || [],
        kontainer: uploadedData.Kontainer || [],
        dokumen: uploadedData.Dokumen || [],
        pengangkut: uploadedData.Pengangkut || [],
      };

      const result = await generateJson(responseData);
      if (result?.data?.json_string) {
        setGeneratedJson(result.data.json_string);
        setShowJsonModal(true);
      }
    } catch (error) {
      console.error('JSON generation error:', error);
      toast.error('Failed to generate JSON');
    }
  };

  const handleLoadSampleData = () => {
    // Create sample Excel data for demonstration
    const sampleData: ExcelData = {
      MainData: {
        asalData: 'S',
        disclaimer: '1',
        flagVd: 'Y',
        idPengguna: 'SAMPLE_USER',
        cif: 1000000,
        bruto: 100,
        netto: 95,
        ndpbm: 15000,
        vd: 100,
        nomorAju: 'SAMPLE123456789',
        nomorBc11: '000001',
        tanggalAju: new Date().toISOString().split('T')[0],
        tanggalBc11: new Date().toISOString().split('T')[0],
        tanggalTiba: new Date().toISOString().split('T')[0],
        tanggalTtd: new Date().toISOString().split('T')[0],
        namaTtd: 'Sample User',
        jabatanTtd: 'Manager',
        kotaTtd: 'Jakarta',
        asuransi: 50000,
        biayaPengurang: 0,
        biayaTambahan: 0,
        fob: 950000,
        freight: 50000,
        hargaPenyerahan: 1000000,
        jumlahTandaPengaman: 1,
        nilaiBarang: 1000000,
        nilaiIncoterm: 1000000,
        nilaiMaklon: 0,
        seri: 1,
        totalDanaSawit: 0,
        volume: 10,
        jumlahKontainer: 1,
        kodeAsuransi: 'LN',
        kodeCaraBayar: '2',
        kodeDokumen: '20',
        kodeIncoterm: 'CIF',
        kodeJenisImpor: '1',
        kodeJenisNilai: 'KMD',
        kodeJenisProsedur: '1',
        kodeKantor: '051000',
        kodePelMuat: 'CNHSK',
        kodePelTransit: 'CNHSK',
        kodePelTujuan: 'IDJBK',
        kodeTps: 'TPS1',
        kodeTutupPu: '11',
        kodeValuta: 'CNY',
        posBc11: '0001',
        subPosBc11: '00000000',
      },
      Barang: [
        {
          seriBarang: 1,
          uraian: 'Sample Product',
          merk: 'Sample Brand',
          tipe: 'Type A',
          asuransi: 0,
          bruto: 10,
          cif: 500000,
          cifRupiah: 7500000,
          diskon: 0,
          fob: 450000,
          freight: 50000,
          hargaEkspor: 0,
          hargaPatokan: 0,
          hargaPenyerahan: 500000,
          hargaPerolehan: 0,
          hargaSatuan: 50000,
          hjeCukai: 0,
          isiPerKemasan: 1,
          jumlahBahanBaku: 0,
          jumlahDilekatkan: 0,
          jumlahKemasan: 10,
          jumlahPitaCukai: 0,
          jumlahRealisasi: 0,
          jumlahSatuan: 10,
          kapasitasSilinder: 0,
          kodeJenisKemasan: 'PK',
          kodeKondisiBarang: '1',
          kodeNegaraAsal: 'CN',
          kodeSatuanBarang: 'PCE',
          ndpbm: 15000,
          netto: 9.5,
          nilaiBarang: 500000,
          nilaiDanaSawit: 0,
          nilaiDevisa: 0,
          nilaiTambah: 0,
          pernyataanLartas: '',
          persentaseImpor: 100,
          posTarif: '1234567890',
          saldoAkhir: 0,
          saldoAwal: 0,
          seriBarangDokAsal: 0,
          seriIjin: 0,
          tahunPembuatan: 2023,
          tarifCukai: 0,
          volume: 0,
          barangDokumen: [],
          barangTarif: [],
          barangVd: [],
          barangSpekKhusus: [],
          barangPemilik: [],
        },
      ],
      Entitas: [
        {
          seriEntitas: 1,
          namaEntitas: 'Sample Importer',
          alamatEntitas: 'Jl. Sample No. 123, Jakarta',
          kodeEntitas: 'IMP001',
          kodeJenisApi: '1',
          kodeJenisIdentitas: '1',
          kodeStatus: 'Y',
          nibEntitas: '1234567890123',
          nomorIdentitas: '1234567890',
          kodeNegara: 'ID',
        },
      ],
    };

    setUploadedData(sampleData);
    toast.success('Sample data loaded successfully!');
  };

  const handleReset = () => {
    setUploadedData(null);
    setGeneratedJson('');
    setShowJsonModal(false);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">Excel Upload</h1>
                {apiStatus === 'checking' && (
                  <div className="flex items-center text-yellow-600">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-1"></div>
                    <span className="text-xs">Checking...</span>
                  </div>
                )}
                {apiStatus === 'online' && (
                  <div className="flex items-center text-green-600">
                    <Wifi className="w-4 h-4 mr-1" />
                    <span className="text-xs">API Online</span>
                  </div>
                )}
                {apiStatus === 'offline' && (
                  <div className="flex items-center text-red-600">
                    <WifiOff className="w-4 h-4 mr-1" />
                    <span className="text-xs">API Offline</span>
                  </div>
                )}
              </div>
              <p className="mt-2 text-gray-600">
                Upload Excel files to automatically populate customs data
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={handleDownloadTemplate}
                className="btn btn-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </button>

              <button
                onClick={handleLoadSampleData}
                className="btn btn-ghost"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Load Sample Data
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                How to use Excel Upload
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Download the Excel template using the button above</li>
                <li>2. Fill in your customs data in the template</li>
                <li>3. Upload the completed Excel file using the upload area below</li>
                <li>4. Review the parsed data and generate JSON</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <ExcelUploadComponent
            onFileUpload={handleFileUpload}
            loading={uploading}
            error={uploadError}
          />
        </div>

        {/* Data Preview Section */}
        {uploadedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Excel Data Processed Successfully
                    </h2>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleGenerateJson}
                      disabled={generating}
                      className="btn btn-primary"
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      {generating ? 'Generating...' : 'Generate JSON'}
                    </button>
                    
                    <button
                      onClick={handleReset}
                      className="btn btn-ghost"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <ExcelDataPreview data={uploadedData} />
              </div>
            </div>
          </motion.div>
        )}

        {/* JSON Preview Modal */}
        {showJsonModal && (
          <JsonPreviewModal
            jsonString={generatedJson}
            onClose={() => setShowJsonModal(false)}
            title="Generated JSON from Excel Data"
          />
        )}
      </div>
    </div>
  );
}
