import Carousel from "../../components/Carousel";

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: "HP Victus 15",
      price: 15000000,
      image: "https://via.placeholder.com/200",
    },
    {
      id: 2,
      name: "Dell Latitude",
      price: 55000000,
      image: "https://via.placeholder.com/200",
    },
    {
      id: 3,
      name: "Lenovo Legion 5 Pro",
      price: 35000000,
      image: "https://via.placeholder.com/200",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* Carousel nằm trên cùng */}
      <section className="mb-10">
        <Carousel />
      </section>

      {/* banner */}
      <section className="bg-blue-100 py-10 rounded-lg mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Chào mừng đến ShopLaptop
        </h1>
        <p className="mt-3 text-gray-600">
          Nơi mua sắm trực tuyến với sản phẩm chất lượng & giá tốt.
        </p>
      </section>

      {/* sản phẩm nổi bật */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Sản phẩm nổi bật
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredProducts.map((p) => (
            <div
              key={p.id}
              className="border rounded-xl shadow hover:shadow-lg transition bg-white"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-3 text-center">
                <h3 className="font-medium text-gray-800">{p.name}</h3>
                <p className="text-blue-600 font-semibold">
                  {p.price.toLocaleString()}đ
                </p>
                <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
