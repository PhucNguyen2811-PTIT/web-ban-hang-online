import React, { useContext, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Kiểm tra nếu không phải admin thì đá về trang chủ
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/"); 
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar - Menu bên trái */}
      <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
        <h4>Admin Panel</h4>
        <hr />
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/admin/products" className="nav-link text-white">Quản lý Sản phẩm</Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/orders" className="nav-link text-white">Quản lý Đơn hàng</Link>
          </li>
          <li className="nav-item mt-4">
            <button onClick={logout} className="btn btn-danger w-100">Đăng xuất</button>
          </li>
        </ul>
      </div>
      
      {/* Content - Nội dung thay đổi bên phải */}
      <div className="flex-grow-1 p-4 bg-light">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;