import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createCategory } from "../../services/categoryService";

const AddCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData({
      ...formData,
      image: file,
    });

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await createCategory(data);

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.message || "Category created successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      setFormData({
        name: "",
        image: "",
      });
      setPreview("");

      navigate("/admin/categories");
    } catch (error) {
      console.error("Add Category Error:", error);

      Swal.fire({
        icon: "error",
        title: "Create Failed",
        text: error.response?.data?.message || "Failed to create category.",
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Add Category</h2>
          <p className="text-muted mb-0">Create a new category</p>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Category Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
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

              <div className="col-12 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setFormData({
                      name: "",
                      image: "",
                    });
                    setPreview("");
                  }}
                >
                  Clear
                </button>

                <button type="submit" className="btn btn-primary">
                  Add Category
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
