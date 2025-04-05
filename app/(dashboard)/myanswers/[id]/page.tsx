"use client";
import { getAnsweredPollDetail } from "@/api/action";
import { useQuery } from "@tanstack/react-query";
import { Button, Skeleton } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface QuestionProps {
  questionId: string;
  content: string;
  questionType: "MULTI_CHOICE" | "RATING" | "YES_NO" | "TEXT" | "SINGLE_CHOICE";
  selectedOptions?: { id: string; content: string }[];
  textAnswer?: string;
}

interface PollProps {
  id: string;
  title: string;
  themeId: number;
  startDate?: string;
  endDate?: string;
}

const MyAnswersDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [answerDetails, setAnswerDetails] = useState<{
    poll: PollProps;
    questions: QuestionProps[];
  }>({
    poll: {} as PollProps,
    questions: [],
  });

  const {
    data: fetchedAnswerDetails,
    isFetching: isFetchingAnswerDetails,
    isLoading: isLoadingAnswerDetails,
    error: answerDetailsError,
  } = useQuery({
    queryKey: ["myanswer", id],
    queryFn: () => getAnsweredPollDetail(id as string),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!id,
  });

  useEffect(() => {
    if (fetchedAnswerDetails) {
      setAnswerDetails(fetchedAnswerDetails);
    }
  }, [fetchedAnswerDetails]);

  const pushToId = (id: string) => {
    router.push(`/myanswers/${id}`);
  };

  if (isLoadingAnswerDetails || isFetchingAnswerDetails)
    return (
      <div>
        <Skeleton />
      </div>
    );

  if (answerDetailsError) {
    return (
      <div>
        <h1>Алдаа гарлаа</h1>
      </div>
    );
  }

  if(!answerDetails)

  return <div>bfdb</div>;
};

export default MyAnswersDetail;
