import Sidebar from "@/components/shared/Sidebar";
import UserList from "@/components/shared/UserList";
import getUsers from "@/lib/actions/getUsers";
import React from "react";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={users} />
        {children}
      </div>
    </Sidebar>
  );
}
