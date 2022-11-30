import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.scss";

const Login = () => {
  //const reactBaseUrl = process.env.REACT_APP_BASE_URL;

  const [credentials, setCredentails] = useState({
    username: undefined,
    password: undefined,
  });

  const { error, loading, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setCredentails((prev) => ({...prev,[event.target.id]: event.target.value}));
  };

  const handleClick = async (event) => {
    event.preventDefault();
    dispatch({ type: "LOGIN_START" });
    
    try {
      const response = await axios.post("/auth/login",credentials);
     if(response.data.isAdmin) {
       dispatch({ type: "LOGIN_SUCCESS", payload: response.data.details });
        navigate("/");
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: { message: "You are not an Admin!" },
        });
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
    }
  };
  return (
    <div className="login">
      <div className="loginContainer">
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="lgInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          className="lgInput"
        />
        <button
          disabled={loading}
          onClick={handleClick}
          className="inputButton"
        >
          Login
        </button>

        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Login;
