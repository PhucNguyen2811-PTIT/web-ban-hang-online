// src/pages/admin/AdminLayout.jsx
import React, { useContext, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { LayoutDashboard, ShoppingBag, LogOut, Package } from "lucide-react";

const AdminLayout = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  if (!user) return null;

  const menuItems = [
    {
      path: "/admin/products",
      label: "Quản lý Sản phẩm",
      icon: <Package size={20} />,
    },
    {
      path: "/admin/orders",
      label: "Quản lý Đơn hàng",
      icon: <ShoppingBag size={20} />,
    },
    {
      path: "/admin/revenue",
      label: "Doanh thu",
      icon: <LayoutDashboard size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm fixed h-full z-10">
        <div className="p-6 flex items-center justify-center border-b border-gray-100">
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium mt-10"
          >
            <LogOut size={20} />
            Đăng xuất
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
