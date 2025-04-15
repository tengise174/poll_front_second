"use client";
import { getAnsweredPollDetail } from "@/api/action";
import { dualColors } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Checkbox,
  Skeleton,
  Typography,
  Input,
  Rate,
  Image,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { TextArea } = Input;

interface OptionsProps {
  id: string;
  content: string;
  poster?: string | null;
}

interface QuestionProps {
  questionId: string;
  content: string;
  questionType: "MULTI_CHOICE" | "RATING" | "YES_NO" | "TEXT" | "SINGLE_CHOICE";
  rateNumber: number;
  rateType: "STAR" | "NUMBER";
  allOptions?: OptionsProps[];
  selectedOptions?: OptionsProps[];
  textAnswer?: string;
  poster?: string | null;
}

interface PollProps {
  id: string;
  title: string;
  greetingMessage: string;
  themeId: number;
  startDate?: string;
  endDate?: string;
  poster?: string | null;
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
  const [custStyle, setCustStyle] = useState<{
    backgroundColor: string;
    primaryColor: string;
  }>({ backgroundColor: "#FDFDFD", primaryColor: "#2C2C2C" });

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

  useEffect(() => {
    if (answerDetails && answerDetails?.poll.themeId) {
      setCustStyle({
        backgroundColor: dualColors[answerDetails?.poll.themeId][0],
        primaryColor: dualColors[answerDetails?.poll.themeId][1],
      });
    }
  }, [answerDetails]);

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

  if (!answerDetails) return <div>Алдаа гарсан</div>;

  return (
    <div
      className="w-full flex flex-col items-center justify-center"
      style={{
        backgroundColor: custStyle.backgroundColor,
      }}
    >
      <div>
        <h1>Асуулга: {answerDetails.poll.title}</h1>
        <p>Тайлбар: {answerDetails.poll.greetingMessage}</p>
        {answerDetails.poll.poster && (
          <Image
            src={
              answerDetails.poll.poster ||
              "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            }
            alt="poster"
            width={200}
            height={200}
          />
        )}
      </div>
      <div className="flex flex-col gap-4 w-full">
        {answerDetails.questions.map((question, index) => (
          <Card key={question.questionId}>
            <h2 className="mb-6">
              {index + 1}. {question.content}
            </h2>
            {question.poster && (
              <Image
                src={question.poster}
                height={100}
                style={{
                  width: "auto",
                }}
              />
            )}
            {question.questionType === "RATING" ? (
              <Rate
                defaultValue={Number(question.selectedOptions?.[0].content)}
                count={question.rateNumber}
                disabled
                character={
                  question.rateType === "NUMBER"
                    ? ({ index = 0 }) => index + 1
                    : undefined
                }
              />
            ) : question.questionType === "TEXT" ? (
              <TextArea
                value={question.textAnswer}
                readOnly
                rows={4}
                style={{ marginTop: 8 }}
              />
            ) : (
              <div className="flex flex-col">
                {question.allOptions?.map((option) => {
                  const isChecked = question.selectedOptions?.some(
                    (selected) => selected.id === option.id
                  );
                  return (
                    <Checkbox
                      key={option.id}
                      checked={isChecked}
                      disabled
                      style={{ marginBottom: 8 }}
                      className="custom-checkbox"
                    >
                      <div className="flex flex-row items-center gap-2">
                        {option.content}
                        <Image
                          src={option.poster || ""}
                          height={100}
                          style={{
                            width: "auto",
                          }}
                        />
                      </div>
                    </Checkbox>
                  );
                })}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyAnswersDetail;
