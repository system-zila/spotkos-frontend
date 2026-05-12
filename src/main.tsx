import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App"; // Import default yang benar
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./styles/index.css";

// Hapus komentar pada 2 baris di bawah jika file CSS-nya memang Anda gunakan:
// import "./styles/tailwind.css";
// import "./styles/theme.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="702755393652-lvnltg864okuo3k4ari3cankv12djad0.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);