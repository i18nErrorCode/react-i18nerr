import React from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button } from 'antd';
import { Link } from 'dva/router';
import styles from './Login.less';

const FormItem = Form.Item;

class Login extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.dispatch({
          type: 'user/onLogin',
          payload: values
        })
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.login_container}>
        <div className={styles.top}>
          <div className={styles.header}>
            <a href="https://github.com/i18nErrorCode">
              <Icon className={styles.logo} type="github" />
              <span className={styles.title}>react-i18nerr</span>
            </a>
          </div>
          <div className={styles.desc}>规范化错误代码的编辑, 合并, 去重, 翻译, 导出. 一个平台上编写错误代码, 各平台使用</div>
        </div>
        <Form onSubmit={this.handleSubmit} className={styles.login_form}>
          <FormItem>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
              )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className={styles.login_button}>
              登录
            </Button>
            <p>没有账号? 点击 <Link to="/register">注册!</Link></p>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default connect()(Form.create()(Login));

