import React, { useEffect } from "react";
import { VStack } from "native-base";
import { Link } from "native-base";
import { signIn, signOut, useSession } from "next-auth/react";
import Dashboard from "./dashboard";
// Start editing here, save and see your changes.
export default function App() {
  const { data: session, status } = useSession();
  useEffect(()=>{
    console.log("session", session)
  })
  return (
    <VStack>
      {status === "loading" && <p>Loading...</p>}
      {status === "unauthenticated" && (
        <p>
          Not signed in <Link onPress={() => signIn()}>Sign in</Link>
        </p>
      )}
      {status === "authenticated" && (
        <Dashboard/>
      )}

    </VStack>
  );
}
