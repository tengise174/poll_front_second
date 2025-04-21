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
  LineChart,
  Line,
} from "recharts";
import { PollData, SubmittedUserProp, ChartType } from "./types";

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F"];

export const calculateNetPoints = (data: PollData): number => {
  let netPoints = 0;

  data.questions.forEach((question) => {
    if (question.isPointBased && question.options) {
      if (question.questionType === "MULTI_CHOICE") {
        netPoints += question.options.reduce((sum, option) => sum + option.points, 0);
      } else {
        const maxPoints = Math.max(...question.options.map((option) => option.points), 0);
        netPoints += maxPoints;
      }
    }
  });

  return netPoints;
};

export const calculateUserStats = (data: PollData, user: SubmittedUserProp) => {
  let totalPoints = 0;
  let correctAnswers = 0;

  data.questions.forEach((question) => {
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

  const netPoints = calculateNetPoints(data);
  const percentage = netPoints > 0 ? (totalPoints / netPoints) * 100 : 0;

  return { totalPoints, correctAnswers, percentage };
};

export const renderChart = (chartType: ChartType, chartData: any[]) => {
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
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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