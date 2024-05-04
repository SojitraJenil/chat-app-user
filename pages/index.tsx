import Join from "@/component/join/joinWhatsapp";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={` ${inter.className}`}>
        <Join />
    </div>
  );
}
