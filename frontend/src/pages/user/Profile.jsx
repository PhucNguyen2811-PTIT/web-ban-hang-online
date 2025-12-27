import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-3 text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* Info */}
        <div className="space-y-3">
          <div className="flex justify-between bg-gray-50 p-3 rounded">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-900">{user.email}</span>
          </div>

          <div className="flex justify-between bg-gray-50 p-3 rounded">
            <span className="text-gray-500">Số điện thoại</span>
            <span className="font-medium text-gray-900">
              {user.phone || "Chưa cập nhật"}
            </span>
          </div>

          <div className="flex justify-between bg-gray-50 p-3 rounded">
            <span className="text-gray-500">Vai trò</span>
            <span className="font-medium text-gray-900 capitalize">
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
