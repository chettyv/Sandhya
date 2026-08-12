import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { Page, PrimaryButton } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { colors } from "@/theme/tokens";

export default function AuthCallbackScreen() {
  const {
    code,
    type,
    error: providerError,
    error_description: errorDescription,
  } = useLocalSearchParams<{
    code?: string | string[];
    type?: string | string[];
    error?: string | string[];
    error_description?: string | string[];
  }>();
  const router = useRouter();
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const handledCode = useRef<string | null>(null);
  const normalizedCode = firstParam(code);
  const normalizedType = firstParam(type);
  const normalizedProviderError = firstParam(providerError);
  const normalizedErrorDescription = firstParam(errorDescription);

  useEffect(() => {
    if (normalizedProviderError || normalizedErrorDescription) {
      setCallbackError(
        normalizedErrorDescription ??
          normalizedProviderError ??
          "The sign-in provider rejected the request.",
      );
      return;
    }
    if (!normalizedCode || !supabase) {
      setCallbackError("The sign-in link is incomplete or the app is not connected.");
      return;
    }
    if (handledCode.current === normalizedCode) return;
    handledCode.current = normalizedCode;
    void supabase.auth
      .exchangeCodeForSession(normalizedCode)
      .then(({ error: exchangeError }) => {
        if (exchangeError) setCallbackError(exchangeError.message);
        else router.replace(normalizedType === "recovery" ? "/reset-password" : "/(tabs)");
      })
      .catch(() => {
        setCallbackError("The secure sign-in service could not be reached. Please try again.");
      });
  }, [normalizedCode, normalizedProviderError, normalizedErrorDescription, normalizedType, router]);

  return (
    <Page>
      <View className="flex-1 items-center justify-center py-24">
        {callbackError ? (
          <>
            <Text className="text-center text-xl font-semibold text-ink">
              Sign-in could not be completed
            </Text>
            <Text className="my-4 text-center text-sm leading-5 text-muted">{callbackError}</Text>
            <PrimaryButton label="Return home" onPress={() => router.replace("/(tabs)")} />
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color={colors.saffron} />
            <Text className="mt-4 text-base font-semibold text-ink">
              Completing secure sign-in…
            </Text>
          </>
        )}
      </View>
    </Page>
  );
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
