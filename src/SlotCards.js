import React from "react";
import _ from "lodash";
import moment from "moment";
import { Row, Modal, Input, Typography, Card } from 'antd';
import { UserOutlined } from "@ant-design/icons";

import { generateTimeSlots } from "./common";
import { GetSlots, SetSlot } from "./apiServices";


const { Title } = Typography;


class SlotCards extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            slots: [],
            vehicle: _.get(props, 'vehicle', {}),
            newSlot: {
                emp_name: '',
                emp_pb_no: '',
                start: moment().format('hh:mm a'),
                end: moment().add(30, 'minutes').format('hh:mm a'),
            },
            isModalVisible: false
        };
    }
    
    componentDidMount = async () => {
        await this.updateSlots();
    }

    updateSlots = async () => {
        let slots = generateTimeSlots();
        let occupiedSlots = await GetSlots();
        if(occupiedSlots) {
            _.forEach(slots, (slot) => {
                _.forEach(occupiedSlots, (os) => {
                    if (os.slot === `${slot.start} - ${slot.end} - ${this.state.vehicle.vehicle_no}`) {
                        _.set(slot, ['is_occupied'], os.is_occupied);
                        _.set(slot, ['emp_pb_no'], os.emp_pb_no);
                        _.set(slot, ['emp_name'], os.emp_name);
                        _.set(slot, ['vh_no'], os.vh_no);
                        _.set(slot, ['doc_id'], os.doc_id);
                    }
                });
            });
        }
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
                emp_name: '',
                emp_pb_no: '',
                start: moment().format('hh:mm a'),
                end: moment().add(30, 'minutes').format('hh:mm a')
            },
            isModalVisible: false
        });
    }

    handleBookSlot = async () => {
        let { newSlot, vehicle } = this.state;
        await SetSlot(`${newSlot.start} - ${newSlot.end} - ${vehicle.vehicle_no}`, vehicle.vehicle_no, newSlot.emp_pb_no, newSlot.emp_name);
        this.setState({ 
            newSlot: {
                emp_name: '',
                emp_pb_no: '',
                start: moment().format('hh:mm a'),
                end: moment().add(30, 'minutes').format('hh:mm a')
            },
            isModalVisible: false
        });
        await this.updateSlots();
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
                            if (_.get(slot, ['is_occupied'])) {
                                this.setState({isModalVisible: true, newSlot: slot});
                            } else {
                                newSlot = _.set(newSlot, 'start', slot.start);
                                newSlot = _.set(newSlot, 'end', slot.end);
                                this.setState({isModalVisible: true, newSlot: newSlot});
                            }
                        }}
                    >
                        {slot.start} - {slot.end}
                    </Card.Grid>
                ))}
                

                <Modal
                    title="Enter Employee Details"
                    visible={isModalVisible}
                    onOk={() => !_.get(newSlot, ['is_occupied'], false) ? this.handleBookSlot(): this.handleCancel()}
                    onCancel={() => this.handleCancel()}
                >
                    <Title level={5}>Employee emp_name</Title>
                    <Input
                        placeholder="Enter Employee Name"
                        size="large"
                        value={newSlot.emp_name}
                        disabled={_.get(newSlot, ['is_occupied'], false)}
                        prefix={<UserOutlined />}
                        onChange={(e) => this.onValueChange('emp_name', e.target.value)}
                    />
                    <Title level={5}> Employee PB.No</Title>
                    <Input
                        placeholder="Enter Employee PB.No"
                        size="large"
                        prefix={<UserOutlined />}
                        value={newSlot.emp_pb_no}
                        disabled={_.get(newSlot, ['is_occupied'], false)}
                        onChange={(e) => this.onValueChange('emp_pb_no', e.target.value)}
                    />
                    <Title level={5}> From</Title>
                        <Input
                        placeholder="Enter From Time"
                        size="large"
                        prefix={<UserOutlined />}
                        value={newSlot.start}
                        disabled={_.get(newSlot, ['is_occupied'], false)}
                        onChange={(e) => this.onValueChange('start', e.target.value)}
                    />
                    <Title level={5}> To</Title>
                    <Input
                        placeholder="Enter To Time"
                        size="large"
                        prefix={<UserOutlined />}
                        disabled={_.get(newSlot, ['is_occupied'], false)}
                        value={newSlot.end}
                        onChange={(e) => this.onValueChange('end', e.target.value)}
                    />
                </Modal>
            </Row>  
        );
    }
}

export default SlotCards;