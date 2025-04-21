import React from "react";
import { InputNumber, Radio } from "antd";
import RateStarIcon from "@/public/icons/rate_star";
import { QuestionProps } from "@/utils/componentTypes";

const questionInputClass =
  "w-full !h-9 bg-[#E6E6E6] !rounded-[10px] !text-[13px] mt-[14px] border-none placeholder:text-[#B3B3B3] placeholder:text-[13px] placeholder:font-normal";

interface RatingOptionsEditorProps {
  currentQuestion: QuestionProps;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<QuestionProps>>;
  newQuestions: QuestionProps[];
  setNewQuestions: React.Dispatch<React.SetStateAction<QuestionProps[]>>;
  currentPage: number;
}

const RatingOptionsEditor: React.FC<RatingOptionsEditorProps> = ({
  currentQuestion,
  setCurrentQuestion,
  newQuestions,
  setNewQuestions,
  currentPage,
}) => {
  return (
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
                nextQuestionOrder: null,
                rowIndex: null,
                columnIndex: null,
              })
            );
            setNewQuestions((prev) =>
              prev.map((item, index) =>
                index === currentPage
                  ? { ...item, rateNumber: newValue, options: newOptions }
                  : item
              )
            );
            setCurrentQuestion({
              ...currentQuestion,
              rateNumber: newValue,
              options: newOptions,
            });
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
            setCurrentQuestion({
              ...currentQuestion,
              rateType: e.target.value,
            });
          }}
        >
          <div className="flex flex-col gap-2 w-full">
            <Radio value={"STAR"}>
              <div className="flex flex-row items-center justify-between">
                <p>Одтой үнэлгээ</p>
                <div className="flex flex-row gap-2">
                  <RateStarIcon className="text-yellow-400" />
                  <RateStarIcon className="text-yellow-400" />
                  <RateStarIcon className="text-yellow-400" />
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
  );
};

export default RatingOptionsEditor;