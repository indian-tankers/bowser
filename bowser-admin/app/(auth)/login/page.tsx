"use client"
import { useEffect, useState } from "react"
import { isAuthenticated, login } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn } from "lucide-react"
import Link from "next/link"
import Loading from "@/app/loading"
import { User } from "@/types"
import { useRouter } from 'next/navigation';

export const allowedRoutes: { [key: string]: [string] } = {
  Admin: ["/dashboard"],
  "Diesel Control Center Staff": ["/dashboard"],
  "Data Entry": ["/dispense-records"],
  "Loading Incharge": ["/loading/orders"],
  "BCC Authorized Officer": ["/loading/sheet"],
  "Petrol Pump Personnel": ["/loading/petrol-pump"],
  "Calibration Staff": ["/manage-bowsers"],
  "Diesel Average": ["/dispense-records"],
};

export default function Login() {
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      let user: User = JSON.parse(localStorage.getItem('adminUser')!);
      const redirectUrl = user.roles.map(role => allowedRoutes[role]).find(url => url) || ["/unauthorized"];
      console.log('Redirecting to:', redirectUrl);
      router.replace(redirectUrl[0]);
    } else {
      console.log('User is not authenticated');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await login(userId, password);
      if (response.user) {
        const redirectUrl = response.user.roles.map(role => allowedRoutes[role]).find(url => url) || ["/unauthorized"];
        router.push(redirectUrl[0]);
      } else {
        alert("Account not verified. Please contact an Admin to verify your account.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center bg-background min-h-screen">
      {loading && <Loading />}
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="items-center gap-4 grid w-full">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="userId">User ID</Label>
                <Input id="userId" placeholder="Enter your user ID" value={userId} onChange={(e) => setUserId(e.target.value)} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              <LogIn className="mr-2 w-4 h-4" /> Login
            </Button>
          </CardFooter>
        </form>
        <div className="my-4 text-center">
          <p>Don&apos;t have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign up</Link></p>
        </div>
      </Card>
    </div>
  )
}
