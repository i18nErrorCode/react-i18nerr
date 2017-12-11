import React from 'react';
import MainLayout from '../../components/MainLayout';
import DataTable from '../../components/DataTable';
import { connect } from 'dva';
function UserTable() {
  const uid = localStorage.getItem("uid");
  const username = localStorage.getItem("username");
  return (
    <MainLayout>
      <div>
        <DataTable uid={uid} username={username}/>
      </div>
    </MainLayout>
  );
}

UserTable.propTypes = {
};

function connection(component) {
  return connect(function mapStateToProps(state) {
    const { userInfo } = state.user;
    return {
      userInfo
    };
  })(component);
}
export default UserTable;
