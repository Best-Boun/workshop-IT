import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios";

const GoogleButton = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/";
    } catch (err) {
      console.log(err);
      console.log(err.response);
      console.log(err.response?.data);

      alert(err.response?.data?.message || "Google Login Failed");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => alert("Google Login Failed")}
      />
    </div>
  );
};

export default GoogleButton;
