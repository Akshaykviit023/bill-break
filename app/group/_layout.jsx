import { Stack } from "expo-router";

export default function GroupLayout() {
  return (
    <Stack>
      <Stack.Screen name="[groupId]" options={{ headerShown: false }} />
    </Stack>
  );
}
