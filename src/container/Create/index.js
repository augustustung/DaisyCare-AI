import { Button, DatePicker, Form, Input, Space, Modal } from 'antd'
import moment from 'moment'
import React from 'react'
import './create.scss'
import { useSelector } from 'react-redux'
import _ from 'lodash'

function Create({ openModal, onCancel, infoDate, onCreateEvent}) {
  const [form] = Form.useForm()
  const user = useSelector(state => state.member)
  React.useEffect(() => {
    if (infoDate) {
      form.setFieldsValue({
        date: [moment(infoDate), moment(infoDate)]
      })
    }
  }, [infoDate])

  async function handleCreate(EVENT) {
    const values = await form.validateFields();
    if(values && !_.isEmpty(values)) {
      let data = {
        title: values.title,
        startDate: moment(values.date[0]).locale('vi').add(1, 'day').toISOString(),
        endDate: moment(values.date[1]).locale('vi').add(1, 'day').toISOString(),
        adminId: user.id,
        employee: [],
        timeLimit: 9,
        eventType: EVENT
      }
      onCreateEvent(data)
      form.resetFields()
    }
  }

  return (
    <Modal
      visible={openModal}
      onCancel={onCancel}
      footer={null}
      title={null}
      className="shadow-none border-0 mb-0 rounded-0 mt-3"
    >
      <div className='create-title'>Tạo lịch kiểm tra</div>
      <Form form={form}>
        <Form.Item
          name="title"
          rules={[{ required: true, message: "Tiêu đề không được bỏ trống" }]}
        >
          <Input autoFocus placeholder="Tiêu đề" />
        </Form.Item>
        <Form.Item
          name="date"
          rules={[{ required: true, message: "Ngày không được bỏ trống" }]}
        >
          <DatePicker.RangePicker className='w-100' placeholder={["Ngày bắt đầu", "Ngày kết thúc"]} />
        </Form.Item>
        <div className='d-flex justify-content-center'>
          <Space>
            <Button type="primary" onClick={() => handleCreate("START")}>Tạo kiểm tra đến</Button>
   
            <Button type="default" onClick={() => handleCreate("END")}>Tạo kiểm tra về</Button>
          </Space>
        </div>
      </Form>
    </Modal>
  )
}

export default Create