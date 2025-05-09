import { Col, Form } from "antd";
import CustomInput from "./CustomInput";
import { FormItemProps } from "../utils/componentTypes";

const FormItem = ({
  itemType,
  span,
  label,
  name,
  required,
  rules,
  hidePasswordSuggest,
  value,
  placeholder,
  onPressEnter,
  ...props
}: FormItemProps) => {
  return (
    <Col
      xs={{ span: span!! === 24 ? 24 : 12 }}
      sm={{ span: span!! === 24 ? 24 : 12 }}
      md={{ span: span!! === 24 ? 24 : 12 }}
      lg={{ span: span }}
    >
      <Form.Item rules={rules} style={{ marginBottom: 0 }} name={name}>
        {(() => {
          switch (itemType) {
            default:
              return (
                <CustomInput
                  label={label}
                  itemType={itemType}
                  allowClear
                  required={required}
                  hidePasswordSuggest={hidePasswordSuggest}
                  value={value}
                  placeholder={placeholder}
                  onPressEnter={onPressEnter}
                  {...props}
                />
              );
          }
        })()}
      </Form.Item>
    </Col>
  );
};

export default FormItem;
