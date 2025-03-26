import { Card, Form, Select } from "antd";
import CustomInput from "../CustomInput";
import { MakeTempCardProps } from "@/utils/componentTypes";

const startPageInputClass =
  "w-full !h-[30px] bg-[#E6E6E6] !rounded-[10px] !text-[13px] mt-[14px] border-none placeholder:text-[#B3B3B3] placeholder:text-[13px] placeholder:font-normal";

const MakeTempCard = ({ settingsPage, setSettingsPage }: MakeTempCardProps) => {
  type UseFieldKeys = keyof typeof settingsPage.templateProps.useFields;
  const useFieldOptions = Object.keys(
    settingsPage.templateProps.useFields
  ) as UseFieldKeys[];

  // Handle multiple select changes
  const handleSelectChange = (values: UseFieldKeys[]) => {
    setSettingsPage((prev) => ({
      ...prev,
      templateProps: {
        ...prev.templateProps,
        useFields: {
          EDUCATION: values.includes("EDUCATION"),
          HUMAN_RESOURCES: values.includes("HUMAN_RESOURCES"),
          OTHER: values.includes("OTHER"),
        },
      },
    }));
  };

  // Get currently selected values based on true booleans
  const selectedValues = useFieldOptions.filter(
    (field) => settingsPage.templateProps.useFields[field] === true
  );

  return (
    <Card className="flex flex-col gap-4 w-full md:w-[70%]">
      <CustomInput
        onChange={(e: any) =>
          setSettingsPage((prev) => ({
            ...prev,
            templateProps: {
              ...prev.templateProps,
              tempTitle: e.target.value,
            },
          }))
        }
        value={settingsPage.templateProps.tempTitle}
        label="Template гарчиг"
        placeholder="Template гарчиг"
        className={startPageInputClass}
      />
      <CustomInput
        onChange={(e: any) =>
          setSettingsPage((prev) => ({
            ...prev,
            templateProps: {
              ...prev.templateProps,
              extraDesc: e.target.value,
            },
          }))
        }
        label="Талархлын үг"
        value={settingsPage.templateProps.extraDesc}
        placeholder="Талархлын үг"
        className={startPageInputClass}
      />
      <Form.Item layout="vertical" label="Ашиглах салбарууд">
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Select use fields"
          value={selectedValues}
          onChange={handleSelectChange}
          options={useFieldOptions.map((option) => ({
            label: option,
            value: option,
          }))}
        />
      </Form.Item>
    </Card>
  );
};

export default MakeTempCard;
