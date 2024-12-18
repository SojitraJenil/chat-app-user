import AuthWhatsapp from "@/component/auth/AuthWhatsapp";
import { Inter } from "next/font/google";
import { useState } from "react";
import Layout from "@/component/layout/Layout";
import Login from "@/component/login/login";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isToken, setIsToken] = useState(false);

  return (
    <div className={`min-h-screen ${inter.className} relative`}>
      <div className="pb-16">
        {isToken ?
          <Layout>
            <Login />
          </Layout>
          :
          <AuthWhatsapp />
        }
      </div>
    </div>
  );
}
