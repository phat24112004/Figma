import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


//   // Hàm đăng nhập với API
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("https://your-api-url.com/login", {
//         username: email, // Thay bằng field phù hợp với API của bạn
//         password,
//       });

//       // Lưu token vào localStorage
//       const token = response.data.data.jwt_token;
//       localStorage.setItem("jwt_token", token);

//       // Điều hướng đến dashboard sau khi đăng nhập thành công
//       navigate("/dashboard");
//     } catch (err) {
//       setError("Sai email hoặc mật khẩu. Vui lòng thử lại.");
//       console.error("Login error:", err.response?.data || err.message);
//     }
//   };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "khoa.tran@yopmail.com" && password === "@Abc123456") {
      navigate("/dashboard");
    } else {
      setError("Sai email hoặc mật khẩu. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 border border-gray-300 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">TALENTX</h1>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              error ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-1 focus:ring-purple-500`}
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="......"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              error ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-1 focus:ring-purple-500`}
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center text-sm text-gray-700">
            <input type="checkbox" className="mr-2" />
            Remember for 30 days
          </label>
          <a href="#" className="text-sm text-purple-600 hover:underline">
            Forgot password
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md text-sm hover:bg-purple-700 transition"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
