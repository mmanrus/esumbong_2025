import { Button } from "@/components/ui/button";
import { useState } from "react";
import UserDetailsDialog from "./userDetails";
import clsx from "clsx";

export type User = {
  id: number;
  fullname: string;
  isActive: boolean;
  email: string;
  contactNumber: string;
  type: string;
};

type Props = {
  users: User[] | null;
  onDelete: (userId: any) => void;
  setUsers: (userId: any) => void;
};

export default function UserRows({ users, onDelete, setUsers }: Props) {
  if (!users || users.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="text-center py-6 text-gray-500">
          No Users Found
        </td>
      </tr>
    );
  }

  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  return (
    <>
      {users.map((u: User, index: number) => (
        <tr key={u.id ?? index}>
          <td
            className={clsx(
              u.isActive === false ? "text-red-600" : "",
              "px-4 py-3",
            )}
          >
            {u?.fullname ?? "Unknown"}
          </td>

          <td
            className={clsx(
              u.isActive === false ? "text-red-600" : "",
              "px-4 py-3",
            )}
          >
            {u?.email}
          </td>

          <td
            className={clsx(
              u.isActive === false ? "text-red-600" : "",
              "px-4 py-3",
            )}
          >
            {u?.contactNumber}
          </td>
          <td
            className={clsx(
              u.isActive === false ? "text-red-600" : "",
              "px-4 py-3",
            )}
          >
            {u?.type}
          </td>
          <td className="px-4 py-3 flex gap-1">
            <Button
              onClick={() => setSelectedUser(u)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              View
            </Button>
          </td>
        </tr>
      ))}
      <UserDetailsDialog
        open={!!selectedUser}
        user={selectedUser}
        onDelete={(id: number) => {
          onDelete(id); // call parent callback
          setSelectedUser(null); // close modal
        }}
        onUpdate={(updatedUser) => {
          // update local state immediately
          const updatedUsers = users?.map((u) =>
            u.id === updatedUser.id ? updatedUser : u,
          );
          setUsers(updatedUsers); // you'll need to lift users to state
          setSelectedUser(updatedUser); // update modal with latest data
        }}
        onOpenChange={(open: boolean) => {
          if (!open) setSelectedUser(null);
        }}
      />
    </>
  );
}
