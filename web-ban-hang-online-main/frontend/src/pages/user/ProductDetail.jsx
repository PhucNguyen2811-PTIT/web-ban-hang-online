import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SpecTable from "../../components/SpecTable";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

export default function ProductDetail() {
  const { addToCart } = useContext(CartContext);

  const { id } = useParams();
  const location = useLocation();
  const preloadedProduct = location.state?.product || null;

  const [product, setProduct] = useState(preloadedProduct);
  const [mainImage, setMainImage] = useState(
    preloadedProduct?.images?.[0] || ""
  );
  const [loading, setLoading] = useState(!preloadedProduct);

  // Cuộn từ từ lên đầu trang khi vào ProductDetail
  useEffect(() => {
    const start = window.scrollY;
    const duration = 800; // tăng số này để cuộn chậm hơn (ms)
    const startTime = performance.now();

    function animateScroll(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // ease-out
      const ease = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, start * (1 - ease));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    }

    requestAnimationFrame(animateScroll);
  }, [id]);
  function handleAddToCart() {
    addToCart({
      id: product.productID, // QUAN TRỌNG: id phải khớp CartContext
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images?.[0],
    });

    alert("Đã thêm vào giỏ");
  }

  // Trong ProductDetail.jsx, khi fetch product
  useEffect(() => {
    if (!product) {
      setLoading(true);
      fetch(`http://localhost:5000/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched product:", data);

          setProduct(data);

          setMainImage(data.images[0]);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setLoading(false);
        });
    }
  }, [id, product]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!product)
    return <div className="p-10 text-red-500">Sản phẩm không tồn tại</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 transition-all duration-300">
      <div className="flex gap-10">
        {/* Ảnh */}
        <div className="flex-1">
          <img
            src={mainImage || "https://via.placeholder.com/400"}
            alt={product.name}
            className="w-full h-96 object-contain rounded-lg border bg-gray-100"
          />
          <div className="flex gap-3 mt-4">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                  mainImage === img ? "border-blue-500" : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thông tin */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-3 text-gray-900">
            {product.name}
          </h1>

          {product.discountPrice ? (
            <p className="mb-4">
              <span className="line-through text-gray-500 mr-2">
                {product.price.toLocaleString()} đ
              </span>
              <span className="text-red-600 text-2xl font-semibold">
                {product.discountPrice.toLocaleString()} đ
              </span>
            </p>
          ) : (
            <p className="text-red-600 text-2xl font-semibold mb-4">
              {product.price.toLocaleString()} đ
            </p>
          )}

          <p className="text-gray-700 mb-6">{product.description}</p>
          <button
            onClick={handleAddToCart}
            className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Thông số kỹ thuật
        </h2>
        <SpecTable specs={product.specs} />
      </div>
    </div>
  );
}
