import { Circle, CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { PASSWORD_RULE_KEYS, PASSWORD_RULES } from "@/lib/validators/auth";
import { cn } from "@/lib/utils/cn";

/** Live checklist of the password policy; each rule turns green once the password meets it. */
export function PasswordRequirements({ id, password }: { id: string; password: string }) {
  const t = useTranslations("auth.reset");

  return (
    <div id={id} className="rounded-lg border border-line bg-muted p-4">
      <p className="text-sm font-semibold text-ink">{t("requirementsTitle")}</p>
      <ul className="mt-2 space-y-1.5">
        {PASSWORD_RULE_KEYS.map((rule) => {
          const met = PASSWORD_RULES[rule](password);
          const Icon = met ? CircleCheck : Circle;
          return (
            <li
              key={rule}
              data-met={met}
              className={cn(
                "flex items-center gap-2 text-sm",
                met ? "text-success" : "text-ink-body",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {t(`rules.${rule}`)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
