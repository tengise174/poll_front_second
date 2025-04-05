"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, ConfigProvider, Menu, MenuProps } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";

type MenuItem = Required<MenuProps>["items"][number];

const baseItems: MenuItem[] = [
  {
    key: "1",
    label: "Миний асуулгууд",
  },
  {
    key: "2",
    label: "Шинэ асуулга",
  },
  {
    type: "divider",
    className: "custom-divider-1",
  },
  {
    key: "3",
    label: "Миний оролцсон",
  },
];

const CustomMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [hydration, setHydration] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [items, setItems] = useState<MenuItem[]>(baseItems);
  const [selectedKey, setSelectedKey] = useState<string>("1");
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    setHydration(true);
    const profile = localStorage.getItem("profile");
    if (profile) {
      const parsedProfile = JSON.parse(profile);
      setUserProfile(parsedProfile);
    }
  }, []);

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
        router.push("/templates");
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
      <Sider trigger={null} collapsible collapsed={collapsed} 
      className="!bg-main-bg"
      >
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
      </Sider>
    </ConfigProvider>
  );
};

export default CustomMenu;
