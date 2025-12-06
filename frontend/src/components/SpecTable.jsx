export default function SpecTable({ specs }) {
  console.log("Specs received in SpecTable:", specs); // <--- kiểm tra
  if (!specs || Object.keys(specs).length === 0) {
    return <p className="text-gray-500">Chưa có thông số kỹ thuật.</p>;
  }

  const rows = [
    { label: "CPU", value: specs.cpu },
    { label: "RAM", value: specs.ram },
    { label: "Card đồ họa", value: specs.gpu },
    { label: "Kích thước màn hình", value: specs.screen_size },
    { label: "Pin", value: specs.battery },
  ];

  return (
    <table className="w-full border-separate border-spacing-0">
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
            <th className="p-3 w-40 text-left font-medium text-gray-700 border border-gray-300">
              {row.label}
            </th>
            <td className="p-3 text-gray-800 border border-gray-300">
              {row.value || "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
