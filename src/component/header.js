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
        <div
          className="blur"
          style={{
            width: '100%',
            height: '20rem',
            backgroundImage: 'url(./img/header-img.jpg)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'inherit',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            textAlign: 'center',
            color: '#fff',
            width: '100%',
            height: '100%'
          }}
        >
          <div
            style={{
              marginTop: '3rem'
            }}
          >
            <img
              style={{
                width: '10rem',
                borderRadius: '50%'
              }}
              src="https://avatars1.githubusercontent.com/u/9758711?v=3"
              alt=""
            />
            <h2>Axetroy's NeverLand</h2>
            <q>有些事现在不做 一辈子都不会做了</q>
          </div>
          <div
            style={{
              float: 'right',
              marginRight: '2rem'
            }}
          >
            <Icon
              type="search"
              style={{
                fontSize: '3rem',
                color: '#fff',
                cursor: 'pointer',
                border: '1px solid #64ceaa',
                borderRadius: '50%',
                backgroundColor: '#64ceaa',
                padding: '0.5rem'
              }}
              onClick={() => {
                this.props.history.push({
                  ...this.props.location,
                  pathname: '/search'
                });
              }}
            />
          </div>
        </div>
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
