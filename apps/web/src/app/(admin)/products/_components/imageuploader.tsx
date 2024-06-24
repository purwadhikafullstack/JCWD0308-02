import React from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  previewUrls: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  setPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ previewUrls, handleImageChange, setImages, setPreviewUrls }) => (
  <>
    <div className="col-span-4">
      <label className="block text-sm font-medium text-gray-700">Images</label>
      <input
        type="file"
        multiple
        onChange={handleImageChange}
        className="mt-1 block w-full border rounded-md p-2"
      />
    </div>
    <div className="col-span-4 grid grid-cols-3 gap-4 mt-4">
      {previewUrls.map((url, index) => (
        <div key={index} className="relative w-full h-32">
          <Image src={url} alt={`Preview ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md" />
          <button
            type="button"
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            onClick={() => {
              setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
              setImages((prev) => prev.filter((_, i) => i !== index));
            }}
          >
            X
          </button>
        </div>
      ))}
    </div>
  </>
);

export default ImageUploader;
