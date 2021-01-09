import moment from 'moment';
import _ from 'lodash';
import config from "./config";

const generateTimeSlots = () => {    
    let slotTime = moment(config.SLOT_START, "HH:mm");
    let endTime = moment(config.SLOT_END, "HH:mm");
    
    let times = [];
    while (slotTime < endTime)
    {
        let currentSlotTime = _.cloneDeep(slotTime);
        let nextSlotTime = slotTime.add(config.SLOT_DURATION, 'minutes');
        times.push({start: currentSlotTime.format("hh:mm A"), end: nextSlotTime.format("hh:mm A")});
        slotTime = nextSlotTime;
    }
    return times;
};

export {
    generateTimeSlots
}