"use client";
import { getStatById } from "@/api/action";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const StatsPage = () => {
  const { id } = useParams();

  const [data, setData] = useState<any>(null);

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
      setData(fetchedData);
    }
  }, [fetchedData]);

  if (isFetching) {
    return <Skeleton />;
  }

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <div>
      {data && (
        <div>
          <p>Title: {data.title}</p>
          <div>
            {data.questions.map((question: any, index: number) => (
              <div key={index} className="m-6 bg-second-gray rounded">
                <p>Question: {question.content}</p>
                {question.options
                  ? question.options.map((option: any, index: number) => (
                      <div key={index}>
                        <p>Option: {option.content}</p>
                        <p>Votes: {option.selectionCount}</p>
                      </div>
                    ))
                  : question.answers.map((answer: any, index: number) => (
                      <div key={index}>
                        <p>Option: {answer.textAnswer}</p>
                        <p>Votes: {answer.answeredBy}</p>
                      </div>
                    ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
