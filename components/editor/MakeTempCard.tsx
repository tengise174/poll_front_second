import { Card, Form, Input, Select } from "antd";
import FormItem from "../FormItem";
import { MakeTempCardProps } from "@/utils/componentTypes";

const MakeTempCard = ({ settingsPage, setSettingsPage }: MakeTempCardProps) => {
  type UseFieldKeys = keyof typeof settingsPage.templateProps.useFields;
  const useFieldOptions = Object.keys(
    settingsPage.templateProps.useFields
  ) as UseFieldKeys[];

  const handleSelectChange = (values: UseFieldKeys[]) => {
    setSettingsPage((prev) => ({
      ...prev,
      templateProps: {
        ...prev.templateProps,
        useFields: {
          EDUCATION: values.includes("EDUCATION") ? 1 : 0,
          HUMAN_RESOURCES: values.includes("HUMAN_RESOURCES") ? 1 : 0,
          OTHER: values.includes("OTHER") ? 1 : 0,
        },
      },
    }));
  };

  const selectedValues = useFieldOptions.filter(
    (field) => settingsPage.templateProps.useFields[field] > 0
  );

  return (
    <Card className="flex flex-col gap-4 w-full md:w-[70%]">
      <Form.Item layout="vertical" label="Загварын гарчиг">
        <Input
          itemType="input"
          placeholder="Загварын гарчиг оруулна уу"
          defaultValue={settingsPage.templateProps.tempTitle}
          className="!h-9"
        />
      </Form.Item>
      <Form.Item layout="vertical" label="Нэмэлт тайлбар">
        <Input
          itemType="input"
          placeholder="Нэмэлт тайлбар оруулна уу"
          value={settingsPage.templateProps.extraDesc}
          className="!h-9"
        />
      </Form.Item>
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
