import firebase from "firebase";
import "firebase/firestore";
import _ from "lodash";
import config from "./config";

// Initialize Firebase 
firebase.initializeApp(config.firebaseConfig);

const db = firebase.firestore();

const GetVehicles = async () => {
    let result = [];
    let querySnapshot = await db.collection('Vehicles').get();
    let data = await db.collection('Vehicles').where(firebase.firestore.FieldPath.documentId(), 'in', _.map(querySnapshot.docs, vehicle => vehicle.id)).get();

    _.forEach(data.docs, (doc) => {
        if (doc.exists) {
            result.push({
                vehicle_name: doc.data().vehicle_name,
                vehicle_no: doc.data().vehicle_no,
                doc_id: doc.id,
            });
        }
    });
    return result;
};

const GetSlots = async () => {
    let result = [];
    let querySnapshot = await db.collection(config.monthYear).doc(config.currentDate).collection('slots').get();
    _.forEach(querySnapshot.docs, (doc) => {
        result.push({
            slot: doc.id,
            is_occupied: true,
            emp_pb_no: doc.data().emp_pb_no,
            emp_name: doc.data().emp_name,
            vh_no: doc.data().vh_no
        });
    });
    return result;
};

// MONTH-YEAR -> DATE -> SLOT -> VEHICLE -> EMP
const SetSlot = async (slot, vehicle_no, employeePbNo, employeeName) => {
    await db
        .collection(config.monthYear)
        .doc(config.currentDate)
        .collection("slots")
        .doc(slot)
        .set({
          emp_pb_no: employeePbNo,
          emp_name: employeeName,
          vh_no: vehicle_no
        })
        .then(function () {
          console.info("Document successfully updated!");
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
      });
};

  
export {
    GetVehicles,
    GetSlots,
    SetSlot,
};
