import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { Page, PrimaryButton, SecondaryButton } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/tokens";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [emailMode, setEmailMode] = useState<"password" | "link">("password");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmationPending, setConfirmationPending] = useState(false);
  const redirectTo = Linking.createURL("/auth/callback");

  const requireClient = () => {
    if (supabase) return true;
    Alert.alert(
      "Connect Supabase first",
      "Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to enable secure sign-in.",
    );
    return false;
  };

  const submitPasswordAuth = async () => {
    if (!email.trim() || !password || !requireClient() || !supabase) return;
    if (authMode === "sign-up" && password !== confirmPassword) {
      Alert.alert("Passwords do not match", "Enter the same password in both fields.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Choose a stronger password", "Use at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const result =
        authMode === "sign-up"
          ? await supabase.auth.signUp({
              email: email.trim(),
              password,
              options: { emailRedirectTo: redirectTo },
            })
          : await supabase.auth.signInWithPassword({ email: email.trim(), password });

      if (result.error) {
        Alert.alert(
          authMode === "sign-up" ? "Could not create account" : "Could not sign in",
          result.error.message,
        );
        return;
      }
      if (authMode === "sign-up" && !result.data.session) {
        setConfirmationPending(true);
        setMessage(
          `We sent a confirmation link to ${email.trim()}. Open it on this device to finish creating your account.`,
        );
        return;
      }
      setConfirmationPending(false);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        authMode === "sign-up" ? "Could not create account" : "Could not sign in",
        errorMessage(error, "The account service could not be reached. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const sendLink = async () => {
    if (!email.trim() || !requireClient() || !supabase) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: redirectTo },
      });
      if (error) Alert.alert("Could not send the link", error.message);
      else {
        setConfirmationPending(false);
        setMessage(
          `We sent a secure sign-in link to ${email.trim()}. Open it on this device to continue.`,
        );
      }
    } catch (error) {
      Alert.alert(
        "Could not send the link",
        errorMessage(error, "The email service could not be reached. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async () => {
    if (!email.trim() || !requireClient() || !supabase) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });
      if (error) Alert.alert("Could not send reset email", error.message);
      else {
        setConfirmationPending(false);
        setMessage(`We sent password-reset instructions to ${email.trim()}.`);
      }
    } catch (error) {
      Alert.alert(
        "Could not send reset email",
        errorMessage(error, "The email service could not be reached. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmation = async () => {
    if (!email.trim() || !requireClient() || !supabase) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: { emailRedirectTo: redirectTo },
      });
      if (error) {
        Alert.alert("Could not resend confirmation", error.message);
        return;
      }
      setMessage(`We sent a new confirmation link to ${email.trim()}.`);
    } catch (error) {
      Alert.alert(
        "Could not resend confirmation",
        errorMessage(error, "The email service could not be reached. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const socialSignIn = async (provider: "apple" | "google") => {
    if (!requireClient() || !supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error || !data.url) {
        Alert.alert("Sign-in unavailable", error?.message ?? "The provider is not configured yet.");
        return;
      }
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type === "success" && result.url) {
        const parsed = Linking.parse(result.url);
        const providerError =
          typeof parsed.queryParams?.error_description === "string"
            ? parsed.queryParams.error_description
            : typeof parsed.queryParams?.error === "string"
              ? parsed.queryParams.error
              : null;
        if (providerError) {
          Alert.alert("Sign-in unavailable", providerError);
          return;
        }
        const code = typeof parsed.queryParams?.code === "string" ? parsed.queryParams.code : null;
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) Alert.alert("Sign-in unavailable", exchangeError.message);
          else router.replace("/(tabs)");
        } else {
          Alert.alert("Sign-in unavailable", "The provider did not return a secure sign-in code.");
        }
      }
    } catch (error) {
      Alert.alert(
        "Sign-in unavailable",
        errorMessage(error, "The sign-in provider could not be reached. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const errorMessage = (error: unknown, fallback: string): string =>
    error instanceof Error && error.message.trim() ? error.message : fallback;

  if (message) {
    return (
      <Page>
        <View className="items-center px-4 py-16">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-sageSoft">
            <Ionicons name="mail-open-outline" size={32} color={colors.sage} />
          </View>
          <Text className="mt-6 text-center text-2xl font-semibold text-ink">Check your email</Text>
          <Text className="mt-2 max-w-sm text-center text-[15px] leading-6 text-muted">
            {message}
          </Text>
          {confirmationPending ? (
            <View className="mt-6 w-full max-w-sm">
              <SecondaryButton
                label={loading ? "Sending confirmation…" : "Resend confirmation email"}
                icon="mail-outline"
                disabled={loading}
                onPress={() => void resendConfirmation()}
              />
            </View>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setMessage(null);
              setConfirmationPending(false);
            }}
            className="mt-6 p-3"
          >
            <Text className="font-semibold text-saffron">Use another email</Text>
          </Pressable>
        </View>
      </Page>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Page>
        <View className="items-center pb-8 pt-5">
          <View className="h-20 w-20 items-center justify-center rounded-[26px] bg-aubergine">
            <Ionicons name="sunny" size={34} color={colors.gold} />
          </View>
          <Text className="mt-5 text-center text-[28px] font-semibold text-ink">
            Keep your journey with you
          </Text>
          <Text className="mt-2 max-w-sm text-center text-[15px] leading-6 text-muted">
            Sync saved teachings, journal entries, preferences, and conversations securely across
            devices.
          </Text>
        </View>

        <View className="gap-3">
          <SecondaryButton
            label="Continue with Apple"
            icon="logo-apple"
            onPress={() => void socialSignIn("apple")}
          />
          <SecondaryButton
            label="Continue with Google"
            icon="logo-google"
            onPress={() => void socialSignIn("google")}
          />
        </View>
        <View className="my-6 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-[#302C25]" />
          <Text className="text-xs font-medium uppercase tracking-wider text-muted">or email</Text>
          <View className="h-px flex-1 bg-[#302C25]" />
        </View>
        <Text className="mb-2 text-sm font-semibold text-ink">Email address</Text>
        <TextInput
          accessibilityLabel="Email address"
          value={email}
          onChangeText={setEmail}
          maxLength={320}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor="#9A8E9B"
          className="h-14 rounded-lg border border-[#302C25] bg-surface px-4 text-[16px] text-ink"
        />
        {emailMode === "password" ? (
          <>
            <Text className="mb-2 mt-4 text-sm font-semibold text-ink">Password</Text>
            <TextInput
              accessibilityLabel="Password"
              value={password}
              onChangeText={setPassword}
              maxLength={128}
              secureTextEntry
              autoCapitalize="none"
              autoComplete={authMode === "sign-up" ? "new-password" : "password"}
              placeholder="At least 8 characters"
              placeholderTextColor="#9A8E9B"
              className="h-14 rounded-lg border border-[#302C25] bg-surface px-4 text-[16px] text-ink"
            />
            {authMode === "sign-up" ? (
              <TextInput
                accessibilityLabel="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                maxLength={128}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                placeholder="Confirm password"
                placeholderTextColor="#9A8E9B"
                className="mt-3 h-14 rounded-lg border border-[#302C25] bg-surface px-4 text-[16px] text-ink"
              />
            ) : null}
            <View className="mt-3 flex-row items-center justify-between">
              <Pressable
                accessibilityRole="button"
                onPress={() => setAuthMode(authMode === "sign-in" ? "sign-up" : "sign-in")}
                className="p-1"
              >
                <Text className="text-sm font-semibold text-saffron">
                  {authMode === "sign-in" ? "Create an account" : "I already have an account"}
                </Text>
              </Pressable>
              {authMode === "sign-in" ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void sendPasswordReset()}
                  className="p-1"
                >
                  <Text className="text-sm font-semibold text-muted">Forgot password?</Text>
                </Pressable>
              ) : null}
            </View>
          </>
        ) : null}
        <View className="mt-4">
          {loading ? (
            <View className="h-12 items-center justify-center">
              <ActivityIndicator color={colors.saffron} />
            </View>
          ) : (
            <PrimaryButton
              label={
                emailMode === "link"
                  ? "Email me a secure link"
                  : authMode === "sign-up"
                    ? "Create account"
                    : "Sign in"
              }
              icon="arrow-forward"
              disabled={!email.trim() || (emailMode === "password" && !password)}
              onPress={() => void (emailMode === "link" ? sendLink() : submitPasswordAuth())}
            />
          )}
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => setEmailMode(emailMode === "password" ? "link" : "password")}
          className="mt-3 items-center p-2"
        >
          <Text className="text-sm font-semibold text-muted">
            {emailMode === "password"
              ? "Use a secure email link instead"
              : "Use a password instead"}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          className="mt-4 items-center p-3"
        >
          <Text className="font-semibold text-muted">Continue as guest</Text>
        </Pressable>
        <Pressable accessibilityRole="link" onPress={() => router.push("/legal")} className="mt-6">
          <Text className="text-center text-xs leading-5 text-muted">
            By continuing, you agree to the Terms and Privacy Policy. Sandhya never sells private
            journal content.
          </Text>
        </Pressable>
      </Page>
    </KeyboardAvoidingView>
  );
}
