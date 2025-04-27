import React from "react";
import {
  Checkbox,
  Radio,
  Rate,
  Card,
  Image,
  Select,
  Table,
  Tag,
  DatePicker,
  TimePicker,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import RateStarIcon from "@/public/icons/rate_star";
import { questionTypeTranslations } from "@/utils/utils";
import dayjs, { Dayjs } from "dayjs";

interface Option {
  id: string;
  content: string;
  order: number;
  poster?: string | null;
  points?: number;
  isCorrect?: boolean;
  nextQuestionOrder?: number | null;
  rowIndex?: number | null;
  columnIndex?: number | null;
}

interface Question {
  id: string;
  content: string;
  questionType: string;
  minAnswerCount: number;
  options: Option[];
  order: number;
  required?: boolean;
  rateNumber?: number;
  rateType?: string;
  poster?: string | null;
  isPointBased?: boolean;
  hasCorrectAnswer?: boolean;
  gridRows?: string[];
  gridColumns?: string[];
  minValue?: number;
  maxValue?: number;
  minLabel?: string;
  maxLabel?: string;
}

interface PollQuestionProps {
  question: Question;
  index?: number;
  answers: { questionId: string; option: any[]; textAnswer: string }[];
  requiredError: string[];
  custStyle: { backgroundColor: string; primaryColor: string };
  handleChange: (questionId: string, value: any[], textAnswer: string) => void;
  handleDropdownChange: (nextIndex: number) => void;
}

export default function PollQuestion({
  question,
  index,
  answers,
  requiredError,
  custStyle,
  handleChange,
  handleDropdownChange,
}: PollQuestionProps) {
  const isError = requiredError.includes(question.id);

  const getValidDayjsValue = (
    textAnswer: string | undefined,
    format: string
  ): Dayjs | null => {
    if (!textAnswer) {
      console.warn("No textAnswer provided for TimePicker");
      return null;
    }
    const parsed = dayjs(textAnswer, format, true);
    if (!parsed.isValid()) {
      console.warn(
        `Invalid time format for textAnswer: "${textAnswer}", expected format: ${format}`
      );
      return null;
    }
    return parsed;
  };

  return (
    <Card
      key={question.id}
      title={
        <div className="flex flex-col justify-start items-start gap-2 p-2">
          <span>
            {index !== undefined
              ? `${index + 1}. ${question.content}`
              : question.content}
          </span>
          <Tag color="green">
            {questionTypeTranslations[question.questionType] || "Цаг"}
          </Tag>
          {question.required && <span className="text-red-500">*</span>}
        </div>
      }
      className="w-full shadow-xl hover:scale-102 transition-all duration-300 ease-in-out"
      style={{ marginBottom: 16, backgroundColor: custStyle.backgroundColor }}
      headStyle={{ color: custStyle.primaryColor }}
      styles={{ body: { color: custStyle.primaryColor } }}
    >
      {question.poster && (
        <Image
          src={question.poster}
          height={100}
          style={{
            width: "auto",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
      {isError && (
        <div className="text-red-500 text-xs mb-2">
          Энэ асуултад заавал хариулах шаардлагатай
        </div>
      )}
      {question.questionType === "MULTI_CHOICE" && (
        <div className="text-xs mb-2" style={{ color: custStyle.primaryColor }}>
          Хамгийн багадаа {question.minAnswerCount} сонголт сонгоно уу
        </div>
      )}

      {question.questionType === "MULTIPLE_CHOICE_GRID" && (
        <div className="w-full">
          <Table
            dataSource={question.gridRows?.map((row, rowIndex) => ({
              key: rowIndex,
              row,
            }))}
            columns={[
              {
                title: "",
                dataIndex: "row",
                key: "row",
                render: (text) => (
                  <span style={{ color: custStyle.primaryColor }}>{text}</span>
                ),
              },
              ...(question.gridColumns?.map((column, colIndex) => ({
                title: column,
                dataIndex: `col${colIndex}`,
                key: `col${colIndex}`,
                render: (_: any, record: { key: number; row: string }) => {
                  const rowIndex = question.gridRows?.indexOf(record.row) || 0;
                  const option = question.options.find(
                    (opt) =>
                      opt.rowIndex === rowIndex && opt.columnIndex === colIndex
                  );
                  const selectedOption = answers
                    .find((answer) => answer.questionId === question.id)
                    ?.option.find((opt) => opt.rowIndex === rowIndex);
                  return (
                    <Radio
                      checked={selectedOption?.id === option?.id}
                      onChange={() => {
                        const newOption = question.options.find(
                          (opt) =>
                            opt.rowIndex === rowIndex &&
                            opt.columnIndex === colIndex
                        );
                        if (newOption) {
                          const updatedOptions =
                            answers
                              .find(
                                (answer) => answer.questionId === question.id
                              )
                              ?.option.filter(
                                (opt) => opt.rowIndex !== rowIndex
                              ) || [];
                          handleChange(
                            question.id,
                            [...updatedOptions, newOption],
                            ""
                          );
                        }
                      }}
                      style={{ color: custStyle.primaryColor }}
                    />
                  );
                },
              })) || []),
            ]}
            pagination={false}
            bordered
            size="small"
            style={{ color: custStyle.primaryColor }}
          />
        </div>
      )}

      {question.questionType === "TICK_BOX_GRID" && (
        <div className="w-full">
          <Table
            dataSource={question.gridRows?.map((row, rowIndex) => ({
              key: rowIndex,
              row,
            }))}
            columns={[
              {
                title: "",
                dataIndex: "row",
                key: "row",
                render: (text) => (
                  <span style={{ color: custStyle.primaryColor }}>{text}</span>
                ),
              },
              ...(question.gridColumns?.map((column, colIndex) => ({
                title: column,
                dataIndex: `col${colIndex}`,
                key: `col${colIndex}`,
                render: (_: any, record: { key: number; row: string }) => {
                  const rowIndex = question.gridRows?.indexOf(record.row) || 0;
                  const option = question.options.find(
                    (opt) =>
                      opt.rowIndex === rowIndex && opt.columnIndex === colIndex
                  );
                  const isChecked =
                    answers
                      .find((answer) => answer.questionId === question.id)
                      ?.option.some((opt) => opt.id === option?.id) || false;
                  return (
                    <Checkbox
                      checked={isChecked}
                      onChange={(e) => {
                        const newOption = question.options.find(
                          (opt) =>
                            opt.rowIndex === rowIndex &&
                            opt.columnIndex === colIndex
                        );
                        if (newOption) {
                          let updatedOptions =
                            answers.find(
                              (answer) => answer.questionId === question.id
                            )?.option || [];
                          if (e.target.checked) {
                            updatedOptions = [...updatedOptions, newOption];
                          } else {
                            updatedOptions = updatedOptions.filter(
                              (opt) => opt.id !== newOption.id
                            );
                          }
                          handleChange(question.id, updatedOptions, "");
                        }
                      }}
                      style={{ color: custStyle.primaryColor }}
                    />
                  );
                },
              })) || []),
            ]}
            pagination={false}
            bordered
            size="small"
            style={{ color: custStyle.primaryColor }}
          />
        </div>
      )}

      {question.questionType === "LINEAR_SCALE" && (
        <div className="flex flex-col gap-3 w-full">
          <div
            className="flex flex-row justify-between text-xs mb-2"
            style={{ color: custStyle.primaryColor }}
          >
            <span>{question.minLabel}</span>
            <div className="flex flex-row gap-6 items-end">
              <Radio.Group
                onChange={(e) =>
                  handleChange(question.id, [e.target.value], "")
                }
                value={
                  answers.find((answer) => answer.questionId === question.id)
                    ?.option?.[0] || undefined
                }
              >
                <div className="flex flex-row gap-4">
                  {question.options.map((item: Option, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center"
                    >
                      <Radio
                        value={item}
                        className="custom-radio"
                        style={{ color: custStyle.primaryColor }}
                      />
                      <span
                        className="text-[13px] font-medium mt-1 text-center font-open"
                        style={{ color: custStyle.primaryColor }}
                      >
                        {item.content}
                      </span>
                    </div>
                  ))}
                </div>
              </Radio.Group>
            </div>
            <span>{question.maxLabel}</span>
          </div>
        </div>
      )}

      {question.questionType === "MULTI_CHOICE" && (
        <Checkbox.Group
          value={
            answers.find((answer) => answer.questionId === question.id)
              ?.option || []
          }
          onChange={(checkedValues) =>
            handleChange(question.id, checkedValues, "")
          }
          className="circle-checkbox flex flex-col gap-3 w-full max-h-full overflow-y-auto"
        >
          {question.options.map((item: Option, idx: number) => (
            <div key={idx} className="flex flex-row gap-2 w-full items-center">
              <div className="flex-1">
                <Checkbox
                  value={item}
                  style={{ color: custStyle.primaryColor }}
                  className="custom-radio w-full border font-open border-[#D9D9D9] rounded-[10px] p-3 text-[13px] font-medium items-center gap-3"
                >
                  {item.content}
                </Checkbox>
              </div>
              {item.poster && (
                <Image
                  src={item.poster}
                  height={80}
                  style={{
                    width: "auto",
                    borderRadius: "8px",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
          ))}
        </Checkbox.Group>
      )}

      {question.questionType === "SINGLE_CHOICE" && (
        <Radio.Group
          onChange={(e) => handleChange(question.id, [e.target.value], "")}
          value={
            answers.find((answer) => answer.questionId === question.id)
              ?.option?.[0] || undefined
          }
          className="flex flex-col w-full max-h-full overflow-y-auto"
        >
          {question.options.map((item: Option, idx: number) => (
            <div key={idx} className="flex flex-row w-full gap-2 items-center">
              <div className="flex-1">
                <Radio
                  style={{ color: custStyle.primaryColor }}
                  className="custom-radio w-full border font-open !mt-3 border-[#D9D9D9] rounded-[10px] text-[13px] font-medium items-center bg-transparent"
                  value={item}
                >
                  {item.content}
                </Radio>
              </div>
              {item.poster && (
                <Image
                  src={item.poster}
                  height={80}
                  style={{
                    width: "auto",
                    borderRadius: "8px",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
          ))}
        </Radio.Group>
      )}

      {question.questionType === "DROPDOWN" && (
        <Select
          style={{ width: "100%", color: custStyle.primaryColor }}
          value={
            answers.find((answer) => answer.questionId === question.id)
              ?.option?.[0]?.id || undefined
          }
          onChange={(value) => {
            const selectedOption = question.options.find(
              (opt) => opt.id === value
            );
            handleChange(
              question.id,
              selectedOption ? [selectedOption] : [],
              ""
            );
            if (selectedOption?.nextQuestionOrder !== null) {
              const nextIndex =
                question.options.find(
                  (q) =>
                    selectedOption &&
                    q.order === selectedOption.nextQuestionOrder
                )?.order || 0;
              handleDropdownChange(nextIndex);
            }
          }}
          placeholder="Сонголт хийнэ үү"
          options={question.options.map((item: Option) => ({
            value: item.id,
            label: (
              <div>
                <p>{item.content}</p>
                {item.poster && (
                  <Image
                    src={item.poster}
                    height={80}
                    style={{
                      width: "auto",
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>
            ),
          }))}
          className="w-full"
        />
      )}

      {question.questionType === "RATING" && (
        <div className="w-full flex items-center justify-center">
          <Rate
            count={question.rateNumber}
            value={Number(
              answers.find((answer) => answer.questionId === question.id)
                ?.option?.[0]?.content || 0
            )}
            onChange={(value) => {
              const selectedOption = question.options.find(
                (opt: any) => opt.content === String(value)
              );
              handleChange(question.id, [selectedOption], "");
            }}
            character={({ index = 0 }) =>
              question.rateType === "NUMBER" ? (
                <span
                  className="text-base font-semibold font-open"
                  style={{
                    color:
                      index <
                      Number(
                        answers.find(
                          (answer) => answer.questionId === question.id
                        )?.option?.[0]?.content || 0
                      )
                        ? custStyle.primaryColor
                        : "#E0E8F1",
                  }}
                >
                  {question.options[index].content}
                </span>
              ) : (
                <RateStarIcon
                  fill={
                    index <
                    Number(
                      answers.find(
                        (answer) => answer.questionId === question.id
                      )?.option?.[0]?.content || 0
                    )
                      ? custStyle.primaryColor
                      : "#E0E8F1"
                  }
                />
              )
            }
          />
        </div>
      )}

      {question.questionType === "YES_NO" && (
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          onChange={(e) => handleChange(question.id, [e.target.value], "")}
          value={
            answers.find((answer) => answer.questionId === question.id)
              ?.option?.[0] || undefined
          }
          className="flex flex-col w-full max-h-full overflow-y-auto"
        >
          {question.options.map((item: Option, idx: number) => (
            <div key={idx} className="flex flex-row w-full items-center gap-2">
              <div className="flex-1">
                <Radio
                  style={{ color: custStyle.primaryColor }}
                  className="custom-radio w-full border font-open !mt-3 border-[#D9D9D9] rounded-[10px] text-[13px] font-medium items-center bg-transparent"
                  value={item}
                >
                  {item.content}
                </Radio>
              </div>
              {item.poster && (
                <Image
                  src={item.poster}
                  height={80}
                  style={{
                    width: "auto",
                    borderRadius: "8px",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
          ))}
        </Radio.Group>
      )}

      {question.questionType === "TEXT" && (
        <TextArea
          onChange={(e) => handleChange(question.id, [], e.target.value)}
          value={
            answers.find((answer) => answer.questionId === question.id)
              ?.textAnswer || ""
          }
          style={{
            backgroundColor: custStyle.backgroundColor,
            color: custStyle.primaryColor,
          }}
          placeholder="Enter text"
          className=""
        />
      )}

      {question.questionType === "DATE" && (
        <DatePicker
          onChange={(date, dateString) =>
            handleChange(question.id, [], dateString as string)
          }
          value={getValidDayjsValue(
            answers.find((answer) => answer.questionId === question.id)
              ?.textAnswer,
            "YYYY-MM-DD"
          )}
          style={{
            width: "100%",
            backgroundColor: custStyle.backgroundColor,
            color: custStyle.primaryColor,
            borderColor: "#D9D9D9",
          }}
          placeholder="Огноо сонгоно уу"
          format="YYYY-MM-DD"
          className="w-full"
        />
      )}

      {question.questionType === "TIME" && (
        <TimePicker
          onChange={(time, timeString) => {
            const formattedTime = time ? dayjs(time).format("HH:mm") : "";
            handleChange(question.id, [], formattedTime);
          }}
          value={getValidDayjsValue(
            `2000-01-01 ${
              answers.find((answer) => answer.questionId === question.id)
                ?.textAnswer
            }`,
            "HH:mm"
          )}
          format="HH:mm"
          placeholder="Цаг сонгоно уу"
          style={{
            width: "100%",
            backgroundColor: custStyle.backgroundColor,
            color: custStyle.primaryColor,
            borderColor: "#D9D9D9",
          }}
          className="w-full"
        />
      )}
    </Card>
  );
}
