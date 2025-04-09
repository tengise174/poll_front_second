"use client";
import { getStatById } from "@/api/action";
import { useQuery } from "@tanstack/react-query";
import { Card, Divider, Skeleton, Table } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Image } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F"];

type ChartType = "pie" | "bar" | "line";

interface AnsweredByProp {
  username: string;
  count: number;
}

// Define interfaces for your poll data structure
interface PollOption {
  optionId: string;
  content: string;
  selectionCount: number;
  answeredBy: AnsweredByProp[];
}

interface PollAnswer {
  textAnswer: string;
  answeredBy: string;
  createdAt: string;
  timeTaken: string;
}

interface PollQuestion {
  questionId: string;
  content: string;
  questionType: "MULTI_CHOICE" | "RATING" | "YES_NO" | "TEXT" | "SINGLE_CHOICE";
  avgTimeTaken: number;
  options?: PollOption[];
  answers?: PollAnswer[];
}

interface SubmittedUserProp {
  id: string;
  username: string;
  totalTimeTaken: number;
}

interface PollData {
  pollId: string;
  title: string;
  createdAt: string;
  status: "YET_OPEN" | "CLOSED" | "PULL" | "OPEN";
  submittedUserCount: number;
  pollsterNumber: number;
  avgPollTime: number;
  poster: string;
  questions: PollQuestion[];
  submittedUsers: SubmittedUserProp[];
  failedAttendees: any[];
}

const statusConv = {
  YET_OPEN: "Эхлээгүй",
  CLOSED: "Дууссан",
  PULL: "Дүүрсэн",
  OPEN: "Нээлттэй",
};

const StatsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<PollData | null>(null);
  const [chartTypes, setChartTypes] = useState<ChartType[]>([]);

  const {
    data: fetchedData,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["stat", id],
    queryFn: () => getStatById(id as string),
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData);
      setChartTypes(fetchedData.questions.map(() => "pie" as ChartType));
    }
  }, [fetchedData]);

  const handleChartTypeChange = (index: number, type: ChartType) => {
    const newChartTypes = [...chartTypes];
    newChartTypes[index] = type;
    setChartTypes(newChartTypes);
  };

  const renderChart = (chartType: ChartType, chartData: any[]) => {
    switch (chartType) {
      case "pie":
        return (
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case "bar":
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0088FE" />
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0088FE"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        );
      default:
        return null;
    }
  };

  const columns = [
    {
      title: "Option",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Users",
      dataIndex: "answeredBy",
      key: "answeredBy",
      render: (answeredBy: string[]) =>
        answeredBy && answeredBy.length > 0
          ? answeredBy.join(", ")
          : "No users",
    },
  ];

  if (isFetching) {
    return <Skeleton />;
  }

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="p-6">
      {data && (
        <div className="flex flex-col gap-2">
          <div className="bg-second-bg  rounded p-4">
            <div>
              <div className="flex flex-row gap-4 items-center">
                <Image
                  src={
                    data.poster ||
                    "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  }
                  alt="poster"
                  width={200}
                  height={200}
                />
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                  {data.title}
                </h1>
              </div>
              <div className="flex flex-row items-center">
                <p>
                  Үүсгэсэн огноо:{" "}
                  {new Date(data.createdAt).toLocaleDateString()}
                </p>
                <Divider type="vertical" className="border" />
                <p>Төлөв: {statusConv[data.status]}</p>
                <Divider type="vertical" className="border" />
                <p>
                  Хариулт: {data.submittedUserCount} /{" "}
                  {data.pollsterNumber || "-"}
                </p>
              </div>
            </div>
            <Divider className="border" />
            <div>
              <p>Асуулгын тойм</p>
              <div>
                <Card title="Оролцсон тоо">
                  <p>{data.submittedUserCount}</p>
                </Card>
                <Card title="Оролцсон тоо">
                  <p>{data.failedAttendees.length}</p>
                </Card>
              </div>
              <div></div>
            </div>
          </div>
          <div className="space-y-6">
            {data.questions.map((question: PollQuestion, qIndex: number) => {
              if (question.questionType === "TEXT") {
                return (
                  <div
                    key={qIndex}
                    className="p-6 bg-second-gray rounded-lg shadow-md"
                  >
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                      Question: {question.content}
                    </h2>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      User Responses
                    </h3>
                    {question.answers && question.answers.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {question.answers.map((answer, aIndex) => (
                          <li key={aIndex} className="text-gray-800">
                            <span className="font-medium">
                              {answer.answeredBy}
                            </span>
                            : {answer.textAnswer}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No responses yet</p>
                    )}
                  </div>
                );
              }

              const chartData = question.options!.map((option) => ({
                name: option.content,
                value: option.selectionCount,
              }));

              const tableData = question.options!;

              return (
                <div
                  key={qIndex}
                  className="p-6 bg-second-gray rounded-lg shadow-md"
                >
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Question: {question.content}
                  </h2>

                  <div className="mb-4">
                    <label className="mr-2 text-gray-600">Chart Type:</label>
                    <select
                      value={chartTypes[qIndex]}
                      onChange={(e) =>
                        handleChartTypeChange(
                          qIndex,
                          e.target.value as ChartType
                        )
                      }
                      className="p-2 border rounded"
                    >
                      <option value="pie">Pie Chart</option>
                      <option value="bar">Bar Chart</option>
                      <option value="line">Line Chart</option>
                    </select>
                  </div>

                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      {renderChart(chartTypes[qIndex], chartData) ?? (
                        <div>No chart available</div>
                      )}
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      User Responses
                    </h3>
                    <Table
                      columns={columns}
                      dataSource={tableData}
                      rowKey={(record) => record.optionId} // Safe now with proper typing
                      pagination={false}
                      bordered
                      size="middle"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
