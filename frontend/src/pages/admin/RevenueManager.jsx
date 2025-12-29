import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Revenue() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    orders: [],
  });

  useEffect(() => {
    const fetchRevenue = async () => {
      if (!token) return; // chưa login → không fetch
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/revenue`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error("Lỗi lấy doanh thu:", err);
      }
    };

    fetchRevenue();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Doanh thu</h1>

      <div className="flex gap-6 mb-6">
        <div className="p-4 bg-white rounded shadow w-1/2">
          <p className="text-gray-500">Tổng doanh thu</p>
          <p className="text-xl font-semibold text-green-600">
            {data.totalRevenue ? data.totalRevenue.toLocaleString() : "0"} đ
          </p>
        </div>

        <div className="p-4 bg-white rounded shadow w-1/2">
          <p className="text-gray-500">Tổng số đơn</p>
          <p className="text-xl font-semibold text-red-500">
            {data.totalOrders || 0}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3 text-gray-700">
        Danh sách đơn hàng
      </h2>
      <div className="space-y-3">
        {(data.orders || []).map((order) => (
          <div
            key={order.orderID}
            className="p-3 bg-white rounded shadow flex justify-between"
          >
            <div>
              <p className="text-gray-700 font-bold">
                Mã đơn: #{order.orderID}
              </p>
              <p className="text-gray-800">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl text-green-600">
                {order.totalPrice ? order.totalPrice.toLocaleString() : "0"} đ
              </p>
              <p className="capitalize text-gray-500">{order.status || "-"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
