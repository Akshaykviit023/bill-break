import { View, Text } from "react-native";
import dateFormat from "../utils/dateFormat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState, useEffect } from "react";
import { API_URL } from "../constants";
import numberWithCommas from "../utils/numberWithComma";

const BillList = ({ bill, ind, currUser }) => {
  const [paidBy, setPaidBy] = useState("");
  const [amountOwed, setAmountOwed] = useState(null);

  const fetchPaidBy = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post(
        `${API_URL}bills/fetchPaidBy`,
        { userId: bill.paidBy },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPaidBy(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPaidBy();
  }, []);

  useEffect(() => {
    if (bill.splitAmong && currUser) {
      if (bill.paidBy === currUser) {
        // Calculate total amount owed by all users except bill.paidBy
        const totalOwed = bill.splitAmong
          .filter((split) => split.user !== currUser) // Exclude the current user
          .reduce((sum, split) => sum + split.amount, 0);
        setAmountOwed(totalOwed);
      } else {
        // Find the amount that the current user owes
        const userOwed = bill.splitAmong.find(
          (split) => split.user === currUser
        );
        setAmountOwed(userOwed ? userOwed.amount : 0);
      }
    }
  }, [bill, currUser]);

  return (
    <View
      key={ind}
      className="px-4  my-1 flex flex-col   bg-black-100 rounded-2xl border border-black-200 border-solid"
    >
      <View className="py-2 flex flex-row justify-between items-center border-b border-solid border-black-200">
        <View>
          <Text className="text-base text-white font-pregular">
            {bill.title}
          </Text>
          <Text className="text-xs text-gray-500 font-pregular">
            {dateFormat(bill.date)}
          </Text>
        </View>

        <View>
          {paidBy && (
            <Text className="text-lg text-white font-pregular">
              &#8377; {numberWithCommas(bill.total)}
            </Text>
          )}
        </View>
      </View>

      <View className="py-2 flex flex-row justify-between items-center">
        {bill.paidBy === currUser ? (
          <View
            className={`flex flex-row justify-between items-center w-full px-4 py-1 rounded-full border-2 border-solid ${
              amountOwed ? "border-red-800" : "border-gray-300"
            }`}
          >
            <Text className={`text-red-800 font-pmedium`}>You owe</Text>
            <Text
              className={`text-base ${
                amountOwed ? "text-red-800" : "text-gray-300"
              } font-psemibold`}
            >
              &#8377; {numberWithCommas(amountOwed) || "not involved"}
            </Text>
          </View>
        ) : (
          <View
            className={`flex flex-row justify-between items-center w-full px-4 py-1 rounded-full border-2 border-solid ${
              amountOwed ? "border-green-800" : "border-gray-300"
            }`}
          >
            <Text
              className={` ${
                amountOwed ? "text-green-800" : "text-gray-300"
              } font-pmedium`}
            >
              You lent
            </Text>
            <Text
              className={`text-base ${
                amountOwed ? "text-green-800" : "text-gray-300"
              } font-psemibold`}
            >
              &#8377; {numberWithCommas(amountOwed) || "not involved"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default BillList;
