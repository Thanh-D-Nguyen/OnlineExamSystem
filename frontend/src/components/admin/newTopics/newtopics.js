import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import { SecurePost } from '../../../services/axiosCall';
import apis from '../../../services/Apis';
import Alert from '../../../components/common/alert';
import { 
    ChangeSubjectConfirmDirty,
    ChangeSubjectTableData,
    ChangeSubjectModalState
} from '../../../actions/adminAction';

const NewTopics = (props) => {
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        SecurePost({
            url: `${apis.CREATE_SUBJECT}`,
            data: {
                _id: props.admin.SubjectId,
                topic: values.topic
            }
        }).then((response) => {
            if (response.data.success) {
                props.ChangeSubjectModalState(false, null, 'New Topic');
                Alert('success', 'Success', response.data.message);
                props.ChangeSubjectTableData();
            } else {
                props.ChangeSubjectModalState(false, null, 'New Topic');
                Alert('warning', 'Warning!', response.data.message);
            }
        }).catch((error) => {
            props.ChangeSubjectModalState(false, null, 'New Topic');
            Alert('error', 'Error!', 'Server Error');
        });
    };

    return (
        <div className="register-subject-form">
            <div className="register-trainer-form-body">
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item label="Topic Name" name="topic" initialValue={props.admin.subjectDetails.topic} rules={[{ required: true, message: 'Please input topic name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {props.admin.Subjectmode}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    admin: state.admin
});

const mapDispatchToProps = {
    ChangeSubjectConfirmDirty,
    ChangeSubjectTableData,
    ChangeSubjectModalState
};

export default connect(mapStateToProps, mapDispatchToProps)(NewTopics);