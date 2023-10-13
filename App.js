import * as React from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import LoginScreen from "./src/screens/LoginScreen";
import IndexScreen from "./src/screens/IndexScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddBillScreen from "./src/screens/AddBillScreen";
import UpcommingScreen from "./src/screens/UpcommingScreen";
import OverdueScreen from "./src/screens/OverdueScreen";
import PaidScreen from "./src/screens/PaidScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import UpdateBillScreen from "./src/screens/UpdateBillScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Index"
          component={IndexScreen}
          options={{ title: "Welcome", headerShown: false }}
        />
        <Stack.Screen
          name="AddBill"
          component={AddBillScreen}
          options={{ title: "Add Bill" }}
        />
        <Stack.Screen
          name="UpdateBill"
          component={UpdateBillScreen}
          options={{ title: "Update Bill" }}
        />
        <Stack.Screen name="Upcomming" component={UpcommingScreen} />
        <Stack.Screen name="Overdue" component={OverdueScreen} />
        <Stack.Screen name="Paid" component={PaidScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
