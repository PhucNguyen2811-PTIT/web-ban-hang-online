// ProductCard.jsx
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const discountedPrice = product.discountPrice || product.price;

  return (
    <Link
      to={`/product/${product.id}`}
      state={{ product }}
      className="border rounded-xl shadow hover:shadow-lg transition bg-white block transform hover:scale-105 duration-200"
    >
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-48 object-contain rounded-t-xl bg-gray-100"
      />
      <div className="p-3 text-center">
        <h3 className="font-medium text-gray-800">{product.name}</h3>
        {product.discountPrice ? (
          <p>
            <span className="line-through text-gray-500">
              {product.price.toLocaleString()}đ
            </span>
            <span className="text-red-500 font-semibold ml-2">
              {product.discountPrice.toLocaleString()}đ
            </span>
          </p>
        ) : (
          <p className="text-blue-600 font-semibold">
            {product.price.toLocaleString()}đ
          </p>
        )}
      </div>
    </Link>
  );
}
