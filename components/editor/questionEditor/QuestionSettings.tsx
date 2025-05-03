import React from "react";
import { Switch } from "antd";
import { QuestionProps } from "@/utils/componentTypes";
import { useTranslation } from "react-i18next";

interface QuestionSettingsProps {
  currentQuestion: QuestionProps;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<QuestionProps>>;
  newQuestions: QuestionProps[];
  setNewQuestions: React.Dispatch<React.SetStateAction<QuestionProps[]>>;
  currentPage: number;
}

const QuestionSettings = ({
  currentQuestion,
  setCurrentQuestion,
  newQuestions,
  setNewQuestions,
  currentPage,
}: QuestionSettingsProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-x-3 mt-2">
      <div className="flex items-center gap-2">
        <Switch
          checked={currentQuestion?.required || false}
          onChange={(checked) => {
            const updatedQuestions = newQuestions.map((item, index) =>
              index === currentPage ? { ...item, required: checked } : item
            );
            setNewQuestions(updatedQuestions);
            setCurrentQuestion({
              ...currentQuestion,
              required: checked,
            });
          }}
        />
        <p className="text-[13px] text-[#1E1E1E]">{t("edit_q.mandatory")}</p>
      </div>
      {["MULTI_CHOICE", "SINGLE_CHOICE", "DROPDOWN"].includes(
        currentQuestion?.questionType ?? ""
      ) && (
        <div className="flex items-center gap-2">
          <Switch
            checked={currentQuestion?.isPointBased || false}
            disabled={currentQuestion?.hasCorrectAnswer || false}
            onChange={(checked) => {
              const updatedQuestions = newQuestions.map((item, index) =>
                index === currentPage
                  ? {
                      ...item,
                      isPointBased: checked,
                      hasCorrectAnswer: checked ? false : item.hasCorrectAnswer,
                      options: item.options?.map((opt) => ({
                        ...opt,
                        points: checked ? 0 : 0,
                        isCorrect: checked ? false : opt.isCorrect,
                      })),
                    }
                  : item
              );
              setNewQuestions(updatedQuestions);
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
            }}
          />
          <p className="text-[13px] text-[#1E1E1E]">{t("edit_q.hasPoint")}</p>
        </div>
      )}
      {[
        "MULTI_CHOICE",
        "SINGLE_CHOICE",
        "YES_NO",
        "DROPDOWN",
        "MULTIPLE_CHOICE_GRID",
        "LINEAR_SCALE",
      ].includes(currentQuestion?.questionType ?? "") && (
        <div className="flex items-center gap-2">
          <Switch
            checked={currentQuestion?.hasCorrectAnswer || false}
            disabled={
              ["MULTI_CHOICE", "SINGLE_CHOICE", "DROPDOWN"].includes(
                currentQuestion?.questionType ?? ""
              ) && currentQuestion?.isPointBased
            }
            onChange={(checked) => {
              const updatedQuestions = newQuestions.map((item, index) =>
                index === currentPage
                  ? {
                      ...item,
                      hasCorrectAnswer: checked,
                      isPointBased: checked ? false : item.isPointBased,
                      options: item.options?.map((opt) => ({
                        ...opt,
                        points: checked ? 0 : opt.points,
                        isCorrect: checked ? opt.isCorrect : false,
                      })),
                    }
                  : item
              );
              setNewQuestions(updatedQuestions);
              setCurrentQuestion({
                ...currentQuestion,
                hasCorrectAnswer: checked,
                isPointBased: checked ? false : currentQuestion.isPointBased,
                options: currentQuestion.options?.map((opt) => ({
                  ...opt,
                  points: checked ? 0 : opt.points,
                  isCorrect: checked ? opt.isCorrect : false,
                })),
              });
            }}
          />
          <p className="text-[13px] text-[#1E1E1E]">{t("edit_q.hasCorrect")}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionSettings;
