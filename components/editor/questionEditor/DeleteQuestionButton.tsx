import React from "react";
import CustomButton from "../../CustomButton";
import { DeleteQuestionButtonProps } from "@/utils/componentTypes";

const DeleteQuestionButton = ({
  newQuestions,
  setNewQuestions,
  currentPage,
  setCurrentPage,
  setCurrentQuestion,
  setChosenType,
}: DeleteQuestionButtonProps) => {
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
          gridRows: [],
          gridColumns: [],
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
        gridRows: [],
        gridColumns: [],
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
    <CustomButton
      title="Устгах"
      onClick={handleDeleteQuestion}
      className="bg-first-red w-full rounded-xl text-white !h-10 !text-sm hover:cursor-pointer"
    />
  );
};

export default DeleteQuestionButton;