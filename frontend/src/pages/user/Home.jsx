import { useEffect, useState } from "react";
import Carousel from "../../components/Carousel";
import ProductCard from "../../components/ProductCard";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setFeaturedProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* Carousel nằm trên cùng */}
      <section className="mb-10">
        <Carousel />
      </section>

      <section className="mb-10">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Sản phẩm nổi bật
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="border rounded-xl shadow animate-pulse h-72 bg-gray-200"
                  ></div>
                ))
              : featuredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}
