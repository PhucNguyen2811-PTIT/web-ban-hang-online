export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 border-t bg-linear-to-r from-[#B71C1C] to-[#B01525]">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
        {/* Cột 1: Giới thiệu */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">
            Về Chúng tôi
          </h3>
          <ul className="space-y-2">
            <li>
              <p className="text-white">Người đại diện: Nguyễn Văn X</p>
            </li>
            <li>
              <p className="text-white">Địa chỉ: 79 Man Thiện, TP Thủ Đức</p>
            </li>
            <li>
              <p className="text-white">GPKD: 123446685616</p>
            </li>
            <li>
              <p className="text-white">MST:123456789</p>
            </li>
          </ul>
        </div>

        {/* Cột 2: Hỗ trợ */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">
            Giờ làm việc
          </h3>
          <ul className="space-y-2">
            <li>
              <p className="text-white">Bán hàng: Thứ 2 - Chủ nhật</p>
            </li>
            <li>
              <p className="text-white">★Thứ 2 - Thứ 7 : 8:30 đến 19:00</p>
            </li>
            <li>
              <p className="text-white">★Chủ nhật: 09:00 đến 17:00</p>
            </li>
            <li>
              <p className="text-white">Bảo hành: Thứ 2 - Thứ 7</p>
            </li>
            <li>
              <p className="text-white">★Sáng: 9:00 đến 12:00</p>
            </li>
            <li>
              <p className="text-white">★Chiều: 13:30 đến 17:00</p>
            </li>
          </ul>
        </div>

        {/* Cột 3: Chính sách */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Chính sách</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-white hover:text-blue-600 transition">
                Bảo mật thông tin
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-blue-600 transition">
                Vận chuyển & giao nhận
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-blue-600 transition">
                Bảo hành sản phẩm
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-blue-600 transition">
                Điều khoản sử dụng
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Liên hệ</h3>
          <ul className="space-y-2 mb-4">
            {" "}
            {/* <-- thêm mb-4 để tạo khoảng cách với Google Maps */}
            <li className="text-white">
              Email:{" "}
              <a
                href="mailto:support@myshop.vn"
                className="hover:text-blue-600"
              >
                shoplaptop@gmail.com
              </a>
            </li>
            <li className="text-white">
              Hotline: <span className="font-medium">1900 9999</span>
            </li>
            <li className="text-white">
              Địa chỉ: 97 Man Thiện, Hiệp Phú, Thủ Đức, Thành phố Hồ Chí Minh
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-3 text-white">Google Maps</h3>
          {/* Google Map giả (demo) */}
          <div className="w-full h-40 rounded-lg overflow-hidden shadow-sm">
            <div className="w-full h-40 rounded-lg overflow-hidden shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1959.2612259802904!2d106.78599994999999!3d10.847810699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527131ae8b249%3A0x4d2d3c8fab7d3c2e!2zOTcgTWFuIFRoaeG7h24sIEhp4buHcCBQaMO6LCBUaOG7pyDEkOG7qWMsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCA3MDAwMA!5e0!3m2!1sen!2s!4v1763018932012!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Dòng bản quyền */}
      <div className="border-t text-center py-4 text-white text-sm">
        © {new Date().getFullYear()} ShopLaptop. All rights reserved.
      </div>
    </footer>
  );
}
