import { useEffect, useState } from "react";
import Carousel from "../../components/Carousel";
import ProductCard from "../../components/ProductCard";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState(""); // <-- placeholder

  useEffect(() => {
    const loadData = async () => {
      try {
        const f = await fetch(
          "http://localhost:5000/api/products/featured"
        ).then((res) => res.json());

        const all = await fetch("http://localhost:5000/api/products").then(
          (res) => res.json()
        );

        setFeaturedProducts(f);
        setAllProducts(all);
        setFilteredProducts(all); // để sort tác động lên list này
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSort = (type) => {
    setSortType(type);

    if (!type) {
      // reset về toàn bộ sản phẩm
      setFilteredProducts(allProducts);
      return;
    }

    const sorted = [...allProducts].sort((a, b) => {
      const priceA = Number(a.discountPrice || a.price);
      const priceB = Number(b.discountPrice || b.price);

      if (type === "asc") return priceA - priceB;
      if (type === "desc") return priceB - priceA;
      return 0;
    });

    setFilteredProducts(sorted);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* Banner */}
      <section className="mb-10">
        <Carousel />
      </section>

      {/* Sản phẩm nổi bật */}
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
                  <ProductCard key={p.productID} product={p} />
                ))}
          </div>
        </div>
      </section>

      {/* Tất cả sản phẩm */}
      <section className="mb-10">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Tất cả sản phẩm
          </h2>

          {/* SORT */}
          {/* SORT BUTTONS */}
          <div className="flex justify-end mb-4 gap-2">
            {/* Reset sort */}
            <button
              onClick={() => handleSort("")}
              className={`px-4 py-2 rounded-lg border transition 
      ${
        sortType === ""
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
            >
              Xem nhiều
            </button>

            {/* Thấp → Cao */}
            <button
              onClick={() => handleSort("asc")}
              className={`px-4 py-2 rounded-lg border transition 
      ${
        sortType === "asc"
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
            >
              Giá: Thấp → Cao
            </button>

            {/* Cao → Thấp */}
            <button
              onClick={() => handleSort("desc")}
              className={`px-4 py-2 rounded-lg border transition 
      ${
        sortType === "desc"
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
            >
              Giá: Cao → Thấp
            </button>
          </div>

          {/* LIST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="border rounded-xl shadow animate-pulse h-72 bg-gray-200"
                  ></div>
                ))
              : filteredProducts.map((p) => (
                  <ProductCard key={p.productID} product={p} />
                ))}
          </div>
        </div>
      </section>
    </div>
  );
}
