import CustomMenu from "@/components/CustomMenu";
import { Layout, Skeleton } from "antd";
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
