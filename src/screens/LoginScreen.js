import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";

import { auth, app } from "../db/Config";
import {
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //function login
  const loginSubmit = async () => {
    //check field inputs are empty or not-----------------------------------
    let fieldempty = true;
    if (email !== "" && password !== "") {
      fieldempty = false;
    } else {
      fieldempty = true;
    }
    //email validation---------------------------------------------
    let validEmail = false;
    let regexpattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    validEmail = regexpattern.test(email.toLowerCase());

    //Alert messages---------------------------------------------------
    if (fieldempty) {
      // When fields empty show alert message
      Alert.alert("Empty Inputs", "Enter Email and Password", [
        {
          text: "Cancel",
          onPress: () => console.log("Canceled"),
          //style: "cancel",
        },
        {
          text: "OK",
          onPress: () => console.log("Accepted"),
        },
      ]);
    } else if (!validEmail) {
      //when email not valid , show alert message
      Alert.alert("Invalid Email", "Invalid Email", [
        {
          text: "Cancel",
          onPress: () => console.log("Canceled"),
          //style: "cancel",
        },
        {
          text: "OK",
          onPress: () => console.log("Accepted"),
        },
      ]);
    }

    //signInWithEmailAndPassword---------------------------------------
    if (!fieldempty && validEmail) {
      try {
        await signInWithEmailAndPassword(auth, email, password).then(
          async (userCredential) => {
            // Signed in
            const user = userCredential.user;

            //console.log(user);
            setEmail("");
            setPassword("");

            if (user.emailVerified) {
              //navigate to index screen
              navigation.navigate("Index");
            } else {
              await sendEmailVerification(user);

              //alert message to verify your email
              Alert.alert("Verify Email", "Please Verify Your Email", [
                {
                  text: "Cancel",
                  onPress: () => console.log("Canceled"),
                  //style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => console.log("Accepted"),
                },
              ]);
            }
          }
        );
      } catch (e) {
        console.log("Error code :" + e);
      }
    }
  };

  //password visibility-----------------------------------------------------------
  // State variable to track password visibility
  const [showPassword, setShowPassword] = useState(true);

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={{ backgroundColor: "purple" }}>
      {/*...................Register button..............................*/}
      <View style={styles.registerLink}>
        <Pressable
          style={{ height: "100%", width: "100%", alignItems: "flex-end" }}
          onPress={() => {
            navigation.navigate("Register");
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
            }}
          >
            <Image
              style={{ height: 35, width: 35 }}
              source={require("../../assets/profile.jpg")}
            />
            <Text style={{ fontWeight: "bold" }}>
              Still not registed ? Register
            </Text>
          </View>
        </Pressable>
      </View>

      {/*...................Login Form..............................*/}
      <View style={styles.container}>
        <Text style={styles.middleTitle}>Login</Text>

        <View
          style={[styles.outBoxes, { flexWrap: "wrap", flexDirection: "row" }]}
        >
          <TextInput
            value={email}
            onChangeText={(email) => {
              setEmail(email);
            }}
            placeholder="Email"
            style={styles.textBoxes}
          />
        </View>

        <View
          style={[styles.outBoxes, { flexWrap: "wrap", flexDirection: "row" }]}
        >
          <TextInput
            value={password}
            onChangeText={(password) => {
              setPassword(password);
            }}
            placeholder="Password"
            style={styles.textBoxes}
            //secureTextEntry={true}//hide
            secureTextEntry={showPassword}
          />
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#aaa"
            style={{ marginVertical: 12, marginLeft: 5 }}
            onPress={toggleShowPassword}
          />
        </View>

        <Pressable style={styles.submitButton} onPress={loginSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "92%",
  },

  textBoxes: {
    width: "90%",
    height: 50,
    fontSize: 15,
    padding: 4,
    paddingLeft: 25,
    marginVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: "lightgray",
    borderColor: "gray",
    borderWidth: 0.2,
    borderRadius: 40,
  },

  outBoxes: {
    width: "90%",
    height: 50,
    marginBottom: 20,
    padding: 4,
    paddingLeft: 25,
    paddingHorizontal: 10,
  },

  middleTitle: {
    fontSize: 35,
    marginTop: 20,
    marginBottom: 70,
    color: "white",
    fontWeight: "bold",
  },

  submitButton: {
    marginTop: 40,
    padding: 10,
    width: "70%",
    backgroundColor: "white",
    borderRadius: 40,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },

  registerLink: {
    backgroundColor: "white",
    padding: 10,
    borderBottomLeftRadius: 40,
    borderBottomLeftRadius: 40,
    marginEnd: 0,
    height: 60,
    width: "100%",
    alignItems: "flex-start",
  },
});
