import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  if (!product) return null;

  const discountedPrice = product.discountPrice || product.price;

  // Ảnh fallback
  const image =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <Link
      to={`/product/${product.productID}`}
      state={{ product }}
      className="border rounded-xl shadow hover:shadow-lg transition bg-white block transform hover:scale-105 duration-200"
    >
      <img
        src={image}
        alt={product.name}
        className="w-full h-48 object-contain rounded-t-xl bg-gray-100"
      />

      <div className="p-3 text-center">
        <h3 className="font-medium text-gray-800">{product.name}</h3>

        {product.discountPrice ? (
          <p>
            <span className="line-through text-gray-500">
              {Number(product.price).toLocaleString("vi-VN")}đ
            </span>
            <span className="text-red-500 font-semibold ml-2">
              {Number(product.discountPrice).toLocaleString("vi-VN")}đ
            </span>
          </p>
        ) : (
          <p className="text-blue-600 font-semibold">
            {product.price
              ? Number(product.price).toLocaleString("vi-VN") + "đ"
              : "Liên hệ"}
          </p>
        )}
      </div>
    </Link>
  );
}
