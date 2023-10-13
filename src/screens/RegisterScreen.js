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

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, fireStore } from "../db/Config";

import { doc, setDoc, Timestamp } from "firebase/firestore";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  //function login
  const RegisterSubmit = async () => {
    //check field inputs are empty or not-----------------------------------
    let fieldempty = true;
    if (email !== "" && password !== "" && passwordConfirm !== "") {
      fieldempty = false;
    } else {
      fieldempty = true;
    }

    //email validation----------------------------------------------------
    let validEmail = false;
    let regexpattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    validEmail = regexpattern.test(email.toLowerCase());

    //check password matching --------------------------------------------
    let pwsMatch = false;
    //only giving true if passwords match
    if (password === passwordConfirm) {
      pwsMatch = true;
    } else {
      pwsMatch = false;
    }

    //Alert messages -----------------------------------------------------
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
    } else if (!pwsMatch) {
      //when passwords not matching , show alert message
      Alert.alert(
        "Passwords not matching",
        "Please enter same password twice to confirm password",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Canceled"),
            //style: "cancel",
          },
          {
            text: "OK",
            onPress: () => console.log("Accepted"),
          },
        ]
      );
    }

    //signInWithEmailAndPassword---------------------------------------
    if (!fieldempty && validEmail && pwsMatch) {
      try {
        await createUserWithEmailAndPassword(
          auth,
          email.toLowerCase(),
          password
        ).then(async (userCredential) => {
          // When success register
          const user = userCredential.user;

          //console.log(user);
          //reset variables
          setEmail("");
          setPassword("");
          setPasswordConfirm("");

          //Database data
          const fieldsData = {
            userId: user.uid.toString(),
            email: user.email.toString().toLowerCase(),
            createdDateTime: Timestamp.now(),
            updatedDateTime: Timestamp.now(),
          };
          await setDoc(
            doc(fireStore, "users", user.uid.toString()),
            fieldsData
          );

          //navigate to login screen
          if (user !== undefined) {
            //console.log("user exist");

            //Check verified the email address???
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
                  onPress: () => navigation.navigate("Login"),
                },
              ]);
            }
          } else {
            navigation.navigate("Login");
          }
        });
      } catch (e) {
        //When login not successfull
        console.log("Error code :" + e + "Message :" + e);

        Alert.alert("Login not successfull", e.toString());
      }
    }
  };

  //password visibility--------------------------------------------------------
  // State variable to track password visibility
  const [showPassword, setShowPassword] = useState(true); //eyeoff
  const [showPasswordConf, setShowPasswordConf] = useState(true); //eyeoff

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowPasswordConf = () => {
    setShowPasswordConf(!showPasswordConf);
  };

  return (
    <View style={{ backgroundColor: "purple" }}>
      {/*...................Login Form..............................*/}
      <View style={styles.container}>
        <Text style={styles.middleTitle}>Register</Text>

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
          style={[
            styles.outBoxes,
            {
              flexWrap: "wrap",
              flexDirection: "row",
            },
          ]}
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
        <View
          style={[styles.outBoxes, { flexWrap: "wrap", flexDirection: "row" }]}
        >
          <TextInput
            value={passwordConfirm}
            onChangeText={(passwordConfirm) => {
              setPasswordConfirm(passwordConfirm);
            }}
            placeholder="Re - Password"
            style={styles.textBoxes}
            //secureTextEntry={true}//hide
            secureTextEntry={showPasswordConf}
          />

          <MaterialCommunityIcons
            name={showPasswordConf ? "eye-off" : "eye"}
            size={24}
            color="#aaa"
            style={{ marginVertical: 12, marginLeft: 5 }}
            onPress={toggleShowPasswordConf}
          />
        </View>

        <Pressable style={styles.submitButton} onPress={RegisterSubmit}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
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
