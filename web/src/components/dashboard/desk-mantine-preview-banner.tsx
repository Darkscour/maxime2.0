import Link from "next/link";
import type { DeskAudience } from "@/components/dashboard/desk-mantine";
import { DESK_AUDIENCE_LABEL } from "@/lib/desk-mantine-mock";

const ORDER: DeskAudience[] = [
  "manager_collegiate",
  "manager_grassroots",
  "player_collegiate",
  "player_grassroots",
];

export function DeskMantinePreviewBanner({ active }: { active: DeskAudience }) {
  return (
    <div className="md-preview-banner">
      <div>
        <strong style={{ marginRight: 6 }}>Preview</strong>
        <span style={{ color: "var(--md-text-muted)" }}>
          Design mock — no real data. Switch account type to compare:
        </span>
      </div>
      <div className="md-preview-pills">
        {ORDER.map((audience) => (
          <Link
            key={audience}
            href={`/preview/dashboard/${audience}`}
            className="md-preview-pill"
            data-active={audience === active ? "true" : "false"}
          >
            {DESK_AUDIENCE_LABEL[audience]}
          </Link>
        ))}
      </div>
    </div>
  );
}
