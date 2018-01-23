import React, { Component } from "react";
import MainLayout from "../../components/MainLayout";
import { connect } from "dva";
import { Table, Input, Form, Button, Modal } from "antd";
const FormItem = Form.Item;

@connect(state => ({
  rows: state.rows
}))
class UserRows extends Component {
  constructor(props) {
    super(props);
    this.rowData = {};
    this.state = {
      visible: false,
      action: "createRow",
      rowId: "",
      haveMember: false,
      columns: [
        {
          title: "Code",
          dataIndex: "code",
          key: "code",
          width: "5%"
        },
        {
          title: "Key",
          dataIndex: "key",
          key: "key",
          width: "20%"
        },
        {
          title: "简体中文",
          dataIndex: "value_cn",
          key: "value_cn",
          width: "25%"
        },
        {
          title: "English",
          dataIndex: "value_en",
          key: "value_en",
          width: "25%"
        },
        {
          title: "繁体中文",
          dataIndex: "value_tw",
          key: "value_tw",
          width: "25%"
        },
        {
          title: "操作",
          dataIndex: "operation",
          render: (text, record) =>
            this.props.rows.haveMember ? (
              <div>
                <Button type="primary" onClick={() => this.updateRow(record)}>
                  修改
                </Button>
                {/*<Button type="danger">刪除</Button>*/}
              </div>
            ) : (
              <div />
            )
        }
      ]
    };
  }

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  /**
   * 新增某一条数据
   */
  handleAdd = () => {
    this.setState({
      visible: true,
      action: "createRow"
    });
  };
  /**
   * 更新某一条数据
   */
  updateRow(record) {
    this.setState({
      visible: true,
      action: "updateRow",
      rowId: record.id
    });
    this.props.form.setFieldsValue({
      key: record.key,
      value_cn: record.value_cn,
      value_en: record.value_en,
      value_tw: record.value_tw
    });
  }

  /**
   * 创建一条新数据
   * @param e
   */
  handleSubmit(e, action) {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        if (action === "createRow") {
          values.tid = this.props.location.search.split("&")[0].replace("?id=", "");
          values.id = this.state.rowId;
          this.props.dispatch({
            type: "rows/createRow",
            payload: { argv: values }
          });
        } else {
          values.tid = this.props.location.search.split("&")[0].replace("?id=", "");
          values.id = this.state.rowId;
          this.props.dispatch({
            type: "rows/updateRow",
            payload: { argv: values }
          });
        }
        this.setState({
          visible: false
        });
      }
    });
  }
  /**
   * 获取row列表
   * @returns {*}
   */
  getRows = id => {
    this.props.dispatch({
      type: "rows/getRowsList",
      payload: { id: id }
    });
  };
  /**
   * 验证用户是否在一个表的成员组中
   * @returns {*}
   */
  haveMember() {}
  /**
   * 处理输入框输入的值
   * @returns {XML}
   */
  handleChange(e, _key) {
    this.rowData[_key] = e.target.value;
  }
  componentWillMount() {
    const id = this.props.location.search.split("&")[0].replace("?id=", "");
    this.getRows(id);
    this.props.dispatch({
      type: "rows/getMembers",
      payload: { tid: id }
    });
  }

  render() {
    // console.log('user rows ==> ', this.props.rows);
    const { rows, haveMember } = this.props.rows;
    const { columns, action } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <MainLayout>
        {haveMember && (
          <div className="table-operations">
            <Button type="primary" className="editable-add-btn" onClick={this.handleAdd}>
              添加
            </Button>
          </div>
        )}
        <Table
          pagination={false}
          bordered
          dataSource={rows}
          columns={columns}
          title={() => <h2>{this.props.match.params.name}</h2>}
        />

        <Modal
          onCancel={this.handleCancel.bind(this)}
          maskClosable={true}
          title="添加类型"
          footer={null}
          visible={this.state.visible}
        >
          <Form onSubmit={e => this.handleSubmit(e, action)} className="login-form">
            <FormItem label="key">
              {getFieldDecorator("key", {
                rules: [{ required: true, message: "请输入key!" }]
              })(<Input placeholder="key" onBlur={e => this.handleChange(e, "key")} />)}
            </FormItem>
            <FormItem label="简体中文">
              {getFieldDecorator("value_cn", {
                rules: [{ required: true, message: "请输入简体中文!" }]
              })(<Input placeholder="简体中文" onBlur={e => this.handleChange(e, "value_cn")} />)}
            </FormItem>
            <FormItem label="English">
              {getFieldDecorator("value_en", {
                rules: [{ required: true, message: "请输入英文!" }]
              })(<Input placeholder="English" onBlur={e => this.handleChange(e, "value_en")} />)}
            </FormItem>
            <FormItem label="繁体中文">
              {getFieldDecorator("value_tw", {
                rules: [{ required: true, message: "请输入繁体中文!" }]
              })(<Input placeholder="繁体中文" onBlur={e => this.handleChange(e, "value_tw")} />)}
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
      </MainLayout>
    );
  }
}

export default Form.create()(UserRows);
