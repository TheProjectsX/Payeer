import React from "react";
import Drawer from "../../components/Drawer";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <Drawer>
        <Outlet />
      </Drawer>
    </div>
  );
};

export default Dashboard;
