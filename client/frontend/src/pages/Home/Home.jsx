import React from 'react';
import Header from '../../components/Header/Header';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import CoffeeHeroSection from '../../components/CoffeeHeroSection/CoffeeHeroSection';
import Footer from '../../components/Footer/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <CoffeeHeroSection />
      <FoodDisplay />
    </>
  );
}

export default Home;
