'use client';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LogoContext } from '@/context';
import { useRef, useContext } from 'react';
import Image from 'next/image';
import { message } from 'antd';
import { axiosInstance } from '@/service/axiosInstance';
import {
  BannersDataType,
  CategoryDataType,
  OffersDataType,
  ProductsDataType,
} from '@/types';

interface UploadImageProps {
  imageUrl?: string | null;
  record:
    | ProductsDataType
    | CategoryDataType
    | OffersDataType
    | BannersDataType;
}

export default function UploadImage({
  imageUrl = null,
  record,
}: UploadImageProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const logoContext = useContext(LogoContext);
  const { logo } = logoContext;

  const handleIconClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleIconClick();
    }
  };

  const resizeImage = (
    file: File,
    width: number,
    height: number,
  ): Promise<File | null> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
              });
              resolve(resizedFile);
            } else {
              resolve(null);
            }
          }, file.type);
        };
      };
    });

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('images', file);

    try {
      let urlSlug: string = '';
      if ('product' in record) urlSlug = 'product';
      else if ('categoryName' in record) urlSlug = 'category';
      else if ('offerName' in record) urlSlug = 'offer';
      else if ('bannerName' in record) urlSlug = 'banner';
      else {
        throw new Error('Invalid record type');
      }

      const response = await axiosInstance.post(
        `/images/${urlSlug}/${record.key}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status === 201) {
        message.success('Image upload successful');
      } else {
        message.error('Failed to upload image');
      }
    } catch (error) {
      message.error('An error occurred while uploading the image');
    } finally {
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageFile = e.target.files[0];
      if (!imageFile) {
        message.error('Please select an image file');
        return;
      }

      const img = document.createElement('img');
      const objectUrl = URL.createObjectURL(imageFile);
      img.src = objectUrl;
      img.onload = async () => {
        const aspectRatio = img.width / img.height;

        if (aspectRatio !== 1) {
          message.error('Image must have a 1:1 aspect ratio');
          return;
        }

        if (img.width !== 512 || img.height !== 512) {
          const resizedImageFile = await resizeImage(imageFile, 512, 512);
          if (resizedImageFile) {
            await uploadImage(resizedImageFile);
          }
        } else {
          await uploadImage(imageFile);
        }

        // Revoke the object URL after using it
        URL.revokeObjectURL(objectUrl);
      };

      img.onerror = () => {
        message.error('Invalid image file');
        URL.revokeObjectURL(objectUrl);
      };
    }
  };

  return (
    <div className="h-15 group flex w-full items-center justify-center rounded-full p-2 text-center hover:cursor-pointer">
      <Image
        src={imageUrl || logo || '/assets/avatar.png'}
        alt="offer"
        className="duration-400 rounded-lg object-cover group-hover:hidden"
        width={80}
        height={80}
        priority
      />
      <div
        onClick={handleIconClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Upload image"
      >
        <FontAwesomeIcon
          icon={faPlus}
          className="duration-400 hidden rounded-full bg-slate-400 p-3 text-[1.2rem] text-white group-hover:flex"
        />
        <input
          id="restaurant"
          name="restaurant"
          type="file"
          className="hidden p-[0.5rem] text-[1.2rem] font-medium"
          accept="image/*"
          onChange={handleFileChange}
          ref={inputFileRef}
        />
      </div>
    </div>
  );
}
