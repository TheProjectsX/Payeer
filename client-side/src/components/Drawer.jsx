import React, { useContext } from "react";
import { RiMenuUnfold3Line2 } from "react-icons/ri";
import { Link } from "react-router-dom";
import UserDataContext from "../context/context";

const Drawer = ({ children }) => {
  const context = useContext(UserDataContext);
  const { userAuthData } = context;

  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content px-5 py-8 h-screen">
          {/* Page content here */}
          <div className="flex justify-end">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-neutral text-xl dark:text-white drawer-button lg:hidden"
            >
              <RiMenuUnfold3Line2 />
            </label>
          </div>
          {children}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 px-4 py-8 space-y-3">
            {/* Sidebar content here */}
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            {userAuthData.role === "admin" ? (
              <li>
                <Link to="/dashboard/manage-users">Manage Users</Link>
              </li>
            ) : (
              <li>
                <Link to="/dashboard/send-money">Send Money</Link>
              </li>
            )}
            {userAuthData.role === "user" && (
              <>
                <li>
                  <Link to="/dashboard/cash-in">Cash In</Link>
                </li>
                <li>
                  <Link to="/dashboard/cash-out">Cash Out</Link>
                </li>
              </>
            )}

            {userAuthData.role === "user" ? (
              <li>
                <Link to="/dashboard/all-transactions">
                  Transaction History
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/dashboard/transactions">Transaction History</Link>
              </li>
            )}
            {userAuthData.role === "agent" ? (
              <>
                <div className="divider"></div>
                <li>
                  <Link to="/dashboard/cash-in-requests">Cash In Requests</Link>
                </li>
                <li>
                  <Link to="/dashboard/cash-out-requests">
                    Cash Out Requests
                  </Link>
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
