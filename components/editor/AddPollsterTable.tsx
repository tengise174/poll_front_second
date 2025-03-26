import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table } from "antd";
import { EditOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import FormItem from "../FormItem";
import CustomButton from "../CustomButton";

const ManageEmpTable = ({ dataSource }: any) => {
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

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
        <Space size={"middle"}>
          <EditOutlined className="!text-green-800" />
          <DeleteOutlined className="!text-red-500" />
        </Space>
      ),
      width: 120,
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-row justify-start items-center mb-4 gap-3">
        <FormItem
          itemType="name"
          placeholder="Оролцогчийн нэр оруул"
          className="!h-10 mb-1"
        />
        <CustomButton
          title={"Нэмэх"}
          className="bg-main-purple px-3 rounded-2xl !h-9 text-white cursor-pointer"
        />
      </div>
      <Table
        className="w-full h-full"
        dataSource={dataSource}
        columns={employeeTableColumns}
        pagination={{
          position: ["bottomCenter"],
          pageSize: 10,
        }}
      />
    </div>
  );
};

export default ManageEmpTable;
