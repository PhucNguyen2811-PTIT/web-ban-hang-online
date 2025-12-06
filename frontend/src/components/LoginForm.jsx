import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // path tùy bạn

export default function LoginForm({ navigate }) {
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      // Cập nhật context ngay
      login(data.user, data.token);
      navigate("/"); // về home
    } else {
      alert(data.error || "Login failed");
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Đăng nhập
      </h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
      />
      <input
        type="password"
        name="password"
        placeholder="Mật khẩu"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
      />

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md"
      >
        Đăng nhập
      </button>
    </form>
  );
}
