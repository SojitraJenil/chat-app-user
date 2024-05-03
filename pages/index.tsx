import { Inter } from "next/font/google";
import Join from "@/component/join/join";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={` ${inter.className}`}>
        <Join />
    </div>
  );
}
