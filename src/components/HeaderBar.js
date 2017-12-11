import React from 'react';
import { Menu, Icon, Row, Col } from 'antd';
import { Link } from 'dva/router';
import styles from './HeaderBar.less';
import { connect } from 'dva';

@connect(state => ({
  user: state.user
}))
class HeaderBar extends React.Component {
  state = {
    current: 'mail'
  };
  handleClick = e => {
    // console.log('click ', e);
    this.setState({
      current: e.key
    });
  };
  logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    localStorage.removeItem("username");
    window.location.href = "/login"
  };
  render() {
    return (
      <Row className={styles.container}>
        <Col span={20}>
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="home">
              <Link to="/">
                <Icon type="home" />
                首页
              </Link>
            </Menu.Item>
            <Menu.Item key="app">
              <Link to="/user-table">
                <Icon type="appstore" />
                我的集合
              </Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col span={4}>
          {localStorage.getItem("username") ?
            <span>您好: {localStorage.getItem("username")} !</span>
              :
            <span className={styles.action}>
              <Link to="/login">登录</Link>
            </span>
          }
          <span className={styles.action}>
            <Link to="/register">注册</Link>
          </span>
          <span className={styles.action}>
            <a onClick={() => this.logout()}><Icon type="logout" />登出</a>
          </span>
        </Col>
      </Row>
    );
  }
}

export default HeaderBar;
