"use client";

import React, { useEffect, useState } from "react";
import { Checkbox, ConfigProvider, Radio, Rate } from "antd";
import TextArea from "antd/es/input/TextArea";
import CustomButton from "@/components/CustomButton";
import { dualColors } from "@/utils/utils";
import RateStarIcon from "@/public/icons/rate_star";
import BoxIcon from "@/public/icons/box_icon";
import ArrowRightIcon from "@/public/icons/arrow_right";


const data = {
  id: "62c4712a-4cd0-4b61-8041-0ed2569aa32a",
  startPage: {
    title: "Асулгын гарчиг байрлана",
    greetingMessage: "Асуулгын тайлбар байрлана",
    btnLabel: "Эхлэх",
  },
  themePage: {
    themeId: 0,
  },
  settingsPage: {
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    duration: 30,
  },
  questions: [
    {
      id: 1,
      order: 2,
      custom: false,
      content:
        "Ихэнх үед ажил дээрээ байхад би амьдралаа хянаж, зохицуулж чадахгүй байгаа мэт санагддаг",
      type: "MULTI_CHOICE",
      minAnswerCount: 3,
      maxrixRows: null,
      options: [
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 2,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 1,
          order: 1,
          content: "Бүрэн санал нийлнэ",
        },
        {
          id: 1,
          order: 1,
          content: "Бүрэн санал нийлнэ",
        },
        {
          id: 1,
          order: 1,
          content: "Бүрэн санал нийлнэ",
        },
        {
          id: 1,
          order: 1,
          content: "Бүрэн санал нийлнэ",
        },
        {
          id: 1,
          order: 1,
          content: "Бүрэн санал нийлнэ",
        },
        {
          id: 1,
          order: 1,
          content: "Бүрэн санал нийлнэ",
        },
        {
          id: 1,
          order: 1,
          content: "Бүрэн санал нийлнэ",
        },
        {
          id: 4,
          order: 4,
          content: "Ерөнхийдөө санал нийлэхгүй",
        },
        {
          id: 3,
          order: 3,
          content: "Дундаж",
        },
        {
          id: 5,
          order: 5,
          content: "Огт санал нийлэхгүй",
        },
        {
          id: 5,
          order: 5,
          content: "Огт санал нийлэхгүй",
        },
        {
          id: 5,
          order: 5,
          content: "Огт санал нийлэхгүй",
        },
        {
          id: 5,
          order: 5,
          content: "Огт санал нийлэхгүй",
        },
        {
          id: 5,
          order: 5,
          content: "Огт санал нийлэхгүй",
        },
        {
          id: 5,
          order: 5,
          content: "Огт санал нийлэхгүй",
        },
      ],
    },
    {
      id: 2,
      order: 1,
      custom: false,
      content:
        "Хэрэв надад илүү их хугацаа байсан бол би ажлаа илүү сайн хийх байсан",
      type: "SINGLE_CHOICE",
      minAnswerCount: 2,
      maxrixRows: null,
      options: [
        {
          id: 6,
          order: 1,
          content: "Бүрэн санал нийлнэ",
        },
        {
          id: 10,
          order: 5,
          content: "Огт санал нийлэхгүй",
        },
        {
          id: 8,
          order: 3,
          content: "Дундаж",
        },
        {
          id: 7,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 9,
          order: 4,
          content: "Ерөнхийдөө санал нийлэхгүй",
        },
      ],
    },
    {
      id: 3,
      order: 3,
      custom: false,
      content:
        "Ихэнх үед ажил дээрээ байхад би амьдралаа хянаж, зохицуулж чадахгүй байгаа мэт санагддаг",
      type: "MULTI_CHOICE",
      minAnswerCount: 2,
      maxrixRows: null,
      options: [
        {
          id: 11,
          order: 2,
          content: "Ерөнхийдөө санал нийлнэ",
        },
        {
          id: 12,
          order: 1,
          content: "Бүрэн санал нийлнэ",
        },
        {
          id: 13,
          order: 4,
          content: "Ерөнхийдөө санал нийлэхгүй",
        },
        {
          id: 14,
          order: 3,
          content: "Дундаж",
        },
        {
          id: 15,
          order: 5,
          content: "Огт санал нийлэхгүй",
        },
      ],
    },
    {
      id: 4,
      order: 4,
      custom: false,
      content:
        "Ихэнх үед ажил дээрээ байхад би амьдралаа хянаж, зохицуулж чадахгүй байгаа мэт санагддаг",
      type: "RATE",
      minAnswerCount: 0,
      rateNumber: 6,
      rateType: "NUMBER",
      maxrixRows: null,
      options: [
        {
          id: 1,
          order: 1,
          content: "Ерөнхийдөө санал нийлнэ",
        },
      ],
    },
    {
      id: 5,
      order: 5,
      custom: false,
      content:
        "Ихэнх үед ажил дээрээ байхад би амьдралаа хянаж, зохицуулж чадахгүй байгаа мэт санагддаг",
      type: "YES_NO",
      minAnswerCount: 0,
      maxrixRows: null,
      options: [
        {
          id: 1,
          order: 1,
          content: "Тийм",
        },
        {
          id: 2,
          order: 2,
          content: "Үгүй",
        },
      ],
    },
    {
      id: 6,
      order: 6,
      custom: false,
      content:
        "Ихэнх үед ажил дээрээ байхад би амьдралаа хянаж, зохицуулж чадахгүй байгаа мэт санагддаг",
      type: "TEXT",
      minAnswerCount: 0,
      maxrixRows: null,
      options: [],
    },
  ],
  endPage: {
    endTitle: "Thank you for your time!",
    thankYouMessage: "Баярлалаа",
  },
};

export default function TestPage() {
  const [step, setStep] = useState<"start" | "questions" | "end">("start");
  const [questionNo, setQuestionNo] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [rateValue, setRateValue] = useState<number>(0);
  const [custStyle, setCustStyle] = useState<{
    backgroundColor: string;
    primaryColor: string;
  }>({ backgroundColor: "#FDFDFD", primaryColor: "#2C2C2C" });

  useEffect(() => {
    if (data && data.themePage.themeId) {
      setCustStyle({
        backgroundColor: dualColors[data.themePage.themeId][0],
        primaryColor: dualColors[data.themePage.themeId][1],
      });
    }
  }, [data]);

  const handleChange = (questionId: number, value?: any) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  useEffect(() => {
    if (answers) console.log(answers);
  }, [answers]);

  const hasAnswered = (id: number, minAnswerCount: number, type: string) => {
    if (type === "MULTI_CHOICE") {
      if (answers[id] === undefined) return false;
      else {
        return answers[id] ? answers[id].length >= minAnswerCount : false;
      }
    }

    if (type === "SINGLE_CHOICE" || type === "RATE" || type === "YES_NO")
      return answers[id] !== undefined;

    if (type === "TEXT")
      return answers[id] !== undefined && answers[id].trim().length > 0;

    return true;
  };

  const orderedQuestions = data.questions
    .sort((a, b) => a.order - b.order)
    .map((question) => ({
      ...question,
      options: question.options.sort((a, b) => a.order - b.order),
    }));

  return (
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
      <div
        className={`h-[49px] flex flex-row items-center justify-center`}
      >
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
                {data.startPage.title}
              </h1>
              <p
                style={{ color: custStyle.primaryColor }}
                className={`text-center text-base font-medium`}
              >
                {data.startPage.greetingMessage}
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
                  {data.settingsPage.duration} мин
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
              title={data.startPage.btnLabel}
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
              <div className="w-full h-[90%]">
                {orderedQuestions[questionNo].type === "MULTI_CHOICE" && (
                  <Checkbox.Group
                    value={answers[orderedQuestions[questionNo].id] || []}
                    onChange={(checkedValues) =>
                      handleChange(
                        orderedQuestions[questionNo].id,
                        checkedValues
                      )
                    }
                    className="circle-checkbox flex gap-3 w-full max-h-full overflow-y-auto"
                  >
                    {orderedQuestions[questionNo].options.map((item, index) => (
                      <Checkbox
                        value={item}
                        key={index}
                        style={{ color: custStyle.primaryColor }}
                        className={`custom-radio w-full border font-open border-[#D9D9D9] rounded-[10px] p-3 text-[13px] font-medium items-center gap-3`}
                      >
                        {item.content}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                )}
                {orderedQuestions[questionNo].type === "SINGLE_CHOICE" && (
                  <Radio.Group
                    onChange={(e) =>
                      handleChange(
                        orderedQuestions[questionNo].id,
                        e.target.value
                      )
                    }
                    value={answers[orderedQuestions[questionNo].id]}
                    className="flex flex-col w-full max-h-full overflow-y-auto"
                  >
                    {orderedQuestions[questionNo].options.map((item, index) => (
                      <Radio
                        style={{ color: custStyle.primaryColor }}
                        className={`custom-radio w-full border font-open !mt-3 border-[#D9D9D9] rounded-[10px] text-[13px] font-medium items-center bg-transparent`}
                        key={index}
                        value={item}
                      >
                        {item.content}
                      </Radio>
                    ))}
                  </Radio.Group>
                )}
                {orderedQuestions[questionNo].type === "RATE" && (
                  <div className="w-full flex items-center justify-center">
                    <Rate
                      count={orderedQuestions[questionNo].rateNumber}
                      value={rateValue}
                      onChange={(value) => {
                        handleChange(orderedQuestions[questionNo].id, value);
                        setRateValue(value);
                      }}
                      character={({ index = 0 }) =>
                        orderedQuestions[questionNo].rateType === "NUMBER" ? (
                          <span
                            className={`text-base font-semibold font-open`}
                            style={{
                              color:
                                index < rateValue
                                  ? custStyle.primaryColor
                                  : "#E0E8F1",
                            }}
                          >
                            {index + 1}
                          </span>
                        ) : (
                          <RateStarIcon
                            fill={
                              index < rateValue
                                ? custStyle.primaryColor
                                : "#E0E8F1"
                            }
                          />
                        )
                      }
                    />
                  </div>
                )}
                {orderedQuestions[questionNo].type === "YES_NO" && (
                  <Radio.Group
                    optionType="button"
                    buttonStyle="solid"
                    onChange={(e) =>
                      handleChange(
                        orderedQuestions[questionNo].id,
                        e.target.value
                      )
                    }
                    value={answers[orderedQuestions[questionNo].id]}
                    className="flex flex-col w-full"
                  >
                    {orderedQuestions[questionNo].options.map(
                      (option, index) => (
                        <Radio
                          style={{ color: custStyle.primaryColor }}
                          key={index}
                          value={option}
                          className="!w-full !mt-3"
                        >
                          {option.content}
                        </Radio>
                      )
                    )}
                  </Radio.Group>
                )}
                {orderedQuestions[questionNo].type === "TEXT" && (
                  <TextArea
                    onChange={(e) =>
                      handleChange(
                        orderedQuestions[questionNo].id,
                        e.target.value
                      )
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
            </ConfigProvider>
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
                    orderedQuestions[questionNo].type
                  )
                    ? custStyle.primaryColor
                    : "#D9D9D9",
                }}
                disabled={
                  !hasAnswered(
                    orderedQuestions[questionNo].id,
                    orderedQuestions[questionNo].minAnswerCount,
                    orderedQuestions[questionNo].type
                  )
                }
                onClick={() => {
                  questionNo === orderedQuestions.length - 1
                    ? setStep("end")
                    : setQuestionNo(questionNo + 1);
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
                Таны судалгаа амжилттай илгээгдлээ
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
                  <span>Миний судалгаа</span>
                  <ArrowRightIcon />
                </div>
              }
              onClick={() => {
                setStep("start");
                setAnswers([]);
                setQuestionNo(0);
              }}
              className="text-[13px] font-semibold h-9 w-[220px] rounded-[99px]"
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
  );
}
