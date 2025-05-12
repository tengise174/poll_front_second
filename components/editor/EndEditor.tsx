import React, { useState } from "react";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { StartEditorProps } from "@/utils/componentTypes";
import { useTranslation } from "react-i18next";
import TextArea from "antd/es/input/TextArea";

const startPageInputClass =
  "w-full !h-[30px] bg-[#E6E6E6] !rounded-[10px] !text-[13px] mt-[14px] border-none placeholder:text-[#B3B3B3] placeholder:text-[13px] placeholder:font-normal";

const EndEditor = ({
  id,
  endPage,
  setEndPage,
  handleCreatPoll,
}: StartEditorProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  return (
    <div className="px-5 flex flex-col flex-1 justify-between py-4 h-full">
      <div>
        <div className="rounded-[10px] bg-[#F5F5F5] w-full h-[80px] mt-[10px] p-[10px] flex flex-col justify-between">
          <div className="flex items-center">
            <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
              {t("edit_end.text")}
            </p>
          </div>
          <CustomInput
            onChange={(e: any) =>
              setEndPage((prev) => ({
                ...prev,
                endTitle: e.target.value,
              }))
            }
            value={endPage?.endTitle}
            placeholder={t("edit_end.thnkMess")}
            className={startPageInputClass}
          />
        </div>
        <div className="rounded-[10px] bg-[#F5F5F5] w-full h-auto mt-[10px] p-[10px] flex flex-col gap-4">
          <div className="flex items-center">
            <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
              {t("edit_end.description")}
            </p>
          </div>
          <TextArea
            onChange={(e: any) =>
              setEndPage((prev) => ({
                ...prev,
                thankYouMessage: e.target.value,
              }))
            }
            value={endPage?.thankYouMessage}
            className="w-full bg-[#E6E6E6] !rounded-[10px] !text-[13px] mt-[14px] border-none placeholder:text-[#B3B3B3] placeholder:text-[13px] placeholder:font-normal"
            itemType="textarea"
            placeholder={t("edit_end.pollDesc")}
          />
        </div>
      </div>
      <CustomButton
        loading={loading}
        disabled={loading}
        titleClassname="text-[#FDFDFD] text-[14px] font-semibold "
        className="!h-[38px] w-full bg-main-purple cursor-pointer rounded-lg flex items-center justify-center mt-[10px] !text-sm"
        title="Дуусгах"
        onClick={handleCreatPoll}
      />
    </div>
  );
};

export default EndEditor;
