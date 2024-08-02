import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const Form = ({ isSignInPage = "" }) => {
  const [data , setData] = useState({
    ...(!isSignInPage && {fullname: ""}),
    email: "",
    password: "",
  })
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8000/api/${isSignInPage ? 'login' : 'register'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if(res.status === 400) {
      alert('Invalid credetials')
    } else {
      const resData = await res.json()
      if(resData.token) {
        localStorage.setItem('user:token', resData.token);
        localStorage.setItem('user:detail', JSON.stringify(resData.user));
        navigate('/')
      }
    }
  }

  return (
    <div className="bg-light h-screen flex items-center justify-center">
      <div className="bg-white w-[450px] h-[550px] shadow-lg rounded-lg flex flex-col justify-center items-center">
      <div className="text-4xl font-bold">Welcome {isSignInPage && "Back"}</div>
      <div className="text-2xl font-light mb-8">
        {isSignInPage ? "Sign in to get explored" : "Sign up to get started"}
      </div>
      <form className="w-full px-14" onSubmit={(e) => handleSubmit(e)}>
      {!isSignInPage && (
        <Input
          label="Full name"
          name="name"
          placeholder="Enter Your Full Name"
          className="mb-4"
          value={data.fullname}
          onChange={(e) => setData({ ...data, fullname: e.target.value})}
        />
      )}
      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter Your Email"
        className="mb-4"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value})}
      />
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter Your Password"
        className="mb-6"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value})}
      />
      <Button label={isSignInPage ? "Sign in" : "Sign Up"} type="submit" className="mb-3" />
      </form>
      <div className="text-black">
        {isSignInPage ? "Didn't have an account? " : "Already have an account? "}
        <span className="text-primary cursor-pointer underline" onClick={()=> navigate(`/users/${isSignInPage ? "sign-up" : "sign-in"}`)}>
          {isSignInPage ? "Sign Up" : "Sign In"}
        </span>{" "}
      </div>
    </div>
    </div>
  );
};

export default Form;
