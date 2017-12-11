import React, { Component } from 'react';
import {
  Table,
  Input,
  Form,
  Button,
  Modal,
  message,
  Tag,
  Pagination,
  Select,
  Row,
  Col
} from 'antd';
import { Link } from 'dva/router';
import { connect } from 'dva';
import styles from './DataTable.less';
const FormItem = Form.Item;
const Option = Select.Option;

@connect(state => ({
  tables: state.tables
}))
class DataTable extends Component {
  tableData = {};
  state = {
    selectedRowKeys: [],
    totalPage: 0,
    action: '',
    removeTable: false, // 是否删除表格
    isRemoveMember: false, // 默认false为添加
    deleteMember: '', // 要删除的成员
    rowId: '',
    visible: false,
    showMemberModal: false,
    fileType: 'js', // 选择下载的文件类型
    columns: [
      {
        title: '表格名称',
        dataIndex: 'name',
        render: (text, record) => {
          return (
            <Link to={`table-rows?id=${record.id}&name=${record.name}`}>
              {record.name}
            </Link>
          );
        }
      },
      {
        title: '表格描述',
        dataIndex: 'description'
      },
      {
        title: '用户名',
        dataIndex: 'username',
        render: (text, record) => {
          return record.owner.username;
        }
      },
      {
        title: '成员',
        dataIndex: 'member',
        render: (text, record) => {
          return (
            <div>
              {record.owner &&
                record.member.map(v => {
                  return !this.props.uid ? (
                    <Tag
                      key={v.uid}
                      onClose={() => this.deleteMember(record, v.username)}
                    >
                      {v.username}
                    </Tag>
                  ) : (
                    <Tag
                      key={v.uid}
                      closable={this.props.tables.username === record.username ? false : true}
                      onClose={() => this.deleteMember(record, v.username)}
                    >
                      {v.username}
                    </Tag>
                  );
                })}
              {this.props.uid && (
                <Button
                  disabled={
                    this.props.tables.username !== record.username ? true : false
                  }
                  size="small"
                  type="dashed"
                  onClick={() => this.addMember(record)}
                >
                  + Add{' '}
                </Button>
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
    // this.props.form.setFieldsValue({
    //   name: this.props.TABLE_FORM.name,
    //   description: this.props.TABLE_FORM.description
    // });
    this.setState({
      visible: true,
      action: 'createTable'
    });

    this.props.dispatch({
      type: "tables/showModal",
      payload: true,
    })
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
      action: 'updateTable',
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
  submitMember() {
    const { addMemberName, rowId, deleteMember, isRemoveMember } = this.state;
    let _argv;
    if (isRemoveMember) {
      _argv = { id: rowId, username: deleteMember, isRemove: true };
    } else {
      _argv = { id: rowId, username: addMemberName };
    }
    this.props.dispatch({
      type: 'tables/changeMember',
      payload: { argv: _argv }
    });
    this.setState({
      showMemberModal: false
    });
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
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (action === 'createTable') {
          this.props.dispatch({
            type: 'tables/createTable',
            payload: { argv: values }
          });
        }
        if (action === 'updateTable') {
          const { rowId } = this.state;
          values.id = rowId;
          this.props.dispatch({
            type: 'tables/updateTable',
            payload: { argv: values }
          });
        }
        this.setState({
          visible: false
        });
      }
    });
  }

  componentDidMount() {
    if (this.props.uid) {
      this.getTableList(0, this.props.uid);
    } else {
      this.getTableList();
    }
  }
  /**
   * 获取所有表格
   */
  getTableList(page = 0, uid = null) {
    const _keyJson = uid
      ? {
          uid: uid
        }
      : null;
    this.props.dispatch({
      type: 'tables/getTableList',
      payload: {
        query: {
          limit: 10,
          page: page,
          keyJson: JSON.stringify(_keyJson)
        }
      }
    });
  }

  /**
   * 翻页
   */
  handlePagination = p => {
    if (this.props.uid) {
      this.getTableList(p - 1, this.props.uid);
    } else {
      this.getTableList(p - 1, null);
    }
  };

  /**
   * 选择下载的语言版本
   * @param v
   */
  selectType(v) {
    this.setState({ fileType: v });
  }
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  render() {
    console.log('uid==>', this.props);
    const { columns, action, totalPage } = this.state;
    const { tables, tablesMeta } = this.props.tables;
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div className={styles.container}>
        <Row className={styles.operation}>
          <Col span={4}>
            <Select
              defaultValue="JavaScript"
              style={{ width: 140 }}
              onChange={v => this.selectType(v)}
            >
              <Option value="js">JavaScript</Option>
              <Option value="ts">TypeScript</Option>
              <Option value="json">Json</Option>
              <Option value="go">Go</Option>
            </Select>
          </Col>
          <Col span={2}>
            <Button disabled={!hasSelected}>
              <a
                target="_blank"
                href={
                  'http://192.168.8.144:6099/api/raw/multi/' +
                  this.state.fileType +
                  '/' +
                  selectedRowKeys.join(',')
                }
              >
                下载
              </a>
            </Button>
          </Col>
          <Col span={2}>
            {this.props.uid && (
              <div className="table-operations">
                <Button
                  type="primary"
                  className="editable-add-btn"
                  onClick={this.handleAdd}
                >
                  添加
                </Button>
              </div>
            )}
          </Col>
        </Row>
        <Table
          rowSelection={rowSelection}
          pagination={false}
          bordered
          dataSource={tables}
          columns={columns}
          rowKey={r => r.id}
        />
        <div className="table-pagination">
          <Pagination
            showQuickJumper
            defaultCurrent={1}
            total={tablesMeta.count}
            onChange={p => this.handlePagination(p)}
          />
        </div>
        <Modal
          onCancel={this.handleCancel.bind(this)}
          maskClosable={true}
          title="添加"
          footer={null}
          visible={this.state.visible}
        >
          <Form
            onSubmit={e => this.handleSubmit(e, action)}
            className="login-form"
          >
            <FormItem label="name">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入name!' }]
              })(<Input placeholder="table name" />)}
            </FormItem>
            <FormItem label="description">
              {getFieldDecorator('description', {
                rules: [{ required: true, message: '请输入description!' }]
              })(<Input placeholder="table description" />)}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                确定
              </Button>
              <Button
                onClick={this.handleCancel.bind(this)}
                className="login-form-button"
              >
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
            <Input
              onBlur={v => this.setMemberName(v)}
              placeholder="member name"
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              onClick={() => this.submitMember()}
              className="login-form-button"
            >
              确定
            </Button>
            <Button
              onClick={this.hideMmeberModal.bind(this)}
              className="login-form-button"
            >
              取消
            </Button>
          </FormItem>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(DataTable);
