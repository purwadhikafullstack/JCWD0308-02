import React from 'react';

interface FormMessageProps {
  children: React.ReactNode;
}

const FormMessage: React.FC<FormMessageProps> = ({ children }) => {
  const messages = Array.isArray(children) ? children : [children];

  return (
    <>
      {messages.map((msg, i) => (
        <p key={i} className="text-sm font-medium text-destructive">
          {msg}
        </p>
      ))}
    </>
  );
};

export default FormMessage;
