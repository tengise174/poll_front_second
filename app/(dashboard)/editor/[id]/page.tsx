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
import { createPoll, getPollById } from "@/api/action";
import { useQuery } from "@tanstack/react-query";

export default function SurveyDetailPage() {
  const { id } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["survey_detail", [id]],
    refetchOnWindowFocus: false,
    queryFn: () => getPollById(id as string),
    retry: false,
    enabled: id !== "new",
  });

  useEffect(() => {
    if (data) {
      setSettingsPage((prev) => ({
        ...prev,
        startDate: data.startDate,
        endDate: data.endDate,
        duration: data.duration,
        pollsterNumber: data.pollsterNumber,
        isAccessLevel: data.isAccessLevel,
        isTimeSelected: data.isTimeSelected,
        isDuration: data.isDuration,
        isPollsterNumber: data.isPollsterNumber,
      }));

      setStartPage((prev) => ({
        ...prev,
        title: data.title,
        greetingMessage: data.greetingMessage,
        btnLabel: data.btnLabel,
      }));

      setEndPage((prev) => ({
        ...prev,
        endTitle: data.endTitle,
        thankYouMessage: data.thankYouMessage,
      }));

      const transformedQuestions = data.questions.map(
        (question: any, index: any) => ({
          content: question.content,
          questionType: question.questionType,
          minAnswerCount: question.minAnswerCount || 1,
          rateNumber: question.rateNumber || 4,
          rateType: question.rateType || "STAR",
          order: question.order,
          options:
            question.options?.map((option: any) => ({
              content: option.content,
            })) || [],
        })
      ).sort((a: any, b: any) => a.order - b.order);
      setChosenType(transformedQuestions[0].questionType);
      setCurrentQuestion(transformedQuestions[0]);
      setNewQuestions(transformedQuestions);
    }
  }, [id, data]);

  const [activeSection, setActiveSection] = useState(0);
  const [activeColor, setActiveColor] = useState<number>(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [chosenType, setChosenType] = useState<
    "MULTI_CHOICE" | "SINGLE_CHOICE" | "RATING" | "YES_NO" | "TEXT" | null
  >(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [settingsPage, setSettingsPage] = useState<{
    isAccessLevel: boolean;
    isTimeSelected: boolean;
    isDuration: boolean;
    isPollsterNumber: boolean;
    startDate: string;
    endDate: string;
    duration: number | null;
    pollsterNumber: number | null;
    selectedSettingItem:
      | "ACCESS_LEVEL"
      | "POLLSTER_NUMBER"
      | "";
  }>({
    isAccessLevel: false,
    isTimeSelected: false,
    isDuration: false,
    isPollsterNumber: false,
    startDate: "",
    endDate: "",
    duration: null,
    pollsterNumber: null,
    selectedSettingItem: "",
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
    themeId: number;
  }>();

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

  const questionData = {
    title: startPage.title,
    greetingMessage: startPage.greetingMessage,
    btnLabel: startPage.btnLabel,
    endTitle: endPage.endTitle,
    thankYouMessage: endPage.thankYouMessage,
    themeId: themePage?.themeId,
    startDate: settingsPage.startDate,
    endDate: settingsPage.endDate,
    duration: settingsPage.duration,
    pollsterNumber: settingsPage.pollsterNumber,
    questions: newQuestions,
    isAccessLevel: settingsPage.isAccessLevel,
    isTimeSelected: settingsPage.isTimeSelected,
    isDuration: settingsPage.isDuration,
    isPollsterNumber: settingsPage.isPollsterNumber,
  };

  console.log(newQuestions);

  const handleCreatePoll = async () => {
    try {
      const result = await createPoll(questionData);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

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
              handleCreatPoll={handleCreatePoll}
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
              uploadedImage={uploadedImage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
