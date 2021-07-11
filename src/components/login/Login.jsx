import React from 'react'
import { Form, Input, Button} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {reqUserLogin} from '../../api'
import './login.less'

function Login(props) {
    const onFinish = (values) => {
        const { username, password } = values
        reqUserLogin(username, password).then(res => {
            if(res.length !== 0){
                localStorage.setItem("token",JSON.stringify(res[0]))
                props.history.replace('/')
            }
        })
    };
    return (
        <div className="login">
            <div className="login_form">
                <div className="title">
                    后台系统
                </div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入您的用户名!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入您的密码!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登陆
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Login