import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NotificationPreferences } from "@/components/NotificationPreferences";

export const metadata = {
  title: "Notifications",
  description:
    "Choose what MatchHub tells you about: goal alerts for your favourite team and match start reminders.",
};

export default function NotificationsPage() {
  return (
    <>
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="container-page min-h-[calc(100vh-3.5rem)] py-6"
      >
        <NotificationPreferences />
      </main>
      <Footer />
    </>
  );
}
