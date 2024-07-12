import { useState } from 'react';

export const useFormData = () => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: 0,
    packPrice: 0,
    discountPrice: 0,
    discountPackPrice: 0,
    packQuantity: 0,
    bonus: 0,
    minOrderItem: 0,
    weight: 0,
    weightPack: 0,
    status: 'DRAFT',
    categoryId: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => validateFileExtension(file.name));

    if (validFiles.length !== files.length) {
      alert('Some files have invalid extensions and were not added.');
    }

    setImages(validFiles);
    const urls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  return {
    formData,
    handleChange,
    handleImageChange,
    images,
    previewUrls,
    setFormData,
    setImages,
    setPreviewUrls,
  };
};

export const validateFileExtension = (fileName: string) => {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const fileExtension = fileName.split('.').pop()?.toLowerCase();
  return fileExtension && allowedExtensions.includes(fileExtension);
};
