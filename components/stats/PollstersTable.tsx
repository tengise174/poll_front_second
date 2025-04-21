"use client";
import { Card, Collapse, Table, Tag } from "antd";
import { PollData } from "./types";

const { Panel } = Collapse;

interface PollstersTableProps {
  data: PollData;
}

const PollstersTable = ({ data }: PollstersTableProps) => {
  const getPollsterData = () => {
    if (!data.isAccessLevel) return [];

    const submittedUserIds = new Set(data.submittedUsers.map((u) => u.id));
    const failedAttendeeUsernames = new Set(data.failedAttendees.map((a) => a.username));

    return data.pollsters.map((pollster) => {
      if (submittedUserIds.has(pollster.id)) {
        const submittedUser = data.submittedUsers.find((u) => u.id === pollster.id);
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

  return (
    <Collapse defaultActiveKey={["1"]} expandIconPosition="end">
      <Panel header="Уригдсан Оролцогчид" key="1">
        <Card>
          <Table
            columns={pollsterColumns}
            dataSource={getPollsterData()}
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