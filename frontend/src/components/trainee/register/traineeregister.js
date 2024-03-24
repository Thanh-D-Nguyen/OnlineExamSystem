import React, { Component } from 'react';
import './trainerRegister.css';
import { Row, Col, Input, Button, Select, Typography } from 'antd';
import { IdcardOutlined, HomeOutlined, UserOutlined, MailOutlined } from '@ant-design/icons'
import queryString from 'query-string';
import apis from '../../../services/Apis';
import { Post } from '../../../services/axiosCall';
import Alert from '../../common/alert';
const { Option } = Select;
const { Title } = Typography;

class TraineeRegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inform: true,
            testid: null,
            user: null,
            name: '',
            email: '',
            contact: '',
            organisation: '',
            location: '',
            prefix: '+91',
        }
    }

    componentDidMount() {
        let params = queryString.parse(this.props.location.search)
        this.setState({
            testid: params.testid
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        const { name, email, contact, organisation, location, testid } = this.state;
        Post({
            url: apis.REGISTER_TRAINEE_FOR_TEST,
            data: {
                name,
                emailid: email,
                contact: `${this.state.prefix}${contact}`,
                organisation,
                testid,
                location
            }
        }).then((data) => {
            if (data.data.success) {
                this.setState({
                    inform: false,
                    user: data.data.user
                })
            } else {
                this.setState({
                    name: '',
                    email: '',
                    contact: '',
                    organisation: '',
                    location: '',
                    prefix: '+91',
                });
                Alert('error', 'Error!', data.data.message);
            }
        }).catch((error) => {
            this.setState({
                name: '',
                email: '',
                contact: '',
                organisation: '',
                location: '',
                prefix: '+91',
            });
            Alert('error', 'Error!', "Server Error");
        })
    };

    resendMail = () => {
        Post({
            url: apis.RESEND_TRAINER_REGISTRATION_LINK,
            data: {
                id: this.state.user._id
            }
        }).then((response) => {
            if (response.data.success) {
                Alert('success', 'Success!', "Email has been sent to your email");
            } else {
                Alert('error', 'Error!', response.data.message);
            }
        }).catch((error) => {
            Alert('error', 'Error!', "Server Error");
        })
    }

    render() {
        return (
            <div className="trainee-registration-form-wrapper">
                {this.state.inform ?
                    <div className="trainee-registration-form-inner">
                        <form onSubmit={this.handleSubmit} className="login-form">
                            <Row>
                                <Col span={12} style={{ padding: '5px' }}>
                                    <div className="form-item-label">Name</div>
                                    <Input
                                        value={this.state.name}
                                        onChange={(e) => this.setState({ name: e.target.value })}
                                        prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Name"
                                    />
                                </Col>
                                <Col span={12} style={{ padding: '5px' }}>
                                    <div className="form-item-label">Email Id</div>
                                    <Input
                                        value={this.state.email}
                                        onChange={(e) => this.setState({ email: e.target.value })}
                                        prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Email Id"
                                    />
                                </Col>
                                <Col span={12} style={{ padding: '5px' }}>
                                    <div className="form-item-label">Phone Number</div>
                                    <Input
                                        value={this.state.contact}
                                        onChange={(e) => this.setState({ contact: e.target.value })}
                                        addonBefore={
                                            <Select
                                                value={this.state.prefix}
                                                onChange={(value) => this.setState({ prefix: value })}
                                                style={{ width: 70 }}
                                            >
                                                <Option value="+91">+91</Option>
                                            </Select>
                                        }
                                        placeholder="Phone Number"
                                    />
                                </Col>
                                <Col span={12} style={{ padding: '5px' }}>
                                    <div className="form-item-label">Organisation</div>
                                    <Input
                                        value={this.state.organisation}
                                        onChange={(e) => this.setState({ organisation: e.target.value })}
                                        prefix={<IdcardOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Organisation"
                                    />
                                </Col>
                                <Col span={12} style={{ padding: '5px' }}>
                                    <div className="form-item-label">Location</div>
                                    <Input
                                        value={this.state.location}
                                        onChange={(e) => this.setState({ location: e.target.value })}
                                        prefix={<HomeOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Location"
                                    />
                                </Col>
                                <Col span={12} style={{ paddingTop: '33px' }}>
                                    <Button style={{ width: '100%' }} type="primary" htmlType="submit" className="login-form-button">
                                        Register
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    </div> :
                    <div className="reasendmail-container-register">
                        <Title style={{ color: '#fff' }} level={4}>An email containing your test link has been sent to {this.state.user.emailid}</Title>
                        <Button type="primary" onClick={this.resendMail}>Resend Mail</Button>
                    </div>}
            </div>
        )
    }
}

export default TraineeRegisterForm;