import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import { useState } from 'react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loginEvents = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("https://mosquito-dear-mainly.ngrok-free.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response:", response.status, data);

      if (response.ok) {
        try {
          const [followerResponse, postsResponse] = await Promise.all([
            fetch("https://439d-31-223-84-100.ngrok-free.app/Follow/followers/1", {
              method: "GET",
              headers: { "ngrok-skip-browser-warning": "true" },
            }),
            fetch("https://5cad-212-253-197-38.ngrok-free.app/post/list", {
              method: "GET",
              headers: { "ngrok-skip-browser-warning": "true" },
            }),
          ]);

          const followerData = await followerResponse.json();
          const postsData = await postsResponse.json();

          navigate('/forum', { state: { username: formData.username, followerData, postsData } });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        alert("Kullanıcı adı veya parola yanlış");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="form-title">Login Page</h2>
      <form className="login-form" onSubmit={loginEvents}>
        <div className="input-wrapper">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input-field"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-wrapper">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="login-button" type="submit">Log In</button>
      </form>
      <p className="signup-prompt">
        Don&apos;t have an account? <Link to="/signup" className="signup-link">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;