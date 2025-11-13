import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function UserLayout() {
  return (
    <>
      <Header />
      <main className=" p-4 bg-gray-50 w-full">
        <Outlet /> {/* nội dung từng trang sẽ xuất hiện ở đây */}
      </main>
      <Footer />
    </>
  );
}
