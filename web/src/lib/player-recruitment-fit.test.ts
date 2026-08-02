import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildTeamRecruitmentContext,
  scorePlayerRecruitmentFit,
} from "./player-recruitment-fit";

const baseTeam = buildTeamRecruitmentContext(
  {
    games: ["VALORANT"],
    region: "NA East",
    school: "UC Berkeley",
    rosterSize: 8,
  },
  [
    {
      membershipId: "1",
      userId: "u1",
      role: "player",
      joinedAt: new Date(),
      email: null,
      displayName: null,
      handle: "A",
      game: "VALORANT",
      roleInGame: "Controller",
      rank: "Diamond",
      school: null,
      hoursPerWeek: 20,
      playerProfileId: "p1",
      clerkId: "c1",
    },
  ],
);

describe("scorePlayerRecruitmentFit", () => {
  it("returns zero when game not on org", () => {
    const fit = scorePlayerRecruitmentFit(baseTeam, {
      game: "Rocket League",
      role: "Striker",
      rank: "Grand Champion",
      region: "NA East",
      school: "UC Berkeley",
      status: "Available",
      tags: [],
      hoursPerWeek: 24,
    });
    assert.equal(fit.score, 0);
    assert.match(fit.reason, /not on your org titles/i);
  });

  it("scores high for role gap, rank band, and campus match", () => {
    const fit = scorePlayerRecruitmentFit(baseTeam, {
      game: "VALORANT",
      role: "Duelist",
      rank: "Diamond",
      region: "NA East",
      school: "UC Berkeley",
      status: "Available",
      tags: [],
      hoursPerWeek: 28,
    });
    assert.ok(fit.score >= 85, `expected high fit, got ${fit.score}`);
    assert.ok(fit.reasons.some((r) => /duelist/i.test(r)));
  });

  it("returns zero when org has no competitive titles set", () => {
    const noTitles = buildTeamRecruitmentContext(
      {
        games: [],
        region: "NA East",
        school: null,
        rosterSize: 8,
      },
      [],
    );
    const fit = scorePlayerRecruitmentFit(noTitles, {
      game: "VALORANT",
      role: "Duelist",
      rank: "Diamond",
      region: "NA East",
      school: null,
      status: "Available",
      tags: [],
      hoursPerWeek: 20,
    });
    assert.equal(fit.score, 0);
    assert.match(fit.reason, /competitive titles/i);
  });

  it("lowers score when roster role already filled", () => {
    const crowded = buildTeamRecruitmentContext(
      {
        games: ["VALORANT"],
        region: "NA East",
        school: null,
        rosterSize: 10,
      },
      [
        {
          membershipId: "1",
          userId: "u1",
          role: "player",
          joinedAt: new Date(),
          email: null,
          displayName: null,
          handle: "A",
          game: "VALORANT",
          roleInGame: "Duelist",
          rank: "Immortal",
          school: null,
          hoursPerWeek: 20,
          playerProfileId: "p1",
          clerkId: "c1",
        },
        {
          membershipId: "2",
          userId: "u2",
          role: "player",
          joinedAt: new Date(),
          email: null,
          displayName: null,
          handle: "B",
          game: "VALORANT",
          roleInGame: "Duelist",
          rank: "Immortal",
          school: null,
          hoursPerWeek: 22,
          playerProfileId: "p2",
          clerkId: "c2",
        },
      ],
    );

    const fit = scorePlayerRecruitmentFit(crowded, {
      game: "VALORANT",
      role: "Duelist",
      rank: "Immortal",
      region: "NA East",
      school: null,
      status: "Available",
      tags: [],
      hoursPerWeek: 20,
    });
    assert.ok(fit.breakdown.role < 55);
  });
});
