import { useContext } from "react";
import UserDataContext from "../../context/context";
import { useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";

export const Home = () => {
  const context = useContext(UserDataContext);
  const { userAuthData, setUserAuthData } = context;
  const loadedUserInfo = useLoaderData();
  setUserAuthData(loadedUserInfo);

  return (
    <section>
      <h2 className="font-lato font-semibold text-2xl mb-8 text-center dark:text-white">
        Welcome to your Dashboard!
      </h2>

      <div className="flex justify-between gap-4 p-5 rounded-lg bg-gray-700 dark:text-white mb-6">
        <div>
          <h3 className="text-xl mb-3">
            Name: <span className="font-bold">{userAuthData.name}</span>{" "}
            <span className="italic">({userAuthData.role})</span>
          </h3>
          <p>Email: {userAuthData.email}</p>
          <p>Number: {userAuthData.number}</p>
        </div>
        <p>
          Balance:{" "}
          <span className="font-semibold font-lato">
            {userAuthData.balance}
          </span>{" "}
          tk
        </p>
      </div>

      <button
        className="btn btn-neutral"
        onClick={async (e) => {
          await fetch(`${import.meta.env.VITE_SERVER_URL}/logout`, {
            credentials: "include",
          });
          setUserAuthData(null);
          toast.success("Logout Successful!");
        }}
      >
        LogOut
      </button>
    </section>
  );
};
