"use client";
import { Card, Collapse } from "antd";
import { PollData } from "./types";
import { calculateNetPoints, calculateUserStats } from "./utils";

const { Panel } = Collapse;

interface StatsSummaryProps {
  data: PollData;
}

const StatsSummary = ({ data }: StatsSummaryProps) => {
  const netPoints = calculateNetPoints(data);
  const summaryStats = data.submittedUsers.reduce(
    (acc, user) => {
      const { totalPoints, correctAnswers, percentage } = calculateUserStats(data, user);
      acc.totalPoints += totalPoints;
      acc.totalCorrectAnswers += correctAnswers;
      acc.totalPercentage += percentage;
      return acc;
    },
    { totalPoints: 0, totalCorrectAnswers: 0, totalPercentage: 0 }
  );

  return (
    <Collapse defaultActiveKey={["1"]} expandIconPosition="end">
      <Panel header="Асуулгын тойм" key="1">
        <div className="flex flex-row gap-2 w-full flex-wrap">
          <Card title="Оролцсон" className="flex-1 min-w-[150px]">
            <p className="font-bold text-xl text-end">{data.submittedUserCount}</p>
          </Card>
          <Card title="Амжаагүй" className="flex-1 min-w-[150px]">
            <p className="font-bold text-xl text-end">{data.failedAttendees.length}</p>
          </Card>
          <Card title="Дундаж хугацаа (с)" className="flex-1 min-w-[150px]">
            <p className="font-bold text-xl text-end">{data.avgPollTime.toFixed(2)}</p>
          </Card>
          <Card title="Нийт боломжит оноо" className="flex-1 min-w-[150px]">
            <p className="font-bold text-xl text-end">{netPoints}</p>
          </Card>
          <Card title="Дундаж оноо" className="flex-1 min-w-[150px]">
            <p className="font-bold text-xl text-end">
              {data.submittedUserCount
                ? (summaryStats.totalPoints / data.submittedUserCount).toFixed(2)
                : "0"}
            </p>
          </Card>
          <Card title="Дундаж % оноо" className="flex-1 min-w-[150px]">
            <p className="font-bold text-xl text-end">
              {data.submittedUserCount
                ? (summaryStats.totalPercentage / data.submittedUserCount).toFixed(2)
                : "0"}
            </p>
          </Card>
          <Card title="Зөв хариулт" className="flex-1 min-w-[150px]">
            <p className="font-bold text-xl text-end">
              {data.submittedUserCount
                ? (summaryStats.totalCorrectAnswers / data.submittedUserCount).toFixed(2)
                : "0"}
            </p>
          </Card>
        </div>
      </Panel>
    </Collapse>
  );
};

export default StatsSummary;