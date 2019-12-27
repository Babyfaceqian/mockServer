import React from 'react';
import styles from './index.less';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
import { menuList } from 'config';
import { Link } from 'react-router-dom';
export default class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      selectedKeys: []
    };
  }

  componentDidMount() {
    console.log('location', location);
    this.setState({ selectedKeys: [location.hash.replace('#', '')] })
  }

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  handleMenuSelect = ({ selectedKeys }) => {
    this.setState({ selectedKeys });
  }
  render() {
    return (
      <Layout className={styles.layout}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} collapsedWidth={0} width={120}>
          <div className={styles.logo}>MockServer</div>
          <Menu theme="dark" selectedKeys={this.state.selectedKeys} mode="inline" onSelect={this.handleMenuSelect}>
            {menuList.map(d => {
              return (
                <Menu.Item key={d.to}>
                  {/* <Icon type="pie-chart" /> */}
                  <Link to={d.to}>{d.name}</Link>
                </Menu.Item>
              )
            })}
          </Menu>
        </Sider>
        <Layout>
          {/* <Header style={{ background: '#fff', padding: 0 }} /> */}
          <Content style={{ margin: '0 16px' }}>
            {this.props.children}
          </Content>
          {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
        </Layout>
      </Layout>
    );
  }
}