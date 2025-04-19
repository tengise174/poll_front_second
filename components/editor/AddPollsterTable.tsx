import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import CustomButton from "../CustomButton";
import { checkUserExists } from "@/api/action";
import { useAlert } from "@/context/AlertProvider";

const AddPollsterTable = ({ settingsPage, setSettingsPage }: any) => {
  const searchInput = useRef(null);
  const { showAlert } = useAlert();
  const [value, setValue] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const pollsterTableData = settingsPage.pollsters.map((pollster: any) => ({
    key: pollster.username,
    name: pollster.username,
  }));

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

  const pollsterTableColumns = [
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
          <DeleteOutlined
            className="!text-red-500"
            onClick={() => handleDelete(record.name)}
          />
        </Space>
      ),
      width: 120,
    },
  ];

  const handleDelete = (username: string) => {
    setSettingsPage((prev: any) => ({
      ...prev,
      pollsters: prev.pollsters.filter(
        (pollster: any) => pollster.username !== username
      ),
    }));
    showAlert(`"${username}" амжилттай устгагдлаа`, "success", "", true);
  };

  const searchUsername = async (username: string) => {
    if (!username.trim()) {
      showAlert("Please enter a username", "warning", "", true);
      return;
    }

    try {
      const isAlreadyAdded = settingsPage.pollsters.some(
        (pollster: any) => pollster.username === username
      );
      if (isAlreadyAdded) {
        showAlert(
          `"${username}" нь аль хэдийн нэмэгдсэн байна`,
          "warning",
          "",
          true
        );
        return;
      }

      const result = await checkUserExists(username);
      if (!result.exists) {
        showAlert(
          `"${username}" бүртгэгдсэн байхгүй байна`,
          "warning",
          "",
          true
        );
      } else {
        setSettingsPage((prev: any) => ({
          ...prev,
          pollsters: [...prev.pollsters, { username }],
        }));
        setValue("");
        showAlert(`"${username}" амжилттай нэмэгдлээ`, "success", "", true);
      }
    } catch (error: any) {
      console.error("Error checking username:", error);
      showAlert(
        "An error occurred while checking the username",
        "error",
        "",
        true
      );
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-row items-center gap-5 !h-9 mb-5">
        <Input
          placeholder="Оролцогчийн нэр оруул"
          value={value}
          className=""
          onChange={(e: any) => setValue(e.target.value)}
          onPressEnter={() => searchUsername(value)}
        />
        <CustomButton
          title={"Нэмэх"}
          className="bg-main-purple px-3 rounded-2xl text-white cursor-pointer h-full"
          onClick={() => {
            searchUsername(value);
          }}
        />
      </div>
      <Table
        className="w-full h-full"
        dataSource={pollsterTableData}
        columns={pollsterTableColumns}
        pagination={{
          position: ["bottomCenter"],
          pageSize: 10,
        }}
      />
    </div>
  );
};

export default AddPollsterTable;
