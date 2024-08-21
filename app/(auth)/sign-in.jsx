import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import axios from "axios";
import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../constants";

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}user/login`, {
        email: form.email,
        password: form.password,
      });
      //setUser(result);
      //setIsLogged(true);
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("userId", response.data.id);
      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View className="flex flex-row gap-1">
            <Text className="text-white text-3xl font-pbold">Bill</Text>
            <Text className="text-white text-3xl font-pbold rotate-6">
              Break
            </Text>
          </View>

          <Text className="text-xl font-semibold text-gray-300 mt-10 font-psemibold">
            Log in to Bill Break
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
