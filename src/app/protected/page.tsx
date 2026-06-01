import { getSession } from "@/sanity/utils/auth";
import { redirect } from "next/navigation";
import { getSignInPageEnabled } from "../../sanity/lib/pages";

export default async function Protected() {
  const session = await getSession();

  if (!session.isAuthenticated) {
    const signInEnabled = await getSignInPageEnabled();
    if (signInEnabled) {
      redirect("/sign-in");
    }
  }

  return (
    <main>
      <h1>🔒 Protected page</h1>
      <p>This page is password protected!</p>
    </main>
  );
}
