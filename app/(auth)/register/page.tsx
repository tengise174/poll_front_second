"use client";

import { getProfile, signup } from "@/api/action";
import CustomButton from "@/components/CustomButton";
import FormItem from "@/components/FormItem";
import { useAlert } from "@/context/AlertProvider";
import { Form, Row, FormInstance } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Register = () => {
  const [form] = Form.useForm();
  const { showAlert } = useAlert();
  const [step, setStep] = useState<number>(1);
  const [userType, setUserType] = useState<"PERSON" | "COMPANY">("PERSON");
  const [isFormValid, setIsFormValid] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    secure: false,
    email_send: false,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCheckboxes((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleRegister = async () => {
    let signUpData;

    if (userType === "PERSON") {
      signUpData = {
        companyname: "",
        lastname: form.getFieldValue("lastName"),
        firstname: form.getFieldValue("firstName"),
        username: form.getFieldValue("username"),
        password: form.getFieldValue("password1"),
        usertype: userType,
      };
    } else {
      signUpData = {
        companyname: form.getFieldValue("companyName"),
        lastname: "",
        firstname: "",
        username: form.getFieldValue("username"),
        password: form.getFieldValue("password1"),
        usertype: userType,
      };
    }

    try {
      const result = await signup(signUpData);
      router.push("/");
      showAlert("Амжилттай бүртгүүллээ", "success", "", true);
      const profile = await getProfile();
      if (profile) {
        localStorage.setItem("profile", JSON.stringify(profile));
      }
    } catch (error: any) {
      if (error.status === 409) {
        showAlert("Хэрэглэгчийн нэр бүртгэгдсэн байна", "warning", "", true);
      } else {
        showAlert("Бүртгүүлэхэд алдаа гарлаа", "warning", "", true);
      }
    }
  };

  const validateForm = () => {
    const values = form.getFieldsValue();
    const errors = form.getFieldsError();
    const hasErrors = errors.some((field) => field.errors.length > 0);

    let allFieldsFilled: any;
    if (userType === "PERSON") {
      allFieldsFilled =
        values.lastName &&
        values.firstName &&
        values.username &&
        values.password1 &&
        values.password2;
    } else {
      allFieldsFilled =
        values.companyName &&
        values.username &&
        values.password1 &&
        values.password2;
    }

    const passwordsMatch = values.password1 === values.password2;

    setIsFormValid(
      allFieldsFilled && passwordsMatch && !hasErrors && checkboxes.secure
    );
  };

  useEffect(() => {
    validateForm();
  }, [checkboxes]);

  return (
    <div className="w-full font-open flex justify-center ">
      {step === 1 && (
        <div className="text-black w-full max-w-[360px] flex flex-col gap-6 items-center">
          <p className="text-black font-semibold text-xl">
            Хэн ашиглах гэж байна вэ?
          </p>
          <div className="w-full flex flex-col gap-2">
            <CustomButton
              title="Байгууллага"
              className="!text-sm bg-not-clicked w-full border border-[#D9D9D9] rounded-3xl text-black hover:bg-clicked hover:text-white cursor-pointer duration-300"
              onClick={() => {
                setStep(2);
                setUserType("COMPANY");
              }}
            />
            <CustomButton
              title="Хувь хүн"
              className="!text-sm bg-not-clicked w-full border border-[#D9D9D9] rounded-3xl text-black hover:bg-clicked hover:text-white cursor-pointer duration-300"
              onClick={() => {
                setStep(2);
                setUserType("PERSON");
              }}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col items-center w-full max-w-[534px] gap-4 bg-second-bg p-6 rounded-xl">
          <p className="text-[24px] text-[#1E1E1E] font-semibold leading-[34px] w-full">
            БҮРТГҮҮЛЭХ
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
              {userType === "PERSON" ? (
                <div className="flex flex-row w-full">
                  <FormItem
                    name="lastName"
                    label="Овог"
                    span={12}
                    className="!h-8"
                    rules={[{ required: true, message: "Овог оруулна уу!" }]}
                  />
                  <FormItem
                    name="firstName"
                    label="Нэр"
                    span={12}
                    className="!h-8"
                    rules={[{ required: true, message: "Нэр оруулна уу!" }]}
                  />
                </div>
              ) : (
                <FormItem
                  name="companyName"
                  label="Компани нэр"
                  span={24}
                  className="!h-8"
                  rules={[
                    { required: true, message: "Компани нэр оруулна уу!" },
                  ]}
                />
              )}

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
                name="password1"
                label="Нууц үг"
                span={24}
                itemType="password"
                className="!h-8"
                rules={[{ required: true, message: "Нууц үг оруулна уу!" }]}
              />
              <FormItem
                name="password2"
                label="Нууц үг давтах"
                span={24}
                itemType="password"
                className="!h-8"
                rules={[
                  { required: true, message: "Нууц үг оруулна уу!" },
                  ({
                    getFieldValue,
                  }: {
                    getFieldValue: FormInstance["getFieldValue"];
                  }) => ({
                    validator(_: any, value: string) {
                      if (!value || getFieldValue("password1") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Нууц үг таарахгүй байна!")
                      );
                    },
                  }),
                ]}
                hidePasswordSuggest
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
              className="!text-sm w-[147px] rounded-[36px] bg-main-purple text-[#FDFDFD] h-[42px] disabled:bg-[#D9D9D9] disabled:text-[#1E1E1E] cursor-pointer"
              disabled={!isFormValid}
              loading={loading}
              title="Бүртгүүлэх"
              onClick={() => {
                handleRegister();
              }}
            />
            <p className="font-medium text-xs text-[#555] flex flex-row gap-2 items-center">
              Танд хаяг байгаа бол нэвтрэх{" "}
              <Link
                href={"/login"}
                className="text-[#1E1E1E] font-medium underline text-[14px]"
              >
                нэвтрэх
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
