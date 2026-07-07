import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";



const AddProduct = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);


 const fetchCategories = async () => {
   try {
     const res = await api.get("/products/categories/all");
     setCategories(res.data.data);
   } catch (err) {
     console.error(err);
   }
 };

    useEffect(() => {
      fetchCategories();
    }, []);

   
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     const data = new FormData();

     Object.keys(formData).forEach((key) => {
       data.append(key, formData[key]);
     });

     const response = await api.post("/products", data, {
       headers: {
         "Content-Type": "multipart/form-data",
       },
     });

     await Swal.fire({
       icon: "success",
       title: "Success!",
       text: response.data.message || "Product created successfully.",
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
      console.error("Add Product Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add product.",
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Add Product</h2>
          <p className="text-muted mb-0">Create a new product</p>
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
                <select
                  className="form-select"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                >
                  <option value="">Select Warranty</option>
                  <option value="No Warranty">No Warranty</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                  <option value="5 Years">5 Years</option>
                </select>
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
                <select
                  className="form-select"
                  name="warranty_provider"
                  value={formData.warranty_provider}
                  onChange={handleChange}
                >
                  <option value="">Select Warranty Service</option>
                  <option value="Carry-in Service">Carry-in Service</option>
                  <option value="On-site Service">On-site Service</option>
                  <option value="Pick-up & Return">Pick-up & Return</option>
                  <option value="International Warranty">
                    International Warranty
                  </option>
                </select>
              </div>

              {/* Price */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
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
                  min="0"
                  className="form-control"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </div>

              {/* Image URL */}
              <div className="col-12 mb-3">
                <label className="form-label">Product Image</label>

                <input
                  type="file"
                  className="form-control"
                  name="image"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files[0],
                    })
                  }
                />
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
                  Add Product
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};



export default AddProduct;
