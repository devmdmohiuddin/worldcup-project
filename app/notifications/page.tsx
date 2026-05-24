import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NotificationPreferences } from "@/components/NotificationPreferences";

export const metadata = {
  title: "Notifications",
  description:
    "Choose what FootballClean tells you about: goals, match start reminders, and prayer-time pings around kick-off.",
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
