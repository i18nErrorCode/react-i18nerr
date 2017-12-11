import React from 'react';
import { Layout, Row, Col, Card } from 'antd';
import HeaderBar from './HeaderBar';

const { Content, Footer } = Layout;

function MainLayout({ children }) {
  return (
    <Layout>
      <Content>
        <Row>
          <Col
            lg={{ span: 20, offset: 2 }}
            md={{ span: 20, offset: 2 }}
            sm={{ span: 20, offset: 2 }}
            xs={{ span: 24 }}
          >
            <HeaderBar />
            <Card>{children}</Card>
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        <p>Copyright © 2017</p>
        <p>
          Created by{' '}
          <a href="https://github.com/axetroy">
            Axetroy
          </a>
        </p>
      </Footer>
    </Layout>
  );
}
export default MainLayout;
