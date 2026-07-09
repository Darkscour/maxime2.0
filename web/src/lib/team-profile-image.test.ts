import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  estimateDataUrlBytes,
  isLikelyTeamProfileImageUrl,
  validateTeamProfileImageDataUrl,
} from "./team-profile-image";

describe("team profile image helpers", () => {
  it("accepts valid png data URLs", () => {
    const pngDataUrl = "data:image/png;base64,aGVsbG8=";
    assert.equal(validateTeamProfileImageDataUrl(pngDataUrl), null);
  });

  it("rejects invalid data URL format", () => {
    const invalidDataUrl = "data:text/plain;base64,aGVsbG8=";
    assert.equal(
      validateTeamProfileImageDataUrl(invalidDataUrl),
      "INVALID_IMAGE_FORMAT",
    );
  });

  it("rejects oversized data URL payload", () => {
    const bytes = "a".repeat(1_200 * 1024);
    const oversized = `data:image/webp;base64,${bytes}`;
    assert.equal(
      validateTeamProfileImageDataUrl(oversized),
      "PROFILE_IMAGE_TOO_LARGE",
    );
  });

  it("estimates bytes for a base64 payload", () => {
    assert.equal(estimateDataUrlBytes("data:image/png;base64,aGVsbG8="), 5);
  });

  it("accepts https image URLs for storage-backed uploads", () => {
    assert.equal(
      isLikelyTeamProfileImageUrl("https://example.com/team-image.webp"),
      true,
    );
  });
});
