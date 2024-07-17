import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Routers
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./routes/Login.jsx";
import SignUp from "./routes/SIgnUp.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Dashboard from "./routes/Dashboard/Dashboard.jsx";
import { Home } from "./routes/Dashboard/Home.jsx";
import SendMoney from "./routes/Dashboard/SendMoney.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <div>Hello</div>,
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
          },
          {
            path: "/dashboard/send-money",
            element: <SendMoney />,
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
