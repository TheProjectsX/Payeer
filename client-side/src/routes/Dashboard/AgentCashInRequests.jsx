import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import "@sweetalert2/theme-dark";

const AgentCashInRequests = () => {
  const [cashInRequests, setCashInRequests] = useState(
    useLoaderData().requests
  );

  const handleApprove = async (transaction) => {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/agent/approve-cash-in/${
        transaction._id
      }`,
      {
        method: "PUT",
        credentials: "include",
      }
    );
    const data = await response.json();

    if (data.success) {
      Swal.fire({
        title: "Success!",
        text: `Cash In Request of ${transaction.amount} tk from ${transaction.sender} Approved!`,
        icon: "success",
      });

      setCashInRequests(
        cashInRequests.map((item) => {
          if (item._id !== transaction._id) return item;
          return {
            ...item,
            status: "approved",
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
        Cash In Requests
      </h2>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {cashInRequests.length === 0 ? (
          <div className="p-5 text-center font-semibold text-xl italic">
            No Items to Show!
          </div>
        ) : (
          <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Sender
                </th>
                <th scope="col" className="px-6 py-3">
                  Recipient
                </th>
                <th scope="col" className="px-6 py-3">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Fee
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {cashInRequests.map((item) => (
                <tr
                  key={item._id}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td className="px-6 py-4">{item.sender}</td>
                  <td className="px-6 py-4">{item.recipient}</td>
                  <td className="px-6 py-4">{item.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">{item.fee.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {item.status === "pending" ? (
                      <button
                        className="btn btn-success"
                        onClick={() => handleApprove(item)}
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-green-500 font-semibold">
                        Approved
                      </span>
                    )}
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

export default AgentCashInRequests;
