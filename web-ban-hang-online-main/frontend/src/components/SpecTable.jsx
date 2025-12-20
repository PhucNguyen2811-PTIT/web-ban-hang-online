// src/components/SpecTable.jsx
import React from "react";

export default function SpecTable({ specs }) {
  // Nếu không có thông số nào thì báo chưa có
  if (!specs || Object.keys(specs).length === 0) {
    return <p className="text-gray-500 italic">Chưa có thông số kỹ thuật.</p>;
  }

  // Chuyển object specs thành mảng để hiển thị
  // Ví dụ backend trả về: { "card_do_hoa": "RTX 3050", "pin": "3 cell" }
  const rows = Object.entries(specs).map(([key, value]) => {
    // Làm đẹp cái Tên thông số (key):
    // 1. Thay dấu gạch dưới "_" thành khoảng trắng
    // 2. Viết hoa chữ cái đầu
    let label = key.replace(/_/g, " "); 
    label = label.charAt(0).toUpperCase() + label.slice(1);

    // Một số từ khóa đặc biệt nếu muốn đẹp hơn (tùy chọn)
    if (key === "cpu") label = "Vi xử lý (CPU)";
    if (key === "ram") label = "RAM";
    if (key === "gpu") label = "Card đồ họa";
    
    return { label, value };
  });

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, idx) => (
            <tr 
              key={idx} 
              className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/3">
                {row.label}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}