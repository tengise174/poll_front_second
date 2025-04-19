"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "antd";
import { getAnsweredPolls } from "@/api/action";
import PollCard from "@/components/PollCard";

const MyAnswersPage = () => {
  const router = useRouter();
  const [answeredPolls, setAnsweredPolls] = useState<any[]>([]);

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
      setAnsweredPolls(fetchedAnsweredPolls);
    }
  }, [fetchedAnsweredPolls]);

  const pushToId = (id: string) => {
    router.push(`/myanswers/${id}`);
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
    <div>
      {answeredPolls.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-5 gap-y-4 mt-5 justify-center">
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
    </div>
  );
};

export default MyAnswersPage;
