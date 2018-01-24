import { createApolloFetch } from 'apollo-fetch';
const uri = "http://localhost:6099/api/graphql";

function handleLogOut() {
  console.log("logout", window);
  localStorage.removeItem("token");
  localStorage.removeItem("uid");
  localStorage.removeItem("username");
  window.location.href="#login"
}
function checkStatus(response) {
  // console.log('request status ', response);
  if (!!response.parsed.errors) {
    const _error = response.parsed.errors[0].message;

    if(_error === "Invalid token") {
      console.log("err==>", _error);
      handleLogOut()
    }
    const error = new Error(_error);
    error.response = response;
    throw error;
  } else {
    return response;
  }

}

/**
 * 使用 apollo-fetch 封装的请求
 * apollo-fetch 是一个轻量级的GraphQL请求客户端，支持中间件和afterware修改请求和响应。
 * @param query   graph查询语句
 * @param variables  查询参数
 * @returns {Promise.<{data}>}
 */
export default async function request(query, variables) {
  const token = localStorage.getItem('token');
  const apolloFetch = createApolloFetch({ uri });

  apolloFetch.use(({ request, options }, next) => {
    // console.log("request===>", request.variables)
    if (!options.headers) {
      options.headers = {};
    }

    options.headers['authorization'] = token ? `Bearer ${token}` : null;
    // options.headers["X-SERVER"] = request.variables.service;
    // options.headers["X-Password-Pay"] = request.variables.psw;
    next();
  });
  apolloFetch.useAfter(({ response }, next) => {
    checkStatus(response);
    next();
  });

  // apolloFetch.useAfter(({ response }, next) => {
  //   // console.log('request after status ', response);
  //   if(response.parsed.errors) {
  //     const errMsg = response.parsed.errors[0].message;
  //     const errTxt = translateErrorMsg(errMsg);
  //     throw new Error(errTxt)
  //   }

  //   next();
  // })

  const response = await apolloFetch({ query, variables })
  return response;
}

