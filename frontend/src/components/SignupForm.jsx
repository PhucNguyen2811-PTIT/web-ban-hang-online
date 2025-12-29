import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // path tùy bạn

export default function SignupForm({ navigate }) {
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) return alert("Mật khẩu không khớp");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });
    const data = await res.json();

    if (res.ok) {
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/auth"); // về login
    } else {
      alert(data.error || "Signup failed");
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Đăng ký
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Họ và tên"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
      />
      <input
        type="text"
        name="phone"
        placeholder="Số điện thoại"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
      />
      <input
        type="password"
        name="password"
        placeholder="Mật khẩu"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Xác nhận mật khẩu"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
      />

      <button
        type="submit"
        className="w-full py-2 bg-green-500 text-white rounded-md"
      >
        Đăng ký
      </button>
    </form>
  );
}
