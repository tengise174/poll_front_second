"use client";
import { Card, Collapse } from "antd";
import { PollData } from "./types";
import { calculateNetPoints, calculateUserStats } from "./utils";
import { useTranslation } from "react-i18next";

const { Panel } = Collapse;

interface StatsSummaryProps {
  data: PollData;
}

const StatsSummary = ({ data }: StatsSummaryProps) => {
  const { t } = useTranslation();

  const netPoints = calculateNetPoints(data);
  const summaryStats = data.submittedUsers.reduce(
    (acc, user) => {
      const { totalPoints, correctAnswers, percentage } = calculateUserStats(
        data,
        user
      );
      acc.totalPoints += totalPoints;
      acc.totalCorrectAnswers += correctAnswers;
      acc.totalPercentage += percentage;
      return acc;
    },
    { totalPoints: 0, totalCorrectAnswers: 0, totalPercentage: 0 }
  );

  return (
    <Collapse defaultActiveKey={[""]} expandIconPosition="end">
      <Panel header={t("stat.pollReview")} key="1">
        <div className="flex flex-row gap-2 w-full flex-wrap">
          <Card title={t("stat.participated")} className="flex-1 min-w-[150px]">
            <p className="font-bold text-xl text-end">
              {data.submittedUserCount}
            </p>
          </Card>
          <Card title={t("stat.cantSubmit")} className="flex-1 min-w-[150px]">
            <p className="font-bold text-xl text-end">
              {data.failedAttendees.length}
            </p>
          </Card>
          <Card title={t("stat.avgDuration")} className="flex-1 min-w-[150px]">
            <p className="font-bold text-xl text-end">
              {data.avgPollTime.toFixed(2)}
            </p>
          </Card>
          <Card title={t("stat.netPoint")} className="flex-1 min-w-[150px]">
            <p className="font-bold text-xl text-end">{netPoints}</p>
          </Card>
          <Card title={t("stat.avgPoint")} className="flex-1 min-w-[150px]">
            <p className="font-bold text-xl text-end">
              {data.submittedUserCount
                ? (summaryStats.totalPoints / data.submittedUserCount).toFixed(
                    2
                  )
                : "0"}
            </p>
          </Card>
          <Card title={t("stat.avgPointPerc")} className="flex-1 min-w-[150px]">
            <p className="font-bold text-xl text-end">
              {data.submittedUserCount
                ? (
                    summaryStats.totalPercentage / data.submittedUserCount
                  ).toFixed(2)
                : "0"}
            </p>
          </Card>
          <Card title={t("stat.correctAnswer")} className="flex-1 min-w-[150px]">
            <p className="font-bold text-xl text-end">
              {data.submittedUserCount
                ? (
                    summaryStats.totalCorrectAnswers / data.submittedUserCount
                  ).toFixed(2)
                : "0"}
            </p>
          </Card>
        </div>
      </Panel>
    </Collapse>
  );
};

export default StatsSummary;
