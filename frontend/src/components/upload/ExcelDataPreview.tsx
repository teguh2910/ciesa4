'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Package, Building2, Container, Truck, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExcelData } from '@/types';
import { cn } from '@/lib/utils';

interface ExcelDataPreviewProps {
  data: ExcelData;
  className?: string;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

function Section({ title, icon, count, children, defaultExpanded = false }: SectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center">
          {icon}
          <span className="font-medium text-gray-900">{title}</span>
          <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
            {count} {count === 1 ? 'item' : 'items'}
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DataTable({ data, headers }: { data: any[]; headers: string[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.slice(0, 5).map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {headers.map((header) => (
                <td key={header} className="px-3 py-2 text-sm text-gray-900">
                  {item[header] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 5 && (
        <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 text-center">
          ... and {data.length - 5} more items
        </div>
      )}
    </div>
  );
}

function MainDataPreview({ data }: { data: any }) {
  const fields = [
    { key: 'asalData', label: 'Asal Data' },
    { key: 'nomorAju', label: 'Nomor AJU' },
    { key: 'nomorBc11', label: 'Nomor BC 1.1' },
    { key: 'tanggalAju', label: 'Tanggal AJU' },
    { key: 'cif', label: 'CIF' },
    { key: 'bruto', label: 'Bruto' },
    { key: 'netto', label: 'Netto' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {fields.map(({ key, label }) => (
        <div key={key} className="bg-gray-50 p-3 rounded">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {label}
          </div>
          <div className="mt-1 text-sm text-gray-900">
            {data[key] || '-'}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ExcelDataPreview({ data, className }: ExcelDataPreviewProps) {
  const sections = [
    {
      key: 'MainData',
      title: 'Main Data',
      icon: <FileText className="w-5 h-5 text-blue-600 mr-2" />,
      count: data.MainData ? 1 : 0,
      defaultExpanded: true,
    },
    {
      key: 'Barang',
      title: 'Barang (Goods)',
      icon: <Package className="w-5 h-5 text-green-600 mr-2" />,
      count: data.Barang?.length || 0,
    },
    {
      key: 'Entitas',
      title: 'Entitas (Entities)',
      icon: <Building2 className="w-5 h-5 text-purple-600 mr-2" />,
      count: data.Entitas?.length || 0,
    },
    {
      key: 'Kemasan',
      title: 'Kemasan (Packaging)',
      icon: <Package className="w-5 h-5 text-orange-600 mr-2" />,
      count: data.Kemasan?.length || 0,
    },
    {
      key: 'Kontainer',
      title: 'Kontainer (Containers)',
      icon: <Container className="w-5 h-5 text-indigo-600 mr-2" />,
      count: data.Kontainer?.length || 0,
    },
    {
      key: 'Dokumen',
      title: 'Dokumen (Documents)',
      icon: <FileCheck className="w-5 h-5 text-red-600 mr-2" />,
      count: data.Dokumen?.length || 0,
    },
    {
      key: 'Pengangkut',
      title: 'Pengangkut (Transportation)',
      icon: <Truck className="w-5 h-5 text-yellow-600 mr-2" />,
      count: data.Pengangkut?.length || 0,
    },
  ];

  const getTableHeaders = (key: string) => {
    switch (key) {
      case 'Barang':
        return ['uraian', 'merk', 'tipe', 'ukuran', 'spesifikasiLain', 'kodeHs'];
      case 'Entitas':
        return ['jenisEntitas', 'namaEntitas', 'alamatEntitas', 'negaraEntitas'];
      case 'Kemasan':
        return ['jenisKemasan', 'jumlahKemasan', 'merkKemasan'];
      case 'Kontainer':
        return ['nomorKontainer', 'ukuranKontainer', 'jenisKontainer'];
      case 'Dokumen':
        return ['kodeDokumen', 'nomorDokumen', 'tanggalDokumen'];
      case 'Pengangkut':
        return ['namaPengangkut', 'bendera', 'callSign'];
      default:
        return [];
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Parsed Excel Data
        </h3>
        <div className="text-sm text-gray-600">
          {sections.reduce((total, section) => total + section.count, 0)} total items
        </div>
      </div>

      {sections.map((section) => (
        <Section
          key={section.key}
          title={section.title}
          icon={section.icon}
          count={section.count}
          defaultExpanded={section.defaultExpanded}
        >
          {section.key === 'MainData' && data.MainData ? (
            <MainDataPreview data={data.MainData} />
          ) : (
            <DataTable
              data={data[section.key as keyof ExcelData] as any[] || []}
              headers={getTableHeaders(section.key)}
            />
          )}
        </Section>
      ))}
    </div>
  );
}
