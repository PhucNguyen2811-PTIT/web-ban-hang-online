import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import axios from "axios";

export default function CheckoutPage() {
  const { cartItems } = useContext(CartContext);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingFee = total > 20000000 ? 0 : 30000; // Free ship nếu > 20 triệu
  const finalTotal = total + shippingFee;

  const [payment, setPayment] = useState("cod");
  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.userID) {
      alert("Vui lòng đăng nhập để thanh toán");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/order/checkout", {
        userID: user.userID,
        paymentMethod: payment,
        items: cartItems.map((item) => ({
          productID: item.id, // id sản phẩm
          price: item.price, // giá tại thời điểm mua
          quantity: item.quantity,
        })),
      });

      // Clear cart local
      localStorage.removeItem("cart");

      alert("Đặt hàng thành công!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Thanh toán thất bại");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-900">
      {/* TIÊU ĐỀ */}
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CỘT TRÁI — INFO */}
        <div className="md:col-span-2 space-y-6">
          {/* THÔNG TIN NGƯỜI NHẬN */}
          <div className="bg-white shadow p-5 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Thông tin người nhận</h2>

            <div className="space-y-3">
              <input
                className="w-full p-3 border rounded-lg"
                placeholder="Họ và tên"
              />
              <input
                className="w-full p-3 border rounded-lg"
                placeholder="Số điện thoại"
              />
              <input
                className="w-full p-3 border rounded-lg"
                placeholder="Email"
              />
            </div>
          </div>

          {/* ĐỊA CHỈ GIAO HÀNG */}
          <div className="bg-white shadow p-5 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Địa chỉ giao hàng</h2>
            <textarea
              rows={3}
              className="w-full p-3 border rounded-lg"
              placeholder="Nhập địa chỉ cụ thể..."
            ></textarea>
          </div>

          {/* PHƯƠNG THỨC THANH TOÁN */}
          <div className="bg-white shadow p-5 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">
              Phương thức thanh toán
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  checked={payment === "cod"}
                  onChange={() => setPayment("cod")}
                />
                Thanh toán khi nhận hàng (COD)
              </label>

              <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  checked={payment === "bank"}
                  onChange={() => setPayment("bank")}
                />
                Chuyển khoản ngân hàng
              </label>

              <label className="flex items-center gap-3 border p-3 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  checked={payment === "momo"}
                  onChange={() => setPayment("momo")}
                />
                Ví MoMo
              </label>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI – ORDER SUMMARY */}
        <div className="bg-white shadow p-5 rounded-lg border h-fit">
          <h2 className="text-xl font-semibold mb-4">Đơn hàng</h2>

          {/* ITEM LIST */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between border-b pb-2">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span className="font-semibold">
                  {(item.price * item.quantity).toLocaleString()} đ
                </span>
              </div>
            ))}
          </div>

          {/* COST SUMMARY */}
          <div className="mt-5 space-y-2">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{total.toLocaleString()} đ</span>
            </div>

            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee.toLocaleString()} đ</span>
            </div>

            <div className="border-t pt-3 flex justify-between text-xl font-bold text-red-600">
              <span>Tổng cộng:</span>
              <span>{finalTotal.toLocaleString()} đ</span>
            </div>
          </div>

          {/* NÚT THANH TOÁN */}
          <button
            onClick={handleCheckout}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
