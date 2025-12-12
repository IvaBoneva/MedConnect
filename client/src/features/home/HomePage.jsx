import { useAuth } from "../../context/AuthContext";
import {HomePageLayout} from "./components/HomePageLayout";

const HomePage = () => {
  let { user } = useAuth();
  
  return (
    <HomePageLayout user={user} />
  )

};

export default HomePage;