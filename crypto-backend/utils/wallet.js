import crypto from "crypto";

const ADDRESS_PREFIXES = {
  BTC: "1",
  ETH: "0x",
  SOL: "",
  USDT: "0x",
  BNB: "0x",
  XRP: "r",
  ADA: "addr1",
  DOT: "1",
  LTC: "L",
  AVAX: "0x",
};

const generateMockAddress = (asset) => {
  const prefix = ADDRESS_PREFIXES[asset] ?? "";
  const random = crypto.randomBytes(20).toString("hex");
  return `${prefix}${random}`;
};

export { generateMockAddress };
