import React from "react";
import { Button, Radio } from "antd";
import CustomInput from "../../CustomInput";
import AddIcon from "@/public/icons/add";
import { useAlert } from "@/context/AlertProvider";
import { QuestionProps } from "@/utils/componentTypes";
import { DeleteOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const questionInputClass =
  "w-full !h-9 bg-[#E6E6E6] !rounded-[10px] !text-[13px] mt-[14px] border-none placeholder:text-[#B3B3B3] placeholder:text-[13px] placeholder:font-normal";

interface GridOptionsEditorProps {
  currentQuestion: QuestionProps;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<QuestionProps>>;
  newQuestions: QuestionProps[];
  setNewQuestions: React.Dispatch<React.SetStateAction<QuestionProps[]>>;
  currentPage: number;
}

const GridOptionsEditor: React.FC<GridOptionsEditorProps> = ({
  currentQuestion,
  setCurrentQuestion,
  newQuestions,
  setNewQuestions,
  currentPage,
}) => {
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  const updateGridOptions = (rows: string[], columns: string[]) => {
    const newOptions: {
      content: string;
      order: number;
      poster: string | null;
      points: number;
      isCorrect: boolean;
      nextQuestionOrder: number | null;
      rowIndex: number;
      columnIndex: number;
    }[] = [];
    let order = 1;
    for (let r = 0; r < rows.length; r++) {
      for (let c = 0; c < columns.length; c++) {
        const existingOption = currentQuestion?.options?.find(
          (opt) => opt.rowIndex === r && opt.columnIndex === c
        );
        newOptions.push({
          content: "",
          order: order++,
          poster: null,
          points: 0,
          isCorrect: existingOption?.isCorrect || false,
          nextQuestionOrder: existingOption?.nextQuestionOrder || null,
          rowIndex: r,
          columnIndex: c,
        });
      }
    }
    setCurrentQuestion((prev) => ({
      ...prev,
      gridRows: rows,
      gridColumns: columns,
      options: newOptions,
    }));
    setNewQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === currentPage
          ? {
              ...question,
              gridRows: rows,
              gridColumns: columns,
              options: newOptions,
            }
          : question
      )
    );
  };

  const handleAddRow = () => {
    const newRows = [...(currentQuestion?.gridRows || []), ``];
    updateGridOptions(newRows, currentQuestion?.gridColumns || []);
  };

  const handleAddColumn = () => {
    const newColumns = [...(currentQuestion?.gridColumns || []), ``];
    updateGridOptions(currentQuestion?.gridRows || [], newColumns);
  };

  const handleRowLabelChange = (index: number, value: string) => {
    const newRows =
      currentQuestion?.gridRows?.map((row, i) => (i === index ? value : row)) ||
      [];
    updateGridOptions(newRows, currentQuestion?.gridColumns || []);
  };

  const handleColumnLabelChange = (index: number, value: string) => {
    const newColumns =
      currentQuestion?.gridColumns?.map((col, i) =>
        i === index ? value : col
      ) || [];
    updateGridOptions(currentQuestion?.gridRows || [], newColumns);
  };

  const handleRemoveRow = (index: number) => {
    if ((currentQuestion?.gridRows?.length ?? 0) <= 1) {
      showAlert("Дор хаяж нэг мөр байх хэрэгтэй", "warning", "", true);
      return;
    }
    const newRows =
      currentQuestion?.gridRows?.filter((_, i) => i !== index) || [];
    updateGridOptions(newRows, currentQuestion?.gridColumns || []);
  };

  const handleRemoveColumn = (index: number) => {
    if ((currentQuestion?.gridColumns?.length ?? 0) <= 1) {
      showAlert("Дор хаяж нэг багана байх хэрэгтэй", "warning", "", true);
      return;
    }
    const newColumns =
      currentQuestion?.gridColumns?.filter((_, i) => i !== index) || [];
    updateGridOptions(currentQuestion?.gridRows || [], newColumns);
  };

  const handleGridCorrectAnswerChange = (
    rowIndex: number,
    optionIndex: number
  ) => {
    const updatedOptions =
      currentQuestion?.options?.map((opt, i) =>
        opt.rowIndex === rowIndex
          ? { ...opt, isCorrect: i === optionIndex }
          : { ...opt, isCorrect: false }
      ) || [];
    setCurrentQuestion((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
    setNewQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === currentPage
          ? { ...question, options: updatedOptions }
          : question
      )
    );
  };

  return (
    <div>
      <div className="rounded-[10px] bg-[#F5F5F5] w-full h-auto flex flex-col gap-2 mt-5 p-[10px]">
        <p className="text-[13px] text-[#1E1E1E] font-semibold leading-[14.6px]">
          {t("edit_q.rows")}
        </p>
        {currentQuestion?.gridRows?.map((row, index) => (
          <div key={index} className="flex flex-row gap-2 items-center">
            <CustomInput
              value={row}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleRowLabelChange(index, e.target.value)
              }
              className={questionInputClass}
              placeholder={`${t("edit_q.row")} ${index + 1}`}
            />
            <DeleteOutlined
              className="cursor-pointer !text-red-400"
              onClick={() => handleRemoveRow(index)}
            />
          </div>
        ))}
        <Button onClick={handleAddRow} className="mt-2" icon={<AddIcon />}>
          {t("edit_q.addRow")}
        </Button>
      </div>
      <div className="rounded-[10px] bg-[#F5F5F5] w-full h-auto flex flex-col gap-2 mt-5 p-[10px]">
        <p className="text-[13px] text-[#1E1E1E] font-semibold leading-[14.6px]">
          {t("edit_q.columns")}
        </p>
        {currentQuestion?.gridColumns?.map((col, index) => (
          <div key={index} className="flex flex-row gap-2 items-center">
            <CustomInput
              value={col}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleColumnLabelChange(index, e.target.value)
              }
              className={questionInputClass}
              placeholder={`${t("edit_q.column")} ${index + 1}`}
            />
            <DeleteOutlined
              className="cursor-pointer !text-red-400"
              onClick={() => handleRemoveColumn(index)}
            />
          </div>
        ))}
        <Button onClick={handleAddColumn} className="mt-2" icon={<AddIcon />}>
          {t("edit_q.addColumn")}
        </Button>
      </div>
      {currentQuestion?.hasCorrectAnswer && (
        <div className="rounded-[10px] bg-[#F5F5F5] w-full h-auto flex flex-col gap-2 mt-5 p-[10px]">
          <p className="text-[13px] text-[#1E1E1E] font-semibold leading-[14.6px]">
            {t("edit_q.correctOption")}
          </p>
          {currentQuestion?.gridRows?.map((row, rowIndex) => (
            <div key={rowIndex} className="mt-2">
              <p className="text-[13px] text-[#1E1E1E]">{row}</p>
              <Radio.Group
                value={currentQuestion?.options?.findIndex(
                  (opt) => opt.rowIndex === rowIndex && opt.isCorrect
                )}
                onChange={(e) =>
                  handleGridCorrectAnswerChange(rowIndex, e.target.value)
                }
              >
                {currentQuestion?.gridColumns?.map((col, colIndex) => {
                  const optionIndex = currentQuestion?.options?.findIndex(
                    (opt) =>
                      opt.rowIndex === rowIndex && opt.columnIndex === colIndex
                  );
                  return (
                    <Radio key={colIndex} value={optionIndex}>
                      {col}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GridOptionsEditor;
