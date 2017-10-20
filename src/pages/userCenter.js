import React, { Component } from "react";
import { Alert } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { store } from "../redux/user";

class UserCenter extends Component {
  render() {
    const isLogin = !!this.props.USER;
    const user = this.props.USER;
    return (
      isLogin && (
        <Alert message={`您好, ${user.username}`} description="您的账号已登录..." type="success" showIcon />
      )
    );
  }
}
function connection(component) {
  return connect(function mapStateToProps(state) {
    return {
      USER: state.USER
    };
  })(component);
}
export default connection(UserCenter);
