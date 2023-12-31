"use client"
import AddImage from "@components/AddImage"
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();
  return (
    <section className="w-full flex-center flex-col">
      {
        session?.user && <AddImage />
      }
    </section>
  )
}

export default Home