import { Sidebar } from "@/app/_components/sidebar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-stone-200">
      <div className="flex h-screen">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
