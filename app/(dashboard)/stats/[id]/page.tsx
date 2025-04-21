"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "antd";
import { getStatById } from "@/api/action";
import StatsHeader from "@/components/stats/StatsHeader";

import StatsDetails from "@/components/stats/StatsDetails";
import StatsSummary from "@/components/stats/StatsSummary";
import { ChartType, PollData } from "@/components/stats/types";
import QuestionSummary from "@/components/stats/QuestionSummary";
import ParticipantsTable from "@/components/stats/ParticipantsTable";
import PollstersTable from "@/components/stats/PollstersTable";
import QuestionCard from "@/components/stats/QuestionCard";

const StatsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<PollData | null>(null);
  const [chartTypes, setChartTypes] = useState<ChartType[]>([]);

  const {
    data: fetchedData,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["stat", id],
    queryFn: () => getStatById(id as string),
    enabled: !!id,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (fetchedData) {
      const sortedQuestions = [...fetchedData.questions].sort(
        (a, b) => a.order - b.order
      );
      setData({ ...fetchedData, questions: sortedQuestions });
      setChartTypes(sortedQuestions.map(() => "pie" as ChartType));
    }
  }, [fetchedData]);

  const handleChartTypeChange = (index: number, type: ChartType) => {
    const newChartTypes = [...chartTypes];
    newChartTypes[index] = type;
    setChartTypes(newChartTypes);
  };

  if (isFetching) {
    return <Skeleton />;
  }

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="p-6">
      {data && (
        <div className="flex flex-col gap-2">
          <div className="bg-second-bg rounded p-4">
            <StatsHeader data={data} />
            <StatsDetails data={data} />
            <StatsSummary data={data} />
            <QuestionSummary data={data} />
            <ParticipantsTable data={data} />
            {data.isAccessLevel && <PollstersTable data={data} />}
          </div>
          <div className="space-y-6">
            {data.questions.map((question, qIndex) => (
              <QuestionCard
                key={qIndex}
                question={question}
                chartType={chartTypes[qIndex]}
                onChartTypeChange={(type) => handleChartTypeChange(qIndex, type)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;