"use client";
import { Card, Collapse, Table, Tag } from "antd";
import { PollData } from "./types";
import { calculateUserStats } from "./utils";

const { Panel } = Collapse;

interface ParticipantsTableProps {
  data: PollData;
}

const ParticipantsTable = ({ data }: ParticipantsTableProps) => {
  return (
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
                const { totalPoints, correctAnswers, percentage } = calculateUserStats(data, user);
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
            ]}
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