import { Link } from "react-router-dom";
import "./FeaturedProducts.css";

const featuredProducts = [
  {
    name: "NexaRTX 5200",
    category: "GPU",
    price: "$749",
    highlight: "Next-gen graphics for 4K performance.",
    rating: "★★★★☆",
    reviews: 128,
  },
  {
    name: "Quantum Core X9",
    category: "CPU",
    price: "$399",
    highlight: "High clock speeds for creative workflows.",
    rating: "★★★★★",
    reviews: 94,
  },
  {
    name: "HyperSync DDR5",
    category: "RAM",
    price: "$189",
    highlight: "Ultra-fast memory for seamless multitasking.",
    rating: "★★★★☆",
    reviews: 76,
  },
];

const FeaturedProducts = () => {
  return (
    <section className="featured-products-section py-5 bg-light" id="featured-products">
      <div className="container">
        <div className="featured-products-header mb-4 mb-lg-5">
          <div className="featured-products-heading">
            <p className="text-uppercase text-primary mb-2 small fw-semibold">
              Featured products
            </p>
            <h2 className="fw-bold mb-2">Top picks for your next build</h2>
            <p className="featured-products-subtitle mb-0">
              Explore standout components chosen for performance, reliability,
              and everyday upgrade value.
            </p>
          </div>

          <Link to="/products" className="btn btn-outline-primary rounded-pill px-4 featured-products-action">
            View All
          </Link>
        </div>

        <div className="row g-4">
          {featuredProducts.map((product) => (
            <div key={product.name} className="col-md-6 col-xl-4">
              <div className="card featured-product-card border-0 rounded-4 shadow-sm h-100 p-4">
                <div className="product-thumb mb-4" />
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge bg-primary bg-opacity-10 text-primary py-2 px-3 rounded-pill">
                    {product.category}
                  </span>
                  <span className="product-rating text-warning">
                    {product.rating}
                  </span>
                </div>
                <h5 className="fw-bold mb-2">{product.name}</h5>
                <p className="text-muted mb-4">{product.highlight}</p>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="fw-bold fs-5">{product.price}</div>
                    <div className="text-muted small">
                      {product.reviews} reviews
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm rounded-pill">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
