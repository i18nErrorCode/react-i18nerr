import React, { Component } from "react";
import { connect } from "react-redux";
import DataTable from "../component/dataTable";
class UserCenter extends Component {
  render() {
    const isLogin = !!this.props.USER;
    const uid = this.props.USER.uid;
    return (
      isLogin && (
        <DataTable uid={uid}/>
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
