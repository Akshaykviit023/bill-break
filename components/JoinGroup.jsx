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

const JoinGroup = ({ onClose }) => {
  const [joinId, setJoinId] = useState("");

  const joinGrp = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://192.168.29.201:3000/api/v1/groups/join-group",
        { joinId },
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
        <Text className="text-white font-psemibold text-2xl">Join Group</Text>
        <FormField
          title="Group Id"
          value={joinId}
          handleChangeText={(e) => setJoinId(e)}
          otherStyles="mt-10"
        />

        <CustomButton
          title="Join"
          containerStyles="w-full mt-7"
          handlePress={joinGrp}
        />
      </View>
    </SafeAreaView>
  );
};

export default JoinGroup;
