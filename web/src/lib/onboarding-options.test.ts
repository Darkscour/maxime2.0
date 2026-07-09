import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getRanksForGame, isPrimaryGame } from "./onboarding-options";

describe("getRanksForGame", () => {
  it("returns Fortnite ranked tiers for Fortnite", () => {
    assert.equal(isPrimaryGame("Fortnite"), true);
    assert.deepEqual(getRanksForGame("Fortnite"), [
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Elite",
      "Champion",
      "Unreal",
    ]);
  });

  it("returns empty list for unsupported games", () => {
    assert.deepEqual(getRanksForGame("Apex Legends"), []);
  });
});
