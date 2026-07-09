import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  resolveEffectiveAuthIntent,
  pathForUnregisteredSession,
} from "./auth-intent";

describe("resolveEffectiveAuthIntent", () => {
  it("treats explicit Maxime sign-up as sign-up", () => {
    assert.equal(
      resolveEffectiveAuthIntent("sign-up", "sign-up", true),
      "sign-up",
    );
    assert.equal(resolveEffectiveAuthIntent("sign-up", null, true), "sign-up");
  });

  it("never lets sign-in URLs become sign-up even with a stale sign-up cookie", () => {
    assert.equal(
      resolveEffectiveAuthIntent("sign-in", "sign-up", false),
      "sign-in",
    );
  });

  it("treats Clerk bare sign-up redirects as sign-in when session is sign-in", () => {
    assert.equal(
      resolveEffectiveAuthIntent("sign-up", "sign-in", false),
      "sign-in",
    );
  });

  it("defaults unconfirmed sign-up URLs to sign-in", () => {
    assert.equal(resolveEffectiveAuthIntent("sign-up", null, false), "sign-in");
  });
});

describe("pathForUnregisteredSession", () => {
  it("sends sign-in users without a profile to the no-account page", () => {
    assert.equal(
      pathForUnregisteredSession({
        sessionIntent: "sign-in",
        signupPending: false,
        hasPlatformShell: false,
      }),
      "/auth/no-maxime-account",
    );
  });

  it("does not auto-sign-up users from a stale sign-up cookie alone", () => {
    assert.equal(
      pathForUnregisteredSession({
        sessionIntent: "sign-up",
        signupPending: false,
        hasPlatformShell: false,
      }),
      "/auth/no-maxime-account",
    );
  });

  it("keeps explicit sign-up confirmation behavior for unregistered users", () => {
    assert.equal(
      pathForUnregisteredSession({
        sessionIntent: "sign-in",
        signupPending: true,
        hasPlatformShell: false,
      }),
      "/auth/continue?intent=sign-up&maxime_signup=1",
    );
  });
});
