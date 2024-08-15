import { View, Button, Image, Alert, Text } from "react-native";
import CaptureBill from "./CaptureBill";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";
import { API_URL } from "../constants";

const AddBill = () => {
  const [capturedImage, setCapturedImage] = useState(null); // To store the captured image URI
  const [cameraVisible, setCameraVisible] = useState(false);
  const [billData, setBillData] = useState(null);

  const handleUpload = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!capturedImage) return;

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: capturedImage,
        type: "image/jpeg",
        name: "bill.jpg",
      });

      const response = await axios.post(
        `${API_URL}imageData`,
        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Image uploaded successfully");
      setBillData(response.data.text);
      console.log(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to upload image");
      console.error(error);
    }
  };

  return (
    <View>
      <Button title="Open Camera" onPress={() => setCameraVisible(true)} />

      {capturedImage && (
        <View className="w-full h-72 mb-16">
          <Image
            source={{ uri: capturedImage }}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </View>
      )}

      {billData &&
        billData.Items.map((item, index) => (
          <View key={index} className="flex flex-row justify-between">
            <Text className="text-white">{item.item}</Text>
            <Text className="text-white">{item.amount}</Text>
          </View>
        ))}

      <Button
        title="Upload Image"
        onPress={handleUpload}
        disabled={!capturedImage}
      />

      <CaptureBill
        visible={cameraVisible}
        onClose={() => setCameraVisible(false)}
        onCapture={(uri) => setCapturedImage(uri)} // Capture the image URI
      />
    </View>
  );
};

export default AddBill;
