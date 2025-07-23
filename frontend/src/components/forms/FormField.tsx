'use client';

import React, { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { cn, getFieldMetadata, FieldMetadata } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  fieldName: string;
  context?: 'main' | 'barang' | 'entitas' | 'kemasan' | 'dokumen' | 'pengangkut';
  required?: boolean;
  type?: 'text' | 'number' | 'email' | 'tel' | 'url' | 'password' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  register?: UseFormRegisterReturn;
  error?: string;
  children?: React.ReactNode; // For select options or custom content
  className?: string;
  step?: string | number;
  min?: string | number;
  max?: string | number;
  maxLength?: number;
  pattern?: string;
  disabled?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  helpText?: string; // Custom help text to override schema description
}

export function FormField({
  label,
  fieldName,
  context = 'main',
  required = false,
  type = 'text',
  placeholder,
  register,
  error,
  children,
  className,
  step,
  min,
  max,
  maxLength,
  pattern,
  disabled = false,
  value,
  onChange,
  helpText,
}: FormFieldProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Get field metadata from schema
  const metadata: FieldMetadata | null = getFieldMetadata(fieldName, context);
  
  // Use custom help text or schema description
  const description = helpText || metadata?.description;
  const message = metadata?.message;
  const examples = metadata?.examples;
  const enumValues = metadata?.enum;
  
  // Determine input props
  const inputProps = {
    className: cn(
      'form-input',
      error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
      className
    ),
    placeholder: placeholder || (examples && examples.length > 0 ? `e.g., ${examples[0]}` : ''),
    disabled,
    ...(register || {}),
    ...(value !== undefined && { value }),
    ...(onChange && { onChange }),
    ...(step && { step }),
    ...(min !== undefined && { min }),
    ...(max !== undefined && { max }),
    ...(maxLength && { maxLength }),
    ...(pattern && { pattern }),
  };

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select {...inputProps}>
            {children}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            {...inputProps}
            rows={3}
          />
        );
      default:
        return (
          <input
            type={type}
            {...inputProps}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label className={cn('form-label', required && 'required')}>
          {label}
        </label>
        
        {/* Info button to show/hide details */}
        {(description || message || examples) && (
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Info className="w-4 h-4 mr-1" />
            Info
            {showDetails ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </button>
        )}
      </div>

      {/* Input field */}
      {renderInput()}

      {/* Basic help text (always visible) */}
      {description && !showDetails && (
        <p className="form-help text-sm">
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>
      )}

      {/* Detailed information (expandable) */}
      {showDetails && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          {/* Full description */}
          {description && (
            <div>
              <h5 className="font-medium text-blue-900 mb-1">Description</h5>
              <p className="text-sm text-blue-800">{description}</p>
            </div>
          )}

          {/* Additional message */}
          {message && message !== description && (
            <div>
              <h5 className="font-medium text-blue-900 mb-1">Format Requirements</h5>
              <p className="text-sm text-blue-800">{message}</p>
            </div>
          )}

          {/* Examples */}
          {examples && examples.length > 0 && (
            <div>
              <h5 className="font-medium text-blue-900 mb-1">Examples</h5>
              <div className="flex flex-wrap gap-2">
                {examples.slice(0, 5).map((example, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    {String(example)}
                  </span>
                ))}
                {examples.length > 5 && (
                  <span className="text-xs text-blue-600">
                    +{examples.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Enum values */}
          {enumValues && enumValues.length > 0 && (
            <div>
              <h5 className="font-medium text-blue-900 mb-1">Valid Values</h5>
              <div className="flex flex-wrap gap-2">
                {enumValues.map((value, index) => (
                  <span
                    key={index}
                    className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Technical constraints */}
          {(metadata?.maxlength || metadata?.multipleOf || metadata?.pattern) && (
            <div>
              <h5 className="font-medium text-blue-900 mb-1">Technical Constraints</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                {metadata.maxlength && (
                  <li>• Maximum length: {metadata.maxlength} digits</li>
                )}
                {metadata.multipleOf && (
                  <li>• Decimal precision: {metadata.multipleOf === 0.01 ? '2' : '4'} decimal places</li>
                )}
                {metadata.pattern && (
                  <li>• Pattern: {metadata.pattern}</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="form-error text-sm">{error}</p>
      )}
    </div>
  );
}

// Convenience components for specific field types
export function SelectField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField {...props} type="select" />;
}

export function NumberField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField {...props} type="number" />;
}

export function DateField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField {...props} type="date" />;
}

export function TextAreaField(props: Omit<FormFieldProps, 'type'>) {
  return <FormField {...props} type="textarea" />;
}
