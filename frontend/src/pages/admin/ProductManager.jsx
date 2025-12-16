import React, { useState, useEffect } from "react";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // State lưu danh mục
  const [searchTerm, setSearchTerm] = useState(""); // State tìm kiếm
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountPrice: "",
    stock: "",
    description: "",
    image: "",
    categoryID: "", // Thêm trường này
    specs: [] 
  });

  // 1. Fetch Products & Categories
  useEffect(() => {
    // Lấy sản phẩm
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));

    // Lấy danh mục (để hiện vào dropdown)
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi lấy danh mục:", err));
  }, []);

  // 2. Xử lý Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Xử lý Submit (Thêm/Sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); 
    // Format lại dữ liệu cho đúng API
    const payload = { 
        ...formData, 
        image: [formData.image], // Chuyển chuỗi ảnh thành mảng
        price: Number(formData.price),
        stock: Number(formData.stock),
        categoryID: Number(formData.categoryID) // Đảm bảo là số
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
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
        window.location.reload(); // Load lại trang cho nhanh
      } else {
        const errData = await res.json();
        alert("Lỗi: " + (errData.error || "Không thể lưu"));
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server");
    }
  };

  // 4. Xử lý Xóa
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(products.filter(p => p.productID !== id));
      } else {
        alert("Không thể xóa (Sản phẩm đang có trong đơn hàng)");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Đổ dữ liệu vào Form khi sửa
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
      categoryID: product.categoryID || "", // Load category cũ lên
      specs: []
    });
    // Scroll lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 6. Logic Tìm kiếm: Lọc danh sách sản phẩm theo từ khóa
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="mb-4">Quản lý Sản phẩm</h2>
      
      {/* --- FORM THÊM / SỬA --- */}
      <div className="card p-4 mb-4 shadow-sm">
        <h5 className="mb-3 text-primary font-weight-bold">
            {isEditing ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Tên SP */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Tên sản phẩm</label>
              <input name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>

            {/* Danh mục (Dropdown) - Đã nâng cấp */}
            <div className="col-md-3 mb-3">
               <label className="form-label">Danh mục</label>
               <select 
                  name="categoryID" 
                  className="form-select" 
                  value={formData.categoryID} 
                  onChange={handleChange}
                  required
               >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(cat => (
                      <option key={cat.categoryID} value={cat.categoryID}>
                          {cat.name}
                      </option>
                  ))}
               </select>
            </div>

            {/* Giá */}
            <div className="col-md-3 mb-3">
              <label className="form-label">Giá (VNĐ)</label>
              <input name="price" type="number" className="form-control" value={formData.price} onChange={handleChange} required />
            </div>

            {/* Giá Khuyến mãi */}
            <div className="col-md-3 mb-3">
              <label className="form-label">Giá giảm (nếu có)</label>
              <input name="discountPrice" type="number" className="form-control" value={formData.discountPrice} onChange={handleChange} />
            </div>

            {/* Tồn kho */}
            <div className="col-md-3 mb-3">
              <label className="form-label">Tồn kho</label>
              <input name="stock" type="number" className="form-control" value={formData.stock} onChange={handleChange} required />
            </div>

            {/* Ảnh */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Link Hình ảnh</label>
              <input name="image" className="form-control" placeholder="https://..." value={formData.image} onChange={handleChange} required />
            </div>

            {/* Mô tả */}
            <div className="col-md-12 mb-3">
              <label className="form-label">Mô tả chi tiết</label>
              <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
                {isEditing ? "Lưu thay đổi" : "Thêm sản phẩm"}
            </button>
            {isEditing && (
                <button type="button" className="btn btn-secondary" onClick={() => { setIsEditing(false); setFormData({ name: "", price: "", discountPrice: "", stock: "", description: "", image: "", categoryID: "", specs: [] }); }}>
                    Hủy bỏ
                </button>
            )}
          </div>
        </form>
      </div>

      {/* --- THANH TÌM KIẾM (Mới) --- */}
      <div className="mb-3">
        <input 
            type="text" 
            className="form-control" 
            placeholder="🔍 Tìm kiếm sản phẩm theo tên..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- DANH SÁCH SẢN PHẨM --- */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover bg-white">
            <thead className="table-light">
            <tr>
                <th style={{width: '5%'}}>ID</th>
                <th style={{width: '10%'}}>Hình ảnh</th>
                <th style={{width: '30%'}}>Tên sản phẩm</th>
                <th style={{width: '15%'}}>Danh mục</th>
                <th style={{width: '15%'}}>Giá</th>
                <th style={{width: '10%'}}>Kho</th>
                <th style={{width: '15%'}}>Hành động</th>
            </tr>
            </thead>
            <tbody>
            {filteredProducts.length > 0 ? (
                filteredProducts.map(p => {
                    // Tìm tên danh mục để hiển thị thay vì ID
                    const catName = categories.find(c => c.categoryID === p.categoryID)?.name || "Chưa phân loại";
                    
                    return (
                        <tr key={p.productID}>
                            <td>{p.productID}</td>
                            <td>
                                {p.images && p.images.length > 0 && (
                                    <img src={p.images[0]} alt="" style={{width: '50px', height: '50px', objectFit: 'cover'}} />
                                )}
                            </td>
                            <td>{p.name}</td>
                            <td><span className="badge bg-info text-dark">{catName}</span></td>
                            <td>
                                <div>{Number(p.price).toLocaleString()} đ</div>
                                {p.discountPrice > 0 && (
                                    <small className="text-danger text-decoration-line-through">
                                        {Number(p.discountPrice).toLocaleString()} đ
                                    </small>
                                )}
                            </td>
                            <td>{p.stock}</td>
                            <td>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(p)}>Sửa</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.productID)}>Xóa</button>
                            </td>
                        </tr>
                    );
                })
            ) : (
                <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                        Không tìm thấy sản phẩm nào phù hợp.
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