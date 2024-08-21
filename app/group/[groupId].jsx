import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { CirclePlus } from "lucide-react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddExpense from "../../components/AddExpense";
import { ExpenseProvider } from "../../context/ExpenseContext";
import { API_URL } from "../../constants";
import BillList from "../../components/BillList";
import simplifyDebt from "../../utils/simplifyDebt";
import numberWithCommas from "../../utils/numberWithComma";

const BillScreen = () => {
  const { groupId } = useLocalSearchParams(); // Get groupId from route parameters
  const [bills, setBills] = useState([]);
  const [groupDetails, setGroupDetails] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState([]); // Initialize as an empty array
  const [currUser, setCurrUser] = useState();

  const fetchOrganizations = async () => {
    const user = await AsyncStorage.getItem("userId");
    setCurrUser(user);
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

  useEffect(() => {
    if (groupDetails) {
      fetchBills();
    }
  }, [groupDetails]);

  const fetchBills = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.post(
        `${API_URL}bills/fetchBills`,
        { groupId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("All the bills fetched: ", response.data);
      const fetchedBills = response.data.reverse();
      setBills(fetchedBills);

      if (groupDetails && groupDetails.members) {
        // Create the graph
        const membersCount = groupDetails.members.length;
        const graph = Array.from({ length: membersCount }, () =>
          Array(membersCount).fill(0)
        );

        fetchedBills.forEach((bill) => {
          const payerIndex = groupDetails.members.findIndex(
            (member) => member === bill.paidBy
          );

          bill.splitAmong.forEach((split) => {
            const payeeIndex = groupDetails.members.findIndex(
              (member) => member === split.user
            );
            if (
              payerIndex !== payeeIndex &&
              payerIndex >= 0 &&
              payeeIndex >= 0
            ) {
              graph[payeeIndex][payerIndex] += split.amount;
            }
          });
        });

        console.log("Owes Graph: ", graph);

        const transactionGraph = simplifyDebt(graph);
        console.log("Simplified debt: ", transactionGraph);
        setTransactions(transactionGraph);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await axios.post(
          `${API_URL}bills/fetch-members`,
          { groupId: groupDetails?._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMembers(response.data);
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    if (groupDetails) {
      fetchMembers();
    }
  }, [groupDetails]);

  const handleCreateModalClose = () => {
    setIsCreateModalVisible(false);
    fetchOrganizations(); // Re-fetch groups after closing the modal
    fetchBills();
  };

  const getMemberNameById = (id) => {
    if (!members) return id; // Check if members is defined
    const member = members.find((member) => member.id === id);
    return member ? member.memberName : id;
  };

  const copyToClipboard = async (groupId) => {
    await Clipboard.setStringAsync(groupId);
    console.log(groupId);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="p-4">
        {groupDetails ? (
          <View className="p-4">
            <View className="flex flex-row items-center">
              <Text className="text-2xl text-white font-psemibold">
                {groupDetails.name}
              </Text>
              <TouchableOpacity
                className="ml-4 border border-solid border-black-200 rounded-lg px-2"
                onPress={() => copyToClipboard(groupDetails.organizationId)}
              >
                <Text className=" text-lg text-gray-300 font-pregular">
                  # {groupDetails.organizationId}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="mt-2">
              {transactions.map((row, i) =>
                row.map((amount, j) => {
                  if (amount > 0) {
                    return (
                      <Text
                        key={`${i}-${j}`}
                        className={`font-pregular ${
                          currUser === groupDetails.members[i]
                            ? "text-red-800"
                            : currUser === groupDetails.members[j]
                            ? "text-green-800"
                            : "text-gray-600"
                        }`}
                      >
                        {currUser === groupDetails.members[i]
                          ? "You"
                          : getMemberNameById(groupDetails.members[i])}{" "}
                        owe{" "}
                        <Text className="font-psemibold text-base">
                          &#8377; {numberWithCommas(amount)}
                        </Text>{" "}
                        to{" "}
                        {currUser === groupDetails.members[j]
                          ? "You"
                          : getMemberNameById(groupDetails.members[j])}
                      </Text>
                    );
                  }
                  return null;
                })
              )}
            </View>
          </View>
        ) : (
          <View className="h-full w-full flex justify-center items-center">
            <ActivityIndicator color="#fff" size="large" />
          </View>
        )}

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="h-20"
        >
          <View className="flex flex-row items-center">
            <TouchableOpacity className="mx-3 border-2 border-black-200 border-dashed px-4 py-2 rounded-lg bg-black-100">
              <Text className="text-[#E7EE4F] font-pmedium">Settle Up</Text>
            </TouchableOpacity>

            <TouchableOpacity className="mx-3 border-2 border-black-200 border-dashed px-4 py-2 rounded-lg bg-black-100">
              <Text className="text-[#E7EE4F] font-pmedium">Balances</Text>
            </TouchableOpacity>
            <TouchableOpacity className="mx-3 border-2 border-black-200 border-dashed px-4 py-2 rounded-lg bg-black-100">
              <Text className="text-[#E7EE4F] font-pmedium">Total</Text>
            </TouchableOpacity>
            <TouchableOpacity className="mx-3 border-2 border-black-200 border-dashed px-4 py-2 rounded-lg bg-black-100">
              <Text className="text-[#E7EE4F] font-pmedium">Stats</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <ScrollView className="h-full mt-4">
          {bills &&
            bills.map((bill, ind) => (
              <BillList bill={bill} ind={ind} currUser={currUser} />
            ))}
        </ScrollView>
      </View>

      <View className="absolute bottom-8 left-0 right-0 flex items-center ">
        <TouchableOpacity onPress={() => setIsCreateModalVisible(true)}>
          <CirclePlus className="text-primary " size={72} fill="#E7EE4F" />
        </TouchableOpacity>
      </View>

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
