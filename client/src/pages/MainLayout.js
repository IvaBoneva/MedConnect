import NavigationBar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <NavigationBar />
      <Outlet />
    </>
  );
};

export default MainLayout;
