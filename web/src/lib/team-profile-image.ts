export const MAX_PROFILE_IMAGE_BYTES = 700 * 1024;
export const TEAM_PROFILE_IMAGE_DATA_URL_PATTERN =
  /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+=*$/i;

export type TeamProfileImageValidationErrorCode =
  | "INVALID_IMAGE_FORMAT"
  | "PROFILE_IMAGE_TOO_LARGE";

export function estimateDataUrlBytes(dataUrl: string): number {
  const commaIndex = dataUrl.indexOf(",");
  if (commaIndex < 0) return dataUrl.length;
  const base64 = dataUrl.slice(commaIndex + 1);
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

export function validateTeamProfileImageDataUrl(
  imageUrl: string,
): TeamProfileImageValidationErrorCode | null {
  if (!TEAM_PROFILE_IMAGE_DATA_URL_PATTERN.test(imageUrl)) {
    return "INVALID_IMAGE_FORMAT";
  }
  if (estimateDataUrlBytes(imageUrl) > MAX_PROFILE_IMAGE_BYTES) {
    return "PROFILE_IMAGE_TOO_LARGE";
  }
  return null;
}

export function isLikelyTeamProfileImageUrl(imageUrl: string): boolean {
  const trimmed = imageUrl.trim();
  if (!trimmed) return false;
  if (/^https?:\/\//i.test(trimmed)) return true;
  return TEAM_PROFILE_IMAGE_DATA_URL_PATTERN.test(trimmed);
}
