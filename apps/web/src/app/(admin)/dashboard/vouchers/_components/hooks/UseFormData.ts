"use client";
import { useState } from 'react';

export const useFormData = (initialState: any) => {
  const [formData, setFormData] = useState({
    ...initialState,
    expiresAt: new Date(initialState.expiresAt)
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prevData: any) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : type === 'date' ? new Date(value) : value,
    }));
  };

  return {
    formData,
    handleChange,
    setFormData,
  };
};
