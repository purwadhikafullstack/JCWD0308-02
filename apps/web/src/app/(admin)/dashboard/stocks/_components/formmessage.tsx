// formmessage.tsx
import React from 'react';

interface FormMessageProps {
  children: React.ReactNode;
}

const FormMessage: React.FC<FormMessageProps> = ({ children }) => (
  <p className="text-sm text-red-600 mt-1">
    {children}
  </p>
);

export default FormMessage;
