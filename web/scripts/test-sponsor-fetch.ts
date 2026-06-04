import { fetchSponsorsForDisplay } from "../src/lib/fetch-sponsors";

async function main() {
  const result = await fetchSponsorsForDisplay();
  console.log("source:", result.source);
  console.log("count:", result.sponsors.length);
  if (result.error) console.log("error:", result.error);
  if (result.sponsors[0]) console.log("first:", result.sponsors[0].name);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
