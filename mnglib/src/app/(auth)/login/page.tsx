import type { Metadata } from "next";

import { LoginContainer } from "@features/auth";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return <LoginContainer />;
}
