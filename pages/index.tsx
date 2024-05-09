import Join from "@/component/join/joinWhatsapp";
import Maintenance from "@/component/maintenance/Maintenance";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={` ${inter.className}`}>
        <Join />
        {/* <Maintenance/> */}
    </div>
  );
}
