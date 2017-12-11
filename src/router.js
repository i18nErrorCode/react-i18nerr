import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
import isAuthenticated from './utils/isAuthenticated';
/* 保护路由组件 */
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => isAuthenticated() === true ?
      (<Component {...props} />) :
      (<Redirect to={{pathname: "/login", state: { from: props.location }}} />) } />
);

function RouterConfig({ history, app }) {
  /* 需要登录认证的路由 */
  const routes = [
    {
      path: '/',
      models: () => [import('./models/home'), import('./models/tables')],
      component: () => import('./routes/Home/Home'),
    },
    {
      path: "/user-table",
      models: () => [import('./models/tables')],
      component: () => import('./routes/UserTable/UserTable'),
    },
    {
      path: "/table-rows",
      models: () => [import('./models/rows')],
      component: () => import('./routes/UserRows/UserRows'),
    }
  ];
  const Login = dynamic({
    app,
    models: () => [import('./models/user')],
    component: () => import('./routes/Login/Login'),
  });
  const Register = dynamic({
    app,
    models: () => [import('./models/user')],
    component: () => import('./routes/Register/Register'),
  });
  return (
    <Router history={history}>
      <Switch>
        {
          routes.map(({ path, ...dynamics }, key) => (
            <PrivateRoute
              exact
              key={key}
              path={path}
              component={dynamic({
                app,
                ...dynamics
              })} />
          ))
        }
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
