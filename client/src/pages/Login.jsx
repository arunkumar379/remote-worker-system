import { useState } from "react";
import axios from "axios";

function Login() {

  const [isLogin, setIsLogin] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/register",
        {
          name,
          email,
          password,
        }
      );

      alert(response.data.message);

    } catch (error) {

      console.log(error);

      alert("Registration Failed");
    }
  };

  const loginUser = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login Successful");

    } catch (error) {

      console.log(error);

      alert("Login Failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background:
          "linear-gradient(135deg,#020617,#0f172a,#1e1b4b)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: "420px",
          padding: "45px",
          borderRadius: "25px",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 40px rgba(0,0,0,0.4)",
        }}
      >

        <h1
          style={{
            color: "white",
            textAlign: "center",
            fontSize: "38px",
            marginBottom: "10px",
          }}
        >
          Remote Worker
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          Employee Attendance Management
        </p>

        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "18px",
              borderRadius: "12px",
              border: "none",
              outline: "none",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              fontSize: "16px",
            }}
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "18px",
            borderRadius: "12px",
            border: "none",
            outline: "none",
            background: "rgba(255,255,255,0.1)",
            color: "white",
            fontSize: "16px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "25px",
            borderRadius: "12px",
            border: "none",
            outline: "none",
            background: "rgba(255,255,255,0.1)",
            color: "white",
            fontSize: "16px",
          }}
        />

        {isLogin ? (
          <button
            onClick={loginUser}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background:
                "linear-gradient(to right,#2563eb,#1d4ed8)",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        ) : (
          <button
            onClick={registerUser}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background:
                "linear-gradient(to right,#22c55e,#16a34a)",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Create Account
          </button>
        )}

        <p
          onClick={() => setIsLogin(!isLogin)}
          style={{
            color: "#93c5fd",
            textAlign: "center",
            marginTop: "25px",
            cursor: "pointer",
          }}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>

      </div>
    </div>
  );
}

export default Login;