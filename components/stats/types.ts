"use client";

import { Category, QuestionTypes } from "@/utils/componentTypes";

export type ChartType = "pie" | "bar" | "line" | "donut" | "area";

export interface AnsweredByProp {
  username: string;
  count: number;
  timeTaken: number;
}

export interface PollOption {
  optionId: string;
  content: string;
  poster?: string | null;
  selectionCount: number;
  answeredBy: AnsweredByProp[];
  order: number;
  points: number;
  isCorrect: boolean;
  rowIndex?: number | null;
  columnIndex?: number | null;
}

export interface PollAnswer {
  textAnswer: string;
  answeredBy: string;
  createdAt: string;
  timeTaken: string;
}

export interface PollQuestion {
  questionId: string;
  content: string;
  questionType: QuestionTypes;
  avgTimeTaken: number;
  order: number;
  options?: PollOption[];
  answers?: PollAnswer[];
  poster?: string | null;
  isPointBased: boolean;
  hasCorrectAnswer: boolean;
  minAnswerCount?: number | null;
  gridRows?: string[];
  gridColumns?: string[];
}

export interface UserProp {
  id: string;
  username: string;
}

export interface SubmittedUserProp {
  id: string;
  username: string;
  totalTimeTaken: number;
}

export interface PollData {
  pollId: string;
  title: string;
  category: Category;
  createdAt: string;
  isAccessLevel: boolean;
  isDuration: boolean;
  duration: number | null;
  enterCode: number | null;
  isPollsterNumber: boolean;
  isHasEnterCode: boolean;
  isShowUser: boolean;
  startDate: string | null;
  endDate: string | null;
  status: "YET_OPEN" | "CLOSED" | "PULL" | "OPEN";
  submittedUserCount: number;
  pollsterNumber: number | null;
  avgPollTime: number;
  poster: string | null;
  questions: PollQuestion[];
  pollsters: UserProp[];
  submittedUsers: SubmittedUserProp[];
  failedAttendees: any[];
}

export const statusConv = {
  YET_OPEN: "Эхлээгүй",
  CLOSED: "Дууссан",
  PULL: "Дүүрсэн",
  OPEN: "Нээлттэй",
};
