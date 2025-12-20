// src/pages/admin/ProductManager.jsx
import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Search } from "lucide-react";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountPrice: "",
    stock: "",
    description: "",
    image: "",
    categoryID: "",
    specs: [],
  });

  // 1. Fetch Data
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  // 2. Handle Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = {
      ...formData,
      image: [formData.image],
      price: Number(formData.price),
      stock: Number(formData.stock),
      categoryID: Number(formData.categoryID),
    };

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:5000/api/admin/products/${formData.productID}`
      : "http://localhost:5000/api/admin/products";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
        window.location.reload();
      } else {
        const errData = await res.json();
        alert("Lỗi: " + (errData.error || "Không thể lưu"));
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("DELETE FAIL:", res.status, text);
        alert(`Xóa thất bại (${res.status})`);
        return;
      }

      alert("Xóa thành công");
      setProducts((prev) => prev.filter((p) => p.productID !== id));
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server");
    }
  };

  // 5. Fill Form
  const handleEdit = (product) => {
    setIsEditing(true);
    let imgUrl = "";
    if (product.images && product.images.length > 0) imgUrl = product.images[0];

    setFormData({
      productID: product.productID,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice || "",
      stock: product.stock || 0,
      description: product.description || "",
      image: imgUrl,
      categoryID: product.categoryID || "",
      specs: [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      price: "",
      discountPrice: "",
      stock: "",
      description: "",
      image: "",
      categoryID: "",
      specs: [],
    });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper styles
  const inputClass =
    "w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";
  const labelClass = "block mb-1 text-sm font-medium text-gray-700";

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        📦 Quản lý Sản phẩm
      </h2>

      {/* --- FORM CARD --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b pb-2">
          {isEditing ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cột Trái */}
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Tên sản phẩm</label>
                <input
                  name="name"
                  className={inputClass}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="VD: Laptop Dell XPS..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Danh mục</label>
                  <select
                    name="categoryID"
                    className={inputClass}
                    value={formData.categoryID}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn --</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryID} value={cat.categoryID}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Tồn kho</label>
                  <input
                    name="stock"
                    type="number"
                    className={inputClass}
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Giá gốc (VNĐ)</label>
                  <input
                    name="price"
                    type="number"
                    className={inputClass}
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Giá giảm (VNĐ)</label>
                  <input
                    name="discountPrice"
                    type="number"
                    className={inputClass}
                    value={formData.discountPrice}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Cột Phải */}
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Link Hình ảnh</label>
                <input
                  name="image"
                  className={inputClass}
                  placeholder="https://..."
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
                {formData.image && (
                  <div className="mt-2 h-32 w-full bg-gray-50 rounded border flex items-center justify-center overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-full object-contain"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className={labelClass}>Mô tả</label>
                <textarea
                  name="description"
                  className={inputClass}
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition"
              >
                Hủy bỏ
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm transition flex items-center gap-2"
            >
              {isEditing ? <Edit size={18} /> : <Plus size={18} />}
              {isEditing ? "Lưu thay đổi" : "Thêm sản phẩm"}
            </button>
          </div>
        </form>
      </div>

      {/* --- SEARCH --- */}
      <div className="flex items-center gap-2 mb-4 bg-white p-3 rounded-lg shadow-sm border w-full md:w-1/2">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          className="flex-1 outline-none text-gray-700"
          placeholder="Tìm kiếm sản phẩm theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Hình ảnh</th>
              <th className="p-4">Tên sản phẩm</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4">Giá</th>
              <th className="p-4">Kho</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => {
                const catName =
                  categories.find((c) => c.categoryID === p.categoryID)?.name ||
                  "—";
                return (
                  <tr key={p.productID} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-500">#{p.productID}</td>
                    <td className="p-4">
                      {p.images && p.images.length > 0 && (
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-12 h-12 object-cover rounded-md border"
                        />
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-800">{p.name}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-semibold">
                        {catName}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-700">
                        {Number(p.price).toLocaleString()} đ
                      </div>
                      {p.discountPrice > 0 && (
                        <div className="text-xs text-red-500 line-through">
                          {Number(p.discountPrice).toLocaleString()} đ
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">{p.stock}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                        onClick={() => handleEdit(p)}
                        title="Sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        onClick={() => handleDelete(p.productID)}
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManager;
