import React from 'react';
import { Redirect } from 'react-router-dom';
const jwtDecode = require('jwt-decode');

const checkToken = () => {
  const token = localStorage.getItem('token');

  if(token) {
    const decodedJWT = jwtDecode(token);
    // console.log('jwt info ', decodedJWT);
    const timeNow = new Date().getTime();

    if(timeNow >= decodedJWT.exp*1000) {
      return false;
    }

    return true;
  }
  return false;
};
const isAuthenticated  = (component) => {
  if(checkToken()){
    return component
  }else{
    return <Redirect to={{pathname: "/login"}} />
  }
}
export default isAuthenticated
