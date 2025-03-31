"use client";
import React, { useRef, useState } from "react";
import { message, Modal } from "antd";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import LogoAlignSection from "../LogoAlignSection";
import { StartShapeEditorProps } from "@/utils/componentTypes";
import { dualColors } from "@/utils/utils";
import GalleryEditIcon from "@/public/icons/gallery_edit";
import GalleryIcon from "@/public/icons/gallery";
import SendSquareIcon from "@/public/icons/send_quare";

const startPageInputClass =
  "w-full !h-[30px] bg-[#E6E6E6] !rounded-[10px] !text-[13px] mt-[14px] border-none placeholder:text-[#B3B3B3] placeholder:text-[13px] placeholder:font-normal";

const StartShapeEditor = ({
  id,
  themeId,
  setThemeId,
  uploadedImage,
  setUploadedImage,
  startPage,
  setStartPage,
}: StartShapeEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      message.error("Зураг 1MB-аас хэтэрч болохгүй!");
      return;
    }
    setFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;

      img.onload = () => {
        if (img.width !== img.height) {
          message.error("Зураг зөвхөн 1:1 харьцаатай байх ёстой!");
          return;
        }
        setUploadedImage(reader.result as string);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleClickColor = (index: number) => {
    setThemeId(index);
  };

  return (
    <div>
      <div className="px-5">
        <div className="rounded-[10px] bg-[#F5F5F5] w-full h-[80px] mt-[10px] p-[10px] flex flex-col justify-between">
          <div className="flex items-center">
            <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
              Гарчиг
            </p>
          </div>
          <CustomInput
            onChange={(e: any) =>
              setStartPage((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            value={startPage?.title}
            className={startPageInputClass}
            placeholder="Судалгааны нэр"
          />
        </div>
        <div className="rounded-[10px] bg-[#F5F5F5] w-full mt-[10px] h-[80px] p-[10px] flex flex-col justify-between">
          <div className="flex items-center">
            <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
              Тайлбар
            </p>
          </div>
          <CustomInput
            value={startPage?.greetingMessage}
            onChange={(e: any) =>
              setStartPage((prev) => ({
                ...prev,
                greetingMessage: e.target.value,
              }))
            }
            className="w-full bg-[#E6E6E6] !rounded-[10px] !text-[13px] mt-[14px] border-none placeholder:text-[#B3B3B3] placeholder:text-[13px] placeholder:font-normal"
            placeholder="Судалгааны тайлбар"
            itemType="textarea"
          />
        </div>
        <div className="rounded-[10px] bg-[#F5F5F5] w-full h-[80px] mt-[10px] p-[10px] flex flex-col justify-between">
          <div className="flex items-center">
            <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
              Товч
            </p>
          </div>
          <CustomInput
            value={startPage?.btnLabel}
            onChange={(e: any) =>
              setStartPage((prev) => ({
                ...prev,
                btnLabel: e.target.value,
              }))
            }
            className={`${startPageInputClass} px-4`}
            placeholder="Товч"
          />
        </div>
        <div className="rounded-[10px] bg-[#F5F5F5] w-full h-[90px] mt-5 p-[10px]">
          <div className="flex items-center">
            <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
              Өнгө
            </p>
          </div>
          <div className="flex justify-between mt-[14px]">
            {dualColors.map(([color1, color2], index) => (
              <div
                onClick={() => handleClickColor(index)}
                key={index}
                className={`w-10 h-10 rounded-[10px] border cursor-pointer relative ${
                  themeId === index
                    ? "border-[2px] border-[#303030]"
                    : "border-none"
                }`}
                style={{
                  background: `linear-gradient(to right, ${color1} 50%, ${color2} 50%)`,
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className="rounded-[10px] bg-[#F5F5F5] w-full mt-[10px] p-[10px]">
          <div className="flex items-center">
            <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
              Дүрс & Лого
            </p>
          </div>
          {!uploadedImage ? (
            <div
              onClick={() => setIsModalOpen(true)}
              className="bg-[#E6E6E6] rounded-[10px] w-full h-[100px] flex justify-center items-center text-[#303030] mt-[14px] cursor-pointer"
            >
              <GalleryIcon className="w-6 h-6" />
            </div>
          ) : (
            <div className="bg-black w-full flex items-center justify-center mt-[14px] rounded-[10px] h-[100px] gap-x-5">
              <img
                src={uploadedImage}
                className="rounded-[5px]"
                style={{ width: 80, height: 80 }}
                alt="Uploaded Preview"
              />
              <GalleryEditIcon
                className="w-6 h-6 cursor-pointer text-[#FDFDFD]"
                onClick={() => setIsModalOpen(true)}
              />
            </div>
          )}

          <LogoAlignSection
          />
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="font-open"
        width={500}
        height={500}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {!uploadedImage ? (
          <div className="flex flex-col items-center mt-[50px]">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-[2px] border-[#D9D9D9] rounded-[10px] px-[45px] py-[10px] cursor-pointer"
            >
              <SendSquareIcon />
            </div>
            <p className="text-black text-[13px] leading-[14.6px] font-medium mt-5">
              Лого зураг оруулах
            </p>
            <div className="bg-[#F4F6F8] w-full mt-[126px] h-10 flex items-center justify-center rounded-full">
              <p className="text-black text-[13px] italic">
                Зургийн хэмжээ 1:1, 1mb -ээс ихгүй байх шаардлагатай
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center mt-[50px]">
              <img
                src={uploadedImage}
                className="rounded-[10px]"
                style={{ width: 200, height: 200 }}
                alt="Uploaded Preview"
              />
            </div>
          </>
        )}
        <div className="flex items-center justify-end mt-5 gap-x-4">
          <CustomButton
            onClick={() => fileInputRef.current?.click()}
            titleClassname="text-[14px] font-semibold"
            title="Дахин сонгох"
          />
          <CustomButton
            loading={loading}
            disabled={loading}
            // onClick={handleUpload}
            titleClassname="text-[14px] font-semibold"
            className="bg-[#071522] w-[109px] h-[35px] text-[#FDFDFD] rounded-md"
            title="Хадгалах"
          />
        </div>
      </Modal>
    </div>
  );
};

export default StartShapeEditor;
