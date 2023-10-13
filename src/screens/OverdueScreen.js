import {
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { app, auth, fireStore } from "../db/Config";
import TabHeader from "../components/TabHeader";
import ListItem from "../components/ListItem";
import { onAuthStateChanged } from "firebase/auth";

const OverdueScreen = ({ navigation }) => {
  const [tab2, setTab] = useState("OVERDUE");

  //User Logged-----------------------------------------------------
  const [logged, setLogged] = useState(false);
  const [userid, setUserId] = useState("");

  const [billingList, setBillingList] = useState([]); // for read purposes

  const getBillingList = async () => {
    try {
      //console.log("Reading");
      const collecRef = collection(fireStore, "bills");
      const q = query(
        collecRef,
        where("userId", "==", userid),
        where("billstatus", "==", "OVERDUE")
      );
      const querySnapshot = await getDocs(q);

      setBillingList(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

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

  useEffect(() => {
    if (tab2 == "OVERDUE") {
      console.log("function called!");
      getBillingList();
    }
  }, []);

  //console.log("length is :" + billingList.length);

  return (
    <SafeAreaView style={styles.container}>
      <TabHeader
        label=""
        selectedValue={tab2}
        values={["UPCOMING", "OVERDUE", "PAID"]}
        setSelectedValue={setTab}
        navigation={navigation}
      ></TabHeader>
      {/** flat list */}
      <View style={{ marginTop: 100 }}>
        {billingList.length > 0 ? (
          <FlatList
            data={billingList}
            renderItem={({ item }) => (
              <ListItem
                category={item.category}
                amount={item.amount}
                description={item.description}
                //date={item.date["seconds"]}
                isChecked={item.isChecked}
                id={item.id}
                getBillingList={getBillingList}
                navigation={navigation}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <ActivityIndicator />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OverdueScreen;

const styles = StyleSheet.create({
  box: {
    width: "%80",
    height: 70,
    backgroundColor: "powderblue",
  },

  header: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center", //row wise
    alignItems: "center", //  column wise
    padding: 10,
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 10,
    height: 100,
  },

  heading: {
    fontSize: 30,
    fontWeight: "500",
    flex: 1,
  },

  noOfItems: {
    fontSize: 30,
    fontWeight: "500",
    marginRight: 20,
  },
});
