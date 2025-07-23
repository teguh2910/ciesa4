'use client';

import { useForm, useWatch } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { MainData } from '@/types';
import { validateRequiredFields, getTodayString } from '@/lib/utils';
import { FormField, SelectField, NumberField, DateField } from './FormField';

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
          <SelectField
            label="Asal Data"
            fieldName="asalData"
            context="main"
            required
            register={register('asalData', { required: 'Asal Data is required' })}
            error={formErrors.asalData?.message}
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
            error={formErrors.disclaimer?.message}
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
            error={formErrors.flagVd?.message}
          >
            <option value="">Select...</option>
            <option value="Y">Y - Ya</option>
            <option value="T">T - Tidak</option>
          </SelectField>

          <FormField
            label="ID Pengguna"
            fieldName="idPengguna"
            context="main"
            required
            type="text"
            register={register('idPengguna', {
              required: 'ID Pengguna is required',
              maxLength: { value: 50, message: 'Maximum 50 characters' }
            })}
            error={formErrors.idPengguna?.message}
            maxLength={50}
          />
        </div>
      </div>

      {/* Financial Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h3>
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
            error={formErrors.cif?.message}
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
            error={formErrors.bruto?.message}
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
            error={formErrors.netto?.message}
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
            error={formErrors.ndpbm?.message}
          />

          <NumberField
            label="VD"
            fieldName="vd"
            context="main"
            required
            step="0.01"
            min={0}
            register={register('vd', {
              required: 'VD is required',
              min: { value: 0, message: 'VD must be positive' }
            })}
            error={formErrors.vd?.message}
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
            error={formErrors.asuransi?.message}
          />
        </div>
      </div>

      {/* Document Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Document Information</h3>
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
            error={formErrors.nomorAju?.message}
            maxLength={26}
            pattern="^[A-Za-z0-9]{26}$"
          />

          <FormField
            label="Nomor BC11"
            fieldName="nomorBc11"
            context="main"
            required
            type="text"
            register={register('nomorBc11', {
              required: 'Nomor BC11 is required',
              maxLength: { value: 20, message: 'Maximum 20 characters' }
            })}
            error={formErrors.nomorBc11?.message}
            maxLength={20}
            helpText="Nomor dokumen BC 1.1 yang terkait"
          />

          <FormField
            label="Pos BC11"
            fieldName="posBc11"
            context="main"
            required
            type="text"
            register={register('posBc11', {
              required: 'Pos BC11 is required',
              maxLength: { value: 10, message: 'Maximum 10 characters' }
            })}
            error={formErrors.posBc11?.message}
            maxLength={10}
            helpText="Posisi barang dalam dokumen BC 1.1"
          />

          <FormField
            label="Sub Pos BC11"
            fieldName="subPosBc11"
            context="main"
            required
            type="text"
            register={register('subPosBc11', {
              required: 'Sub Pos BC11 is required',
              maxLength: { value: 20, message: 'Maximum 20 characters' }
            })}
            error={formErrors.subPosBc11?.message}
            maxLength={20}
            helpText="Sub posisi barang dalam dokumen BC 1.1"
          />

          <DateField
            label="Tanggal AJU"
            fieldName="tanggalAju"
            context="main"
            required
            register={register('tanggalAju', { required: 'Tanggal AJU is required' })}
            error={formErrors.tanggalAju?.message}
            helpText="Tanggal pengajuan dokumen"
          />

          <DateField
            label="Tanggal BC11"
            fieldName="tanggalBc11"
            context="main"
            required
            register={register('tanggalBc11', { required: 'Tanggal BC11 is required' })}
            error={formErrors.tanggalBc11?.message}
            helpText="Tanggal dokumen BC 1.1"
          />

          <DateField
            label="Tanggal Tiba"
            fieldName="tanggalTiba"
            context="main"
            required
            register={register('tanggalTiba', { required: 'Tanggal Tiba is required' })}
            error={formErrors.tanggalTiba?.message}
          />

          <DateField
            label="Tanggal TTD"
            fieldName="tanggalTtd"
            context="main"
            required
            register={register('tanggalTtd', { required: 'Tanggal TTD is required' })}
            error={formErrors.tanggalTtd?.message}
          />
        </div>
      </div>

      {/* Signature Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Signature Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            error={formErrors.namaTtd?.message}
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
            error={formErrors.jabatanTtd?.message}
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
            error={formErrors.kotaTtd?.message}
            maxLength={100}
          />
        </div>
      </div>

      {/* Additional BC20 Fields */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Kode Jenis Impor"
            fieldName="kodeJenisImpor"
            context="main"
            register={register('kodeJenisImpor')}
            error={formErrors.kodeJenisImpor?.message}
          >
            <option value="">Select...</option>
            <option value="1">1 - Untuk Dipakai</option>
            <option value="2">2 - Sementara</option>
            <option value="3">3 - Re-Impor</option>
          </SelectField>

          <SelectField
            label="Kode Cara Bayar"
            fieldName="kodeCaraBayar"
            context="main"
            register={register('kodeCaraBayar')}
            error={formErrors.kodeCaraBayar?.message}
          >
            <option value="">Select...</option>
            <option value="1">1 - Tunai</option>
            <option value="2">2 - Kredit</option>
            <option value="3">3 - Lainnya</option>
          </SelectField>

          <FormField
            label="Kode Kantor"
            fieldName="kodeKantor"
            context="main"
            type="text"
            register={register('kodeKantor')}
            error={formErrors.kodeKantor?.message}
            maxLength={6}
          />

          <FormField
            label="Kode Pelabuhan Muat"
            fieldName="kodePelMuat"
            context="main"
            type="text"
            register={register('kodePelMuat')}
            error={formErrors.kodePelMuat?.message}
            maxLength={5}
          />

          <FormField
            label="Kode Pelabuhan Tujuan"
            fieldName="kodePelTujuan"
            context="main"
            type="text"
            register={register('kodePelTujuan')}
            error={formErrors.kodePelTujuan?.message}
            maxLength={5}
          />

          <FormField
            label="Kode TPS"
            fieldName="kodeTps"
            context="main"
            type="text"
            register={register('kodeTps')}
            error={formErrors.kodeTps?.message}
          />

          <SelectField
            label="Kode Tutup PU"
            fieldName="kodeTutupPu"
            context="main"
            register={register('kodeTutupPu')}
            error={formErrors.kodeTutupPu?.message}
          >
            <option value="">Select...</option>
            <option value="11">11 - BC 1.1</option>
            <option value="12">12 - BC 1.2</option>
            <option value="14">14 - BC 1.4</option>
          </SelectField>

          <SelectField
            label="Kode Valuta"
            fieldName="kodeValuta"
            context="main"
            register={register('kodeValuta')}
            error={formErrors.kodeValuta?.message}
          >
            <option value="">Select...</option>
            <option value="USD">USD - US Dollar</option>
            <option value="IDR">IDR - Indonesian Rupiah</option>
            <option value="EUR">EUR - Euro</option>
            <option value="CNY">CNY - Chinese Yuan</option>
            <option value="JPY">JPY - Japanese Yen</option>
          </SelectField>

          <NumberField
            label="FOB"
            fieldName="fob"
            context="main"
            step="0.01"
            min={0}
            register={register('fob', {
              min: { value: 0, message: 'FOB must be positive' }
            })}
            error={formErrors.fob?.message}
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
            error={formErrors.freight?.message}
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
            error={formErrors.biayaTambahan?.message}
          />

          <NumberField
            label="Biaya Pengurang"
            fieldName="biayaPengurang"
            context="main"
            step="0.01"
            min={0}
            register={register('biayaPengurang', {
              min: { value: 0, message: 'Biaya Pengurang must be positive' }
            })}
            error={formErrors.biayaPengurang?.message}
          />

          <NumberField
            label="Jumlah Kontainer"
            fieldName="jumlahKontainer"
            context="main"
            min={1}
            register={register('jumlahKontainer', {
              min: { value: 1, message: 'Jumlah Kontainer must be at least 1' }
            })}
            error={formErrors.jumlahKontainer?.message}
          />
        </div>
      </div>
    </div>
  );
}
