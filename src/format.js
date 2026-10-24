export const rupees = (paise) =>
  (paise / 100).toLocaleString("en-IN", { style: "currency", currency: "INR" });

export const toPaise = (value) => Math.round(parseFloat(value) * 100);