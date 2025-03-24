"use client";

import CustomButton from "@/components/CustomButton";
import ArrowRightIcon from "@/public/icons/arrow_right";
import SeedIcon from "@/public/icons/seed";
import RateStarIcon from "@/public/icons/rate_star";
import { Checkbox, ConfigProvider, Input, Radio, Rate } from "antd";
import React, { useEffect, useState } from "react";

const data = {
  id: "62c4712a-4cd0-4b61-8041-0ed2569aa32a",
  name: "Ажлын байрны стресс",
  startPage: {
    title:
      " Ажил үүргийн ачаалал, хугацааны шахалт, болон ажлын орчинтой холбоотойгоор үүсдэг сэтгэл зүйн дарамт бөгөөд ажилтны эрүүл мэнд, бүтээмжид сөргөөр нөлөөлдөг.",
    greetingMessage:
      "Mind Metrix-ийн бүтээгдэхүүний судалгаа хийх зорилгоор үүсгэсэн survey",
    btnLabel: "Эхлэх",
    imagePosition: "TOP_CENTER",
    showAppLogo: true,
    surveyLogoUrl: "1",
    tip: "Зөв, буруу хариулт байхгүй тул удаан бодолгүй хариулаарай.",
  },
  questions: [
    {
      id: 1,
      order: 2,
      custom: false,
      content:
        "Ихэнх үед ажил дээрээ байхад би амьдралаа хянаж, зохицуулж чадахгүй байгаа мэт санагддаг",
      type: "multi",
      reqNumber: 3,
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
      type: "single",
      reqNumber: 2,
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
      type: "multi",
      reqNumber: 2,
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
      type: "rate",
      reqNumber: 0,
      rateNumber: 6,
      rateType: "number" /** 'number' || 'icon' */,
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
      type: "radio",
      reqNumber: 0,
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
      type: "input",
      reqNumber: 0,
      maxrixRows: null,
      options: [],
    },
  ],
  endPage: {
    endTitle: "Thank you for your time!",
    thankYouMessage: "Баярлалаа",
  },
};

const custStyle = {
  backgroundColor: "#101820",
  primaryColor: "#FEE715",
};

export default function TestPage() {
  const [step, setStep] = useState<"start" | "questions" | "end">("start");
  const [questionNo, setQuestionNo] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [rateValue, setRateValue] = useState<number>(0);

  const handleChange = (questionId: number, value?: any) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  useEffect(() => {
    if (answers) console.log(answers);
  }, [answers]);

  const hasAnswered = (id: number, reqNumber: number, type: string) => {
    if (type === "multi") {
      if (answers[id] === undefined) return false;
      else {
        return answers[id] ? answers[id].length >= reqNumber : false;
      }
    }

    if (type === "single" || type === "rate" || type === "radio")
      return answers[id] !== undefined;

    if (type === "input")
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
        className={`h-[49px] flex flex-row items-center ${
          data.startPage.imagePosition === "TOP_LEFT"
            ? "justify-start"
            : data.startPage.imagePosition === "TOP_CENTER"
            ? "justify-center"
            : data.startPage.imagePosition === "TOP_RIGHT"
            ? "justify-end"
            : ""
        } `}
      >
        <SeedIcon className={`h-full w-auto`} />
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
                {data.name}
              </h1>
              <p
                style={{ color: custStyle.primaryColor }}
                className={`text-center text-base font-medium`}
              >
                {data.startPage.title}
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
                  24 мин
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
                {orderedQuestions[questionNo].type === "multi" && (
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
                {orderedQuestions[questionNo].type === "single" && (
                  <Radio.Group
                    onChange={(e) =>
                      handleChange(
                        orderedQuestions[questionNo].id,
                        e.target.value
                      )
                    }
                    value={answers[orderedQuestions[questionNo].id]}
                    className="flex flex-col gap-3 w-full max-h-full overflow-y-auto"
                  >
                    {orderedQuestions[questionNo].options.map((item, index) => (
                      <Radio
                        style={{ color: custStyle.primaryColor }}
                        className={`custom-radio w-full border font-open border-[#D9D9D9] rounded-[10px] p-3 text-[13px] font-medium items-center gap-3 bg-transparent`}
                        key={index}
                        value={item}
                      >
                        {item.content}
                      </Radio>
                    ))}
                  </Radio.Group>
                )}
                {orderedQuestions[questionNo].type === "rate" && (
                  <div className="w-full flex items-center justify-center">
                    <Rate
                      count={orderedQuestions[questionNo].rateNumber}
                      value={rateValue}
                      onChange={(value) => {
                        handleChange(orderedQuestions[questionNo].id, value);
                        setRateValue(value);
                      }}
                      character={({ index = 0 }) =>
                        orderedQuestions[questionNo].rateType === "number" ? (
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
                {orderedQuestions[questionNo].type === "radio" && (
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
                    className="flex flex-col gap-3 w-full"
                  >
                    {orderedQuestions[questionNo].options.map(
                      (option, index) => (
                        <Radio
                          style={{ color: custStyle.primaryColor }}
                          key={index}
                          value={option}
                        >
                          {option.content}
                        </Radio>
                      )
                    )}
                  </Radio.Group>
                )}
                {orderedQuestions[questionNo].type === "input" && (
                  <Input
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
                className="h-9 w-[220px] rounded-[99px] text-[13px] font-semibold"
                style={{
                  color: custStyle.backgroundColor,
                  backgroundColor: hasAnswered(
                    orderedQuestions[questionNo].id,
                    orderedQuestions[questionNo].reqNumber,
                    orderedQuestions[questionNo].type
                  )
                    ? custStyle.primaryColor
                    : "#D9D9D9",
                }}
                disabled={
                  !hasAnswered(
                    orderedQuestions[questionNo].id,
                    orderedQuestions[questionNo].reqNumber,
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
              <SeedIcon />
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
              Судалгааг үүсгэгч
            </p>
            <p
              className={`text-sm font-medium`}
              style={{ color: custStyle.primaryColor }}
            >
              OptimalNMAX LLC
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
