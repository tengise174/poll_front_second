"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Input, Layout, Radio, Skeleton, Space } from "antd";
import { getAnsweredPolls } from "@/api/action";
import PollCard from "@/components/PollCard";

const { Header, Content } = Layout;

const MyAnswersPage = () => {
  const router = useRouter();
  const [answeredPolls, setAnsweredPolls] = useState<any[]>([]);
  const [filter, setFilter] = useState<
    "all" | "answered" | "notAnswered" | "recent"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: fetchedAnsweredPolls,
    isFetching,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myanswers"],
    queryFn: () => getAnsweredPolls(),
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (fetchedAnsweredPolls) {
      let filteredPolls = [...fetchedAnsweredPolls];

      if (searchTerm) {
        filteredPolls = filteredPolls.filter((poll) =>
          poll.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filter === "answered") {
        filteredPolls = filteredPolls.filter((poll) => poll.hasAnswers);
      } else if (filter === "notAnswered") {
        filteredPolls = filteredPolls.filter((poll) => !poll.hasAnswers);
      }

      if (filter === "recent") {
        filteredPolls = filteredPolls.sort((a, b) => {
          const dateA = a.answeredAt ? new Date(a.answeredAt).getTime() : 0;
          const dateB = b.answeredAt ? new Date(b.answeredAt).getTime() : 0;
          return dateB - dateA;
        });
      }

      setAnsweredPolls(filteredPolls);
    }
  }, [fetchedAnsweredPolls, filter, searchTerm]);

  const pushToId = (id: string) => {
    router.push(`/myanswers/${id}`);
  };

  const handleFilterChange = (e: any) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading || isFetching)
    return (
      <div>
        <Skeleton />
      </div>
    );

  if (error) {
    return (
      <div>
        <h1>Алдаа гарлаа</h1>
      </div>
    );
  }

  return (
    <Layout>
      <Header className="!bg-white shadow-md border-l border-0.5 border-[#D9D9D9]">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
          <Radio.Group
            value={filter}
            onChange={handleFilterChange}
            buttonStyle="solid"
            className="!flex !flex-row !gap-2"
          >
            <Radio.Button className="!rounded" value="all">
              Бүгд
            </Radio.Button>
            <Radio.Button className="!rounded" value="answered">
              Хариулсан
            </Radio.Button>
            <Radio.Button className="!rounded" value="notAnswered">
              Амжаагүй
            </Radio.Button>
            <Radio.Button className="!rounded" value="recent">
              Сүүлд хариулсан
            </Radio.Button>
          </Radio.Group>
          <Input.Search
            placeholder="Судалгааны гарчиг хайх"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      </Header>
      <Content
        className="overflow-y-auto p-4"
      >
        {answeredPolls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-5 gap-y-4 justify-center">
            {answeredPolls.map((poll: any, index: number) => (
              <PollCard
                key={index}
                {...poll}
                cardType="ANSWER"
                pushToId={pushToId}
              />
            ))}
          </div>
        ) : (
          <div>Танд оролцсон судалгаа байхгүй байна</div>
        )}
      </Content>
    </Layout>
  );
};

export default MyAnswersPage;
