import { CustomButtonType } from "../utils/componentTypes";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const CustomButton = ({
  title,
  disabled,
  onClick,
  className,
  htmlType,
  suffixIcon,
  suffixIconHover,
  prefixIcon,
  prefixIconHover,
  titleClassname,
  loading,
  style,
}: CustomButtonType) => {
  return loading ? (
    <button
      style={style}
      className={`disabled:text-[#1E1E1E] group flex flex-row items-center justify-between disabled:pointer-events-none disabled:bg-[#D9D9D9] text-[16px] leading-[26px] font-semibold py-4 h-12 ${className}`}
      disabled={disabled}
    >
      <div className="w-full h-full flex justify-center items-center">
        <DotLottieReact
          src="https://lottie.host/60e548c5-dc1d-427d-86a6-c518ea9cd162/jt99t17ILl.lottie"
          loop
          autoplay
          style={{ width: 30, height: 30 }}
          renderConfig={{
            autoResize: false,
          }}
          onError={(error: any) => console.error("Lottie Error:", error)}
        />
      </div>
    </button>
  ) : (
    <button
      style={style}
      type={htmlType}
      onClick={onClick}
      className={`disabled:text-[#1E1E1E] group flex flex-row items-center justify-between disabled:pointer-events-none disabled:bg-[#D9D9D9] text-[16px] leading-[26px] font-semibold py-4 h-12 ${className}`}
      disabled={disabled}
    >
      {prefixIcon && (
        <div className={`${prefixIconHover && "hidden group-hover:block"}`}>
          {prefixIcon}
        </div>
      )}
      <span
        className={`${
          suffixIconHover || prefixIcon
            ? `text-center  w-full ${
                suffixIcon ? "hover:text-start" : "hover:text-end"
              }`
            : ""
        } 
    ${
      (suffixIcon && !suffixIconHover) || (prefixIcon && !prefixIconHover)
        ? `${suffixIcon ? "text-start" : "text-end"}`
        : "text-center w-full"
    }
    ${titleClassname && titleClassname}`}
      >
        {title}
      </span>
      {suffixIcon && (
        <div className={`${suffixIconHover && "hidden group-hover:block"}`}>
          {suffixIcon}
        </div>
      )}
    </button>
  );
};

export default CustomButton;
