import React, { Component } from "react";
import { Menu } from "antd";
import { NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store } from "../redux/user";

class StatusBar extends Component {
  logout() {
    localStorage.removeItem("token");
    this.props.storeUserInfo("");
    this.props.history.push("/login");
  }
  render() {
    return (
      <div>
        {!this.props.USER.username ? (
          <Menu mode="horizontal">
            <Menu.Item>
              <NavLink to="/login">登录</NavLink>
            </Menu.Item>
            <Menu.Item>
              <NavLink to="/register">注册</NavLink>
            </Menu.Item>
          </Menu>
        ) : (
          <div>
            <ul className="ant-menu ant-menu-horizontal ant-menu-light ant-menu-root">
              <li className="ant-menu-item">您好：{this.props.USER.username}</li>
              <li className="ant-menu-item">
                <NavLink to="/user">个人中心</NavLink>
              </li>
              <li className="ant-menu-item">
                <a onClick={this.logout.bind(this)}>登出</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }
}
function connection(component) {
  return connect(
    function mapStateToProps(state) {
      return {
        USER: state.USER
      };
    },
    function mapDispatchToProps(dispatch) {
      return bindActionCreators(
        {
          storeUserInfo: store
        },
        dispatch
      );
    }
  )(component);
}
export default connection(withRouter(StatusBar));
