import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Routers
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "./routes/Login.jsx";
import SignUp from "./routes/SIgnUp.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Dashboard from "./routes/Dashboard/Dashboard.jsx";
import { Home } from "./routes/Dashboard/Home.jsx";
import SendMoney from "./routes/Dashboard/SendMoney.jsx";
import CashInRequest from "./routes/Dashboard/CashInRequest.jsx";
import CashOutRequest from "./routes/Dashboard/CashOutRequest.jsx";
import TransactionHistory from "./routes/Dashboard/TransactionHistory.jsx";
import AgentCashInRequests from "./routes/Dashboard/AgentCashInRequests.jsx";
import AgentCashOutRequests from "./routes/Dashboard/AgentCashOutRequests.jsx";
import AgentPrivateRoute from "./components/AgentPrivateRoute.jsx";
import AdminPrivateRoute from "./components/AdminPrivateRoute.jsx";
import AdminManageUsers from "./routes/Dashboard/AdminManageUsers.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" />,
      },
      {
        path: "/login",
        element: (
          <PrivateRoute reverse>
            <Login />
          </PrivateRoute>
        ),
      },
      {
        path: "/sign-up",
        element: (
          <PrivateRoute reverse>
            <SignUp />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
        children: [
          {
            path: "/dashboard",
            element: <Home />,
            loader: () =>
              fetch(`${import.meta.env.VITE_SERVER_URL}/me`, {
                credentials: "include",
              }),
          },
          {
            path: "/dashboard/send-money",
            element: <SendMoney />,
          },
          {
            path: "/dashboard/cash-in",
            element: <CashInRequest />,
          },
          {
            path: "/dashboard/cash-out",
            element: <CashOutRequest />,
          },
          {
            path: "/dashboard/transactions",
            element: <TransactionHistory />,
            loader: () =>
              fetch(`${import.meta.env.VITE_SERVER_URL}/me/transactions`, {
                credentials: "include",
              }),
          },
          {
            path: "/dashboard/cash-in-requests",
            element: (
              <AgentPrivateRoute>
                {" "}
                <AgentCashInRequests />
              </AgentPrivateRoute>
            ),
            loader: () =>
              fetch(
                `${import.meta.env.VITE_SERVER_URL}/agent/pending/cash-in`,
                {
                  credentials: "include",
                }
              ),
          },
          {
            path: "/dashboard/cash-out-requests",
            element: (
              <AgentPrivateRoute>
                <AgentCashOutRequests />
              </AgentPrivateRoute>
            ),
            loader: () =>
              fetch(
                `${import.meta.env.VITE_SERVER_URL}/agent/pending/cash-out`,
                {
                  credentials: "include",
                }
              ),
          },
          {
            path: "/dashboard/manage-users",
            element: (
              <AdminPrivateRoute>
                <AdminManageUsers />
              </AdminPrivateRoute>
            ),
            loader: () =>
              fetch(`${import.meta.env.VITE_SERVER_URL}/admin/users`, {
                credentials: "include",
              }),
          },
          {
            path: "/dashboard/all-transactions",
            element: (
              <AdminPrivateRoute>
                <TransactionHistory />
              </AdminPrivateRoute>
            ),
            loader: () =>
              fetch(`${import.meta.env.VITE_SERVER_URL}/admin/transactions`, {
                credentials: "include",
              }),
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
