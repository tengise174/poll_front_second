"use client";
import { Card, Descriptions, Tag } from "antd";
import { PollData, statusConv } from "./types";

interface StatsDetailsProps {
  data: PollData;
}

const StatsDetails = ({ data }: StatsDetailsProps) => {
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

export default StatsDetails;