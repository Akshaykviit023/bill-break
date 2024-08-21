import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import FormField from "./FormField";

const AddDecimal = ({ membersObj, onAmountChange }) => {
  const [amounts, setAmounts] = useState({});

  const handleAmountChange = (value, memberId) => {
    const updatedAmounts = {
      ...amounts,
      [memberId]: parseFloat(value) || 0,
    };
    setAmounts(updatedAmounts);
    onAmountChange(updatedAmounts); // Call the callback function
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
            value={amounts[item.id]?.toString() || ""}
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
