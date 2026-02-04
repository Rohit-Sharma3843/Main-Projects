import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"
import Signup from "@/components/signup"

export default async function SignupPage() {
  const { isAuthenticated } = getKindeServerSession()
  const auth = await isAuthenticated()

  if (auth) {
    redirect("/dashboard")
  }

  return <Signup />
}