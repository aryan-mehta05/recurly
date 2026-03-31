import images from "@/constants/images";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const posthog = usePostHog();
  const { resetSubscriptions } = useSubscriptionStore();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
      posthog.capture("user_signed_out");
      posthog.reset();
      resetSubscriptions();
    } catch (error) {
      console.error("Sign-out failed:", error);
      // Don't reset analytics if sign-out failed
      // Don't reset subscriptions if sign-out failed
      setIsSigningOut(false);
    }
  };

  const displayName =
    user?.firstName ||
    user?.fullName ||
    user?.emailAddresses[0]?.emailAddress ||
    "User";
  const email = user?.emailAddresses[0]?.emailAddress;

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-3xl font-sans-bold text-primary mb-6">
        Settings
      </Text>

      {/* User Profile Section */}
      <View className="auth-card mb-5">
        <View className="flex-row items-center gap-4 mb-4">
          <Image
            source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
            className="size-16 rounded-full"
          />
          <View className="flex-1">
            <Text className="text-lg font-sans-bold text-primary">
              {displayName}
            </Text>
            {email && (
              <Text className="text-sm font-sans-medium text-muted-foreground">
                {email}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Account Section */}
      <View className="auth-card mb-5">
        <Text className="text-base font-sans-semibold text-primary mb-3">
          Account
        </Text>
        <View className="gap-2">
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-sm font-sans-medium text-muted-foreground">
              Account ID
            </Text>
            <Text
              className="text-sm font-sans-medium text-primary"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user?.id
                ? user.id.length > 20
                  ? `${user.id.substring(0, 20)}...`
                  : user.id
                : "N/A"}
            </Text>
          </View>
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-sm font-sans-medium text-muted-foreground">
              Joined
            </Text>
            <Text className="text-sm font-sans-medium text-primary">
              {user?.createdAt ? user.createdAt.toLocaleDateString() : "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Sign Out Button */}
      <Pressable
        className={`auth-button bg-destructive ${isSigningOut ? "opacity-50" : ""}`}
        onPress={handleSignOut}
        disabled={isSigningOut}
      >
        <Text className="auth-button-text text-white">
          {isSigningOut ? "Signing Out..." : "Sign Out"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
