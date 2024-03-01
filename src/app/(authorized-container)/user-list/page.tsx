"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("api/v1/users");
      if (response.data.count != 0) {
        setUsers(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (userId: string) => {
    try {
      const toDelete = confirm("Are you sure, you want to delete the user?");
      if (toDelete) {
        const response = await axios.delete(`api/v1/users/${userId}`);
        if (response.data.success) {
          const updatedUsers = users.filter((user: any) => user.id == userId);
          setUsers(updatedUsers);
        }
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-4xl text-center text-black">User List</h1>
      <div className="rounded-lg border border-gray-200 drop-shadow-xl m-5">
        <table className="w-full rounded-md border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-500">
            <tr>
              <th className="px-5 py-4 text-sm text-white font-bold">Name</th>
              <th className="px-5 py-4 text-sm text-white font-bold">Email</th>
              <th className="px-5 py-4 text-sm text-white font-bold">Role</th>
              <th className="px-5 py-4 text-sm text-white font-bold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users!.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-200">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role.name}</td>
                <td className="px-4 py-3 cursor-pointer">
                  <Trash onClick={() => onDelete(user.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
