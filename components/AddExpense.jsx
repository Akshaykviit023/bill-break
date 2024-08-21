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
  TouchableWithoutFeedback,
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
  const [expenseDescription, setexpenseDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [members, setMembers] = useState([]);

  const [customizeVisible, setCustomizeVisible] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [paidBy, setPaidBy] = useState(null);
  const [openPaidBy, setOpenPaidBy] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem("userId");
      setPaidBy(userId);
    };
    fetchUserId();
  }, []);
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

  const handleSplitEqually = async () => {
    const equalAmount = parseFloat(amount) / selectedMembers.length;

    const owers = selectedMembers.map((member) => ({
      user: member.id,
      amount: equalAmount,
    }));

    const payload = {
      expenseDescription: expenseDescription,
      totalAmount: amount,
      paidBy: paidBy,
      owers: owers,
    };

    const token = await AsyncStorage.getItem("token");

    try {
      const response = await axios.post(
        `${API_URL}bills/addExpense`,
        {
          groupId: groupDetails._id,
          expenseDetails: payload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.billId) {
        onClose();
        Alert.alert("Success", "Expense added successfully");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full p-4">
      <TouchableWithoutFeedback onPress={() => setOpenPaidBy(false)}>
        <View className="mt-2">
          <Text className="text-white font-psemibold text-2xl pb-4">
            Add an Expense
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <FormField
              title="Enter a Description"
              value={expenseDescription}
              handleChangeText={(e) => setexpenseDescription(e)}
              otherStyles="mt-8"
            />
            <FormField
              title="Enter Amount"
              value={amount}
              handleChangeText={(e) => {
                setAmount(e);
                setSplit(e);
              }}
              otherStyles="mt-8"
              placeholder="0.00"
              inputType="numeric"
            />
            <View className="mt-8 flex flex-row justify-between relative">
              <Text className=" text-gray-300 font-pmedium text-base">
                Paid By
              </Text>
              <TouchableOpacity onPress={() => setOpenPaidBy((val) => !val)}>
                <Text className="italic underline text-gray-600 text-base">
                  Change default
                </Text>
              </TouchableOpacity>
              {openPaidBy && (
                <View className="border-l z-20 border-t border-black-200 border-solid h-4 w-4 absolute right-4 top-6 bg-black-100 rotate-45" />
              )}
              {openPaidBy && (
                <ScrollView
                  className="max-w-36 bg-black-100 border border-black-200 border-solid right-0 top-8 rounded-xl z-10 p-2  absolute"
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {members &&
                    members.map((item, index) => (
                      <TouchableOpacity
                        key={item.id}
                        className="px-2 flex flex-col items-center "
                        onPress={() => setPaidBy(item.id)}
                      >
                        <View
                          className={`w-10 bg-black-100 h-10 ${
                            paidBy && item.id == paidBy
                              ? "border-[#E7EE4F]"
                              : "border-black-200"
                          }  border-2 border-solid rounded-full flex  items-center justify-center`}
                        >
                          <Text className="text-gray-500 text-base font-psemibold">
                            {getInitials(item.memberName)}
                          </Text>
                        </View>
                        <Text className="text-gray-300  text-xs mt-1 ">
                          {nameShortener(item.memberName)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              )}
            </View>

            <View className="mt-8 flex flex-row justify-between -z-10">
              <Text className=" text-gray-300 font-pmedium text-base">
                Split With
              </Text>

              <Text className=" text-gray-500 font-pmedium text-base">
                {selectedMembers.length} Person
              </Text>
            </View>

            <ScrollView
              className="mt-3 -z-10"
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
              containerStyles="w-full mt-7 mb-16"
              isLoading={
                !amount || !expenseDescription || !selectedMembers.length
              }
              handlePress={handleSplitEqually}
            />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AddExpense;
