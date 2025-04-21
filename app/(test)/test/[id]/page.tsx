"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ConfigProvider, Skeleton } from "antd";
import { createAnswer, getPollForTest, recordFailedAttendance } from "@/api/action";
import { useAlert } from "@/context/AlertProvider";
import { dualColors } from "@/utils/utils";
import PollHeader from "@/components/test/PollHeader";
import PollQuestion from "@/components/test/PollQuestion";
import PollTimer from "@/components/test/PollTimer";
import PollNavigation from "@/components/test/PollNavigation";
import PollEndScreen from "@/components/test/PollEndScreen";
import CustomButton from "@/components/CustomButton";
import BoxIcon from "@/public/icons/box_icon";

interface Option {
  id: string;
  content: string;
  order: number;
  poster?: string | null;
  points?: number;
  isCorrect?: boolean;
  nextQuestionOrder?: number | null;
  rowIndex?: number | null;
  columnIndex?: number | null;
}

interface Question {
  id: string;
  content: string;
  questionType: string;
  minAnswerCount: number;
  options: Option[];
  order: number;
  required?: boolean;
  rateNumber?: number;
  rateType?: string;
  poster?: string | null;
  isPointBased?: boolean;
  hasCorrectAnswer?: boolean;
  gridRows?: string[];
  gridColumns?: string[];
}

export default function TestPage() {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionNo, setQuestionNo] = useState<number>(0);
  const [requiredError, setRequiredError] = useState<string[]>([]);
  const [step, setStep] = useState<"start" | "questions" | "end">("start");
  const [orderedQuestions, setOrderedQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<
    { questionId: string; option: any[]; textAnswer: string }[]
  >([]);
  const [custStyle, setCustStyle] = useState<{
    backgroundColor: string;
    primaryColor: string;
  }>({ backgroundColor: "#FDFDFD", primaryColor: "#2C2C2C" });
  const [timeTakenPerQuestion, setTimeTakenPerQuestion] = useState<{
    [questionId: string]: number;
  }>({});
  const [questionStartTime, setQuestionStartTime] = useState<number>(
    Date.now()
  );
  const [displayMode, setDisplayMode] = useState<"single" | "all">("single");
  const [hasNextQuestionOrder, setHasNextQuestionOrder] = useState<boolean>(false);
  const [history, setHistory] = useState<number[]>([]);

  const {
    data: fetchedData,
    isFetching,
    error,
  } = useQuery({
    queryKey: [id, "test"],
    queryFn: () => getPollForTest(id as string),
    enabled: !!id && id !== "new",
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (fetchedData && !fetchedData.message) {
      setData(fetchedData);
    }
  }, [fetchedData]);

  useEffect(() => {
    if (data) {
      const sortedQuestions = data?.questions
        .sort((a: any, b: any) => a.order - b.order)
        .map((question: any) => ({
          ...question,
          options: question.options.sort(
            (a: any, b: any) => a.order - b.order
          ),
        }));
      setOrderedQuestions(sortedQuestions);

      const hasNonNullNextQuestionOrder = sortedQuestions.some((question: Question) =>
        question.options.some((option: Option) => option.nextQuestionOrder !== null)
      );
      setHasNextQuestionOrder(hasNonNullNextQuestionOrder);
      if (hasNonNullNextQuestionOrder) {
        setDisplayMode("single");
      }
    }

    if (data && data?.duration) {
      setTimeLeft(fetchedData.duration * 60);
    }

    if (data && data?.themeId) {
      setCustStyle({
        backgroundColor: dualColors[data?.themeId][0],
        primaryColor: dualColors[data?.themeId][1],
      });
    }
  }, [data]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    if (step === "questions" && timeLeft > 0) {
      setTimerActive(true);
    }
  }, [step]);

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [questionNo]);

  const handleTimeUp = async () => {
    setTimerActive(false);
    try {
      await recordFailedAttendance(id as string);
      showAlert("Хугацаа дууслаа", "warning", "", true);
    } catch (error: any) {
      console.log(error);
    }
    setStep("end");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleChange = (
    questionId: string,
    value: any[] = [],
    textAnswer: string
  ) => {
    setAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (answer) => answer.questionId === questionId
      );

      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = {
          ...updatedAnswers[existingAnswerIndex],
          option: value,
          textAnswer: textAnswer,
        };
        return updatedAnswers;
      } else {
        return [...prevAnswers, { questionId, option: value, textAnswer }];
      }
    });
  };

  const hasAnswered = (id: string, minAnswerCount: number, type: string) => {
    const answer = answers.find((ans) => ans.questionId === id);

    if (type === "MULTI_CHOICE") {
      if (!answer || !answer.option) return false;
      return answer.option.length >= minAnswerCount;
    }

    if (type === "SINGLE_CHOICE" || type === "RATING" || type === "YES_NO" || type === "DROPDOWN") {
      return answer !== undefined && answer.option?.length > 0;
    }

    if (type === "TEXT") {
      return answer !== undefined && answer.textAnswer?.trim().length > 0;
    }

    if (type === "MULTIPLE_CHOICE_GRID") {
      if (!answer || !answer.option) return false;
      const rowCount = orderedQuestions.find((q) => q.id === id)?.gridRows?.length || 0;
      return answer.option.length >= rowCount;
    }

    return true;
  };

  const isButtonDisabled = (question: Question) => {
    if (!question.required) {
      return false;
    }
    return !hasAnswered(
      question.id,
      question.minAnswerCount,
      question.questionType
    );
  };

  const validateRequiredQuestions = () => {
    const unansweredRequired: string[] = [];
    orderedQuestions.forEach((question: Question) => {
      if (
        question.required &&
        !hasAnswered(
          question.id,
          question.minAnswerCount,
          question.questionType
        )
      ) {
        unansweredRequired.push(question.id);
      }
    });
    return unansweredRequired;
  };

  const areAllRequiredAnswered = () => {
    return validateRequiredQuestions().length === 0;
  };

  const handleSubmit = async () => {
    const requiredErrors = validateRequiredQuestions();
    if (requiredErrors.length > 0) {
      setRequiredError(requiredErrors);
      showAlert("Бүх шаардлагатай асуултуудад хариулна уу", "error", "", true);
      return;
    }

    setIsSubmitting(true);
    try {
      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      setTimeTakenPerQuestion((prev) => ({
        ...prev,
        [orderedQuestions[questionNo]?.id || "all"]: timeSpent,
      }));

      const formattedAnswers = answers.map((answer) => ({
        questionId: answer.questionId,
        optionIds: answer.option.length
          ? answer.option.map((opt) => opt.id)
          : undefined,
        textAnswer: answer.textAnswer || undefined,
        timeTaken: timeTakenPerQuestion[answer.questionId] || timeSpent,
      }));

      await createAnswer(formattedAnswers);
      showAlert("Амжилттай", "success", "", true);
      setTimerActive(false);
      setStep("end");
    } catch (error: any) {
      showAlert("Амжилтгүй", "warning", "", true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNextQuestionIndex = () => {
    const currentAnswer = answers.find(
      (answer) => answer.questionId === orderedQuestions[questionNo].id
    );
    if (
      currentAnswer &&
      currentAnswer.option.length > 0 &&
      currentAnswer.option[0].nextQuestionOrder !== null
    ) {
      const nextOrder = currentAnswer.option[0].nextQuestionOrder;
      const nextIndex = orderedQuestions.findIndex(
        (q) => q.order === nextOrder
      );
      return nextIndex !== -1 ? nextIndex : questionNo + 1;
    }
    return questionNo + 1;
  };

  const handleBack = () => {
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    setTimeTakenPerQuestion((prev) => ({
      ...prev,
      [orderedQuestions[questionNo].id]: timeSpent,
    }));
    setRequiredError((prev) =>
      prev.filter((id) => id !== orderedQuestions[questionNo].id)
    );

    if (history.length > 0) {
      const previousQuestionNo = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setQuestionNo(previousQuestionNo);
      setQuestionStartTime(Date.now());
    } else {
      setStep("start");
      setQuestionNo(0);
      setAnswers([]);
      setRequiredError([]);
      setHistory([]);
    }
  };

  const handleNext = () => {
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    setTimeTakenPerQuestion((prev) => ({
      ...prev,
      [orderedQuestions[questionNo].id]: timeSpent,
    }));

    setRequiredError((prev) =>
      prev.filter((id) => id !== orderedQuestions[questionNo].id)
    );

    if (questionNo === orderedQuestions.length - 1) {
      handleSubmit();
    } else {
      setHistory((prev) => [...prev, questionNo]);
      const nextIndex = getNextQuestionIndex();
      if (nextIndex >= orderedQuestions.length) {
        handleSubmit();
      } else {
        setQuestionNo(nextIndex);
        setQuestionStartTime(Date.now());
      }
    }
  };

  if (isFetching)
    return (
      <div>
        <Skeleton />
      </div>
    );

  if (fetchedData?.message) {
    return (
      <div className="items-center justify-center flex flex-col h-screen">
        <p>
          {fetchedData?.message === "Poll has not started yet"
            ? "Асуулга эхлээгүй байна"
            : fetchedData?.message === "Poll has already ended"
            ? "Асуулга дууссан байна"
            : fetchedData?.message === "User has already answered"
            ? "Аль хэдийн хариулсан байна"
            : fetchedData?.message === "Poll not found"
            ? "Энэ асуулга байхгүй байна"
            : fetchedData?.message === "Don't have access"
            ? "Та энэ санал асуулгад оролцох эрхгүй байна"
            : fetchedData?.message === "User has already attended"
            ? "Та асуулгад оролцсон боловч амжаагүй"
            : fetchedData?.message === "Poll is full"
            ? "Санал асуулга дүүрсэн байна"
            : "Алдаа гарлаа"}
        </p>
        <CustomButton
          title={"Миний асуулга"}
          onClick={() => router.push("/mypolls")}
          className="bg-second-bg text-black !text-xs px-4 rounded-2xl cursor-pointer"
        />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Radio: {
            radioSize: 22,
            dotSize: 14,
            colorBorder: "#D9D9D9",
            colorBgContainer: custStyle.backgroundColor,
            buttonSolidCheckedBg: "#777",
            buttonSolidCheckedHoverBg: "#888",
          },
          Switch: {
            handleBg: custStyle.primaryColor,
            trackHeight: 22,
            trackPadding: 4,
          },
          Card: {
            headerBg: custStyle.backgroundColor,
            borderRadiusLG: 10,
          },
          Select: {
            colorText: custStyle.primaryColor,
            colorBgContainer: custStyle.backgroundColor,
            colorBorder: "#D9D9D9",
          },
          Table: {
            headerBg: custStyle.backgroundColor,
            headerColor: custStyle.primaryColor,
            rowHoverBg: "#f5f5f5",
            borderColor: "#D9D9D9",
          },
        },
      }}
    >
      <div
        style={{
          backgroundColor: custStyle.backgroundColor,
          "--primary-color": custStyle.primaryColor,
          "--bg-color": custStyle.backgroundColor,
        }}
        className="flex flex-col font-open h-screen pt-10"
      >
        <div className="h-[49px] flex flex-row items-center justify-center">
          <BoxIcon className="h-full w-auto" />
        </div>
        <div className="flex flex-1 flex-col items-center overflow-hidden">
          {step === "start" && (
            <PollHeader
              title={data?.title}
              greetingMessage={data?.greetingMessage}
              duration={data?.duration}
              displayMode={displayMode}
              hasNextQuestionOrder={hasNextQuestionOrder}
              setDisplayMode={setDisplayMode}
              custStyle={custStyle}
              btnLabel={data?.btnLabel}
              onStart={() => {
                setStep("questions");
                setHistory([]);
              }}
            />
          )}
          {step === "questions" && displayMode === "single" && (
            <div className="flex flex-col gap-5 items-center max-h-full w-200">
              <PollTimer timeLeft={timeLeft} formatTime={formatTime} />
              <div
                style={{ color: custStyle.primaryColor }}
                className="font-semibold text-sm flex flex-row gap-1"
              >
                <span className="block">{questionNo + 1 + "."}</span>
                <span>{orderedQuestions[questionNo].content}</span>
                {orderedQuestions[questionNo].required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </div>
              <PollQuestion
                question={orderedQuestions[questionNo]}
                index={questionNo}
                answers={answers}
                requiredError={requiredError}
                custStyle={custStyle}
                handleChange={handleChange}
                handleDropdownChange={(nextIndex) => {
                  setHistory((prev) => [...prev, questionNo]);
                  if (nextIndex >= orderedQuestions.length) {
                    handleSubmit();
                  } else {
                    setQuestionNo(nextIndex);
                    setQuestionStartTime(Date.now());
                  }
                }}
              />
              <PollNavigation
                questionNo={questionNo}
                totalQuestions={orderedQuestions.length}
                isButtonDisabled={isButtonDisabled(orderedQuestions[questionNo])}
                custStyle={custStyle}
                onBack={handleBack}
                onNext={handleNext}
              />
            </div>
          )}
          {step === "questions" && displayMode === "all" && (
            <div className="flex flex-col items-center gap-5 w-200 max-h-full h-full">
              <PollTimer timeLeft={timeLeft} formatTime={formatTime} />
              <div className="flex flex-col gap-5 items-center w-full max-h-full h-full overflow-y-auto px-6">
                {orderedQuestions.map((question, index) => (
                  <PollQuestion
                    key={question.id}
                    question={question}
                    index={index}
                    answers={answers}
                    requiredError={requiredError}
                    custStyle={custStyle}
                    handleChange={handleChange}
                    handleDropdownChange={(nextIndex) => {}}
                  />
                ))}
              </div>
              <PollNavigation
                questionNo={questionNo}
                totalQuestions={orderedQuestions.length}
                isButtonDisabled={!areAllRequiredAnswered()}
                custStyle={custStyle}
                onBack={() => setStep("start")}
                onNext={handleSubmit}
                isSubmitting={isSubmitting}
                showSubmit={true}
              />
            </div>
          )}
          {step === "end" && (
            <PollEndScreen
              custStyle={custStyle}
              onMyPolls={() => {
                setAnswers([]);
                setQuestionNo(0);
                setHistory([]);
                router.push("/mypolls");
              }}
            />
          )}
        </div>
        <div
          className={`h-[30px] relative flex items-end ${
            step === "start"
              ? "justify-center"
              : step === "questions" && displayMode === "single"
              ? "justify-end"
              : ""
          }`}
        >
          {step === "start" && (
            <div className="text-center">
              <p
                className="text-[8px] font-normal"
                style={{ color: custStyle.primaryColor }}
              >
                Асуулга үүсгэгч
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: custStyle.primaryColor }}
              >
                MPoll
              </p>
            </div>
          )}
          {step === "questions" && displayMode === "single" && (
            <div
              className="text-2xl font-medium"
              style={{ color: custStyle.primaryColor }}
            >
              {questionNo + 1}/{orderedQuestions.length}
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
}