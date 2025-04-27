"use client";
import { useState } from "react";
import { Card, Collapse, Select, Table } from "antd";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PollData } from "./types";
import { questionTypeTranslations } from "@/utils/utils";

const { Panel } = Collapse;
const { Option } = Select;

interface QuestionSummaryProps {
  data: PollData;
}

const QuestionSummary = ({ data }: QuestionSummaryProps) => {
  const [viewMode, setViewMode] = useState<"table" | "pie" | "bar" | "line">(
    "pie"
  );
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend" | null>(null);

  const questionTypeCounts = data.questions.reduce((acc, question) => {
    acc[question.questionType] = (acc[question.questionType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const questionTypeList = Object.entries(questionTypeCounts).map(
    ([type, count]) => ({
      type: questionTypeTranslations[type] || type,
      count,
    })
  );

  const chartData = questionTypeList.map((item) => ({
    name: item.type,
    value: item.count,
  }));

  const columns = [
    {
      title: "Асуултын төрөл",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Тоо",
      dataIndex: "count",
      key: "count",
      sorter: (a: { count: number }, b: { count: number }) => a.count - b.count,
      sortOrder: sortOrder,
      onHeaderCell: () => ({
        onClick: () => {
          setSortOrder(sortOrder === "ascend" ? "descend" : "ascend");
        },
      }),
    },
  ];
  
  const sortedData = [...questionTypeList].sort((a, b) => {
    if (sortOrder === "ascend") return a.count - b.count;
    if (sortOrder === "descend") return b.count - a.count;
    return 0;
  });

  const renderChart = (chartType: "pie" | "bar" | "line") => {
    switch (chartType) {
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Collapse defaultActiveKey={[""]} expandIconPosition="end">
      <Panel header="Асуултууд" key="1">
        <Card>
          <style>
            {`
              .compact-table-row .ant-table-tbody > tr > td {
                padding: 8px !important;
                line-height: 1 !important;
              }
              .compact-table-row .ant-table-thead > tr > th {
                padding: 8px !important;
              }
            `}
          </style>
          <div className="flex flex-col gap-2">
            <Select
              value={viewMode}
              onChange={(value) =>
                setViewMode(value as "table" | "pie" | "bar" | "line")
              }
              className="w-32"
            >
              <Option value="table">Хүснэгт</Option>
              <Option value="pie">Дугуй диаграм</Option>
              <Option value="bar">Баганан диаграм</Option>
              <Option value="line">Шугаман диаргам</Option>
            </Select>
            {viewMode === "table" ? (
              <Table
                columns={columns}
                dataSource={sortedData}
                pagination={false}
                rowKey="type"
                className="mt-4 compact-table-row"
              />
            ) : (
              <div className="mt-4">{renderChart(viewMode)}</div>
            )}
            <p className="font-bold text-xl flex flex-row justify-between">
              <span>Нийт</span>
              <span>{data.questions.length}</span>
            </p>
          </div>
        </Card>
      </Panel>
    </Collapse>
  );
};

export default QuestionSummary;
