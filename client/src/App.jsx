import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

function App() {

  const token =
    localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <>

      {!token ? (

        <Login />

      ) : user?.email ===
        "admin@gmail.com" ? (

        <Admin />

      ) : (

        <Dashboard />

      )}

    </>
  );
}

export default App;