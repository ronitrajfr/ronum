import React from "react";
import Librarypage from "./Librarypage";

const MainDashboardPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return (
    <div className="w-full bg-stone-200">
      <Librarypage id={id} />
    </div>
  );
};

export default MainDashboardPage;
