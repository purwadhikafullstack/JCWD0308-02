import React from 'react';

import { Category } from '@/lib/types/category';
import InputField from './InputField';
import TextAreaField from './TextAreaField';
import SelectField from './SelectField';

interface FormFieldsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  categories: Category[];
}

const FormFields: React.FC<FormFieldsProps> = ({ formData, handleChange, categories }) => (
  <div className="grid grid-cols-4 gap-4">
    <div className="col-span-4 md:col-span-2">
      <InputField 
        label="Title" 
        name="title" 
        value={formData.title} 
        onChange={handleChange} 
        required 
      />
    </div>
    <div className="col-span-4 md:col-span-2">
      <InputField 
        label="Slug" 
        name="slug" 
        value={formData.slug} 
        onChange={handleChange} 
        required 
      />
    </div>
    <div className="col-span-4">
      <TextAreaField 
        label="Description" 
        name="description" 
        value={formData.description} 
        onChange={handleChange} 
        required 
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <InputField 
        label="Price" 
        name="price" 
        value={formData.price} 
        onChange={handleChange} 
        type="number" 
        required 
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <InputField 
        label="Pack Price" 
        name="packPrice" 
        value={formData.packPrice} 
        onChange={handleChange} 
        type="number" 
        required 
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <InputField 
        label="Discount Price" 
        name="discountPrice" 
        value={formData.discountPrice} 
        onChange={handleChange} 
        type="number" 
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <InputField 
        label="Discount Pack Price" 
        name="discountPackPrice" 
        value={formData.discountPackPrice} 
        onChange={handleChange} 
        type="number" 
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <InputField 
        label="Pack Quantity" 
        name="packQuantity" 
        value={formData.packQuantity} 
        onChange={handleChange} 
        type="number" 
        required 
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <InputField 
        label="Bonus" 
        name="bonus" 
        value={formData.bonus} 
        onChange={handleChange} 
        type="number" 
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <InputField 
        label="Min Order Item" 
        name="minOrderItem" 
        value={formData.minOrderItem} 
        onChange={handleChange} 
        type="number" 
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <InputField 
        label="Weight" 
        name="weight" 
        value={formData.weight} 
        onChange={handleChange} 
        type="number" 
        required 
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <InputField 
        label="Weight Pack" 
        name="weightPack" 
        value={formData.weightPack} 
        onChange={handleChange} 
        type="number" 
        required 
      />
    </div>
    <div className="col-span-4 md:col-span-2">
      <SelectField
        label="Status" 
        name="status" 
        value={formData.status} 
        onChange={handleChange} 
        options={[
          { value: 'DRAFT', label: 'Draft' },
          { value: 'PUBLISHED', label: 'Published' },
          { value: 'INACTIVE', label: 'Inactive' },
          { value: 'SUSPENDED', label: 'Suspended' }
        ]}
        required 
      />
    </div>
    <div className="col-span-4 md:col-span-2">
      <SelectField 
        label="Category" 
        name="categoryId" 
        value={formData.categoryId} 
        onChange={handleChange} 
        options={categories.map(category => ({ value: category.id, label: category.name }))}
        required 
      />
    </div>
  </div>
);

export default FormFields;
