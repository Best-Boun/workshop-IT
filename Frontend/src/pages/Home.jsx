import "./Home.css";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import BestSellers from "../components/BestSellers";
import PromotionBanner from "../components/PromotionBanner";
import WhyChooseUs from "../components/WhyChooseUs";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <FeaturedProducts />
        <BestSellers />
        <PromotionBanner />
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
