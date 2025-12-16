import React, { useState, useEffect } from "react";

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
        // Cập nhật state UI
        setOrders(orders.map(o => o.orderID === orderID ? { ...o, status: newStatus } : o));
      } else {
        alert("Lỗi cập nhật");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Quản lý Đơn hàng</h2>
      <table className="table table-striped bg-white mt-3">
        <thead>
          <tr>
            <th>Mã ĐH</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.orderID}>
              <td>#{order.orderID}</td>
              <td>
                {order.userName}<br/>
                <small className="text-muted">{order.email}</small>
              </td>
              <td>{Number(order.totalPrice || 0).toLocaleString()} đ</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>
                <select 
                  className="form-select form-select-sm" 
                  value={order.status}
                  onChange={(e) => updateStatus(order.orderID, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td>
                <ul className="list-unstyled mb-0" style={{fontSize: "0.85rem"}}>
                  {order.items && order.items.map(item => (
                    <li key={item.orderItemID}>- {item.productName} (x{item.quantity})</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManager;