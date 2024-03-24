import React, { Component } from 'react';
import { Button, Skeleton, Modal, InputNumber, Transfer, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { changeStep, changeMode, removeQuestionFromMainQueue, changeBasicNewTestDetails, fetchSubjectWiseQuestion, pushQuestionToQueue } from '../../../actions/testAction';
import './newtest.css';
import Alert from '../../common/alert';
import apis from '../../../services/Apis';
import { Post } from '../../../services/axiosCall';

class GeneraterandomQuestionO extends Component {
    constructor(props) {
        super(props);
        this.state = {
            generating: false,
            autogenerate: true,
            ActiveQuestionId: null,
            Mvisible: false,
            no: null
        };
        this.props.changeMode(this.props.mode);
    }

    componentDidMount() {
        this.props.fetchSubjectWiseQuestion(this.props.test.newtestFormData.testSubject);
    }

    handleSubmit = e => {
        e.preventDefault();
        console.log(this.state);
        if (this.state.no <= this.props.test.questionsAvailablebasedonSubject.length) {
            var qus = [];
            var allquestions = [...this.props.test.questionsAvailablebasedonSubject];
            var l = allquestions.length - 1;
            for (var i = this.state.no; i > 0; i--) {
                l = l - 1;
                var r = Math.floor(Math.random() * l);
                qus.push(allquestions[r]._id);
                allquestions.splice(r, 1);
            }
            this.props.pushQuestionToQueue(qus);
            this.setState({
                autogenerate: false
            });
        } else {
            Alert('error', 'Error!', "You don't have enough questions to select.");
        }
    };

    renderItem = item => {
        const customLabel = (
            <span className="custom-item">
                <Button shape="circle" onClick={() => { this.OpenModel(item._id) }} icon="info" style={{ background: 'linear-gradient(to right,rgb(80,190,189),rgb(0,153,153),rgb(0,153,203))', color: 'greenblue' }} size="small"></Button>
                {item.body}
            </span>
        )
        return {
            label: customLabel,
            value: item._id,
        }
    }

    OpenModel = (qid) => {
        this.setState({
            ActiveQuestionId: qid,
            Mvisible: true
        })
    }
    handleCancel = () => {
        this.setState({
            Mvisible: false
        })
    }

    handleChange = (targetKeys, direction, moveKeys) => {
        this.props.pushQuestionToQueue(targetKeys);
    };


    render() {
        return (
            <div>
                <Row>
                    <Col span={5} style={{ padding: '20px 0px' }}>
                        <div className={`random-question-generation ${this.props.mode === "random" ? "notblind" : "blind"}`}>
                            <form onSubmit={this.handleSubmit} >
                                <label htmlFor="no">Enter No. of questions:</label>
                                <InputNumber
                                    id="no"
                                    value={this.state.no}
                                    onChange={(value) => this.setState({ no: value })}
                                    style={{ width: '100%' }}
                                    placeholder="No of question" min={10} max={50} />
                                <br />
                                <Button type="default" htmlType="submit" block disabled={!this.state.autogenerate}>
                                    Generate Test Paper
                                </Button>
                            </form>
                        </div>
                    </Col>
                    <Col span={19} style={{ padding: '20px' }}>
                        <Transfer
                            disabled={this.props.mode === "random" ? true : false}
                            rowKey={record => record._id}
                            dataSource={this.props.test.questionsAvailablebasedonSubject}
                            listStyle={{
                                width: '45%',
                                height: 500,
                            }}
                            targetKeys={this.props.test.newtestFormData.testQuestions}
                            render={this.renderItem}
                            onChange={this.handleChange}
                        />
                    </Col>
                </Row>
                <Modal
                    destroyOnClose={true}
                    width="70%"
                    style={{ top: '30px' }}
                    title="Question details"
                    visible={this.state.Mvisible}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <SingleQuestionDetails qid={this.state.ActiveQuestionId} />
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    test: state.test
});

export default connect(mapStateToProps, {
    changeStep,
    changeBasicNewTestDetails,
    fetchSubjectWiseQuestion,
    pushQuestionToQueue,
    removeQuestionFromMainQueue,
    changeMode
})(GeneraterandomQuestionO);

class SingleQuestionDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            qdetails: null
        }
    }

    componentDidMount() {
        this.setState({
            fetching: true
        })
        Post({
            url: apis.FETCH_SINGLE_QUESTION_BY_TRAINEE,
            data: {
                qid: this.props.qid
            }
        }).then((response) => {
            console.log(response)
            if (response.data.success) {
                this.setState({
                    qdetails: response.data.data[0]
                })
            } else {
                Alert('error', 'Error !', response.data.message);
            }
            this.setState({
                fetching: false
            })
        }).catch((error) => {
            this.setState({
                fetching: false
            })
            console.log(error)
            Alert('error', 'Error !', "Server Error");
        })
    }

    render() {
        const optn = ['A', 'B', 'C', 'D', 'E'];
        let Optiondata = this.state.qdetails;
        if (Optiondata !== null) {
            return (
                <div>
                    <div className="mainQuestionDetailsContaine">
                        <div className="questionDetailsBody">
                            {Optiondata.body}
                        </div>
                        {Optiondata.quesimg ?
                            <div className="questionDetailsImageContainer">
                                <img alt="Question" className="questionDetailsImage" src={Optiondata.quesimg} />
                            </div>
                            : null
                        }
                        <div>
                            {Optiondata.options.map((d, i) => {
                                return (
                                    <div key={i}>
                                        <div className="QuestionDetailsOptions">
                                            <span className="optionIndex">{optn[i]}</span>
                                            <span className="optionText">{d.optbody}</span>
                                            {d.optimg ?
                                                <div className="optionImageContainer">
                                                    <img alt="options" className="optionImage" src={d.optimg} />
                                                </div>
                                                : null
                                            }
                                            <div className="optionAnswerIndicator">
                                                {d.isAnswer ? <span className="green">Correct</span> : null}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="skeletor-wrapper">
                    <Skeleton active />
                    <Skeleton active />
                </div>
            )
        }

    }
}
