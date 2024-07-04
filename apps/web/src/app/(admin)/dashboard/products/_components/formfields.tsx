import React from 'react';

import { Category } from '@/lib/types/category';

interface FormFieldsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  categories: Category[];
}

const FormFields: React.FC<FormFieldsProps> = ({ formData, handleChange, categories }) => (
  <div className="grid grid-cols-4 gap-4">
    <div className="col-span-4 md:col-span-2">
      <label className="block text-sm font-medium text-primary">
        Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="mt-1 block w-full border rounded-md p-2"
        required
      />
    </div>
    <div className="col-span-4 md:col-span-2">
      <label className="block text-sm font-medium text-primary">
        Slug <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="slug"
        value={formData.slug}
        onChange={handleChange}
        className="mt-1 block w-full border rounded-md p-2"
        required
      />
    </div>
    <div className="col-span-4">
      <label className="block text-sm font-medium text-primary">
        Description <span className="text-red-500">*</span>
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="mt-1 block w-full border rounded-md p-2"
        required
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <label className="block text-sm font-medium text-primary">
        Price <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        className="mt-1 block w-full border rounded-md p-2"
        required
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <label className="block text-sm font-medium text-primary">
        Pack Price <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        name="packPrice"
        value={formData.packPrice}
        onChange={handleChange}
        className="mt-1 block w-full border rounded-md p-2"
        required
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <label className="block text-sm font-medium text-primary">
        Discount Price
      </label>
      <input
        type="number"
        name="discountPrice"
        value={formData.discountPrice}
        onChange={handleChange}
        className="mt-1 block w-full border rounded-md p-2"
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <label className="block text-sm font-medium text-primary">
        Discount Pack Price
      </label>
      <input
        type="number"
        name="discountPackPrice"
        value={formData.discountPackPrice}
        onChange={handleChange}
        className="mt-1 block w-full border rounded-md p-2"
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <label className="block text-sm font-medium text-primary">
        Pack Quantity <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        name="packQuantity"
        value={formData.packQuantity}
        onChange={handleChange}
        className="mt-1 block w-full border rounded-md p-2"
        required
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <label className="block text-sm font-medium text-primary">
        Bonus
      </label>
      <input
        type="number"
        name="bonus"
        value={formData.bonus}
        onChange={handleChange}
        className="mt-1 block w-full border rounded-md p-2"
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <label className="block text-sm font-medium text-primary">
        Min Order Item
      </label>
      <input
        type="number"
        name="minOrderItem"
        value={formData.minOrderItem}
        onChange={handleChange}
        className="mt-1 block w-full border rounded-md p-2"
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <label className="block text-sm font-medium text-primary">
        Weight <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        name="weight"
        value={formData.weight}
        onChange={handleChange}
        className="mt-1 block w-full border rounded-md p-2"
        required
      />
    </div>
    <div className="col-span-4 md:col-span-1">
      <label className="block text-sm font-medium text-primary">
        Weight Pack <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        name="weightPack"
        value={formData.weightPack}
        onChange={handleChange}
        className="mt-1 block w-full border rounded-md p-2"
        required
      />
    </div>
    <div className="col-span-4 md:col-span-2">
      <label className="block text-sm font-medium text-primary">
        Status <span className="text-red-500">*</span>
      </label>
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="mt-1 block w-full border rounded-md p-2"
        required
      >
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
        <option value="INACTIVE">Inactive</option>
        <option value="SUSPENDED">Suspended</option>
      </select>
    </div>
    <div className="col-span-4 md:col-span-2">
      <label className="block text-sm font-medium text-primary">
        Category <span className="text-red-500">*</span>
      </label>
      <select
        name="categoryId"
        value={formData.categoryId}
        onChange={handleChange}
        className="mt-1 block w-full border rounded-md p-2"
        required
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default FormFields;
