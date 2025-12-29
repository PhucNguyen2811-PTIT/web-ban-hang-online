import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center text-gray-900 text-xl">
        Giỏ hàng trống{" "}
      </div>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-900">
      {" "}
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>
      <div className="space-y-4">
        {cartItems.map((item) => {
          let imageSrc = "";

          if (Array.isArray(item.image)) {
            imageSrc = item.image[0];
          } else if (typeof item.image === "string") {
            try {
              const parsed = JSON.parse(item.image);
              imageSrc = parsed?.[0];
            } catch {
              imageSrc = item.image; // fallback nếu là string thường
            }
          }
          console.log("FINAL IMAGE SRC:", imageSrc);

          return (
            <div
              key={item.cartID}
              className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-sm"
            >
              <img
                src={imageSrc}
                alt={item.name}
                className="w-24 h-24 object-contain rounded border"
              />

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {item.name}
                </h2>

                <p className="text-red-600 font-bold text-lg">
                  {item.price.toLocaleString()} đ
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() =>
                      item.quantity > 1 &&
                      updateQuantity(item.cartID, item.quantity - 1)
                    }
                    className={`px-3 py-1 border rounded ${
                      item.quantity === 1
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    -
                  </button>

                  <span className="text-lg font-semibold">{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.cartID, item.quantity + 1)
                    }
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right font-semibold text-lg w-32">
                {(item.price * item.quantity).toLocaleString()} đ
              </div>

              <button
                onClick={() => removeFromCart(item.cartID)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Xóa
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center mt-8 p-4 border-t text-gray-900">
        <span className="text-2xl font-bold">Tổng:</span>
        <span className="text-2xl text-red-600 font-bold">
          {total.toLocaleString()} đ
        </span>
      </div>
      {/* NÚT THANH TOÁN */}
      <div className="mt-6 text-right">
        <button
          onClick={() => (window.location.href = "/checkout")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
}
