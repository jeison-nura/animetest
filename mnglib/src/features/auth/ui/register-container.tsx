"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authApi, type AuthApiError } from "../api/auth-api";
import { RegisterForm, type RegisterFormData } from "./register-form";

function RegisterContainer() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    data: Omit<RegisterFormData, "confirmPassword">
  ) {
    setError(null);

    try {
      await authApi.register(data.email, data.username, data.password);
      router.push("/login?registered=1");
    } catch (apiError) {
      const authError = apiError as AuthApiError;
      setError(authError.message ?? "Registration failed. Please try again.");
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <RegisterForm onSubmit={handleSubmit} error={error} />
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export { RegisterContainer };
