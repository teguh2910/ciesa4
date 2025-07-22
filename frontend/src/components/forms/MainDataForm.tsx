'use client';

import { useForm, useWatch } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { MainData } from '@/types';
import { validateRequiredFields, getTodayString } from '@/lib/utils';

interface MainDataFormProps {
  data: Partial<MainData>;
  onChange: (data: Partial<MainData>) => void;
  errors?: string[];
}

export function MainDataForm({ data, onChange, errors }: MainDataFormProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const {
    register,
    control,
    setValue,
    formState: { errors: formErrors },
  } = useForm<MainData>({
    defaultValues: {
      asalData: 'S',
      disclaimer: '1',
      flagVd: 'Y',
      asuransi: 0,
      biayaPengurang: 0,
      biayaTambahan: 0,
      fob: 0,
      freight: 0,
      hargaPenyerahan: 0,
      jumlahTandaPengaman: 0,
      nilaiBarang: 0,
      nilaiIncoterm: 0,
      nilaiMaklon: 0,
      seri: 0,
      totalDanaSawit: 0,
      volume: 0,
      jumlahKontainer: 1,
      kodeAsuransi: 'LN',
      kodeCaraBayar: '2',
      kodeDokumen: '20',
      kodeIncoterm: 'CIF',
      kodeJenisImpor: '1',
      kodeJenisNilai: 'KMD',
      kodeJenisProsedur: '1',
      kodeKantor: '051000',
      kodeTutupPu: '11',
      kodeValuta: 'CNY',
      tanggalAju: getTodayString(),
      tanggalBc11: getTodayString(),
      tanggalTiba: getTodayString(),
      tanggalTtd: getTodayString(),
      ...data,
    },
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (watchedValues) {
      onChangeRef.current(watchedValues);
    }
  }, [watchedValues]);

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label required">Asal Data</label>
            <select {...register('asalData', { required: 'Asal Data is required' })} className="form-input">
              <option value="">Select...</option>
              <option value="S">S</option>
              <option value="M">M</option>
            </select>
            <p className="form-help">Source of data</p>
            {formErrors.asalData && <p className="form-error">{formErrors.asalData.message}</p>}
          </div>

          <div>
            <label className="form-label required">Disclaimer</label>
            <select {...register('disclaimer', { required: 'Disclaimer is required' })} className="form-input">
              <option value="">Select...</option>
              <option value="1">1</option>
              <option value="0">0</option>
            </select>
            {formErrors.disclaimer && <p className="form-error">{formErrors.disclaimer.message}</p>}
          </div>

          <div>
            <label className="form-label required">Flag VD</label>
            <select {...register('flagVd', { required: 'Flag VD is required' })} className="form-input">
              <option value="">Select...</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
            {formErrors.flagVd && <p className="form-error">{formErrors.flagVd.message}</p>}
          </div>

          <div>
            <label className="form-label required">ID Pengguna</label>
            <input
              type="text"
              {...register('idPengguna', { 
                required: 'ID Pengguna is required',
                maxLength: { value: 50, message: 'Maximum 50 characters' }
              })}
              className="form-input"
              placeholder="Enter user ID"
            />
            <p className="form-help">User ID for the declaration</p>
            {formErrors.idPengguna && <p className="form-error">{formErrors.idPengguna.message}</p>}
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label required">CIF</label>
            <input
              type="number"
              step="0.01"
              {...register('cif', { 
                required: 'CIF is required',
                min: { value: 0, message: 'CIF must be positive' }
              })}
              className="form-input"
              placeholder="0.00"
            />
            <p className="form-help">Cost, Insurance, and Freight value</p>
            {formErrors.cif && <p className="form-error">{formErrors.cif.message}</p>}
          </div>

          <div>
            <label className="form-label required">Bruto</label>
            <input
              type="number"
              step="0.01"
              {...register('bruto', { 
                required: 'Bruto is required',
                min: { value: 0, message: 'Bruto must be positive' }
              })}
              className="form-input"
              placeholder="0.00"
            />
            <p className="form-help">Gross weight</p>
            {formErrors.bruto && <p className="form-error">{formErrors.bruto.message}</p>}
          </div>

          <div>
            <label className="form-label required">Netto</label>
            <input
              type="number"
              step="0.01"
              {...register('netto', { 
                required: 'Netto is required',
                min: { value: 0, message: 'Netto must be positive' }
              })}
              className="form-input"
              placeholder="0.00"
            />
            <p className="form-help">Net weight</p>
            {formErrors.netto && <p className="form-error">{formErrors.netto.message}</p>}
          </div>

          <div>
            <label className="form-label required">NDPBM</label>
            <input
              type="number"
              step="0.01"
              {...register('ndpbm', { 
                required: 'NDPBM is required',
                min: { value: 0, message: 'NDPBM must be positive' }
              })}
              className="form-input"
              placeholder="0.00"
            />
            <p className="form-help">Exchange rate value</p>
            {formErrors.ndpbm && <p className="form-error">{formErrors.ndpbm.message}</p>}
          </div>

          <div>
            <label className="form-label required">VD</label>
            <input
              type="number"
              step="0.01"
              {...register('vd', { 
                required: 'VD is required',
                min: { value: 0, message: 'VD must be positive' }
              })}
              className="form-input"
              placeholder="0.00"
            />
            {formErrors.vd && <p className="form-error">{formErrors.vd.message}</p>}
          </div>

          <div>
            <label className="form-label">Asuransi</label>
            <input
              type="number"
              step="0.01"
              {...register('asuransi', { 
                min: { value: 0, message: 'Asuransi must be positive' }
              })}
              className="form-input"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Document Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Document Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label required">Nomor AJU</label>
            <input
              type="text"
              {...register('nomorAju', { 
                required: 'Nomor AJU is required',
                maxLength: { value: 50, message: 'Maximum 50 characters' }
              })}
              className="form-input"
              placeholder="Enter AJU number"
            />
            <p className="form-help">Application number</p>
            {formErrors.nomorAju && <p className="form-error">{formErrors.nomorAju.message}</p>}
          </div>

          <div>
            <label className="form-label required">Nomor BC11</label>
            <input
              type="text"
              {...register('nomorBc11', { 
                required: 'Nomor BC11 is required',
                maxLength: { value: 20, message: 'Maximum 20 characters' }
              })}
              className="form-input"
              placeholder="Enter BC11 number"
            />
            {formErrors.nomorBc11 && <p className="form-error">{formErrors.nomorBc11.message}</p>}
          </div>

          <div>
            <label className="form-label required">Pos BC11</label>
            <input
              type="text"
              {...register('posBc11', { 
                required: 'Pos BC11 is required',
                maxLength: { value: 10, message: 'Maximum 10 characters' }
              })}
              className="form-input"
              placeholder="Enter Pos BC11"
            />
            {formErrors.posBc11 && <p className="form-error">{formErrors.posBc11.message}</p>}
          </div>

          <div>
            <label className="form-label required">Sub Pos BC11</label>
            <input
              type="text"
              {...register('subPosBc11', { 
                required: 'Sub Pos BC11 is required',
                maxLength: { value: 20, message: 'Maximum 20 characters' }
              })}
              className="form-input"
              placeholder="Enter Sub Pos BC11"
            />
            {formErrors.subPosBc11 && <p className="form-error">{formErrors.subPosBc11.message}</p>}
          </div>

          <div>
            <label className="form-label required">Tanggal AJU</label>
            <input
              type="date"
              {...register('tanggalAju', { required: 'Tanggal AJU is required' })}
              className="form-input"
            />
            {formErrors.tanggalAju && <p className="form-error">{formErrors.tanggalAju.message}</p>}
          </div>

          <div>
            <label className="form-label required">Tanggal BC11</label>
            <input
              type="date"
              {...register('tanggalBc11', { required: 'Tanggal BC11 is required' })}
              className="form-input"
            />
            {formErrors.tanggalBc11 && <p className="form-error">{formErrors.tanggalBc11.message}</p>}
          </div>
        </div>
      </div>

      {/* Signature Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Signature Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label required">Nama TTD</label>
            <input
              type="text"
              {...register('namaTtd', { 
                required: 'Nama TTD is required',
                maxLength: { value: 100, message: 'Maximum 100 characters' }
              })}
              className="form-input"
              placeholder="Enter signatory name"
            />
            <p className="form-help">Signatory name</p>
            {formErrors.namaTtd && <p className="form-error">{formErrors.namaTtd.message}</p>}
          </div>

          <div>
            <label className="form-label required">Jabatan TTD</label>
            <input
              type="text"
              {...register('jabatanTtd', { 
                required: 'Jabatan TTD is required',
                maxLength: { value: 100, message: 'Maximum 100 characters' }
              })}
              className="form-input"
              placeholder="Enter signatory position"
            />
            <p className="form-help">Signatory position</p>
            {formErrors.jabatanTtd && <p className="form-error">{formErrors.jabatanTtd.message}</p>}
          </div>

          <div>
            <label className="form-label required">Kota TTD</label>
            <input
              type="text"
              {...register('kotaTtd', { 
                required: 'Kota TTD is required',
                maxLength: { value: 100, message: 'Maximum 100 characters' }
              })}
              className="form-input"
              placeholder="Enter signature city"
            />
            <p className="form-help">Signature city</p>
            {formErrors.kotaTtd && <p className="form-error">{formErrors.kotaTtd.message}</p>}
          </div>

          <div>
            <label className="form-label required">Tanggal TTD</label>
            <input
              type="date"
              {...register('tanggalTtd', { required: 'Tanggal TTD is required' })}
              className="form-input"
            />
            {formErrors.tanggalTtd && <p className="form-error">{formErrors.tanggalTtd.message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
