import { Card, Switch } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next'
import './setting.scss'

function Setting() {
  const { t: translation, i18n } = useTranslation()

  return (
    <Card className='setting'>
      <div className='setting_title'>{translation('landing.setting')}</div>
      <div className='row'>
        <div className='col-5'>
          <div className='row'>
            <div className='col-6 setting_section'>
              {translation('landing.english')}
            </div>
            <div className='col-6'>
              <Switch onChange={() => {
                let newLang = i18n.language === 'en' ? 'vi' : 'en'
                i18n.changeLanguage(newLang)
              }} checked={i18n && i18n.language === 'en' ? true : false }/>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default Setting
