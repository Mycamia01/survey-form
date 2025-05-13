import "./globals.css";
import { AuthProvider } from "../components/AuthProvider";

export const metadata = {
  title: "CAMIA Survey Form",
  description: "Admin dashboard for sending surveys",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
