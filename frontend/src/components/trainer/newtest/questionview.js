import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'antd';
import { SecurePost } from '../../../services/axiosCall';
import apis from '../../../services/Apis';
import Alert from '../../common/alert';
import { useNavigate } from 'react-router-dom';

const FinalQuestionView = () => {
    const [testid, setTestid] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const test = useSelector(state => state.test);

    const createtest = () => {
        SecurePost({
            url: apis.CREATE_TEST,
            data: {
                type: test.newtestFormData.testType,
                title: test.newtestFormData.testTitle,
                questions: test.newtestFormData.testQuestions,
                duration: test.newtestFormData.testDuration,
                subjects: test.newtestFormData.testSubject,
                organisation: test.newtestFormData.OrganisationName
            }
        }).then((response) => {
            console.log(response.data);
            if (response.data.success) {
                Alert('success', 'Test paper Created Successfully!', 'Please wait, you will automatically be redirected to conduct test page.');
                setTimeout(() => {
                    setTestid(response.data.testid);
                }, 3000);
            } else {
                Alert('error', 'Error!', response.data.message);
            }
        }).catch((err) => {
            console.log(err);
            Alert('error', 'Error!', 'Server Error');
        });
    };

    useEffect(() => {
        if (testid) {
            navigate(`/user/conducttest?testid=${testid}`);
        }
    }, [testid, navigate]);

    return (
        <div>
            {test.newtestFormData.testQuestions.map((d, i) => (
                <QuestionView key={i+1} _id={d} no={i+1} />
            ))}
            <div style={{ width: '100%', padding: '10px' }}>
                <Button style={{ float: 'right' }} type="primary" onClick={createtest}>
                    Create Test
                </Button>
            </div>
        </div>
    );
};

function QuestionView({ _id, no }) {
    const test = useSelector(state => state.test);
    const obj = test.questionsAvailablebasedonSubject.find(hero => hero._id === _id);
    const oo = ['A', 'B', 'C', 'D', 'E'];

    return (
        <div style={{ marginBottom: '20px' }}>
            <div>
                <div style={{ width: '100%' }}>
                    <b style={{ float: 'left' }}>Question No. {no})</b>
                    <b style={{ float: 'right' }}>Marks. {obj.weightage}</b>
                </div>
                <div style={{ padding: '5px 20px' }}>
                    <br />
                    {obj.body}
                    {obj.quesimg && <img alt="Question" src={obj.quesimg} />}
                </div>
            </div>
            <Row>
                {obj.options.map((d, i) => (
                    <Col key={i} span={12} style={{ padding: '5px 20px' }}>
                        <b>{oo[i]} ) </b> {d.optbody}
                        {d.optimg && <img alt="Option" src={d.optimg} />}
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default FinalQuestionView;