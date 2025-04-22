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
      <Layout className="h-full">
        <Content className="p-4 h-full overflow-y-auto">
          <Suspense fallback={<Skeleton />}>{children}</Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}
