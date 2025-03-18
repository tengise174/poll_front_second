import CustomHeader from "@/components/CustomHeader";
import CustomMenu from "@/components/CustomMenu";
import { Layout, Menu, Skeleton } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout className="h-screen bg-second-bg">
        <CustomMenu />
      <Layout className="relative h-full">
        <Header className="!bg-main-bg h-[56px] border-[1px] border-[#D9D9D9] p-0 m-0">
          <CustomHeader />
        </Header>
        <Content className="px-4 md:px-5 pt-[10px] pb-[35px] h-full overflow-y-auto">
          <Suspense fallback={<Skeleton />}>{children}</Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}
