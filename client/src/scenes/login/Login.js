import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade,
  Paper,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";

// Custom styles
import useStyles from "./styles";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
// Assets
import logo from "./easypay-logo.png";
import bg_img from "../../assets/banner1.jpeg"
// Context for authentication
import { AuthContext, AuthProvider } from "../../context/AuthContext";

function Login() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { login, register,authUser} = useContext(AuthContext);
  const { isAuthenticated } = new AuthProvider();

  // Local state for form handling and UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeTabId, setActiveTabId] = useState(0);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  // useEffect(() => {
  //   // Check if the user is already authenticated
  //   // Implement this function to check auth state
  //   if (isAuthenticated()) {
  //     console.log(isAuthenticated());
  //     navigate("/dashboard");
  //   }
  // }, [navigate, isAuthenticated]);

  /**
   * Switches between Login and Register tabs
   * @param {number} id - Tab ID to set as active
   */
  const handleChangeTab = (id) => {
    setActiveTabId(id);
    setErrorMessage(null); // Clear error message when switching tabs
  };

  /**
   * Handles the Login functionality
   * Authenticates user and redirects to dashboard on success
   */
  const handleLogin = async () => {
    console.log("Attempting to log in with:", emailValue, passwordValue);
    const isLoggedIn = await login(
      emailValue,
      passwordValue,
      setIsLoading,
      setErrorMessage
    );
    console.log("Login successful:", isLoggedIn);
    if (isLoggedIn) {
      console.log("Navigating to dashboard");
      navigate("/dashboard");
    } else {
      console.log("Login failed");
    }
  };

  /**
   * Handles the Register functionality
   * Registers a new user and switches back to Login tab on success
   */
  console.log("hlleo",authUser)
  const handleRegister = async () => {
    const isRegistered = await register(
      emailValue,
      nameValue,
      passwordValue,
      setIsLoading,
      setErrorMessage
    );
    if (isRegistered) {
      setActiveTabId(0); // Switch to login tab after successful registration
    }
  };
  // ----------agent login system
    const [phone,setphone]=useState("");
   const [password,setpassword]=useState("");
    const [errortext,seterrortext]=useState("");
    const handleform=(e)=>{
       e.preventDefault();
       if(phone=="" || password==""){
                seterrortext("Please fill up your information!")
       }else if(!phone=="" || !password==""){
                axios.post(`${process.env.REACT_APP_BASE_URL2}/agent-login`,{phone,password})
                .then((res)=>{
                    if(res.data.success==true){
                        toast.success("Login Successful 🎉🎉");
                        localStorage.setItem('token',JSON.stringify(res.data.jwtToken) );
                        localStorage.setItem("agent_info",JSON.stringify(res.data.agent_info));
                       if(res.data.agent_info.status=="deactivated"){
                         setTimeout(() => {
                         navigate("/agent/waiting-for-approval")
                        }, 1000);
                       }else if(res.data.agent_info.status=="activated"){
                        setTimeout(() => {
                         navigate("/agent-dashboard")
                        }, 1000);
                       }
                    }else{
                           toast.error(res.data.message)
                    }
                }).catch((err)=>{
                    toast.error(err.name)
                })
       }
    }

  return (
<section className="relative h-screen overflow-hidden">
  {/* Background Image */}
  <img src={bg_img} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
 <Toaster/>
  {/* Main Grid Container */}
  <div className="absolute inset-0 flex items-center justify-end p-8 bg-transparent">
    {/* Form Container */}
    <div className="w-[100%] lg:w-[80%] xl:w-2/5 p-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => handleChangeTab(0)}
          className={`px-4 py-2 text-lg font-semibold border-b-2 transition ${
            activeTabId === 0 ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => handleChangeTab(1)}
          className={`px-4 py-2 text-lg font-semibold border-b-2 transition ${
            activeTabId === 1 ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500"
          }`}
        >
          Agent
        </button>
      </div>

      {/* Login Tab */}
      {activeTabId === 0 && (
        <div className="space-y-6">
          {errorMessage && (
            <div className="p-3 text-center text-sm text-red-600 bg-red-100 rounded-md">
              {errorMessage.toString()}
            </div>
          )}
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-[15px] lg:text-[16px] font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              placeholder="Enter your email address"
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition duration-200"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-[15px] lg:text-[16px] font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition duration-200"
            />
          </div>

          {/* Login Button */}
          <div>
            {isLoading ? (
              <div className="flex justify-center">
                <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                disabled={!emailValue || !passwordValue}
                className={`w-full py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition ${
                  !emailValue || !passwordValue ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}

      {/* Register Tab */}
      {activeTabId === 1 && (
        <div className="space-y-6">
          {errorMessage && (
            <div className="p-3 text-center text-sm text-red-600 bg-red-100 rounded-md">
              {errorMessage.toString()}
            </div>
          )}
          {/* Name Input */}
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-[15px] lg:text-[16px] font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              id="number"
              type="number"
              onChange={(e) => setphone(e.target.value)}
              placeholder="Enter your number"
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition duration-200"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-[15px] lg:text-[16px] font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              onChange={(e) => setpassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm transition duration-200"
            />
          </div>

          {/* Register Button */}
          <div>
            {isLoading ? (
              <div className="flex justify-center">
                <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              </div>
            ) : (
              <button
                onClick={handleform}
                disabled={!phone || !password}
                className={`w-full py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition ${
                  !phone || !password ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        © 2024 EassyPay. All rights reserved.
      </div>
    </div>
  </div>
</section>

  );
}

export default Login;