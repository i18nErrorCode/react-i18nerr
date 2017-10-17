/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { lazyload } from 'react-lazyload';

// @lazyload({
//   height: 200,
//   offset: 100,
//   once: true
// })
class Footer extends Component {
  state = {
    totalVisited: 0,
    created: new Date('2016-11-09 14:22:33')
  };

  componentDidMount() {}

  render() {
    return (
      <Row
        className="text-center"
        style={{
          marginTop: '2rem',
          padding: '2rem 0',
          backgroundColor: '#fff'
        }}
      >
        <Col span={24}>
          {this.state.totalVisited ? <p>总访问{this.state.totalVisited}次</p> : ''}
          <p>Copyright © 2017</p>
          <p>
            Created by{' '}
            <a target="_blank" href="https://github.com/axetroy">
              Axetroy
            </a>
          </p>
        </Col>
      </Row>
    );
  }
}
export default Footer;
