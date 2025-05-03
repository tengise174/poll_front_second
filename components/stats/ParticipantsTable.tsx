"use client";
import { Card, Collapse, Table, Tag, Input, Select, Button, Space } from "antd";
import { useState } from "react";
import { PollData } from "./types";
import { calculateUserStats } from "./utils";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Panel } = Collapse;
const { Option } = Select;

interface ParticipantsTableProps {
  data: PollData;
}

const ParticipantsTable = ({ data }: ParticipantsTableProps) => {
  const { t } = useTranslation();
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
      <Panel header={t("stat.pollsterInfo")} key="1">
        <Card>
          <Table
            columns={[
              {
                title: `${t("stat.username")}`,
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
                      placeholder={t("table.search")}
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
                        {t("table.search")}
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
                        {t("table.clear")}
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
                title: `${t("stat.status")}`,
                dataIndex: "status",
                key: "status",
                render: (text) =>
                  text === "submitted" ? (
                    <Tag color="green">{t("filter.answered")}</Tag>
                  ) : (
                    <Tag color="yellow">{t("filter.cantAnswered")}</Tag>
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
                      <Option value="all">{t("filter.all")}</Option>
                      <Option value="submitted">{t("filter.answered")}</Option>
                      <Option value="failed">{t("filter.cantAnswered")}</Option>
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
                      {t("table.clear")}
                    </Button>
                  </div>
                ),
                filterIcon: () => <SearchOutlined />,
              },
              {
                title: `${t("stat.takenTime")}`,
                dataIndex: "takenTime",
                key: "takenTime",
                render: (text) => (text ? text.toFixed(2) : "-"),
                sorter: (a, b) => (a.takenTime || 0) - (b.takenTime || 0),
              },
              {
                title: `${t("stat.netTakenPoint")}`,
                dataIndex: "totalPoints",
                key: "totalPoints",
                render: (text) => text ?? "0",
                sorter: (a, b) => a.totalPoints - b.totalPoints,
              },
              {
                title: `${t("stat.pointPerc")}`,
                dataIndex: "percentage",
                key: "percentage",
                render: (text) => (text ? text.toFixed(2) : "0.00"),
                sorter: (a, b) => a.percentage - b.percentage,
              },
              {
                title: `${t("stat.correctAnswer")}`,
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
