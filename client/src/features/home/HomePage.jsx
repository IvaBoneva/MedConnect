import React from "react";
import { Container, Row } from "react-bootstrap";
import HeroImage from "./components/HeroImage";
import WelcomeSection from "./components/WelcomeSection";
import FeatureCard from "./components/FeatureCard";
import HomeBorder from "./components/HomeBorder";
import { useAuth } from "../../context/AuthContext";
import {HomePageLayout} from "./components/HomePageLayout";

const HomePage = () => {
  let { user } = useAuth();
  
  return (
    <HomePageLayout user={user} />
  )
  
};

export default HomePage;