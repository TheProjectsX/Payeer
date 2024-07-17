import { useContext } from "react";
import UserDataContext from "../context/context";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, reverse = false }) => {
  const context = useContext(UserDataContext);
  const { userAuthData, dataLoading } = context;
  const location = useLocation();

  if (dataLoading) {
    return (
      <div className="flex justify-center p-5">
        <div className="loading loading-lg"></div>
      </div>
    );
  }

  if (!userAuthData && !reverse) {
    return (
      <div className="flex justify-center p-5">
        <div className="loading loading-lg"></div>
        <Navigate to={"/login"} replace={true} state={location.pathname} />
      </div>
    );
  }
  if (userAuthData && reverse) {
    return (
      <div className="flex justify-center p-5">
        <div className="loading loading-lg"></div>
        <Navigate to={location.state ? location.state : "/"} replace={true} />
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
