import React from "react";
import Librarypage from "@/app/_components/dashboard/library-page";

const MainDashboardPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <Librarypage id={id} />;
};

export default MainDashboardPage;
