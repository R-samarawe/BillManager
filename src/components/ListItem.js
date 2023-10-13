import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { db, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { app, auth, fireStore } from "../db/Config";
import { onAuthStateChanged } from "firebase/auth";

// bill object
/**
 1. id 
 2. duedate
 3. amount
 4. category
 5. description
 4. added_date
 5. last_updated_date
 6. status {upcoming , overdue , paid}
 7. isChecked    //if true means paid
 */
const ListItem = (props) => {
  //props -> category, amount, date, description, isChecked, id, getBillingList

  const deleteBillingItem = async () => {
    await deleteDoc(doc(fireStore, "bills", props.id));
    props.navigation.navigate("Upcomming");
    //refresh List
  };
  const updateBillingItem = async () => {
    props.navigation.navigate("UpdateBill", { id: props.id });
  };

  const setChangeStatus = async () => {
    try {
      const docRef = doc(fireStore, "bills", props.id);

      await updateDoc(docRef, {
        billstatus: "PAID",
        isChecked: true, //paid
      });

      props.navigation.navigate("Upcomming");
    } catch (error) {
      console.error("Error adding document: ", e);
    }
  };

  //console.log(props.category);
  // date----------------------------
  const getDateBy = (givenNewDateTime, reqformat) => {
    /*
    const dateOnly = givenNewDateTime.toLocaleString().split(",");
    const seperateDate = dateOnly[0].toLocaleString().split("/");

    if (reqformat == "year") {
      return seperateDate[2];
    } else if (reqformat == "month") {
      return seperateDate[1];
    } else if (reqformat == "date") {
      return seperateDate[0];
    }
    */
    console.log(props.date);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* shopping text*/}
      <View style={styles.col}>
        <Text style={styles.title}>{props.category}</Text>
        <Text style={styles.title}>{props.amount}</Text>
        <Text style={styles.text}>{props.description}</Text>
      </View>
      {/* delete button */}
      <View style={{ flexDirection: "row" }}>
        {/* checked icon */}
        <Pressable onPress={setChangeStatus} style={{ marginHorizontal: 4 }}>
          <AntDesign name="checkcircleo" size={30} color="black" />
        </Pressable>
        <Pressable onPress={deleteBillingItem} style={{ marginHorizontal: 4 }}>
          <MaterialIcons name="delete" size={30} color="black" />
        </Pressable>
        <Pressable onPress={updateBillingItem} style={{ marginHorizontal: 4 }}>
          <AntDesign name="edit" size={30} color="black" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "lightgray",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    height: 100,
  },
  title: {
    flex: 1,
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "500",
  },
  col: {
    flexDirection: "column",
  },
  text: {
    marginLeft: 10,
    fontSize: 11,
  },
});
