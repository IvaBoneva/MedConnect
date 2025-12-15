import NavigationBar from "../features/navigation/NavigationBar";
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
