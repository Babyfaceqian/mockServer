import React from 'react';
import ReactDOM from 'react-dom';
import Wrapper from './modules/layout/views/wrapper';
import InterfaceManagement from './modules/interfaceManagement/views';
import 'antd/dist/antd.css'
ReactDOM.render(<Wrapper>
  <InterfaceManagement />
</Wrapper>, document.getElementById('root'));