import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';
import 'antd/dist/antd.css';
import Wrapper from './modules/layout/views/wrapper';
import { menuList } from 'config';

let history = createHashHistory();
let route = <Router history={history}>
  <Wrapper>
    <Switch>
      {menuList.map(d => {
        return (
          <Route path={d.to} component={d.comp}></Route>
        )
      })}
      <Redirect to={menuList[0].to}></Redirect>
    </Switch>
  </Wrapper>
</Router>
ReactDOM.render(route, document.getElementById('root'));