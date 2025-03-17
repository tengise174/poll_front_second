export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen bg-main-bg flex flex-row items-center justify-center">
      {children}
    </div>
  );
}
