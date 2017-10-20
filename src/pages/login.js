import React, { Component } from "react";
import { Form, Icon, Input, Button, message, Modal } from "antd";
import get from "lodash.get";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { graphql } from "../lib/graphql";
import { store } from "../redux/user";
import { Redirect } from "react-router-dom";
import "./login.css";

const FormItem = Form.Item;

class NormalLoginForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // submit
        graphql(`
        mutation Login{
          public{
            login(argv: {username: "${values.username}", password: "${values.password}"}) {
              uid
              username
              token
            }
          }
        }
      `)()
          .then(data => {
            localStorage.setItem("token", get(data, ["public", "login", "token"]));
            this.props.storeUserInfo(get(data, ["public", "login"]));
            message.info("Login success...");
          })
          .catch(err => {
            console.log("err:", err);
            Modal.warning({
              title: "登录失败",
              content: <p>{err.message}</p>,
              onOk() {}
            });
          });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
        <FormItem>
          {getFieldDecorator("username", {
            rules: [{ required: true, message: "Please input your username!" }]
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input your Password!" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Login
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(connection(NormalLoginForm));

class Login extends Component {
  render() {
    const isLogin = !!this.props.USER;
    const user = this.props.USER;
    return <div>{isLogin ? <Redirect to="user" /> : <WrappedNormalLoginForm />}</div>;
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

export default connection(Login);
