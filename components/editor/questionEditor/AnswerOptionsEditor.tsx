"use client";

import React, { useState, useEffect } from "react";
import { InputNumber, Checkbox, Radio, Upload, Button, Select } from "antd";
import { FileImageOutlined } from "@ant-design/icons";
import CustomInput from "../../CustomInput";
import AddIcon from "@/public/icons/add";
import { useAlert } from "@/context/AlertProvider";
import { QuestionProps } from "@/utils/componentTypes";

const questionInputClass =
  "w-full !h-9 bg-[#E6E6E6] !rounded-[10px] !text-[13px] mt-[14px] border-none placeholder:text-[#B3B3B3] placeholder:text-[13px] placeholder:font-normal";

interface AnswerOptionsEditorProps {
  currentQuestion: QuestionProps;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<QuestionProps>>;
  newQuestions: QuestionProps[];
  setNewQuestions: React.Dispatch<React.SetStateAction<QuestionProps[]>>;
  currentPage: number;
}

const AnswerOptionsEditor: React.FC<AnswerOptionsEditorProps> = ({
  currentQuestion,
  setCurrentQuestion,
  newQuestions,
  setNewQuestions,
  currentPage,
}) => {
  const { showAlert } = useAlert();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [optionFileLists, setOptionFileLists] = useState<any[][]>(
    currentQuestion?.options?.map(() => []) || []
  );

  useEffect(() => {
    setOptionFileLists(
      currentQuestion?.options?.map((option) =>
        option.poster
          ? [
              {
                uid: `-${option.order}`,
                name: `option-${option.order}.png`,
                status: "done",
                url: option.poster,
              },
            ]
          : []
      ) || []
    );
  }, [currentQuestion]);

  const handleOptionUploadChange = (
    { fileList }: { fileList: any[] },
    answerIndex: number
  ) => {
    const file = fileList[0];
    const newOptionFileLists = [...optionFileLists];
    newOptionFileLists[answerIndex] = fileList.slice(-1);
    setOptionFileLists(newOptionFileLists);

    if (file && file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setNewQuestions((prev) =>
          prev.map((item, index) =>
            index === currentPage && item.options
              ? {
                  ...item,
                  options: item.options.map((opt, i) =>
                    i === answerIndex ? { ...opt, poster: base64String } : opt
                  ),
                }
              : item
          )
        );
        setCurrentQuestion((prev) => ({
          ...prev,
          options: prev?.options?.map((opt, i) =>
            i === answerIndex ? { ...opt, poster: base64String } : opt
          ),
        }));
      };
      reader.readAsDataURL(file.originFileObj);
    } else if (!fileList.length) {
      setNewQuestions((prev) =>
        prev.map((item, index) =>
          index === currentPage && item.options
            ? {
                ...item,
                options: item.options.map((opt, i) =>
                  i === answerIndex ? { ...opt, poster: null } : opt
                ),
              }
            : item
        )
      );
      setCurrentQuestion((prev) => ({
        ...prev,
        options: prev?.options?.map((opt, i) =>
          i === answerIndex ? { ...opt, poster: null } : opt
        ),
      }));
    }
  };

  const handleCorrectAnswerChange = (values: number[]) => {
    const updatedOptions =
      currentQuestion?.options?.map((opt, i) => ({
        ...opt,
        isCorrect: values.includes(i),
      })) || [];
    setCurrentQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
    setNewQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === currentPage && question.options
          ? {
              ...question,
              options: updatedOptions,
            }
          : question
      )
    );
  };

  const handleSingleCorrectAnswerChange = (answerIndex: number) => {
    const updatedOptions =
      currentQuestion?.options?.map((opt, i) => ({
        ...opt,
        isCorrect: i === answerIndex,
      })) || [];
    setCurrentQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
    setNewQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === currentPage && question.options
          ? {
              ...question,
              options: updatedOptions,
            }
          : question
      )
    );
  };

  // Generate options for the next question dropdown
  const nextQuestionOptions = newQuestions
    .filter((q) => q.order > currentQuestion.order)
    .map((q) => ({
      value: q.order,
      label: `Q${q.order}: ${q.content || "Гарчиггүй"}`,
    }));

  return (
    <div>
      {currentQuestion?.questionType === "MULTI_CHOICE" && (
        <div className="rounded-[10px] bg-[#F5F5F5] w-full h-auto flex flex-col gap-2 mt-5 p-[10px]">
          <p className="text-[13px] text-[#1E1E1E] font-semibold leading-[14.6px]">
            Доод сонгох хариултын тоо
          </p>
          <InputNumber
            onChange={(value: any) => {
              setCurrentQuestion((prev) => ({
                ...prev,
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
      {currentQuestion?.options &&
        currentQuestion?.options.length > 0 &&
        currentQuestion?.questionType !== "RATING" &&
        currentQuestion?.questionType !== "MULTIPLE_CHOICE_GRID" && (
          <div className="rounded-[10px] bg-[#F5F5F5] w-full mt-5 p-[10px] h-auto flex flex-col gap-2">
            <p className="text-[13px] text-[#1E1E1E] font-semibold leading-[14.6px]">
              Хариулт
            </p>
            {["MULTI_CHOICE", "SINGLE_CHOICE", "DROPDOWN"].includes(
              currentQuestion?.questionType ?? ""
            ) &&
              currentQuestion?.hasCorrectAnswer && (
                <div className="mt-2">
                  <p className="text-[13px] text-[#1E1E1E] font-semibold">
                    Зөв хариулт
                  </p>
                  {currentQuestion?.questionType === "MULTI_CHOICE" ? (
                    <Checkbox.Group
                      value={currentQuestion?.options
                        ?.map((opt, i) => (opt.isCorrect ? i : -1))
                        .filter((i) => i !== -1)}
                      onChange={(checkedValues) =>
                        handleCorrectAnswerChange(checkedValues as number[])
                      }
                    >
                      {currentQuestion?.options?.map((_, index) => (
                        <Checkbox key={index} value={index}>
                          {String.fromCharCode(65 + index)}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  ) : (
                    <Radio.Group
                      value={currentQuestion?.options?.findIndex(
                        (opt) => opt.isCorrect
                      )}
                      onChange={(e) =>
                        handleSingleCorrectAnswerChange(e.target.value)
                      }
                    >
                      {currentQuestion?.options?.map((_, index) => (
                        <Radio key={index} value={index}>
                          {String.fromCharCode(65 + index)}
                        </Radio>
                      ))}
                    </Radio.Group>
                  )}
                </div>
              )}
            {currentQuestion?.questionType === "YES_NO" &&
              currentQuestion.hasCorrectAnswer && (
                <div className="mt-2">
                  <p className="text-[13px] text-[#1E1E1E] font-semibold">
                    Зөв хариулт
                  </p>
                  <Radio.Group
                    value={currentQuestion.options.findIndex(
                      (opt) => opt.isCorrect
                    )}
                    onChange={(e) =>
                      handleSingleCorrectAnswerChange(e.target.value)
                    }
                  >
                    {currentQuestion.options.map((opt, index) => (
                      <Radio key={index} value={index}>
                        {opt.content}
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>
              )}
            <div className="flex flex-col gap-y-3 mt-[14px]">
              {currentQuestion?.options?.map((item, answerIndex) => (
                <div key={answerIndex} className="w-full">
                  <div className="flex flex-row gap-1 items-center">
                    {["MULTI_CHOICE", "SINGLE_CHOICE", "DROPDOWN"].includes(
                      currentQuestion?.questionType ?? ""
                    ) ? (
                      focusedIndex === answerIndex ? (
                        <CustomInput
                          className="w-full !h-9 bg-[#E6E6E6] !rounded-[10px] text-[#757575] font-medium !italic !text-[13px] px-2 flex items-center"
                          value={item.content}
                          onChange={(e: any) => {
                            setCurrentQuestion((prev) => ({
                              ...prev,
                              options: (prev?.options ?? []).map((option, i) =>
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
                      )
                    ) : (
                      <div className="w-full h-9 bg-[#E6E6E6] rounded-[10px] text-[#757575] font-medium italic text-[13px] px-2 flex items-center">
                        {item.content}
                      </div>
                    )}
                    {currentQuestion.isPointBased && (
                      <InputNumber
                        min={0}
                        max={100}
                        value={item.points || 0}
                        onChange={(value: number | null) => {
                          const newPoints = value || 0;
                          const updatedOptions =
                            currentQuestion?.options?.map((opt, i) =>
                              i === answerIndex
                                ? { ...opt, points: newPoints }
                                : opt
                            ) || [];
                          const totalPoints = updatedOptions.reduce(
                            (sum, opt) => sum + (opt.points || 0),
                            0
                          );
                          if (totalPoints > 100) {
                            showAlert(
                              "Нийт оноо 100 байна",
                              "warning",
                              "",
                              true
                            );
                            return;
                          }
                          setCurrentQuestion((prev) => ({
                            ...prev,
                            options: updatedOptions,
                          }));
                          setNewQuestions((prev) =>
                            prev.map((question, questionIndex) =>
                              questionIndex === currentPage && question.options
                                ? {
                                    ...question,
                                    options: updatedOptions,
                                  }
                                : question
                            )
                          );
                        }}
                        className={`${questionInputClass} w-20 mt-2`}
                        placeholder="Оноо"
                      />
                    )}
                  </div>
                  <div className="flex flex-row gap-2 mt-2">
                    <Select
                      value={item.nextQuestionOrder || undefined}
                      onChange={(value: number | undefined) => {
                        const updatedOptions =
                          currentQuestion?.options?.map((opt, i) =>
                            i === answerIndex
                              ? { ...opt, nextQuestionOrder: value || null }
                              : opt
                          ) || [];
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          options: updatedOptions,
                        }));
                        setNewQuestions((prev) =>
                          prev.map((question, questionIndex) =>
                            questionIndex === currentPage && question.options
                              ? {
                                  ...question,
                                  options: updatedOptions,
                                }
                              : question
                          )
                        );
                      }}
                      className="w-24"
                      placeholder="Дараах А"
                      allowClear
                      options={nextQuestionOptions}
                    />
                    {["MULTI_CHOICE", "SINGLE_CHOICE", "DROPDOWN"].includes(
                      currentQuestion?.questionType ?? ""
                    ) && (
                      <Upload
                        fileList={optionFileLists[answerIndex] || []}
                        onChange={(info) =>
                          handleOptionUploadChange(info, answerIndex)
                        }
                        beforeUpload={(file) => {
                          const isLt2M = file.size / 1024 / 1024 < 2;
                          if (!isLt2M) {
                            showAlert(
                              "Image must be smaller than 2MB!",
                              "warning",
                              "",
                              true
                            );
                          }
                          return isLt2M || Upload.LIST_IGNORE;
                        }}
                        accept="image/*"
                        listType="picture"
                        maxCount={1}
                      >
                        <Button
                          icon={<FileImageOutlined />}
                          style={{ marginTop: "8px" }}
                        ></Button>
                      </Upload>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {["MULTI_CHOICE", "SINGLE_CHOICE", "DROPDOWN"].includes(
              currentQuestion?.questionType ?? ""
            ) && (
              <div
                onClick={() => {
                  const newOrder = (currentQuestion?.options?.length || 0) + 1;
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    options: [
                      ...(prev.options || []),
                      {
                        content: "",
                        order: newOrder,
                        poster: null,
                        points: 0,
                        isCorrect: false,
                        nextQuestionOrder: null,
                        rowIndex: null,
                        columnIndex: null,
                      },
                    ],
                  }));
                  setNewQuestions((prev) =>
                    prev.map((item, index) =>
                      index === currentPage && item.options
                        ? {
                            ...item,
                            options: [
                              ...item.options,
                              {
                                content: "",
                                order: newOrder,
                                poster: null,
                                points: 0,
                                isCorrect: false,
                                nextQuestionOrder: null,
                                rowIndex: null,
                                columnIndex: null,
                              },
                            ],
                          }
                        : item
                    )
                  );
                  setOptionFileLists((prev) => [...prev, []]);
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
        )}
    </div>
  );
};

export default AnswerOptionsEditor;
