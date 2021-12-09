import { Card, Input } from 'antd'
import './login.scss'
import { Button, Form, notification } from 'antd'
import { useDispatch } from 'react-redux'
import { handleSignin } from '../../actions/index'
import { useTranslation } from 'react-i18next'

const LoginV1 = (props) => {
  const dispatch = useDispatch()
  const { t: translation } = useTranslation()

  function handleSubmit(e) {
    notification.success({
      message: "",
      description: translation('landing.loginSuccess', { name: "Bui Huy Tung"})
    })
    dispatch(handleSignin({
      "staffId": 1,
      "roleId": 1,
      "username": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "chaupad@gmail.com",
      "password": "fc6e53bc3b36d4f8a9479ab9886904dc62b1194f60cc0a7dea4fbc58e0859614",
      "active": "1",
      "ipAddress": null,
      "phoneNumber": "string",
      "lastActiveAt": "2021-12-08 07:05:10.456",
      "twoFACode": null,
      "telegramId": null,
      "facebookId": null,
      "appleId": null,
      "createdAt": "2021-10-30T14:28:14.000Z",
      "isDeleted": 0,
      "roleName": "Admin",
      "permissions": "UPLOAD_CHAPTER,MANAGE_BOOKS,MANAGE_USER,MANAGE_STAFF",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGFmZklkIjoxLCJyb2xlSWQiOjEsInVzZXJuYW1lIjoic3RyaW5nIiwiZmlyc3ROYW1lIjoic3RyaW5nIiwibGFzdE5hbWUiOiJzdHJpbmciLCJlbWFpbCI6ImNoYXVwYWRAZ21haWwuY29tIiwicGFzc3dvcmQiOiJmYzZlNTNiYzNiMzZkNGY4YTk0NzlhYjk4ODY5MDRkYzYyYjExOTRmNjBjYzBhN2RlYTRmYmM1OGUwODU5NjE0IiwiYWN0aXZlIjoiMSIsImlwQWRkcmVzcyI6bnVsbCwicGhvbmVOdW1iZXIiOiJzdHJpbmciLCJsYXN0QWN0aXZlQXQiOiIyMDIxLTEyLTA4IDA3OjA1OjEwLjQ1NiIsInR3b0ZBQ29kZSI6bnVsbCwidGVsZWdyYW1JZCI6bnVsbCwiZmFjZWJvb2tJZCI6bnVsbCwiYXBwbGVJZCI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyMS0xMC0zMFQxNDoyODoxNC4wMDBaIiwiaXNEZWxldGVkIjowLCJyb2xlTmFtZSI6IkFkbWluIiwicGVybWlzc2lvbnMiOiJVUExPQURfQ0hBUFRFUixNQU5BR0VfQk9PS1MsTUFOQUdFX1VTRVIsTUFOQUdFX1NUQUZGIiwidG9rZW5UeXBlIjoibm9ybWFsVXNlciIsImlhdCI6MTYzODk3MDM1OCwiZXhwIjoxNjM5MDU2NzU4fQ.PvStPQT5seVWiVPGoD8gC-aUzhSJ0y_Wh9MNfjPZuFo"
    }))
    props.history.push('/')
  }

  return (
    <div className='auth-wrapper auth-v1 px-2'>
      <div className='auth-inner py-2'>
        <Card className='mb-0' title="Welcome to Daisy Care! 👋">
          <Form className='auth-login-form mt-2' onFinish={handleSubmit}>
            <label className='form-label' for='login-email'>
              Email
            </label>
            <Form.Item
              name="email"
              rules={[{required: true, message: "Email is required"}]}
            >
              <Input type='email' size='middle' id='login-email' placeholder='john@example.com' autoFocus />
            </Form.Item>
            <label className='form-label' for='login-password'>
              Password
            </label>
            <Form.Item
              name="password"
              rules={[{required: true, message: "Password is required"}]}
            >
              <Input.Password size='middle' className='input-group-merge' id='login-password' />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType="submit">
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default LoginV1