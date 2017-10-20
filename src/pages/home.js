import React, { Component } from "react";
import DataTable from "../component/dataTable";
import store from "../redux/index";
import { Redirect } from "react-router-dom";

class Home extends Component {
  render() {
    const USER = store.getState().USER;
    return !USER ? (
      <Redirect to="/login" />
    ) : (
      <div>
        <DataTable />
      </div>
    );
  }
}

export default Home;
