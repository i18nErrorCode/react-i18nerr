import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import dynamic from 'dva/dynamic';

function RouterConfig({ history, app }) {
  const Home = dynamic({
    app,
    models: () => [import('./models/home'), import('./models/tables')],
    component: () => import('./routes/Home/Home'),
  });
  const UserTable = dynamic({
    app,
    models: () => [import('./models/tables')],
    component: () => import('./routes/UserTable/UserTable'),
  });
  const UserRows = dynamic({
    app,
    models: () => [import('./models/rows')],
    component: () => import('./routes/UserRows/UserRows'),
  });
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
        <Route path="/" exact component={Home} />
        <Route path="/user-table" exact component={UserTable} />
        <Route path="/table-rows" exact component={UserRows} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
