import { Outlet } from "react-router-dom";
import UserDataContext from "./context/context";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

import "@sweetalert2/theme-dark";
import { Helmet } from "react-helmet";

function App() {
  const [userAuthData, setUserAuthData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/me`, {
        credentials: "include",
      });

      const data = await response.json();
      if (!data.success) {
        setUserAuthData(null);
      } else {
        setUserAuthData(data);
      }
      setDataLoading(false);
    };
    loadData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Payeer - Mobile Financial Service</title>
      </Helmet>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="max-w-[1100px] mx-auto font-ubuntu shadow-2xl">
        <UserDataContext.Provider
          value={{ userAuthData, setUserAuthData, dataLoading, setDataLoading }}
        >
          <div className="bg-white dark:bg-gray-800">
            <Outlet />
          </div>
        </UserDataContext.Provider>
      </div>
    </>
  );
}

export default App;
