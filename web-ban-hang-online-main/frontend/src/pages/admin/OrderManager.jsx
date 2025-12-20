// src/pages/admin/OrderManager.jsx
import React, { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/admin/orders", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, []);

  const updateStatus = async (orderID, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderID}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.orderID === orderID ? { ...o, status: newStatus } : o));
      } else {
        alert("Lỗi cập nhật");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold"><Clock size={12}/> Chờ xử lý</span>;
      case 'in_progress': return <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold"><Truck size={12}/> Đang giao</span>;
      case 'completed': return <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold"><CheckCircle size={12}/> Hoàn thành</span>;
      case 'cancelled': return <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold"><XCircle size={12}/> Đã hủy</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs">Unknown</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        📦 Quản lý Đơn hàng
      </h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="p-4">Mã ĐH</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4">Ngày đặt</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Chi tiết SP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order.orderID} className="hover:bg-gray-50 transition">
                <td className="p-4 font-mono text-blue-600">#{order.orderID}</td>
                <td className="p-4">
                  <div className="font-medium text-gray-800">{order.userName}</div>
                  <div className="text-xs text-gray-500">{order.email}</div>
                </td>
                <td className="p-4 font-bold text-gray-800">
                  {Number(order.totalPrice || 0).toLocaleString()} đ
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString('vi-VN')}
                </td>
                <td className="p-4">
                    <div className="flex flex-col gap-2 items-start">
                        {getStatusBadge(order.status)}
                        <select 
                            className="text-xs border border-gray-300 rounded p-1 outline-none focus:border-blue-500"
                            value={order.status}
                            onChange={(e) => updateStatus(order.orderID, e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </td>
                <td className="p-4">
                  <ul className="text-sm text-gray-600 space-y-1">
                    {order.items && order.items.map(item => (
                      <li key={item.orderItemID} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {item.productName} <span className="font-semibold text-gray-800">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
            <div className="p-8 text-center text-gray-500">Chưa có đơn hàng nào.</div>
        )}
      </div>
    </div>
  );
};

export default OrderManager;