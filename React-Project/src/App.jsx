import React, { useState } from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import LoginPage from "./Components/Pages/LoginPage";
import SignUpPage from "./Components/Pages/SignUpPage";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("login");
  };

  const renderContent = () => {
    if (user) {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome, {user.name}!
              </h1>
              <p className="text-gray-600 mb-6">
                You have successfully logged in to your dashboard.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Profile</h3>
                  <p className="text-blue-600">Manage your account settings</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">
                    Analytics
                  </h3>
                  <p className="text-green-600">View your activity data</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">
                    Settings
                  </h3>
                  <p className="text-purple-600">Customize your experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case "login":
        return (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToSignUp={() => setCurrentPage("signup")}
          />
        );
      case "signup":
        return (
          <SignUpPage
            onSignUp={handleLogin}
            onSwitchToLogin={() => setCurrentPage("login")}
          />
        );
      default:
        return (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToSignUp={() => setCurrentPage("signup")}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      <main className="flex-1">{renderContent()}</main>
      <Footer />
    </div>
  );
}

export default App;
