import { useState, useEffect, useRef } from "react";

const slides = [
  {
    id: 1,
    image:
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:100/plain/https://dashboard.cellphones.com.vn/storage/sdvsgdvgsfrg.png",
  },
  {
    id: 2,
    image:
      "https://img.freepik.com/free-vector/electronics-store-facebook-cover-template_23-2151173109.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    id: 3,
    image:
      "https://img.freepik.com/free-psd/black-friday-super-sale-facebook-cover-banner-template_120329-5178.jpg?semt=ais_hybrid&w=740&q=80",
  },
];

export default function Carousel() {
  const containerRef = useRef();
  const [current, setCurrent] = useState(0);
  const slideCount = slides.length;
  const speed = 6000; // thời gian mỗi slide

  // Nhân đôi slides để tạo loop mượt
  const extendedSlides = [...slides, ...slides];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, speed);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Reset về slide đầu khi tới slide copy
    if (current >= slideCount) {
      setTimeout(() => {
        setCurrent(0);
        // Tắt transition tạm để nhảy về đầu
        if (containerRef.current) {
          containerRef.current.style.transition = "none";
          containerRef.current.style.transform = `translateX(0%)`;
          // bật lại transition
          setTimeout(() => {
            if (containerRef.current)
              containerRef.current.style.transition = "transform 0.7s";
          }, 50);
        }
      }, 700); // 700ms trùng với transition
    }
  }, [current, slideCount]);

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-lg shadow-lg bg-gray-200">
      <div
        ref={containerRef}
        className="flex h-full transition-transform duration-700"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {extendedSlides.map((slide, idx) => (
          <div key={idx} className="relative shrink-0 w-full h-full">
            <img
              src={slide.image}
              className="w-full h-full object-contain bg-black"
            />

            {/* Overlay chữ */}
            <div className="absolute bottom-6 left-6 text-white text-2xl font-bold drop-shadow">
              {slide.label}
            </div>
          </div>
        ))}
      </div>

      {/* Nút next / prev */}
      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 < 0 ? slideCount - 1 : prev - 1))
        }
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full shadow hover:bg-black/60 z-20 text-xl font-bold"
      >
        ‹
      </button>
      <button
        onClick={() => setCurrent((prev) => prev + 1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full shadow hover:bg-black/60 z-20 text-xl font-bold"
      >
        ›
      </button>
    </div>
  );
}
