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
                from: '',
                to: ''
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
                        _.set(slot, ['from'], os.from);
                        _.set(slot, ['to'], os.to);
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
                end: moment().add(30, 'minutes').format('hh:mm a'),
                from: '',
                to: ''
            },
            isModalVisible: false
        });
    }

    handleBookSlot = async () => {
        let { newSlot, vehicle } = this.state;
        await SetSlot(`${newSlot.start} - ${newSlot.end} - ${vehicle.vehicle_no}`, vehicle.vehicle_no, newSlot.emp_pb_no, newSlot.emp_name, newSlot.from, newSlot.to);
        this.setState({ 
            newSlot: {
                emp_name: '',
                emp_pb_no: '',
                start: moment().format('hh:mm a'),
                end: moment().add(30, 'minutes').format('hh:mm a'),
                from: '',
                to: ''
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
                            width: "10%",
                            margin: "5px",
                            textAlign: "center",
                            fontSize: "10px",
                            padding: "8px",
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
                    title={ !_.get(newSlot, ['is_occupied'], false ) ?  <div>Enter Employee Details</div> : <div style={{color: 'red'}}>Slot already booked</div>}
                    style={{ textAlign:"center"}}
                    visible={isModalVisible}
                    onOk={() => !_.get(newSlot, ['is_occupied'], false) ? this.handleBookSlot(): this.handleCancel()}
                    onCancel={() => this.handleCancel()}
                    width={350}
                >
                    <Title level={5} style={{textAlign:"left"}}>Employee Name</Title>
                    <Input
                        placeholder="Enter Employee Name"
                        value={newSlot.emp_name}
                        disabled={_.get(newSlot, ['is_occupied'], false)}
                        prefix={<UserOutlined />}
                        onChange={(e) => this.onValueChange('emp_name', e.target.value)}
                   
                    />
                    <Title level={5} style={{textAlign:"left"}}> Employee PB.No</Title>
                    <Input
                        placeholder="Enter Employee PB.No"
                        prefix={<UserOutlined />}
                        value={newSlot.emp_pb_no}
                        disabled={_.get(newSlot, ['is_occupied'], false)}
                        onChange={(e) => this.onValueChange('emp_pb_no', e.target.value)}
                    />
                    <Title level={5} style={{textAlign:"left"}}> From</Title>
                        <Input
                        placeholder="Enter From"
                        prefix={<UserOutlined />}
                        value={newSlot.from}
                        disabled={_.get(newSlot, ['is_occupied'], false)}
                        onChange={(e) => this.onValueChange('from', e.target.value)}
                    />
                    <Title level={5} style={{textAlign:"left"}}> To</Title>
                    <Input
                        placeholder="Enter To"
                        prefix={<UserOutlined />}
                        disabled={_.get(newSlot, ['is_occupied'], false)}
                        value={newSlot.to}
                        onChange={(e) => this.onValueChange('to', e.target.value)}
                    />
                </Modal>
            </Row>  
        );
    }
}

export default SlotCards;