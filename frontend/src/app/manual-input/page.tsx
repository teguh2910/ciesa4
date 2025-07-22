'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FormWizard, WizardStep } from '@/components/forms/FormWizard';
import { MainDataForm } from '@/components/forms/MainDataForm';
import { BarangForm } from '@/components/forms/BarangForm';
import { EntitasForm } from '@/components/forms/EntitasForm';
import { OtherDataForm } from '@/components/forms/OtherDataForm';
import { ReviewForm } from '@/components/forms/ReviewForm';
import { JsonPreviewModal } from '@/components/modals/JsonPreviewModal';
import { useJsonGeneration } from '@/hooks/useApi';
import { useFormPersistence } from '@/hooks/useLocalStorage';
import { validateRequiredFields } from '@/lib/utils';
import { MainData, Barang, Entitas, Kemasan, Kontainer, Dokumen, Pengangkut } from '@/types';
import { Sparkles, RotateCcw } from 'lucide-react';

// Validation functions for each step
const validateMainData = (data: any): string[] => {
  const required = ['asalData', 'cif', 'bruto', 'netto', 'ndpbm', 'vd', 'idPengguna', 'nomorAju', 'nomorBc11', 'namaTtd', 'jabatanTtd', 'kotaTtd'];
  return validateRequiredFields(data, required);
};

const validateBarang = (data: any): string[] => {
  if (!data.barang || data.barang.length === 0) {
    return ['At least one barang item is required'];
  }
  
  const errors: string[] = [];
  data.barang.forEach((item: Barang, index: number) => {
    const required = ['uraian', 'merk', 'tipe', 'cif', 'bruto', 'netto', 'jumlahSatuan'];
    const itemErrors = validateRequiredFields(item, required);
    if (itemErrors.length > 0) {
      errors.push(`Barang item ${index + 1}: ${itemErrors.join(', ')}`);
    }
  });
  
  return errors;
};

const validateEntitas = (data: any): string[] => {
  if (!data.entitas || data.entitas.length === 0) {
    return ['At least one entitas is required'];
  }
  
  const errors: string[] = [];
  data.entitas.forEach((item: Entitas, index: number) => {
    const required = ['namaEntitas', 'kodeEntitas', 'alamatEntitas'];
    const itemErrors = validateRequiredFields(item, required);
    if (itemErrors.length > 0) {
      errors.push(`Entitas ${index + 1}: ${itemErrors.join(', ')}`);
    }
  });
  
  return errors;
};

// Wizard steps configuration
const wizardSteps: WizardStep[] = [
  {
    id: 'main-data',
    title: 'Main Data',
    description: 'Document information and financial data',
    component: MainDataForm,
    validation: validateMainData,
  },
  {
    id: 'barang',
    title: 'Barang',
    description: 'Goods and items information',
    component: BarangForm,
    validation: validateBarang,
  },
  {
    id: 'entitas',
    title: 'Entitas',
    description: 'Entities (importers, exporters, etc.)',
    component: EntitasForm,
    validation: validateEntitas,
  },
  {
    id: 'other-data',
    title: 'Additional Data',
    description: 'Packaging, containers, documents',
    component: OtherDataForm,
  },
  {
    id: 'review',
    title: 'Review & Generate',
    description: 'Review data and generate JSON',
    component: ReviewForm,
  },
];

export default function ManualInputPage() {
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [generatedJson, setGeneratedJson] = useState<string>('');
  
  const { execute: generateJson, loading: generating } = useJsonGeneration();
  
  const {
    formData,
    setFormData,
    resetForm,
    clearForm,
  } = useFormPersistence('manual-input', {
    // Main data fields
    asalData: 'S',
    disclaimer: '1',
    flagVd: 'Y',
    asuransi: 0,
    biayaPengurang: 0,
    biayaTambahan: 0,
    bruto: 0,
    cif: 0,
    fob: 0,
    freight: 0,
    hargaPenyerahan: 0,
    idPengguna: '',
    jabatanTtd: '',
    jumlahKontainer: 1,
    jumlahTandaPengaman: 0,
    kodeAsuransi: 'LN',
    kodeCaraBayar: '2',
    kodeDokumen: '20',
    kodeIncoterm: 'CIF',
    kodeJenisImpor: '1',
    kodeJenisNilai: 'KMD',
    kodeJenisProsedur: '1',
    kodeKantor: '051000',
    kodePelMuat: '',
    kodePelTransit: '',
    kodePelTujuan: '',
    kodeTps: '',
    kodeTutupPu: '11',
    kodeValuta: 'CNY',
    kotaTtd: '',
    namaTtd: '',
    ndpbm: 0,
    netto: 0,
    nilaiBarang: 0,
    nilaiIncoterm: 0,
    nilaiMaklon: 0,
    nomorAju: '',
    nomorBc11: '',
    posBc11: '',
    seri: 0,
    subPosBc11: '',
    tanggalAju: '',
    tanggalBc11: '',
    tanggalTiba: '',
    tanggalTtd: '',
    totalDanaSawit: 0,
    volume: 0,
    vd: 0,
    // Array fields
    barang: [] as Barang[],
    entitas: [] as Entitas[],
    kemasan: [] as Kemasan[],
    kontainer: [] as Kontainer[],
    dokumen: [] as Dokumen[],
    pengangkut: [] as Pengangkut[],
  });

  const handleComplete = async (data: any) => {
    try {
      const result = await generateJson(data);
      if (result?.data?.json_string) {
        setGeneratedJson(result.data.json_string);
        setShowJsonModal(true);
        toast.success('JSON generated successfully!');
      }
    } catch (error) {
      toast.error('Failed to generate JSON');
    }
  };

  const loadSampleData = () => {
    const sampleData = {
      // Main data
      asalData: 'S',
      disclaimer: '1',
      flagVd: 'Y',
      idPengguna: 'SAMPLE_USER',
      cif: 1234567.89,
      bruto: 350.71,
      netto: 342.71,
      ndpbm: 1234.56,
      vd: 123,
      nomorAju: '301017INA9G220220525000025',
      nomorBc11: '000001',
      posBc11: '0001',
      subPosBc11: '00000000',
      tanggalAju: '2021-12-25',
      tanggalBc11: '2021-12-24',
      tanggalTiba: '2021-12-25',
      tanggalTtd: '2021-12-25',
      namaTtd: 'AGUS',
      jabatanTtd: 'MANAGER',
      kotaTtd: 'JAKARTA',
      
      // Sample barang
      barang: [
        {
          seriBarang: 1,
          uraian: 'SAMPLE GOODS',
          merk: 'SAMPLE BRAND',
          tipe: 'SAMPLE TYPE',
          cif: 1234000.89,
          cifRupiah: 18510013.35,
          bruto: 12,
          netto: 340.71,
          jumlahSatuan: 30,
          hargaSatuan: 345.67,
          kodeJenisKemasan: 'CT',
          kodeKondisiBarang: '8',
          kodeNegaraAsal: 'CN',
          kodeSatuanBarang: 'PCE',
          posTarif: '84212990',
          pernyataanLartas: 'Y',
          jumlahKemasan: 1,
          ndpbm: 1200.56,
          asuransi: 0,
          diskon: 0,
          fob: 0,
          freight: 0,
          hargaEkspor: 0,
          hargaPatokan: 0,
          hargaPenyerahan: 0,
          hargaPerolehan: 0,
          hjeCukai: 0,
          isiPerKemasan: 0,
          jumlahBahanBaku: 0,
          jumlahDilekatkan: 0,
          jumlahPitaCukai: 0,
          jumlahRealisasi: 0,
          kapasitasSilinder: 0,
          nilaiBarang: 0,
          nilaiDanaSawit: 0,
          nilaiDevisa: 0,
          nilaiTambah: 0,
          persentaseImpor: 0,
          saldoAkhir: 0,
          saldoAwal: 0,
          seriBarangDokAsal: 0,
          seriIjin: 0,
          tahunPembuatan: 0,
          tarifCukai: 0,
          volume: 0,
          barangDokumen: [],
          barangTarif: [],
          barangVd: [],
          barangSpekKhusus: [],
          barangPemilik: [],
        },
      ],
      
      // Sample entitas
      entitas: [
        {
          seriEntitas: 1,
          namaEntitas: 'SAMPLE IMPORTER',
          kodeEntitas: '1',
          alamatEntitas: 'JAKARTA, INDONESIA',
          nomorIdentitas: '123456789012345',
          kodeJenisApi: '01',
          kodeJenisIdentitas: '3',
          kodeStatus: 'AEO',
          nibEntitas: '1234567890123',
          kodeNegara: '',
        },
      ],
      
      // Other required fields with defaults
      asuransi: 0,
      biayaPengurang: 0,
      biayaTambahan: 0,
      fob: 0,
      freight: 0,
      hargaPenyerahan: 0,
      jumlahKontainer: 1,
      jumlahTandaPengaman: 0,
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
      nilaiBarang: 0,
      nilaiIncoterm: 0,
      nilaiMaklon: 0,
      seri: 0,
      totalDanaSawit: 0,
      volume: 0,
      
      // Empty arrays for other data
      kemasan: [],
      kontainer: [],
      dokumen: [],
      pengangkut: [],
    };
    
    setFormData(sampleData);
    toast.success('Sample data loaded successfully!');
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manual Data Input</h1>
              <p className="mt-2 text-gray-600">
                Enter your customs data step-by-step through guided forms
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={loadSampleData}
                className="btn btn-secondary"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Load Sample Data
              </button>
              
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
                    clearForm();
                    toast.success('Form data cleared');
                  }
                }}
                className="btn btn-ghost"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Form
              </button>
            </div>
          </div>
        </div>

        {/* Form Wizard */}
        <FormWizard
          steps={wizardSteps}
          onComplete={handleComplete}
          initialData={formData}
          className="mb-8"
        />

        {/* JSON Preview Modal */}
        {showJsonModal && (
          <JsonPreviewModal
            jsonString={generatedJson}
            onClose={() => setShowJsonModal(false)}
          />
        )}
      </div>
    </div>
  );
}
