"use client";
import React, { useState } from "react";
import { Button, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import CustomInput from "../CustomInput";
import { StartShapeEditorProps } from "@/utils/componentTypes";
import { dualColors } from "@/utils/utils";
import { useTranslation } from "react-i18next";
import TextArea from "antd/es/input/TextArea";

const startPageInputClass =
  "w-full !h-[30px] bg-[#E6E6E6] !rounded-[10px] !text-[13px] mt-[14px] border-none placeholder:text-[#B3B3B3] placeholder:text-[13px] placeholder:font-normal";

const StartShapeEditor = ({
  id,
  themeId,
  setThemeId,
  startPage,
  setStartPage,
}: StartShapeEditorProps) => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<any[]>([]);

  const handleFileChange = ({ fileList }: { fileList: any[] }) => {
    const file = fileList[0];
    setFileList(fileList.slice(-1));

    if (file && file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setStartPage((prev) => ({
          ...prev,
          poster: base64String,
        }));
      };
      reader.readAsDataURL(file.originFileObj);
    } else if (!fileList.length) {
      setStartPage((prev) => ({
        ...prev,
        poster: null,
      }));
    }
  };

  const handleClickColor = (index: number) => {
    setThemeId(index);
  };

  const categoryOptions = [
    { value: "EDUCATION", label: "Боловсрол" },
    { value: "HEALTH", label: "Эрүүл мэнд" },
    { value: "POLITICS", label: "Улс төр" },
    { value: "ECONOMY", label: "Эдийн засаг" },
    { value: "SOCIETY", label: "Нийгэм" },
    { value: "TECHNOLOGY", label: "Технологи" },
    { value: "ENVIRONMENT", label: "Байгаль орчин" },
    { value: "CULTURE", label: "Соёл" },
    { value: "SPORTS", label: "Спорт" },
    { value: "OTHER", label: "Бусад" },
  ];

  return (
    <div className="px-5 h-full">
      <div className="rounded-[10px] bg-[#F5F5F5] w-full h-[80px] mt-[10px] p-[10px] flex flex-col justify-between">
        <div className="flex items-center">
          <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
            {t("edit_start.title")}
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
          placeholder={t("edit_start.pollTitle")}
        />
      </div>
      <div className="rounded-[10px] bg-[#F5F5F5] w-full mt-[10px] h-[80px] p-[10px] flex flex-col justify-between">
        <div className="flex items-center">
          <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
            {t("edit_start.description")}
          </p>
        </div>
        <TextArea
          value={startPage?.greetingMessage}
          onChange={(e: any) =>
            setStartPage((prev) => ({
              ...prev,
              greetingMessage: e.target.value,
            }))
          }
          className="w-full bg-[#E6E6E6] !rounded-[10px] !text-[13px] mt-[14px] border-none placeholder:text-[#B3B3B3] placeholder:text-[13px] placeholder:font-normal"
          placeholder={t("edit_start.pollDescription")}
        />
      </div>

      <div className="rounded-[10px] bg-[#F5F5F5] w-full mt-[10px] h-[80px] p-[10px] flex flex-col justify-between">
        <div className="flex items-center">
          <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
            {t("edit_start.category")}
          </p>
        </div>
        <Select
          value={startPage?.category}
          onChange={(value) =>
            setStartPage((prev) => ({
              ...prev,
              category: value,
            }))
          }
          className="w-full mt-[14px]"
          placeholder={t("edit_start.pollCategory")}
          options={categoryOptions}
          allowClear
        />
      </div>

      <div className="rounded-[10px] bg-[#F5F5F5] w-full h-[80px] mt-[10px] p-[10px] flex flex-col justify-between">
        <div className="flex items-center">
          <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
            {t("edit_start.button")}
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
          placeholder={t("edit_start.button")}
        />
      </div>
      <div className="rounded-[10px] bg-[#F5F5F5] w-full h-auto mt-5 p-[10px] flex flex-col gap-2">
        <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
          {t("edit_start.poster")}
        </p>
        <Upload
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={(file) => {
            const isLt1M = file.size / 1024 / 1024 < 1;
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
              message.error("Зөвхөн зураг оруулна уу!");
              return Upload.LIST_IGNORE;
            }
            if (!isLt1M) {
              message.error("Зураг 1MB-аас хэтэрч болохгүй!");
              return Upload.LIST_IGNORE;
            }
            return true;
          }}
          accept="image/*"
          listType="picture"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>
            {t("edit_start.enterPoster")}
          </Button>
        </Upload>
      </div>
      <div className="rounded-[10px] bg-[#F5F5F5] w-full h-[90px] mt-5 p-[10px]">
        <div className="flex items-center">
          <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
            {t("edit_start.color")}
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
    </div>
  );
};

export default StartShapeEditor;
