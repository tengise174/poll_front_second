"use client";

import { useState } from "react";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@ant-design/v5-patch-for-react-19";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AlertProvider } from "@/context/AlertProvider";
import "../i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            activeBorderColor: "#492DC2",
            hoverBorderColor: "#492DC2",
            colorPrimaryHover: "#492DC2",
          },
          Switch: {
            colorPrimary: "#492DC2",
            colorPrimaryHover: "#492DC2",
          },
          DatePicker: {
            activeBorderColor: "#492DC2",
            hoverBorderColor: "#492DC2",
            colorPrimary: "#492DC2",
            colorPrimaryBorder: "#492DC2",
          },
          InputNumber: {
            activeBorderColor: "#492DC2",
            hoverBorderColor: "#492DC2",
            colorText: "#492DC2",
            handleHoverColor: "#492DC2",
          },
          Select: {
            hoverBorderColor: "#492DC2",
            activeBorderColor: "#492DC2",
            optionSelectedBg: "#DDCEFB",
          },
          Radio: {
            buttonSolidCheckedBg: "#000000",
            buttonSolidCheckedHoverBg: "#000000",
            colorPrimary: "#000000",
            borderRadius: 0,
          },
        },
      }}
    >
      <AlertProvider>
        <QueryClientProvider client={queryClient}>
          <html lang="en">
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              {children}
            </body>
          </html>
        </QueryClientProvider>
      </AlertProvider>
    </ConfigProvider>
  );
}
