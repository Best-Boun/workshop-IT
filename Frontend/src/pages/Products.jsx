import { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");

        console.log(res.data);

        setProducts(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Products</h2>

      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={`http://localhost:5000/uploads/${product.image}`}
                className="card-img-top"
                alt={product.name}
                style={{
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>

                <p className="text-muted mb-2">
                  <strong>Brand:</strong> {product.brand}
                </p>

                <p className="card-text flex-grow-1">{product.description}</p>

                <h4 className="text-primary mb-3">
                  ฿{Number(product.price).toLocaleString()}
                </h4>

                <button className="btn btn-primary w-100">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
