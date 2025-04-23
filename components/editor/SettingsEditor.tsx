"use client";

import { DatePicker, InputNumber, Switch, Modal } from "antd"; // Import Modal
import dayjs, { Dayjs } from "dayjs";
import CustomInput from "../CustomInput";
import { SettingsEditorProps } from "@/utils/componentTypes";
import CustomButton from "../CustomButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePublish } from "@/api/action";
import { useAlert } from "@/context/AlertProvider";
import { useState } from "react"; // Import useState for modal state

const startPageInputClass =
  "w-full !h-[30px] bg-[#E6E6E6] !rounded-[10px] !font-normal !text-[13px] mt-[14px] border-none placeholder:text-[#B3B3B3] placeholder:text-[13px] placeholder:font-normal";

const SettingsEditor = ({
  id,
  settingsPage,
  showUrlModal,
  setSettingsPage,
}: SettingsEditorProps) => {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const toggleMutation = useMutation({
    mutationFn: togglePublish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["survey_detail"] });
      showAlert(
        `${
          settingsPage.published
            ? "Амжилттай нийтлэл цуцаллаа"
            : "Амжилттай нийтэллээ"
        }`,
        "success",
        "",
        true
      );
    },
    onError: (error: any) => {
      showAlert("Алдаа гарлаа", "error", "", true);
    },
  });

  // Show the confirmation modal
  const showConfirmModal = () => {
    setIsModalOpen(true);
  };

  // Handle modal confirm
  const handleModalOk = () => {
    setIsModalOpen(false);
    toggleMutation.mutate(id); // Proceed with toggle mutation
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setIsModalOpen(false); // Close the modal without action
  };

  return (
    <div className="px-4 h-full flex flex-col justify-between items-center">
      <div className="w-full">
        <div
          className={` 
                ${
                  settingsPage.selectedSettingItem === "ACCESS_LEVEL"
                    ? "bg-first-gray"
                    : "bg-second-bg"
                }
        rounded-[10px] w-full h-[80px] mt-[10px] p-[10px] flex flex-col justify-between`}
        >
          <div
            onClick={
              settingsPage.isAccessLevel
                ? () => {
                    setSettingsPage((prev) => ({
                      ...prev,
                      selectedSettingItem:
                        prev.selectedSettingItem === "ACCESS_LEVEL"
                          ? ""
                          : "ACCESS_LEVEL",
                    }));
                  }
                : undefined
            }
            className={`${
              settingsPage.isAccessLevel ? "cursor-pointer" : ""
            } flex items-center`}
          >
            <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
              Хандалт түвшин
            </p>
          </div>
          <div className="flex flex-row items-center">
            <CustomInput
              value="Сонгосон хэрэглэгчид оролцох"
              disabled={true}
              className={`${startPageInputClass} ${
                settingsPage.isAccessLevel
                  ? "!bg-not-clicked !border-main-purple !text-main-purple"
                  : ""
              }`}
              suffix={
                <Switch
                  value={settingsPage.isAccessLevel}
                  onChange={(checked) =>
                    setSettingsPage((prev) => ({
                      ...prev,
                      isAccessLevel: checked,
                      selectedSettingItem:
                        !checked && prev.selectedSettingItem === "ACCESS_LEVEL"
                          ? ""
                          : prev.selectedSettingItem,
                    }))
                  }
                />
              }
            />
          </div>
        </div>
        <div className="rounded-[10px] bg-second-bg w-full h-auto mt-[10px] p-[10px] flex flex-col justify-between gap-2">
          <div className="flex items-center">
            <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
              Цаг
            </p>
          </div>
          <div className="flex flex-row items-center">
            <CustomInput
              value="Асуулга цаг тохируулах"
              disabled={true}
              className={`${startPageInputClass} ${
                settingsPage.isTimeSelected
                  ? "!bg-not-clicked !border-main-purple !text-main-purple"
                  : ""
              }`}
              suffix={
                <Switch
                  value={settingsPage.isTimeSelected}
                  onChange={(checked) =>
                    setSettingsPage((prev) => ({
                      ...prev,
                      isTimeSelected: checked,
                    }))
                  }
                />
              }
            />
          </div>
          {settingsPage.isTimeSelected && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between items-center">
                <p className="text-xs">Эхлэх</p>
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="Эхлэх хугацаа сонгоно уу"
                  value={
                    settingsPage.startDate
                      ? dayjs(settingsPage.startDate)
                      : null
                  }
                  className="!w-[50%] !h-[30px] bg-[#E6E6E6] !rounded-[10px] !font-normal !text-[13px] !text-main-purple"
                  onChange={(date: Dayjs | null) => {
                    setSettingsPage((prev) => ({
                      ...prev,
                      startDate: date ? date.format("YYYY-MM-DD HH:mm:ss") : "",
                    }));
                  }}
                />
              </div>
              <div className="flex flex-row justify-between items-center">
                <p className="text-xs">Дуусах</p>
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="Дуусах хугацаа сонгоно уу"
                  value={
                    settingsPage.endDate ? dayjs(settingsPage.endDate) : null
                  }
                  className="!w-[50%] !h-[30px] bg-[#E6E6E6] !rounded-[10px] !font-normal !text-[13px] !text-main-purple"
                  onChange={(date: Dayjs | null) => {
                    setSettingsPage((prev) => ({
                      ...prev,
                      endDate: date ? date.format("YYYY-MM-DD HH:mm:ss") : "",
                    }));
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="rounded-[10px] bg-second-bg w-full h-auto mt-[10px] p-[10px] flex flex-col justify-between gap-2">
          <div className="flex items-center">
            <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
              Хугацаа тохируулах
            </p>
          </div>
          <div className="flex flex-row items-center">
            <CustomInput
              value="Зарцуулах хугацаа тохируулах"
              disabled={true}
              className={`${startPageInputClass} ${
                settingsPage.isDuration
                  ? "!bg-not-clicked !border-main-purple !text-main-purple"
                  : ""
              }`}
              suffix={
                <Switch
                  value={settingsPage.isDuration}
                  onChange={(checked) =>
                    setSettingsPage((prev) => ({
                      ...prev,
                      isDuration: checked,
                    }))
                  }
                />
              }
            />
          </div>
          {settingsPage.isDuration && (
            <div className="w-full flex flex-row justify-between items-center">
              <p className="text-xs">/МИН/</p>
              <InputNumber
                value={settingsPage.duration}
                onChange={(value) =>
                  setSettingsPage((prev) => ({
                    ...prev,
                    duration: Number(value),
                  }))
                }
                className="!w-[50%] !h-[30px] bg-[#E6E6E6] !rounded-[10px] !font-normal !text-[13px] !text-main-purple"
              />
            </div>
          )}
        </div>
        <div className="rounded-[10px] bg-second-bg w-full h-auto mt-[10px] p-[10px] flex flex-col justify-between gap-2">
          <div className="flex items-center">
            <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
              Оролцогч тоо
            </p>
          </div>
          <div className="flex flex-row items-center">
            <CustomInput
              value="Оролцогч тоо тохируулах"
              disabled={true}
              className={`${startPageInputClass} ${
                settingsPage.isPollsterNumber
                  ? "!bg-not-clicked !border-main-purple !text-main-purple"
                  : ""
              }`}
              suffix={
                <Switch
                  value={settingsPage.isPollsterNumber}
                  onChange={(checked) =>
                    setSettingsPage((prev) => ({
                      ...prev,
                      isPollsterNumber: checked,
                    }))
                  }
                />
              }
            />
          </div>
          {settingsPage.isPollsterNumber && (
            <div className="w-full flex flex-row justify-between items-center">
              <p className="text-xs">Тоо</p>
              <InputNumber
                value={settingsPage.pollsterNumber}
                onChange={(value) =>
                  setSettingsPage((prev) => ({
                    ...prev,
                    pollsterNumber: Number(value),
                  }))
                }
                className="!w-[50%] !h-[30px] bg-[#E6E6E6] !rounded-[10px] !font-normal !text-[13px] !text-main-purple"
              />
            </div>
          )}
        </div>
      </div>
      <div className="w-full">
        {id !== "new" && (
          <div className="flex flex-col gap-2 w-full">
            <CustomButton
              onClick={showUrlModal}
              title={"Холбоос харах"}
              className="bg-main-purple !h-10 text-white !text-xs px-4 rounded-xl hover:cursor-pointer hover:bg-[#333]"
            />
            <CustomButton
              title={settingsPage.published ? "Нийтлэх болих" : "Нийтлэх"}
              className="!bg-clicked text-white !h-10 !text-xs px-4 rounded-xl hover:cursor-pointer hover:!bg-[#333]"
              onClick={showConfirmModal} // Trigger modal instead of direct toggle
            />
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        title="Баталгаажуулалт"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Тийм"
        cancelText="Үгүй"
      >
        <p>
          Та асуулгыг {settingsPage.published ? "нийтлэхээ болих" : "нийтлэх"}-г
          хүсэж байна уу?
        </p>
      </Modal>
    </div>
  );
};

export default SettingsEditor;
