// src/pages/admin/ProductManager.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Edit, Trash2, Plus, Search, Save, X } from "lucide-react";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // State form
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

  // 1. Hàm load dữ liệu (Tách riêng để tái sử dụng)
  const fetchData = useCallback(async () => {
    try {
      const resProducts = await fetch("http://localhost:5000/api/products");
      const dataProducts = await resProducts.json();
      setProducts(dataProducts);

      const resCats = await fetch("http://localhost:5000/api/categories");
      const dataCats = await resCats.json();
      setCategories(dataCats);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    }
  }, []);

  // Gọi fetchData khi component chạy lần đầu
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 2. Handle Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- LOGIC SPECS ---
  const addSpec = () => {
    setFormData({
      ...formData,
      specs: [...formData.specs, { attribute: "", value: "" }],
    });
  };

  const removeSpec = (index) => {
    const newSpecs = [...formData.specs];
    newSpecs.splice(index, 1);
    setFormData({ ...formData, specs: newSpecs });
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specs];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specs: newSpecs });
  };

  // Hàm reset form
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
    // Cuộn lên đầu nhẹ nhàng
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 3. Submit Form (SỬA LỖI RELOAD Ở ĐÂY)
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
        // --- KHÔNG DÙNG RELOAD() NỮA ---
        alert(isEditing ? "Đã cập nhật sản phẩm!" : "Đã thêm sản phẩm mới!");
        
        // 1. Tải lại danh sách mới nhất từ server
        await fetchData(); 
        
        // 2. Reset form về trạng thái ban đầu
        handleCancel(); 
        
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        alert("Xóa thành công");
        // Cập nhật list local (nhanh hơn gọi API)
        setProducts((prev) => prev.filter((p) => p.productID !== id));
      } else {
        alert("Xóa thất bại");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Fill Form
  const handleEdit = (product) => {
    setIsEditing(true);
    let imgUrl = "";
    if (product.images && product.images.length > 0) imgUrl = product.images[0];

    // Format specs: Chuyển gạch dưới thành khoảng trắng để dễ nhìn
    const formattedSpecs = product.specs
      ? Object.entries(product.specs).map(([key, value]) => ({
          attribute: key.replace(/_/g, " "), // Ví dụ: "screen_size" -> "screen size"
          value: value,
        }))
      : [];

    setFormData({
      productID: product.productID,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice || "",
      stock: product.stock || 0,
      description: product.description || "",
      image: imgUrl,
      categoryID: product.categoryID || "",
      specs: formattedSpecs,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClass =
    "w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";
  const labelClass = "block mb-1 text-sm font-medium text-gray-700";

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        📦 Quản lý Sản phẩm
      </h2>

      {/* --- FORM CARD --- */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 mb-10 relative">
        <h3 className="text-xl font-bold text-blue-700 mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
          {isEditing ? <Edit size={24} /> : <Plus size={24} />}
          {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cột Trái */}
            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  className={inputClass}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên sản phẩm..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Danh mục <span className="text-red-500">*</span>
                  </label>
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
                  <label className={labelClass}>
                    Tồn kho <span className="text-red-500">*</span>
                  </label>
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
                  <label className={labelClass}>
                    Giá gốc (VNĐ) <span className="text-red-500">*</span>
                  </label>
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
            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  Link Hình ảnh <span className="text-red-500">*</span>
                </label>
                <input
                  name="image"
                  className={inputClass}
                  placeholder="https://..."
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
                <div className="mt-3 h-40 w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-full object-contain"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">Xem trước ảnh</span>
                  )}
                </div>
              </div>
              <div>
                <label className={labelClass}>Mô tả chi tiết</label>
                <textarea
                  name="description"
                  className={inputClass}
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Mô tả sản phẩm..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* --- PHẦN SPECS --- */}
          <div className="border-t border-gray-200 pt-5 mt-2">
            <div className="flex items-center justify-between mb-4">
              <label className="text-lg font-bold text-gray-800">
                ⚙️ Thông số kỹ thuật
              </label>
              <button
                type="button"
                onClick={addSpec}
                style={{ backgroundColor: "#16a34a", color: "white" }}
                className="text-sm px-4 py-2 rounded-lg hover:opacity-90 font-semibold flex items-center gap-2 shadow transition transform hover:scale-105"
              >
                <Plus size={18} /> Thêm thông số
              </button>
            </div>

            <div className="space-y-3 bg-gray-50 p-5 rounded-xl border border-gray-200">
              {formData.specs && formData.specs.length > 0 ? (
                formData.specs.map((spec, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-center animate-fadeIn"
                  >
                    <div className="w-1/3">
                      <input
                        placeholder="Tên (VD: CPU)"
                        className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                        value={spec.attribute}
                        onChange={(e) =>
                          handleSpecChange(index, "attribute", e.target.value)
                        }
                      />
                    </div>
                    <span className="text-gray-400 font-bold">:</span>
                    <div className="flex-1">
                      <input
                        placeholder="Giá trị (VD: Core i5 12400H)"
                        className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                        value={spec.value}
                        onChange={(e) =>
                          handleSpecChange(index, "value", e.target.value)
                        }
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="p-2 text-red-500 bg-white border border-red-200 rounded hover:bg-red-50 hover:text-red-700 transition shadow-sm"
                      title="Xóa dòng này"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                  Chưa có thông số nào. Hãy bấm nút "Thêm thông số" ở trên.
                </div>
              )}
            </div>
          </div>

          {/* --- STICKY FOOTER ACTION BUTTONS --- */}
          <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] -mx-6 -mb-6 rounded-b-xl flex justify-end gap-4">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold flex items-center gap-2 transition"
              >
                <X size={20} /> Hủy bỏ
              </button>
            )}

            <button
              type="submit"
              style={{ backgroundColor: "#2563EB", color: "white" }}
              className="px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              {isEditing ? <Save size={22} /> : <Plus size={22} />}
              {isEditing ? "Lưu thay đổi" : "Thêm sản phẩm ngay"}
            </button>
          </div>
        </form>
      </div>

      {/* --- TABLE & SEARCH --- */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex-1 max-w-md">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            className="flex-1 outline-none text-gray-700"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Hình ảnh</th>
              <th className="p-4">Tên sản phẩm</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4">Giá bán</th>
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
                  <tr
                    key={p.productID}
                    className="hover:bg-blue-50 transition duration-150"
                  >
                    <td className="p-4 text-gray-500 font-mono">
                      #{p.productID}
                    </td>
                    <td className="p-4">
                      {p.images && p.images.length > 0 ? (
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">
                      {p.name}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                        {catName}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800">
                        {Number(p.price).toLocaleString()} đ
                      </div>
                      {p.discountPrice > 0 && (
                        <div className="text-xs text-red-500 line-through">
                          {Number(p.discountPrice).toLocaleString()} đ
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-gray-700 font-medium">{p.stock}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button
                        className="p-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow transition"
                        onClick={() => handleEdit(p)}
                        title="Sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg shadow transition"
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
                <td
                  colSpan="7"
                  className="p-10 text-center text-gray-500 italic"
                >
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