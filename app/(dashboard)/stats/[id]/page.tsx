"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Collapse,
  Descriptions,
  Divider,
  Skeleton,
  Table,
  Tag,
  Image,
  Button,
} from "antd";
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
import * as XLSX from "xlsx";
import { getStatById } from "@/api/action";

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
  timeTaken: number;
}

interface PollOption {
  optionId: string;
  content: string;
  poster?: string | null;
  selectionCount: number;
  answeredBy: AnsweredByProp[];
  order: number;
  points: number;
  isCorrect: boolean;
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
  order: number;
  options?: PollOption[];
  answers?: PollAnswer[];
  poster?: string | null;
  isPointBased: boolean;
  hasCorrectAnswer: boolean;
  minAnswerCount?: number | null;
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
  poster: string | null;
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

  const calculateNetPoints = () => {
    if (!data) return 0;
    let netPoints = 0;

    data.questions.forEach((question) => {
      if (question.isPointBased && question.options) {
        if (question.questionType === "MULTI_CHOICE") {
          netPoints += question.options.reduce(
            (sum, option) => sum + option.points,
            0
          );
        } else {
          const maxPoints = Math.max(
            ...question.options.map((option) => option.points),
            0
          );
          netPoints += maxPoints;
        }
      }
    });

    return netPoints;
  };

  const calculateUserStats = (user: SubmittedUserProp) => {
    let totalPoints = 0;
    let correctAnswers = 0;

    data?.questions.forEach((question) => {
      if (question.options && question.isPointBased) {
        question.options.forEach((option) => {
          if (option.answeredBy.some((ans) => ans.username === user.username)) {
            totalPoints += option.points;
          }
        });
      }
      if (question.options && question.hasCorrectAnswer) {
        const correctOption = question.options.find((opt) => opt.isCorrect);
        if (
          correctOption &&
          correctOption.answeredBy.some((ans) => ans.username === user.username)
        ) {
          correctAnswers += 1;
        }
      }
    });

    const netPoints = calculateNetPoints();
    const percentage = netPoints > 0 ? (totalPoints / netPoints) * 100 : 0;

    return { totalPoints, correctAnswers, percentage };
  };

  const exportToExcel = () => {
    if (!data) return;

    const wb = XLSX.utils.book_new();
    const netPoints = calculateNetPoints();

    const generalInfo = [
      ["Poll Title", data.title],
      ["Created At", new Date(data.createdAt).toLocaleString()],
      ["Status", statusConv[data.status]],
      ["Submitted Users", data.submittedUserCount],
      ["Average Poll Time (s)", data.avgPollTime.toFixed(2)],
      ["Total Possible Points", netPoints],
      [
        "Start Date",
        data.startDate ? new Date(data.startDate).toLocaleString() : "Not Set",
      ],
      [
        "End Date",
        data.endDate ? new Date(data.endDate).toLocaleString() : "Not Set",
      ],
      ["Access Level", data.isAccessLevel ? "Yes" : "No"],
      ["Duration", data.isDuration ? data.duration : "Not Set"],
      [
        "Pollster Number",
        data.isPollsterNumber ? data.pollsterNumber : "Not Set",
      ],
    ];

    const wsGeneral = XLSX.utils.aoa_to_sheet(generalInfo);
    XLSX.utils.book_append_sheet(wb, wsGeneral, "Poll Info");

    const questionHeaders = [
      "Order",
      "Content",
      "Type",
      "Is Point Based",
      "Has Correct Answer",
      "Avg Time Taken (s)",
      "Option/Answer",
      "Points",
      "Is Correct",
      "Selection Count",
      "Answered By",
    ];

    const questionData: any[] = [];
    const merges: { s: { r: number; c: number }; e: { r: number; c: number } }[] = [];

    data.questions.forEach((question) => {
      if (question.questionType === "TEXT" && question.answers) {
        question.answers.forEach((answer) => {
          questionData.push([
            question.order,
            question.content,
            questionTypeTranslations[question.questionType],
            question.isPointBased ? "Yes" : "No",
            question.hasCorrectAnswer ? "Yes" : "No",
            question.avgTimeTaken.toFixed(2),
            answer.textAnswer,
            "-", 
            "-", 
            "-", 
            answer.answeredBy,
          ]);
        });
      } else if (question.options) {
        const startRow = questionData.length + 1; 
        question.options.forEach((option, idx) => {
          questionData.push([
            idx === 0 ? question.order : "", 
            idx === 0 ? question.content : "", 
            idx === 0 ? questionTypeTranslations[question.questionType] : "", 
            idx === 0 ? (question.isPointBased ? "Yes" : "No") : "", 
            idx === 0 ? (question.hasCorrectAnswer ? "Yes" : "No") : "", 
            idx === 0 ? question.avgTimeTaken.toFixed(2) : "", 
            option.content,
            option.points,
            option.isCorrect ? "Yes" : "No",
            option.selectionCount,
            option.answeredBy.map((u) => u.username).join(", "),
          ]);
        });
        const endRow = questionData.length;
        if (question.options.length > 1) {
          merges.push(
            { s: { r: startRow, c: 0 }, e: { r: endRow, c: 0 } },
            { s: { r: startRow, c: 1 }, e: { r: endRow, c: 1 } }, 
            { s: { r: startRow, c: 2 }, e: { r: endRow, c: 2 } }, 
            { s: { r: startRow, c: 3 }, e: { r: endRow, c: 3 } }, 
            { s: { r: startRow, c: 4 }, e: { r: endRow, c: 4 } }, 
            { s: { r: startRow, c: 5 }, e: { r: endRow, c: 5 } } 
          );
        }
      }
    });

    const wsQuestions = XLSX.utils.aoa_to_sheet([questionHeaders, ...questionData]);
    wsQuestions["!merges"] = merges;
    XLSX.utils.book_append_sheet(wb, wsQuestions, "Questions");

    const userHeaders = [
      "Username",
      "Total Time Taken (s)",
      "Total Points",
      "Percentage of Net Points (%)",
      "Correct Answers",
    ];
    const userData = data.submittedUsers.map((user) => {
      const { totalPoints, correctAnswers, percentage } =
        calculateUserStats(user);
      return [
        user.username,
        user.totalTimeTaken,
        totalPoints,
        percentage.toFixed(2),
        correctAnswers,
      ];
    });
    const wsUsers = XLSX.utils.aoa_to_sheet([userHeaders, ...userData]);
    XLSX.utils.book_append_sheet(wb, wsUsers, "Submitted Users");

    const userAnswerHeaders = [
      "Username",
      "Question Order",
      "Question Content",
      "Question Type",
      "Selected Options/Answer",
      "Points Earned",
      "Is Correct",
      "Time Taken (s)",
    ];

    const userAnswerData: any[] = [];
    const userAnswerMerges: { s: { r: number; c: number }; e: { r: number; c: number } }[] = [];

    data.submittedUsers.forEach((user) => {
      const startRow = userAnswerData.length + 1; 
      data.questions.forEach((question) => {
        let selectedOptions: string[] = [];
        let pointsEarned = 0;
        let isCorrect = "-";
        let timeTaken: number | null = null;

        if (question.questionType === "TEXT" && question.answers) {
          const userAnswer = question.answers.find(
            (answer) => answer.answeredBy === user.username
          );
          if (userAnswer) {
            selectedOptions = [userAnswer.textAnswer];
            timeTaken = parseFloat(userAnswer.timeTaken) || null;
          }
        } else if (question.options) {
          question.options.forEach((option) => {
            const userResponse = option.answeredBy.find(
              (ans) => ans.username === user.username
            );
            if (userResponse) {
              selectedOptions.push(option.content);
              pointsEarned += option.points;
              timeTaken = timeTaken || userResponse.timeTaken;
              if (question.hasCorrectAnswer && option.isCorrect) {
                isCorrect = "Yes";
              } else if (question.hasCorrectAnswer) {
                isCorrect = isCorrect === "Yes" ? "Yes" : "No";
              }
            }
          });
        }

        userAnswerData.push([
          userAnswerData.length === startRow - 1 ? user.username : "", 
          question.order,
          question.content,
          questionTypeTranslations[question.questionType],
          selectedOptions.length > 0 ? selectedOptions.join(", ") : "No Answer",
          pointsEarned,
          isCorrect,
          timeTaken !== null ? timeTaken.toFixed(2) : "-",
        ]);
      });
      const endRow = userAnswerData.length;
      if (data.questions.length > 0) {
        userAnswerMerges.push({
          s: { r: startRow, c: 0 },
          e: { r: endRow, c: 0 },
        });
      }
    });

    const wsUserAnswers = XLSX.utils.aoa_to_sheet([userAnswerHeaders, ...userAnswerData]);
    wsUserAnswers["!merges"] = userAnswerMerges;
    XLSX.utils.book_append_sheet(wb, wsUserAnswers, "User Answers");

    XLSX.writeFile(wb, `${data.title}_stats.xlsx`);
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
      title: "Сонголт",
      dataIndex: "content",
      key: "content",
      render: (text: string, record: PollOption) => (
        <div className="flex items-center gap-2">
          {record.poster && (
            <Image
              src={record.poster}
              height={40}
              style={{
                width: "auto",
                borderRadius: "4px",
              }}
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
      <Card title="Санал асуулгын мэдэээлэл" className="mb-6">
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

  const netPoints = calculateNetPoints();
  const summaryStats = data?.submittedUsers.reduce(
    (acc, user) => {
      const { totalPoints, correctAnswers, percentage } =
        calculateUserStats(user);
      acc.totalPoints += totalPoints;
      acc.totalCorrectAnswers += correctAnswers;
      acc.totalPercentage += percentage;
      return acc;
    },
    { totalPoints: 0, totalCorrectAnswers: 0, totalPercentage: 0 }
  ) || { totalPoints: 0, totalCorrectAnswers: 0, totalPercentage: 0 };

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
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {data.title}
                  </h1>
                  <Button type="primary" onClick={exportToExcel}>
                    Export to Excel
                  </Button>
                </div>
              </div>
              <PollDetails data={data} />
            </div>
            <Divider className="border" />
            <div className="flex flex-col gap-4">
              <Collapse defaultActiveKey={["1"]} expandIconPosition="end">
                <Panel header="Асуулгын тойм" key="1">
                  <div className="flex flex-row gap-2 w-full flex-wrap">
                    <Card title="Оролцсон" className="flex-1 min-w-[150px]">
                      <p className="font-bold text-xl text-end">
                        {data.submittedUserCount}
                      </p>
                    </Card>
                    <Card title="Амжаагүй" className="flex-1 min-w-[150px]">
                      <p className="font-bold text-xl text-end">
                        {data.failedAttendees.length}
                      </p>
                    </Card>
                    <Card
                      title="Дундаж хугацаа (с)"
                      className="flex-1 min-w-[150px]"
                    >
                      <p className="font-bold text-xl text-end">
                        {data.avgPollTime.toFixed(2)}
                      </p>
                    </Card>
                    <Card
                      title="Нийт боломжит оноо"
                      className="flex-1 min-w-[150px]"
                    >
                      <p className="font-bold text-xl text-end">{netPoints}</p>
                    </Card>
                    <Card title="Дундаж оноо" className="flex-1 min-w-[150px]">
                      <p className="font-bold text-xl text-end">
                        {data.submittedUserCount
                          ? (
                              summaryStats.totalPoints / data.submittedUserCount
                            ).toFixed(2)
                          : "0"}
                      </p>
                    </Card>
                    <Card
                      title="Дундаж % оноо"
                      className="flex-1 min-w-[150px]"
                    >
                      <p className="font-bold text-xl text-end">
                        {data.submittedUserCount
                          ? (
                              summaryStats.totalPercentage /
                              data.submittedUserCount
                            ).toFixed(2)
                          : "0"}
                      </p>
                    </Card>
                    <Card title="Зөв хариулт" className="flex-1 min-w-[150px]">
                      <p className="font-bold text-xl text-end">
                        {data.submittedUserCount
                          ? (
                              summaryStats.totalCorrectAnswers /
                              data.submittedUserCount
                            ).toFixed(2)
                          : "0"}
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
                          title: "Зарцуулсан хугацаа (с)",
                          dataIndex: "takenTime",
                          key: "takenTime",
                          render: (text) => (text ? text.toFixed(2) : "-"),
                        },
                        {
                          title: "Нийт оноо",
                          dataIndex: "totalPoints",
                          key: "totalPoints",
                          render: (text) => text ?? "0",
                        },
                        {
                          title: "Онооны хувь (%)",
                          dataIndex: "percentage",
                          key: "percentage",
                          render: (text) => (text ? text.toFixed(2) : "0.00"),
                        },
                        {
                          title: "Зөв хариулт",
                          dataIndex: "correctAnswers",
                          key: "correctAnswers",
                          render: (text) => text ?? "0",
                        },
                      ]}
                      dataSource={[
                        ...data.submittedUsers.map((user) => {
                          const { totalPoints, correctAnswers, percentage } =
                            calculateUserStats(user);
                          return {
                            key: user.id,
                            username: user.username,
                            status: "submitted",
                            takenTime: user.totalTimeTaken,
                            totalPoints,
                            percentage,
                            correctAnswers,
                          };
                        }),
                        ...data.failedAttendees.map((attendee, index) => ({
                          key: `failed-${index}`,
                          username:
                            attendee.username || `Хэрэглэгч ${index + 1}`,
                          status: "failed",
                          takenTime: null,
                          totalPoints: 0,
                          percentage: 0,
                          correctAnswers: 0,
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
                    {question.questionType === "MULTI_CHOICE" &&
                      question.minAnswerCount !== null && (
                        <p className="text-gray-600">
                          <span className="font-medium">Хамгийн бага хариултын тоо: </span>
                          {question.minAnswerCount}
                        </p>
                      )}
                  </div>
                  {question.poster && (
                    <Image
                      src={question.poster}
                      height={100}
                      style={{
                        width: "auto",
                      }}
                    />
                  )}
                  <div className="mb-4">
                    <label className="mr-2 text-gray-600">График төрөл:</label>
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
                        <div>График байхгүй</div>
                      )}
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Оролцогчдын хариулт
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