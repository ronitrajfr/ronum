import { Sidebar } from "@/app/_components/sidebar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-stone-200">
        <div className="flex h-screen">
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
