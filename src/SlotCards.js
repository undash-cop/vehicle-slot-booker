import React from "react";
import _ from "lodash";
import moment from "moment";
import { Row, Modal, Input, Typography, Card } from 'antd';
import { UserOutlined } from "@ant-design/icons";

import { generateTimeSlots } from "./common";


const { Title } = Typography;


class SlotCards extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            slots: [],
            vehicle: _.get(props, 'vehicle', {}),
            newSlot: {
                name: '',
                pb_no: '',
                start_time: moment().format('hh:mm a'),
                end_time: moment().add(30, 'minutes').format('hh:mm a'),
            },
            isModalVisible: false
        };
    }
    
    componentDidMount = async () => {
        let slots = generateTimeSlots();
        this.setState({slots: slots});
    }

    onValueChange = (key, value) => {
        let { newSlot } = this.state;
        newSlot = _.set(newSlot, [key], value);
        this.setState({newSlot: newSlot});
    };

    handleCancel = () => {
        this.setState({ 
            newSlot: {
                name: '',
                pb_no: '',
                start_time: moment().format('hh:mm a'),
                end_time: moment().add(30, 'minutes').format('hh:mm a')
            },
            isModalVisible: false
        });
    }

    handleBookSlot = () => {
        let { newSlot } = this.state;
        console.log(newSlot);
        this.setState({ 
            newSlot: {
                name: '',
                pb_no: '',
                start_time: moment().format('hh:mm a'),
                end_time: moment().add(30, 'minutes').format('hh:mm a')
            },
            isModalVisible: false
        });
    }

    render() {
        let { isModalVisible, newSlot, slots } = this.state;

        return (
            <Row>
                {_.map(slots, (slot, id) => (
                    <Card.Grid
                        style={{
                            width: "16%",
                            margin: "4px",
                            textAlign: "center",
                            backgroundColor: !_.get(slot, 'is_occupied', false) ? "#95de64" : "#ff7875",
                        }}
                        key={id}
                        onClick={() => {
                            newSlot = _.set(newSlot, 'start_time', slot.start);
                            newSlot = _.set(newSlot, 'end_time', slot.end)
                            this.setState({isModalVisible: true, newSlot: newSlot})
                        }}
                    >
                        {slot.start} - {slot.end}
                    </Card.Grid>
                ))}
                

                <Modal
                    title="Enter Employee Details"
                    visible={isModalVisible}
                    onOk={() => this.handleBookSlot()}
                    onCancel={() => this.handleCancel()}
                >
                    <Title level={5}>Employee Name</Title>
                    <Input
                        placeholder="Enter Employee Name"
                        size="large"
                        value={newSlot.name}
                        prefix={<UserOutlined />}
                        onChange={(e) => this.onValueChange('name', e.target.value)}
                    />
                    <Title level={5}> Employee PB.No</Title>
                    <Input
                        placeholder="Enter Employee PB.No"
                        size="large"
                        prefix={<UserOutlined />}
                        value={newSlot.pb_no}
                        onChange={(e) => this.onValueChange('pb_no', e.target.value)}
                    />
                    <Title level={5}> From</Title>
                        <Input
                        placeholder="Enter From Time"
                        size="large"
                        prefix={<UserOutlined />}
                        value={newSlot.start_time}
                        onChange={(e) => this.onValueChange('start_time', e.target.value)}
                    />
                    <Title level={5}> To</Title>
                    <Input
                        placeholder="Enter To Time"
                        size="large"
                        prefix={<UserOutlined />}
                        value={newSlot.end_time}
                        onChange={(e) => this.onValueChange('end_time', e.target.value)}
                    />
                </Modal>
            </Row>  
        );
    }
}

export default SlotCards;