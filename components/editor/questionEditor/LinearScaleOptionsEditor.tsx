"use client";

import React, { useEffect } from "react";
import { Input, InputNumber, Radio } from "antd";
import { QuestionProps } from "@/utils/componentTypes";

interface LinearScaleOptionsEditorProps {
  currentQuestion: QuestionProps;
  setCurrentQuestion: (question: QuestionProps) => void;
  newQuestions: QuestionProps[];
  setNewQuestions: (questions: QuestionProps[]) => void;
  currentPage: number;
}

const LinearScaleOptionsEditor: React.FC<LinearScaleOptionsEditorProps> = ({
  currentQuestion,
  setCurrentQuestion,
  newQuestions,
  setNewQuestions,
  currentPage,
}) => {
  const handleMinValueChange = (value: number | null) => {
    if (value === null) return;
    const newMinValue = value;
    const newMaxValue = Math.max(currentQuestion.maxValue || 5, newMinValue + 1);
    const newOptions = Array.from(
      { length: newMaxValue - newMinValue + 1 },
      (_, i) => ({
        content: (newMinValue + i).toString(),
        order: i + 1,
        poster: null,
        points: 0,
        isCorrect: currentQuestion.options?.[i]?.isCorrect || false,
        nextQuestionOrder: currentQuestion.options?.[i]?.nextQuestionOrder || null,
        rowIndex: null,
        columnIndex: null,
      })
    );

    setCurrentQuestion({
      ...currentQuestion,
      minValue: newMinValue,
      maxValue: newMaxValue,
      options: newOptions,
    });

    setNewQuestions(
      newQuestions.map((q, index) =>
        index === currentPage
          ? {
              ...q,
              minValue: newMinValue,
              maxValue: newMaxValue,
              options: newOptions,
            }
          : q
      )
    );
  };

  const handleMaxValueChange = (value: number | null) => {
    if (value === null) return;
    const newMaxValue = value;
    const newMinValue = Math.min(currentQuestion.minValue || 1, newMaxValue - 1);
    const newOptions = Array.from(
      { length: newMaxValue - newMinValue + 1 },
      (_, i) => ({
        content: (newMinValue + i).toString(),
        order: i + 1,
        poster: null,
        points: 0,
        isCorrect: currentQuestion.options?.[i]?.isCorrect || false,
        nextQuestionOrder: currentQuestion.options?.[i]?.nextQuestionOrder || null,
        rowIndex: null,
        columnIndex: null,
      })
    );

    setCurrentQuestion({
      ...currentQuestion,
      minValue: newMinValue,
      maxValue: newMaxValue,
      options: newOptions,
    });

    setNewQuestions(
      newQuestions.map((q, index) =>
        index === currentPage
          ? {
              ...q,
              minValue: newMinValue,
              maxValue: newMaxValue,
              options: newOptions,
            }
          : q
      )
    );
  };

  const handleMinLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinLabel = e.target.value;
    setCurrentQuestion({
      ...currentQuestion,
      minLabel: newMinLabel,
    });
    setNewQuestions(
      newQuestions.map((q, index) =>
        index === currentPage ? { ...q, minLabel: newMinLabel } : q
      )
    );
  };

  const handleMaxLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxLabel = e.target.value;
    setCurrentQuestion({
      ...currentQuestion,
      maxLabel: newMaxLabel,
    });
    setNewQuestions(
      newQuestions.map((q, index) =>
        index === currentPage ? { ...q, maxLabel: newMaxLabel } : q
      )
    );
  };

  const handleCorrectAnswerChange = (value: number) => {
    const newOptions = currentQuestion.options?.map((opt, index) => ({
      ...opt,
      isCorrect: index === value - (currentQuestion.minValue || 1),
    })) || [];

    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
      hasCorrectAnswer: true,
    });

    setNewQuestions(
      newQuestions.map((q, index) =>
        index === currentPage
          ? { ...q, options: newOptions, hasCorrectAnswer: true }
          : q
      )
    );
  };

  useEffect(() => {
    if (
      currentQuestion.minValue !== undefined &&
      currentQuestion.maxValue !== undefined &&
      currentQuestion.options?.length !==
        currentQuestion.maxValue - currentQuestion.minValue + 1
    ) {
      const newOptions = Array.from(
        { length: (currentQuestion.maxValue || 5) - (currentQuestion.minValue || 1) + 1 },
        (_, i) => ({
          content: ((currentQuestion.minValue || 1) + i).toString(),
          order: i + 1,
          poster: null,
          points: 0,
          isCorrect: currentQuestion.options?.[i]?.isCorrect || false,
          nextQuestionOrder: currentQuestion.options?.[i]?.nextQuestionOrder || null,
          rowIndex: null,
          columnIndex: null,
        })
      );

      setCurrentQuestion({
        ...currentQuestion,
        options: newOptions,
      });

      setNewQuestions(
        newQuestions.map((q, index) =>
          index === currentPage ? { ...q, options: newOptions } : q
        )
      );
    }
  }, [currentQuestion.minValue, currentQuestion.maxValue]);

  return (
    <div className="mt-4">
      <div className="mb-4">
        <p className="text-[14px] font-medium mb-2">Minimum Value</p>
        <InputNumber
          min={0}
          max={1}
          value={currentQuestion.minValue}
          onChange={handleMinValueChange}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <p className="text-[14px] font-medium mb-2">Maximum Value</p>
        <InputNumber
          min={2}
          max={10}
          value={currentQuestion.maxValue}
          onChange={handleMaxValueChange}
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <p className="text-[14px] font-medium mb-2">Minimum Label</p>
        <Input
          value={currentQuestion.minLabel}
          onChange={handleMinLabelChange}
          placeholder="e.g., Low"
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <p className="text-[14px] font-medium mb-2">Maximum Label</p>
        <Input
          value={currentQuestion.maxLabel}
          onChange={handleMaxLabelChange}
          placeholder="e.g., High"
          className="w-full"
        />
      </div>
      {currentQuestion.hasCorrectAnswer && (
        <div className="mb-4">
          <p className="text-[14px] font-medium mb-2">Correct Answer</p>
          <Radio.Group
            value={
              currentQuestion.options?.find((opt) => opt.isCorrect)?.content ||
              currentQuestion.minValue
            }
            onChange={(e) => handleCorrectAnswerChange(e.target.value)}
          >
            {currentQuestion.options?.map((opt) => (
              <Radio key={opt.order} value={opt.content}>
                {opt.content}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      )}
    </div>
  );
};

export default LinearScaleOptionsEditor;