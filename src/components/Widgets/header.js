import React from 'react';
import { useTranslation } from "react-i18next";
import { Button, Layout, Menu } from 'antd';
import { useDispatch } from 'react-redux'
import { routes } from  "./../../App"
import { handleSignout } from '../../actions';
const { Header: HeaderAntd } = Layout;

export default function Header(props) {
  const { t:translation } = useTranslation()
  const history = props.history
  const dispatch = useDispatch()

  const pathName = (props && props.location && props.location.pathname) || ""

  const FEATURE = [
    {
      name: translation('landing.setting'),
      href: routes.setting.path,
    },
    {
      name: translation("landing.statistical"),
      href: "#"
    }
  ]

  const _onClick = (href) => {
    history.push(href)
  }

  return (
    <HeaderAntd className="header">
      <div className="container">
      <Menu
        mode="horizontal"
        selectedKeys={[routes.home.path]}
      >
        <div className={`d-flex justify-content-center w-100 header__container}`}>
          <Menu.Item className="header__logo" onClick={() => history.replace("/")}>
            <img src={window.origin + "/logo.png"} className="logo" alt="logo"/>
          </Menu.Item>
          {/* {stationsLogo !== ""  && stationsLogo ? (<img src={stationsLogo} className="logo" alt="logo" />) : 
          <img src={IconLogo} className="logo" alt="logo"/> } */}
        <div className="d-flex w-100 justify-content-center header_content">
        {
          FEATURE.map((item, i) => (
            <>
              <Menu.Item
                  className={pathName === item.href ? 'active' : '' }
                  onClick={() => {_onClick(item.href)}} 
                key={item.href}
              >
                {item.name.toUpperCase()}
              </Menu.Item>
            </>
          ))
        }
        </div>
        <Menu.Item
          className="header__button"
        >
          <Button type="primary" onClick={() => dispatch(handleSignout())}>{translation('landing.logout')}</Button>
        </Menu.Item>
        </div>
      </Menu>
        </div>
    </HeaderAntd>
  );
}
