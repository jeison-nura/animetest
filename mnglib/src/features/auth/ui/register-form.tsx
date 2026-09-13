"use client";

import { useMemo, useState, type FormEvent } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@/shared/ui";

export type RegisterFormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

type RegisterFormProps = {
  onSubmit?: (
    data: Omit<RegisterFormData, "confirmPassword">
  ) => void | Promise<void>;
  error?: string | null;
};

type FormErrors = Partial<Record<keyof RegisterFormData, string>>;

function validate(data: RegisterFormData): FormErrors {
  const errors: FormErrors = {};

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!/^[a-zA-Z0-9_]{3,24}$/.test(data.username)) {
    errors.username =
      "Use 3-24 characters with letters, numbers or underscores.";
  }

  if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

function RegisterForm({ onSubmit, error }: RegisterFormProps) {
  const [form, setForm] = useState<RegisterFormData>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isPending, setIsPending] = useState(false);
  const errors = useMemo(() => validate(form), [form]);

  function updateField(name: keyof RegisterFormData, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsPending(true);
    try {
      const { confirmPassword: _confirmPassword, ...registrationData } = form;
      await onSubmit?.(registrationData);
    } finally {
      setIsPending(false);
    }
  }

  function FieldError({ name }: { name: keyof RegisterFormData }) {
    const message = errors[name];

    if (!message) return null;

    return (
      <p role="alert" className="text-xs text-red-400">
        {message}
      </p>
    );
  }

  return (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          Join to track anime, manga and your progress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
              required
            />
            <FieldError name="email" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              name="username"
              placeholder="anime_senpai"
              autoComplete="username"
              value={form.username}
              onChange={(event) => updateField("username", event.target.value)}
              aria-invalid={Boolean(errors.username)}
              required
            />
            <FieldError name="username" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              aria-invalid={Boolean(errors.password)}
              required
            />
            <FieldError name="password" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(event) =>
                updateField("confirmPassword", event.target.value)
              }
              aria-invalid={Boolean(errors.confirmPassword)}
              required
            />
            <FieldError name="confirmPassword" />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating account..." : "Create account"}
          </Button>
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export { RegisterForm };
