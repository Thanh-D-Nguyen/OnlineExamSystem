import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InputNumber, Input, Button, Select } from 'antd';
import { changeStep, changeBasicNewTestDetails } from '../../../actions/testAction';
import { SecurePost } from '../../../services/axiosCall';
import './newtest.css';
import apis from '../../../services/Apis';
const { Option } = Select;

class BasicTestFormO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkingName: "",
            type: this.props.test.newtestFormData.testType,
            title: this.props.test.newtestFormData.testTitle,
            subjects: this.props.test.newtestFormData.testSubject,
            duration: this.props.test.newtestFormData.testDuration,
            organisation: this.props.test.newtestFormData.OrganisationName
        };
    }

    handleSubmit = e => {
        e.preventDefault();
        console.log(this.state);
        this.props.changeBasicNewTestDetails({
            testType: this.state.type,
            testTitle: this.state.title,
            testDuration: this.state.duration,
            OrganisationName: this.state.organisation,
            testSubject: this.state.subjects
        });
        this.props.changeStep(1);
    };

    validateTestName = (value) => {
        if (value.length >= 5) {
            this.setState({
                checkingName: "validating"
            });
            SecurePost({
                url: apis.CHECK_TEST_NAME,
                data: {
                    testname: value
                }
            }).then((data) => {
                console.log(data);
                if (data.data.success) {
                    if (data.data.can_use) {
                        this.setState({
                            checkingName: "success"
                        });
                    } else {
                        this.setState({
                            checkingName: "error"
                        });
                    }
                } else {
                    this.setState({
                        checkingName: "success"
                    });
                }
            }).catch((ee) => {
                console.log(ee);
                this.setState({
                    checkingName: "success"
                });
            });
        } else {
            this.setState({
                checkingName: ""
            });
        }
    };

    render() {
        return (
            <div className="basic-test-form-outer">
                <div className="basic-test-form-inner">
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor="type">Test Type:</label>
                        <Select
                            id="type"
                            value={this.state.type}
                            onChange={(value) => this.setState({ type: value })}
                            placeholder="Test Type"
                        >
                            <Option value="pre-test">Pre Test</Option>
                            <Option value="post-test">Post Test</Option>
                        </Select>
                        <br />
                        <label htmlFor="title">Test Title:</label>
                        <Input
                            id="title"
                            value={this.state.title}
                            onChange={(e) => this.setState({ title: e.target.value })}
                            placeholder="Test Title"
                        />
                        <br />
                        <label htmlFor="subjects">Subjects:</label>
                        <Select
                            id="subjects"
                            mode="multiple"
                            value={this.state.subjects}
                            onChange={(values) => this.setState({ subjects: values })}
                            placeholder="Select one or more subjects"
                        >
                            {this.props.admin.subjectTableData.map(item => (
                                <Option key={item._id} value={item._id}>{item.topic}</Option>
                            ))}
                        </Select>
                        <br />
                        <label htmlFor="duration">Test Duration (Min. 60m):</label>
                        <InputNumber
                            id="duration"
                            value={this.state.duration}
                            onChange={(value) => this.setState({ duration: value })}
                            placeholder="Test Duration"
                            min={60}
                            max={180}
                        />
                        <br />
                        <label htmlFor="organisation">Organisation Name:</label>
                        <Input
                            id="organisation"
                            value={this.state.organisation}
                            onChange={(e) => this.setState({ organisation: e.target.value })}
                            placeholder="Organisation Name"
                        />
                        <br />
                        <Button type="primary" htmlType="submit">
                            Next
                        </Button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    test: state.test,
    admin: state.admin
});

export default connect(mapStateToProps, {
    changeStep,
    changeBasicNewTestDetails
})(BasicTestFormO);