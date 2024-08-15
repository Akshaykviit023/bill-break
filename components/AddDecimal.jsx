import { View, Text } from "react-native";
import { useState } from "react";
import FormField from "./FormField";
const AddDecimal = ({ membersObj }) => {
  const [amounts, setAmounts] = useState({});
  const handleAmountChange = (value, memberId) => {
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      [memberId]: value,
    }));
  };
  return (
    <View>
      {membersObj.map((item) => (
        <View
          key={item.id}
          className="flex flex-row justify-between items-center mt-4"
        >
          <Text className="text-gray-300 font-psemibold">
            {item.memberName}
          </Text>
          <FormField
            value={amounts[item.id] || ""}
            handleChangeText={(e) => handleAmountChange(e, item.id)}
            otherStyles="w-36"
            placeholder="0.00"
            inputType="numeric"
          />
        </View>
      ))}
    </View>
  );
};

export default AddDecimal;
