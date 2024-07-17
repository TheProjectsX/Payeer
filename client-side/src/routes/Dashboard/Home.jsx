import { useContext } from "react";
import UserDataContext from "../../context/context";

export const Home = () => {
  const context = useContext(UserDataContext);
  const { userAuthData } = context;
  return (
    <section>
      <h2 className="font-lato font-semibold text-2xl mb-8 text-center dark:text-white">
        Welcome to your Dashboard!
      </h2>

      <div className="flex justify-between gap-4 p-5 rounded-lg bg-gray-700 dark:text-white">
        <div>
          <h3 className="text-xl mb-3">
            Name: <span className="font-bold">{userAuthData.name}</span>
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
    </section>
  );
};
