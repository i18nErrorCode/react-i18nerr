import React, { Component } from "react";
import get from "lodash.get";
import { Table, Input, Form, Button, Modal, message, Tag, Pagination } from "antd";
import { store } from "../redux/table";
import { tableFormStore } from "../redux/tableForm";
import { graphql } from "../lib/graphql";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
const FormItem = Form.Item;
class DataTable extends Component {
  tableData = {};
  state = {
    tables: { data: [], meta: {} },
    totalPage: 0,
    action: "",
    removeTable: false, // 是否删除表格
    isRemoveMember: false, // 默认false为添加
    deleteMember: "", // 要删除的成员
    rowId: "",
    visible: false,
    showMemberModal: false,
    columns: [
      {
        title: "table name",
        dataIndex: "name"
      },
      {
        title: "description",
        dataIndex: "description"
      },
      {
        title: "username",
        dataIndex: "username"
      },
      {
        title: "member",
        dataIndex: "member",
        render: (text, record) => {
          return (
            <div>
              {record.username &&
                record.member.map(v => {
                  return !this.props.uid ? (
                    <Tag key={v.uid} onClose={() => this.deleteMember(record, v.username)}>
                      {v.username}
                    </Tag>
                  ) : (
                    <Tag
                      key={v.uid}
                      closable={v.username === record.username ? false : true}
                      onClose={() => this.deleteMember(record, v.username)}
                    >
                      {v.username}
                    </Tag>
                  );
                })}
              {this.props.uid && (
                <Button
                  disabled={this.props.USER.username !== record.username ? true : false}
                  size="small"
                  type="dashed"
                  onClick={() => this.addMember(record)}
                >
                  + Add{" "}
                </Button>
              )}
            </div>
          );
        }
      },
      {
        title: "operation",
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <div>
              <Link to={`info/${record.id}`}>详情</Link>
              {this.props.uid && (
                <span className="action-btn" onClick={() => this.handleEdit(record)}>
                <span className="ant-divider" />
                  修改
                </span>
              )}
            </div>
          );
        }
      }
    ]
  };
  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  hideMmeberModal = () => {
    this.setState({
      showMemberModal: false
    });
  };
  /**
   * 创建table
   */
  handleAdd = record => {
    this.props.form.setFieldsValue({
      name: this.props.TABLE_FORM.name,
      description: this.props.TABLE_FORM.description
    });
    this.setState({
      visible: true,
      action: "createTable"
    });
  };
  /**
   * 修改table
   * @param record
   */
  handleEdit = record => {
    this.props.form.setFieldsValue({
      name: record.name,
      description: record.description
    });
    this.setState({
      visible: true,
      action: "updateTable",
      rowId: record.id
    });
  };

  /**
   * 添加成员
   */
  addMember = record => {
    this.setState({
      showMemberModal: true,
      rowId: record.id
    });
  };

  /**
   * 输入需要添加的table成员
   * @param v
   */
  setMemberName(v) {
    this.setState({ addMemberName: v.target.value });
  }
  /**
   * 删除成员
   * @param record
   */
  deleteMember = (record, deleteUser) => {
    let _this = this;
    this.setState(
      {
        isRemoveMember: true,
        rowId: record.id,
        deleteMember: deleteUser
      },
      () => {
        _this.submitMember();
      }
    );
  };
  /**
   * 处理表单提交table数据
   * @param e
   */
  handleSubmit(e, action) {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { rowId } = this.state;
        let _argv;
        if (action === "updateTable") {
          _argv = `{id: "${rowId}", name: "${values.name}", description: "${values.description}"}`;
        }
        if (action === "createTable") {
          _argv = `{name: "${values.name}", description: "${values.description}"}`;
        }
        try {
          const tableData = await graphql(`
          mutation ${action} {
            me {
              ${action}(argv: ${_argv}) {
                id
                uid
                name
                description
                owner {
                  username
                }
              }
            }
          }
        `)();
          message.info("操作成功");
          this.setState({
            visible: false
          });
          this.getTables();
        } catch (err) {
          console.error("handle table err: ", err);
        }
      }
    });
  }

  /**
   * 处理添加、删除表单成员逻辑
   * @returns {Promise.<void>}
   */
  async submitMember() {
    const { addMemberName, rowId, deleteMember, isRemoveMember } = this.state;
    let _argv;
    if (isRemoveMember) {
      _argv = `{id: "${rowId}", username: "${deleteMember}", isRemove: ${true}}`;
    } else {
      _argv = `{id: "${rowId}", username: "${addMemberName}"}`;
    }
    try {
      const changeMember = await graphql(`
        mutation changeMember {
          me {
            changeMember(argv: ${_argv}) 
          }
        }
      `)();
      this.setState({
        showMemberModal: false
      });
      if (!isRemoveMember) {
        this.getTables();
      }
    } catch (err) {
      console.error("changeMember err: ", err);
    }
  }
  componentWillMount() {
    this.getTables();
  }

  /**
   * 获取tables
   * @returns {Promise.<void>}
   */
  async getTables(page=0) {
    console.log("uid===》", this.props.uid);
    let _keyJson;
    this.props.uid
      ? (_keyJson = JSON.stringify(`{"uid": "${this.props.uid}"}`))
      : (_keyJson = null);

    try {
      const data = await graphql(`
      query getTableList {
        me {
          tables(query: { limit: 10, page: ${page} keyJson: ${_keyJson} }) {
            data {
              id
              uid
              name
              description
              owner {
                username
              }
              member {
                uid
                username
              }
            }
            meta {
              skip
              limit
              count
              page
            }
          }
        }
      }
    `)();
      this.props.storeTable(get(data, ["me", "tables", "data"]));
      this.setState({totalPage:data.me.tables.meta.count});
    }catch (err) {
      console.error("tables err: ", err);
    }
  }

  /**
   * 翻页
   * @param p
   */
  handlePagination(p) {
    this.getTables(p-1);
  }
  setName(e) {
    console.log("setName:", e.target.value)
  }
  /**
   * 处理输入框输入的值
   * @returns {XML}
   */
  handleChange(e, _key){
    this.tableData[_key] = e.target.value;
    this.props.storeTableForm(this.tableData);
  }
  render() {
    const { columns, action, totalPage } = this.state;
    let dataSource = this.props.TABLE;
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Button type="primary" className="editable-add-btn" onClick={this.handleAdd}>
          添加
        </Button>
        <Table pagination={false} bordered dataSource={dataSource} columns={columns} />
        <Pagination showQuickJumper defaultCurrent={1} total={totalPage} onChange={(p)=>this.handlePagination(p)} />
        <Modal
          onCancel={this.handleCancel.bind(this)}
          maskClosable={true}
          title="添加"
          footer={null}
          visible={this.state.visible}
        >
          <Form onSubmit={e => this.handleSubmit(e, action)} className="login-form">
            <FormItem label="name">
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "请输入name!" }]
              })(<Input placeholder="table name" onBlur={(e)=>this.handleChange(e, "name")}/>)}
            </FormItem>
            <FormItem label="description">
              {getFieldDecorator("description", {
                rules: [{ required: true, message: "请输入description!" }]
              })(<Input placeholder="table description" onBlur={(e)=>this.handleChange(e, "description")}/>)}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">
                确定
              </Button>
              <Button onClick={this.handleCancel.bind(this)} className="login-form-button">
                取消
              </Button>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          onCancel={this.hideMmeberModal.bind(this)}
          maskClosable={true}
          title="添加成员"
          footer={null}
          visible={this.state.showMemberModal}
        >
          <FormItem label="member-name">
            <Input onBlur={v => this.setMemberName(v)} placeholder="member name" />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              onClick={() => this.submitMember()}
              className="login-form-button"
            >
              确定
            </Button>
            <Button onClick={this.hideMmeberModal.bind(this)} className="login-form-button">
              取消
            </Button>
          </FormItem>
        </Modal>
      </div>
    );
  }
}

const connection = cmp => {
  return connect(
    function mapStateToProps(state) {
      return {
        TABLE: state.TABLE.map(v => {
          v.username = v.owner.username;
          v.key = v.id;
          return v;
        }),
        TABLE_FORM: state.TABLE_FORM,
        USER: state.USER
      };
    },
    function mapDispatchToProps(dispatch) {
      return bindActionCreators(
        {
          storeTable: store,
          storeTableForm: tableFormStore
        },
        dispatch
      );
    }
  )(cmp);
};
export default connection(Form.create()(DataTable));
