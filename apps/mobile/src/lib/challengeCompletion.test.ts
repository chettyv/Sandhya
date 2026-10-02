import { beforeEach, describe, expect, it, vi } from "vitest";

const rpc = vi.fn();

vi.mock("./supabase", () => ({
  supabase: { rpc },
}));

const { completeChallengeNight } = await import("./challenges");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("completeChallengeNight", () => {
  it("treats a new or idempotent server completion as success", async () => {
    rpc.mockResolvedValueOnce({ data: { status: "completed" }, error: null });
    await expect(completeChallengeNight("challenge-id", 3)).resolves.toBe(true);
    expect(rpc).toHaveBeenCalledWith("complete_challenge_night", {
      p_challenge_id: "challenge-id",
      p_night: 3,
    });

    rpc.mockResolvedValueOnce({ data: { status: "already_completed" }, error: null });
    await expect(completeChallengeNight("challenge-id", 3)).resolves.toBe(true);
  });

  it.each(["auth_required", "not_joined", "not_found", "locked", "invalid_request"])(
    "maps %s to a non-recorded result",
    async (status) => {
      rpc.mockResolvedValue({ data: { status }, error: null });
      await expect(completeChallengeNight("challenge-id", 3)).resolves.toBe(false);
    },
  );

  it("surfaces transport and unexpected server errors for the route to retry", async () => {
    rpc.mockResolvedValueOnce({ data: null, error: { message: "temporary outage" } });
    await expect(completeChallengeNight("challenge-id", 3)).rejects.toThrow("temporary outage");

    rpc.mockResolvedValueOnce({ data: { status: "unexpected" }, error: null });
    await expect(completeChallengeNight("challenge-id", 3)).rejects.toThrow("unknown status");
  });
});
