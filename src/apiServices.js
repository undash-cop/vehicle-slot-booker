import firebase from "firebase";
import "firebase/firestore";
import _ from "lodash";
import moment from "moment";
import config from "./config";

// Initialize Firebase 
firebase.initializeApp(config.firebaseConfig);

const db = firebase.firestore();

const month = moment().format('MMMM');

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

const GetSlots = async (monDocID, vehicleDocID) => {
    let result = [];
    await db
      .collection(month)
      .doc(monDocID)
      .collection("vehicles")
      .doc(vehicleDocID)
      .collection("slots")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          result.push({
            doc_id: doc.id,
            is_occupied: doc.data().is_occupied,
            occupant: doc.data().occupant,
            slot: doc.data().slot,
          });
        });
      });
    return result;
};
  
const SetSlot = async (
    monDocID,
    vehicleDocID,
    slotDocID,
    employeeCode,
    employeeName
  ) => {
    await db
      .collection(month)
      .doc(monDocID)
      .collection("vehicles")
      .doc(vehicleDocID)
      .collection("slots")
      .doc(slotDocID)
      .update({
        is_occupied: true,
        occupant: employeeCode,
        occupant_name: employeeName,
      })
      .then(function () {
        console.log("Document successfully updated!");
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
