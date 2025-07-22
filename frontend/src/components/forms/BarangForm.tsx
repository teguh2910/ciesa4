'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { Plus, Trash2, Package } from 'lucide-react';
import { Barang } from '@/types';
import { cn } from '@/lib/utils';

interface BarangFormProps {
  data: { barang: Barang[] };
  onChange: (data: { barang: Barang[] }) => void;
  errors?: string[];
}

export function BarangForm({ data, onChange, errors }: BarangFormProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const { control, register, setValue } = useForm({
    defaultValues: { barang: data.barang || [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'barang',
  });

  const watchedBarang = useWatch({ control, name: 'barang' });

  // Update parent component when data changes
  useEffect(() => {
    if (watchedBarang) {
      onChangeRef.current({ barang: watchedBarang });
    }
  }, [watchedBarang]);

  const addBarangItem = () => {
    const newItem: Partial<Barang> = {
      seriBarang: fields.length + 1,
      uraian: '',
      merk: '',
      tipe: '',
      cif: 0,
      bruto: 0,
      netto: 0,
      jumlahSatuan: 0,
      hargaSatuan: 0,
      kodeJenisKemasan: '',
      kodeKondisiBarang: '',
      kodeNegaraAsal: '',
      kodeSatuanBarang: '',
      posTarif: '',
      pernyataanLartas: 'Y',
      jumlahKemasan: 1,
      ndpbm: 0,
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
    };
    
    append(newItem as Barang);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Barang (Goods) Information</h3>
          <p className="text-sm text-gray-600 mt-1">
            Add details about the goods being imported
          </p>
        </div>
        <button
          type="button"
          onClick={addBarangItem}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </button>
      </div>

      {/* Items List */}
      {fields.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No goods items added</h4>
          <p className="text-gray-600 mb-4">
            Click "Add Item" to start adding goods information
          </p>
          <button
            type="button"
            onClick={addBarangItem}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Item
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
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Item header */}
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  Barang Item {index + 1}
                </h4>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Basic Information</h5>
                  
                  <div>
                    <label className="form-label required">Seri Barang</label>
                    <input
                      type="number"
                      {...register(`barang.${index}.seriBarang`, { required: true })}
                      className="form-input"
                      defaultValue={index + 1}
                    />
                  </div>

                  <div>
                    <label className="form-label required">Uraian (Description)</label>
                    <textarea
                      {...register(`barang.${index}.uraian`, { required: true })}
                      className="form-input"
                      rows={2}
                      placeholder="Enter goods description"
                    />
                  </div>

                  <div>
                    <label className="form-label required">Merk (Brand)</label>
                    <input
                      type="text"
                      {...register(`barang.${index}.merk`, { required: true })}
                      className="form-input"
                      placeholder="Enter brand name"
                    />
                  </div>

                  <div>
                    <label className="form-label required">Tipe (Type)</label>
                    <input
                      type="text"
                      {...register(`barang.${index}.tipe`, { required: true })}
                      className="form-input"
                      placeholder="Enter type/model"
                    />
                  </div>

                  <div>
                    <label className="form-label required">Pos Tarif (HS Code)</label>
                    <input
                      type="text"
                      {...register(`barang.${index}.posTarif`, { required: true })}
                      className="form-input"
                      placeholder="Enter HS code"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Financial & Quantity Information */}
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">Financial & Quantity</h5>
                  
                  <div>
                    <label className="form-label required">CIF</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`barang.${index}.cif`, { required: true, min: 0 })}
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="form-label required">Bruto (Gross Weight)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`barang.${index}.bruto`, { required: true, min: 0 })}
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="form-label required">Netto (Net Weight)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`barang.${index}.netto`, { required: true, min: 0 })}
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="form-label required">Jumlah Satuan (Quantity)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`barang.${index}.jumlahSatuan`, { required: true, min: 0 })}
                      className="form-input"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="form-label required">Harga Satuan (Unit Price)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`barang.${index}.hargaSatuan`, { required: true, min: 0 })}
                      className="form-input"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4 md:col-span-2">
                  <h5 className="font-medium text-gray-900">Additional Information</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">Kode Jenis Kemasan</label>
                      <select {...register(`barang.${index}.kodeJenisKemasan`)} className="form-input">
                        <option value="">Select...</option>
                        <option value="CT">CT - Carton</option>
                        <option value="PK">PK - Package</option>
                        <option value="BX">BX - Box</option>
                        <option value="PC">PC - Piece</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Kode Kondisi Barang</label>
                      <select {...register(`barang.${index}.kodeKondisiBarang`)} className="form-input">
                        <option value="">Select...</option>
                        <option value="1">1 - New</option>
                        <option value="8">8 - Used</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Kode Negara Asal</label>
                      <input
                        type="text"
                        {...register(`barang.${index}.kodeNegaraAsal`)}
                        className="form-input"
                        placeholder="e.g., CN, US, JP"
                        maxLength={2}
                      />
                    </div>

                    <div>
                      <label className="form-label">Kode Satuan Barang</label>
                      <select {...register(`barang.${index}.kodeSatuanBarang`)} className="form-input">
                        <option value="">Select...</option>
                        <option value="PCE">PCE - Pieces</option>
                        <option value="KGM">KGM - Kilograms</option>
                        <option value="LTR">LTR - Liters</option>
                        <option value="MTR">MTR - Meters</option>
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Jumlah Kemasan</label>
                      <input
                        type="number"
                        {...register(`barang.${index}.jumlahKemasan`, { min: 0 })}
                        className="form-input"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <label className="form-label">Pernyataan Lartas</label>
                      <select {...register(`barang.${index}.pernyataanLartas`)} className="form-input">
                        <option value="Y">Y - Yes</option>
                        <option value="N">N - No</option>
                      </select>
                    </div>
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
