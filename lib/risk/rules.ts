import type { EventType } from "@/lib/types";

export interface RuleDefinition {
  code: string;
  points: number;
  explanation: string;
  appliesTo?: EventType[];
}

export const riskRules: RuleDefinition[] = [
  {
    code: "FAILED_LOGIN_VELOCITY",
    points: 20,
    explanation: "More than five failed login events occurred in the last 15 minutes."
  },
  {
    code: "NEW_DEVICE_PAYMENT",
    points: 20,
    explanation: "A payment attempt happened immediately after a new device appeared.",
    appliesTo: ["payment_attempt", "new_device_payment", "high_value_transfer"]
  },
  {
    code: "NEW_DEVICE_HIGH_VALUE",
    points: 30,
    explanation: "A new device initiated a high-value payment above the normal baseline.",
    appliesTo: ["new_device_payment", "high_value_transfer"]
  },
  {
    code: "AMOUNT_5X_BASELINE",
    points: 20,
    explanation: "The amount is at least five times above the entity baseline."
  },
  {
    code: "SHARED_IP_MULTIPLE_ACCOUNTS",
    points: 20,
    explanation: "The IP address is associated with multiple accounts in the demo event store."
  },
  {
    code: "CHARGEBACK_HISTORY",
    points: 25,
    explanation: "The entity has previous chargeback evidence linked to the account."
  },
  {
    code: "IMPOSSIBLE_TRAVEL",
    points: 30,
    explanation: "Location sequence indicates impossible travel.",
    appliesTo: ["impossible_travel"]
  },
  {
    code: "REFUND_CLUSTER",
    points: 20,
    explanation: "Multiple refund requests clustered around the same account or card.",
    appliesTo: ["refund_requested", "suspicious_refund_cluster"]
  },
  {
    code: "API_ABUSE_SPIKE",
    points: 25,
    explanation: "API activity exceeded the safe velocity threshold.",
    appliesTo: ["api_abuse"]
  },
  {
    code: "PASSWORD_RESET_TO_HIGH_VALUE_PAYMENT",
    points: 25,
    explanation: "A password reset was followed by a high-value payment."
  },
  {
    code: "COUNTRY_MISMATCH",
    points: 15,
    explanation: "Country differs from the account's expected operating region."
  },
  {
    code: "PROXY_OR_TOR_SIGNAL",
    points: 15,
    explanation: "Demo metadata indicates a proxy-like or Tor-like network path."
  }
];
