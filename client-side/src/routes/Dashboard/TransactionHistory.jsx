import { useLoaderData } from "react-router-dom";

const TransactionHistory = () => {
  const transactionsData = useLoaderData().history;

  return (
    <section>
      <h2 className="font-lato font-semibold text-3xl mb-8 text-center dark:text-white">
        Your Transaction History
      </h2>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {transactionsData.length === 0 ? (
          <div className="p-5 text-center font-semibold text-xl italic">
            No Items to Show!
          </div>
        ) : (
          <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transactionsData.history.map((item) => (
                <tr
                  key={item._id}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.action
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </th>
                  <td className="px-6 py-4">{item.sender}</td>
                  <td className="px-6 py-4">{item.recipient}</td>
                  <td className="px-6 py-4">{item.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">{item.fee.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {item.status === "pending" ? (
                      <span className="text-red-500 font-semibold">
                        Pending
                      </span>
                    ) : (
                      <span className="text-green-500 font-semibold">
                        Resolved
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

export default TransactionHistory;
