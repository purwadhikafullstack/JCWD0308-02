import React from 'react';
import { Button } from '@/components/ui/button';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
  message: string;
  onClose: () => void;
  isError: boolean;
}

const Modal: React.FC<ModalProps> = ({ message, onClose, isError }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-md shadow-lg w-11/12 sm:w-3/4 lg:w-1/3 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={20} />
        </button>
        <h2 className={`text-2xl mb-6 font-bold text-center ${isError ? 'text-red-600' : 'text-indigo-600'}`}>
          {isError ? 'Error' : 'Notification'}
        </h2>
        <p className={`text-center mb-6 ${isError ? 'text-red-600' : ''}`}>{message}</p>
        {!isError && (
          <div className="flex justify-center">
            <Button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Okay
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
