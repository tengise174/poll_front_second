"use client";

import React from "react";
import QuestionTitleEditor from "./QuestionTitleEditor";
import QuestionSettings from "./QuestionSettings";
import RatingOptionsEditor from "./RatingOptionsEditor";
import GridOptionsEditor from "./GridOptionsEditor";
import TickBoxGridOptionsEditor from "./TickBoxGridOptionsEditor";
import LinearScaleOptionsEditor from "./LinearScaleOptionsEditor";
import AnswerOptionsEditor from "./AnswerOptionsEditor";
import RankingOptionsEditor from "./RankingOptionsEditor";
import DeleteQuestionButton from "./DeleteQuestionButton";
import { QuestionTextEditorProps } from "@/utils/componentTypes";
import { CalendarOutlined } from "@ant-design/icons";
import { ClockCircleFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const QuestionTextEditor: React.FC<QuestionTextEditorProps> = ({
  id,
  setChosenType,
  setCurrentPage,
  newQuestions,
  setNewQuestions,
  currentPage,
  currentQuestion,
  setCurrentQuestion,
}) => {
  const { t } = useTranslation();
  return (
    <div
      id="question_edit"
      className="px-5 h-full justify-between flex flex-col gap-2 text-black"
    >
      <div>
        <QuestionTitleEditor
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          newQuestions={newQuestions}
          setNewQuestions={setNewQuestions}
          currentPage={currentPage}
        />
        <QuestionSettings
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          newQuestions={newQuestions}
          setNewQuestions={setNewQuestions}
          currentPage={currentPage}
        />
        {currentQuestion?.questionType === "RATING" && (
          <RatingOptionsEditor
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            newQuestions={newQuestions}
            setNewQuestions={setNewQuestions}
            currentPage={currentPage}
          />
        )}
        {currentQuestion?.questionType === "MULTIPLE_CHOICE_GRID" && (
          <GridOptionsEditor
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            newQuestions={newQuestions}
            setNewQuestions={setNewQuestions}
            currentPage={currentPage}
          />
        )}
        {currentQuestion?.questionType === "TICK_BOX_GRID" && (
          <TickBoxGridOptionsEditor
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            newQuestions={newQuestions}
            setNewQuestions={setNewQuestions}
            currentPage={currentPage}
          />
        )}
        {currentQuestion?.questionType === "LINEAR_SCALE" && (
          <LinearScaleOptionsEditor
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            newQuestions={newQuestions}
            setNewQuestions={setNewQuestions}
            currentPage={currentPage}
          />
        )}
        {currentQuestion?.questionType === "RANKING" && (
          <RankingOptionsEditor
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            newQuestions={newQuestions}
            setNewQuestions={setNewQuestions}
            currentPage={currentPage}
          />
        )}
        {["MULTI_CHOICE", "SINGLE_CHOICE", "DROPDOWN", "YES_NO"].includes(
          currentQuestion?.questionType ?? ""
        ) && (
          <AnswerOptionsEditor
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            newQuestions={newQuestions}
            setNewQuestions={setNewQuestions}
            currentPage={currentPage}
          />
        )}
        {currentQuestion?.questionType === "DATE" && (
          <div className="mt-4 flex items-center gap-4">
            <CalendarOutlined className="text-xl" />
            <p className="text-xs">{t("edit_q.dateQuestion")}</p>
          </div>
        )}
        {currentQuestion?.questionType === "TIME" && (
          <div className="mt-4 flex items-center gap-4">
            <ClockCircleFilled className="text-xl" />
            <p className="text-xs">{t("edit_q.timeQuestion")}</p>
          </div>
        )}
      </div>
      <DeleteQuestionButton
        newQuestions={newQuestions}
        setNewQuestions={setNewQuestions}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setCurrentQuestion={setCurrentQuestion}
        setChosenType={setChosenType}
      />
    </div>
  );
};

export default QuestionTextEditor;
