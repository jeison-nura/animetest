"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authApi } from "../api/auth-api";
import { LoginForm, type LoginFormData } from "./login-form";

function LoginContainer() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: LoginFormData) {
    setError(null);

    try {
      await authApi.login(data.email, data.password);
      router.replace("/home");
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  }

  return <LoginForm onSubmit={handleSubmit} error={error} />;
}

export { LoginContainer };
