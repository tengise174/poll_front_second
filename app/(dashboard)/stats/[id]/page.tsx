"use client";
import { getStatById } from "@/api/action";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Collapse,
  Descriptions,
  Divider,
  Skeleton,
  Table,
  Tag,
} from "antd";
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

const { Panel } = Collapse;

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F"];

type ChartType = "pie" | "bar" | "line";

const questionTypeTranslations: Record<string, string> = {
  MULTI_CHOICE: "Олон сонголттой",
  RATING: "Үнэлгээ",
  YES_NO: "Тийм/Үгүй",
  TEXT: "Текст",
  SINGLE_CHOICE: "Ганц сонголттой",
};

interface AnsweredByProp {
  username: string;
  count: number;
}

interface PollOption {
  optionId: string;
  content: string;
  selectionCount: number;
  answeredBy: AnsweredByProp[];
  order: number; // Added order field for options
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
  order: number; // Added order field for questions
  options?: PollOption[];
  answers?: PollAnswer[];
}

interface UserProp {
  id: string;
  username: string;
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
  isAccessLevel: boolean;
  isDuration: boolean;
  duration: number | null;
  isPollsterNumber: boolean;
  startDate: string | null;
  endDate: string | null;
  status: "YET_OPEN" | "CLOSED" | "PULL" | "OPEN";
  submittedUserCount: number;
  pollsterNumber: number | null;
  avgPollTime: number;
  poster: string;
  questions: PollQuestion[];
  pollsters: UserProp[];
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
      // Sort questions by order field
      const sortedQuestions = [...fetchedData.questions].sort(
        (a, b) => a.order - b.order
      );
      setData({ ...fetchedData, questions: sortedQuestions });
      setChartTypes(sortedQuestions.map(() => "pie" as ChartType));
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

  const optionColumns = [
    {
      title: "Option",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Users",
      dataIndex: "answeredBy",
      key: "answeredBy",
      render: (answeredBy: { username: string; timeTaken: number }[]) =>
        answeredBy && answeredBy.length > 0
          ? answeredBy.map((user) => user.username).join(", ")
          : "No users",
    },
  ];

  const pollsterColumns = [
    {
      title: "Хэрэглэгчийн нэр",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Төлөв",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        switch (status) {
          case "submitted":
            return <Tag color="green">Хариулсан</Tag>;
          case "failed":
            return <Tag color="yellow">Амжаагүй</Tag>;
          case "not_attended":
            return <Tag color="red">Оролцоогүй</Tag>;
          default:
            return <Tag color="gray">Тодорхойгүй</Tag>;
        }
      },
    },
    {
      title: "Зарцуулсан хугацаа (секунд)",
      dataIndex: "takenTime",
      key: "takenTime",
      render: (text: number | null) => (text ? text.toFixed(2) : "-"),
    },
  ];

  if (isFetching) {
    return <Skeleton />;
  }

  if (error) {
    return <div>Something went wrong</div>;
  }

  const questionTypeCounts =
    data?.questions.reduce((acc, question) => {
      acc[question.questionType] = (acc[question.questionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  const questionTypeList = Object.entries(questionTypeCounts).map(
    ([type, count]) => ({
      type: questionTypeTranslations[type] || type,
      count,
    })
  );

  const PollDetails = ({ data }: { data: PollData }) => {
    return (
      <Card title="Санал асуулгын мэдээлэл" className="mb-6">
        <Descriptions
          column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
          bordered
          size="middle"
          styles={{ label: { fontWeight: "bold" } }}
        >
          <Descriptions.Item label="Үүсгэсэн огноо">
            {new Date(data.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Төлөв">
            {statusConv[data.status]}
          </Descriptions.Item>
          <Descriptions.Item label="Хариулсан">
            {data.submittedUserCount}
          </Descriptions.Item>
          <Descriptions.Item label="Эхлэх огноо">
            {data.startDate
              ? new Date(data.startDate).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Сонгоогүй"}
          </Descriptions.Item>
          <Descriptions.Item label="Дуусах огноо">
            {data.endDate
              ? new Date(data.endDate).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "Сонгоогүй"}
          </Descriptions.Item>
          <Descriptions.Item label="Хаалттай эсэх">
            {data.isAccessLevel ? (
              <Tag color="green">Тийм</Tag>
            ) : (
              <Tag color="red">Үгүй</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Хугацаа">
            {data.isDuration ? data.duration : "Сонгоогүй"}
          </Descriptions.Item>
          <Descriptions.Item label="Оролцогчийн тоо">
            {data.isPollsterNumber ? data.pollsterNumber : "Сонгоогүй"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  };

  // Prepare pollster data when isAccessLevel is true
  const getPollsterData = (data: PollData) => {
    if (!data.isAccessLevel) return [];

    const submittedUserIds = new Set(data.submittedUsers.map((u) => u.id));
    const failedAttendeeUsernames = new Set(
      data.failedAttendees.map((a) => a.username)
    );

    return data.pollsters.map((pollster) => {
      if (submittedUserIds.has(pollster.id)) {
        const submittedUser = data.submittedUsers.find(
          (u) => u.id === pollster.id
        );
        return {
          key: pollster.id,
          username: pollster.username,
          status: "submitted",
          takenTime: submittedUser?.totalTimeTaken || null,
        };
      } else if (failedAttendeeUsernames.has(pollster.username)) {
        return {
          key: pollster.id,
          username: pollster.username,
          status: "failed",
          takenTime: null,
        };
      } else {
        return {
          key: pollster.id,
          username: pollster.username,
          status: "not_attended",
          takenTime: null,
        };
      }
    });
  };

  return (
    <div className="p-6">
      {data && (
        <div className="flex flex-col gap-2">
          <div className="bg-second-bg rounded p-4">
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
              <PollDetails data={data} />
            </div>
            <Divider className="border" />
            <div className="flex flex-col gap-4">
              <Collapse defaultActiveKey={["1"]} expandIconPosition="end">
                <Panel header="Асуулгын тойм" key="1">
                  <div className="flex flex-row gap-2 w-full">
                    <Card title="Оролцсон" className="flex-1">
                      <p className="font-bold text-xl text-end">
                        {data.submittedUserCount}
                      </p>
                    </Card>
                    <Card title="Амжаагүй" className="flex-1">
                      <p className="font-bold text-xl text-end">
                        {data.failedAttendees.length}
                      </p>
                    </Card>
                    <Card title="Дундаж" className="flex-1">
                      <p className="font-bold text-xl text-end">
                        {data.avgPollTime.toFixed(2)}
                      </p>
                    </Card>
                  </div>
                </Panel>
              </Collapse>
              <Collapse defaultActiveKey={["1"]} expandIconPosition="end">
                <Panel header="Асуултууд" key="1">
                  <Card>
                    <div>
                      <p className="font-bold text-xl flex flex-row justify-between">
                        <span>Нийт</span>
                        <span>{data.questions.length}</span>
                      </p>
                      <ul className="text-sm text-gray-600 mt-2">
                        {questionTypeList.map((item) => (
                          <li
                            key={item.type}
                            className="flex flex-row justify-between"
                          >
                            <span>{item.type} :</span>
                            <span>{item.count}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </Panel>
              </Collapse>
              <Collapse defaultActiveKey={["1"]} expandIconPosition="end">
                <Panel header="Оролцогчдын мэдээлэл" key="1">
                  <Card>
                    <Table
                      columns={[
                        {
                          title: "Хэрэглэгчийн нэр",
                          dataIndex: "username",
                          key: "username",
                        },
                        {
                          title: "Төлөв",
                          dataIndex: "status",
                          key: "status",
                          render: (text) =>
                            text === "submitted" ? (
                              <Tag color="green">Хариулсан</Tag>
                            ) : (
                              <Tag color="yellow">Амжаагүй</Tag>
                            ),
                        },
                        {
                          title: "Зарцуулсан хугацаа (секунд)",
                          dataIndex: "takenTime",
                          key: "takenTime",
                          render: (text) => (text ? text.toFixed(2) : "-"),
                        },
                      ]}
                      dataSource={[
                        ...data.submittedUsers.map((user) => ({
                          key: user.id,
                          username: user.username,
                          status: "submitted",
                          takenTime: user.totalTimeTaken,
                        })),
                        ...data.failedAttendees.map((attendee, index) => ({
                          key: `failed-${index}`,
                          username:
                            attendee.username || `Хэрэглэгч ${index + 1}`,
                          status: "failed",
                          takenTime: null,
                        })),
                      ]}
                      pagination={{ pageSize: 10 }}
                      bordered
                      size="middle"
                    />
                  </Card>
                </Panel>
              </Collapse>
              {data.isAccessLevel && (
                <Collapse defaultActiveKey={["1"]} expandIconPosition="end">
                  <Panel header="Уригдсан Оролцогчид" key="1">
                    <Card>
                      <Table
                        columns={pollsterColumns}
                        dataSource={getPollsterData(data)}
                        pagination={{ pageSize: 10 }}
                        bordered
                        size="middle"
                      />
                    </Card>
                  </Panel>
                </Collapse>
              )}
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

              // Sort options by order field for non-TEXT questions
              const sortedOptions = [...(question.options || [])].sort(
                (a, b) => a.order - b.order
              );

              const chartData = sortedOptions.map((option) => ({
                name: option.content,
                value: option.selectionCount,
              }));

              const tableData = sortedOptions;

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
                      columns={optionColumns}
                      dataSource={tableData}
                      rowKey={(record) => record.optionId}
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