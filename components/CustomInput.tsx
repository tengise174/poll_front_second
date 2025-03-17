"use client";

import { useState } from "react";
import zxcvbn from "zxcvbn";
import { Input, Progress } from "antd";
import { CustomInputType } from "../utils/componentTypes";
import Eye from "../public/icons/eye";
import EyeInvisible from "../public/icons/eye_invisible";

const CustomInput = ({
  itemType,
  className,
  value,
  allowUppercaseOnly = false,
  allowedLetters,
  label,
  required,
  hidePasswordSuggest,
  onChange,
  showPasswordProgress,
  ...props
}: CustomInputType & {
  tooltipBgColor?: string;
  allowUppercaseOnly?: boolean;
  allowedLetters?: string;
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string;
  }>({ score: 0, feedback: "" });
  const [passwordError, setPasswordError] = useState("");

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validatePassword = (password: string) => {
    const regexUpper = /[A-Z]/;
    const regexLower = /[a-z]/;
    const regexNumber = /\d/;
    const minLength = 8;

    if (!regexUpper.test(password)) {
      setPasswordError("Том үсэг байвал зохино");
    } else if (!regexLower.test(password)) {
      setPasswordError("Жижиг үсэг байвал зохино");
    } else if (!regexNumber.test(password)) {
      setPasswordError("Тоо оруулах шаардлагатай");
    } else if (password.length < minLength) {
      setPasswordError(`Нууц үгээ бага зэрэг урт болгоод үзээрэй. 🦕`);
    } else {
      setPasswordError("");
    }

    return (
      password.length >= minLength &&
      regexUpper.test(password) &&
      regexLower.test(password) &&
      regexNumber.test(password)
    );
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    const result = zxcvbn(password);
    setPasswordStrength({
      score: result.score,
      feedback: result.feedback.suggestions.join(", "),
    });

    if (onChange) {
      onChange(e);
    }

    validatePassword(password);
  };

  if (itemType === "textarea") {
    return (
      <Input.TextArea
        autoSize
        required={required}
        className={`${className} mt-1 text-[16px] border border-[#D9D9D9] rounded-[12px] font-medium text-black`}
        value={value}
        allowClear={false}
        onChange={onChange}
        {...props}
      />
    );
  }

  return itemType === "password" ? (
    <div className="flex flex-col items-start w-full">
      <div className="flex flex-row items-center justify-between w-full">
        <p className="text-[#757575] text-[14px] leading-[24px] font-medium font-open">
          {label}
        </p>
      </div>
      <Input
        type={isPasswordVisible ? "text" : "password"}
        required={required}
        className={`${className} mt-1 h-[42px] text-[16px] border border-[#D9D9D9] rounded-[12px] font-medium text-black`}
        value={value}
        allowClear={false}
        onChange={handlePasswordChange}
        maxLength={32}
        suffix={
          <div onClick={togglePasswordVisibility} className="cursor-pointer">
            {isPasswordVisible ? <Eye /> : <EyeInvisible />}
          </div>
        }
        {...props}
      />
      {showPasswordProgress && value && value?.length > 0 && (
        <Progress
          percent={passwordStrength.score * 40}
          status={passwordStrength.score < 1 ? "exception" : "success"}
          showInfo={false}
          size={["100%", 16]}
          className="mt-1"
        />
      )}

      {!hidePasswordSuggest && (
        <p className="text-[#757575] text-[13px] leading-[15.8px] font-medium font-open mt-1">
          {passwordError ||
            (!value && "8+ тэмдэгттэй, үсэг, тоо, тэмдэгт хослуулна уу.")}
        </p>
      )}
    </div>
  ) : (
    <div className="flex flex-col items-start w-full">
      <p className="text-[#757575] text-[14px] leading-[24px] font-medium font-open">
        {label}
      </p>
      <Input
        required={required}
        type={itemType}
        className={`${className} mt-1 h-[42px] text-[16px] border border-[#D9D9D9] rounded-[12px] font-medium text-black`}
        value={value}
        allowClear={false}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default CustomInput;
