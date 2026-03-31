import { Link, useLocalSearchParams } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect } from "react";
import { Text, View } from "react-native";

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const posthog = usePostHog();

  useEffect(() => {
    // Only capture if id is valid
    if (typeof id !== "string") return;
    const subscriptionId = id.trim();
    if (!subscriptionId) return;
    posthog.capture("subscription_details_view", {
      subscription_id: subscriptionId,
    });
  }, [id, posthog]);

  return (
    <View>
      <Text>Subscription Details: {id ?? "Unknown"}</Text>
      <Link href="/">Go Back</Link>
    </View>
  );
};

export default SubscriptionDetails;
