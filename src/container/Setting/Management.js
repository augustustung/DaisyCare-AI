import { Button, Form, Input, notification, Upload } from 'antd'
import React from 'react'
import { FolderOpenOutlined, PlusOutlined } from '@ant-design/icons'
import Request from '../../services/request'
import { convertFileToBase64, xoa_dau } from '../../helper/common'

export default function ManagementSection({ translation }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = React.useState()
  const uploadImage = (options) => {
    const { onSuccess } = options;
    onSuccess("Ok");
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{translation("landing.uploadImage")}</div>
    </div>
  );

  async function handleSave(value) {
    setLoading(true)
    let listImage = []
    for (let i = 0; i < value.picture.fileList.length; i++) {
      await convertFileToBase64(value.picture.fileList[i].originFileObj).then(dataUrl => {
        const newData = dataUrl.replace(/,/gi, '').split('base64')
          if(newData[1]) {
            const data = {
              imageData: newData[1],
              imageFormat: "jpeg"
            }
            listImage.push(data)
          }
      })
    }

    Request({
      method: "POST",
      path: "/upload",
      data: {
        listImage: listImage,
        staffName: xoa_dau(value.staffName)
      }
    }).then(result =>{ 
      if(result && result === 'ok') {
        form.resetFields()
        notification.success({
          message: "",
          description: translation('landing.addStaffSuccess')
        })
      } else {
        notification.error({
          message: "",
          description: translation('landing.error')
        })
      }
      setLoading(false)
    })
  }

  return (
    <>
      <div className='setting_title'>{translation('landing.management')}</div>
      <Form form={form} onFinish={handleSave}>
        <div className='row'>
          <div className='col-7'>
            <div className='folder_name'>
              <div className='static'>
                <FolderOpenOutlined /> @root/Media/
              </div>
              <Form.Item
                name="staffName"
                rules={[{ required: true, message: translation("landing.required") }]}
              >
                <Input placeholder={translation('landing.staffName')}/>
              </Form.Item>
            </div>
          </div>
          <div className='uploading_image'>
          <Form.Item 
            name={"picture"}
          >
            <Upload
              listType="picture-card"
              accept="image/*"
              multiple
              customRequest={uploadImage}
              maxCount={6}
            >
              {
                form.getFieldValue("picture")?.fileList?.length > 5 ? null : uploadButton
              }
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button loading={loading} htmlType='submit'>{translation("landing.confirm")}</Button>
          </Form.Item>
        </div>
      </div>
      </Form>
    </>
  )
}
