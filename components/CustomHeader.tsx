"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Dropdown, MenuProps, Space } from "antd";
import { DownOutlined, LogoutOutlined } from "@ant-design/icons";
import { CustomHeaderProps } from "@/utils/componentTypes";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <>Хувийн тохиргоо</>
    )
  },
  {
    key: "2",
    label: (
      <>Гарах</>
    ),
    icon: <LogoutOutlined/>
  },
];

const CustomHeader = ({}: CustomHeaderProps) => {
  const router = useRouter();
  const [hydration, setHydration] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    setHydration(true);
    const profile = localStorage.getItem("profile");
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "1":
        {
          router.push('/profile');
        }
        break;
      case "2":
        {
          localStorage.removeItem('profile');
          localStorage.removeItem('token');
          setUserProfile(null);
          router.push('/login');
        }
        break;
    }
  };

  if (!hydration) {
    return null;
  }

  if (userProfile === null) {
    return (
      <div className="h-full flex flex-row justify-end items-center gap-3 px-2">
        <Button onClick={() => router.push("/login")}>Нэвтрэх</Button>
        <Button onClick={() => router.push("/register")}>Бүртгүүлэх</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-end items-center gap-[12px] px-0 md:px-5">
      <div>
        <Dropdown
          menu={{ items, onClick: handleMenuClick }}
          className="!text-black !text-xs !bg-second-bg px-3 py-2 rounded-xl h-auto border border-second-gray"
        >
          <a>
            <Space>
              <p>{userProfile.username.slice(0, 2).toUpperCase()}</p>
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
};

export default CustomHeader;
