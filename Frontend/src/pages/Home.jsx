import "./Home.css";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import PopularBrands from "../components/PopularBrands";
import BestSellers from "../components/BestSellers";
import PromotionBanner from "../components/PromotionBanner";
import WhyChooseUs from "../components/WhyChooseUs";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      <main className="home-main">
        <Hero />

        <div className="home-section-shell home-section-shell--primary">
          <Categories />
        </div>

        <div className="home-section-shell home-section-shell--featured">
          <FeaturedProducts />
        </div>

        <div className="home-section-shell home-section-shell--standard">
          <PopularBrands />
        </div>

        <div className="home-section-shell home-section-shell--standard">
          <BestSellers />
        </div>

        <div className="home-section-shell home-section-shell--promo">
          <PromotionBanner />
        </div>

        <div id="about" className="home-section-shell home-section-shell--trust">
          <WhyChooseUs />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
