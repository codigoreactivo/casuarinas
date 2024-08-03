import { Inter } from "next/font/google";
import "../styles/globals.css";
import NavBar from "./components/NavBar";
import { Montserrat } from 'next/font/google';

const bebas_neue = Montserrat({
  subsets: ['latin'],
  weight: ["400"],
  variable: '--font-bebas-neue',
});

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Casurinas Grupo",
  description: "Lotes en venta en Casuarinas Grupo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body id="main" className={bebas_neue.className}>

        <main > <NavBar />

        </main>
        {children}
      </body>
    </html>
  );
}
