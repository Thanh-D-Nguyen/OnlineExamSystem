import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons'; 
import './login.css';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../../../actions/loginAction';
import auth from '../../../services/AuthServices';
import Alert from '../../common/alert';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const handleSubmit = async (values) => {
        console.log('Received values of form: ', values);
        try {
            const response = await auth.LoginAuth(values.email, values.password);
            console.log(response);
            if (response.data.success) {
                dispatch(login(response.data.user));
                auth.storeToken(response.data.token);
                navigate(user.userOptions[0].link);
            } else {
                Alert('error', 'Error!', response.data.message);
            }
        } catch (error) {
            console.log(error);
            Alert('error', 'Error!', 'Server Error');
        }
    };

    return (
        <div className="login-container">
            <div className="login-inner">
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item 
                        name="email" 
                        label="Email" 
                        rules={[
                            { type: 'email', message: 'The input is not valid E-mail!' },
                            { required: true, message: 'Please input your E-mail!' }
                        ]}
                    >
                        <Input 
                            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
                        />
                    </Form.Item>
                    <Form.Item 
                        name="password" 
                        label="Password" 
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>  
        </div>
    );
};

export default Login;