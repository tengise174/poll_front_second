"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, ConfigProvider, Menu, MenuProps } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import CustomButton from "./CustomButton";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "react-i18next";

type MenuItem = Required<MenuProps>["items"][number];

const CustomMenu = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [hydration, setHydration] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedKey, setSelectedKey] = useState<string>("1");
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const updatedItems: MenuItem[] = [
      { key: "1", label: t("menu.my_polls") },
      { key: "2", label: t("menu.new_poll") },
      { type: "divider", className: "custom-divider-1" },
      { key: "3", label: t("menu.my_answers") },
      { key: "4", label: t("menu.profile") },
    ];
    setItems(updatedItems);
  }, [t]);

  useEffect(() => {
    setHydration(true);
    const profile = localStorage.getItem("profile");
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
    }
  }, []);

  useEffect(() => {
    if (pathname === "/editor/new") {
      setSelectedKey("2");
    } else if (
      pathname === "/myanswers" ||
      pathname.startsWith("/myanswers/")
    ) {
      setSelectedKey("3");
    } else if (pathname === "/profile") {
      setSelectedKey("4");
    } else {
      setSelectedKey("1");
    }
  }, [pathname]);

  const onClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "1": {
        setSelectedKey("1");
        router.push("/mypolls");
        break;
      }
      case "2": {
        setSelectedKey("2");
        router.push("/editor/new");
        break;
      }
      case "3": {
        setSelectedKey("3");
        router.push("/myanswers");
        break;
      }
      case "4": {
        setSelectedKey("4");
        router.push("/profile");
        break;
      }
      default:
        break;
    }
  };

  if (!hydration) {
    return null;
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemSelectedBg: "#000000",
            itemSelectedColor: "#FFFFFF",
            itemColor: "#000",
            fontSize: 12,
            itemBorderRadius: 999,
            subMenuItemBg: "transparent",
            itemPaddingInline: 0,
          },
        },
      }}
    >
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="!bg-main-bg h-full"
      >
        <div className="h-full flex flex-col justify-between">
          <div>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <Menu
              onClick={onClick}
              className="bg-transparent border-none font-medium font-monts mt-[10px]"
              selectedKeys={[selectedKey]}
              mode="inline"
              items={items}
              style={{ borderInlineEnd: "none" }}
            />
          </div>
          <div className="w-full flex flex-col gap-2 items-center">
            <LanguageToggle />
            <CustomButton
              title={t("menu.logout")}
              className="bg-main-purple hover:cursor-pointer hover:bg-clicked w-full"
              onClick={() => {
                localStorage.removeItem("profile");
                localStorage.removeItem("token");
                setUserProfile(null);
                router.push("/login");
              }}
            />
          </div>
        </div>
      </Sider>
    </ConfigProvider>
  );
};

export default CustomMenu;
