"use client";
import { Table, Input, Button, Space, Modal } from "antd";
import { PollOption, PollQuestion } from "./types";
import { SearchOutlined } from "@ant-design/icons";
import { Key, useState } from "react";
import { useTranslation } from "react-i18next";
import { ColumnsType } from "antd/es/table";

interface GridTableProps {
  question: PollQuestion;
  isShowUser: boolean;
}

const GridTable = ({ question, isShowUser }: GridTableProps) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string[]>([]);
  const [modalSearchText, setModalSearchText] = useState("");

  const MAX_USERNAMES = 3;

  const prepareGridTableData = () => {
    if (
      (question.questionType !== "MULTIPLE_CHOICE_GRID" &&
        question.questionType !== "TICK_BOX_GRID") ||
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
              answeredBy: option.answeredBy,
              displayText: isShowUser
                ? option.answeredBy.length > MAX_USERNAMES
                  ? `${option.answeredBy
                      .slice(0, MAX_USERNAMES)
                      .map((user) => user.username)
                      .join(", ")} (...)`
                  : option.answeredBy.map((user) => user.username).join(", ") ||
                    "No users"
                : "",
            }
          : { selectionCount: 0, answeredBy: [], displayText: "" };
      });
      return rowData;
    });
  };

  const getGridTableColumns = (gridColumns: string[]) => {
    return [
      {
        title: "",
        dataIndex: "rowLabel",
        key: "rowLabel",
        fixed: "left" as const,
        width: 150,
      },
      ...gridColumns.map((colLabel, colIndex) => ({
        title: colLabel,
        dataIndex: `col-${colIndex}`,
        key: `col-${colIndex}`,
        render: (value: {
          selectionCount: number;
          answeredBy: { username: string; timeTaken: number }[];
          displayText: string;
        }) => {
          const isHighlighted =
            isShowUser &&
            searchText &&
            value.answeredBy.some((user) =>
              user.username.toLowerCase().includes(searchText.toLowerCase())
            );
          const hasMore = isShowUser && value.answeredBy.length > MAX_USERNAMES;
          return (
            <div
              style={{
                backgroundColor: isHighlighted ? "#e6f7ff" : "transparent",
                padding: "8px",
                borderRadius: "4px",
                transition: "background-color 0.3s",
                cursor: hasMore ? "pointer" : "default",
              }}
              onClick={() => {
                if (hasMore) {
                  setModalContent(
                    value.answeredBy.map((user) => user.username)
                  );
                  setIsModalVisible(true);
                }
              }}
            >
              <p>
                <strong>{t("stat.optionCount")}:</strong> {value.selectionCount}
              </p>
              {isShowUser && (
                <p>
                  <strong>{t("stat.pollsters")}:</strong> {value.displayText}
                </p>
              )}
            </div>
          );
        },
      })),
    ];
  };

  const modalColumns: ColumnsType<{ username: string }> = [
    {
      title: `${t("stat.pollsters")}`,
      dataIndex: "username",
      key: "username",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: {
        setSelectedKeys: (keys: React.Key[]) => void;
        selectedKeys: React.Key[];
        confirm: () => void;
        clearFilters?: () => void;
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={t("stat.searchUsername")}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => {
              setModalSearchText((selectedKeys[0] as string) || "");
              confirm();
            }}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setModalSearchText((selectedKeys[0] as string) || "");
                confirm();
              }}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              {t("table.search")}
            </Button>
            <Button
              onClick={() => {
                setSelectedKeys([]);
                setModalSearchText("");
                clearFilters && clearFilters();
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              {t("table.clear")}
            </Button>
          </Space>
        </div>
      ),
      filterIcon: () => <SearchOutlined />,
      onFilter: (value: boolean | Key, record: { username: string }) =>
        record.username.toLowerCase().includes(String(value).toLowerCase()),
    },
  ];

  const modalDataSource = modalContent.map((username) => ({ username }));

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
  };

  return (
    <div>
      {isShowUser && (
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input
              placeholder={t("stat.searchUsername")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
              onPressEnter={() => handleSearch(searchText)}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleSearch(searchText)}
            >
              {t("table.search")}
            </Button>
            <Button onClick={handleReset}>{t("table.clear")}</Button>
          </Space>
        </div>
      )}
      <Table
        columns={getGridTableColumns(question.gridColumns || [])}
        dataSource={prepareGridTableData()}
        rowKey="key"
        pagination={false}
        bordered
        size="middle"
        scroll={{ x: "max-content" }}
      />
      {isShowUser && (
        <Modal
          title={t("allPollsters")}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Хаах
            </Button>,
          ]}
          width={600}
        >
          <Table
            columns={modalColumns}
            dataSource={modalDataSource}
            rowKey={(record) => record.username}
            pagination={{ pageSize: 10 }}
            bordered
            size="middle"
            locale={{ emptyText: t("stat.noPollster") }}
          />
        </Modal>
      )}
    </div>
  );
};

export default GridTable;
