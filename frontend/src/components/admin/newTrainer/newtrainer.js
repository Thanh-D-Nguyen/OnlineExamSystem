import React from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Select, message } from "antd";
import { SecurePost } from "../../../services/axiosCall";
import apis from "../../../services/Apis";
import {
  ChangeTrainerConfirmDirty,
  ChangeTrainerModalState,
  ChangeTrainerTableData,
} from "../../../actions/adminAction";
import Alert from "../../../components/common/alert";

const { Option } = Select;

const NewTrainer = (props) => {
  const [form] = Form.useForm();

  const compareToFirstPassword = (rule, value) => {
    const password = form.getFieldValue("password");
    if (value && value !== password) {
      return Promise.reject(new Error("Passwords are not the same!"));
    }
    return Promise.resolve();
  };

  const validateToNextPassword = (rule, value) => {
    if (value && props.admin.TrainerconfirmDirty) {
      form.validateFields(["confirm"]);
    }
    return Promise.resolve();
  };

  const handleSubmit = (values) => {
    SecurePost({
      url: `${apis.CREATE_TRAINER}`,
      data: {
        _id: props.admin.trainerId,
        name: values.name,
        password: values.password,
        emailid: values.emailid,
        contact: values.prefix + values.contact,
      },
    })
      .then((response) => {
        if (response.data.success) {
          props.ChangeTrainerModalState(false, null, "Register");
          Alert("success", "Success", response.data.message);
          props.ChangeTrainerTableData();
        } else {
          props.ChangeTrainerModalState(false, null, "Register");
          Alert("warning", "Warning!", response.data.message);
        }
      })
      .catch((error) => {
        props.ChangeTrainerModalState(false, null, "Register");
        Alert("error", "Error!", "Server Error");
      });
  };

  return (
    <div className="register-trainer-form">
      <div className="register-trainer-form-body">
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            initialValue={props.admin.trainerdetails.name}
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          {!props.admin.trainerId && (
            <Form.Item
              label="E-mail"
              name="emailid"
              initialValue={props.admin.trainerdetails.emailid}
              rules={[
                { type: "email", message: "The input is not valid E-mail!" },
                { required: true, message: "Please input your E-mail!" },
              ]}
            >
              <Input />
            </Form.Item>
          )}

          <Form.Item
            label="Phone Number"
            name="contact"
            initialValue={props.admin.trainerdetails.contact}
            rules={[
              { required: true, message: "Please input your phone number!" },
              { len: 10, message: "Contact number must be 10 digits long" },
            ]}
          >
            <Input
              addonBefore={
                <Form.Item name="prefix" noStyle>
                  <Select
                    style={{ width: 70 }}
                    rules={[
                      {
                        required: true,
                        message: "Please enter contact no prefix",
                      },
                    ]}
                  >
                    <Option value="+81">+81</Option>
                    <Option value="+84">+84</Option>
                  </Select>
                </Form.Item>
              }
              min={10}
              max={13}
            />
          </Form.Item>

          {!props.admin.trainerId && (
            <div>
              <Form.Item
                label="Password"
                name="password"
                initialValue={props.admin.trainerdetails.password}
                rules={[
                  { required: true, message: "Please input your password!" },
                  { validator: validateToNextPassword },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirm"
                initialValue={props.admin.trainerdetails.confirmpassword}
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  { validator: compareToFirstPassword },
                ]}
              >
                <Input.Password onBlur={validateToNextPassword} />
              </Form.Item>
            </div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {props.admin.Trainermode}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ admin: state.admin });
const mapDispatchToProps = {
  ChangeTrainerConfirmDirty,
  ChangeTrainerModalState,
  ChangeTrainerTableData,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewTrainer);
