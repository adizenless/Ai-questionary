import SubscriptionButton from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";

const SettingsPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div className="h-full p-4 space-y-2">
      <h3 className="text-lg font-medium">Настройки</h3>
      <div className="text-muted-foreground text-sm">
        {isPro ? "Вы сейчас на Pro плане." : "Вы сейчас на бесплатном плане."}
      </div>
      <SubscriptionButton isPro={isPro} />
    </div>
  );
};

export default SettingsPage;
