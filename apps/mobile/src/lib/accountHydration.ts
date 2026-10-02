export type AccountHydrationContext = {
  generation: number;
  userId: string | null;
};

export function createAccountHydrationGuard() {
  let generation = 0;
  let activeUserId: string | null = null;

  return {
    begin(userId: string | null): AccountHydrationContext {
      generation += 1;
      activeUserId = userId;
      return { generation, userId };
    },
    isCurrent(context: AccountHydrationContext): boolean {
      return context.generation === generation && context.userId === activeUserId;
    },
  };
}
