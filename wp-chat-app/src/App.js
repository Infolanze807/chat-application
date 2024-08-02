import React from 'react'
import Form from './modules/Form';
import Dashboard from './modules/Dashboard';
import { Routes, Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, auth = false }) => {
  const isLoggedIn = localStorage.getItem('user:token') !== null || false;

  if(!isLoggedIn && auth) {
    return <Navigate to={'/users/sign-in'} />
  } else if(isLoggedIn && ['/users/sign-in', "/users/sign-up"].includes(window.location.pathname)){
    return <Navigate to={"/"} />
  }
  return children
}

const App = () => {
  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoute auth={true}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path='/users/sign-up' element={
        <ProtectedRoute>
          <Form isSignInPage={false} />
        </ProtectedRoute>
      } />
      <Route path='/users/sign-in' element={
        <ProtectedRoute>
          <Form isSignInPage={true} />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App;
