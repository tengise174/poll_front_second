"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal, QRCode } from "antd";
import { createPoll, getPollById, updatePoll } from "@/api/action";
import { CopyOutlined } from "@ant-design/icons";
import StartShapeEditor from "@/components/editor/StartShapeEditor";
import QuestionTextEditor from "@/components/editor/QuestionTextEditor";
import StartDisplay from "@/components/editor/StartDisplay";
import QuestionDisplay from "@/components/editor/QuestionDisplay";
import EndEditor from "@/components/editor/EndEditor";
import EndDisplay from "@/components/editor/EndDisplay";
import SettingsEditor from "@/components/editor/SettingsEditor";
import SettingsDisplay from "@/components/editor/SettingsDisplay";
import { dualColors, questionTypes } from "@/utils/utils";
import AddIcon from "@/public/icons/add";
import { useAlert } from "@/context/AlertProvider";
import { QuestionProps } from "@/utils/componentTypes";

export default function SurveyDetailPage() {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const [reqUrl, setReqUrl] = useState<string>("");
  const [themeId, setThemeId] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuestionTypeModalOpen, setIsQuestionTypeModalOpen] = useState(false);
  const [chosenType, setChosenType] = useState<
    "MULTI_CHOICE" | "SINGLE_CHOICE" | "RATING" | "YES_NO" | "TEXT" | "DROPDOWN" | "MULTIPLE_CHOICE_GRID" | null
  >(null);

  const handleCopyUrl = () => {
    navigator.clipboard
      .writeText(reqUrl)
      .then(() => {
        showAlert("Copied URL to clipboard", "success", "", true);
      })
      .catch(() => {
        showAlert("Failed to copy URL", "warning", "", true);
      });
  };

  const [settingsPage, setSettingsPage] = useState<{
    isAccessLevel: boolean;
    isTimeSelected: boolean;
    isDuration: boolean;
    isPollsterNumber: boolean;
    startDate: string;
    endDate: string;
    duration: number | null;
    pollsterNumber: number | null;
    pollsters: Array<{ username: string }>;
    selectedSettingItem: "ACCESS_LEVEL" | "POLLSTER_NUMBER" | "";
  }>({
    isAccessLevel: false,
    isTimeSelected: false,
    isDuration: false,
    isPollsterNumber: false,
    startDate: "",
    endDate: "",
    duration: null,
    pollsterNumber: null,
    pollsters: [],
    selectedSettingItem: "",
  });

  const [startPage, setStartPage] = useState<{
    title: string;
    greetingMessage: string;
    btnLabel: string;
    poster?: string | null;
  }>({
    title: "",
    greetingMessage: "",
    btnLabel: "",
    poster: null,
  });

  const [endPage, setEndPage] = useState<{
    endTitle: string;
    thankYouMessage: string;
  }>({
    endTitle: "",
    thankYouMessage: "",
  });

  const [currentQuestion, setCurrentQuestion] = useState<QuestionProps>();

  const [newQuestions, setNewQuestions] = useState<QuestionProps[]>([
    {
      content: "",
      questionType: null,
      order: 0,
      minAnswerCount: 1,
      rateNumber: 4,
      rateType: "STAR",
      options: [],
      required: false,
      poster: null,
      isPointBased: false,
      hasCorrectAnswer: false,
      gridRows: [],
      gridColumns: [],
    },
  ]);

  const { data, isFetching } = useQuery({
    queryKey: ["survey_detail", [id]],
    refetchOnWindowFocus: false,
    queryFn: () => getPollById(id as string),
    retry: false,
    enabled: id !== "new",
  });

  useEffect(() => {
    if (data) {
      setThemeId(data.themeId);

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
        pollsters: data.pollsters,
      }));

      setStartPage((prev) => ({
        ...prev,
        title: data.title,
        greetingMessage: data.greetingMessage,
        btnLabel: data.btnLabel,
        poster: data.poster || null,
      }));

      setEndPage((prev) => ({
        ...prev,
        endTitle: data.endTitle,
        thankYouMessage: data.thankYouMessage,
      }));

      const transformedQuestions = data.questions
        .map((question: any, index: any) => ({
          content: question.content,
          questionType: question.questionType,
          minAnswerCount: question.minAnswerCount || 1,
          rateNumber: question.rateNumber || 4,
          rateType: question.rateType || "STAR",
          order: question.order,
          required: question.required || false,
          poster: question.poster || null,
          isPointBased: question.isPointBased || false,
          hasCorrectAnswer: question.hasCorrectAnswer || false,
          gridRows: question.gridRows || [],
          gridColumns: question.gridColumns || [],
          options:
            question.options
              ?.map((option: any) => ({
                content: option.content,
                order: option.order,
                poster: option.poster || null,
                points: option.points || 0,
                isCorrect: option.isCorrect || false,
                nextQuestionOrder: option.nextQuestionOrder || null,
                rowIndex: option.rowIndex || null,
                columnIndex: option.columnIndex || null,
              }))
              .sort((a: any, b: any) => a.order - b.order) || [],
        }))
        .sort((a: any, b: any) => a.order - b.order);
      setChosenType(transformedQuestions[0]?.questionType);
      setCurrentQuestion(transformedQuestions[0]);
      setNewQuestions(transformedQuestions);
    }
  }, [id, data]);

  const pollData = {
    title: startPage.title,
    greetingMessage: startPage.greetingMessage,
    btnLabel: startPage.btnLabel,
    endTitle: endPage.endTitle,
    thankYouMessage: endPage.thankYouMessage,
    themeId: themeId,
    poster: startPage.poster,
    startDate: settingsPage.startDate,
    endDate: settingsPage.endDate,
    duration: settingsPage.duration,
    pollsterNumber: settingsPage.pollsterNumber,
    questions: newQuestions.map((q) => ({
      ...q,
      gridRows: q.gridRows || [],
      gridColumns: q.gridColumns || [],
      options: (q.options ?? []).map((opt) => ({
        ...opt,
        rowIndex: opt.rowIndex || 0,
        columnIndex: opt.columnIndex || 0,
      })),
    })),
    isAccessLevel: settingsPage.isAccessLevel,
    isTimeSelected: settingsPage.isTimeSelected,
    isDuration: settingsPage.isDuration,
    isPollsterNumber: settingsPage.isPollsterNumber,
    pollsters: settingsPage.pollsters,
  };

  const handleCreatePoll = async () => {
    for (const question of newQuestions) {
      if (question.isPointBased && question.options) {
        const totalPoints = question.options.reduce(
          (sum, opt) => sum + (opt.points || 0),
          0
        );
        if (totalPoints !== 100) {
          showAlert(
            `Question ${question.order + 1}: Points must sum to 100`,
            "warning",
            "",
            true
          );
          return;
        }
      }
      if (
        ["MULTI_CHOICE", "SINGLE_CHOICE", "YES_NO", "DROPDOWN", "MULTIPLE_CHOICE_GRID"].includes(
          question.questionType ?? ""
        ) &&
        question.hasCorrectAnswer &&
        question.options
      ) {
        if (question.questionType === "MULTIPLE_CHOICE_GRID") {
          // Validate one correct answer per row
          const rowCount = question.gridRows?.length || 0;
          const correctPerRow = Array(rowCount).fill(false);
          question.options.forEach((opt) => {
            if (opt.isCorrect && opt.rowIndex != null) {
              correctPerRow[opt.rowIndex] = true;
            }
          });
          if (correctPerRow.some((hasCorrect) => !hasCorrect)) {
            showAlert(
              `Question ${question.order + 1}: Each row must have exactly one correct answer`,
              "warning",
              "",
              true
            );
            return;
          }
        } else {
          const correctCount = question.options.filter(
            (opt) => opt.isCorrect
          ).length;
          if (correctCount === 0) {
            showAlert(
              `Question ${
                question.order + 1
              }: At least one correct answer must be set`,
              "warning",
              "",
              true
            );
            return;
          }
          if (
            ["SINGLE_CHOICE", "YES_NO", "DROPDOWN"].includes(question.questionType ?? "") &&
            correctCount > 1
          ) {
            showAlert(
              `Question ${
                question.order + 1
              }: Only one correct answer is allowed for ${question.questionType}`,
              "warning",
              "",
              true
            );
            return;
          }
        }
      }
      if (question.hasCorrectAnswer && question.isPointBased) {
        showAlert(
          `Question ${
            question.order + 1
          }: A question cannot have both correct answers and points`,
          "warning",
          "",
          true
        );
        return;
      }
      if (
        ["MULTI_CHOICE", "SINGLE_CHOICE", "YES_NO", "DROPDOWN", "MULTIPLE_CHOICE_GRID"].includes(
          question.questionType ?? ""
        ) &&
        question.options
      ) {
        for (const [optIndex, option] of question.options.entries()) {
          if (
            option.nextQuestionOrder !== null &&
            option.nextQuestionOrder !== undefined
          ) {
            const nextOrder = option.nextQuestionOrder;
            const isValidOrder = newQuestions.some(
              (q) => q.order === nextOrder
            );
            if (!isValidOrder) {
              showAlert(
                `Question ${question.order + 1}, Option ${
                  optIndex + 1
                }: Invalid next question order`,
                "warning",
                "",
                true
              );
              return;
            }
            if (nextOrder <= question.order) {
              showAlert(
                `Question ${question.order + 1}, Option ${
                  optIndex + 1
                }: Next question order must be greater than current question order`,
                "warning",
                "",
                true
              );
              return;
            }
          }
        }
      }
      if (question.questionType === "MULTIPLE_CHOICE_GRID") {
        if (!question.gridRows?.length || !question.gridColumns?.length) {
          showAlert(
            `Question ${question.order + 1}: Grid must have at least one row and one column`,
            "warning",
            "",
            true
          );
          return;
        }
        const expectedOptions = (question.gridRows.length * question.gridColumns.length);
        if ((question.options ?? []).length !== expectedOptions) {
          showAlert(
            `Question ${question.order + 1}: Grid must have options for all cells`,
            "warning",
            "",
            true
          );
          return;
        }
      }
    }

    if (id === "new") {
      try {
        const result = await createPoll(pollData);
        if (result) {
          showAlert("Амжилттай нэмлээ", "success", "", true);
          setReqUrl(`http://localhost:3000/test/${result.id}`);
          setIsModalOpen(true);
        }
      } catch (e) {
        showAlert("Амжилтгүй", "warning", "", true);
        console.log(e);
      }
    } else {
      try {
        const result = await updatePoll(id as string, pollData);
        if (result) {
          showAlert("Амжилттай заслаа", "success", "", true);
          setReqUrl(`http://localhost:3000/test/${result.id}`);
          setIsModalOpen(true);
        }
      } catch (e) {
        showAlert("Амжилтгүй", "warning", "", true);
        console.log(e);
      }
    }
  };

  const handleAdd = () => {
    setChosenType(null);
  };

  const handleQuestionAdd = () => {
    setIsQuestionTypeModalOpen(true);
  };

  const handleQuestionTypeSelect = (
    questionType:
      | "MULTI_CHOICE"
      | "SINGLE_CHOICE"
      | "RATING"
      | "YES_NO"
      | "TEXT"
      | "DROPDOWN"
      | "MULTIPLE_CHOICE_GRID"
  ) => {
    const lastIndex =
      newQuestions.length === 1 && newQuestions[0].content === ""
        ? 0
        : newQuestions.length;

    const shouldAddAnswers =
      questionType === "SINGLE_CHOICE" ||
      questionType === "MULTI_CHOICE" ||
      questionType === "DROPDOWN" ||
      questionType === "MULTIPLE_CHOICE_GRID";

    const newQuestion: QuestionProps = {
      content: "",
      questionType,
      required: false,
      order: lastIndex + 1,
      poster: null,
      isPointBased: false,
      hasCorrectAnswer: false,
      options: [],
      gridRows: [],
      gridColumns: [],
      ...(questionType === "RATING" && {
        rateNumber: 5,
        rateType: "STAR",
        options: Array.from({ length: 5 }, (_, i) => ({
          content: (i + 1).toString(),
          order: i + 1,
          poster: null,
          points: 0,
          isCorrect: false,
          nextQuestionOrder: null,
          rowIndex: null,
          columnIndex: null,
        })),
      }),
      ...(questionType === "YES_NO" && {
        options: [
          {
            content: "Тийм",
            order: 1,
            poster: null,
            points: 0,
            isCorrect: false,
            nextQuestionOrder: null,
            rowIndex: null,
            columnIndex: null,
          },
          {
            content: "Үгүй",
            order: 2,
            poster: null,
            points: 0,
            isCorrect: false,
            nextQuestionOrder: null,
            rowIndex: null,
            columnIndex: null,
          },
        ],
      }),
      ...(questionType === "MULTIPLE_CHOICE_GRID" && {
        gridRows: ["Row 1", "Row 2"],
        gridColumns: ["Column 1", "Column 2"],
        options: [
          {
            content: "",
            order: 1,
            poster: null,
            points: 0,
            isCorrect: false,
            nextQuestionOrder: null,
            rowIndex: 0,
            columnIndex: 0,
          },
          {
            content: "",
            order: 2,
            poster: null,
            points: 0,
            isCorrect: false,
            nextQuestionOrder: null,
            rowIndex: 0,
            columnIndex: 1,
          },
          {
            content: "",
            order: 3,
            poster: null,
            points: 0,
            isCorrect: false,
            nextQuestionOrder: null,
            rowIndex: 1,
            columnIndex: 0,
          },
          {
            content: "",
            order: 4,
            poster: null,
            points: 0,
            isCorrect: false,
            nextQuestionOrder: null,
            rowIndex: 1,
            columnIndex: 1,
          },
        ],
      }),
      ...(shouldAddAnswers &&
        questionType !== "MULTIPLE_CHOICE_GRID" && {
          options: [
            {
              content: "",
              order: 1,
              poster: null,
              points: 0,
              isCorrect: false,
              nextQuestionOrder: null,
              rowIndex: null,
              columnIndex: null,
            },
            {
              content: "",
              order: 2,
              poster: null,
              points: 0,
              isCorrect: false,
              nextQuestionOrder: null,
              rowIndex: null,
              columnIndex: null,
            },
          ],
        }),
    };

    setNewQuestions((prev) => {
      const emptyTitleIndex = prev.findIndex(
        (question) => question.content === ""
      );

      if (
        emptyTitleIndex !== -1 &&
        prev[emptyTitleIndex].questionType === null
      ) {
        return prev.map((question, index) =>
          index === emptyTitleIndex ? newQuestion : question
        );
      }
      return [...prev, newQuestion];
    });

    setCurrentPage(lastIndex);
    setCurrentQuestion(newQuestion);
    setChosenType(questionType);
    setIsQuestionTypeModalOpen(false);
  };

  useEffect(() => {
    const lastIndex =
      newQuestions.length === 1 && newQuestions[currentPage].content === ""
        ? 0
        : newQuestions.length - 1;
    setCurrentQuestion(newQuestions[currentPage]);
  }, [currentPage, chosenType]);


  console.log(newQuestions);

  return (
    <div className="h-screen bg-[#F4F6F8] font-open">
      <div className="flex flex-col md:flex-row h-auto md:h-full md:max-h-[calc(100vh-56px)]">
        <div className="w-full md:min-w-[350px] md:max-w-[400px] flex flex-col bg-[#FDFDFD] min-h-full py-3 rounded">
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
              themeId={themeId}
              setThemeId={setThemeId}
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
                onClick={handleQuestionAdd}
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
              themeId={themeId}
            />
          )}
          {activeSection === 2 && (
            <QuestionDisplay
              chosenType={chosenType}
              setChosenType={setChosenType}
              dualColors={dualColors}
              themeId={themeId}
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
              themeId={themeId}
            />
          )}
        </div>
      </div>
      <Modal
        title="Асуултын төрөл сонгох"
        open={isQuestionTypeModalOpen}
        onCancel={() => setIsQuestionTypeModalOpen(false)}
        footer={null}
      >
        <div className="flex flex-col gap-y-[10px]">
          {questionTypes.map((item, index) => (
            <div
              key={index}
              onClick={() => handleQuestionTypeSelect(item.questionType)}
              className="w-full group relative h-12 rounded-[10px] bg-[#FDFDFD] border border-[#D9D9D9] shadow-custom-100 flex items-center cursor-pointer px-2 hover:bg-gray-100"
            >
              {item.icon}
              <p className="text-[#071522] text-[13px] font-medium ml-[5px]">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </Modal>
      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-4">
          <div>
            <p>Хүсэлтийн URL</p>
            <div className="flex flex-row gap-2">
              <Link href={reqUrl}>{reqUrl}</Link>
              <Button
                icon={<CopyOutlined />}
                onClick={handleCopyUrl}
                style={{ marginTop: "10px" }}
              ></Button>
            </div>
          </div>
          <div>
            <p>Хүсэлтийн QR код</p>
            <QRCode value={reqUrl || "-"} />
          </div>
        </div>
      </Modal>
    </div>
  );
}