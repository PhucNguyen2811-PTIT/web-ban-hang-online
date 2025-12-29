import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, CheckCircle, XCircle, Truck } from "lucide-react";

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // Nếu chưa login → đá về home
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Lấy lịch sử đơn hàng
  useEffect(() => {
    if (!user || !token) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/order/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Lỗi lấy lịch sử đơn:", err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [user, token]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
            <Clock size={12} /> Chờ xử lý
          </span>
        );
      case "in_progress":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            <Truck size={12} /> Đang giao
          </span>
        );
      case "completed":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            <CheckCircle size={12} /> Hoàn thành
          </span>
        );
      case "cancelled":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
            <XCircle size={12} /> Đã hủy
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs">
            Unknown
          </span>
        );
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-3 text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* Info */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between bg-gray-50 p-3 rounded">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-700">{user.email}</span>
          </div>
          <div className="flex justify-between bg-gray-50 p-3 rounded">
            <span className="text-gray-500">Số điện thoại</span>
            <span className="font-medium text-gray-700">
              {user.phone || "Chưa cập nhật"}
            </span>
          </div>
        </div>

        {/* Lịch sử đơn hàng */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Lịch sử đơn hàng</h3>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có đơn hàng nào</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.orderID}
                  className="border rounded-lg p-4 bg-gray-50 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">
                        Mã đơn: #{order.orderID}
                      </p>
                      <p className="text-gray-500">
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">
                        {Number(order.totalPrice).toLocaleString()} đ
                      </p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* chi tiết sản phẩm */}
                  <ul className="text-sm text-gray-700 space-y-1">
                    {order.items?.map((item) => (
                      <li
                        key={item.orderItemID}
                        className="flex justify-between"
                      >
                        <span>{item.productName}</span>
                        <span>x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>

                  {/* nút xóa dưới cùng */}
                  {order.status === "pending" && (
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={async () => {
                          if (!confirm("Bạn có chắc muốn hủy đơn hàng này?"))
                            return;

                          try {
                            await axios.put(
                              `http://localhost:5000/api/order/${order.orderID}/cancel`,
                              {},
                              { headers: { Authorization: `Bearer ${token}` } }
                            );

                            // cập nhật trạng thái trong state để UI refresh
                            setOrders(
                              orders.map((o) =>
                                o.orderID === order.orderID
                                  ? { ...o, status: "cancelled" }
                                  : o
                              )
                            );

                            alert("Đơn hàng đã được hủy");
                          } catch (err) {
                            console.error(err);
                            alert(
                              err.response?.data?.message ||
                                "Hủy đơn hàng thất bại"
                            );
                          }
                        }}
                        className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Hủy đơn
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
