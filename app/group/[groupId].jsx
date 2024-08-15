// app/groups/bills/[groupId].js

import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { icons } from "../../constants";
import AddExpense from "../../components/AddExpense";
import { ExpenseProvider } from "../../context/ExpenseContext";
import { API_URL } from "../../constants";

const BillScreen = () => {
  const { groupId } = useLocalSearchParams(); // Get groupId from route parameters
  const [bills, setBills] = useState([]);
  const [groupDetails, setGroupDetails] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const fetchOrganizations = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post(
        `${API_URL}groups/fetch-group`,
        { groupId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setGroupDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleCreateModalClose = () => {
    setIsCreateModalVisible(false);
    fetchOrganizations(); // Re-fetch groups after closing the modal
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="p-4">
        {groupDetails ? (
          <View>
            <Text className="text-2xl text-white font-psemibold">
              {groupDetails.name}
            </Text>
          </View>
        ) : (
          <View className="h-full w-full flex justify-center items-center">
            <ActivityIndicator color="#fff" size="large" />
          </View>
        )}
      </View>

      <TouchableOpacity onPress={() => setIsCreateModalVisible(true)}>
        <Image
          source={icons.plus}
          resizeMode="contain"
          tintColor="#E7EE4F"
          className="w-16 h-16"
        />
      </TouchableOpacity>
      <Modal
        visible={isCreateModalVisible}
        onRequestClose={handleCreateModalClose}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ExpenseProvider>
          <AddExpense
            onClose={handleCreateModalClose}
            groupDetails={groupDetails}
          />
        </ExpenseProvider>
      </Modal>
    </SafeAreaView>
  );
};

export default BillScreen;
