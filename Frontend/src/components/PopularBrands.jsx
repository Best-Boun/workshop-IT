import { Link } from "react-router-dom";
import "./PopularBrands.css";

const brands = [
  { name: "ASUS", accent: "brand-asus" },
  { name: "MSI", accent: "brand-msi" },
  { name: "Lenovo", accent: "brand-lenovo" },
  { name: "Dell", accent: "brand-dell" },
  { name: "HP", accent: "brand-hp" },
  { name: "Acer", accent: "brand-acer" },
];

const PopularBrands = () => {
  return (
    <section className="popular-brands-section py-5">
      <div className="container">
        <div className="popular-brands-header text-center mb-4 mb-lg-5">
          <p className="text-uppercase text-primary mb-2 small fw-semibold">
            Popular brands
          </p>
          <h2 className="fw-bold mb-2">Trusted brands for every setup</h2>
          <p className="popular-brands-subtitle mb-0 mx-auto">
            Explore leading hardware and notebook brands with dependable
            performance, modern design, and official warranty support.
          </p>
        </div>

        <div className="row g-3 g-lg-4">
          {brands.map((brand) => (
            <div key={brand.name} className="col-6 col-md-4 col-xl-2">
              <Link
                to={`/products?brand=${encodeURIComponent(brand.name)}`}
                className="brand-card-link"
              >
                <div className="brand-card card border-0 rounded-4 shadow-sm h-100">
                  <div className={`brand-logo ${brand.accent}`}>{brand.name}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBrands;