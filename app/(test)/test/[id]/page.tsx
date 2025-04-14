"use client";

import React, { useEffect, useState } from "react";
import {
  Checkbox,
  ConfigProvider,
  Radio,
  Rate,
  Skeleton,
  Switch,
  Card,
  Button,
  Image,
} from "antd";
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
  required?: boolean;
  rateNumber?: number;
  rateType?: string;
  poster?: string | null;
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
  const [timeLeft, setTimeLeft] = useState<number>(0);
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
  // New state for display mode
  const [displayMode, setDisplayMode] = useState<"single" | "all">("single");

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

  // New function to check if all required questions are answered
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

  // Render individual question component
  const renderQuestion = (question: Question, index?: number) => {
    const isError = requiredError.includes(question.id);
    return (
      <Card
        key={question.id}
        title={
          <div className="flex items-center gap-2">
            <span>
              {index !== undefined
                ? `${index + 1}. ${question.content}`
                : question.content}
            </span>
            {question.required && <span className="text-red-500">*</span>}
          </div>
        }
        className="w-full shadow-xl hover:scale-102 transition-all duration-300 ease-in-out"
        style={{ marginBottom: 16, backgroundColor: custStyle.backgroundColor }}
        headStyle={{ color: custStyle.primaryColor }}
        styles={{ body: { color: custStyle.primaryColor } }}
      >
        {question.poster && (
          <Image
          src={question.poster}
          height={100}
          style={{
            width: 'auto'
          }}
          onError={(e) => {
                e.currentTarget.style.display = "none"; // Hide broken images
              }}
          />
        )}
        {isError && (
          <div className="text-red-500 text-xs mb-2">
            Энэ асуултад заавал хариулах шаардлагатай
          </div>
        )}

        {question.questionType === "MULTI_CHOICE" && (
          <Checkbox.Group
            value={
              answers.find((answer) => answer.questionId === question.id)
                ?.option || []
            }
            onChange={(checkedValues) =>
              handleChange(question.id, checkedValues, "")
            }
            className="circle-checkbox flex gap-3 w-full max-h-full overflow-y-auto"
          >
            {question.options.map((item: any, idx: any) => (
              <Checkbox
                value={item}
                key={idx}
                style={{ color: custStyle.primaryColor }}
                className="custom-radio w-full border font-open border-[#D9D9D9] rounded-[10px] p-3 text-[13px] font-medium items-center gap-3"
              >
                {item.content}
              </Checkbox>
            ))}
          </Checkbox.Group>
        )}

        {question.questionType === "SINGLE_CHOICE" && (
          <Radio.Group
            onChange={(e) => handleChange(question.id, [e.target.value], "")}
            value={
              answers.find((answer) => answer.questionId === question.id)
                ?.option?.[0] || undefined
            }
            className="flex flex-col w-full max-h-full overflow-y-auto"
          >
            {question.options.map((item: any, idx: any) => (
              <Radio
                style={{ color: custStyle.primaryColor }}
                className="custom-radio w-full border font-open !mt-3 border-[#D9D9D9] rounded-[10px] text-[13px] font-medium items-center bg-transparent"
                key={idx}
                value={item}
              >
                {item.content}
              </Radio>
            ))}
          </Radio.Group>
        )}

        {question.questionType === "RATING" && (
          <div className="w-full flex items-center justify-center">
            <Rate
              count={question.rateNumber}
              value={Number(
                answers.find((answer) => answer.questionId === question.id)
                  ?.option?.[0]?.content || 0
              )}
              onChange={(value) => {
                const selectedOption = question.options.find(
                  (opt: any) => opt.content === String(value)
                );
                handleChange(question.id, [selectedOption], "");
              }}
              character={({ index = 0 }) =>
                question.rateType === "NUMBER" ? (
                  <span
                    className="text-base font-semibold font-open"
                    style={{
                      color:
                        index <
                        Number(
                          answers.find(
                            (answer) => answer.questionId === question.id
                          )?.option?.[0]?.content || 0
                        )
                          ? custStyle.primaryColor
                          : "#E0E8F1",
                    }}
                  >
                    {question.options[index].content}
                  </span>
                ) : (
                  <RateStarIcon
                    fill={
                      index <
                      Number(
                        answers.find(
                          (answer) => answer.questionId === question.id
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

        {question.questionType === "YES_NO" && (
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => handleChange(question.id, [e.target.value], "")}
            value={
              answers.find((answer) => answer.questionId === question.id)
                ?.option?.[0] || undefined
            }
            className="flex flex-col w-full max-h-full overflow-y-auto"
          >
            {question.options.map((item: any, idx: any) => (
              <Radio
                style={{ color: custStyle.primaryColor }}
                className="custom-radio w-full border font-open !mt-3 border-[#D9D9D9] rounded-[10px] text-[13px] font-medium items-center bg-transparent"
                key={idx}
                value={item}
              >
                {item.content}
              </Radio>
            ))}
          </Radio.Group>
        )}

        {question.questionType === "TEXT" && (
          <TextArea
            onChange={(e) => handleChange(question.id, [], e.target.value)}
            value={
              answers.find((answer) => answer.questionId === question.id)
                ?.textAnswer || ""
            }
            style={{
              backgroundColor: custStyle.backgroundColor,
              color: custStyle.primaryColor,
            }}
            placeholder="Enter text"
            className=""
          />
        )}
      </Card>
    );
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
        className="flex flex-col font-open h-screen pt-10"
      >
        <div className="h-[49px] flex flex-row items-center justify-center">
          <BoxIcon className="h-full w-auto" />
        </div>
        <div className="flex flex-1 flex-col items-center overflow-hidden">
          {step === "start" && (
            <div className="flex flex-col gap-20 items-center max-w-[630px]">
              <div className="flex flex-col gap-5">
                <h1
                  style={{ color: custStyle.primaryColor }}
                  className="text-center text-5xl font-semibold"
                >
                  {data?.title}
                </h1>
                <p
                  style={{ color: custStyle.primaryColor }}
                  className="text-center text-base font-medium"
                >
                  {data?.greetingMessage}
                </p>
                <div className="flex flex-col items-center gap-[10px]">
                  <p
                    style={{ color: custStyle.primaryColor }}
                    className="text-[13px] font-medium"
                  >
                    Судалгааны хугацаа
                  </p>
                  <div className="rounded-[99px] px-5 py-[5px] bg-[#434343] text-white text-sm font-medium">
                    {data?.duration} мин
                  </div>
                </div>
                {/* New Switch for display mode */}
                <div className="flex items-center gap-4">
                  <p
                    style={{ color: custStyle.primaryColor }}
                    className="text-[13px] font-medium"
                  >
                    {displayMode === "single" ? "Нэг асуулт" : "Бүх асуултууд"}
                  </p>
                  <Switch
                    checked={displayMode === "all"}
                    onChange={(checked) =>
                      setDisplayMode(checked ? "all" : "single")
                    }
                    checkedChildren="Бүгд"
                    unCheckedChildren="Нэг"
                  />
                </div>
              </div>
              <CustomButton
                titleClassname="text-base font-medium"
                className="h-[42px] w-[200px] rounded-[999px] hover:cursor-pointer"
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
          {step === "questions" && displayMode === "single" && (
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

              {requiredError.includes(orderedQuestions[questionNo].id) && (
                <div className="text-red-500 text-xs">
                  Энэ асуултад заавал хариулах шаардлагатай
                </div>
              )}

              <div className="w-full h-[90%]">
                {renderQuestion(orderedQuestions[questionNo])}
              </div>

              <div className="w-full flex flex-row gap-24 justify-between items-center">
                <CustomButton
                  title="Буцах"
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
          {step === "questions" && displayMode === "all" && (
            <div className="flex flex-col items-center gap-5 w-220 max-h-full h-full">
              <div>{formatTime(timeLeft)}</div>
              <div className="flex flex-col gap-5 items-center w-full max-w-[630px] max-h-full h-full overflow-y-auto px-6">
                {orderedQuestions.map((question, index) =>
                  renderQuestion(question, index)
                )}
              </div>
              <div className="flex flex-row gap-4">
                <CustomButton
                  title={"Буцах"}
                  onClick={() => setStep("start")}
                  className="bg-[#888] !text-xs px-8 rounded-[99px] !h-10 hover:cursor-pointer hover:bg-main-purple"
                />
                <Button
                  type="primary"
                  size="large"
                  className="hover:cursor-pointer"
                  loading={isSubmitting}
                  disabled={!areAllRequiredAnswered()}
                  onClick={handleSubmit}
                  style={{
                    backgroundColor: areAllRequiredAnswered()
                      ? custStyle.primaryColor
                      : "#D9D9D9",
                    color: custStyle.backgroundColor,
                    borderRadius: 99,
                    height: 40,
                    width: 280,
                  }}
                >
                  Дуусгах
                </Button>
              </div>
            </div>
          )}
          {step === "end" && (
            <div className="flex flex-col items-center gap-10">
              <div className="flex flex-col items-center gap-4">
                <p
                  className="text-base font-medium"
                  style={{ color: custStyle.primaryColor }}
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
                  <div className="flex flex-row items-center justify-center gap-[10px] text-xs">
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
