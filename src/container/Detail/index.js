import { Button, Card, DatePicker, Form, Input, Space, Select } from 'antd'
import moment from 'moment'
import React from 'react'
import { ChevronLeft } from 'react-feather'
import { useHistory, useLocation } from 'react-router'
import { listTimes } from '../../constants/listTime'

function Detail() {
  const { state } = useLocation()
  const [form] = Form.useForm()
  const history = useHistory()
  React.useEffect(() => {
    if(state) {
      console.log(state)
      form.setFieldsValue({
        date: [moment(state.date), moment(state.date)]
      })
    }
  }, [state])

  return (
    <Card className="shadow-none border-0 mb-0 rounded-0 mt-3">
      <div onClick={history.goBack} className='d-flex mb-3'>
        <ChevronLeft />
        Go back
      </div>

      <div>add event</div>
      <Form form={form}>
        <Form.Item
          name="title"
        >
          <Input autoFocus placeholder="title"/>
        </Form.Item>
        <Form.Item
          name="description"
        >
          <Input placeholder="description"/>
        </Form.Item>
        <Form.Item
          name="timeExpired"
        >
          <Select placeholder={"time expired"}>
            {
              listTimes.map(t => {
                return(
                  <Select.Option key={t} value={t}>{t}</Select.Option>
                )
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="date"
        >
          <DatePicker.RangePicker placeholder={["startDate", "endDate"]}/>
        </Form.Item>
        <div className='d-flex justify-content-center'>
          <Space>
            <Form.Item>
              <Button type="primary" htmlType="submit">Add start of date</Button>
            </Form.Item>
            <Form.Item>
              <Button type="default" htmlType="submit">Add end of date</Button>
            </Form.Item>
          </Space>
        </div>
      </Form>
    </Card>
  )
}

export default Detail
