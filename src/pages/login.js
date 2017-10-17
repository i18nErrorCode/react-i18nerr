import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, message, Alert } from 'antd';
import get from 'lodash.get';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { graphql } from '../lib/graphql';
import { store } from '../redux/user';

import './login.css';

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
            console.log(this);
            localStorage.setItem('token', get(data, ['public', 'login', 'token']));
            this.props.storeUserInfo(get(data, ['public', 'login']));
            message.info('Login success...');
          })
          .catch(err => {
            message.error(err.message);
          });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
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
  logout() {
    console.info(`logout`);
    localStorage.removeItem('token');
    this.props.storeUserInfo('');
  }
  render() {
    const isLogin = !!this.props.USER;
    const user = this.props.USER;
    return (
      <div>
        {isLogin ? (
          <div>
            <Alert
              message={`您好, ${user.username}`}
              description="您的账号已登录..."
              type="success"
              showIcon
            />
            <Button onClick={this.logout.bind(this)}>点击登出</Button>
          </div>
        ) : (
          <WrappedNormalLoginForm />
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

export default connection(Login);
