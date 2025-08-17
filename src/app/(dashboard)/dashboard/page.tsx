import React from "react";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export const Dashboard = async () => {
  //const router = useRouter();
  const session = await auth();

  if (!session?.user.id) {
    redirect("/login");
  }
  return <div>Dashboard</div>;
};

export default Dashboard;
