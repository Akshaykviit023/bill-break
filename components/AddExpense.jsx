import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  Text,
  View,
  Alert,
  Button,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import axios from "axios";
import getInitials from "../utils/getInitials";
import nameShortener from "../utils/nameShortener";
import CaptureBill from "./CaptureBill"; // Import the CameraModal component

const AddExpense = ({ onClose, groupDetails }) => {
  const [grpName, setGrpName] = useState("");
  const [amount, setAmount] = useState("");
  const [members, setMembers] = useState([]);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null); // To store the captured image URI

  useEffect(() => {
    const fetchMembers = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await axios.post(
          "http://192.168.29.201:3000/api/v1/bills/fetch-members",
          { groupId: groupDetails._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMembers(response.data);
      } catch (error) {
        Alert.alert("error", error.message);
      }
    };

    fetchMembers();
  }, [onClose]);

  return (
    <SafeAreaView className="bg-primary h-full p-4">
      <View className="mt-2">
        <Text className="text-white font-psemibold text-2xl pb-4">
          Add an Expense
        </Text>
        <ScrollView>
          <FormField
            title="Enter a Description"
            value={grpName}
            handleChangeText={(e) => setGrpName(e)}
            otherStyles="mt-8"
          />
          <FormField
            title="Enter Amount"
            value={amount}
            handleChangeText={(e) => setAmount(e)}
            otherStyles="mt-8"
            placeholder="0.00"
            inputType="numeric"
          />

          <ScrollView
            className="mt-8"
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {members &&
              members.map((item, index) => (
                <View key={index} className="px-3 flex flex-col items-center ">
                  <View className="w-16 bg-black-100 h-16 border-black-200 border-2 border-solid rounded-full flex  items-center justify-center">
                    <Text className="text-gray-500 text-xl font-psemibold">
                      {getInitials(item.memberName)}
                    </Text>
                  </View>
                  <Text className="text-gray-300 mt-2 font-pmedium">
                    {nameShortener(item.memberName)}
                  </Text>
                </View>
              ))}
          </ScrollView>

          <CustomButton title="Add" containerStyles="w-full mt-7" />

          <Button title="Open Camera" onPress={() => setCameraVisible(true)} />

          <View className="w-full h-72 mb-16">
            {capturedImage && (
              <Image
                source={{ uri: capturedImage }}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            )}
          </View>

          <CaptureBill
            visible={cameraVisible}
            onClose={() => setCameraVisible(false)}
            onCapture={(uri) => setCapturedImage(uri)} // Capture the image URI
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddExpense;
