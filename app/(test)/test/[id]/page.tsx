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
import { createAnswer, getPollById } from "@/api/action";
import { useAlert } from "@/context/AlertProvider";

export default function TestPage() {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [step, setStep] = useState<"start" | "questions" | "end">("start");
  const [questionNo, setQuestionNo] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<
    { questionId: string; option: any[]; textAnswer: string }[]
  >([]);
  const [rateValue, setRateValue] = useState<number>(0);
  const [custStyle, setCustStyle] = useState<{
    backgroundColor: string;
    primaryColor: string;
  }>({ backgroundColor: "#FDFDFD", primaryColor: "#2C2C2C" });

  const {
    data: fetchedData,
    isFetching,
    error,
  } = useQuery({
    queryKey: [id, 'test'],
    queryFn: () => getPollById(id as string),
    enabled: !!id && id !== "new",
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData);
    }
  }, [fetchedData]);

  useEffect(() => {
    if (data && data?.themeId) {
      setCustStyle({
        backgroundColor: dualColors[data?.themeId][0],
        primaryColor: dualColors[data?.themeId][1],
      });
    }
  }, [data]);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = answers.map((answer) => ({
        questionId: answer.questionId,
        optionIds: answer.option.length
          ? answer.option.map((opt) => opt.id)
          : undefined,
        textAnswer: answer.textAnswer || undefined,
      }));

      await createAnswer(formattedAnswers);
      showAlert("Амжилттай", "success", "", true);
      setStep("end");
    } catch (error: any) {
      showAlert("Амжилтгүй", "warning", "", true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const orderedQuestions = data?.questions
    .sort((a: any, b: any) => a.order - b.order)
    .map((question: any) => ({
      ...question,
      options: question.options.sort((a: any, b: any) => a.order - b.order),
    }));

  if (isFetching)
    return (
      <div>
        <Skeleton />
      </div>
    );

  console.log(answers);

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
                title={data?.btnLabel}
                onClick={() => {
                  setStep("questions");
                }}
              />
            </div>
          )}
          {step === "questions" && (
            <div className="flex flex-col gap-5 items-center max-w-[430px] max-h-full">
              <div
                style={{ color: custStyle.primaryColor }}
                className="font-semibold text-sm flex flex-row gap-1"
              >
                <span className="block">{questionNo + 1 + "."}</span>
                <span>{orderedQuestions[questionNo].content}</span>
              </div>

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
                      setQuestionNo(questionNo - 1);
                    } else {
                      setStep("start");
                      setQuestionNo(0);
                      setAnswers([]);
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
                    backgroundColor: hasAnswered(
                      orderedQuestions[questionNo].id,
                      orderedQuestions[questionNo].minAnswerCount,
                      orderedQuestions[questionNo].questionType
                    )
                      ? custStyle.primaryColor
                      : "#D9D9D9",
                  }}
                  disabled={
                    !hasAnswered(
                      orderedQuestions[questionNo].id,
                      orderedQuestions[questionNo].minAnswerCount,
                      orderedQuestions[questionNo].questionType
                    )
                  }
                  onClick={() => {
                    if (questionNo === orderedQuestions.length - 1) {
                      handleSubmit();
                    } else {
                      setQuestionNo(questionNo + 1);
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
