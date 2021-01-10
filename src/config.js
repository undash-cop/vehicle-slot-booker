import moment from "moment";

const CONFIG = {
    currentDate: moment(),
    monthYear: moment().format('MMMM-YYYY'),
    currentDay: moment().format('DD'),
    SLOT_START: '7:30',
    SLOT_END: '16:30',
    SLOT_DURATION: 30,
    firebaseConfig: {
        apiKey: "AIzaSyAicA1GwPqKPhvwuINi_ptakiHSvF0-AN8",
        authDomain: "booking-fac43.firebaseapp.com",
        projectId: "booking-fac43",
        storageBucket: "booking-fac43.appspot.com",
        messagingSenderId: "552760815254",
        appId: "1:552760815254:web:3329c2aabdc3c735759cb7",
        measurementId: "G-4G986BZ6JT"
    }
}


export default CONFIG;
