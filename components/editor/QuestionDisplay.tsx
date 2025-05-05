"use client";

import React, { useState } from "react";
import {
  Card,
  Switch,
  Image,
  Select,
  Table,
  Checkbox,
  Radio,
  DatePicker,
  TimePicker,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import RateSection from "../RatingSection";
import { QuestionDisplayProps } from "@/utils/componentTypes";
import CloseCircleIcon from "@/public/icons/close_circle";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [isCardView, setIsCardView] = useState(true);

  const handleCardClick = (question: any, index: number) => {
    setCurrentPage(index);
    setCurrentQuestion(question);
    setChosenType(question.questionType);
  };

  const handleDeleteOption = (index: number, questionIndex: number) => {
    const updatedOptions =
      currentQuestion.options?.filter((_, i) => i !== index) || [];
    setCurrentQuestion((prev) => ({
      ...prev!,
      options: updatedOptions.map((opt, i) => ({
        ...opt,
        order: i + 1,
      })),
    }));
    setNewQuestions((prev) =>
      prev.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              options: updatedOptions.map((opt, i) => ({
                ...opt,
                order: i + 1,
              })),
            }
          : question
      )
    );
  };

  const gridColumns = (question: any) => [
    {
      title: "",
      dataIndex: "row",
      key: "row",
      render: (text: string) => (
        <span className="text-[14px] font-medium">{text}</span>
      ),
    },
    ...(question.gridColumns?.map((col: string, index: number) => ({
      title: col,
      dataIndex: `col_${index}`,
      key: `col_${index}`,
      align: "center" as const,
      render: (_: any, record: any) => {
        const option = question.options?.find(
          (opt: any) =>
            opt.rowIndex === record.rowIndex && opt.columnIndex === index
        );
        return (
          <div className="flex justify-center items-center">
            {question.questionType === "MULTIPLE_CHOICE_GRID" ? (
              <Radio disabled />
            ) : (
              <Checkbox disabled checked={option?.isCorrect} />
            )}
            {option?.isCorrect && (
              <CheckCircleOutlined
                style={{ color: "#52c41a", marginLeft: 8 }}
              />
            )}
          </div>
        );
      },
    })) || []),
  ];

  const gridData = (question: any) =>
    question.gridRows?.map((row: string, index: number) => ({
      key: index,
      row,
      rowIndex: index,
    })) || [];

  return (
    <div className="w-full flex flex-col h-full">
      <div className="mb-4">
        <Switch
          checked={isCardView}
          onChange={(checked) => setIsCardView(checked)}
          checkedChildren={t("edit_q.all")}
          unCheckedChildren={t("edit_q.single")}
        />
      </div>
      {isCardView ? (
        <div className="w-full overflow-y-auto max-h-[calc(100vh-120px)]">
          <div className="flex flex-col gap-4 mx-auto px-[5%] py-5">
            {newQuestions.length > 0 ? (
              newQuestions.map((question, index) => (
                <Card
                  key={index}
                  hoverable
                  onClick={() => handleCardClick(question, index)}
                  style={{
                    backgroundColor: dualColors[themeId][0],
                    color: dualColors[themeId][1],
                    borderRadius: "10px",
                  }}
                  styles={{ body: { padding: "16px" } }}
                >
                  <div className="flex flex-col">
                    <p
                      style={{ color: dualColors[themeId][1] }}
                      className="text-[14px] leading-[17px] font-semibold"
                    >
                      {index + 1}.{" "}
                      {question.content || `${t("edit_q.question")}`}
                      {question.isPointBased && (
                        <span className="ml-2 text-[12px] italic">
                          ({t("edit_q.hasPoint")})
                        </span>
                      )}
                      {question.hasCorrectAnswer && (
                        <span className="ml-2 text-[12px] italic">
                          ({t("edit_q.hasCorrect")})
                        </span>
                      )}
                      {question.required && (
                        <span className="ml-2 text-[16px] italic text-red-600">
                          *
                        </span>
                      )}
                    </p>
                    {question.poster && (
                      <Image
                        src={question.poster}
                        height={100}
                        style={{ width: "auto", marginTop: "10px" }}
                        preview={false}
                      />
                    )}
                    <div className="flex flex-col gap-y-[18px] mt-[18px]">
                      {["MULTI_CHOICE", "SINGLE_CHOICE", "RANKING"].includes(
                        question.questionType ?? ""
                      ) &&
                        question.options?.map((item, optIndex) => (
                          <div
                            className="flex flex-row gap-2 w-full"
                            key={optIndex}
                          >
                            <div className="flex flex-1 items-center">
                              <div className="w-full h-11 border border-[#D9D9D9] rounded-[10px] italic text-[16px] px-5 flex items-center">
                                <span className="mr-1.5 not-italic">
                                  {question.questionType === "RANKING"
                                    ? `${optIndex + 1}.`
                                    : String.fromCharCode(65 + optIndex) + "."}
                                </span>
                                {item.content || `${t("edit_q.Option")}`}
                                {question.isPointBased && (
                                  <span className="ml-2 text-[12px]">
                                    ({item.points} pts)
                                  </span>
                                )}
                                {item.isCorrect && (
                                  <CheckCircleOutlined
                                    className="ml-2"
                                    style={{ color: "#52c41a" }}
                                  />
                                )}
                                {item.nextQuestionOrder != null && (
                                  <span className="ml-2 text-[12px]">
                                    (Next: Q{item.nextQuestionOrder})
                                  </span>
                                )}
                              </div>
                              {question.options &&
                                question.options.length > 2 && (
                                  <CloseCircleIcon
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteOption(optIndex, index);
                                    }}
                                    style={{ color: dualColors[themeId][1] }}
                                    className="ml-[10px] cursor-pointer"
                                  />
                                )}
                            </div>
                            {item.poster && (
                              <Image
                                src={item.poster}
                                height={60}
                                style={{
                                  width: "auto",
                                  borderRadius: "8px",
                                }}
                                preview={false}
                              />
                            )}
                          </div>
                        ))}
                      {question.questionType === "DROPDOWN" && (
                        <Select
                          placeholder={t("edit_q.chooseOption")}
                          style={{ width: "100%", height: 44 }}
                        >
                          {question.options?.map((item, optIndex) => (
                            <Select.Option key={optIndex} value={optIndex}>
                              <div className="flex items-center justify-between">
                                <span>
                                  {item.content || `${t("edit_q.Option")}`}
                                  {question.isPointBased &&
                                    ` (${item.points} pts)`}
                                  {item.isCorrect && (
                                    <CheckCircleOutlined
                                      style={{
                                        color: "#52c41a",
                                        marginLeft: 8,
                                      }}
                                    />
                                  )}
                                  {item.nextQuestionOrder != null &&
                                    ` ${t("edit_q.nextQ")} ${
                                      item.nextQuestionOrder
                                    })`}
                                </span>
                                {question.options &&
                                  question.options.length > 2 && (
                                    <CloseCircleIcon
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteOption(optIndex, index);
                                      }}
                                      style={{ color: dualColors[themeId][1] }}
                                      className="cursor-pointer"
                                    />
                                  )}
                              </div>
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                      {question.questionType === "YES_NO" &&
                        question.options?.map((item, optIndex) => (
                          <div
                            className="flex flex-row gap-2 w-full"
                            key={optIndex}
                          >
                            <div className="flex flex-1 items-center">
                              <div className="w-full h-11 border border-[#D9D9D9] rounded-[10px] italic text-[16px] px-5 flex items-center">
                                {item.content}
                                {item.isCorrect && (
                                  <CheckCircleOutlined
                                    className="ml-2"
                                    style={{ color: "#52c41a" }}
                                  />
                                )}
                                {item.nextQuestionOrder != null && (
                                  <span className="ml-2 text-[12px]">
                                    ({t("edit_q.nextQ")}{" "}
                                    {item.nextQuestionOrder})
                                  </span>
                                )}
                              </div>
                            </div>
                            {item.poster && (
                              <Image
                                src={item.poster}
                                height={60}
                                style={{
                                  width: "auto",
                                  borderRadius: "8px",
                                }}
                                preview={false}
                              />
                            )}
                          </div>
                        ))}
                      {question.questionType === "TEXT" && (
                        <div className="w-full h-[100px] border border-[#D9D9D9] rounded-[10px] italic text-[14px] px-5 flex items-center">
                          {t("edit_q.enterAnswer")}
                        </div>
                      )}
                      {question.questionType === "DATE" && (
                        <DatePicker
                          style={{ width: "100%", height: 44 }}
                          placeholder={t("edit_q.chooseDate")}
                          disabled
                        />
                      )}
                      {question.questionType === "TIME" && (
                        <TimePicker
                          style={{ width: "100%", height: 44 }}
                          placeholder={t("edit_q.chooseTime")}
                          disabled
                        />
                      )}
                      {question.questionType === "RATING" && (
                        <RateSection
                          rateType={question.rateType ?? "NUMBER"}
                          rateNumber={question.rateNumber ?? 5}
                        />
                      )}
                      {question.questionType === "LINEAR_SCALE" && (
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between">
                            <span className="text-[14px]">
                              {question.minLabel || `${t("edit_q.minValue")}`}
                            </span>
                            <Radio.Group
                              disabled
                              className="flex justify-between"
                            >
                              {question.options?.map((item) => (
                                <Radio
                                  key={item.order}
                                  value={item.content}
                                  className="flex flex-col gap-2"
                                >
                                  {item.content}
                                  {item.isCorrect && (
                                    <CheckCircleOutlined
                                      style={{
                                        color: "#52c41a",
                                        marginLeft: 12,
                                      }}
                                    />
                                  )}
                                </Radio>
                              ))}
                            </Radio.Group>
                            <span className="text-[14px]">
                              {question.maxLabel || `${t("edit_q.maxValue")}`}
                            </span>
                          </div>
                        </div>
                      )}
                      {["MULTIPLE_CHOICE_GRID", "TICK_BOX_GRID"].includes(
                        question.questionType ?? ""
                      ) && (
                        <Table
                          columns={gridColumns(question)}
                          dataSource={gridData(question)}
                          pagination={false}
                          bordered
                          style={{ marginTop: "10px" }}
                        />
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-[14px] text-[#757575] italic">Асуулт алга.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col h-full justify-between">
          {chosenType ? (
            <div
              id="question_prev"
              style={{
                color: dualColors[themeId][1],
                backgroundColor: dualColors[themeId][0],
              }}
              className="rounded-[10px] w-full flex flex-col items-center p-5"
            >
              <div className="flex flex-col max-w-[430px] w-full">
                <p
                  style={{ color: dualColors[themeId][1] }}
                  className="text-[14px] leading-[17px] font-semibold cursor-pointer"
                >
                  {currentPage + 1}.{" "}
                  {currentQuestion?.content || `${t("edit_q.question")}`}
                  {currentQuestion?.isPointBased && (
                    <span className="ml-2 text-[12px] italic">
                      ({t("edit_q.hasPoint")})
                    </span>
                  )}
                  {currentQuestion?.hasCorrectAnswer && (
                    <span className="ml-2 text-[12px] italic">
                      ({t("edit_q.hasCorrect")})
                    </span>
                  )}
                  {currentQuestion.required && (
                    <span className="ml-2 text-[12px] italic text-red-600">
                      *
                    </span>
                  )}
                </p>
                {currentQuestion?.poster && (
                  <Image
                    src={currentQuestion.poster}
                    height={100}
                    style={{ width: "auto", marginTop: "10px" }}
                    preview={false}
                  />
                )}
                <div className="flex flex-col gap-y-[18px] mt-[18px]">
                  {["MULTI_CHOICE", "SINGLE_CHOICE", "RANKING"].includes(
                    currentQuestion?.questionType ?? ""
                  ) &&
                    currentQuestion?.options?.map((item, index) => (
                      <div className="flex flex-row gap-2 w-full" key={index}>
                        <div className="flex items-center flex-1">
                          <div className="w-full h-11 border border-[#D9D9D9] rounded-[10px] italic text-[16px] px-5 flex items-center">
                            <span className="mr-1.5 not-italic">
                              {currentQuestion?.questionType === "RANKING"
                                ? `${index + 1}.`
                                : String.fromCharCode(65 + index) + "."}
                            </span>
                            {item.content || `${t("edit_q.Option")}`}
                            {currentQuestion?.isPointBased && (
                              <span className="ml-2 text-[12px]">
                                ({item.points} pts)
                              </span>
                            )}
                            {item.isCorrect && (
                              <CheckCircleOutlined
                                className="ml-2"
                                style={{ color: "#52c41a" }}
                              />
                            )}
                            {item.nextQuestionOrder != null && (
                              <span className="ml-2 text-[12px]">
                                ({t("edit_q.nextQ")} {item.nextQuestionOrder})
                              </span>
                            )}
                          </div>
                          {currentQuestion?.options &&
                            currentQuestion.options.length > 2 && (
                              <CloseCircleIcon
                                onClick={() =>
                                  handleDeleteOption(index, currentPage)
                                }
                                style={{ color: dualColors[themeId][1] }}
                                className="ml-[10px] cursor-pointer"
                              />
                            )}
                        </div>
                        {item.poster && (
                          <Image
                            src={item.poster}
                            height={80}
                            style={{
                              width: "auto",
                              borderRadius: "8px",
                            }}
                            preview={false}
                          />
                        )}
                      </div>
                    ))}
                  {currentQuestion?.questionType === "DROPDOWN" && (
                    <Select
                      placeholder={t("edit_q.chooseOption")}
                      style={{ width: "100%", height: 44 }}
                    >
                      {currentQuestion?.options?.map((item, index) => (
                        <Select.Option key={index} value={index}>
                          <div className="flex items-center justify-between">
                            <span>
                              {item.content || `${t("edit_q.Option")}`}
                              {currentQuestion.isPointBased &&
                                ` (${item.points} pts)`}
                              {item.isCorrect && (
                                <CheckCircleOutlined
                                  style={{ color: "#52c41a", marginLeft: 8 }}
                                />
                              )}
                              {item.nextQuestionOrder != null &&
                                ` (${t("edit_q.nextQ")} ${
                                  item.nextQuestionOrder
                                })`}
                            </span>
                            {currentQuestion?.options &&
                              currentQuestion.options.length > 2 && (
                                <CloseCircleIcon
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteOption(index, currentPage);
                                  }}
                                  style={{ color: dualColors[themeId][1] }}
                                  className="cursor-pointer"
                                />
                              )}
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                  {currentQuestion?.questionType === "YES_NO" &&
                    currentQuestion?.options?.map((item, index) => (
                      <div className="flex flex-row gap-2 w-full" key={index}>
                        <div className="flex items-center flex-1">
                          <div className="w-full h-11 border border-[#D9D9D9] rounded-[10px] italic text-[16px] px-5 flex items-center">
                            {item.content}
                            {item.isCorrect && (
                              <CheckCircleOutlined
                                className="ml-2"
                                style={{ color: "#52c41a" }}
                              />
                            )}
                            {item.nextQuestionOrder != null && (
                              <span className="ml-2 text-[12px]">
                                ({t("edit_q.nextQ")} {item.nextQuestionOrder})
                              </span>
                            )}
                          </div>
                        </div>
                        {item.poster && (
                          <Image
                            src={item.poster}
                            height={80}
                            style={{
                              width: "auto",
                              borderRadius: "8px",
                            }}
                            preview={false}
                          />
                        )}
                      </div>
                    ))}
                  {currentQuestion?.questionType === "TEXT" && (
                    <div className="w-full h-[200px] border border-[#D9D9D9] rounded-[10px] italic text-[14px] px-5">
                      {t("edit_q.enterAnswer")}
                    </div>
                  )}
                  {currentQuestion?.questionType === "DATE" && (
                    <DatePicker
                      style={{ width: "100%", height: 44 }}
                      placeholder={t("edit_q.chooseDate")}
                      disabled
                    />
                  )}
                  {currentQuestion?.questionType === "TIME" && (
                    <TimePicker
                      style={{ width: "100%", height: 44 }}
                      placeholder={t("edit_q.chooseTime")}
                      disabled
                    />
                  )}
                  {currentQuestion?.questionType === "RATING" && (
                    <RateSection
                      rateType={currentQuestion.rateType ?? "NUMBER"}
                      rateNumber={currentQuestion.rateNumber ?? 5}
                    />
                  )}
                  {currentQuestion?.questionType === "LINEAR_SCALE" && (
                    <div className="flex flex-row w-full justify-between">
                      <span className="text-[14px]">
                        {currentQuestion.minLabel || `${t("edit_q.minLabel")}`}
                      </span>
                      <Radio.Group disabled className="flex justify-between">
                        {currentQuestion.options?.map((item) => (
                          <Radio key={item.order} value={item.content}>
                            {item.content}
                            {item.isCorrect && (
                              <CheckCircleOutlined
                                style={{ color: "#52c41a", marginLeft: 8 }}
                              />
                            )}
                          </Radio>
                        ))}
                      </Radio.Group>
                      <span className="text-[14px]">
                        {currentQuestion.maxLabel || `${t("edit_q.maxLabel")}`}
                      </span>
                    </div>
                  )}
                  {["MULTIPLE_CHOICE_GRID", "TICK_BOX_GRID"].includes(
                    currentQuestion?.questionType ?? ""
                  ) && (
                    <Table
                      columns={gridColumns(currentQuestion)}
                      dataSource={gridData(currentQuestion)}
                      pagination={false}
                      bordered
                      style={{ marginTop: "10px" }}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-[340px] w-full">
              <p className="text-[14px] leading-[14px] font-medium text-[#757575] italic mb-5">
                {t("edit_q.chooseQuestionType")}
              </p>
            </div>
          )}
          {chosenType && (
            <div
              id="pagination"
              className="flex justify-center items-center mt-4 gap-x-[10px]"
            >
              {newQuestions.map((_, index) => (
                <p
                  className={`h-10 w-10 text-[#757575] flex items-center justify-center select-none rounded-[10px] text-[16px] cursor-pointer font-semibold ${
                    index === currentPage && "bg-[#E6E6E6] text-black"
                  }`}
                  onClick={() => {
                    setCurrentPage(index);
                    setCurrentQuestion(newQuestions[index]);
                    setChosenType(newQuestions[index].questionType);
                  }}
                  key={index}
                >
                  {index + 1}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
