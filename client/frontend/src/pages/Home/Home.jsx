import React from 'react';
import Header from '../../components/Header/Header';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import CoffeeHeroSection from '../../components/CoffeeHeroSection/CoffeeHeroSection';

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
