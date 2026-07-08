import { GoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";
import api from "../api/axios";

const GoogleButton = ({ disabled = false }) => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ชั่วคราวให้ทุก Role กลับหน้า Home
      window.location.href = "/";
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Google Sign In Failed",
        text: err.response?.data?.message || "Unable to sign in with Google.",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  return (
    <div className="d-flex justify-content-center">
      {disabled ? (
        <button className="btn btn-outline-secondary w-100" disabled>
          Loading...
        </button>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() =>
            Swal.fire({
              icon: "error",
              title: "Google Sign In Failed",
              text: "Unable to connect to Google.",
              confirmButtonColor: "#dc3545",
            })
          }
        />
      )}
    </div>
  );
};

export default GoogleButton;
