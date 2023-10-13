import { StyleSheet, Text, View, Pressable, Button, Image } from "react-native";
import React from "react";

const IndexScreen = ({ navigation }) => {
  const enterBill = () => {
    navigation.navigate("Upcomming");
  };

  const enterIncome = () => {
    navigation.navigate("Upcomming");
  };

  return (
    <View style={styles.container}>
      {/*...................card-1..............................*/}
      <View style={styles.card}>
        <Pressable style={{ height: "100%" }} onPress={enterIncome}>
          <View style={{ height: "70%" }}>
            <Image
              style={styles.image}
              source={require("../../assets/Income.jpg")}
            />
          </View>
          <View>
            <Text style={styles.category}>Income</Text>
          </View>
          <View>
            <Text style={styles.description}>Monthly income</Text>
          </View>
        </Pressable>
      </View>
      {/*...................card-2..............................*/}
      <View style={styles.card}>
        <Pressable style={{ height: "100%" }} onPress={enterBill}>
          <View style={{ height: "70%" }}>
            <Image
              style={styles.image}
              source={require("../../assets/bill.jpg")}
            />
          </View>
          <View>
            <Text style={styles.category}>Bills</Text>
          </View>
          <View>
            <Text style={styles.description}>Your Bills Details</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  container: {
    //backgroundColor: "#7589FA",
    backgroundColor: "#b3cbf2",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    margin: 0,
    paddingVertical: "15%",
  },

  card: {
    margin: "5%",
    padding: "3%",
    fontSize: 40,
    color: "",
    width: "90%",
    height: "40%",
    backgroundColor: "#F7F5EE",
    borderBottomColor: "#adb2ba",
    borderBottomWidth: 2,
  },

  image: {
    height: "100%",
    width: "100%",
  },

  category: {
    fontSize: 20,
    fontWeight: "light",
    marginLeft: 10,
  },

  description: {
    marginLeft: 15,
  },
});
