import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Thêm state loading để tránh bấm nhiều lần
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true); // Bắt đầu loading

    try {
      // 1. Gọi API (Sửa tên biến thành 'res')
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // 2. Đọc dữ liệu (Chỉ đọc 1 lần)
      const data = await res.json();

      // 3. Kiểm tra kết quả (Dùng biến 'res' thay vì 'response')
      if (res.ok) {
        // --- THÀNH CÔNG ---
        login(data.user, data.token);

        // Chuyển trang theo quyền
        if (data.user.role === "admin") {
          navigate("/admin/products");
        } else {
          navigate("/");
        }
      } else {
        // --- THẤT BẠI ---
        alert(data.error || "Sai email hoặc mật khẩu!");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      alert("Không thể kết nối đến server!");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Đăng Nhập
      </h2>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email của bạn"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md
             text-gray-900 bg-white
             placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md
             text-gray-900 bg-white
             placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Nút Đăng nhập: Đã thêm style cứng màu xanh để chắc chắn hiển thị đúng */}
      <button
        type="submit"
        disabled={loading}
        style={{ backgroundColor: "#2563EB", color: "white" }} // Màu xanh dương chuẩn
        className="w-full py-2 font-semibold rounded-md hover:opacity-90 transition duration-200"
      >
        {loading ? "Đang xử lý..." : "Đăng Nhập"}
      </button>
    </form>
  );
}
