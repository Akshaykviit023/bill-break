import React, { useState, useContext } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ReceiptText } from "lucide-react-native";
import AddDecimal from "./AddDecimal";
import AddPercentage from "./AddPercentage";
import AddBill from "./AddBill";
import { ExpenseContext } from "../context/ExpenseContext";

const CustomizeExpense = ({ visible, onClose, membersObj }) => {
  const [selectedTab, setSelectedTab] = useState("decimal");
  const [totalSplit, setTotalSplit] = useState(0);
  const { split } = useContext(ExpenseContext); // Get the total amount to be split

  const handleAmountChange = (amounts) => {
    const sum = Object.values(amounts).reduce((acc, amount) => acc + amount, 0);
    setTotalSplit(sum);
  };

  const switchTabContent = () => {
    switch (selectedTab) {
      case "decimal":
        return (
          <AddDecimal
            membersObj={membersObj}
            onAmountChange={handleAmountChange}
          />
        );
      case "percentage":
        return <AddPercentage membersObj={membersObj} />;
      case "receipt":
        return <AddBill membersObj={membersObj} />;
    }
  };

  const switchTabHeader = () => {
    switch (selectedTab) {
      case "decimal":
        return (
          <View className="mt-10 w-11/12 mx-auto">
            <Text className="text-center text-gray-300 font-psemibold">
              Split the bill unequally by amount.
            </Text>
            <Text className="text-center text-gray-600 ">
              Specify exactly how much each person owes.
            </Text>
          </View>
        );
      case "percentage":
        return (
          <View className="mt-10 w-11/12 mx-auto">
            <Text className="text-center text-gray-300 font-psemibold">
              Split by percentages.
            </Text>
            <Text className="text-center text-gray-600 ">
              Enter the percentage split that's fair for your situation.
            </Text>
          </View>
        );
      case "receipt":
        return (
          <View className="mt-10 w-11/12 mx-auto">
            <Text className="text-center text-gray-300 font-psemibold">
              Scan the bill and split.
            </Text>
            <Text className="text-center text-gray-600 ">
              Specify exactly how much each person owes by items.
            </Text>
          </View>
        );
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View className="py-16 px-4 bg-primary h-full relative">
        <View className="flex flex-row justify-between items-center">
          <TouchableOpacity onPress={() => onClose()}>
            <Text className="text-[#E7EE4F] font-pmedium">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-white font-psemibold text-base ">
            Customize Split
          </Text>
          <TouchableOpacity onPress={() => onClose()}>
            <Text className="text-[#E7EE4F] font-pmedium">Save</Text>
          </TouchableOpacity>
        </View>

        {switchTabHeader()}

        <View className="flex flex-row justify-evenly mt-8">
          <TouchableOpacity
            className={`border-2 border-solid ${
              selectedTab === "decimal"
                ? "border-[#E7EE4F]"
                : "border-black-200"
            } bg-black-100 rounded-lg w-16 py-1`}
            onPress={() => setSelectedTab("decimal")}
          >
            <Text
              className={`text-lg font-pbold text-center ${
                selectedTab === "decimal" ? "text-[#E7EE4F]" : "text-gray-600"
              }`}
            >
              1.23
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`border-2 border-solid ${
              selectedTab === "percentage"
                ? "border-[#E7EE4F]"
                : "border-black-200"
            } bg-black-100 rounded-lg w-16 py-1`}
            onPress={() => setSelectedTab("percentage")}
          >
            <Text
              className={`text-lg font-pbold text-center ${
                selectedTab === "percentage"
                  ? "text-[#E7EE4F]"
                  : "text-gray-600"
              }`}
            >
              %
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`border-2 border-solid ${
              selectedTab === "receipt"
                ? "border-[#E7EE4F]"
                : "border-black-200"
            } bg-black-100 rounded-lg w-16 py-1 flex flex-row items-center justify-center`}
            onPress={() => setSelectedTab("receipt")}
          >
            <ReceiptText
              className={`${
                selectedTab === "receipt" ? "text-[#E7EE4F]" : "text-gray-600"
              }`}
            />
          </TouchableOpacity>
        </View>

        <ScrollView className="mt-8" showsVerticalScrollIndicator={false}>
          {switchTabContent()}
        </ScrollView>

        <View className="absolute bottom-0 py-6 left-4 w-full border-t border-solid border-black-200">
          <Text className="text-white text-base font-pmedium text-center">
            &#8377; {totalSplit} of &#8377; {split}
          </Text>
          <Text
            className={`${
              split - totalSplit < 0 ? "text-red-600" : "text-gray-300"
            } text-center font-pregular`}
          >
            {split - totalSplit < 0 ? "-" : ""}
            &#8377; {Math.abs(split - totalSplit)} left
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default CustomizeExpense;
