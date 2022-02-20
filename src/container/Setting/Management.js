import { Button, Form, Input, notification, Upload } from 'antd'
import React from 'react'
import { FolderOpenOutlined, PlusOutlined } from '@ant-design/icons'

export default function ManagementSection({ translation }) {
  const [form] = Form.useForm()

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

  function handleSave(value) {
    console.log(value);
  }

  return (
    <>
      <div className='setting_title'>{translation('landing.management')}</div>
      <Form form={form} onFinish={handleSave}>
        <div className='row'>
          <div className='col-7'>
            <div className='folder_name'>
              <div className='static'>
                <FolderOpenOutlined />/Media/
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
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
            <Button htmlType='submit'>{translation("landing.confirm")}</Button>
          </Form.Item>
        </div>
      </div>
      </Form>
    </>
  )
}
