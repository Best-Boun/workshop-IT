import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";



const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

  

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);

      const product = res.data.data;

      setFormData(product);

      setPreview(
        product.image ? `http://localhost:5000/uploads/${product.image}` : "",
      );
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/categories/all",
      );

      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };
  const [formData, setFormData] = useState({
    category_id: "",
    sku: "",
    name: "",
    brand: "",
    description: "",
    price: "",
    stock: "",
    cpu: "",
    gpu: "",
    ram: "",
    storage: "",
    display: "",
    warranty: "",
    warranty_provider: "",
    image: "",
    featured: 0,
    status: "active",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     const data = new FormData();

     Object.keys(formData).forEach((key) => {
       data.append(key, formData[key]);
     });

     if (image) {
       data.append("image", image);
     }

     const response = await axios.put(
       `http://localhost:5000/api/products/${id}`,
       data,
       {
         headers: {
           "Content-Type": "multipart/form-data",
         },
       },
     );

    await Swal.fire({
      icon: "success",
      title: "Updated!",
      text: response.data.message || "Product updated successfully.",
      timer: 1800,
      showConfirmButton: false,
    });

    setFormData({
      category_id: "",
      sku: "",
      name: "",
      brand: "",
      description: "",
      price: "",
      stock: "",
      cpu: "",
      gpu: "",
      ram: "",
      storage: "",
      display: "",
      warranty: "",
      warranty_provider: "",
      image: "",
      featured: 0,
      status: "active",
    });

    navigate("/admin/products");
    } catch (error) {
      console.error("Update Product Error:", error);

     Swal.fire({
       icon: "error",
       title: "Update Failed",
       text: error.response?.data?.message || "Failed to update product.",
     });
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Edit Product</h2>
          <p className="text-muted mb-0">Update product information</p>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Product Name */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Category */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>

                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  className="form-control"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Enter brand"
                  required
                />
              </div>

              {/* Warranty */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Warranty</label>
                <input
                  type="text"
                  className="form-control"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  placeholder="3 Years"
                />
              </div>

              {/* SKU */}
              <div className="col-md-6 mb-3">
                <label className="form-label">SKU</label>
                <input
                  type="text"
                  className="form-control"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="SKU-001"
                />
              </div>

              {/* CPU */}
              <div className="col-md-6 mb-3">
                <label className="form-label">CPU</label>
                <input
                  type="text"
                  className="form-control"
                  name="cpu"
                  value={formData.cpu}
                  onChange={handleChange}
                  placeholder="Intel Core i7"
                />
              </div>

              {/* GPU */}
              <div className="col-md-6 mb-3">
                <label className="form-label">GPU</label>
                <input
                  type="text"
                  className="form-control"
                  name="gpu"
                  value={formData.gpu}
                  onChange={handleChange}
                  placeholder="RTX 4060"
                />
              </div>

              {/* RAM */}
              <div className="col-md-6 mb-3">
                <label className="form-label">RAM</label>
                <input
                  type="text"
                  className="form-control"
                  name="ram"
                  value={formData.ram}
                  onChange={handleChange}
                  placeholder="16GB DDR5"
                />
              </div>

              {/* Storage */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Storage</label>
                <input
                  type="text"
                  className="form-control"
                  name="storage"
                  value={formData.storage}
                  onChange={handleChange}
                  placeholder="1TB SSD"
                />
              </div>

              {/* Display */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Display</label>
                <input
                  type="text"
                  className="form-control"
                  name="display"
                  value={formData.display}
                  onChange={handleChange}
                  placeholder='15.6" 165Hz'
                />
              </div>

              {/* Warranty Provider */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Warranty Service</label>
                <input
                  type="text"
                  className="form-control"
                  name="warranty_provider"
                  value={formData.warranty_provider}
                  onChange={handleChange}
                  placeholder="On-site"
                />
              </div>

              {/* Price */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Stock */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  className="form-control"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Product Image</label>

                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {preview && (
                  <div className="mt-3">
                    <img
                      src={preview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{
                        width: "220px",
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="col-12 mb-4">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                />
              </div>

              {/* Buttons */}
              <div className="col-12 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setFormData({
                      category_id: "",
                      sku: "",
                      name: "",
                      brand: "",
                      description: "",
                      price: "",
                      stock: "",
                      cpu: "",
                      gpu: "",
                      ram: "",
                      storage: "",
                      display: "",
                      warranty: "",
                      warranty_provider: "",
                      image: "",
                      featured: 0,
                      status: "active",
                    })
                  }
                >
                  Clear
                </button>

                <button type="submit" className="btn btn-primary">
                  Update Product
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;