import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import Swal from "sweetalert2";

const CashOutRequest = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendMoney = async (e) => {
    e.preventDefault();

    const form = e.target;
    const recipient = form.recipient.value;
    const amount = form.amount.value;
    const pin = form.pin.value;

    const body = {
      recipient,
      amount,
      pin,
    };

    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/me/cash-out-request`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );
    const data = await response.json();

    if (data.success) {
      Swal.fire({
        title: "Success!",
        text: `Cash Out Request of ${amount} tk sent to ${recipient}`,
        icon: "success",
      });
      form.reset();
    } else {
      Swal.fire({
        title: "Error!",
        text: data.message,
        icon: "error",
      });
    }

    setLoading(false);
  };

  return (
    <section>
      <h2 className="font-lato font-semibold text-3xl mb-8 text-center dark:text-white">
        Send Cash Out Request
      </h2>

      <div className="flex justify-center">
        <div className="p-6 space-y-4 md:space-y-6 rounded-lg shadow-lg border md:mt-0 w-full sm:w-[34rem] dark:bg-gray-800 border-gray-300 dark:border-gray-700">
          <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl dark:text-white text-center underline underline-offset-8">
            Fill in Informations
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSendMoney}>
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Enter Agent Number <span className="text-red-600">*</span>
                <input
                  type="text"
                  name="recipient"
                  minLength={11}
                  maxLength={11}
                  className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                  placeholder="01900000000"
                  required
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-white">
                Enter Amount <span className="text-red-600">*</span>
                <input
                  type="number"
                  name="amount"
                  min={50}
                  className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                  placeholder="100"
                  required
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-white relative">
                Your PIN Number <span className="text-red-600">*</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="pin"
                  placeholder={showPassword ? "12345" : "••••••"}
                  className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                  required
                />
                <div
                  className="absolute right-1 top-8 text-xl p-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </div>
              </label>
            </div>
            <button
              type="submit"
              name="submit"
              className={`w-full text-white bg-blue-500 hover:bg-blue-600 dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                loading ? "cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? <span className="loading"></span> : "Send Request"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CashOutRequest;
