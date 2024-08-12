import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import axios from "axios";

const CreateGroup = ({ onClose }) => {
  const [grpName, setGrpName] = useState("");

  const createGrp = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://192.168.29.201:3000/api/v1/groups/create-group",
        { name: grpName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      onClose();
    } catch (error) {
      Alert.alert("error", error.message);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full p-4">
      <View className="mt-2">
        <Text className="text-white font-psemibold text-2xl">Create Group</Text>
        <FormField
          title="Enter Group Name"
          value={grpName}
          handleChangeText={(e) => setGrpName(e)}
          otherStyles="mt-10"
        />

        <CustomButton
          title="Create"
          containerStyles="w-full mt-7"
          handlePress={createGrp}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateGroup;
