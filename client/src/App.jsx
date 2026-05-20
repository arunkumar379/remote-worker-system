import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

function App() {

  const token =
    localStorage.getItem("token");

  const userData =
    localStorage.getItem("user");

  const user =
    userData
      ? JSON.parse(userData)
      : null;

  if (!token || !user) {
    return <Login />;
  }

  if (user.role === "admin") {
    return <Admin />;
  }

  return <Dashboard />;
}

export default App;