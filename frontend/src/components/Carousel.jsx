import { useState, useEffect, useRef } from "react";

const slides = [
  { id: 1, label: "Slide 1" },
  { id: 2, label: "Slide 2" },
  { id: 3, label: "Slide 3" },
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
          <div
            key={idx}
            className="shrink-0 w-full flex flex-col items-center justify-center"
          >
            <div className="w-3/4 h-40 sm:h-56 md:h-72 bg-gray-400 animate-pulse rounded-md flex items-center justify-center text-gray-600">
              Hình ảnh chưa load
            </div>
            <p className="mt-2 text-gray-700 font-bold">{slide.label}</p>
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
