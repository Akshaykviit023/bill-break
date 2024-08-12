import { Text, View, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { CustomButton } from "../../components";
import { useRouter } from "expo-router";
import CreateGroup from "../../components/CreateGroup";
import getInitials from "../../utils/getInitials";
import { useNavigation } from "@react-navigation/native";
import JoinGroup from "../../components/JoinGroup";

const Bookmark = () => {
  const [groups, setGroups] = useState([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
  const router = useRouter();

  const fetchOrganizations = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://192.168.29.201:3000/api/v1/groups/show-groups",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setGroups(response.data);
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
  const handleJoinModalClose = () => {
    setIsJoinModalVisible(false);
    fetchOrganizations(); // Re-fetch groups after closing the modal
  };

  const handleGroupPress = (groupId) => {
    router.push(`/group/${groupId}`);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="p-4 flex flex-col">
        <Text className="text-2xl text-white font-psemibold">Groups</Text>

        {/*   view to show total you owe   */}
        <View className="mt-4">
          <Text className="text-[#E7EE4F] text-lg font-psemibold">
            You are all settled up!
          </Text>
        </View>

        <View className="flex flex-col  mt-8">
          {groups.length > 0 ? (
            groups.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleGroupPress(item.id)} // Navigate to BillsScreen with groupId
                className="flex flex-row items-center bg-black-100 rounded-xl p-4 mt-3"
              >
                <View className="h-10 w-10 border border-solid border-[#E7EE4F] rounded-full flex justify-center items-center">
                  <Text className="text-white">
                    {getInitials(item.grpName)}
                  </Text>
                </View>
                <Text className="text-lg text-neutral-300 font-semibold ml-4">
                  {item.grpName}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No groups available</Text>
          )}
        </View>
        <View className="flex flex-col items-center mt-12">
          <CustomButton
            title="Create Group"
            handlePress={() => setIsCreateModalVisible(true)}
            containerStyles="w-full"
          />
        </View>

        <View className="flex flex-col items-center mt-4">
          <CustomButton
            title="Join Group"
            handlePress={() => setIsJoinModalVisible(true)}
            containerStyles="w-full"
          />
        </View>
      </View>

      <Modal
        visible={isCreateModalVisible}
        onRequestClose={handleCreateModalClose}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <CreateGroup onClose={handleCreateModalClose} />
      </Modal>

      <Modal
        visible={isJoinModalVisible}
        onRequestClose={handleJoinModalClose}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <JoinGroup onClose={handleJoinModalClose} />
      </Modal>
    </SafeAreaView>
  );
};

export default Bookmark;
