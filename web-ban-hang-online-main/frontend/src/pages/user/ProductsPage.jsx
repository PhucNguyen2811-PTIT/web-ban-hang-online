import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../../components/ProductCard";

export default function ProductsPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category"); // VD: Laptop Dell

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortType, setSortType] = useState(""); // asc, desc
  const [selectedBrand, setSelectedBrand] = useState("all");

  const brands = ["all", "HP", "Dell", "Lenovo", "Asus"];

  // Load tất cả sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      try {
        const all = await fetch("http://localhost:5000/api/products").then(
          (res) => res.json()
        );

        setProducts(all);
        setFiltered(all);

        // --- Lọc theo category (header dropdown) ---
        if (category) {
          const brand = category.replace("Laptop ", "").toLowerCase();
          setSelectedBrand(brand);

          const filteredByBrand = all.filter(
            (p) => p.brand?.trim().toLowerCase() === brand
          );
          setFiltered(filteredByBrand);
        }

        // --- Lọc theo search (search bar) ---
        const search = queryParams.get("search");
        if (search) {
          const keyword = search.toLowerCase().trim();

          const filteredBySearch = all.filter(
            (p) =>
              p.name.toLowerCase().includes(keyword) ||
              p.brand?.toLowerCase().includes(keyword)
          );

          setFiltered(filteredBySearch);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, location.search]);

  // SORT
  const handleSort = (type) => {
    setSortType(type);

    const sorted = [...filtered].sort((a, b) => {
      const priceA = Number(a.discountPrice || a.price);
      const priceB = Number(b.discountPrice || b.price);

      if (type === "asc") return priceA - priceB;
      if (type === "desc") return priceB - priceA;
      return 0;
    });

    setFiltered(sorted);
  };

  // Lọc theo brand (nút bấm)
  const handleBrandFilter = (brand) => {
    setSelectedBrand(brand);

    if (brand === "all") {
      setFiltered(products);
      return;
    }

    const filteredByBrand = products.filter(
      (p) => p.brand?.trim().toLowerCase() === brand.toLowerCase()
    );

    setFiltered(filteredByBrand);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
        {category
          ? category
          : queryParams.get("search")
          ? `Kết quả tìm kiếm cho: "${queryParams.get("search")}"`
          : "Tất cả sản phẩm"}
      </h2>

      {/* SORT BUTTONS */}
      <div className="flex gap-3 justify-center mb-6">
        <button
          onClick={() => handleSort("asc")}
          className={`px-4 py-2 rounded-full border transition ${
            sortType === "asc"
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          Giá: Thấp → Cao
        </button>

        <button
          onClick={() => handleSort("desc")}
          className={`px-4 py-2 rounded-full border transition ${
            sortType === "desc"
              ? "bg-red-600 text-white border-red-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          Giá: Cao → Thấp
        </button>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="border rounded-xl shadow animate-pulse h-72 bg-gray-200"
            ></div>
          ))
        ) : filtered.length > 0 ? (
          filtered.map((p) => <ProductCard key={p.productID} product={p} />)
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Không tìm thấy sản phẩm.
          </p>
        )}
      </div>
    </div>
  );
}
