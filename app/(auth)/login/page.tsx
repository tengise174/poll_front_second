"use client";

import { getProfile, signin, signup } from "@/api/action";
import CustomButton from "@/components/CustomButton";
import FormItem from "@/components/FormItem";
import { useAlert } from "@/context/AlertProvider";
import { Form, Row, FormInstance, Alert } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Login = () => {
  const [form] = Form.useForm();
  const { showAlert } = useAlert();
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogIn = async () => {
    const signInData = {
      username: form.getFieldValue("username"),
      password: form.getFieldValue("password"),
    };

    try {
      const result = await signin(signInData);
      router.push("/");
      showAlert("Амжилттай нэвтэрлээ", "success", "", true);

      const profile = await getProfile();

      if (profile) {
        localStorage.setItem("profile", JSON.stringify(profile));
      }
    } catch (error: any) {
      if (error.status === 401) {
        showAlert("Нэвтрэх мэдээлэл буруу", "warning", "", true);
      } else {
        showAlert("Нэвтрэх мэдээлэл буруу", "warning", "", true);
      }
    }
  };

  const validateForm = () => {
    const values = form.getFieldsValue();
    const allFieldsFilled = values.username && values.password;

    setIsFormValid(allFieldsFilled);
  };

  return (
    <div className="w-full font-open flex justify-center">
      <div className="flex flex-col items-center w-full max-w-[534px] gap-3 bg-second-bg p-6 rounded-xl">
        <p className="text-[24px] text-[#1E1E1E] font-semibold leading-[34px] w-full">
          Нэвтрэх
        </p>
        <Form
          form={form}
          layout="vertical"
          className="w-full mt-5"
          onFinishFailed={({ errorFields }) => {
            form.scrollToField(errorFields[0].name);
          }}
          onValuesChange={validateForm}
        >
          <Row gutter={[16, 16]}>
            <FormItem
              name="username"
              label="Хэрэглэгчийн нэр"
              span={24}
              itemType="username"
              className="!h-8"
              rules={[
                { required: true, message: "Хэрэглэгчийн нэр оруулна уу!" },
              ]}
            />
            <FormItem
              name="password"
              label="Нууц үг"
              span={24}
              itemType="password"
              className="!h-8"
              rules={[{ required: true, message: "Нууц үг оруулна уу!" }]}
              hidePasswordSuggest
            />
          </Row>
        </Form>
        <div className="flex flex-row items-center justify-between gap-x-[26px] mt-5 w-full">
          <CustomButton
            className="w-[147px] rounded-[36px] bg-main-purple text-[#FDFDFD] h-[42px] disabled:bg-[#D9D9D9] disabled:text-[#1E1E1E] cursor-pointer !text-[14px]"
            disabled={!isFormValid}
            loading={loading}
            title="Нэвтрэх"
            onClick={() => {
              handleLogIn();
            }}
          />
          <p className="font-medium text-xs text-[#555] flex flex-row gap-2 items-center">
            Танд хаяг байхгүй бол бүртгүүлэх{" "}
            <Link
              href={"/register"}
              className="text-[#1E1E1E] font-medium underline text-[14px]"
            >
              бүртгүүлэх
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
