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
      <Layout>
        <Suspense fallback={<Skeleton />}>{children}</Suspense>
        </Layout>
    </Layout>
  );
}
