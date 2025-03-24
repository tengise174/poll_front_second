"use client";

import { DatePicker, InputNumber, Switch } from "antd";
import CustomInput from "../CustomInput";
import { useState } from "react";
import dayjs from "dayjs";
import { SettingsEditorProps } from "@/utils/componentTypes";

const startPageInputClass =
  "w-full !h-[30px] bg-[#E6E6E6] !rounded-[10px] !font-normal !text-[13px] mt-[14px] border-none placeholder:text-[#B3B3B3] placeholder:text-[13px] placeholder:font-normal";

const SettingsEditor = ({
  settingsPage,
  setSettingsPage,
}: SettingsEditorProps) => {
  return (
    <div className="py-4 px-5">
      <div
        className={`
        ${
          settingsPage.selectedSettingItem === "TEMPLATE"
            ? "bg-first-gray"
            : "bg-second-bg"
        }
        rounded-[10px] w-full h-[80px] mt-[10px] p-[10px] flex flex-col justify-between`}
      >
        <div
          onClick={
            settingsPage.isTemplate
              ? () => {
                  setSettingsPage((prev) => ({
                    ...prev,
                    selectedSettingItem:
                      prev.selectedSettingItem === "TEMPLATE" ? "" : "TEMPLATE",
                  }));
                }
              : undefined
          }
          className={`${
            settingsPage.isTemplate ? "cursor-pointer" : ""
          }  flex items-center`}
        >
          <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
            Нээлттэй болгох
          </p>
        </div>
        <div className="flex flex-row items-center">
          <CustomInput
            value="Асуулгыг нээлттэй хуваалцах"
            disabled={true}
            className={`${startPageInputClass} ${
              settingsPage.isTemplate
                ? "!bg-not-clicked !border-main-purple !text-main-purple"
                : ""
            }`}
            suffix={
              <Switch
                onChange={(checked) =>
                  setSettingsPage((prev) => ({
                    ...prev,
                    isTemplate: checked,
                    selectedSettingItem:
                      !checked && prev.selectedSettingItem === "TEMPLATE"
                        ? ""
                        : prev.selectedSettingItem,
                  }))
                }
              />
            }
          />
        </div>
      </div>
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
                    selectedSettingItem: prev.selectedSettingItem === "ACCESS_LEVEL" ? "" : "ACCESS_LEVEL",
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
                className="!w-[50%] !h-[30px] bg-[#E6E6E6] !rounded-[10px] !font-normal !text-[13px] !text-main-purple"
              />
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="text-xs">Дуусах</p>
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="Дуусах хугацаа сонгоно уу"
                className="!w-[50%] !h-[30px] bg-[#E6E6E6] !rounded-[10px] !font-normal !text-[13px] !text-main-purple"
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
                onChange={(checked) =>
                  setSettingsPage((prev) => ({ ...prev, isDuration: checked }))
                }
              />
            }
          />
        </div>
        {settingsPage.isDuration && (
          <div className="w-full flex flex-row justify-between items-center">
            <p className="text-xs">/МИН/</p>
            <InputNumber className="!w-[50%] !h-[30px] bg-[#E6E6E6] !rounded-[10px] !font-normal !text-[13px] !text-main-purple" />
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
            <InputNumber className="!w-[50%] !h-[30px] bg-[#E6E6E6] !rounded-[10px] !font-normal !text-[13px] !text-main-purple" />
          </div>
        )}
      </div>
      <div
        className={`
          ${
            settingsPage.selectedSettingItem === "EMPLOYEE_MANAGE"
              ? "bg-first-gray"
              : "bg-second-bg"
          }
          rounded-[10px] w-full h-[80px] mt-[10px] p-[10px] flex flex-col justify-between`}
      >
        <div
          onClick={() => {
            setSettingsPage((prev) => ({
              ...prev,
              selectedSettingItem: prev.selectedSettingItem === "EMPLOYEE_MANAGE" ? "" : "EMPLOYEE_MANAGE",
            }));
          }}
          className="cursor-pointer flex items-center"
        >
          <p className="text-[13px] text-[#1E1E1E] font-medium leading-[14px] ml-[10px]">
            Ажилчдын хяналт
          </p>
        </div>
        <div className="flex flex-row items-center">
          <CustomInput
            value="Хэн хандаж болохыг тохируулах"
            className={`${startPageInputClass}`}
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsEditor;
