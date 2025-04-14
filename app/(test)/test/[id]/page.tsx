"use client";

import React, { useEffect, useState } from "react";
import { Checkbox, ConfigProvider, Radio, Rate, Skeleton } from "antd";
import TextArea from "antd/es/input/TextArea";
import CustomButton from "@/components/CustomButton";
import { dualColors } from "@/utils/utils";
import RateStarIcon from "@/public/icons/rate_star";
import BoxIcon from "@/public/icons/box_icon";
import ArrowRightIcon from "@/public/icons/arrow_right";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  createAnswer,
  getPollById,
  getPollForTest,
  recordFailedAttendance,
} from "@/api/action";
import { useAlert } from "@/context/AlertProvider";

interface Question {
  id: string;
  content: string;
  questionType: string;
  minAnswerCount: number;
  options: any[];
  order: number;
  required?: boolean; // Add required field
}

export default function TestPage() {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [requiredError, setRequiredError] = useState<string[]>([]);
  const [step, setStep] = useState<"start" | "questions" | "end">("start");
  const [questionNo, setQuestionNo] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderedQuestions, setOrderedQuestions] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0); // Timer in seconds
  const [timerActive, setTimerActive] = useState(false);
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
      setOrderedQuestions(
        data?.questions
          .sort((a: any, b: any) => a.order - b.order)
          .map((question: any) => ({
            ...question,
            options: question.options.sort(
              (a: any, b: any) => a.order - b.order
            ),
          }))
      );
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

    if (type === "SINGLE_CHOICE" || type === "RATING" || type === "YES_NO") {
      return answer !== undefined && answer.option?.length > 0;
    }

    if (type === "TEXT") {
      return answer !== undefined && answer.textAnswer?.trim().length > 0;
    }

    return true;
  };

  const isButtonDisabled = (question: Question) => {
    // If question is not required, button is never disabled
    if (!question.required) {
      return false;
    }
    // For required questions, check if answered
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

  const handleSubmit = async () => {
    // Check required questions first
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
        [orderedQuestions[questionNo].id]: timeSpent,
      }));

      const formattedAnswers = answers.map((answer) => ({
        questionId: answer.questionId,
        optionIds: answer.option.length
          ? answer.option.map((opt) => opt.id)
          : undefined,
        textAnswer: answer.textAnswer || undefined,
        timeTaken:
          answer.questionId === orderedQuestions[questionNo].id
            ? timeSpent
            : timeTakenPerQuestion[answer.questionId] || 0,
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
        },
      }}
    >
      <div
        style={
          {
            backgroundColor: custStyle.backgroundColor,
            "--primary-color": custStyle.primaryColor,
            "--bg-color": custStyle.backgroundColor,
          } as React.CSSProperties
        }
        className={`p-[30px] flex flex-col font-open h-screen`}
      >
        <div className={`h-[49px] flex flex-row items-center justify-center`}>
          <BoxIcon className={`h-full w-auto`} />
        </div>
        <div
          className={`flex flex-1 flex-col items-center py-[72px] overflow-hidden`}
        >
          {step === "start" && (
            <div className={`flex flex-col gap-20 items-center max-w-[630px]`}>
              <div className="flex flex-col gap-5">
                <h1
                  style={{ color: custStyle.primaryColor }}
                  className={`text-center text-5xl font-semibold`}
                >
                  {data?.title}
                </h1>
                <p
                  style={{ color: custStyle.primaryColor }}
                  className={`text-center text-base font-medium`}
                >
                  {data?.greetingMessage}
                </p>
                <div className={`flex flex-col items-center gap-[10px]`}>
                  <p
                    style={{ color: custStyle.primaryColor }}
                    className={`text-[13px] font-mediu`}
                  >
                    Судалгааны хугацаа
                  </p>
                  <div
                    className={`rounded-[99px] px-5 py-[5px] bg-[#434343] text-white text-sm font-medium`}
                  >
                    {data?.duration} мин
                  </div>
                </div>
              </div>
              <CustomButton
                titleClassname={`text-base font-medium`}
                className={`h-[42px] w-[200px] rounded-[999px]`}
                style={{
                  backgroundColor: custStyle.primaryColor,
                  color: custStyle.backgroundColor,
                }}
                title={data?.btnLabel || "Эхлэх"}
                onClick={() => {
                  setStep("questions");
                }}
              />
            </div>
          )}
          {step === "questions" && (
            <div className="flex flex-col gap-5 items-center max-w-[430px] max-h-full">
              <div>{formatTime(timeLeft)}</div>
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

              {/* Show error message if this question is required and unanswered */}
              {requiredError.includes(orderedQuestions[questionNo].id) && (
                <div className="text-red-500 text-xs">
                  Энэ асуултад заавал хариулах шаардлагатай
                </div>
              )}

              <div className="w-full h-[90%]">
                {orderedQuestions[questionNo].questionType ===
                  "MULTI_CHOICE" && (
                  <Checkbox.Group
                    value={
                      answers.find(
                        (answer) =>
                          answer.questionId === orderedQuestions[questionNo].id
                      )?.option || []
                    }
                    onChange={(checkedValues) =>
                      handleChange(
                        orderedQuestions[questionNo].id,
                        checkedValues,
                        ""
                      )
                    }
                    className="circle-checkbox flex gap-3 w-full max-h-full overflow-y-auto"
                  >
                    {orderedQuestions[questionNo].options.map(
                      (item: any, index: any) => (
                        <Checkbox
                          value={item}
                          key={index}
                          style={{ color: custStyle.primaryColor }}
                          className={`custom-radio w-full border font-open border-[#D9D9D9] rounded-[10px] p-3 text-[13px] font-medium items-center gap-3`}
                        >
                          {item.content}
                        </Checkbox>
                      )
                    )}
                  </Checkbox.Group>
                )}

                {orderedQuestions[questionNo].questionType ===
                  "SINGLE_CHOICE" && (
                  <Radio.Group
                    onChange={(e) =>
                      handleChange(
                        orderedQuestions[questionNo].id,
                        [e.target.value],
                        ""
                      )
                    }
                    value={
                      answers.find(
                        (answer) =>
                          answer.questionId === orderedQuestions[questionNo].id
                      )?.option?.[0] || undefined
                    }
                    className="flex flex-col w-full max-h-full overflow-y-auto"
                  >
                    {orderedQuestions[questionNo].options.map(
                      (item: any, index: any) => (
                        <Radio
                          style={{ color: custStyle.primaryColor }}
                          className={`custom-radio w-full border font-open !mt-3 border-[#D9D9D9] rounded-[10px] text-[13px] font-medium items-center bg-transparent`}
                          key={index}
                          value={item}
                        >
                          {item.content}
                        </Radio>
                      )
                    )}
                  </Radio.Group>
                )}

                {orderedQuestions[questionNo].questionType === "RATING" && (
                  <div className="w-full flex items-center justify-center">
                    <Rate
                      count={orderedQuestions[questionNo].rateNumber}
                      value={Number(
                        answers.find(
                          (answer) =>
                            answer.questionId ===
                            orderedQuestions[questionNo].id
                        )?.option?.[0]?.content || 0
                      )}
                      onChange={(value) => {
                        const selectedOption = orderedQuestions[
                          questionNo
                        ].options.find(
                          (opt: any) => opt.content === String(value)
                        );
                        handleChange(
                          orderedQuestions[questionNo].id,
                          [selectedOption],
                          ""
                        );
                      }}
                      character={({ index = 0 }) =>
                        orderedQuestions[questionNo].rateType === "NUMBER" ? (
                          <span
                            className={`text-base font-semibold font-open`}
                            style={{
                              color:
                                index <
                                Number(
                                  answers.find(
                                    (answer) =>
                                      answer.questionId ===
                                      orderedQuestions[questionNo].id
                                  )?.option?.[0]?.content || 0
                                )
                                  ? custStyle.primaryColor
                                  : "#E0E8F1",
                            }}
                          >
                            {
                              orderedQuestions[questionNo].options[index]
                                .content
                            }
                          </span>
                        ) : (
                          <RateStarIcon
                            fill={
                              index <
                              Number(
                                answers.find(
                                  (answer) =>
                                    answer.questionId ===
                                    orderedQuestions[questionNo].id
                                )?.option?.[0]?.content || 0
                              )
                                ? custStyle.primaryColor
                                : "#E0E8F1"
                            }
                          />
                        )
                      }
                    />
                  </div>
                )}

                {orderedQuestions[questionNo].questionType === "YES_NO" && (
                  <Radio.Group
                    optionType="button"
                    buttonStyle="solid"
                    onChange={(e) =>
                      handleChange(
                        orderedQuestions[questionNo].id,
                        [e.target.value],
                        ""
                      )
                    }
                    value={
                      answers.find(
                        (answer) =>
                          answer.questionId === orderedQuestions[questionNo].id
                      )?.option?.[0] || undefined
                    }
                    className="flex flex-col w-full max-h-full overflow-y-auto"
                  >
                    {orderedQuestions[questionNo].options.map(
                      (item: any, index: any) => (
                        <Radio
                          style={{ color: custStyle.primaryColor }}
                          className={`custom-radio w-full border font-open !mt-3 border-[#D9D9D9] rounded-[10px] text-[13px] font-medium items-center bg-transparent`}
                          key={index}
                          value={item}
                        >
                          {item.content}
                        </Radio>
                      )
                    )}
                  </Radio.Group>
                )}

                {orderedQuestions[questionNo].questionType === "TEXT" && (
                  <TextArea
                    onChange={(e) =>
                      handleChange(
                        orderedQuestions[questionNo].id,
                        [],
                        e.target.value
                      )
                    }
                    value={
                      answers.find(
                        (answer) =>
                          answer.questionId === orderedQuestions[questionNo].id
                      )?.textAnswer || ""
                    }
                    style={{
                      backgroundColor: custStyle.backgroundColor,
                      color: custStyle.primaryColor,
                    }}
                    placeholder="Enter text"
                    className=""
                  />
                )}
              </div>

              <div className="w-full flex flex-row gap-24 justify-between items-center">
                <CustomButton
                  title={"Буцах"}
                  className="text-[#B3B3B3] text-[13px] font-semibold h-9 w-[79px]"
                  onClick={() => {
                    if (questionNo > 0) {
                      const timeSpent = Math.round(
                        (Date.now() - questionStartTime) / 1000
                      );
                      setTimeTakenPerQuestion((prev) => ({
                        ...prev,
                        [orderedQuestions[questionNo].id]: timeSpent,
                      }));
                      setQuestionNo(questionNo - 1);
                      setQuestionStartTime(Date.now());
                      setRequiredError((prev) =>
                        prev.filter(
                          (id) => id !== orderedQuestions[questionNo].id
                        )
                      );
                    } else {
                      setStep("start");
                      setQuestionNo(0);
                      setAnswers([]);
                      setRequiredError([]);
                    }
                  }}
                />
                <CustomButton
                  title={
                    questionNo === orderedQuestions.length - 1
                      ? "Дуусгах"
                      : "Цааш"
                  }
                  className="h-9 w-[220px] rounded-[99px] text-[13px] font-semibold cursor-pointer"
                  style={{
                    color: custStyle.backgroundColor,
                    backgroundColor: isButtonDisabled(
                      orderedQuestions[questionNo]
                    )
                      ? "#D9D9D9"
                      : custStyle.primaryColor,
                  }}
                  disabled={isButtonDisabled(orderedQuestions[questionNo])}
                  onClick={() => {
                    const timeSpent = Math.round(
                      (Date.now() - questionStartTime) / 1000
                    );
                    setTimeTakenPerQuestion((prev) => ({
                      ...prev,
                      [orderedQuestions[questionNo].id]: timeSpent,
                    }));

                    setRequiredError((prev) =>
                      prev.filter(
                        (id) => id !== orderedQuestions[questionNo].id
                      )
                    );

                    if (questionNo === orderedQuestions.length - 1) {
                      handleSubmit();
                    } else {
                      setQuestionNo(questionNo + 1);
                      setQuestionStartTime(Date.now());
                    }
                  }}
                />
              </div>
            </div>
          )}
          {step === "end" && (
            <div className="flex flex-col items-center gap-10">
              <div className="flex flex-col items-center gap-4">
                <p
                  className="text-base font-medium"
                  style={{
                    color: custStyle.primaryColor,
                  }}
                >
                  Таны асуулга амжилттай илгээгдлээ
                </p>
                <BoxIcon />
              </div>
              <CustomButton
                style={{
                  color: custStyle.backgroundColor,
                  backgroundColor: custStyle.primaryColor,
                }}
                title={
                  <div className="flex flex-row items-center justify-center gap-[10px]">
                    <span>Миний асуулга</span>
                    <ArrowRightIcon />
                  </div>
                }
                onClick={() => {
                  setAnswers([]);
                  setQuestionNo(0);
                  router.push("/mypolls");
                }}
                className="text-[13px] font-semibold h-9 w-[220px] rounded-[99px] hover:cursor-pointer"
              />
            </div>
          )}
        </div>
        <div
          className={`h-[30px] relative flex items-end ${
            step === "start"
              ? "justify-center"
              : step === "questions"
              ? "justify-end"
              : ""
          }`}
        >
          {step === "start" && (
            <div className="text-center">
              <p
                className={`text-[8px] font-normal`}
                style={{ color: custStyle.primaryColor }}
              >
                Асуулга үүсгэгч
              </p>
              <p
                className={`text-sm font-medium`}
                style={{ color: custStyle.primaryColor }}
              >
                MPoll
              </p>
            </div>
          )}
          {step === "questions" && (
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
