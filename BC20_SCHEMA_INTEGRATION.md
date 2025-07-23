# BC20 Schema Enhanced Form Integration

This document describes the implementation of enhanced form fields that integrate descriptions and references from the `bc20-schema-enhanced.json` file into the manual input forms.

## Overview

The implementation adds detailed field descriptions, examples, validation constraints, and technical specifications from the BC20 schema directly into the form interface, providing users with comprehensive guidance while filling out customs import forms.

## Key Features

### 1. Enhanced Form Fields
- **Expandable descriptions**: Click the "Info" button to see detailed field descriptions
- **Schema-based examples**: Automatic examples from the BC20 schema
- **Technical constraints**: Display validation rules, format requirements, and data types
- **Contextual help**: Different descriptions for main form vs. sub-forms (barang, entitas, etc.)

### 2. Schema Integration
- **Automatic metadata extraction**: Field descriptions pulled from `bc20-schema-enhanced.json`
- **Multi-context support**: Different metadata for main, barang, entitas, kemasan, dokumen, and pengangkut contexts
- **Validation alignment**: Form validation rules match schema constraints

### 3. User Experience Improvements
- **Progressive disclosure**: Basic description always visible, detailed info on demand
- **Visual hierarchy**: Clear distinction between description, examples, and constraints
- **Responsive design**: Works on desktop and mobile devices

## Implementation Details

### Files Modified/Created

1. **`frontend/src/lib/utils.ts`**
   - Added `FieldMetadata` interface
   - Added comprehensive field metadata constants:
     - `BC20_FIELD_METADATA` - Main form fields
     - `BARANG_FIELD_METADATA` - Goods information fields
     - `ENTITAS_FIELD_METADATA` - Entity information fields
     - `KEMASAN_FIELD_METADATA` - Packaging fields
     - `DOKUMEN_FIELD_METADATA` - Document fields
     - `PENGANGKUT_FIELD_METADATA` - Transportation fields
   - Added `getFieldMetadata()` helper function

2. **`frontend/src/components/forms/FormField.tsx`** (New)
   - Reusable form field component with schema integration
   - Expandable info sections with detailed descriptions
   - Support for text, number, select, textarea, and date inputs
   - Convenience components: `SelectField`, `NumberField`, `DateField`, `TextAreaField`

3. **`frontend/src/components/forms/MainDataForm.tsx`**
   - Updated to use new FormField components
   - Added comprehensive BC20 fields with schema descriptions
   - Organized into logical sections: Basic, Financial, Document, Signature, Additional

4. **`frontend/src/components/forms/BarangForm.tsx`**
   - Updated key fields to use FormField components with barang context
   - Enhanced with schema-based descriptions for goods information

5. **`frontend/src/components/forms/EntitasForm.tsx`**
   - Updated to use FormField components with entitas context
   - Enhanced entity information fields with proper descriptions

6. **`frontend/src/app/demo-schema/page.tsx`** (New)
   - Demonstration page showing enhanced form fields
   - Examples of all field types with BC20 schema integration

### Schema Metadata Structure

Each field metadata includes:
```typescript
interface FieldMetadata {
  description: string;        // Main field description
  message?: string;          // Format/validation message
  examples?: any[];          // Example values
  enum?: string[];           // Valid enum values
  const?: string;            // Constant value
  maxlength?: number;        // Maximum length
  multipleOf?: number;       // Decimal precision
  format?: string;           // Data format (e.g., "date")
  pattern?: string;          // Regex pattern
}
```

### Usage Examples

#### Basic Form Field
```tsx
<FormField
  label="Asal Data"
  fieldName="asalData"
  context="main"
  required
  type="text"
  register={register('asalData', { required: 'Required' })}
  error={errors.asalData?.message}
/>
```

#### Select Field with Schema Integration
```tsx
<SelectField
  label="Flag VD"
  fieldName="flagVd"
  context="main"
  required
  register={register('flagVd', { required: 'Required' })}
  error={errors.flagVd?.message}
>
  <option value="">Select...</option>
  <option value="Y">Y - Ya</option>
  <option value="T">T - Tidak</option>
</SelectField>
```

#### Number Field with Constraints
```tsx
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
  error={errors.cif?.message}
/>
```

## Benefits

### For Users
1. **Better Understanding**: Detailed descriptions help users understand what each field requires
2. **Reduced Errors**: Examples and format specifications reduce input errors
3. **Compliance**: Schema-based validation ensures data meets BC20 requirements
4. **Efficiency**: Quick access to field information without external documentation

### For Developers
1. **Maintainability**: Centralized schema metadata makes updates easier
2. **Consistency**: Standardized field components ensure uniform behavior
3. **Reusability**: FormField components can be used across different forms
4. **Validation**: Automatic alignment between schema and form validation

## Testing

### Demo Page
Visit `/demo-schema` to see the enhanced form fields in action:
- Click "Info" buttons to expand field descriptions
- See examples, constraints, and technical specifications
- Test different field types and contexts

### Manual Input Form
The main manual input form at `/manual-input` now includes:
- Enhanced descriptions for all BC20 fields
- Better organization with additional field sections
- Schema-based validation and examples

## Future Enhancements

1. **Dynamic Schema Loading**: Load schema from API instead of static constants
2. **Multi-language Support**: Translate descriptions based on user locale
3. **Field Dependencies**: Show/hide fields based on other field values
4. **Advanced Validation**: Real-time validation with schema constraints
5. **Help System**: Integrated help system with search functionality

## Conclusion

This implementation significantly improves the user experience of the BC20 customs import form by integrating comprehensive field descriptions and guidance directly from the official schema. Users now have immediate access to detailed information about each field, reducing errors and improving compliance with customs requirements.
