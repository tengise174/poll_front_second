"use client";
import { Image, Button } from "antd";
import * as XLSX from "xlsx";
import { PollData, statusConv } from "./types";
import { calculateNetPoints, calculateUserStats } from "./utils";
import { questionTypeTranslations } from "@/utils/utils";

interface StatsHeaderProps {
  data: PollData;
}

const StatsHeader = ({ data }: StatsHeaderProps) => {
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const netPoints = calculateNetPoints(data);

    const generalInfo = [
      ["Асуулга нэр", data.title],
      ["Үүссэн огноо", new Date(data.createdAt).toLocaleString()],
      ["Төлөв", statusConv[data.status]],
      ["Оролцсон тоо", data.submittedUserCount],
      ["Дундаж хариулах хугацаа", data.avgPollTime.toFixed(2)],
      ["Авч болох нийт оноо", netPoints],
      [
        "Эхлэх хугацаа",
        data.startDate ? new Date(data.startDate).toLocaleString() : "Байхгүй",
      ],
      [
        "Дуусах хугацаа",
        data.endDate ? new Date(data.endDate).toLocaleString() : "Байхгүй",
      ],
      ["Хандалтын түвшин", data.isAccessLevel ? "Хаалттай" : "Нээлттэй"],
      ["Хугацаа", data.isDuration ? data.duration : "Байхгүй"],
      [
        "Оролцогчийн тоо",
        data.isPollsterNumber ? data.pollsterNumber : "Байхгүй",
      ],
    ];

    const wsGeneral = XLSX.utils.aoa_to_sheet(generalInfo);
    XLSX.utils.book_append_sheet(wb, wsGeneral, "Poll Info");

    const questionHeaders = [
      "Асуулт",
      "Төрөл",
      "Оноотой асуулт?",
      "Зөв хариутай?",
      "Дундаж хугацаа",
      "Хариулт",
      "Оноо",
      "Зөв эсэх",
      "Хариулсан тоо",
      ...(data.isShowUser ? ["Хариулсан оролцогч"] : []),
    ];

    const questionData: any[] = [];
    const merges: {
      s: { r: number; c: number };
      e: { r: number; c: number };
    }[] = [];

    data.questions.forEach((question) => {
      if (question.questionType === "TEXT" && question.answers) {
        question.answers.forEach((answer) => {
          questionData.push([
            question.content,
            questionTypeTranslations[question.questionType],
            question.isPointBased ? "Тийм" : "Үгүй",
            question.hasCorrectAnswer ? "Тийм" : "Үгүй",
            question.avgTimeTaken.toFixed(2),
            answer.textAnswer,
            "-",
            "-",
            "-",
            ...(data.isShowUser ? [answer.answeredBy] : []),
          ]);
        });
      } else if (question.options) {
        const startRow = questionData.length + 1;
        question.options.forEach((option, idx) => {
          questionData.push([
            idx === 0 ? question.content : "",
            idx === 0 ? questionTypeTranslations[question.questionType] : "",
            idx === 0 ? (question.isPointBased ? "Тийм" : "Үгүй") : "",
            idx === 0 ? (question.hasCorrectAnswer ? "Тийм" : "Үгүй") : "",
            idx === 0 ? question.avgTimeTaken.toFixed(2) : "",
            option.content,
            option.points,
            option.isCorrect ? "Тийм" : "Үгүй",
            option.selectionCount,
            ...(data.isShowUser
              ? [option.answeredBy.map((u) => u.username).join(", ")]
              : []),
          ]);
        });
        const endRow = questionData.length;
        if (question.options.length > 1) {
          merges.push(
            { s: { r: startRow, c: 0 }, e: { r: endRow, c: 0 } },
            { s: { r: startRow, c: 1 }, e: { r: endRow, c: 1 } },
            { s: { r: startRow, c: 2 }, e: { r: endRow, c: 2 } },
            { s: { r: startRow, c: 3 }, e: { r: endRow, c: 3 } },
            { s: { r: startRow, c: 4 }, e: { r: endRow, c: 4 } },
            { s: { r: startRow, c: 5 }, e: { r: endRow, c: 5 } }
          );
        }
      }
    });

    const wsQuestions = XLSX.utils.aoa_to_sheet([
      questionHeaders,
      ...questionData,
    ]);
    wsQuestions["!merges"] = merges;
    XLSX.utils.book_append_sheet(wb, wsQuestions, "Questions");

    if (data.isShowUser) {
      const userHeaders = [
        "Хэрэглэгч нэр",
        "Зарцуулсан хугацаа",
        "Нийт оноо",
        "Онооны хувь (%)",
        "Зөв хариулсан тоо",
      ];
      const userData = data.submittedUsers.map((user) => {
        const { totalPoints, correctAnswers, percentage } = calculateUserStats(
          data,
          user
        );
        return [
          user.username,
          user.totalTimeTaken,
          totalPoints,
          percentage.toFixed(2),
          correctAnswers,
        ];
      });
      const wsUsers = XLSX.utils.aoa_to_sheet([userHeaders, ...userData]);
      XLSX.utils.book_append_sheet(wb, wsUsers, "Submitted Users");

      const userAnswerHeaders = [
        "Хэрэглэгч нэр",
        "Асуулт",
        "Асуултын төрөл",
        "Хариулт",
        "Авсан оноо",
        "Зөв эсэх",
        "Зарцуулсан хугацаа",
      ];

      const userAnswerData: any[] = [];
      const userAnswerMerges: {
        s: { r: number; c: number };
        e: { r: number; c: number };
      }[] = [];

      data.submittedUsers.forEach((user) => {
        const startRow = userAnswerData.length + 1;
        data.questions.forEach((question) => {
          let selectedOptions: string[] = [];
          let pointsEarned = 0;
          let isCorrect = "-";
          let timeTaken: number | null = null;

          if (question.questionType === "TEXT" && question.answers) {
            const userAnswer = question.answers.find(
              (answer) => answer.answeredBy === user.username
            );
            if (userAnswer) {
              selectedOptions = [userAnswer.textAnswer];
              timeTaken = parseFloat(userAnswer.timeTaken) || null;
            }
          } else if (question.options) {
            question.options.forEach((option) => {
              const userResponse = option.answeredBy.find(
                (ans) => ans.username === user.username
              );
              if (userResponse) {
                selectedOptions.push(option.content);
                pointsEarned += option.points;
                timeTaken = timeTaken || userResponse.timeTaken;
                if (question.hasCorrectAnswer && option.isCorrect) {
                  isCorrect = "Yes";
                } else if (question.hasCorrectAnswer) {
                  isCorrect = isCorrect === "Yes" ? "Тийм" : "Үгүй";
                }
              }
            });
          }

          userAnswerData.push([
            userAnswerData.length === startRow - 1 ? user.username : "",
            question.content,
            questionTypeTranslations[question.questionType],
            selectedOptions.length > 0 ? selectedOptions.join(", ") : "Хариу байхгүй",
            pointsEarned,
            isCorrect,
            timeTaken !== null ? timeTaken.toFixed(2) : "-",
          ]);
        });
        const endRow = userAnswerData.length;
        if (data.questions.length > 0) {
          userAnswerMerges.push({
            s: { r: startRow, c: 0 },
            e: { r: endRow, c: 0 },
          });
        }
      });

      const wsUserAnswers = XLSX.utils.aoa_to_sheet([
        userAnswerHeaders,
        ...userAnswerData,
      ]);
      wsUserAnswers["!merges"] = userAnswerMerges;
      XLSX.utils.book_append_sheet(wb, wsUserAnswers, "User Answers");
    }

    XLSX.writeFile(wb, `${data.title}_stats.xlsx`);
  };

  return (
    <div className="flex flex-row gap-4 items-center pt-2">
      <Image
        src={
          data.poster ||
          "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        }
        alt="poster"
        style={{
          width: "auto",
        }}
        height={100}
      />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-800">{data.title}</h1>
        <Button type="primary" onClick={exportToExcel}>
          Export to Excel
        </Button>
      </div>
    </div>
  );
};

export default StatsHeader;