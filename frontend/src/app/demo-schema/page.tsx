'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField, SelectField, NumberField, DateField } from '@/components/forms/FormField';

export default function DemoSchemaPage() {
  const { register, formState: { errors } } = useForm();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-soft border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              BC20 Schema Enhanced Form Demo
            </h1>
            <p className="text-gray-600 mt-2">
              This demo shows how form fields now include detailed descriptions and references from the bc20-schema-enhanced.json file.
              Click the "Info" button next to any field to see the enhanced descriptions, examples, and technical constraints.
            </p>
          </div>

          <div className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Asal Data"
                  fieldName="asalData"
                  context="main"
                  required
                  register={register('asalData', { required: 'Asal Data is required' })}
                  error={errors.asalData?.message as string}
                >
                  <option value="">Select...</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                </SelectField>

                <SelectField
                  label="Disclaimer"
                  fieldName="disclaimer"
                  context="main"
                  required
                  register={register('disclaimer', { required: 'Disclaimer is required' })}
                  error={errors.disclaimer?.message as string}
                >
                  <option value="">Select...</option>
                  <option value="1">1 - Ya</option>
                  <option value="0">0 - Tidak</option>
                </SelectField>

                <SelectField
                  label="Flag VD"
                  fieldName="flagVd"
                  context="main"
                  required
                  register={register('flagVd', { required: 'Flag VD is required' })}
                  error={errors.flagVd?.message as string}
                >
                  <option value="">Select...</option>
                  <option value="Y">Y - Ya</option>
                  <option value="T">T - Tidak</option>
                </SelectField>

                <SelectField
                  label="Kode Jenis Impor"
                  fieldName="kodeJenisImpor"
                  context="main"
                  register={register('kodeJenisImpor')}
                  error={errors.kodeJenisImpor?.message as string}
                >
                  <option value="">Select...</option>
                  <option value="1">1 - Untuk Dipakai</option>
                  <option value="2">2 - Sementara</option>
                  <option value="3">3 - Re-Impor</option>
                </SelectField>
              </div>
            </div>

            {/* Financial Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NumberField
                  label="CIF"
                  fieldName="cif"
                  context="main"
                  required
                  step="0.01"
                  min={0}
                  register={register('cif', { 
                    required: 'CIF is required',
                    min: { value: 0, message: 'CIF must be positive' }
                  })}
                  error={errors.cif?.message as string}
                />

                <NumberField
                  label="FOB"
                  fieldName="fob"
                  context="main"
                  step="0.01"
                  min={0}
                  register={register('fob', { 
                    min: { value: 0, message: 'FOB must be positive' }
                  })}
                  error={errors.fob?.message as string}
                />

                <NumberField
                  label="Freight"
                  fieldName="freight"
                  context="main"
                  step="0.01"
                  min={0}
                  register={register('freight', { 
                    min: { value: 0, message: 'Freight must be positive' }
                  })}
                  error={errors.freight?.message as string}
                />

                <NumberField
                  label="Asuransi"
                  fieldName="asuransi"
                  context="main"
                  step="0.01"
                  min={0}
                  register={register('asuransi', { 
                    min: { value: 0, message: 'Asuransi must be positive' }
                  })}
                  error={errors.asuransi?.message as string}
                />

                <NumberField
                  label="Bruto"
                  fieldName="bruto"
                  context="main"
                  required
                  step="0.0001"
                  min={0}
                  register={register('bruto', { 
                    required: 'Bruto is required',
                    min: { value: 0, message: 'Bruto must be positive' }
                  })}
                  error={errors.bruto?.message as string}
                />

                <NumberField
                  label="Netto"
                  fieldName="netto"
                  context="main"
                  required
                  step="0.0001"
                  min={0}
                  register={register('netto', { 
                    required: 'Netto is required',
                    min: { value: 0, message: 'Netto must be positive' }
                  })}
                  error={errors.netto?.message as string}
                />

                <NumberField
                  label="NDPBM"
                  fieldName="ndpbm"
                  context="main"
                  required
                  step="0.0001"
                  min={0}
                  register={register('ndpbm', { 
                    required: 'NDPBM is required',
                    min: { value: 0, message: 'NDPBM must be positive' }
                  })}
                  error={errors.ndpbm?.message as string}
                />

                <NumberField
                  label="Biaya Tambahan"
                  fieldName="biayaTambahan"
                  context="main"
                  step="0.01"
                  min={0}
                  register={register('biayaTambahan', { 
                    min: { value: 0, message: 'Biaya Tambahan must be positive' }
                  })}
                  error={errors.biayaTambahan?.message as string}
                />
              </div>
            </div>

            {/* Document Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Nomor AJU"
                  fieldName="nomorAju"
                  context="main"
                  required
                  type="text"
                  register={register('nomorAju', { 
                    required: 'Nomor AJU is required',
                    pattern: {
                      value: /^[A-Za-z0-9]{26}$/,
                      message: 'Nomor AJU must be exactly 26 alphanumeric characters'
                    }
                  })}
                  error={errors.nomorAju?.message as string}
                  maxLength={26}
                  pattern="^[A-Za-z0-9]{26}$"
                />

                <DateField
                  label="Tanggal Tiba"
                  fieldName="tanggalTiba"
                  context="main"
                  required
                  register={register('tanggalTiba', { required: 'Tanggal Tiba is required' })}
                  error={errors.tanggalTiba?.message as string}
                />

                <DateField
                  label="Tanggal TTD"
                  fieldName="tanggalTtd"
                  context="main"
                  required
                  register={register('tanggalTtd', { required: 'Tanggal TTD is required' })}
                  error={errors.tanggalTtd?.message as string}
                />

                <FormField
                  label="Nama TTD"
                  fieldName="namaTtd"
                  context="main"
                  required
                  type="text"
                  register={register('namaTtd', { 
                    required: 'Nama TTD is required',
                    maxLength: { value: 100, message: 'Maximum 100 characters' }
                  })}
                  error={errors.namaTtd?.message as string}
                  maxLength={100}
                />

                <FormField
                  label="Jabatan TTD"
                  fieldName="jabatanTtd"
                  context="main"
                  required
                  type="text"
                  register={register('jabatanTtd', { 
                    required: 'Jabatan TTD is required',
                    maxLength: { value: 100, message: 'Maximum 100 characters' }
                  })}
                  error={errors.jabatanTtd?.message as string}
                  maxLength={100}
                />

                <FormField
                  label="Kota TTD"
                  fieldName="kotaTtd"
                  context="main"
                  required
                  type="text"
                  register={register('kotaTtd', { 
                    required: 'Kota TTD is required',
                    maxLength: { value: 100, message: 'Maximum 100 characters' }
                  })}
                  error={errors.kotaTtd?.message as string}
                  maxLength={100}
                />
              </div>
            </div>

            {/* Barang Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Barang (Goods) Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Pos Tarif (HS Code)"
                  fieldName="posTarif"
                  context="barang"
                  required
                  type="text"
                  register={register('posTarif', { required: true })}
                  maxLength={10}
                />

                <FormField
                  label="Merk"
                  fieldName="merk"
                  context="barang"
                  required
                  type="text"
                  register={register('merk', { required: true })}
                />

                <FormField
                  label="Tipe"
                  fieldName="tipe"
                  context="barang"
                  required
                  type="text"
                  register={register('tipe', { required: true })}
                />

                <FormField
                  label="Uraian"
                  fieldName="uraian"
                  context="barang"
                  required
                  type="textarea"
                  register={register('uraian', { required: true })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
