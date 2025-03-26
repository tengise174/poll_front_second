import { useRef, useState  } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Select, Space, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const ManageEmpTable = ({ dataSource }: any) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            className="!bg-main-purple"
          >
            Хайх
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Цэвэрлэх
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    filterDropdownProps: {
      onOpenChange: (visible: any) => {
        if (visible) {
          setTimeout(
            () => (searchInput.current as unknown as HTMLInputElement).select(),
            100
          );
        }
      },
    },
    render: (text: any) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText("");
  };

  const employeeTableColumns = [
    {
      title: "Нэр",
      dataIndex: "name",
      key: "name",
      defaultSortOrder: "descend" as const,
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
    },
    {
      title: "Эрх",
      key: "action",
      render: (_: any, record: any) => (
        <Select
          className="!h-6 !text-xs"
          defaultValue={"edit"}
          value={record.action}
          style={{ width: 120 }}
        >
          <Option value="edit" style={{ color: "#722ed1" }}>
            Засварлах
          </Option>
          <Option value="see" style={{ color: "#000" }}>
            Харах
          </Option>
          <Option value="none" style={{ color: "#ff4d4f" }}>
            Эрхгүй
          </Option>
        </Select>
      ),
      width: 120,
      defaultSortOrder: "descend" as const,
      sorter: (a: any, b: any) =>
        (a.action || "").localeCompare(b.action || ""),
    },
  ];

  return (
    <Table
      className="w-full h-full"
      dataSource={dataSource}
      columns={employeeTableColumns}
      pagination={{
        position: ["bottomCenter"],
        pageSize: 10,
      }}
    />
  );
};

export default ManageEmpTable;
