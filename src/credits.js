// In-memory credit store. Replace with a real database when needed.
export function createCreditStore(vouchers = { WELCOME100: 100 }) {
  const available = new Map(Object.entries(vouchers));
  const balances = new Map();

  return {
    claim(userId, code) {
      const amount = available.get(code);
      if (amount === undefined) return { ok: false, error: 'invalid_or_used_code' };
      available.delete(code);
      const balance = (balances.get(userId) ?? 0) + amount;
      balances.set(userId, balance);
      return { ok: true, amount, balance };
    },
    balance(userId) {
      return balances.get(userId) ?? 0;
    },
  };
}
