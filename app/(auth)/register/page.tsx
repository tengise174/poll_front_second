"use client";

import CustomButton from "@/components/CustomButton";
import FormItem from "@/components/FormItem";
import { Divider, Form, Row, Image } from "antd";
import Link from "next/link";
import { useState } from "react";

const Register = () => {
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    secure: false,
    email_send: false,
  });
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCheckboxes((prev) => {
      const updatedCheckboxes = { ...prev, [name]: checked };
      setIsFormValid(updatedCheckboxes.secure);
      return updatedCheckboxes;
    });
  };

  return (
    <div className="w-full font-open flex justify-center">
      <div className="flex flex-col items-center w-full max-w-[534px]">
        <p className="text-[24px] text-[#1E1E1E] font-semibold leading-[34px] w-full">
          Бүртгүүлэх
        </p>
        <Form
          form={form}
          layout="vertical"
          className="w-full mt-5"
          onFinishFailed={({ errorFields }) => {
            form.scrollToField(errorFields[0].name);
          }}
        >
          <Row gutter={[16, 16]}>
            <FormItem
              name="lastName"
              label="Овог"
              span={12}
              rules={[{ required: true, message: "Овог оруулна уу!" }]}
            />
            <FormItem
              name="firstName"
              label="Нэр"
              span={12}
              rules={[{ required: true, message: "Нэр оруулна уу!" }]}
            />
            <FormItem
              name="email"
              label="Имэйл хаяг"
              span={24}
              itemType="email"
              rules={[
                { required: true, message: "Имэйл хаяг оруулна уу!" },
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Имэйл хаяг буруу байна!",
                },
              ]}
            />
            <FormItem
              name="password"
              label="Нууц үг"
              span={24}
              itemType="password"
              rules={[{ required: true, message: "Нууц үг оруулна уу!" }]}
            />
          </Row>
        </Form>

        <div className="flex flex-row items-center mt-5 py-1 justify-start w-full">
          <label className="relative flex items-center justify-center min-w-6 min-h-6 max-w-6 max-h-6 cursor-pointer">
            <input
              className="w-[18px] h-[18px] appearance-none bg-[#D9D9D9] checked:bg-[#2C2C2C] rounded peer"
              type="checkbox"
              id="secure"
              name="secure"
              value="secure"
              checked={checkboxes.secure}
              onChange={handleCheckboxChange}
            />
            <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-[16px] h-[16px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
          </label>
          <p className="font-medium text-[#5A5A5A] ml-2 text-[13px] leading-[14px]">
            Үйлчилгээний нөхцөл, нууцлалын бодлого зөвшөөрч байна.
          </p>
        </div>
        <div className="flex flex-row items-center justify-between gap-x-[26px] mt-5 w-full">
          <CustomButton
            className="w-[147px] rounded-[36px] bg-main-purple text-[#FDFDFD] h-[42px] disabled:bg-[#D9D9D9] disabled:text-[#1E1E1E]"
            disabled={!isFormValid}
            loading={loading}
            title="Бүртгүүлэх"
          />
          <p className="font-medium">
            Танд хаяг байгаа бол нэвтрэх{" "}
            <Link
              href={"/login"}
              className="text-[#1E1E1E] font-medium underline"
            >
              нэвтрэх
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
