import { useState } from 'react';

export const useFormData = (initialState: any) => {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  return {
    formData,
    handleChange,
    setFormData,
  };
};
