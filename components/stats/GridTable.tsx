"use client";
import { Table } from "antd";
import { PollOption, PollQuestion } from "./types";

interface GridTableProps {
  question: PollQuestion;
}

const GridTable = ({ question }: GridTableProps) => {
  const prepareGridTableData = () => {
    if (
      (question.questionType !== "MULTIPLE_CHOICE_GRID" && question.questionType !== "TICK_BOX_GRID") ||
      !question.gridRows ||
      !question.gridColumns ||
      !question.options
    ) {
      return [];
    }

    const optionMap: { [row: number]: { [col: number]: PollOption } } = {};
    question.options.forEach((option) => {
      if (option.rowIndex !== null && option.columnIndex !== null) {
        if (option.rowIndex !== undefined && !optionMap[option.rowIndex]) {
          optionMap[option.rowIndex] = {};
        }
        if (option.rowIndex !== undefined && option.columnIndex !== undefined) {
          optionMap[option.rowIndex][option.columnIndex] = option;
        }
      }
    });

    return question.gridRows.map((rowLabel, rowIndex) => {
      const rowData: { [key: string]: any } = {
        key: `row-${rowIndex}`,
        rowLabel,
      };
      question.gridColumns?.forEach((colLabel, colIndex) => {
        const option = optionMap[rowIndex]?.[colIndex];
        rowData[`col-${colIndex}`] = option
          ? {
              selectionCount: option.selectionCount,
              answeredBy: option.answeredBy.map((user) => user.username).join(", ") || "No users",
            }
          : { selectionCount: 0, answeredBy: "No users" };
      });
      return rowData;
    });
  };

  const getGridTableColumns = (gridColumns: string[]) => {
    return [
      {
        title: "Row",
        dataIndex: "rowLabel",
        key: "rowLabel",
        fixed: "left" as const,
        width: 150,
      },
      ...gridColumns.map((colLabel, colIndex) => ({
        title: colLabel,
        dataIndex: `col-${colIndex}`,
        key: `col-${colIndex}`,
        render: (value: { selectionCount: number; answeredBy: string }) => (
          <div>
            <p>
              <strong>Count:</strong> {value.selectionCount}
            </p>
            <p>
              <strong>Users:</strong> {value.answeredBy}
            </p>
          </div>
        ),
      })),
    ];
  };

  return (
    <Table
      columns={getGridTableColumns(question.gridColumns || [])}
      dataSource={prepareGridTableData()}
      rowKey="key"
      pagination={false}
      bordered
      size="middle"
      scroll={{ x: "max-content" }}
    />
  );
};

export default GridTable;