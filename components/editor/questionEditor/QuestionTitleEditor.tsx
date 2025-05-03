import React, { useState, useEffect } from "react";
import { Upload, Button } from "antd";
import { FileImageOutlined } from "@ant-design/icons";
import CustomInput from "../../CustomInput";
import { useAlert } from "@/context/AlertProvider";
import { QuestionProps } from "@/utils/componentTypes";
import { useTranslation } from "react-i18next";

const questionInputClass =
  "w-full !h-9 bg-[#E6E6E6] !rounded-[10px] !text-[13px] mt-[14px] border-none placeholder:text-[#B3B3B3] placeholder:text-[13px] placeholder:font-normal";

interface QuestionTitleEditorProps {
  currentQuestion: QuestionProps;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<QuestionProps>>;
  newQuestions: QuestionProps[];
  setNewQuestions: React.Dispatch<React.SetStateAction<QuestionProps[]>>;
  currentPage: number;
}

const QuestionTitleEditor: React.FC<QuestionTitleEditorProps> = ({
  currentQuestion,
  setCurrentQuestion,
  newQuestions,
  setNewQuestions,
  currentPage,
}) => {
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (currentQuestion?.poster) {
      setFileList([
        {
          uid: "-1",
          name: "poster.png",
          status: "done",
          url: currentQuestion.poster,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [currentQuestion]);

  const handleUploadChange = ({ fileList }: { fileList: any[] }) => {
    const file = fileList[0];
    setFileList(fileList.slice(-1));

    if (file && file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setNewQuestions((prev) =>
          prev.map((item, index) =>
            index === currentPage ? { ...item, poster: base64String } : item
          )
        );
        setCurrentQuestion((prev) => ({
          ...prev,
          poster: base64String,
        }));
      };
      reader.readAsDataURL(file.originFileObj);
    } else if (!fileList.length) {
      setNewQuestions((prev) =>
        prev.map((item, index) =>
          index === currentPage ? { ...item, poster: null } : item
        )
      );
      setCurrentQuestion((prev) => ({
        ...prev,
        poster: null,
      }));
    }
  };

  return (
    <div className="rounded-[10px] bg-[#F5F5F5] w-full h-auto flex flex-col justify-between gap-2 mt-5 p-[10px] relative">
      <div className="flex flex-col justify-between gap-2 flex-1">
        <p className="text-[13px] text-[#1E1E1E] font-semibold leading-[14.6px]">
          {t("edit_q.title")}
        </p>
        <CustomInput
          onChange={(e: any) => {
            const updatedQuestions = newQuestions.map((item, index) =>
              index === currentPage
                ? { ...item, content: e.target.value }
                : item
            );
            setNewQuestions(updatedQuestions);
            setCurrentQuestion({
              ...currentQuestion,
              content: e.target.value,
            });
          }}
          value={currentQuestion?.content || ""}
          className={questionInputClass}
          placeholder={t("edit_q.enterTitle")}
        />
      </div>
      <Upload
        fileList={fileList}
        onChange={handleUploadChange}
        beforeUpload={(file) => {
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isLt2M) {
            showAlert("Image must be smaller than 2MB!", "warning", "", true);
          }
          return isLt2M || Upload.LIST_IGNORE;
        }}
        accept="image/*"
        listType="picture"
        maxCount={1}
      >
        <Button icon={<FileImageOutlined />}></Button>
      </Upload>
    </div>
  );
};

export default QuestionTitleEditor;
