import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
} from "react-native";
import React from "react";

const TabHeader = ({
  label,
  children,
  values,
  selectedValue,
  setSelectedValue,
  navigation,
}) => {
  const goToPage = (value) => {
    if (value == "UPCOMING") {
      navigation.navigate("Upcomming");
    } else if (value == "OVERDUE") {
      navigation.navigate("Overdue");
    } else if (value == "PAID") {
      navigation.navigate("Paid");
    }
  };

  const openAddForm = () => {
    navigation.navigate("AddBill");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {values.map((value) => (
          <TouchableOpacity
            key={value}
            onPress={() => {
              setSelectedValue(value);
              goToPage(value);
            }}
            style={[styles.button, selectedValue === value && styles.selected]}
          >
            <Text
              style={[
                styles.buttonLabel,
                selectedValue === value && styles.selectedLabel,
              ]}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <View style={{ position: "absolute", bottom: -650 }}>
            <Pressable style={styles.addButton} onPress={openAddForm}>
              <Text style={styles.buttonText}>+</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TabHeader;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: "#b3cbf2",
    marginHorizontal: "1%",
    marginBottom: 6,
    minWidth: "31%",
    height: 40,
    alignItems: "center",
  },
  selected: {
    backgroundColor: "royalblue",
    borderWidth: 0,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
  selectedLabel: {
    color: "white",
  },
  label: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 24,
  },
  addButton: {
    backgroundColor: "royalblue",
    borderRadius: 80,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginEnd: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
