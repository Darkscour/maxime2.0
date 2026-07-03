import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  accountRichness,
  isEmptyShellAccount,
  orphanPlaceholderClerkId,
  pickMergeTargets,
} from "./auth-user-reconcile";

function account(
  id: string,
  overrides: Partial<{
    onboardingComplete: boolean;
    accountType: string | null;
    accountTier: string | null;
    membership: unknown;
    playerProfile: unknown;
  }> = {},
) {
  return {
    id,
    onboardingComplete: false,
    accountType: null,
    accountTier: null,
    membership: null,
    playerProfile: null,
    ...overrides,
  };
}

describe("accountRichness", () => {
  it("prefers completed accounts with team or player data", () => {
    const shell = account("shell");
    const rich = account("rich", {
      accountType: "team_manager",
      accountTier: "collegiate",
      membership: { id: "m1" },
    });

    assert.ok(accountRichness(rich) > accountRichness(shell));
  });
});

describe("isEmptyShellAccount", () => {
  it("detects blank rows left from sign-in attempts", () => {
    assert.equal(isEmptyShellAccount(account("shell")), true);
    assert.equal(
      isEmptyShellAccount(account("started", { accountType: "player" })),
      false,
    );
  });
});

describe("pickMergeTargets", () => {
  it("keeps the email-linked account when the clerkId row is an empty shell", () => {
    const shell = account("shell");
    const rich = account("rich", {
      accountType: "team_manager",
      accountTier: "collegiate",
    });

    const { canonical, orphan } = pickMergeTargets(shell, rich);
    assert.equal(canonical.id, "rich");
    assert.equal(orphan.id, "shell");
  });

  it("keeps the clerkId row when it is richer than the email duplicate", () => {
    const byClerkId = account("clerk", {
      accountType: "player",
      playerProfile: { id: "p1" },
    });
    const byEmail = account("email", { accountType: "player" });

    const { canonical, orphan } = pickMergeTargets(byClerkId, byEmail);
    assert.equal(canonical.id, "clerk");
    assert.equal(orphan.id, "email");
  });
});

describe("orphanPlaceholderClerkId", () => {
  it("generates a unique detached clerkId for non-empty orphans", () => {
    assert.equal(orphanPlaceholderClerkId("abc"), "orphan:abc");
  });
});

describe("sign-in reconcile scenarios (pure logic)", () => {
  it("empty shell + rich email must delete shell before claiming clerkId", () => {
    const shell = account("shell");
    const rich = account("rich", {
      accountType: "team_manager",
      membership: { id: "team" },
    });

    const { canonical, orphan } = pickMergeTargets(shell, rich);
    assert.equal(isEmptyShellAccount(orphan), true);
    assert.equal(canonical.id, "rich");
    // Merge code deletes orphan shell before assigning clerkId to canonical.
  });

  it("clerkId-only meaningful account is considered onboarded", () => {
    const meaningful = account("user", {
      accountType: "player",
      playerProfile: { id: "profile" },
    });
    assert.equal(isEmptyShellAccount(meaningful), false);
    assert.ok(accountRichness(meaningful) > 0);
  });

  it("no progress account is not meaningful enough to be canonical over shell", () => {
    const shell = account("shell");
    const alsoShell = account("also-shell");
    const { canonical, orphan } = pickMergeTargets(shell, alsoShell);
    assert.equal(isEmptyShellAccount(canonical), true);
    assert.equal(isEmptyShellAccount(orphan), true);
  });
});
