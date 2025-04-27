"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Layout, Skeleton, Radio } from "antd";
import { getStatById } from "@/api/action";
import StatsHeader from "@/components/stats/StatsHeader";
import StatsDetails from "@/components/stats/StatsDetails";
import StatsSummary from "@/components/stats/StatsSummary";
import { ChartType, PollData } from "@/components/stats/types";
import QuestionSummary from "@/components/stats/QuestionSummary";
import ParticipantsTable from "@/components/stats/ParticipantsTable";
import PollstersTable from "@/components/stats/PollstersTable";
import QuestionCard from "@/components/stats/QuestionCard";
import { Header, Content } from "antd/es/layout/layout";

const radioStyle = `
  .custom-radio .ant-radio-button-wrapper {
    background-color: #f5f5f5;
    color: #1f1f1f;
    border-color: #d9d9d9;
    transition: all 0.3s;
  }
  .custom-radio .ant-radio-button-wrapper:hover {
    background-color: #888;
    color: #ffffff;
  }
  .custom-radio .ant-radio-button-wrapper-checked {
    background-color: #000000 !important;
    color: #ffffff !important;
    border-color: #1677ff !important;
  }
  .custom-radio .ant-radio-button-wrapper-checked:hover {
    background-color: #333 !important;
    color: #ffffff !important;
  }
`;

const StatsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState<PollData | null>(null);
  const [chartTypes, setChartTypes] = useState<ChartType[]>([]);
  const [viewMode, setViewMode] = useState<"summary" | "question">("summary");

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
    <Layout>
      <style>{radioStyle}</style>
      <Header className="!bg-white shadow-md border-l border-0.5 border-[#D9D9D9] !h-[120]">
        <div className="flex justify-between items-center h-full">
          {data && <StatsHeader data={data} />}
          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="mr-4 custom-radio !flex !flex-row !gap-2"
          >
            <Radio.Button className="!rounded" value="summary">
              Ерөнхий
            </Radio.Button>
            <Radio.Button className="!rounded" value="question">
              Асуултууд
            </Radio.Button>
          </Radio.Group>
        </div>
      </Header>
      <Content className="overflow-y-auto">
        <div className="p-6">
          {data && (
            <div className="flex flex-col gap-2">
              {viewMode === "summary" && (
                <div className="rounded p-4 flex flex-col gap-2">
                  <StatsDetails data={data} />
                  <StatsSummary data={data} />
                  <QuestionSummary data={data} />
                  {data.isShowUser && <ParticipantsTable data={data} />}
                  {data.isAccessLevel && <PollstersTable data={data} />}
                </div>
              )}
              {viewMode === "question" && (
                <div className="flex flex-col gap-4 md:mx-20">
                  {data.questions.map((question, qIndex) => (
                    <QuestionCard
                      key={qIndex}
                      question={question}
                      chartType={chartTypes[qIndex]}
                      onChartTypeChange={(type) =>
                        handleChartTypeChange(qIndex, type)
                      }
                      isShowUser={data.isShowUser}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default StatsPage;
