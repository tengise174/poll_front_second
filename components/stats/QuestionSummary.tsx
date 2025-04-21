"use client";
import { Card, Collapse } from "antd";
import { PollData, questionTypeTranslations } from "./types";

const { Panel } = Collapse;

interface QuestionSummaryProps {
  data: PollData;
}

const QuestionSummary = ({ data }: QuestionSummaryProps) => {
  const questionTypeCounts = data.questions.reduce((acc, question) => {
    acc[question.questionType] = (acc[question.questionType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const questionTypeList = Object.entries(questionTypeCounts).map(([type, count]) => ({
    type: questionTypeTranslations[type] || type,
    count,
  }));

  return (
    <Collapse defaultActiveKey={["1"]} expandIconPosition="end">
      <Panel header="Асуултууд" key="1">
        <Card>
          <div>
            <p className="font-bold text-xl flex flex-row justify-between">
              <span>Нийт</span>
              <span>{data.questions.length}</span>
            </p>
            <ul className="text-sm text-gray-600 mt-2">
              {questionTypeList.map((item) => (
                <li key={item.type} className="flex flex-row justify-between">
                  <span>{item.type} :</span>
                  <span>{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </Panel>
    </Collapse>
  );
};

export default QuestionSummary;