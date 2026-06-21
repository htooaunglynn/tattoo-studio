import Link from "next/link"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction, registerAction } from "@/lib/actions"

type AuthFormProps = {
  mode: "login" | "register"
  message?: string | null
}

export function AuthForm({ mode, message }: AuthFormProps) {
  const isRegister = mode === "register"

  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/90">
      <CardHeader>
        <CardTitle className="text-3xl uppercase">Tattoo-Studio</CardTitle>
        <CardDescription>
          {isRegister ? "Create a client account to book flash work." : "Sign in to manage your booking."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {message ? (
          <Alert className="mb-5 border-red-500/30 bg-red-500/10">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}
        <form action={isRegister ? registerAction : loginAction} className="space-y-4">
          {isRegister ? (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" autoComplete="name" required />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={8}
              required
            />
          </div>
          <Button className="w-full uppercase" type="submit">
            {isRegister ? "Register" : "Login"}
          </Button>
        </form>
        <p className="mt-5 text-sm text-muted-foreground">
          {isRegister ? "Already registered?" : "Need an account?"}{" "}
          <Link className="font-semibold text-primary underline-offset-4 hover:underline" href={isRegister ? "/login" : "/register"}>
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
