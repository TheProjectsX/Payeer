import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const number = form.number.value;
    const email = form.email.value;
    const pin = form.pin.value;
    const role = form.role.value;

    if (pin.length !== 5) {
      toast.error("Your PIN Must be 5 characters long");
      return;
    } else if (!/^\d+$/.test(pin)) {
      toast.error("Your PIN Must be numbers only");
      return;
    }

    const body = {
      name,
      number,
      email,
      pin,
      role: role.checked ? "agent" : "user",
    };

    setLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/users/register`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!data.success) {
      toast.error(data.message);
    } else {
      toast.success("Account Created Successfully!");
      navigate("/login");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center sm:px-6 py-8 mx-auto h-screen">
        <h3 className="flex items-center mb-6 text-2xl font-semibold dark:text-white font-lato">
          Hello There!
        </h3>
        <div className="rounded-lg shadow-lg border md:mt-0 min-w-[300px] sm:w-[34rem] xl:p-0 dark:bg-gray-700 border-gray-300 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl dark:text-white text-center underline underline-offset-8">
              Create a New Account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSignUp}>
              <div>
                <label className="block text-sm font-medium dark:text-white">
                  Your Full Name <span className="text-red-600">*</span>
                  <input
                    type="text"
                    name="name"
                    className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                    placeholder="Jhon Deo"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-white">
                  Your Phone Number <span className="text-red-600">*</span>
                  <input
                    type="text"
                    name="number"
                    maxLength={11}
                    minLength={11}
                    className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                    placeholder="01900000000"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-white">
                  Your Email <span className="text-red-600">*</span>
                  <input
                    type="email"
                    name="email"
                    className="mt-2 border-2 outline-none sm:text-sm rounded-lg block w-full p-2.5 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-gray-400"
                    placeholder="name@company.com"
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
                    minLength={5}
                    maxLength={5}
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
              <div className="flex items-center justify-between">
                <div className="ml-3 text-sm">
                  <label className="inline-flex items-center mb-5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="role"
                      className="sr-only peer"
                    />
                    <div className="relative w-8 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-4 after:h-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      SignUp as an Agent
                    </span>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                name="submit"
                className={`w-full text-white bg-blue-500 hover:bg-blue-600 dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                  loading ? "cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? <span className="loading"></span> : "Sign Up"}
              </button>
              <p className="text-sm font-light dark:text-gray-400">
                Already have an Account?{" "}
                <Link
                  to="/login"
                  className="font-medium hover:underline text-[#3b82f6] pl-4"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
