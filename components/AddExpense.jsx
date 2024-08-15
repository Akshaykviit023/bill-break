import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  Text,
  View,
  Alert,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import axios from "axios";
import getInitials from "../utils/getInitials";
import nameShortener from "../utils/nameShortener";

import CustomizeExpense from "./CustomizeExpense";
import { ExpenseContext } from "../context/ExpenseContext";

const AddExpense = ({ onClose, groupDetails }) => {
  const [grpName, setGrpName] = useState("");
  const [amount, setAmount] = useState("");
  const [members, setMembers] = useState([]);

  const [customizeVisible, setCustomizeVisible] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const { split, setSplit } = useContext(ExpenseContext);

  useEffect(() => {
    const fetchMembers = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await axios.post(
          `${API_URL}bills/fetch-members`,
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

  const handleMemberSelect = (memberObj) => {
    setSelectedMembers((prevSelected) => {
      if (prevSelected.includes(memberObj)) {
        // If the member is already selected, deselect them
        return prevSelected.filter((obj) => obj !== memberObj);
      } else {
        // Otherwise, add them to the selected list
        return [...prevSelected, memberObj];
      }
    });
  };

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

          <View className="mt-8 flex flex-row justify-between">
            <Text className=" text-gray-300 font-pmedium text-base">
              Split With
            </Text>

            <Text className=" text-gray-500 font-pmedium text-base">
              {selectedMembers.length} Person
            </Text>
          </View>

          <ScrollView
            className="mt-3"
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {members &&
              members.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  className="px-3 flex flex-col items-center "
                  onPress={() => handleMemberSelect(item)}
                >
                  <View
                    className={`w-16 bg-black-100 h-16 ${
                      selectedMembers.includes(item)
                        ? "border-[#E7EE4F]"
                        : "border-black-200"
                    }  border-2 border-solid rounded-full flex  items-center justify-center`}
                  >
                    <Text className="text-gray-500 text-xl font-psemibold">
                      {getInitials(item.memberName)}
                    </Text>
                  </View>
                  <Text className="text-gray-300 mt-2 font-pmedium">
                    {nameShortener(item.memberName)}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>

          <View className="flex flex-row justify-end">
            <TouchableOpacity
              className="mt-8 "
              onPress={() => setCustomizeVisible(true)}
              disabled={!amount}
            >
              <Text className="text-[#E7EE4F]">Customize</Text>
            </TouchableOpacity>
          </View>

          <CustomizeExpense
            membersObj={selectedMembers}
            visible={customizeVisible}
            onClose={() => setCustomizeVisible(false)} // Capture the image URI
          />

          <CustomButton
            title="Add"
            containerStyles="w-full mt-7"
            isLoading={!amount || !grpName}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddExpense;
