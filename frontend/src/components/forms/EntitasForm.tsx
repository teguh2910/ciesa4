'use client';

import React, { useRef, useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { Plus, Trash2, Building2 } from 'lucide-react';
import { Entitas } from '@/types';
import { cn } from '@/lib/utils';
import { FormField, SelectField, NumberField } from './FormField';

interface EntitasFormProps {
  data: { entitas: Entitas[] };
  onChange: (data: { entitas: Entitas[] }) => void;
  errors?: string[];
}

export function EntitasForm({ data, onChange, errors }: EntitasFormProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const { control, register } = useForm({
    defaultValues: { entitas: data.entitas || [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'entitas',
  });

  const watchedEntitas = useWatch({ control, name: 'entitas' });

  // Update parent component when data changes
  useEffect(() => {
    if (watchedEntitas) {
      onChangeRef.current({ entitas: watchedEntitas });
    }
  }, [watchedEntitas]);

  const addEntitasItem = () => {
    const newItem: Partial<Entitas> = {
      seriEntitas: fields.length + 1,
      namaEntitas: '',
      kodeEntitas: '',
      alamatEntitas: '',
      kodeJenisApi: '',
      kodeJenisIdentitas: '',
      kodeStatus: '',
      nibEntitas: '',
      nomorIdentitas: '',
      kodeNegara: '',
    };
    
    append(newItem as Entitas);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Entitas Information</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add details about entities (importers, exporters, etc.)
          </p>
        </div>
        <button
          type="button"
          onClick={addEntitasItem}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Entity
        </button>
      </div>

      {/* Items List */}
      {fields.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No entities added</h4>
          <p className="text-gray-600 mb-4">
            Click "Add Entity" to start adding entity information
          </p>
          <button
            type="button"
            onClick={addEntitasItem}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Entity
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-white border border-gray-200 rounded-lg p-6 relative"
            >
              {/* Remove button */}
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove entity"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Item header */}
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Entity {index + 1}
                </h4>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Basic Information</h5>
                  
                  <NumberField
                    label="Seri Entitas"
                    fieldName="seriEntitas"
                    context="entitas"
                    required
                    register={register(`entitas.${index}.seriEntitas`, { required: true })}
                    value={index + 1}
                  />

                  <FormField
                    label="Nama Entitas"
                    fieldName="namaEntitas"
                    context="entitas"
                    required
                    type="text"
                    register={register(`entitas.${index}.namaEntitas`, { required: true })}
                  />

                  <SelectField
                    label="Kode Entitas"
                    fieldName="kodeEntitas"
                    context="entitas"
                    required
                    register={register(`entitas.${index}.kodeEntitas`, { required: true })}
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Importir</option>
                    <option value="4">4 - Pengangkut</option>
                    <option value="7">7 - Pembeli</option>
                    <option value="9">9 - Penjual</option>
                    <option value="10">10 - Pemilik Barang</option>
                    <option value="11">11 - Lainnya</option>
                  </SelectField>

                  <FormField
                    label="Alamat Entitas"
                    fieldName="alamatEntitas"
                    context="entitas"
                    required
                    type="textarea"
                    register={register(`entitas.${index}.alamatEntitas`, { required: true })}
                  />

                  <FormField
                    label="Nomor Identitas"
                    fieldName="nomorIdentitas"
                    context="entitas"
                    required
                    type="text"
                    register={register(`entitas.${index}.nomorIdentitas`, { required: true })}
                  />
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Additional Information</h5>
                  
                  <div>
                    <label className="form-label">Nomor Identitas</label>
                    <input
                      type="text"
                      {...register(`entitas.${index}.nomorIdentitas`)}
                      className="form-input"
                      placeholder="Enter identity number"
                    />
                  </div>

                  <div>
                    <label className="form-label">Kode Jenis API</label>
                    <select {...register(`entitas.${index}.kodeJenisApi`)} className="form-input">
                      <option value="">Select...</option>
                      <option value="01">01 - API-P</option>
                      <option value="02">02 - API-U</option>
                      <option value="03">03 - Non API</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Kode Jenis Identitas</label>
                    <select {...register(`entitas.${index}.kodeJenisIdentitas`)} className="form-input">
                      <option value="">Select...</option>
                      <option value="1">1 - NPWP</option>
                      <option value="2">2 - NIK</option>
                      <option value="3">3 - Passport</option>
                      <option value="4">4 - Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Kode Status</label>
                    <select {...register(`entitas.${index}.kodeStatus`)} className="form-input">
                      <option value="">Select...</option>
                      <option value="AEO">AEO - Authorized Economic Operator</option>
                      <option value="MITA">MITA - Mitra Utama</option>
                      <option value="NON">NON - Non AEO/MITA</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">NIB Entitas</label>
                    <input
                      type="text"
                      {...register(`entitas.${index}.nibEntitas`)}
                      className="form-input"
                      placeholder="Enter NIB number"
                    />
                  </div>

                  <div>
                    <label className="form-label">Kode Negara</label>
                    <input
                      type="text"
                      {...register(`entitas.${index}.kodeNegara`)}
                      className="form-input"
                      placeholder="e.g., ID, CN, US"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
