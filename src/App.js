import React from 'react';
import { Layout, Row, Col, Card } from 'antd';
import _ from "lodash";

import './App.css';
import SlotCards from './SlotCards';
import config from "./config";
import { GetVehicles } from "./apiServices";

const { Header, Footer, Content } = Layout;

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      currentDate: config.currentDate,
      vehicles: []
    };
  }

  componentDidMount = async () => {
    let vehicles = await GetVehicles();
    vehicles = _.orderBy(_.cloneDeep(vehicles), ['vehicle_no'], ['asc']);
    this.setState({vehicles});
  }

  render() {
    const { currentDate, vehicles } = this.state; 

    return (
      <Layout className="layout">
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%', background: '#f0f5ff', display: 'flex', justifyContent: 'space-between', height: 'fit-content', textAlign: 'center'}}>
          <div> Date: {currentDate.format("DD MMM, YYYY")} </div>
          <div style={{ lineHeight: 'normal' }}>
            <h1 style={{ fontWeight: 'bold' }}> MCSRDC </h1>
            <h2>Vehicle Booking System</h2>
          </div>
          <div></div>
        </Header>
        <Content style={{ padding: '0 20px', minHeight: '80VH', marginTop: '11VH' }}>
          {!_.isEmpty(vehicles) && _.map(vehicles, (vehicle, id) => <Row key={id}>
            <Col lg style={{ width: '100%', paddingBottom: '10px'}}>
              <Card title={vehicle.vehicle_name} bodyStyle={{padding: "2px"}} size="small">
                <SlotCards vehicle={vehicle}/>
              </Card>
            </Col>
          </Row>)}
        </Content>
        <Footer style={{ textAlign: 'center', bottom: 0 }}>Vehicle Slot Booking © 2021</Footer>
      </Layout>
    );
  }
}

export default App;
