"use client";

import React, { useState } from "react";
import { InputNumber, Radio } from "antd";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { QuestionTextEditorProps } from "@/utils/componentTypes";
import AddIcon from "@/public/icons/add";
import RateStarIcon from "@/public/icons/rate_star";

const questionInputClass =
  "w-full !h-9 bg-[#E6E6E6] !rounded-[10px] !text-[13px] mt-[14px] border-none placeholder:text-[#B3B3B3] placeholder:text-[13px] placeholder:font-normal";

const QuestionTextEditor = ({
  id,
  setChosenType,
  setCurrentPage,
  newQuestions,
  setNewQuestions,
  currentPage,
  currentQuestion,
  setCurrentQuestion,
}: QuestionTextEditorProps) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleDeleteQuestion = () => {
    if (newQuestions.length <= 1) {
      setNewQuestions([
        {
          content: "",
          questionType: null,
          order: 0,
          minAnswerCount: 1,
          rateNumber: 5,
          options: [],
        },
      ]);
      setCurrentQuestion({
        content: "",
        questionType: null,
        order: 0,
        minAnswerCount: 1,
        rateNumber: 5,
        options: [],
      });
      setChosenType(null);
      setCurrentPage(0);
    } else {
      const updatedQuestions = newQuestions.filter(
        (_, index) => index !== currentPage
      );
      setNewQuestions(updatedQuestions);

      const newPage =
        currentPage >= updatedQuestions.length ? currentPage - 1 : currentPage;
      setCurrentPage(newPage);

      setCurrentQuestion(updatedQuestions[newPage]);
    }
  };

  return (
    <div
      id="question_edit"
      className="px-5 py-2 flex-1 justify-between flex flex-col"
    >
      <div className="">
        <div className="rounded-[10px] bg-[#F5F5F5] w-full h-auto flex flex-col justify-between gap-2 mt-5 p-[10px] relative">
          <p className="text-[13px] text-[#1E1E1E] font-semibold leading-[14.6px]">
            Гарчиг
          </p>
          <CustomInput
            onChange={(e: any) => {
              const updatedQuestions = newQuestions.map((item, index) =>
                index === currentPage
                  ? { ...item, content: e.target.value }
                  : item
              );

              setNewQuestions(updatedQuestions);

              if (currentQuestion) {
                setCurrentQuestion({
                  ...currentQuestion,
                  content: e.target.value,
                });
              } else {
                setCurrentQuestion({
                  content: e.target.value,
                  questionType: null,
                  order: currentPage,
                  options: [],
                  minAnswerCount: 1,
                });
              }
            }}
            value={currentQuestion?.content || ""}
            className={questionInputClass}
            placeholder="Асуултаа энд бичнэ үү?"
          />
        </div>

        {/* New Rate Number Input for STAR_RATING and NUMBER_RATING */}
        {["RATING"].includes(currentQuestion?.questionType ?? "") && (
          <div>
            <div className="rounded-[10px] bg-[#F5F5F5] w-full h-auto flex flex-col gap-2 mt-5 p-[10px]">
              <p className="text-[13px] text-[#1E1E1E] font-semibold leading-[14.6px]">
                Үнэлгээний хамгийн их утга
              </p>
              <InputNumber
                onChange={(value: number | null) => {
                  const newValue = value || 5; // Default to 5 if null

                  const newOptions = Array.from(
                    { length: newValue },
                    (_, index) => ({
                      content: (index + 1).toString(),
                      order: index + 1,
                    })
                  );

                  setNewQuestions((prev) =>
                    prev.map((item, index) =>
                      index === currentPage
                        ? { ...item, rateNumber: newValue, options: newOptions }
                        : item
                    )
                  );

                  if (currentQuestion) {
                    setCurrentQuestion({
                      ...currentQuestion,
                      rateNumber: newValue,
                      options: newOptions,
                    });
                  }
                }}
                value={currentQuestion?.rateNumber || 5}
                className={`${questionInputClass} flex items-center`}
                min={1}
                max={10}
              />
            </div>
            <div className="my-4">
              <Radio.Group
                className="w-full"
                optionType="button"
                buttonStyle="solid"
                value={currentQuestion?.rateType || "STAR"}
                onChange={(e) => {
                  const updatedQuestions = newQuestions.map((item, index) =>
                    index === currentPage
                      ? { ...item, rateType: e.target.value }
                      : item
                  );
                  setNewQuestions(updatedQuestions);
                  if (currentQuestion) {
                    setCurrentQuestion({
                      ...currentQuestion,
                      rateType: e.target.value,
                    });
                  }
                }}
              >
                <div className="flex flex-col gap-2 w-full">
                  <Radio value={"STAR"}>
                    <div className="flex flex-row items-center justify-between">
                      <p>Одтой үнэлгээ</p>
                      <div className="flex flex-row gap-2">
                        <RateStarIcon className=" text-yellow-400" />
                        <RateStarIcon className=" text-yellow-400" />
                        <RateStarIcon className=" text-yellow-400" />
                      </div>
                    </div>
                  </Radio>
                  <Radio value={"NUMBER"}>
                    <div className="flex flex-row items-center justify-between">
                      <p>Тоон үнэлгээ</p>
                      <div className="flex flex-row gap-2">
                        <p className="font-bold text-[17px]">1</p>
                        <p className="font-bold text-[17px]">2</p>
                        <p className="font-bold text-[17px]">3</p>
                      </div>
                    </div>
                  </Radio>
                </div>
              </Radio.Group>
            </div>
          </div>
        )}

        {currentQuestion?.options &&
          currentQuestion?.options.length > 0 &&
          currentQuestion?.questionType !== "RATING" &&
          currentQuestion?.questionType !== "YES_NO" && (
            <div>
              {currentQuestion?.questionType === "MULTI_CHOICE" && (
                <div className="rounded-[10px] bg-[#F5F5F5] w-full h-auto flex flex-col gap-2 mt-5 p-[10px]">
                  <p className="text-[13px] text-[#1E1E1E] font-semibold leading-[14.6px]">
                    Доод сонгох хариултын тоо
                  </p>
                  <InputNumber
                    onChange={(value: any) => {
                      setCurrentQuestion((prev) => ({
                        ...prev!,
                        minAnswerCount: value || 1,
                      }));

                      setNewQuestions((prev) =>
                        prev.map((item, index) =>
                          index === currentPage
                            ? { ...item, minAnswerCount: value }
                            : item
                        )
                      );
                    }}
                    defaultValue={1}
                    value={currentQuestion?.minAnswerCount || 1}
                    className={`${questionInputClass} flex items-center`}
                    max={currentQuestion?.options?.length}
                  />
                </div>
              )}

              <div className="rounded-[10px] bg-[#F5F5F5] w-full mt-5 p-[10px] h-auto flex flex-col gap-2">
                <p className="text-[13px] text-[#1E1E1E] font-semibold leading-[14.6px]">
                  Хариулт
                </p>

                <div className="flex flex-col gap-y-3 mt-[14px]">
                  {["MULTI_CHOICE", "SINGLE_CHOICE"].includes(
                    currentQuestion?.questionType ?? ""
                  ) &&
                    currentQuestion?.options?.map((item, answerIndex) => {
                      return (
                        <div key={answerIndex} className="w-full">
                          {focusedIndex === answerIndex ? (
                            <CustomInput
                              className="w-full !h-9 bg-[#E6E6E6] !rounded-[10px] text-[#757575] font-medium !italic !text-[13px] px-2 flex items-center"
                              value={item.content}
                              onChange={(e: any) => {
                                setCurrentQuestion((prev: any) => ({
                                  ...currentQuestion,
                                  options: prev?.options.map(
                                    (
                                      option: {
                                        content: string;
                                        order: number;
                                      },
                                      i: number
                                    ) =>
                                      i === answerIndex
                                        ? { ...option, content: e.target.value }
                                        : option
                                  ),
                                }));
                                setNewQuestions((prev) =>
                                  prev.map((question, questionIndex) =>
                                    questionIndex === currentPage &&
                                    question.options
                                      ? {
                                          ...question,
                                          options: question.options.map(
                                            (option, i) =>
                                              i === answerIndex
                                                ? {
                                                    ...option,
                                                    content: e.target.value,
                                                  }
                                                : option
                                          ),
                                        }
                                      : question
                                  )
                                );
                              }}
                              onFocus={() => setFocusedIndex(answerIndex)}
                              onBlur={() => setFocusedIndex(null)}
                              placeholder="Хариулт"
                            />
                          ) : (
                            <div
                              className="w-full h-9 bg-[#E6E6E6] rounded-[10px] text-[#757575] font-medium italic text-[13px] px-2 flex items-center"
                              onClick={() => setFocusedIndex(answerIndex)}
                            >
                              <span className="text-[#1E1E1E]">
                                {String.fromCharCode(65 + answerIndex)}.
                              </span>
                              {item.content || "Хариулт"}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
                {["MULTI_CHOICE", "SINGLE_CHOICE"].includes(
                  currentQuestion?.questionType ?? ""
                ) && (
                  <div
                    onClick={() => {
                      const newOrder =
                        (currentQuestion?.options?.length || 0) + 1;
                      setCurrentQuestion((prev: any) => ({
                        ...currentQuestion,
                        options: [
                          ...(prev.options || []),
                          { content: "", order: newOrder },
                        ],
                      }));
                      setNewQuestions((prev) =>
                        prev.map((item, index) =>
                          index === currentPage && item.options
                            ? {
                                ...item,
                                options: [
                                  ...item.options,
                                  { content: "", order: newOrder },
                                ],
                              }
                            : item
                        )
                      );
                    }}
                    className="bg-clicked w-full h-9 rounded-full flex items-center justify-between px-4 mt-[14px] cursor-pointer"
                  >
                    <p className="text-[#FDFDFD] text-[13px] font-medium">
                      Сонголт нэмэх
                    </p>
                    <AddIcon className="text-[#FDFDFD]" />
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
      <CustomButton
        title="Устгах"
        onClick={handleDeleteQuestion}
        className="bg-first-red w-full rounded-xl text-white !h-10 !text-sm"
      />
    </div>
  );
};

export default QuestionTextEditor;
