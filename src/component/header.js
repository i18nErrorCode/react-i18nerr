/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'antd';
import { NavLink, matchPath, withRouter } from 'react-router-dom';

class Header extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      nav: [
        { path: '/', name: 'home', title: 'Home', icon: <Icon type="home" /> },
        {
          path: '/login',
          title: '登录',
          icon: ''
        },
        {
          path: '/register',
          title: '注册',
          icon: ''
        }
      ].filter(v => v)
    };
  }
  componentDidMount() {}

  render() {
    const pathname = this.props.location.pathname;
    const navClassName = 'ant-menu-item-selected';
    return (
      <div
        id="header"
        style={{
          position: 'relative'
        }}
      >
        <Menu mode="horizontal">
          {this.state.nav.map(nav => {
            return (
              <Menu.Item
                key={nav.path}
                className={(() => {
                  const navPath = nav.path;
                  const isMatchRoute = matchPath(pathname, {
                    path: navPath
                  });
                  if (pathname === '/') {
                    return pathname === navPath ? navClassName : '';
                  } else {
                    return isMatchRoute && navPath !== '/' ? navClassName : '';
                  }
                })()}
              >
                <NavLink
                  to={nav.path}
                  style={{
                    fontSize: '1.4rem'
                  }}
                >
                  {nav.icon ? nav.icon : ''}
                  {nav.title}
                </NavLink>
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
    );
  }
}
export default withRouter(Header);
