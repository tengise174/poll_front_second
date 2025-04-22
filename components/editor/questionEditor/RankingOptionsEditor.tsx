import React from "react";
import { Input, Button } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { QuestionProps } from "@/utils/componentTypes";
import AddIcon from "@/public/icons/add";
import CustomButton from "@/components/CustomButton";

interface RankingOptionsEditorProps {
  currentQuestion: QuestionProps;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<QuestionProps>>;
  newQuestions: QuestionProps[];
  setNewQuestions: React.Dispatch<React.SetStateAction<QuestionProps[]>>;
  currentPage: number;
}

const RankingOptionsEditor: React.FC<RankingOptionsEditorProps> = ({
  currentQuestion,
  setCurrentQuestion,
  newQuestions,
  setNewQuestions,
  currentPage,
}) => {
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...(currentQuestion.options ?? [])];
    updatedOptions[index] = {
      ...updatedOptions[index],
      content: value,
    };

    setCurrentQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));

    setNewQuestions((prev) =>
      prev.map((q, i) =>
        i === currentPage ? { ...q, options: updatedOptions } : q
      )
    );
  };

  const handleAddOption = () => {
    const newOption = {
      content: `Option ${(currentQuestion.options?.length ?? 0) + 1}`,
      order: (currentQuestion.options?.length ?? 0) + 1,
      poster: null,
      points: 0,
      isCorrect: false,
      nextQuestionOrder: null,
      rowIndex: null,
      columnIndex: null,
    };

    const updatedOptions = [...(currentQuestion.options ?? []), newOption];

    setCurrentQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));

    setNewQuestions((prev) =>
      prev.map((q, i) =>
        i === currentPage ? { ...q, options: updatedOptions } : q
      )
    );
  };

  const handleDeleteOption = (index: number) => {
    const updatedOptions = (currentQuestion.options ?? [])
      .filter((_, i) => i !== index)
      .map((opt, i) => ({
        ...opt,
        order: i + 1,
      }));

    setCurrentQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));

    setNewQuestions((prev) =>
      prev.map((q, i) =>
        i === currentPage ? { ...q, options: updatedOptions } : q
      )
    );
  };

  return (
    <div className="mt-4">
      <p className="text-[#071522] text-[14px] font-medium">
        Ранкинг сонголтууд
      </p>
      {(currentQuestion.options ?? []).map((option, index) => (
        <div key={index} className="flex items-center gap-2 mt-2">
          <Input
            value={option.content}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Сонголт ${index + 1}`}
            className="flex-1"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteOption(index)}
            disabled={(currentQuestion.options?.length ?? 0) <= 2}
          />
        </div>
      ))}
      <CustomButton
        onClick={handleAddOption}
        className="bg-clicked w-full h-9 rounded-full flex items-center justify-between px-4 mt-[14px] cursor-pointer text-white !text-xs"
        title={
          <div className="flex flex-row items-center justify-center gap-4">
            <p>Сонголт нэмэх</p>
            <AddIcon />
          </div>
        }
      />
    </div>
  );
};

export default RankingOptionsEditor;
