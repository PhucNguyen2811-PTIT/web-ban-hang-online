import { Link } from "react-router-dom";
import { Menu, ShoppingCart, User, Search } from "lucide-react";
import { useState } from "react";

const categories = ["Laptop HP", "Laptop Lenovo", "Laptop Asus", "Laptop Dell"];
const userOptions = ["Hồ sơ", "Đơn hàng", "Đăng xuất"];

export default function Header() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header
      className="flex items-center justify-between px-4 py-3 shadow sticky top-0 z-10
                       bg-linear-to-r from-[#F51616] to-[#BF1313]"
    >
      {/* Logo + Danh mục + Search */}
      <div className="flex items-center gap-x-4 flex-1 justify-center">
        {/* Logo */}
        <div className="text-2xl font-bold shrink-0 text-white">
          <Link to="/" className="logo text-2xl font-bold">
            ShopLaptop
          </Link>
        </div>

        {/* Dropdown danh mục */}
        <div className="relative group">
          <div
            className="flex items-center justify-center gap-2 px-5 h-12 border border-gray-300 rounded-full bg-white 
               hover:border-gray-400 hover:bg-gray-100 cursor-pointer transition"
          >
            <Menu size={20} className="text-gray-700" />
            <span className="text-gray-700 text-sm font-medium">Danh mục</span>
          </div>

          <ul
            className="absolute top-full left-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20
               opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
          >
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  to={`/products?category=${cat}`}
                  className="block px-4 py-2 hover:bg-gray-100 dropdown-link"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Search box */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              className="w-full px-5 py-2 pr-10 border border-gray-300 rounded-full placeholder-gray-400 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />

            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 cursor-pointer hover:text-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Giỏ hàng + User */}
      <div className="flex items-center gap-x-4 mr-20">
        {/* Giỏ hàng */}
        <Link
          to="/cart"
          className="flex items-center justify-center p-3 border border-gray-300 rounded-full bg-white
             hover:border-gray-400 hover:bg-gray-100 transition"
        >
          <ShoppingCart size={22} className="text-gray-700" />
        </Link>

        {/* User dropdown */}
        <div className="relative group">
          <div
            className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-full bg-white
               hover:border-gray-400 hover:bg-gray-100 cursor-pointer transition"
          >
            <User size={22} className="text-gray-700" />
          </div>

          <ul
            className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-20
               opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
          >
            {userOptions.map((opt) => (
              <li key={opt}>
                <Link
                  to="#"
                  className="dropdown-link block px-4 py-2 hover:bg-gray-100"
                >
                  {opt}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
