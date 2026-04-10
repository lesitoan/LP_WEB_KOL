"use client";
import MembersHeader from "./components/MembersHeader";
import MembersTable from "./components/MembersTable";

export default function MembersScreen() {
  return (
    <div className="animate-fade-in">
      <MembersHeader />
      <MembersTable />
    </div>
  );
}
