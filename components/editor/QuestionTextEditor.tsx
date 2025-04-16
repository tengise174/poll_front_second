"use client";

import React, { useState, useEffect } from "react";
import { Button, InputNumber, Checkbox, Radio, Switch, Upload } from "antd";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { QuestionTextEditorProps } from "@/utils/componentTypes";
import AddIcon from "@/public/icons/add";
import RateStarIcon from "@/public/icons/rate_star";
import { FileImageOutlined } from "@ant-design/icons";
import { useAlert } from "@/context/AlertProvider";

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
  const { showAlert } = useAlert();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [optionFileLists, setOptionFileLists] = useState<any[][]>(
    currentQuestion?.options?.map(() => []) || []
  );

  useEffect(() => {
    if (currentQuestion?.poster) {
      setFileList([
        {
          uid: "-1",
          name: "poster.png",
          status: "done",
          url: currentQuestion.poster,
        },
      ]);
    } else {
      setFileList([]);
    }

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
          required: false,
          poster: null,
          isPointBased: false,
          hasCorrectAnswer: false,
        },
      ]);
      setCurrentQuestion({
        content: "",
        questionType: null,
        order: 0,
        minAnswerCount: 1,
        rateNumber: 5,
        options: [],
        required: false,
        poster: null,
        isPointBased: false,
        hasCorrectAnswer: false,
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

  const handleUploadChange = ({ fileList }: { fileList: any[] }) => {
    const file = fileList[0];
    setFileList(fileList.slice(-1));

    if (file && file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setNewQuestions((prev) =>
          prev.map((item, index) =>
            index === currentPage ? { ...item, poster: base64String } : item
          )
        );
        setCurrentQuestion((prev) => ({
          ...prev!,
          poster: base64String,
        }));
      };
      reader.readAsDataURL(file.originFileObj);
    } else if (!fileList.length) {
      setNewQuestions((prev) =>
        prev.map((item, index) =>
          index === currentPage ? { ...item, poster: null } : item
        )
      );
      setCurrentQuestion((prev) => ({
        ...prev!,
        poster: null,
      }));
    }
  };

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
          ...prev!,
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
        ...prev!,
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
      ...prev!,
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
      ...prev!,
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

  return (
    <div
      id="question_edit"
      className="px-5 py-2 flex-1 justify-between flex flex-col"
    >
      <div className="">
        <div className="rounded-[10px] bg-[#F5F5F5] w-full h-auto flex flex-col justify-between gap-2 mt-5 p-[10px] relative">
          <div className="flex flex-col justify-between gap-2 flex-1">
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
                    required: false,
                    poster: null,
                    isPointBased: false,
                    hasCorrectAnswer: false,
                  });
                }
              }}
              value={currentQuestion?.content || ""}
              className={questionInputClass}
              placeholder="Асуултаа энд бичнэ үү?"
            />
            <div className="flex flex-wrap gap-x-3">
              <div className="flex items-center gap-2 mt-2">
                <Switch
                  checked={currentQuestion?.required || false}
                  onChange={(checked) => {
                    const updatedQuestions = newQuestions.map((item, index) =>
                      index === currentPage
                        ? { ...item, required: checked }
                        : item
                    );
                    setNewQuestions(updatedQuestions);
                    if (currentQuestion) {
                      setCurrentQuestion({
                        ...currentQuestion,
                        required: checked,
                      });
                    }
                  }}
                />
                <p className="text-[13px] text-[#1E1E1E]">Заавал бөглөх</p>
              </div>
              {["MULTI_CHOICE", "SINGLE_CHOICE"].includes(
                currentQuestion?.questionType ?? ""
              ) && (
                <div className="flex items-center gap-2 mt-2">
                  <Switch
                    checked={currentQuestion?.isPointBased || false}
                    disabled={currentQuestion?.hasCorrectAnswer || false}
                    onChange={(checked) => {
                      const updatedQuestions = newQuestions.map(
                        (item, index) =>
                          index === currentPage
                            ? {
                                ...item,
                                isPointBased: checked,
                                hasCorrectAnswer: checked
                                  ? false
                                  : item.hasCorrectAnswer,
                                options: item.options?.map((opt) => ({
                                  ...opt,
                                  points: checked ? 0 : 0,
                                  isCorrect: checked ? false : opt.isCorrect,
                                })),
                              }
                            : item
                      );
                      setNewQuestions(updatedQuestions);
                      if (currentQuestion) {
                        setCurrentQuestion({
                          ...currentQuestion,
                          isPointBased: checked,
                          hasCorrectAnswer: checked
                            ? false
                            : currentQuestion.hasCorrectAnswer,
                          options: currentQuestion.options?.map((opt) => ({
                            ...opt,
                            points: checked ? 0 : 0,
                            isCorrect: checked ? false : opt.isCorrect,
                          })),
                        });
                      }
                    }}
                  />
                  <p className="text-[13px] text-[#1E1E1E]">Оноотой асуулт</p>
                </div>
              )}
              {["MULTI_CHOICE", "SINGLE_CHOICE", "YES_NO"].includes(
                currentQuestion?.questionType ?? ""
              ) && (
                <div className="flex items-center gap-2 mt-2">
                  <Switch
                    checked={currentQuestion?.hasCorrectAnswer || false}
                    disabled={
                      ["MULTI_CHOICE", "SINGLE_CHOICE"].includes(
                        currentQuestion?.questionType ?? ""
                      ) && currentQuestion?.isPointBased
                    }
                    onChange={(checked) => {
                      const updatedQuestions = newQuestions.map(
                        (item, index) =>
                          index === currentPage
                            ? {
                                ...item,
                                hasCorrectAnswer: checked,
                                isPointBased: checked
                                  ? false
                                  : item.isPointBased,
                                options: item.options?.map((opt) => ({
                                  ...opt,
                                  points: checked ? 0 : opt.points,
                                  isCorrect: checked ? opt.isCorrect : false,
                                })),
                              }
                            : item
                      );
                      setNewQuestions(updatedQuestions);
                      if (currentQuestion) {
                        setCurrentQuestion({
                          ...currentQuestion,
                          hasCorrectAnswer: checked,
                          isPointBased: checked
                            ? false
                            : currentQuestion.isPointBased,
                          options: currentQuestion.options?.map((opt) => ({
                            ...opt,
                            points: checked ? 0 : opt.points,
                            isCorrect: checked ? opt.isCorrect : false,
                          })),
                        });
                      }
                    }}
                  />
                  <p className="text-[13px] text-[#1E1E1E]">Зөв хариулттай</p>
                </div>
              )}
            </div>
          </div>
          <Upload
            fileList={fileList}
            onChange={handleUploadChange}
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
            <Button icon={<FileImageOutlined />}></Button>
          </Upload>
        </div>
        {["RATING"].includes(currentQuestion?.questionType ?? "") && (
          <div>
            <div className="rounded-[10px] bg-[#F5F5F5] w-full h-auto flex flex-col gap-2 mt-5 p-[10px]">
              <p className="text-[13px] text-[#1E1E1E] font-semibold leading-[14.6px]">
                Үнэлгээний хамгийн их утга
              </p>
              <InputNumber
                onChange={(value: number | null) => {
                  const newValue = value || 5;

                  const newOptions = Array.from(
                    { length: newValue },
                    (_, index) => ({
                      content: (index + 1).toString(),
                      order: index + 1,
                      poster: null,
                      points: 0,
                      isCorrect: false,
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

                {["MULTI_CHOICE", "SINGLE_CHOICE"].includes(
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

                <div className="flex flex-col gap-y-3 mt-[14px]">
                  {["MULTI_CHOICE", "SINGLE_CHOICE"].includes(
                    currentQuestion?.questionType ?? ""
                  ) &&
                    currentQuestion?.options?.map((item, answerIndex) => {
                      return (
                        <div key={answerIndex} className="w-full">
                          <div className="flex flex-row gap-1">
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
                                          poster?: string | null;
                                          points: number;
                                          isCorrect: boolean;
                                        },
                                        i: number
                                      ) =>
                                        i === answerIndex
                                          ? {
                                              ...option,
                                              content: e.target.value,
                                            }
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
                                      "Total points cannot exceed 100",
                                      "warning",
                                      "",
                                      true
                                    );
                                    return;
                                  }
                                  setCurrentQuestion((prev) => ({
                                    ...prev!,
                                    options: updatedOptions,
                                  }));
                                  setNewQuestions((prev) =>
                                    prev.map((question, questionIndex) =>
                                      questionIndex === currentPage &&
                                      question.options
                                        ? {
                                            ...question,
                                            options: updatedOptions,
                                          }
                                        : question
                                    )
                                  );
                                }}
                                className={`${questionInputClass} w-20 mt-2`}
                                placeholder="Points"
                              />
                            )}
                          </div>
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
                          {
                            content: "",
                            order: newOrder,
                            poster: null,
                            points: 0,
                            isCorrect: false,
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
            </div>
          )}
        {currentQuestion?.questionType === "YES_NO" &&
          currentQuestion?.hasCorrectAnswer && (
            <div className="rounded-[10px] bg-[#F5F5F5] w-full mt-5 p-[10px] h-auto flex flex-col gap-2">
              <p className="text-[13px] text-[#1E1E1E] font-semibold">
                Зөв хариулт
              </p>
              <Radio.Group
                value={currentQuestion?.options?.findIndex(
                  (opt) => opt.isCorrect
                )}
                onChange={(e) => handleSingleCorrectAnswerChange(e.target.value)}
              >
                {currentQuestion?.options?.map((opt, index) => (
                  <Radio key={index} value={index}>
                    {opt.content}
                  </Radio>
                ))}
              </Radio.Group>
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