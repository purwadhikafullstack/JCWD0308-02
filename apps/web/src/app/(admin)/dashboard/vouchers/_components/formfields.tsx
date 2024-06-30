import React from 'react';

interface FormFieldsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const FormFields: React.FC<FormFieldsProps> = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-black rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Code</label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="mt-1 block w-full border border-black rounded-md"
        />
      </div>
      <div className="col-span-full mb-4">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-black rounded-md"
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Voucher Type</label>
        <select
          name="voucherType"
          value={formData.voucherType}
          onChange={handleChange}
          className="mt-1 block w-full border border-black rounded-md"
        >
          <option value="PRODUCT">Product</option>
          <option value="SHIPPING_COST">Shipping Cost</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Discount Type</label>
        <select
          name="discountType"
          value={formData.discountType}
          onChange={handleChange}
          className="mt-1 block w-full border border-black rounded-md"
        >
          <option value="FIXED_DISCOUNT">Fixed Discount</option>
          <option value="DISCOUNT">Discount</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Fixed Discount</label>
        <input
          type="number"
          name="fixedDiscount"
          value={formData.fixedDiscount}
          onChange={handleChange}
          className="mt-1 block w-full border border-black rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Discount</label>
        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          className="mt-1 block w-full border border-black rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="mt-1 block w-full border border-black rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Minimum Order Price</label>
        <input
          type="number"
          name="minOrderPrice"
          value={formData.minOrderPrice}
          onChange={handleChange}
          className="mt-1 block w-full border border-black rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Minimum Order Item</label>
        <input
          type="number"
          name="minOrderItem"
          value={formData.minOrderItem}
          onChange={handleChange}
          className="mt-1 block w-full border border-black rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
        <input
          type="date"
          name="expiresAt"
          value={(formData.expiresAt instanceof Date ? formData.expiresAt : new Date(formData.expiresAt)).toISOString().split('T')[0]}
          onChange={handleChange}
          className="mt-1 block w-full border border-black rounded-md"
        />
      </div>
      <div className="col-span-full mb-4">
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <input
          type="file"
          name="image"
          onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
          className="mt-1 block w-full border border-black rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Is Claimable</label>
        <input
          type="checkbox"
          name="isClaimable"
          checked={formData.isClaimable}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Is Private</label>
        <input
          type="checkbox"
          name="isPrivate"
          checked={formData.isPrivate}
          onChange={handleChange}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default FormFields;
