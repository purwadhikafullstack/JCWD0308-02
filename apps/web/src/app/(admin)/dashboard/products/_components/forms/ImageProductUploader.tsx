"use client";
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/lib/types/product';

interface ImageUploaderProps {
  previewUrls: string[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  setPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
  existingImages?: ProductImage[];
  handleRemoveImage?: (imageUrl: string, imageId?: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  previewUrls,
  handleImageChange,
  setImages,
  setPreviewUrls,
  existingImages = [],
  handleRemoveImage,
}) => (
  <>
    <div className="col-span-4">
      <label className="block text-sm font-medium text-primary mt-2">Images</label>
      <input
        type="file"
        multiple
        onChange={handleImageChange}
        className="mt-1 block w-full border rounded-md p-2"
      />
    </div>
    <div className="col-span-4 grid grid-cols-3 gap-4 mt-4">
      {existingImages.map((image) => (
        <div key={image.id} className="relative w-full h-32">
          <Image src={image.imageUrl} alt={`Image ${image.id}`} layout="fill" objectFit="cover" className="rounded-md" />
          {handleRemoveImage && (
            <Button
              type="button"
              className="absolute top-0 right-0 rounded-full size-2"
              variant="destructive"
              onClick={() => handleRemoveImage(image.imageUrl, image.id)}
            >
              X
            </Button>
          )}
        </div>
      ))}
      {previewUrls.map((url, index) => (
        <div key={index} className="relative w-full h-32">
          <Image src={url} alt={`Preview ${index + 1}`} layout="fill" objectFit="cover" className="rounded-md" />
          <Button
            type="button"
            className="absolute top-0 right-0 rounded-full size-2"
            variant="destructive"
            onClick={() => setPreviewUrls((prev) => prev.filter((item) => item !== url))}
          >
            X
          </Button>
        </div>
      ))}
    </div>
  </>
);

export default ImageUploader;
