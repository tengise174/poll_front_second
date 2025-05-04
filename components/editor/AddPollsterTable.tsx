import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Alert, Upload } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import CustomButton from "../CustomButton";
import { checkUserExists } from "@/api/action";
import { useAlert } from "@/context/AlertProvider";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";

const AddPollsterTable = ({ settingsPage, setSettingsPage }: any) => {
  const { t } = useTranslation();
  const searchInput = useRef(null);
  const { showAlert } = useAlert();
  const [value, setValue] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [nonExistentUsers, setNonExistentUsers] = useState<string[]>([]);
  const [showNonExistentAlert, setShowNonExistentAlert] = useState(false);

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
          placeholder={`${t("show_settings.searchUser")}`}
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
            {t("table.search")}
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            {t("table.clear")}
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
      title: `${t("show_settings.name")}`,
      dataIndex: "name",
      key: "name",
      defaultSortOrder: "descend" as const,
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
    },
    {
      title: `${t("show_settings.action")}`,
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
      showAlert("Хэрэглэгчийн нэр оруул", "warning", "", true);
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
      showAlert("Хэрэглэгчийн нэр хайхад алдаа гарлаа", "error", "", true);
    }
  };

  const handleExcelUpload = async (file: any) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
        });

        const usernames = jsonData
          .map((row) => row[0]?.toString().trim())
          .filter((username) => username);

        if (usernames.length === 0) {
          showAlert("Excel дээр хэрэглэгчийн нэр байхгүй", "warning", "", true);
          return;
        }

        const existingUsers: string[] = [];
        const nonExistingUsers: string[] = [];
        const alreadyAddedUsers: string[] = [];

        for (const username of usernames) {
          const isAlreadyAdded = settingsPage.pollsters.some(
            (pollster: any) => pollster.username === username
          );
          if (isAlreadyAdded) {
            alreadyAddedUsers.push(username);
            continue;
          }

          const result = await checkUserExists(username);
          if (result.exists) {
            existingUsers.push(username);
          } else {
            nonExistingUsers.push(username);
          }
        }

        if (existingUsers.length > 0) {
          setSettingsPage((prev: any) => ({
            ...prev,
            pollsters: [
              ...prev.pollsters,
              ...existingUsers.map((username) => ({ username })),
            ],
          }));
          showAlert(
            `${existingUsers.length} хэрэглэгчид амжилттай нэмэгдлээ`,
            "success",
            "",
            true
          );
        }

        if (alreadyAddedUsers.length > 0) {
          showAlert(
            `${
              alreadyAddedUsers.length
            } хэрэглэгчид аль хэдийн нэмэгдсэн: ${alreadyAddedUsers.join(
              ", "
            )}`,
            "warning",
            "",
            true
          );
        }

        if (nonExistingUsers.length > 0) {
          setNonExistentUsers(nonExistingUsers);
          setShowNonExistentAlert(true);
        }
      } catch (error) {
        showAlert("Excel файлд алдаа гарлаа", "error", "", true);
      }
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  return (
    <div className="w-full h-full relative">
      {showNonExistentAlert && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            maxWidth: 400,
          }}
        >
          <Alert
            message="Бүртгэлгүй оролцогчид"
            description={
              <div>
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                  {nonExistentUsers.map((username) => (
                    <li key={username}>{username}</li>
                  ))}
                </ul>
              </div>
            }
            type="error"
            closable
            onClose={() => setShowNonExistentAlert(false)}
            closeText={
              <Button size="small" type="primary">
                Болсон
              </Button>
            }
          />
        </div>
      )}
      <div className="flex flex-row items-end gap-5 mb-5 !h-9">
        <Input
          placeholder={t("show_settings.enterUsername")}
          value={value}
          className="flex-1"
          onChange={(e: any) => setValue(e.target.value)}
          onPressEnter={() => searchUsername(value)}
        />
        <CustomButton
          title={t("show_settings.add")}
          className="bg-main-purple px-3 rounded-2xl text-white cursor-pointer h-full !text-xs"
          onClick={() => {
            searchUsername(value);
          }}
        />
        <Upload
          accept=".xlsx, .xls"
          showUploadList={false}
          beforeUpload={handleExcelUpload}
          className=""
        >
          <CustomButton
            title={"Upload Excel"}
            className="bg-blue-600 px-3 rounded-xl text-white cursor-pointer !h-9 !text-xs"
          />
        </Upload>
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
