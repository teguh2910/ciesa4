'use client';

import React, { useState } from 'react';
import { 
  FormWizard, 
  MainDataForm, 
  BarangForm, 
  EntitasForm, 
  OtherDataForm, 
  ReviewForm,
  WizardStep 
} from '@/components/forms';
import { JsonPreviewModal } from '@/components/modals';
import { ResponseData } from '@/types';

// Test data
const initialTestData: Partial<ResponseData> = {
  asalData: 'S',
  disclaimer: '1',
  flagVd: 'Y',
  idPengguna: 'TEST_USER',
  cif: 1000000,
  bruto: 100,
  netto: 95,
  ndpbm: 15000,
  vd: 100,
  nomorAju: 'TEST123456789',
  nomorBc11: '000001',
  namaTtd: 'Test User',
  jabatanTtd: 'Manager',
  kotaTtd: 'Jakarta',
  barang: [],
  entitas: [],
  kemasan: [],
  kontainer: [],
  dokumen: [],
  pengangkut: [],
};

// Validation functions
const validateMainData = (data: any): string[] => {
  const errors: string[] = [];
  if (!data.asalData) errors.push('Asal Data is required');
  if (!data.cif) errors.push('CIF is required');
  if (!data.idPengguna) errors.push('ID Pengguna is required');
  return errors;
};

const validateBarang = (data: any): string[] => {
  if (!data.barang || data.barang.length === 0) {
    return ['At least one barang item is required'];
  }
  return [];
};

const validateEntitas = (data: any): string[] => {
  if (!data.entitas || data.entitas.length === 0) {
    return ['At least one entitas is required'];
  }
  return [];
};

// Wizard steps
const testSteps: WizardStep[] = [
  {
    id: 'main-data',
    title: 'Main Data',
    description: 'Basic document information',
    component: MainDataForm,
    validation: validateMainData,
  },
  {
    id: 'barang',
    title: 'Barang',
    description: 'Goods information',
    component: BarangForm,
    validation: validateBarang,
  },
  {
    id: 'entitas',
    title: 'Entitas',
    description: 'Entity information',
    component: EntitasForm,
    validation: validateEntitas,
  },
  {
    id: 'other-data',
    title: 'Other Data',
    description: 'Additional information',
    component: OtherDataForm,
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Review and generate',
    component: ReviewForm,
  },
];

export default function TestFormsPage() {
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [generatedJson, setGeneratedJson] = useState('');

  const handleComplete = (data: any) => {
    console.log('Form completed with data:', data);
    
    // Generate JSON string for preview
    const jsonString = JSON.stringify(data, null, 2);
    setGeneratedJson(jsonString);
    setShowJsonModal(true);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Form Components Test</h1>
          <p className="mt-2 text-gray-600">
            Test page for all manual data input form components
          </p>
        </div>

        {/* Test Status */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Component Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">FormWizard</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">MainDataForm</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">BarangForm</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">EntitasForm</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">OtherDataForm</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">ReviewForm</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">JsonPreviewModal</span>
            </div>
          </div>
        </div>

        {/* Form Wizard */}
        <FormWizard
          steps={testSteps}
          onComplete={handleComplete}
          initialData={initialTestData}
          className="mb-8"
        />

        {/* JSON Preview Modal */}
        {showJsonModal && (
          <JsonPreviewModal
            jsonString={generatedJson}
            onClose={() => setShowJsonModal(false)}
            title="Test Form Generated JSON"
          />
        )}
      </div>
    </div>
  );
}
