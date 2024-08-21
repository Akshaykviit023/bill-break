import {
  View,
  Image,
  Alert,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import CaptureBill from "./CaptureBill";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants";
import CustomButton from "./CustomButton";
import { CornerDownRight, Trash } from "lucide-react-native";
import getInitials from "../utils/getInitials";
import nameShortener from "../utils/nameShortener";

const AddBill = ({ membersObj }) => {
  const [capturedImage, setCapturedImage] = useState(null); // To store the captured image URI
  const [cameraVisible, setCameraVisible] = useState(false);
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(false); // To manage loading state
  const [openSplitAmong, setOpenSplitAmong] = useState(null); // Track which item is being split

  const handleUpload = async (imageUri) => {
    const token = await AsyncStorage.getItem("token");
    if (!imageUri) return;

    setLoading(true); // Start loading indicator

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "bill.jpg",
      });

      const response = await axios.post(`${API_URL}imageData`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setBillData(response.data.text);
      setLoading(false); // Stop loading indicator

      Alert.alert("Success", "Image uploaded successfully");
      console.log(response.data);
    } catch (error) {
      setLoading(false); // Stop loading indicator in case of error
      Alert.alert("Error", "Failed to upload image");
      console.error(error);
    }
  };

  const handleCapture = (uri) => {
    setCapturedImage(uri);
    setCameraVisible(false);
    handleUpload(uri); // Automatically upload the image after capturing
  };

  const handleItemChange = (index, field, value) => {
    const updatedBillData = { ...billData };
    updatedBillData.Items[index][field] = value;
    setBillData(updatedBillData);
  };

  const addNewItem = () => {
    const updatedBillData = { ...billData };
    updatedBillData.Items.push({ item: "", amount: "", splitMembers: [] }); // Add a new empty item
    setBillData(updatedBillData);
  };

  const deleteItem = (index) => {
    const updatedBillData = { ...billData };
    updatedBillData.Items.splice(index, 1); // Remove item at index
    setBillData(updatedBillData);
  };

  const toggleSplitAmong = (index) => {
    setOpenSplitAmong(openSplitAmong === index ? null : index);
  };

  const handleMemberToggle = (itemIndex, member) => {
    const updatedBillData = { ...billData };
    const item = updatedBillData.Items[itemIndex];
    const splitMembers = item.splitMembers || [];

    if (splitMembers.includes(member.id)) {
      // Remove member if already selected
      item.splitMembers = splitMembers.filter((id) => id !== member.id);
    } else {
      // Add member if not selected
      item.splitMembers = [...splitMembers, member.id];
    }

    console.log(updatedBillData);

    setBillData(updatedBillData);
  };

  return (
    <TouchableWithoutFeedback onPress={() => setOpenSplitAmong(null)}>
      <View>
        <CustomButton
          title="Open Camera"
          handlePress={() => setCameraVisible(true)}
        />

        {capturedImage && (
          <View className="w-full h-64 border-2 rounded-2xl border-dashed border-black-200 mt-4 p-1">
            <Image
              source={{ uri: capturedImage }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#E7EE4F" />
        ) : (
          billData && (
            <View>
              <View className="flex flex-row px-2 mt-4">
                <Text className="text-gray-500 font-psemibold text-base">
                  Items
                </Text>
                <Text className="text-gray-500 font-psemibold text-base ml-40">
                  Amount
                </Text>
              </View>
              {billData.Items.map((item, index) => (
                <View
                  key={index}
                  className="flex flex-row justify-between items-start mt-3"
                >
                  <View>
                    <View className="w-44 h-12 -z-10 px-4 bg-black-100 rounded-xl border-2 border-black-200 focus:border-[#E7EE4F] flex flex-row items-center">
                      <TextInput
                        className="flex-1 text-white "
                        value={item.item || ""}
                        placeholder="Item"
                        placeholderTextColor="#7B7B8B"
                        onChangeText={(value) =>
                          handleItemChange(index, "item", value)
                        }
                      />
                    </View>
                    <View className="ml-1 flex flex-row items-end relative">
                      <CornerDownRight
                        size={20}
                        strokeWidth={1}
                        className="text-gray-500"
                      />
                      <TouchableOpacity onPress={() => toggleSplitAmong(index)}>
                        <Text className="text-gray-500 text-xs underline">
                          Split among
                        </Text>
                      </TouchableOpacity>
                      <View className="flex flex-row absolute left-24 top-1">
                        {item.splitMembers &&
                          item.splitMembers.map((memberId, index) => {
                            const member = membersObj.find(
                              (m) => m.id === memberId
                            );
                            return (
                              <View
                                key={memberId}
                                style={{
                                  zIndex: item.splitMembers.length - index, // Ensure the later items overlap on top
                                  position: "absolute",
                                  left: index * 8, // Adjust this value to control the overlap
                                }}
                                className="w-6 h-6  bg-black-100 border border-solid border-[#E7EE4F] rounded-full flex items-center justify-center"
                              >
                                <Text className="text-gray-500 text-xs">
                                  {getInitials(member.memberName)}
                                </Text>
                              </View>
                            );
                          })}
                      </View>

                      {openSplitAmong === index && (
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          className="absolute -bottom-2 left-24 bg-black-200 max-w-32 rounded-lg p-1 border border-gray-600 border-solid"
                        >
                          {membersObj &&
                            membersObj.map((member) => (
                              <TouchableOpacity
                                key={member.id}
                                className="px-2 flex flex-col items-center"
                                onPress={() =>
                                  handleMemberToggle(index, member)
                                }
                              >
                                <View
                                  className={`w-8 h-8 bg-black-100 border border-solid rounded-full flex items-center justify-center ${
                                    item.splitMembers?.includes(member.id)
                                      ? "border-[#E7EE4F]"
                                      : "border-black-200"
                                  }`}
                                >
                                  <Text className="text-gray-500 text-sm font-psemibold">
                                    {getInitials(member.memberName)}
                                  </Text>
                                </View>
                                <Text className="text-gray-300 text-xs">
                                  {nameShortener(member.memberName)}
                                </Text>
                              </TouchableOpacity>
                            ))}
                        </ScrollView>
                      )}
                    </View>
                  </View>

                  <View className="w-24 h-12 px-4 -z-10 bg-black-100 rounded-xl border-2 border-black-200 focus:border-[#E7EE4F] flex flex-row items-center">
                    <TextInput
                      className="flex-1 text-white "
                      value={item.amount}
                      placeholder="0.00"
                      placeholderTextColor="#7B7B8B"
                      onChangeText={(value) =>
                        handleItemChange(index, "amount", value)
                      }
                      inputMode="numeric"
                    />
                  </View>
                  <TouchableOpacity
                    className="h-12 flex flex-row items-center"
                    onPress={() => deleteItem(index)}
                  >
                    <Trash className="text-red-600" />
                  </TouchableOpacity>
                </View>
              ))}

              <View className="flex flex-row justify-center mt-3 py-2">
                <TouchableOpacity
                  className="border-2 border-solid border-[#E7EE4F] py-1 px-3 rounded-full"
                  onPress={addNewItem}
                >
                  <Text className="text-[#E7EE4F] text-base">
                    Click To Add New Item
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        )}

        <CaptureBill
          visible={cameraVisible}
          onClose={() => setCameraVisible(false)}
          onCapture={handleCapture} // Automatically upload after capture
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddBill;
