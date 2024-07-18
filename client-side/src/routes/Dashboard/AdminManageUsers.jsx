import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import "@sweetalert2/theme-dark";

const AdminManageUsers = () => {
  const [allUsers, setAllUsers] = useState(useLoaderData().users);

  const handleActivate = async (user) => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/admin/activate/${user._id}`,
      {
        method: "PUT",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (data.success) {
      Swal.fire({
        title: "Success!",
        text: `Account Activated!`,
        icon: "success",
      });

      setAllUsers(
        allUsers.map((item) => {
          if (item._id !== user._id) return item;
          return {
            ...item,
            status: "active",
          };
        })
      );
    } else {
      Swal.fire({
        title: "Error!",
        text: data.message,
        icon: "error",
      });
    }
  };
  const handleBlock = async (user) => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/admin/block/${user._id}`,
      {
        method: "PUT",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (data.success) {
      Swal.fire({
        title: "Success!",
        text: `Account Blocked!`,
        icon: "success",
      });

      setAllUsers(
        allUsers.map((item) => {
          if (item._id !== user._id) return item;
          return {
            ...item,
            status: "blocked",
          };
        })
      );
    } else {
      Swal.fire({
        title: "Error!",
        text: data.message,
        icon: "error",
      });
    }
  };

  return (
    <section>
      <h2 className="font-lato font-semibold text-3xl mb-8 text-center dark:text-white">
        Manage Users
      </h2>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {allUsers.length === 0 ? (
          <div className="p-5 text-center font-semibold text-xl italic">
            No Items to Show!
          </div>
        ) : (
          <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Number
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Role
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3"></th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((item) => (
                <tr
                  key={item._id}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.name}
                  </th>
                  <td className="px-6 py-4">{item.number}</td>
                  <td className="px-6 py-4">{item.email}</td>
                  <td className="px-6 py-4">
                    {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                  </td>
                  <td className="px-6 py-4">
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="btn btn-success !pointer-events-auto disabled:cursor-not-allowed"
                      disabled={item.status === "active"}
                      onClick={() => handleActivate(item)}
                    >
                      Activate
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="btn btn-error"
                      disabled={item.status === "blocked"}
                      onClick={() => handleBlock(item)}
                    >
                      Block
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default AdminManageUsers;
