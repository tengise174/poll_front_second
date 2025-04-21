"use client";

import React from "react";
import QuestionTitleEditor from "./QuestionTitleEditor";
import QuestionSettings from "./QuestionSettings";
import RatingOptionsEditor from "./RatingOptionsEditor";
import GridOptionsEditor from "./GridOptionsEditor";
import TickBoxGridOptionsEditor from "./TickBoxGridOptionsEditor";
import LinearScaleOptionsEditor from "./LinearScaleOptionsEditor";
import AnswerOptionsEditor from "./AnswerOptionsEditor";
import DeleteQuestionButton from "./DeleteQuestionButton";
import { QuestionTextEditorProps } from "@/utils/componentTypes";

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
  return (
    <div
      id="question_edit"
      className="px-5 py-2 flex-1 justify-between flex flex-col"
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
