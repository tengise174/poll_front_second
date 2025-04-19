"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Checkbox,
  Skeleton,
  Typography,
  Input,
  Rate,
  Image,
} from "antd";
import { getAnsweredPollDetail } from "@/api/action";
import { dualColors } from "@/utils/utils";

const { TextArea } = Input;
const { Text } = Typography;

interface OptionsProps {
  id: string;
  content: string;
  poster?: string | null;
  points?: number;
  isCorrect?: boolean;
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
  isPointBased?: boolean;
  hasCorrectAnswer?: boolean;
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

  const calculateTotalPoints = (
    selectedOptions: OptionsProps[] | undefined,
    allOptions: OptionsProps[] | undefined
  ): number => {
    if (!selectedOptions || !allOptions) return 0;
    return selectedOptions.reduce((sum, selected) => {
      const option = allOptions.find((opt) => opt.id === selected.id);
      return sum + (option?.points || 0);
    }, 0);
  };

  const isUserAnswerCorrect = (
    selectedOptions: OptionsProps[] | undefined,
    allOptions: OptionsProps[] | undefined
  ): boolean => {
    if (!selectedOptions || !allOptions) return false;
    const correctOptionIds = allOptions
      .filter((opt) => opt.isCorrect)
      .map((opt) => opt.id);
    const selectedOptionIds = selectedOptions.map((opt) => opt.id);
    return (
      correctOptionIds.length === selectedOptionIds.length &&
      correctOptionIds.every((id) => selectedOptionIds.includes(id))
    );
  };

  const getCorrectAnswers = (
    allOptions: OptionsProps[] | undefined
  ): string => {
    if (!allOptions) return "";
    const correctOptions = allOptions
      .filter((opt) => opt.isCorrect)
      .map((opt) => opt.content);
    return correctOptions.length > 0
      ? correctOptions.join(", ")
      : "Зөв хариулт байхгүй";
  };

  return (
    <div className="w-200 flex flex-col items-center justify-center mx-auto">
      <div className="w-full font-bold">
        <h1>Асуулгын нэр: {answerDetails.poll.title}</h1>
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
          <Card
            key={question.questionId}
            title={
              <h2 className="mb-6">
                {index + 1}. {question.content}
              </h2>
            }
          >
            {question.poster && (
              <Image
                src={question.poster}
                height={150}
                style={{
                  width: "auto",
                }}
              />
            )}
            {question.questionType === "RATING" ? (
              <Rate
                defaultValue={
                  question.selectedOptions?.[0]?.content
                    ? Number(question.selectedOptions[0].content)
                    : 0
                }
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
                  const isCorrectOption = option.isCorrect;
                  return (
                    <div key={option.id} className="flex flex-col">
                      <Checkbox
                        checked={isChecked}
                        disabled
                        style={{ marginBottom: 8 }}
                        className="custom-checkbox"
                      >
                        <div className="flex flex-row items-center gap-2">
                          <p
                            className={`font-bold text-md ${
                              isCorrectOption ? "text-green-600" : ""
                            }`}
                          >
                            {option.content}
                            {question.isPointBased &&
                            option.points !== undefined
                              ? ` (${option.points} оноо)`
                              : ""}
                          </p>
                          {option.poster && (
                            <Image
                              src={option.poster}
                              height={100}
                              style={{
                                width: "auto",
                              }}
                            />
                          )}
                        </div>
                      </Checkbox>
                    </div>
                  );
                })}
                {question.hasCorrectAnswer && (
                  <div className="mt-4">
                    <Text strong>
                      Зөв хариулт: {getCorrectAnswers(question.allOptions)}
                    </Text>
                    <br />
                    <Text
                      type={
                        isUserAnswerCorrect(
                          question.selectedOptions,
                          question.allOptions
                        )
                          ? "success"
                          : "danger"
                      }
                    >
                      Таны хариулт:{" "}
                      {isUserAnswerCorrect(
                        question.selectedOptions,
                        question.allOptions
                      )
                        ? "Зөв"
                        : "Буруу"}
                    </Text>
                  </div>
                )}
                {question.isPointBased && (
                  <div className="mt-2">
                    <Text strong>
                      Нийт оноо:{" "}
                      {calculateTotalPoints(
                        question.selectedOptions,
                        question.allOptions
                      )}
                    </Text>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyAnswersDetail;
