import { Link } from "react-router-dom";
import "./Categories.css";

const createCategoryImage = (kind) => {
  const visuals = {
    computerSet: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" fill="none">
        <rect width="640" height="420" rx="40" fill="#E0F2FE"/>
        <rect x="118" y="92" width="278" height="176" rx="18" fill="#0F172A"/>
        <rect x="132" y="106" width="250" height="148" rx="12" fill="url(#screen)"/>
        <rect x="206" y="278" width="102" height="18" rx="9" fill="#94A3B8"/>
        <rect x="170" y="296" width="174" height="18" rx="9" fill="#CBD5E1"/>
        <rect x="432" y="74" width="96" height="214" rx="20" fill="#111827"/>
        <circle cx="479" cy="126" r="18" fill="#38BDF8" fill-opacity="0.8"/>
        <circle cx="479" cy="178" r="28" fill="#1D4ED8" fill-opacity="0.55"/>
        <circle cx="479" cy="236" r="14" fill="#38BDF8" fill-opacity="0.8"/>
        <defs>
          <linearGradient id="screen" x1="132" y1="106" x2="382" y2="254" gradientUnits="userSpaceOnUse">
            <stop stop-color="#2563EB"/>
            <stop offset="1" stop-color="#38BDF8"/>
          </linearGradient>
        </defs>
      </svg>
    `,
    notebook: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" fill="none">
        <rect width="640" height="420" rx="40" fill="#DBEAFE"/>
        <rect x="132" y="76" width="376" height="226" rx="28" fill="#0F172A"/>
        <rect x="152" y="96" width="336" height="186" rx="18" fill="url(#display)"/>
        <rect x="118" y="300" width="404" height="24" rx="12" fill="#CBD5E1"/>
        <rect x="202" y="314" width="236" height="18" rx="9" fill="#94A3B8"/>
        <circle cx="474" cy="128" r="28" fill="#38BDF8" fill-opacity="0.7"/>
        <circle cx="214" cy="240" r="18" fill="#0EA5E9" fill-opacity="0.5"/>
        <defs>
          <linearGradient id="display" x1="152" y1="96" x2="488" y2="282" gradientUnits="userSpaceOnUse">
            <stop stop-color="#1D4ED8"/>
            <stop offset="1" stop-color="#0EA5E9"/>
          </linearGradient>
        </defs>
      </svg>
    `,
  };

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(visuals[kind])}`;
};

const categories = [
  {
    name: "Computer Set",
    description: "Prebuilt gaming and workstation computer sets with balanced performance and warranty support.",
    image: createCategoryImage("computerSet"),
  },
  {
    name: "Notebook",
    description: "Portable notebooks for gaming, study, and productivity with modern specs and official warranty.",
    image: createCategoryImage("notebook"),
  },
];

const Categories = () => {
  return (
    <section className="py-5" id="products">
      <div className="container">
        <div className="mb-4 text-center">
          <p className="text-uppercase text-primary mb-2 small fw-semibold">
            Shop by category
          </p>
          <h2 className="fw-bold">Popular categories for your next setup</h2>
        </div>
        <div className="row g-4">
          {categories.map((category) => (
            <div key={category.name} className="col-12 col-lg-6">
              <Link
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="category-card-link"
              >
                <div className="card category-card border-0 rounded-4 shadow-sm h-100 overflow-hidden">
                  <div className="category-card-media">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="category-card-image"
                    />
                  </div>

                  <div className="category-card-body p-4 p-lg-5">
                    <span className="category-chip">Hardware Category</span>
                    <h3 className="category-card-title mt-3 mb-2">{category.name}</h3>
                    <p className="category-card-description mb-4">
                      {category.description}
                    </p>

                    <div className="category-card-action">
                      <span>Browse Products</span>
                      <span className="category-card-arrow">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
