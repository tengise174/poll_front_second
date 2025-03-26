"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StartShapeEditor from "@/components/editor/StartShapeEditor";
import QuestionTextEditor from "@/components/editor/QuestionTextEditor";
import StartDisplay from "@/components/editor/StartDisplay";
import QuestionDisplay from "@/components/editor/QuestionDisplay";
import EndEditor from "@/components/editor/EndEditor";
import EndDisplay from "@/components/editor/EndDisplay";
import SettingsEditor from "@/components/editor/SettingsEditor";
import SettingsDisplay from "@/components/editor/SettingsDisplay";
import { dualColors } from "@/utils/utils";
import AddIcon from "@/public/icons/add";

export default function SurveyDetailPage() {
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState(0);
  const [logoPosition, setLogoPosition] = useState<string>("TOP_MIDDLE");
  const [activeColor, setActiveColor] = useState<number>(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [chosenType, setChosenType] = useState<
    "MULTI_CHOICE" | "SINGLE_CHOICE" | "RATING" | "YES_NO" | "TEXT" | null
  >(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [settingsPage, setSettingsPage] = useState<{
    isTemplate: boolean;
    isAccessLevel: boolean;
    isTimeSelected: boolean;
    isDuration: boolean;
    isPollsterNumber: boolean;
    startDate: string;
    endDate: string;
    duration: number | null;
    pollsterNumber: number | null;
    selectedSettingItem:
      | "TEMPLATE"
      | "ACCESS_LEVEL"
      | "POLLSTER_NUMBER"
      | "EMPLOYEE_MANAGE"
      | "";
    templateProps: {
      tempTitle: string;
      extraDesc: string;
      useFields: {
        EDUCATION: boolean;
        HUMAN_RESOURCES: boolean;
        OTHER: boolean;
      };
    };
  }>({
    isTemplate: false,
    isAccessLevel: false,
    isTimeSelected: false,
    isDuration: false,
    isPollsterNumber: false,
    startDate: "",
    endDate: "",
    duration: null,
    pollsterNumber: null,
    selectedSettingItem: "",
    templateProps: {
      tempTitle: "",
      extraDesc: "",
      useFields: {
        EDUCATION: true,
        HUMAN_RESOURCES: false,
        OTHER: false,
      },
    },
  });

  const [startPage, setStartPage] = useState<{
    title: string;
    greetingMessage: string;
    btnLabel: string;
  }>({
    title: "",
    greetingMessage: "",
    btnLabel: "",
  });

  const [endPage, setEndPage] = useState<{
    endTitle: string;
    thankYouMessage: string;
  }>({
    endTitle: "",
    thankYouMessage: "",
  });

  const [themePage, setThemePage] = useState<{
    logoPosition: string;
    showWaterMark: boolean;
    themeId: number;
  }>();

  const [templateQuestions, setTemplateQuestions] = useState<
    Array<{ id: string; options: Array<any>; content: string }>
  >([]);

  const [currentQuestion, setCurrentQuestion] = useState<{
    content: string;
    options?: Array<{ content: string }>;
    questionType:
      | "MULTI_CHOICE"
      | "SINGLE_CHOICE"
      | "RATING"
      | "YES_NO"
      | "TEXT"
      | null;
    minAnswerCount?: number;
    rateNumber?: number;
    rateType?: "STAR" | "NUMBER";
    order: number;
    id?: number;
  }>();

  const [newQuestions, setNewQuestions] = useState<
    Array<{
      content: string;
      options?: Array<any>;
      questionType:
        | "MULTI_CHOICE"
        | "SINGLE_CHOICE"
        | "RATING"
        | "YES_NO"
        | "TEXT"
        | null;
      minAnswerCount?: number;
      order: number;
      rateNumber?: number;
      rateType?: "STAR" | "NUMBER";
      id?: number;
    }>
  >([
    {
      content: "",
      questionType: null,
      order: 0,
      minAnswerCount: 1,
      rateNumber: 4,
      rateType: "STAR",
      options: [],
    },
  ]);

  const handleAdd = () => {
    setChosenType(null);
  };

  useEffect(() => {
    const lastIndex =
      newQuestions.length === 1 && newQuestions[currentPage].content === ""
        ? 0
        : newQuestions.length - 1;
    setCurrentQuestion(newQuestions[currentPage]);
  }, [currentPage, chosenType]);

  useEffect(() => {
    if (themePage) {
      setLogoPosition(themePage.logoPosition);
    }
  }, [themePage]);

  console.log(settingsPage);

  return (
    <div className="h-screen bg-[#F4F6F8] font-open">
      <div className="flex flex-col md:flex-row h-auto md:h-full md:max-h-[calc(100vh-56px)]">
        <div className="w-full md:min-w-[350px] md:max-w-[400px] flex flex-col bg-[#FDFDFD] min-h-full py-3 rounded ">
          <div className="px-5">
            <div className="rounded-full w-full flex items-center h-[34px] bg-[#D9D9D9]">
              {["Тохиргоо", "Нүүр", "Асуултууд", "Төгсгөл"].map(
                (text, index) => (
                  <p
                    onClick={() => {
                      setActiveSection(index);
                    }}
                    key={index}
                    className={`text-[13px] w-1/3 cursor-pointer flex items-center justify-center h-full ${
                      activeSection === index
                        ? "bg-black text-[#FDFDFD] rounded-full font-semibold"
                        : "text-[#757575] font-medium"
                    }`}
                  >
                    {text}
                  </p>
                )
              )}
            </div>
          </div>
          {activeSection === 0 && (
            <SettingsEditor
              settingsPage={settingsPage}
              setSettingsPage={setSettingsPage}
            />
          )}
          {activeSection === 1 && (
            <StartShapeEditor
              id={String(id)}
              activeColor={activeColor}
              setActiveColor={setActiveColor}
              uploadedImage={uploadedImage}
              setUploadedImage={setUploadedImage}
              themePage={themePage}
              logoPosition={logoPosition}
              setLogoPosition={setLogoPosition}
              startPage={startPage}
              setStartPage={setStartPage}
            />
          )}
          {activeSection === 2 && (
            <div className="flex flex-col h-full max-h-[calc(100vh-110px)] justify-between">
              {chosenType ? (
                <QuestionTextEditor
                  id={String(id)}
                  setChosenType={setChosenType}
                  setCurrentPage={setCurrentPage}
                  templateQuestions={templateQuestions}
                  newQuestions={newQuestions}
                  setNewQuestions={setNewQuestions}
                  currentPage={currentPage}
                  currentQuestion={currentQuestion}
                  setCurrentQuestion={setCurrentQuestion}
                />
              ) : (
                <p className="p-5">Асуултын төрлийг сонгоно уу!</p>
              )}
              <div
                onClick={handleAdd}
                className="h-[40px] w-full bg-[#FDFDFD] border-t border-[#D9D9D9] cursor-pointer flex items-center justify-center gap-x-[10px]"
              >
                <AddIcon className="text-[#071522]" />
                <p className="text-[#071522] text-[14px] font-semibold">
                  Асуулт нэмэх
                </p>
              </div>
            </div>
          )}
          {activeSection === 3 && (
            <EndEditor
              id={String(id)}
              endPage={endPage}
              setEndPage={setEndPage}
            />
          )}
        </div>
        <div className="w-full h-full py-5 px-5 md:px-[30px]">
          {activeSection === 0 && (
            <SettingsDisplay
              settingsPage={settingsPage}
              setSettingsPage={setSettingsPage}
            />
          )}
          {activeSection === 1 && (
            <StartDisplay
              startPage={startPage}
              dualColors={dualColors}
              activeColor={activeColor}
              logoPosition={logoPosition}
              uploadedImage={uploadedImage}
            />
          )}
          {activeSection === 2 && (
            <QuestionDisplay
              chosenType={chosenType}
              setChosenType={setChosenType}
              dualColors={dualColors}
              activeColor={activeColor}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
              newQuestions={newQuestions}
              setNewQuestions={setNewQuestions}
            />
          )}
          {activeSection === 3 && (
            <EndDisplay
              endPage={endPage}
              dualColors={dualColors}
              activeColor={activeColor}
              logoPosition={logoPosition}
              uploadedImage={uploadedImage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
