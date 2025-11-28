import { DateTime } from "luxon";

const start = "09/22/2025";
const end   = "01/22/2026";

const startDate = DateTime.fromFormat(start, "MM/dd/yyyy");
const endDate   = DateTime.fromFormat(end, "MM/dd/yyyy");

console.log("Start valid:", startDate.isValid, startDate.toISO());
console.log("End valid:", endDate.isValid, endDate.toISO());
