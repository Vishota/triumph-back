import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);

  const [errors, setErrors] = useState({
    phone: false,
    password: false,
  });
  const [shake, setShake] = useState({
    phone: false,
    password: false,
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = {
      phone: !phone,
      password: !password,
    };
  
    setErrors(newErrors);
  
    Object.entries(newErrors).forEach(([field, hasError]) => {
      if (hasError) {
        setShake((prev) => ({ ...prev, [field]: true }));
        setTimeout(() => {
          setShake((prev) => ({ ...prev, [field]: false }));
        }, 400);
      }
    });
  
    if (Object.values(newErrors).some((e) => e)) return;
  
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        navigate(data.role === "admin" ? "/admin" : "/account");
      } else {
        setErrors("Неверный логин или пароль");
      }
  
      // localStorage.setItem("token", "mock-token");
      // localStorage.setItem("role", "user");
      const role = localStorage.getItem("role");
      navigate(role === "admin" ? "/admin" : "/account");
    } catch {
      alert("Ошибка подключения. Попробуйте позже.");
    }
  };
  

  return (
    <div className="registration">
      <h1 className="registration__title">ВХОД</h1>

      <form className="registration__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className={`registration__form-input ${
            errors.phone ? "input--error" : ""
          } ${shake.phone ? "input--shake" : ""}`}
          placeholder="Номер телефона"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="registration__form-input-wrapper">
          <input
            type={visiblePassword ? "text" : "password"}
            className={`registration__form-input ${
              errors.password ? "input--error" : ""
            } ${shake.password ? "input--shake" : ""}`}
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="registration__form-input-button"
            onClick={() => setVisiblePassword(!visiblePassword)}
          >
            <span
              className={`registration__form-input-icon ${
                visiblePassword ? "registration__form-input-icon--visible" : ""
              }`}
            />
          </button>
        </div>

        <button type="submit" className="registration__submit-button">
          Войти
        </button>

        <div style={{ marginTop: "20px", textAlign: "center" }}>или</div>

        <button
          type="button"
          className="registration__submit-button"
          style={{
            backgroundColor: "transparent",
            color: "#283991",
            border: "1px solid #28399159",
            marginTop: "20px",
          }}
          onClick={() => navigate("/register")}
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
