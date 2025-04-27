"use client";
import { Card, Collapse, Table, Tag, Input, Select, Button, Space } from "antd";
import { useState } from "react";
import { PollData } from "./types";
import { calculateUserStats } from "./utils";
import { SearchOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const { Option } = Select;

interface ParticipantsTableProps {
  data: PollData;
}

const ParticipantsTable = ({ data }: ParticipantsTableProps) => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const dataSource = [
    ...data.submittedUsers.map((user) => {
      const { totalPoints, correctAnswers, percentage } = calculateUserStats(
        data,
        user
      );
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
      username: attendee.username || `Хэрэглэгч ${index + 1}`,
      status: "failed",
      takenTime: null,
      totalPoints: 0,
      percentage: 0,
      correctAnswers: 0,
    })),
  ];

  const filteredData = dataSource.filter((item) => {
    const matchesSearch = item.username
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "submitted" && item.status === "submitted") ||
      (statusFilter === "failed" && item.status === "failed");
    return matchesSearch && matchesStatus;
  });

  return (
    <Collapse defaultActiveKey={[""]} expandIconPosition="end">
      <Panel header="Оролцогчдын мэдээлэл" key="1">
        <Card>
          <Table
            columns={[
              {
                title: "Хэрэглэгчийн нэр",
                dataIndex: "username",
                key: "username",
                filterDropdown: ({
                  setSelectedKeys,
                  selectedKeys,
                  confirm,
                  clearFilters,
                }) => (
                  <div style={{ padding: 8 }}>
                    <Input
                      placeholder="Хайх"
                      value={selectedKeys[0]}
                      onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                      }
                      onPressEnter={() => {
                        setSearchText((selectedKeys[0] as string) || "");
                        confirm();
                      }}
                      style={{ marginBottom: 8, display: "block" }}
                    />
                    <Space>
                      <Button
                        type="primary"
                        onClick={() => {
                          setSearchText((selectedKeys[0] as string) || "");
                          confirm();
                        }}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                      >
                        Хайх
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedKeys([]);
                          setSearchText("");
                          clearFilters && clearFilters();
                          confirm();
                        }}
                        size="small"
                        style={{ width: 90 }}
                      >
                        Цэвэрлэх
                      </Button>
                    </Space>
                  </div>
                ),
                filterIcon: () => <SearchOutlined />,
                onFilter: (value, record) =>
                  record.username
                    .toLowerCase()
                    .includes((value as string).toLowerCase()),
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
                filterDropdown: ({ confirm, clearFilters }) => (
                  <div style={{ padding: 8 }}>
                    <Select
                      value={statusFilter}
                      onChange={(value) => {
                        setStatusFilter(value);
                        confirm();
                      }}
                      style={{ width: 150, marginBottom: 8, display: "block" }}
                    >
                      <Option value="all">Бүгд</Option>
                      <Option value="submitted">Хариулсан</Option>
                      <Option value="failed">Амжаагүй</Option>
                    </Select>
                    <Button
                      onClick={() => {
                        setStatusFilter("all");
                        clearFilters && clearFilters();
                        confirm();
                      }}
                      size="small"
                      style={{ width: 90 }}
                    >
                      Цэвэрлэх
                    </Button>
                  </div>
                ),
                filterIcon: () => <SearchOutlined />,
              },
              {
                title: "Зарцуулсан хугацаа (с)",
                dataIndex: "takenTime",
                key: "takenTime",
                render: (text) => (text ? text.toFixed(2) : "-"),
                sorter: (a, b) => (a.takenTime || 0) - (b.takenTime || 0),
              },
              {
                title: "Нийт оноо",
                dataIndex: "totalPoints",
                key: "totalPoints",
                render: (text) => text ?? "0",
                sorter: (a, b) => a.totalPoints - b.totalPoints,
              },
              {
                title: "Онооны хувь (%)",
                dataIndex: "percentage",
                key: "percentage",
                render: (text) => (text ? text.toFixed(2) : "0.00"),
                sorter: (a, b) => a.percentage - b.percentage,
              },
              {
                title: "Зөв хариулт",
                dataIndex: "correctAnswers",
                key: "correctAnswers",
                render: (text) => text ?? "0",
                sorter: (a, b) => a.correctAnswers - b.correctAnswers,
              },
            ]}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
            bordered
            size="middle"
          />
        </Card>
      </Panel>
    </Collapse>
  );
};

export default ParticipantsTable;
