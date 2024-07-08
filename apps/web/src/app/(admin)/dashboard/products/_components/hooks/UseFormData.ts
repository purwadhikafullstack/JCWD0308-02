"use client";
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  return { formData, handleChange, handleImageChange, images, previewUrls, setFormData, setImages, setPreviewUrls };
};
