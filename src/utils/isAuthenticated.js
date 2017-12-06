const jwtDecode = require('jwt-decode');

const isAuthenticated = () => {
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
}

export default isAuthenticated
