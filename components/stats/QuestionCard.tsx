"use client";
import {
  Image,
  Table,
  Tag,
  Collapse,
  Input,
  Button,
  Space,
  Select,
  Modal,
} from "antd";
import { ResponsiveContainer } from "recharts";
import ChartSelector from "./ChartSelector";
import GridTable from "./GridTable";
import { PollQuestion, ChartType, PollOption } from "./types";
import { renderChart } from "./utils";
import { SearchOutlined } from "@ant-design/icons";
import { useState, Key } from "react";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";

interface QuestionCardProps {
  question: PollQuestion;
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  isShowUser: boolean;
}

const { Panel } = Collapse;
const { Option } = Select;

const QuestionCard = ({
  question,
  chartType,
  onChartTypeChange,
  isShowUser,
}: QuestionCardProps) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [displayMode, setDisplayMode] = useState<"table" | "chart" | "both">(
    "both"
  );
  const [answerSearchText, setAnswerSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<string[]>([]);
  const [modalSearchText, setModalSearchText] = useState("");

  const MAX_USERNAMES = 3;

  const optionColumns: ColumnsType<PollOption> = [
    {
      title: `${t("stat.option")}`,
      dataIndex: "content",
      key: "content",
      render: (text: string, record: PollOption) => (
        <div className="flex items-center gap-2">
          {record.poster && (
            <Image
              src={record.poster}
              height={40}
              style={{ width: "auto", borderRadius: "4px" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              alt={`Option ${text} poster`}
            />
          )}
          <span>{text}</span>
          {record.isCorrect && <Tag color="green">Correct</Tag>}
          {record.points > 0 && <Tag color="blue">{record.points} points</Tag>}
        </div>
      ),
    },
    {
      title: `${t("stat.optionCount")}`,
      dataIndex: "selectionCount",
      key: "selectionCount",
      render: (selectionCount: number) => <span>{selectionCount ?? 0}</span>,
      sorter: (a: PollOption, b: PollOption) =>
        (a.selectionCount ?? 0) - (b.selectionCount ?? 0),
    },
    ...(isShowUser
      ? [
          {
            title: `${t("stat.pollsters")}`,
            dataIndex: "answeredBy",
            key: "answeredBy",
            render: (answeredBy: { username: string; timeTaken: number }[]) => {
              const displayText =
                answeredBy.length > MAX_USERNAMES
                  ? `${answeredBy
                      .slice(0, MAX_USERNAMES)
                      .map((user) => user.username)
                      .join(", ")} (...)`
                  : answeredBy.map((user) => user.username).join(", ") ||
                    "No users";
              const isHighlighted =
                searchText &&
                answeredBy.some((user) =>
                  user.username.toLowerCase().includes(searchText.toLowerCase())
                );
              const hasMore = answeredBy.length > MAX_USERNAMES;
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
                      setModalContent(answeredBy.map((user) => user.username));
                      setIsModalVisible(true);
                    }
                  }}
                >
                  {displayText}
                </div>
              );
            },
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
                    setSearchText((selectedKeys[0] as string) || "");
                    confirm();
                  }}
                  style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      setSearchText((selectedKeys[0] as string) || "");
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
                      setSearchText("");
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
            onFilter: (value: boolean | Key, record: PollOption) =>
              record.answeredBy.some((user) =>
                user.username
                  .toLowerCase()
                  .includes(String(value).toLowerCase())
              ),
          },
        ]
      : []),
  ];

  const answerColumns: ColumnsType<{ answeredBy: string; textAnswer: string }> =
    isShowUser
      ? [
          {
            title: `${t("stat.pollsters")}`,
            dataIndex: "answeredBy",
            key: "answeredBy",
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
                  placeholder={t("stat.seachUsername")}
                  value={selectedKeys[0]}
                  onChange={(e) =>
                    setSelectedKeys(e.target.value ? [e.target.value] : [])
                  }
                  onPressEnter={() => {
                    setAnswerSearchText((selectedKeys[0] as string) || "");
                    confirm();
                  }}
                  style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      setAnswerSearchText((selectedKeys[0] as string) || "");
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
                      setAnswerSearchText("");
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
            onFilter: (value: boolean | Key, record: { answeredBy: string }) =>
              record.answeredBy
                .toLowerCase()
                .includes(String(value).toLowerCase()),
          },
          {
            title: `${t("stat.answer")}`,
            dataIndex: "textAnswer",
            key: "textAnswer",
            render: (text: string) => {
              if (question.questionType === "DATE") {
                return new Date(text).toLocaleDateString("mn-MN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              }
              if (question.questionType === "TIME") {
                return new Date(`2000-01-01T${text}:00`).toLocaleTimeString(
                  "mn-MN",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false,
                  }
                );
              }
              return text;
            },
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
                  placeholder={t("stat.seachAnswer")}
                  value={selectedKeys[0]}
                  onChange={(e) =>
                    setSelectedKeys(e.target.value ? [e.target.value] : [])
                  }
                  onPressEnter={() => {
                    setAnswerSearchText((selectedKeys[0] as string) || "");
                    confirm();
                  }}
                  style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      setAnswerSearchText((selectedKeys[0] as string) || "");
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
                      setAnswerSearchText("");
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
            onFilter: (value: boolean | Key, record: { textAnswer: string }) =>
              record.textAnswer
                .toLowerCase()
                .includes(String(value).toLowerCase()),
          },
        ]
      : [
          {
            title: `${t("stat.answer")}`,
            dataIndex: "textAnswer",
            key: "textAnswer",
            render: (text: string) => {
              if (question.questionType === "DATE") {
                return new Date(text).toLocaleDateString("mn-MN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              }
              if (question.questionType === "TIME") {
                return new Date(`2000-01-01T${text}:00`).toLocaleTimeString(
                  "mn-MN",
                  {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: false,
                  }
                );
              }
              return text;
            },
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
                  placeholder={t("stat.seachAnswer")}
                  value={selectedKeys[0]}
                  onChange={(e) =>
                    setSelectedKeys(e.target.value ? [e.target.value] : [])
                  }
                  onPressEnter={() => {
                    setAnswerSearchText((selectedKeys[0] as string) || "");
                    confirm();
                  }}
                  style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      setAnswerSearchText((selectedKeys[0] as string) || "");
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
                      setAnswerSearchText("");
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
            onFilter: (value: boolean | Key, record: { textAnswer: string }) =>
              record.textAnswer
                .toLowerCase()
                .includes(String(value).toLowerCase()),
          },
        ];

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

  const dataSource = [...(question.options || [])].sort(
    (a, b) => a.order - b.order
  );

  const filteredData = dataSource.filter((option) => {
    const matchesSearch = searchText
      ? option.answeredBy.some((user) =>
          user.username.toLowerCase().includes(searchText.toLowerCase())
        )
      : true;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "hasUsers" && option.answeredBy.length > 0) ||
      (statusFilter === "noUsers" && option.answeredBy.length === 0);
    return matchesSearch && matchesStatus;
  });

  const modalDataSource = modalContent.map((username) => ({ username }));

  const renderTextOrDateContent = () => (
    <div className="p-6 rounded-lg">
      <div className="mb-4">
        <p className="text-gray-600">
          <span className="font-medium">{t("stat.avgTimeTaken")}: </span>
          {question.avgTimeTaken.toFixed(2)} {t("stat.second")}
        </p>
      </div>
      <h3 className="text-lg font-medium text-gray-600 mb-2">
        {t("stat.pollstersAnswer")}
      </h3>
      {question.answers && question.answers.length > 0 ? (
        <Table
          columns={answerColumns}
          dataSource={question.answers}
          rowKey={(record) => record.answeredBy}
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
        />
      ) : (
        <p className="text-gray-600">{t("stat.noAnswer")}</p>
      )}
    </div>
  );

  const renderGridContent = () => (
    <div className="p-6 rounded-lg">
      <div className="mb-4">
        <p className="text-gray-600">
          <span className="font-medium">{t("stat.avgTimeTaken")}: </span>
          {question.avgTimeTaken.toFixed(2)} {t("stat.second")}
        </p>
      </div>
      {question.poster && (
        <Image src={question.poster} height={100} style={{ width: "auto" }} />
      )}
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          {t("stat.pollstersAnswer")}
        </h3>
        <GridTable question={question} isShowUser={isShowUser} />
      </div>
    </div>
  );

  const renderDefaultContent = () => {
    const chartData = filteredData.map((option) => ({
      name: option.content,
      value: option.selectionCount,
    }));

    return (
      <div className="p-6 rounded-lg">
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-medium">{t("stat.avgTimeTaken")}: </span>
            {question.avgTimeTaken.toFixed(2)} {t("stat.second")}
          </p>
          {question.questionType === "MULTI_CHOICE" &&
            question.minAnswerCount !== null && (
              <p className="text-gray-600">
                <span className="font-medium">
                  Хамгийн бага хариултын тоо:{" "}
                </span>
                {question.minAnswerCount}
              </p>
            )}
        </div>
        {question.poster && (
          <Image src={question.poster} height={100} style={{ width: "auto" }} />
        )}
        <div className="mb-4">
          <Select
            value={displayMode}
            onChange={(value) => setDisplayMode(value)}
            style={{ width: 200 }}
            placeholder="Харагдац сонгох"
          >
            <Option value="table">{t("stat.table")}</Option>
            <Option value="chart">{t("stat.chart")}</Option>
            <Option value="both">{t("stat.both")}</Option>
          </Select>
        </div>
        {(displayMode === "chart" || displayMode === "both") && (
          <div className="mb-4">
            <ChartSelector chartType={chartType} onChange={onChartTypeChange} />
          </div>
        )}
        <div className="flex flex-row gap-4">
          {(displayMode === "chart" || displayMode === "both") && (
            <div className={displayMode === "both" ? "w-1/2" : "w-full"}>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {t("stat.chart")}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart(chartType, chartData) ?? (
                    <div>График байхгүй</div>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {(displayMode === "table" || displayMode === "both") && (
            <div className={displayMode === "both" ? "w-1/2" : "w-full"}>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {t("stat.pollstersAnswer")}
              </h3>
              <Table
                columns={optionColumns}
                dataSource={filteredData}
                rowKey={(record) => record.optionId}
                pagination={{ pageSize: 10 }}
                bordered
                size="middle"
              />
            </div>
          )}
        </div>
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

  const renderPanelContent = () => {
    if (
      question.questionType === "TEXT" ||
      question.questionType === "DATE" ||
      question.questionType === "TIME"
    ) {
      return renderTextOrDateContent();
    }
    if (
      question.questionType === "MULTIPLE_CHOICE_GRID" ||
      question.questionType === "TICK_BOX_GRID"
    ) {
      return renderGridContent();
    }
    return renderDefaultContent();
  };

  const renderHeader = () => (
    <div className="flex items-center gap-2">
      <span className="text-lg font-semibold text-gray-700">
        {question.content}
      </span>
      <Tag color="geekblue">{t(`questionTypes.${question.questionType}`)}</Tag>
      {question.isPointBased && <Tag color="blue">{t("edit_q.hasPoint")}</Tag>}
      {question.hasCorrectAnswer && (
        <Tag color="green">{t("stat.hasCorrect")}</Tag>
      )}
      {question.questionType === "TICK_BOX_GRID" && (
        <Tag color="purple">Олон сонголттой</Tag>
      )}
    </div>
  );

  return (
    <Collapse defaultActiveKey={[]} className="mb-4">
      <Panel header={renderHeader()} key={question.questionId}>
        {renderPanelContent()}
      </Panel>
    </Collapse>
  );
};

export default QuestionCard;
