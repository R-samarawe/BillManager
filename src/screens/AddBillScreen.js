import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  setDoc,
  updateDoc,
  doc,
  where,
  query,
  Timestamp,
} from "firebase/firestore";
//don't use paranthesis around DateTimePicker
import DateTimePicker from "@react-native-community/datetimepicker";
import { SelectList } from "react-native-dropdown-select-list";
import { AntDesign } from "@expo/vector-icons";
import { app, auth, fireStore } from "../db/Config";
import { onAuthStateChanged } from "firebase/auth";

const AddBillScreen = ({ navigation }) => {
  // bill object
  /**
 1. id 
 2. duedate
 3. amount
 4. category
 5. description
 4. addeddate
 5. lastupdateddate
 6. billstatus {upcoming , overdue , paid}
 7. isChecked    
 */

  // add or update status

  //User Logged---------------------------------------------------------------
  const [logged, setLogged] = useState(false);
  const [userid, setUserId] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        if (user.emailVerified) {
          setLogged(true);
        }
      } else {
        console.log("Not Logged");
      }
    });
  }, []);

  // set DB variables --------------------------------------------------------------------------

  const [amount, setAmount] = useState("0.00");
  const [category, setCategory] = useState("Other");
  const [description, setDescription] = useState("");
  const [billstatus, setBillStatus] = useState("UPCOMING");

  // set date ---------------------------------------------------------------
  const todayIs = Timestamp.now();
  const todayInSeconds = todayIs.seconds * 1000;
  //console.log(todayInSeconds); //16970402180000
  const todayDate = new Date(todayInSeconds);

  const [date, setDate] = useState(todayDate);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const getDateBy = (givenNewDateTime, reqformat) => {
    //format can be year or month or date

    //get date
    //split date
    //console.log(date.toLocaleString()); // 12/10/2023, 01:16:39
    //const dateOnly = date.toLocaleString().split(","); //["12/10/2023", " 01:16:39"]
    const dateOnly = givenNewDateTime.toLocaleString().split(",");
    //console.log(dateOnly[0]); //  12/10/2023
    const seperateDate = dateOnly[0].toLocaleString().split("/");
    //console.log(seperateDate[2]); // 2024

    if (reqformat == "year") {
      return seperateDate[2];
    } else if (reqformat == "month") {
      return seperateDate[1];
    } else if (reqformat == "date") {
      return seperateDate[0];
    }
  };

  const changeDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    changeStatus(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  //set status ----------------------------------------------------

  const changeStatus = (selectedDate) => {
    const thisYear = Number(getDateBy(todayDate, "year"));
    const thisMonth = Number(getDateBy(todayDate, "month"));
    const thisDay = Number(getDateBy(todayDate, "date"));
    const changedYear = Number(getDateBy(selectedDate, "year"));
    const changedMonth = Number(getDateBy(selectedDate, "month"));
    const changedDate = Number(getDateBy(selectedDate, "date"));

    //year wise comparison
    if (thisYear == changedYear) {
      //month wise comparson
      if (thisMonth == changedMonth) {
        // date wise comparison
        if (thisDay == changedDate) {
          setBillStatus("UPCOMING");
        } else if (thisDay < changedDate) {
          setBillStatus("UPCOMING");
        } else {
          setBillStatus("OVERDUE");
        }
      } else if (thisMonth < changedMonth) {
        setBillStatus("UPCOMING");
      } else {
        setBillStatus("OVERDUE");
      }
    } else if (thisYear < changedYear) {
      setBillStatus("UPCOMING");
    } else {
      setBillStatus("OVERDUE");
    }
  };

  // select data dropdown--------------------------------------------
  const data = [
    { key: "0", value: "Select Category", disabled: true },
    { key: "1", value: "Internet Bills" },
    { key: "2", value: "Loan" },
    { key: "3", value: "Insurance" },
    { key: "4", value: "Rent" },
    { key: "5", value: "Education fees" },
    { key: "6", value: "Other" },
  ];

  const addBillItem = async () => {
    try {
      //const collRef = collection(fireStore, "users", userid, "bills");
      console.log(userid.toString());
      const collRef = collection(fireStore, "bills");
      const docRef = await addDoc(collRef, {
        userId: userid.toString(),
        duedate: date,
        amount: amount,
        category: category,
        description: description,
        addeddate: Timestamp.now(),
        lastupdateddate: null,
        billstatus: billstatus,
        isChecked: false,
      });

      setAmount("0.00");
      setCategory("");
      setDescription("");
      setBillStatus("OVERDUE");

      navigation.navigate("Upcomming");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {/** amount */}
        <View style={styles.fieldLabels}>
          <Text style={styles.text}>Amount (Rs) :</Text>
          <TextInput
            placeholder="Enter Amount"
            style={styles.input}
            value={amount}
            onChangeText={(text) => setAmount(text)}
            id="amountid"
          />
        </View>
        {/** category */}
        <View style={styles.fieldLabels}>
          <Text style={styles.text}>Category :</Text>
          <SelectList
            placeholder="Select Category"
            boxStyles={styles.input}
            setSelected={(val) => setCategory(val)}
            data={data}
            id="categoryid"
            save="value"
          />
        </View>
        {/** due date */}
        <View style={styles.fieldLabels}>
          <Text style={styles.text}>Due date :</Text>
          <View style={styles.box}>
            <Text id="dateid">
              {getDateBy(date, "year") +
                "/" +
                getDateBy(date, "month") +
                "/" +
                getDateBy(date, "date")}
            </Text>
            <Pressable onPress={showDatepicker}>
              <AntDesign name="calendar" size={24} color="black" />
            </Pressable>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                onChange={changeDate}
              />
            )}
          </View>
        </View>
        {/** description */}
        <View style={styles.fieldLabels}>
          <Text style={styles.text}>Description :</Text>
          <TextInput
            placeholder="Enter Description"
            style={styles.input}
            value={description}
            multiline={true}
            id="descriptionid"
            onChangeText={(text) => setDescription(text)}
          />
        </View>
        {/** billstatus */}
        <View style={styles.fieldLabels}>
          <Text style={styles.text}>Bill status :</Text>
          <View style={styles.box}>
            <Text id="billstatusid">{billstatus}</Text>
          </View>
        </View>
        {/** submit button*/}
        <View style={{ alignItems: "center" }}>
          <Pressable style={styles.submitButton} onPress={addBillItem}>
            <Text style={styles.buttonText}>Add Bill</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddBillScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "aliceblue",
    minHeight: "100%",
  },

  input: {
    backgroundColor: "lightgray",
    padding: 10,
    fontSize: 15,
    width: 250,
    marginBottom: 10,
    alignSelf: "center",
    borderRadius: 10,
    //marginTop: "auto", //get full maximum height for margin
  },
  submitButton: {
    marginTop: 40,
    padding: 10,
    width: "90%",
    backgroundColor: "powderblue",
    borderRadius: 40,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  fieldLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 250,
    backgroundColor: "lightgray",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    paddingTop: 5,
    fontWeight: "500",
  },
});
