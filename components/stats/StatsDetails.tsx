"use client";
import { Card, Descriptions, Tag } from "antd";
import { PollData, statusConv } from "./types";
import { useTranslation } from "react-i18next";

interface StatsDetailsProps {
  data: PollData;
}

const StatsDetails = ({ data }: StatsDetailsProps) => {
  const { t } = useTranslation();

  return (
    <Card title={t("stat.pollInfo")} className="mb-6">
      <Descriptions
        column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
        bordered
        size="middle"
        styles={{ label: { fontWeight: "bold" } }}
      >
        <Descriptions.Item label={t("stat.createdAt")}>
          {new Date(data.createdAt).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label={t("stat.status")}>
          {statusConv[data.status]}
        </Descriptions.Item>
        <Descriptions.Item label={t("stat.answeredUser")}>
          {data.submittedUserCount}
        </Descriptions.Item>
        <Descriptions.Item label={t("stat.startDate")}>
          {data.startDate
            ? new Date(data.startDate).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : `${t("stat.notSelected")}`}
        </Descriptions.Item>
        <Descriptions.Item label={t("stat.endDate")}>
          {data.endDate
            ? new Date(data.endDate).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : `${t("stat.notSelected")}`}
        </Descriptions.Item>
        <Descriptions.Item label={t("stat.isClosed")}>
          {data.isAccessLevel ? (
            <Tag color="green">{t("stat.yes")}</Tag>
          ) : (
            <Tag color="red">{t("stat.no")}</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label={t("stat.duration")}>
          {data.isDuration ? data.duration : "Сонгоогүй"}
        </Descriptions.Item>
        <Descriptions.Item label={t("stat.pollsterNumber")}>
          {data.isPollsterNumber ? data.pollsterNumber : "Сонгоогүй"}
        </Descriptions.Item>
        <Descriptions.Item label={t("stat.seeUsername")}>
          {data.isShowUser ? (
            <Tag color="green">{t("stat.yes")}</Tag>
          ) : (
            <Tag color="red">{t("stat.no")}</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label={t("stat.enterCode")}>
          {data.isHasEnterCode ? (
            data.enterCode
          ) : (
            <Tag color="red">{t("stat.not")}</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label={t("stat.category")}>
          {data.category ? (
            <Tag color="pink">{data.category}</Tag>
          ) : (
            <Tag color="red">{t("stat.other")}</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default StatsDetails;
