import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { useSelector } from 'react-redux';
import FaceDetector from './container/faceDetector';
import Layout from './components/Layout/index';
import LoginV1 from './container/login';
import Home from './container/home'
import './common.scss'
import './inputCommon.scss'
import './selectCommon.scss'
import './tableCommon.scss'
import './modalCommon.scss'
import './buttonCommon.scss'
import './dropDownCommon.scss'
import 'antd/dist/antd.css';
import Detail from './container/Detail';
import { notification } from 'antd';
import Setting from './container/Setting'

export const routes = {
  login: {
    path: "/login",
    component: LoginV1,
    isAuth: false
  },
  timeKeeping: {
    path: "/time-keeping",
    component: FaceDetector,
    isAuth: false
  },
  detail: {
    path: '/detail/:id',
    component: Detail,
    isAuth: true
  },
  setting: {
    path: '/setting',
    component: Setting,
    isAuth: true
  }
}

routes.home = {
  path: "/",
  component: Home,
  isAuth: true
}

function App() {
  const user = useSelector((state) => state.member)
  const { isUserLoggedIn } = user

  notification.config({
    duration: 2
  })

  return (
    <Router>
      <Switch>
        {Object.keys(routes).map((key, index) => {
          if (isUserLoggedIn && routes[key].isAuth) {
            return (
              <Route
                key={index}
                extract
                path={routes[key].path}
                component={(props) => <Layout  {...props} Component={routes[key].component} isShowHeader={true} />}
              />
            )
          } else if (!routes[key].isAuth) {
            return (
              <Route
                key={index}
                extract
                path={routes[key].path}
                component={(props) => <Layout  {...props} Component={routes[key].component} isShowHeader={false} />}
                isShowHeader={false}
              />
            )
          }
        })}
        {isUserLoggedIn ? <Route component={(props) => <Layout isShowHeader={true}  {...props} Component={Home} />} />
          : <Route component={(props) => <Layout isShowHeader={false} isShowHeader={false} {...props} Component={FaceDetector} />} />}
      </Switch>
    </Router>
  );
}

export default App;
