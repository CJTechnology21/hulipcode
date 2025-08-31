
  // field configuration
  export const fieldConfig = {
    "Payment In": ["amount", "mode", "date", "party", "proof", "notes"],
    "Payment Out": ["amount", "mode", "date", "party", "proof", "notes"],
    "Debit Note": ["party", "amount", "date", "mode", "notes"],
    "Credit Note": ["party", "amount", "date", "mode", "notes"],
    "Party to Party Payment": [
      "fromParty",
      "toParty",
      "amount",
      "mode",
      "date",
      "proof",
      "notes",
    ],
    "Sales Invoice": ["party", "amount", "date", "dueDate", "mode", "proof", "notes"],
    "Material Sales": ["party", "material", "quantity", "amount", "date", "mode", "notes"],
    "Material Purchase": ["vendor", "material", "quantity", "amount", "date", "mode", "proof", "notes"],
    "Material Return": ["vendor", "material", "quantity", "amount", "date", "mode", "notes"],
    "Material Transfer": ["fromLocation", "toLocation", "material", "quantity", "date", "mode", "notes"],
    "Sub Con Bill": ["vendor", "amount", "date", "mode", "proof", "notes"],
    "Other Expense": ["category", "amount", "mode", "date", "notes"],
    "I Paid": ["amount", "mode", "date", "notes"],
    "I Received": ["amount", "mode", "date", "notes"],
  };

  // map transaction type → category
  export const typeCategoryMap = {
    "Payment In": "Invoice",
    "Sales Invoice": "Invoice",
    "Material Sales": "Invoice",
    "I Received": "Invoice",
    "Payment Out": "Expense",
    "Material Purchase": "Expense",
    "Material Return": "Expense",
    "Material Transfer": "Expense",
    "Sub Con Bill": "Expense",
    "Other Expense": "Expense",
    "I Paid": "Expense",
    "Debit Note": "Adjustment",
    "Credit Note": "Adjustment",
    "Party to Party Payment": "Transfer",
  };

  // map type → button color

  export const typeColorMap = {
    "Payment In": "green",
    "I Received": "green",
    "Sales Invoice": "blue",
    "Material Sales": "blue",
    "Payment Out": "red",
    "I Paid": "red",
    "Material Purchase": "red",
    "Material Return": "red",
    "Material Transfer": "red",
    "Sub Con Bill": "red",
    "Other Expense": "red",
    "Debit Note": "blue",
    "Credit Note": "blue",
    "Party to Party Payment": "blue",
  };

  // normalize UI type → backend schema type
  export const normalizeTransactionType = (type) => {
  const map = {
    "Payment In": "PaymentIn",
    "Payment Out": "PaymentOut",
    "Debit Note": "DebitNote",
    "Credit Note": "CreditNote",
    "Party to Party Payment": "PartyToPartyPayment",
    "Sales Invoice": "SalesInvoice",
    "Material Sales": "MaterialSales",
    "Material Purchase": "MaterialPurchase",
    "Material Return": "MaterialReturn",
    "Material Transfer": "MaterialTransfer",
    "Sub Con Bill": "SubConBill",
    "Other Expense": "OtherExpense",
    "I Paid": "IPaid",
    "I Received": "IReceived",
  };
  return map[type] || type;
};

// // ----------------- constants -----------------
// // export const fieldConfig = {
// //   PaymentIn: ["amount", "mode", "date", "party", "proof", "notes"],
// //   PaymentOut: ["amount", "mode", "date", "party", "proof", "notes"],
// //   DebitNote: ["party", "amount", "date", "mode", "notes"],
// //   CreditNote: ["party", "amount", "date", "mode", "notes"],
// //   PartyToPartyPayment: [
// //     "fromParty",
// //     "toParty",
// //     "amount",
// //     "mode",
// //     "date",
// //     "proof",
// //     "notes",
// //   ],
// //   SalesInvoice: ["party", "amount", "date", "dueDate", "mode", "proof", "notes"],
// //   MaterialSales: ["party", "material", "quantity", "amount", "date", "mode", "notes"],
// //   MaterialPurchase: ["vendor", "material", "quantity", "amount", "date", "mode", "proof", "notes"],
// //   MaterialReturn: ["vendor", "material", "quantity", "amount", "date", "mode", "notes"],
// //   MaterialTransfer: ["fromLocation", "toLocation", "material", "quantity", "date", "mode", "notes"],
// //   SubConBill: ["vendor", "amount", "date", "mode", "proof", "notes"],
// //   OtherExpense: ["category", "amount", "mode", "date", "notes"],
// //   IPaid: ["amount", "mode", "date", "notes"],
// //   IReceived: ["amount", "mode", "date", "notes"],
// // };

// export const fieldConfig = {
//   "Payment In": ["amount", "mode", "date", "party", "proof", "notes"],
//   "Payment Out": ["amount", "mode", "date", "party", "proof", "notes"],
//   "Debit Note": ["party", "amount", "date", "mode", "notes"],
//   "Credit Note": ["party", "amount", "date", "mode", "notes"],
//   "Party to Party Payment": [
//     "fromParty",
//     "toParty",
//     "amount",
//     "mode",
//     "date",
//     "proof",
//     "notes",
//   ],
//   "Sales Invoice": ["party", "amount", "date", "dueDate", "mode", "proof", "notes"],
//   "Material Sales": ["party", "material", "quantity", "amount", "date", "mode", "notes"],
//   "Material Purchase": ["vendor", "material", "quantity", "amount", "date", "mode", "proof", "notes"],
//   "Material Return": ["vendor", "material", "quantity", "amount", "date", "mode", "notes"],
//   "Material Transfer": ["fromLocation", "toLocation", "material", "quantity", "date", "mode", "notes"],
//   "Sub Con Bill": ["vendor", "amount", "date", "mode", "proof", "notes"],
//   "Other Expense": ["category", "amount", "mode", "date", "notes"],
//   "I Paid": ["amount", "mode", "date", "notes"],
//   "I Received": ["amount", "mode", "date", "notes"],
// };

// export const typeTransactionMap = {
//   "Payment In": { transactionType: "PaymentIn", category: "Payment" },
//   "Payment Out": { transactionType: "PaymentOut", category: "Expense" },
//   "Debit Note": { transactionType: "DebitNote", category: "Expense" },
//   "Credit Note": { transactionType: "CreditNote", category: "Expense" },
//   "Party to Party Payment": { transactionType: "PartyToPartyPayment", category: "Expense" },
//   "Sales Invoice": { transactionType: "SalesInvoice", category: "Sales" },
//   "Material Sales": { transactionType: "MaterialSales", category: "Sales" },
//   "Material Purchase": { transactionType: "MaterialPurchase", category: "Expense" },
//   "Material Return": { transactionType: "MaterialReturn", category: "Expense" },
//   "Material Transfer": { transactionType: "MaterialTransfer", category: "Expense" },
//   "Sub Con Bill": { transactionType: "SubConBill", category: "Expense" },
//   "Other Expense": { transactionType: "OtherExpense", category: "Expense" },
//   "I Paid": { transactionType: "IPaid", category: "Expense" },
//   "I Received": { transactionType: "IReceived", category: "MyAccount" },
// };

// export const typeColorMap = {
//   "Payment In": "green",
//   "I Received": "green",
//   "Sales Invoice": "blue",
//   "Material Sales": "blue",
//   "Payment Out": "red",
//   "I Paid": "red",
//   "Material Purchase": "red",
//   "Material Return": "red",
//   "Material Transfer": "red",
//   "Sub Con Bill": "red",
//   "Other Expense": "red",
//   "Debit Note": "blue",
//   "Credit Note": "blue",
//   "Party to Party Payment": "blue",
// };
