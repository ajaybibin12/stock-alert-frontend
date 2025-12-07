import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./components/Auth/protectedRoute.jsx";
import { AuthProvider } from "./hooks/useAuth";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* ✅ FULL BLACK BACKGROUND */}
        <div className="min-h-screen bg-black text-white">

          {/* ✅ NAVBAR */}
          <header className="bg-black border-b border-slate-800">
            <nav className="max-w-6xl mx-auto p-4 flex items-center justify-between">

              {/* ✅ GREEN + WHITE BRAND */}
              <Link to="/" className="text-xl font-semibold tracking-tight">
                <span className="text-emerald-400">Stock</span>{" "}
                <span className="text-white">Alerts</span>
              </Link>

              <div className="space-x-4">
                <Link
                  to="/login"
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  Register
                </Link>
              </div>

            </nav>
          </header>

          {/* ✅ MAIN CONTENT */}
          <main className="max-w-6xl mx-auto p-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
