"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Checkbox,
  Skeleton,
  Typography,
  Input,
  Rate,
  Image,
  Table,
  Radio,
  Layout,
} from "antd";
import { getAnsweredPollDetail } from "@/api/action";
import { dualColors } from "@/utils/utils";
import { questionTypeTranslations } from "@/utils/utils";
import { QuestionTypes } from "@/utils/componentTypes";
import { Content, Header } from "antd/es/layout/layout";

const { TextArea } = Input;
const { Text } = Typography;

interface OptionsProps {
  id: string;
  content: string;
  order: number;
  poster?: string | null;
  points?: number;
  isCorrect?: boolean;
  rowIndex?: number | null;
  columnIndex?: number | null;
}

interface QuestionProps {
  questionId: string;
  content: string;
  questionType: QuestionTypes;
  rateNumber?: number | null;
  rateType?: "STAR" | "NUMBER" | null;
  allOptions?: OptionsProps[];
  selectedOptions?: OptionsProps[];
  textAnswer?: string | null;
  poster?: string | null;
  isPointBased?: boolean;
  hasCorrectAnswer?: boolean;
  gridColumns?: string[];
  gridRows?: string[];
  minValue?: number;
  maxValue?: number;
  minLabel?: string;
  maxLabel?: string;
}

interface PollProps {
  id: string;
  title: string;
  greetingMessage: string;
  themeId: number;
  startDate?: string | null;
  endDate?: string | null;
  poster?: string | null;
}

const MyAnswersDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [answerDetails, setAnswerDetails] = useState<{
    poll: PollProps;
    questions: QuestionProps[];
  }>({
    poll: {} as PollProps,
    questions: [],
  });
  const [custStyle, setCustStyle] = useState<{
    backgroundColor: string;
    primaryColor: string;
  }>({ backgroundColor: "#FDFDFD", primaryColor: "#2C2C2C" });

  const {
    data: fetchedAnswerDetails,
    isFetching: isFetchingAnswerDetails,
    isLoading: isLoadingAnswerDetails,
    error: answerDetailsError,
  } = useQuery({
    queryKey: ["myanswer", id],
    queryFn: () => getAnsweredPollDetail(id as string),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!id,
  });

  useEffect(() => {
    if (fetchedAnswerDetails) {
      setAnswerDetails(fetchedAnswerDetails);
    }
  }, [fetchedAnswerDetails]);

  useEffect(() => {
    if (answerDetails && answerDetails?.poll.themeId) {
      setCustStyle({
        backgroundColor: dualColors[answerDetails?.poll.themeId][0],
        primaryColor: dualColors[answerDetails?.poll.themeId][1],
      });
    }
  }, [answerDetails]);

  if (isLoadingAnswerDetails || isFetchingAnswerDetails)
    return (
      <div>
        <Skeleton />
      </div>
    );

  if (answerDetailsError) {
    return (
      <div>
        <h1>Алдаа гарлаа</h1>
      </div>
    );
  }

  if (!answerDetails) return <div>Алдаа гарсан</div>;

  const calculateTotalPoints = (
    selectedOptions: OptionsProps[] | undefined,
    allOptions: OptionsProps[] | undefined
  ): number => {
    if (!selectedOptions || !allOptions) return 0;
    return selectedOptions.reduce((sum, selected) => {
      const option = allOptions.find((opt) => opt.id === selected.id);
      return sum + (option?.points || 0);
    }, 0);
  };

  const isUserAnswerCorrect = (
    selectedOptions: OptionsProps[] | undefined,
    allOptions: OptionsProps[] | undefined
  ): boolean => {
    if (!selectedOptions || !allOptions) return false;
    const correctOptionIds = allOptions
      .filter((opt) => opt.isCorrect)
      .map((opt) => opt.id);
    const selectedOptionIds = selectedOptions.map((opt) => opt.id);
    return (
      correctOptionIds.length === selectedOptionIds.length &&
      correctOptionIds.every((id) => selectedOptionIds.includes(id))
    );
  };

  const getCorrectAnswers = (
    allOptions: OptionsProps[] | undefined
  ): string => {
    if (!allOptions) return "";
    const correctOptions = allOptions
      .filter((opt) => opt.isCorrect)
      .map((opt) => opt.content || `(${opt.rowIndex}, ${opt.columnIndex})`);
    return correctOptions.length > 0
      ? correctOptions.join(", ")
      : "Зөв хариулт байхгүй";
  };

  const renderGridQuestion = (question: QuestionProps) => {
    const { gridRows, gridColumns, allOptions, selectedOptions, questionType } =
      question;

    if (!gridRows || !gridColumns || !allOptions) return null;

    // Create table columns
    const columns = [
      {
        title: "",
        dataIndex: "rowLabel",
        key: "rowLabel",
        fixed: "left" as const,
        width: 150,
      },
      ...gridColumns.map((col, index) => ({
        title: col,
        dataIndex: `col${index}`,
        key: `col${index}`,
        width: 100,
        align: "center" as const,
      })),
    ];

    // Create table data
    const dataSource = gridRows.map((row, rowIndex) => {
      const rowData: any = { rowLabel: row, key: rowIndex };
      gridColumns.forEach((_, colIndex) => {
        const option = allOptions.find(
          (opt) => opt.rowIndex === rowIndex && opt.columnIndex === colIndex
        );
        const isSelected = selectedOptions?.some(
          (sel) => sel.id === option?.id
        );
        const isCorrect = option?.isCorrect;
        rowData[`col${colIndex}`] = option ? (
          <Checkbox
            checked={isSelected}
            disabled
            className={`custom-checkbox ${isCorrect ? "text-green-600" : ""}`}
          >
            {isSelected ? "✓" : ""}
          </Checkbox>
        ) : null;
      });
      return rowData;
    });

    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        size="small"
        style={{ marginBottom: 16 }}
      />
    );
  };

  const renderLinearScaleQuestion = (question: QuestionProps) => {
    const { allOptions, selectedOptions } = question;
    if (!allOptions) return null;

    return (
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between mb-4 w-full">
          <Text>{question.minLabel}</Text>
          <Radio.Group
            value={selectedOptions?.[0]?.id}
            disabled
            className="flex justify-between"
          >
            <div className="flex flex-row">
              {allOptions
                .sort((a, b) => a.order - b.order)
                .map((option) => (
                  <div key={option.id} className="flex flex-col items-center">
                    <Radio value={option.id} />
                    <Text className="mt-1">{option.content}</Text>
                  </div>
                ))}
            </div>
          </Radio.Group>
          <Text>{question.maxLabel}</Text>
        </div>
        {question.hasCorrectAnswer && (
          <div className="mt-4">
            <Text strong>
              Зөв хариулт: {getCorrectAnswers(question.allOptions)}
            </Text>
            <br />
            <Text
              type={
                isUserAnswerCorrect(
                  question.selectedOptions,
                  question.allOptions
                )
                  ? "success"
                  : "danger"
              }
            >
              Таны хариулт:{" "}
              {isUserAnswerCorrect(
                question.selectedOptions,
                question.allOptions
              )
                ? "Зөв"
                : "Буруу"}
            </Text>
          </div>
        )}
        {question.isPointBased && (
          <div className="mt-2">
            <Text strong>
              Нийт оноо:{" "}
              {calculateTotalPoints(
                question.selectedOptions,
                question.allOptions
              )}
            </Text>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <Header className="!bg-white shadow-md border-l border-0.5 border-[#D9D9D9] !h-[120]">
        <div className="w-full font-bold flex flex-row gap-2 mt-2">
          <div className="flex flex-col gap-2 mt-6">
            <h1 className="text-xl font-semibold text-black">
              Асуулгын нэр: {answerDetails.poll.title}
            </h1>
            <p className="text-black leading-none">
              Тайлбар: {answerDetails.poll.greetingMessage}
            </p>
          </div>
          <div>
            {answerDetails.poll.poster && (
              <Image
                src={
                  answerDetails.poll.poster ||
                  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                }
                alt="poster"
                style={{
                  width: "auto",
                }}
                height={100}
              />
            )}
          </div>
        </div>
      </Header>
      <Content className="overflow-y-auto">
        <div className="w-200 flex flex-col items-center justify-center mx-auto gap-6 p-4">
          <div className="flex flex-col gap-4 w-full">
            {answerDetails.questions.map((question, index) => (
              <Card
                key={question.questionId}
                title={
                  <div>
                    <h2 className="mb-2">
                      {index + 1}. {question.content}
                    </h2>
                    <Text type="secondary">
                      Асуулгын төрөл:{" "}
                      {questionTypeTranslations[question.questionType] ||
                        question.questionType}
                    </Text>
                  </div>
                }
              >
                {question.poster && (
                  <Image
                    src={question.poster}
                    height={150}
                    style={{
                      width: "auto",
                    }}
                  />
                )}
                {question.questionType === "RATING" ? (
                  <Rate
                    defaultValue={
                      question.selectedOptions?.[0]?.content
                        ? Number(question.selectedOptions[0].content)
                        : 0
                    }
                    count={question.rateNumber || 5}
                    disabled
                    character={
                      question.rateType === "NUMBER"
                        ? ({ index = 0 }) => index + 1
                        : undefined
                    }
                  />
                ) : question.questionType === "TEXT" ? (
                  <TextArea
                    value={question.textAnswer || ""}
                    readOnly
                    rows={4}
                    style={{ marginTop: 8 }}
                  />
                ) : question.questionType === "DATE" ? (
                  <div>
                    {new Date(question.textAnswer ?? "").toLocaleDateString(
                      "mn-MN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                ) : question.questionType === "TIME" ? (
                  <div>
                    {new Date(
                      `2000-01-01T${question.textAnswer}:00`
                    ).toLocaleTimeString("mn-MN", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: false,
                    })}
                  </div>
                ) : question.questionType === "MULTIPLE_CHOICE_GRID" ||
                  question.questionType === "TICK_BOX_GRID" ? (
                  <div className="flex flex-col">
                    {renderGridQuestion(question)}
                    {question.hasCorrectAnswer && (
                      <div className="mt-4">
                        <Text strong>
                          Зөв хариулт: {getCorrectAnswers(question.allOptions)}
                        </Text>
                        <br />
                        <Text
                          type={
                            isUserAnswerCorrect(
                              question.selectedOptions,
                              question.allOptions
                            )
                              ? "success"
                              : "danger"
                          }
                        >
                          Таны хариулт:{" "}
                          {isUserAnswerCorrect(
                            question.selectedOptions,
                            question.allOptions
                          )
                            ? "Зөв"
                            : "Буруу"}
                        </Text>
                      </div>
                    )}
                    {question.isPointBased && (
                      <div className="mt-2">
                        <Text strong>
                          Нийт оноо:{" "}
                          {calculateTotalPoints(
                            question.selectedOptions,
                            question.allOptions
                          )}
                        </Text>
                      </div>
                    )}
                  </div>
                ) : question.questionType === "LINEAR_SCALE" ? (
                  renderLinearScaleQuestion(question)
                ) : (
                  <div className="flex flex-col">
                    {question.allOptions?.map((option) => {
                      const isChecked = question.selectedOptions?.some(
                        (selected) => selected.id === option.id
                      );
                      const isCorrectOption = option.isCorrect;
                      return (
                        <div key={option.id} className="flex flex-col">
                          <Checkbox
                            checked={isChecked}
                            disabled
                            style={{ marginBottom: 8 }}
                            className="custom-checkbox"
                          >
                            <div className="flex flex-row items-center gap-2">
                              <p
                                className={`font-bold text-md ${
                                  isCorrectOption ? "text-green-600" : ""
                                }`}
                              >
                                {option.content}
                                {question.isPointBased &&
                                option.points !== undefined
                                  ? ` (${option.points} оноо)`
                                  : ""}
                              </p>
                              {option.poster && (
                                <Image
                                  src={option.poster}
                                  height={100}
                                  style={{
                                    width: "auto",
                                  }}
                                />
                              )}
                            </div>
                          </Checkbox>
                        </div>
                      );
                    })}
                    {question.hasCorrectAnswer && (
                      <div className="mt-4">
                        <Text strong>
                          Зөв хариулт: {getCorrectAnswers(question.allOptions)}
                        </Text>
                        <br />
                        <Text
                          type={
                            isUserAnswerCorrect(
                              question.selectedOptions,
                              question.allOptions
                            )
                              ? "success"
                              : "danger"
                          }
                        >
                          Таны хариулт:{" "}
                          {isUserAnswerCorrect(
                            question.selectedOptions,
                            question.allOptions
                          )
                            ? "Зөв"
                            : "Буруу"}
                        </Text>
                      </div>
                    )}
                    {question.isPointBased && (
                      <div className="mt-2">
                        <Text strong>
                          Нийт оноо:{" "}
                          {calculateTotalPoints(
                            question.selectedOptions,
                            question.allOptions
                          )}
                        </Text>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default MyAnswersDetail;
