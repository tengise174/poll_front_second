"use client";
import { Card, Collapse, Table, Tag, Input, Select, Button, Space } from "antd";
import { useState } from "react";
import { PollData } from "./types";
import { SearchOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const { Option } = Select;

interface PollstersTableProps {
  data: PollData;
}

const PollstersTable = ({ data }: PollstersTableProps) => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getPollsterData = () => {
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

  // Filter data based on search and status
  const dataSource = getPollsterData();
  const filteredData = dataSource.filter((item) => {
    const matchesSearch = item.username
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "submitted" && item.status === "submitted") ||
      (statusFilter === "failed" && item.status === "failed") ||
      (statusFilter === "not_attended" && item.status === "not_attended");
    return matchesSearch && matchesStatus;
  });

  const pollsterColumns = [
    {
      title: "Хэрэглэгчийн нэр",
      dataIndex: "username",
      key: "username",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: {
        setSelectedKeys: (keys: React.Key[]) => void;
        selectedKeys: React.Key[];
        confirm: () => void;
        clearFilters?: () => void;
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
      onFilter: (value: any, record: any) =>
        record.username.toLowerCase().includes((value as string).toLowerCase()),
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
      filterDropdown: ({
        confirm,
        clearFilters,
      }: {
        confirm: () => void;
        clearFilters?: () => void;
      }) => (
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
            <Option value="not_attended">Оролцоогүй</Option>
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
      render: (text: number | null) => (text ? text.toFixed(2) : "-"),
      sorter: (a: any, b: any) => (a.takenTime || 0) - (b.takenTime || 0),
    },
  ];

  return (
    <Collapse defaultActiveKey={[""]} expandIconPosition="end">
      <Panel header="Уригдсан Оролцогчид" key="1">
        <Card>
          <Table
            columns={pollsterColumns}
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

export default PollstersTable;
