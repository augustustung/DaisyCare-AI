import { Card } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next'
import './setting.scss'
import SettingSection from './setting';
import ManagementSection from './Management';

function Setting() {
  const { t: translation, i18n } = useTranslation()

  return (
    <Card className='setting'>
      <SettingSection i18n={i18n} translation={translation}/>
      <hr/>
      <ManagementSection translation={translation} />
    </Card>
  )
}

export default Setting
