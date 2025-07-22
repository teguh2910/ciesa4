'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { Plus, Trash2, Package, Container, FileText, Truck } from 'lucide-react';
import { Kemasan, Kontainer, Dokumen, Pengangkut } from '@/types';
import { cn } from '@/lib/utils';

interface OtherDataFormProps {
  data: {
    kemasan: Kemasan[];
    kontainer: Kontainer[];
    dokumen: Dokumen[];
    pengangkut: Pengangkut[];
  };
  onChange: (data: {
    kemasan: Kemasan[];
    kontainer: Kontainer[];
    dokumen: Dokumen[];
    pengangkut: Pengangkut[];
  }) => void;
  errors?: string[];
}

export function OtherDataForm({ data, onChange, errors }: OtherDataFormProps) {
  const [activeTab, setActiveTab] = useState<'kemasan' | 'kontainer' | 'dokumen' | 'pengangkut'>('kemasan');
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const { control, register } = useForm({
    defaultValues: {
      kemasan: data.kemasan || [],
      kontainer: data.kontainer || [],
      dokumen: data.dokumen || [],
      pengangkut: data.pengangkut || [],
    },
  });

  const { fields: kemasanFields, append: appendKemasan, remove: removeKemasan } = useFieldArray({
    control,
    name: 'kemasan',
  });

  const { fields: kontainerFields, append: appendKontainer, remove: removeKontainer } = useFieldArray({
    control,
    name: 'kontainer',
  });

  const { fields: dokumenFields, append: appendDokumen, remove: removeDokumen } = useFieldArray({
    control,
    name: 'dokumen',
  });

  const { fields: pengangkutFields, append: appendPengangkut, remove: removePengangkut } = useFieldArray({
    control,
    name: 'pengangkut',
  });

  const watchedValues = useWatch({ control });

  // Update parent component when data changes
  useEffect(() => {
    if (watchedValues) {
      onChangeRef.current({
        kemasan: (watchedValues.kemasan || []) as Kemasan[],
        kontainer: (watchedValues.kontainer || []) as Kontainer[],
        dokumen: (watchedValues.dokumen || []) as Dokumen[],
        pengangkut: (watchedValues.pengangkut || []) as Pengangkut[],
      });
    }
  }, [watchedValues]);

  const tabs = [
    { id: 'kemasan', label: 'Kemasan', icon: Package, count: kemasanFields.length },
    { id: 'kontainer', label: 'Kontainer', icon: Container, count: kontainerFields.length },
    { id: 'dokumen', label: 'Dokumen', icon: FileText, count: dokumenFields.length },
    { id: 'pengangkut', label: 'Pengangkut', icon: Truck, count: pengangkutFields.length },
  ];

  const addKemasanItem = () => {
    const newItem: Partial<Kemasan> = {
      seriKemasan: kemasanFields.length + 1,
      jumlahKemasan: 1,
      kodeJenisKemasan: '',
      merkKemasan: '',
    };
    appendKemasan(newItem as Kemasan);
  };

  const addKontainerItem = () => {
    const newItem: Partial<Kontainer> = {
      seriKontainer: kontainerFields.length + 1,
      kodeJenisKontainer: '',
      kodeTipeKontainer: '',
      kodeUkuranKontainer: '',
      nomorKontainer: '',
    };
    appendKontainer(newItem as Kontainer);
  };

  const addDokumenItem = () => {
    const newItem: Partial<Dokumen> = {
      seriDokumen: dokumenFields.length + 1,
      idDokumen: '',
      kodeDokumen: '',
      kodeFasilitas: '',
      nomorDokumen: '',
      tanggalDokumen: '',
      namaFasilitas: '',
    };
    appendDokumen(newItem as Dokumen);
  };

  const addPengangkutItem = () => {
    const newItem: Partial<Pengangkut> = {
      seriPengangkut: pengangkutFields.length + 1,
      kodeBendera: '',
      namaPengangkut: '',
      nomorPengangkut: '',
      kodeCaraAngkut: '',
    };
    appendPengangkut(newItem as Pengangkut);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Additional Data</h3>
        <p className="text-sm text-gray-600 mt-1">
          Add packaging, container, document, and transportation information
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Kemasan Tab */}
        {activeTab === 'kemasan' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium text-gray-900">Packaging Information</h4>
              <button
                type="button"
                onClick={addKemasanItem}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Packaging
              </button>
            </div>

            {kemasanFields.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No packaging items added</p>
              </div>
            ) : (
              <div className="space-y-4">
                {kemasanFields.map((field, index) => (
                  <div key={field.id} className="bg-white border border-gray-200 rounded-lg p-4 relative">
                    <button
                      type="button"
                      onClick={() => removeKemasan(index)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="form-label">Seri Kemasan</label>
                        <input
                          type="number"
                          {...register(`kemasan.${index}.seriKemasan`)}
                          className="form-input"
                          defaultValue={index + 1}
                        />
                      </div>
                      <div>
                        <label className="form-label">Jumlah Kemasan</label>
                        <input
                          type="number"
                          {...register(`kemasan.${index}.jumlahKemasan`)}
                          className="form-input"
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <label className="form-label">Kode Jenis Kemasan</label>
                        <select {...register(`kemasan.${index}.kodeJenisKemasan`)} className="form-input">
                          <option value="">Select...</option>
                          <option value="CT">CT - Carton</option>
                          <option value="PK">PK - Package</option>
                          <option value="BX">BX - Box</option>
                          <option value="PC">PC - Piece</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Merk Kemasan</label>
                        <input
                          type="text"
                          {...register(`kemasan.${index}.merkKemasan`)}
                          className="form-input"
                          placeholder="Enter brand"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Kontainer Tab */}
        {activeTab === 'kontainer' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium text-gray-900">Container Information</h4>
              <button
                type="button"
                onClick={addKontainerItem}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Container
              </button>
            </div>

            {kontainerFields.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Container className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No containers added</p>
              </div>
            ) : (
              <div className="space-y-4">
                {kontainerFields.map((field, index) => (
                  <div key={field.id} className="bg-white border border-gray-200 rounded-lg p-4 relative">
                    <button
                      type="button"
                      onClick={() => removeKontainer(index)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <label className="form-label">Seri Kontainer</label>
                        <input
                          type="number"
                          {...register(`kontainer.${index}.seriKontainer`)}
                          className="form-input"
                          defaultValue={index + 1}
                        />
                      </div>
                      <div>
                        <label className="form-label">Kode Jenis</label>
                        <select {...register(`kontainer.${index}.kodeJenisKontainer`)} className="form-input">
                          <option value="">Select...</option>
                          <option value="FCL">FCL</option>
                          <option value="LCL">LCL</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Kode Tipe</label>
                        <input
                          type="text"
                          {...register(`kontainer.${index}.kodeTipeKontainer`)}
                          className="form-input"
                          placeholder="Enter type"
                        />
                      </div>
                      <div>
                        <label className="form-label">Kode Ukuran</label>
                        <select {...register(`kontainer.${index}.kodeUkuranKontainer`)} className="form-input">
                          <option value="">Select...</option>
                          <option value="20">20 ft</option>
                          <option value="40">40 ft</option>
                          <option value="45">45 ft</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Nomor Kontainer</label>
                        <input
                          type="text"
                          {...register(`kontainer.${index}.nomorKontainer`)}
                          className="form-input"
                          placeholder="Enter number"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dokumen Tab */}
        {activeTab === 'dokumen' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium text-gray-900">Document Information</h4>
              <button
                type="button"
                onClick={addDokumenItem}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Document
              </button>
            </div>

            {dokumenFields.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No documents added</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dokumenFields.map((field, index) => (
                  <div key={field.id} className="bg-white border border-gray-200 rounded-lg p-4 relative">
                    <button
                      type="button"
                      onClick={() => removeDokumen(index)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="form-label">Seri Dokumen</label>
                        <input
                          type="number"
                          {...register(`dokumen.${index}.seriDokumen`)}
                          className="form-input"
                          defaultValue={index + 1}
                        />
                      </div>
                      <div>
                        <label className="form-label">ID Dokumen</label>
                        <input
                          type="text"
                          {...register(`dokumen.${index}.idDokumen`)}
                          className="form-input"
                          placeholder="Enter document ID"
                        />
                      </div>
                      <div>
                        <label className="form-label">Kode Dokumen</label>
                        <select {...register(`dokumen.${index}.kodeDokumen`)} className="form-input">
                          <option value="">Select...</option>
                          <option value="20">20 - BC 2.0</option>
                          <option value="23">23 - BC 2.3</option>
                          <option value="30">30 - BC 3.0</option>
                          <option value="40">40 - BC 4.0</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Kode Fasilitas</label>
                        <input
                          type="text"
                          {...register(`dokumen.${index}.kodeFasilitas`)}
                          className="form-input"
                          placeholder="Enter facility code"
                        />
                      </div>
                      <div>
                        <label className="form-label">Nomor Dokumen</label>
                        <input
                          type="text"
                          {...register(`dokumen.${index}.nomorDokumen`)}
                          className="form-input"
                          placeholder="Enter document number"
                        />
                      </div>
                      <div>
                        <label className="form-label">Tanggal Dokumen</label>
                        <input
                          type="date"
                          {...register(`dokumen.${index}.tanggalDokumen`)}
                          className="form-input"
                        />
                      </div>
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="form-label">Nama Fasilitas</label>
                        <input
                          type="text"
                          {...register(`dokumen.${index}.namaFasilitas`)}
                          className="form-input"
                          placeholder="Enter facility name"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pengangkut Tab */}
        {activeTab === 'pengangkut' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium text-gray-900">Transportation Information</h4>
              <button
                type="button"
                onClick={addPengangkutItem}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transportation
              </button>
            </div>

            {pengangkutFields.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Truck className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No transportation added</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pengangkutFields.map((field, index) => (
                  <div key={field.id} className="bg-white border border-gray-200 rounded-lg p-4 relative">
                    <button
                      type="button"
                      onClick={() => removePengangkut(index)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <label className="form-label">Seri Pengangkut</label>
                        <input
                          type="number"
                          {...register(`pengangkut.${index}.seriPengangkut`)}
                          className="form-input"
                          defaultValue={index + 1}
                        />
                      </div>
                      <div>
                        <label className="form-label">Kode Bendera</label>
                        <input
                          type="text"
                          {...register(`pengangkut.${index}.kodeBendera`)}
                          className="form-input"
                          placeholder="e.g., ID, SG"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <label className="form-label">Nama Pengangkut</label>
                        <input
                          type="text"
                          {...register(`pengangkut.${index}.namaPengangkut`)}
                          className="form-input"
                          placeholder="Enter carrier name"
                        />
                      </div>
                      <div>
                        <label className="form-label">Nomor Pengangkut</label>
                        <input
                          type="text"
                          {...register(`pengangkut.${index}.nomorPengangkut`)}
                          className="form-input"
                          placeholder="Enter carrier number"
                        />
                      </div>
                      <div>
                        <label className="form-label">Kode Cara Angkut</label>
                        <select {...register(`pengangkut.${index}.kodeCaraAngkut`)} className="form-input">
                          <option value="">Select...</option>
                          <option value="1">1 - Laut</option>
                          <option value="2">2 - Udara</option>
                          <option value="3">3 - Darat</option>
                          <option value="4">4 - Pos</option>
                          <option value="5">5 - Multimoda</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error display */}
      {errors && errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Validation Errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
