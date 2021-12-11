import { Card, Input } from 'antd'
import './login.scss'
import { Button, Form, notification } from 'antd'
import { useDispatch } from 'react-redux'
import { handleSignin } from '../../actions/index'
import { useTranslation } from 'react-i18next'
import Request from '../../services/request'

const LoginV1 = (props) => {
  const dispatch = useDispatch()
  const { t: translation } = useTranslation()

  function handleSubmit(values) {
    Request({
      method: "POST",
      path: "/api/login",
      newUrl: process.env.REACT_APP_API_LOGIN_URL,
      data: values
    }).then(result =>{ 
      if(result && result.errCode === 0) {
        dispatch(handleSignin(result.user))
        props.history.push('/')
        notification.success({
          message: "",
          description: translation('landing.loginSuccess', { name: `${result.user.firstName} ${result.user.lastName}`})
        })
      } else {
        notification.error({
          message: "",
          description: result.message
        })
      }
    })
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