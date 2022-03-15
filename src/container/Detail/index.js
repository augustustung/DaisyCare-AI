import { Card, Table } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ChevronLeft } from 'react-feather'
import { useTranslation } from 'react-i18next'
import './detail.scss'
import Request from '../../services/request'

const DEFAULT_FILTER = { filter: {}, skip: 0, limit: 20, startDate: moment().format("DD/MM/YYYY"), endDate: moment().format("DD/MM/YYYY") }

function Detail(props) {
  const history = props.history
  const [listEmployee, setListEmployee] = useState({
    data: [],
    total: 1
  })
  const [dataFilter, setDataFilter] = useState(DEFAULT_FILTER)
  const { t: translation } = useTranslation()

  const columns = [
    {
      title: translation('landing.index'),
      dataIndex: 'key',
      key: 'key',
      render: (_, __, index) => {
        return dataFilter.skip ? listEmployee.total - (dataFilter.skip + index) : listEmployee.total - (index)
      }
    },
    {
      title: translation('landing.fullname'),
      dataIndex: 'employeeFullName',
      key: 'employeeFullName',
      width: 168
    },
    {
      title: translation('landing.gender'),
      key: 'employeeGender',
      dataIndex: 'employeeGender',
      render: (value) => {
        return value === "M" ? "Nam" : 'Nữ'
      }
    },
    {
      title: translation('landing.birthday'),
      key: 'employeeBirthDay',
      dataIndex: 'employeeBirthDay'
    },
    {
      title: translation('landing.timeCome'),
      key: 'timeCome',
      dataIndex: 'timeCome',
      render: (value) => {
        return moment(value).format("LLL")
      }
    },
    {
      title: translation('landing.timeGo'),
      key: 'timeLeave',
      dataIndex: 'timeLeave',
      render: (value) => {
        return value ? moment(value).format("LLL") : ""
      }
    },
  ];

  const fetchListData = (paramFilter) => {
    Request({
      method: "POST",
      path: "/get-detail-event",
      data: paramFilter
    }).then(result => {
      if(result && result.employee) {
        setListEmployee({
          total: result.employee.length,
          data: result.employee
        })
      }
    })
  }

  useEffect(() => {;
    fetchListData({ id: window.location.pathname.split("/detail/")[1] });
  },[])

  return (
    <Card className="shadow-none border-0 mb-0 rounded-0 mt-3 list_detail_user">
      <div onClick={history.goBack} className='d-flex mb-3 pointer'>
        <ChevronLeft />
      {translation('landing.goBack')}
      </div>
      <Table
        dataSource={listEmployee.data}
        rowClassName={(record) => `${record && record.CustomerScheduleStatus ? 'handled_customer' : ''}`}
        columns={columns}
        scroll={{ x: 1200 }}
        pagination={{
          position: ['bottomCenter'],
          total: listEmployee.total,
          pageSize: dataFilter.limit,
          current: dataFilter.skip ? (dataFilter.skip / dataFilter.limit) + 1 : 1
        }}
        onChange={({ current, pageSize }) => {
          dataFilter.skip = (current - 1) * pageSize
          setDataFilter({ ...dataFilter })
          fetchListData(dataFilter)
        }}
      />
    </Card>
  )
}

export default Detail
