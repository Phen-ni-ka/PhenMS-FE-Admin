import React, { useRef } from "react";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../features/authSlice";
import axiosClient from "../axios-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const emailRef = useRef();
  const passwordRef = useRef();

  const { token } = useSelector((state) => state.auth);

  const onSubmitHandle = (event) => {
    event.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    axiosClient
      .post("/login", payload)
      .then(({ data }) => {
        dispatch(setToken(data.token));
        toast.success("Đăng nhập thành công");
      })
      .catch((err) => {
        const response = err.response;
        toast.error(response.data.message);
      });
  };

  if (token) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="login">
      <ToastContainer theme="light" />
      <div class="container">
        <div class="card">
          <h2>Đăng nhập</h2>
          <form onSubmit={onSubmitHandle}>
            <label for="username">Email</label>
            <input
              ref={emailRef}
              type="text"
              id="username"
              placeholder="Nhập email"
            />
            <label for="password">Mật khẩu</label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
            />
            <button className="button" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
