import { useSearchParams, useNavigate } from "react-router-dom";
import LoginForm from "../../components/LoginForm";
import SignupForm from "../../components/SignupForm";

export default function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get("mode") || "login";

  const toggleMode = () => {
    setSearchParams({ mode: mode === "login" ? "signup" : "login" });
  };

  return (
    <div
      key={mode}
      className="flex flex-col min-h-screen items-center justify-center bg-gray-50"
    >
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        {mode === "login" ? (
          <>
            <LoginForm navigate={navigate} />
            <p className="mt-4 text-center text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <button
                onClick={toggleMode}
                className="text-blue-500 hover:underline"
              >
                Đăng ký ngay
              </button>
            </p>
          </>
        ) : (
          <>
            <SignupForm navigate={navigate} />
            <p className="mt-4 text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <button
                onClick={toggleMode}
                className="text-blue-500 hover:underline"
              >
                Đăng nhập
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
