"use client";
import { Image, Table, Tag } from "antd";
import { ResponsiveContainer } from "recharts";
import ChartSelector from "./ChartSelector";
import GridTable from "./GridTable";
import { PollQuestion, ChartType, questionTypeTranslations, PollOption } from "./types";
import { renderChart } from "./utils";

interface QuestionCardProps {
  question: PollQuestion;
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

const QuestionCard = ({ question, chartType, onChartTypeChange }: QuestionCardProps) => {
  const optionColumns = [
    {
      title: "Сонголт",
      dataIndex: "content",
      key: "content",
      render: (text: string, record: PollOption) => (
        <div className="flex items-center gap-2">
          {record.poster && (
            <Image
              src={record.poster}
              height={40}
              style={{ width: "auto", borderRadius: "4px" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              alt={`Option ${text} poster`}
            />
          )}
          <span>{text}</span>
          {record.isCorrect && <Tag color="green">Correct</Tag>}
          {record.points > 0 && <Tag color="blue">{record.points} points</Tag>}
        </div>
      ),
    },
    {
      title: "Хэрэглэгчид",
      dataIndex: "answeredBy",
      key: "answeredBy",
      render: (answeredBy: { username: string; timeTaken: number }[]) =>
        answeredBy && answeredBy.length > 0
          ? answeredBy.map((user) => user.username).join(", ")
          : "No users",
    },
  ];

  if (question.questionType === "TEXT") {
    return (
      <div className="p-6 bg-second-gray rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Асуулт: {question.content}
        </h2>
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-medium">Асуултын төрөл: </span>
            {questionTypeTranslations[question.questionType]}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Дундаж хариулах хугацаа: </span>
            {question.avgTimeTaken.toFixed(2)} секунд
          </p>
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          Оролцогчдын хариулт
        </h3>
        {question.answers && question.answers.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {question.answers.map((answer, aIndex) => (
              <li key={aIndex} className="text-gray-800">
                <span className="font-medium">{answer.answeredBy}</span>: {answer.textAnswer}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">Хариулт алга</p>
        )}
      </div>
    );
  }

  if (question.questionType === "MULTIPLE_CHOICE_GRID") {
    return (
      <div className="p-6 bg-second-gray rounded-lg shadow-md">
        <div className="text-xl font-semibold text-gray-700 mb-4">
          <p>Асуулт: {question.content}</p>
          {question.isPointBased && (
            <Tag color="blue" className="ml-2">
              Оноотой
            </Tag>
          )}
          {question.hasCorrectAnswer && (
            <Tag color="green" className="ml-2">
              Зөв хариулттай
            </Tag>
          )}
        </div>
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-medium">Асуултын төрөл: </span>
            {questionTypeTranslations[question.questionType]}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Дундаж хариулах хугацаа: </span>
            {question.avgTimeTaken.toFixed(2)} секунд
          </p>
        </div>
        {question.poster && (
          <Image src={question.poster} height={100} style={{ width: "auto" }} />
        )}
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Оролцогчдын хариулт
          </h3>
          <GridTable question={question} />
        </div>
      </div>
    );
  }

  const sortedOptions = [...(question.options || [])].sort((a, b) => a.order - b.order);
  const chartData = sortedOptions.map((option) => ({
    name: option.content,
    value: option.selectionCount,
  }));

  return (
    <div className="p-6 bg-second-gray rounded-lg shadow-md">
      <div className="text-xl font-semibold text-gray-700 mb-4">
        <p>Асуулт: {question.content}</p>
        {question.isPointBased && (
          <Tag color="blue" className="ml-2">
            Оноотой
          </Tag>
        )}
        {question.hasCorrectAnswer && (
          <Tag color="green" className="ml-2">
            Зөв хариулттай
          </Tag>
        )}
      </div>
      <div className="mb-4">
        <p className="text-gray-600">
          <span className="font-medium">Асуултын төрөл: </span>
          {questionTypeTranslations[question.questionType]}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Дундаж хариулах хугацаа: </span>
          {question.avgTimeTaken.toFixed(2)} секунд
        </p>
        {question.questionType === "MULTI_CHOICE" && question.minAnswerCount !== null && (
          <p className="text-gray-600">
            <span className="font-medium">Хамгийн бага хариултын тоо: </span>
            {question.minAnswerCount}
          </p>
        )}
      </div>
      {question.poster && (
        <Image src={question.poster} height={100} style={{ width: "auto" }} />
      )}
      <ChartSelector chartType={chartType} onChange={onChartTypeChange} />
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart(chartType, chartData) ?? <div>График байхгүй</div>}
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          Оролцогчдын хариулт
        </h3>
        <Table
          columns={optionColumns}
          dataSource={sortedOptions}
          rowKey={(record) => record.optionId}
          pagination={false}
          bordered
          size="middle"
        />
      </div>
    </div>
  );
};

export default QuestionCard;