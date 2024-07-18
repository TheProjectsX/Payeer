import { useContext, useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserDataContext from "../context/context";
import { Helmet } from "react-helmet";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const context = useContext(UserDataContext);
  const { setUserAuthData } = context;

  const handleLogIn = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const pin = form.pin.value;

    const body = {
      email,
      pin,
    };

    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/users/login`,
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

    if (!data.success) {
      toast.error(data.message);
    } else {
      toast.success("Login Successful!");
      setUserAuthData(data.userData);
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Login to your Account - Payeer</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center sm:px-6 py-8 mx-auto h-screen">
        <h3 className="flex items-center mb-6 text-2xl font-semibold dark:text-white font-lato">
          Welcome Back!
        </h3>
        <div className="rounded-lg shadow-lg border md:mt-0 w-full sm:w-[34rem] xl:p-0 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl dark:text-white text-center underline underline-offset-8">
              Login to Your Account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogIn}>
              <div>
                <label className="block text-sm font-medium dark:text-white">
                  Your Email / Number <span className="text-red-600">*</span>
                  <input
                    type="text"
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
                  <label className="dark:text-gray-300 items-center flex gap-2">
                    <input
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border rounded focus:ring-3 bg-gray-700 border-gray-600 focus:ring-[#2563eb] ring-offset-gray-800"
                      required=""
                    />
                    Remember me
                  </label>
                </div>
                <a className="text-sm font-medium hover:underline text-[#3b82f6] cursor-pointer">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                name="submit"
                className={`w-full text-white bg-blue-500 hover:bg-blue-600 dark:bg-[#2563eb] dark:hover:bg-[#1d4ed8] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                  loading ? "cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? <span className="loading"></span> : "Login"}
              </button>
              <p className="text-sm font-light dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  to="/sign-up"
                  className="font-medium hover:underline text-[#3b82f6] pl-4"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
