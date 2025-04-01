import React from "react";
import RateSection from "../RatingSection";
import { questionTypes } from "@/utils/utils";
import { QuestionDisplayProps } from "@/utils/componentTypes";
import CloseCircleIcon from "@/public/icons/close_circle";
import AddIcon from "@/public/icons/add";

const QuestionDisplay = ({
  chosenType,
  setChosenType,
  dualColors,
  themeId,
  currentPage,
  setCurrentPage,
  currentQuestion,
  setCurrentQuestion,
  newQuestions,
  setNewQuestions,
}: QuestionDisplayProps) => {
  return (
    <div className="w-full flex justify-center h-full items-center">
      {chosenType ? (
        <div className="w-full flex flex-col h-full justify-between">
          <div
            id="question_prev"
            style={{
              color: dualColors[themeId][1],
              backgroundColor: dualColors[themeId][0],
            }}
            className={` rounded-[10px] w-full flex flex-col items-center p-5`}
          >
            <div className="flex flex-col max-w-[430px] w-full">
              <p
                style={{ color: dualColors[themeId][1] }}
                className="text-[14px] leading-[17px] font-semibold cursor-pointer"
              >
                {currentPage + 1}. {currentQuestion?.content}
              </p>
              <div className="flex flex-col gap-y-[18px] mt-[18px]">
                {["MULTI_CHOICE", "SINGLE_CHOICE"].includes(
                  currentQuestion?.questionType ?? ""
                ) &&
                  currentQuestion?.options?.map((item, index) => {
                    return (
                      <div className="flex items-center" key={index}>
                        <div className="w-full h-11 border border-[#D9D9D9] rounded-[10px] italic text-[16px] px-5 flex items-center">
                          <span className="mr-1.5 not-italic">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {item.content || "Answer"}
                        </div>
                        {currentQuestion?.options &&
                          currentQuestion?.options?.length > 2 && (
                            <CloseCircleIcon
                              onClick={() => {
                                setCurrentQuestion((prev: any) => ({
                                  ...prev,
                                  options: prev.options.filter(
                                    (_: any, i: number) => i !== index
                                  ),
                                }));
                                setNewQuestions((prev) =>
                                  prev.map((question, questionIndex) =>
                                    questionIndex === currentPage &&
                                    question.options
                                      ? {
                                          ...question,
                                          options: question.options.filter(
                                            (_, i) => i !== index
                                          ),
                                        }
                                      : question
                                  )
                                );
                              }}
                              style={{
                                color: dualColors[themeId][1],
                              }}
                              className="ml-[10px] cursor-pointer"
                            />
                          )}
                      </div>
                    );
                  })}
              </div>
              {currentQuestion?.questionType === "YES_NO" && (
                <div className="flex flex-col gap-y-[18px]">
                  <div className="w-full h-11 border border-[#D9D9D9] rounded-[10px] italic text-[16px] px-5 flex items-center">
                    Тийм
                  </div>
                  <div className="w-full h-11 border border-[#D9D9D9] rounded-[10px] italic text-[16px] px-5 flex items-center">
                    Үгүй
                  </div>
                </div>
              )}
              {currentQuestion?.questionType === "TEXT" && (
                <div className="w-full h-[200px] border border-[#D9D9D9] rounded-[10px] italic text-[14px] px-5">
                  Хариултаа бичнэ үү
                </div>
              )}
              {currentQuestion?.questionType === "RATING" && (
                <RateSection
                  rateType={currentQuestion.rateType ?? "NUMBER"}
                  rateNumber={currentQuestion.rateNumber ?? 5}
                />
              )}
            </div>
          </div>
          <div
            id="pagination"
            className="flex justify-center items-center mt-4 gap-x-[10px]"
          >
            {newQuestions.map((data, index) => {
              return (
                <p
                  className={`h-10 w-10 text-[#757575] flex items-center justify-center select-none rounded-[10px] text-[16px] cursor-pointer font-semibold ${
                    index === currentPage && "bg-[#E6E6E6] text-black"
                  }`}
                  onClick={() => setCurrentPage(index)}
                  key={index}
                >
                  {index + 1}
                </p>
              );
            })}
          </div>
        </div>
      ) : (
        <div id="choice_question" className="max-w-[340px] w-full">
          <p className="text-[14px] leading-[14px] font-medium text-[#757575] italic mb-5">
            Асуултын төрөлөө сонгоно уу.
          </p>
          <div className="flex flex-col gap-y-[10px]">
            {questionTypes.map((item, index) => {
              return (
                <div
                  onClick={() => {
                    const lastIndex =
                      newQuestions.length === 1 &&
                      newQuestions[currentPage].content === ""
                        ? 0
                        : newQuestions.length - 1;
                    setCurrentPage((prevPage) => {
                      if (
                        newQuestions.length === 1 &&
                        newQuestions[lastIndex].content === ""
                      ) {
                        return prevPage;
                      } else {
                        return newQuestions.length;
                      }
                    });
                    setNewQuestions((prev) => {
                      const shouldAddAnswers =
                        item.questionType === "SINGLE_CHOICE" ||
                        item.questionType === "MULTI_CHOICE";

                      const emptyTitleIndex = prev.findIndex(
                        (question) => question.content === ""
                      );

                      if (emptyTitleIndex !== -1) {
                        return prev.map((question, index) =>
                          index === emptyTitleIndex
                            ? {
                                ...question,
                                questionType: item.questionType,

                                ...(shouldAddAnswers && {
                                  options: [
                                    { content: "", order: 1 },
                                    { content: "", order: 2 },
                                  ],
                                }),
                                ...(item.questionType === "RATING" && {
                                  rateNumber: 5,
                                  rateType: "STAR",
                                }),
                                order: lastIndex + 1,
                              }
                            : question
                        );
                      }

                      return [
                        ...prev,
                        {
                          content: "",
                          questionType: item.questionType,
                          ...(shouldAddAnswers
                            ? {
                                options: [
                                  { content: "", order: 1 },
                                  { content: "", order: 2 },
                                ],
                              }
                            : { options: [] }),
                            ...(item.questionType === "RATING" && {
                              rateNumber: 5,
                              rateType: "STAR", 
                            }), 
                          order: lastIndex + 2,
                        },
                      ];
                    });
                    setChosenType(item.questionType);
                  }}
                  key={index}
                  className="w-full group relative h-12 rounded-[10px] bg-[#FDFDFD] bor der border-[#D9D9D9] shadow-custom-100 flex items-center cursor-pointer px-2"
                >
                  {item.icon}
                  <p className="text-[#071522] text-[13px] font-medium ml-[5px]">
                    {item.title}
                  </p>
                  <div className="w-full h-full absolute hidden group-hover:flex items-center justify-center top-0 bg-black left-0 rounded-[10px]">
                    <AddIcon className="text-[#FDFDFD]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
