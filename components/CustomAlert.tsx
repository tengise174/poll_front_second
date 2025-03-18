import { CustomAlertType } from "@/utils/componentTypes";
import { Alert } from "antd";
import React, { useEffect } from "react";
import { measureMemory } from "vm";

const CustomAlert = ({
  message,
  type,
  className,
  onClose,
  closable,
  duration,
}: CustomAlertType) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <Alert
      message={
        message
      }
      type={type}
      className={`${className}`}
      showIcon
      closable={closable ? true : false}
      afterClose={() => {
        onClose;
      }}
    />
  );
};

export default CustomAlert;
