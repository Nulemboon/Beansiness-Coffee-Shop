import React from 'react';
import './CoffeeHeroSection.css';
import coffeeImage from '../../assets/coffee_shop_scene.jpg'; 

const CoffeeHeroSection = () => {
  return (
    <div className="coffee-hero-section">
      <div className="coffee-hero-text">
        <h1>Embracing the Art of Coffee Craftsmanship</h1>
        <p>Since 2024</p>
        <p>
          Our journey in the coffee industry began over four decades ago with a simple mission: to create the finest coffee experience. From the very beginning, we have been committed to sourcing the best Arabica beans from renowned coffee-growing regions across the globe. Our dedication to quality and craftsmanship has set us apart as we meticulously roast each batch to perfection.
        </p>
        <p>
          We believe that great coffee starts with the perfect bean. Our team travels far and wide to establish direct relationships with farmers who share our passion for excellence. By understanding the intricate details of coffee cultivation, we ensure that every cup you enjoy is a testament to the hard work and expertise of these dedicated growers.
        </p>
        <p>
          In our roastery, science meets art. Our master roasters bring years of experience and a keen sense of detail to the roasting process. Each batch is carefully monitored and adjusted to bring out the unique flavors and aromas locked within the beans. This dedication to precision and consistency ensures that every sip is a delightful experience, bursting with rich and complex flavors.
        </p>
        <p>
          Our commitment to sustainability is as strong as our dedication to quality. We strive to implement eco-friendly practices throughout our supply chain, from using biodegradable packaging to supporting environmentally responsible farming techniques. By choosing our coffee, you are not only indulging in a premium beverage but also contributing to a healthier planet.
        </p>
        <p>
          Join us on a journey of flavor and tradition. Whether you prefer a bold espresso, a smooth latte, or a delicate pour-over, our diverse selection caters to all tastes and preferences. Discover the joy of coffee as it was meant to be enjoyed - with passion, dedication, and an unwavering commitment to excellence.
        </p>
      </div>
      <div className="coffee-hero-image-container">
        <img src={coffeeImage} alt="Coffee" className="coffee-hero-image" />
      </div>
    </div>
  );
};

export default CoffeeHeroSection;
