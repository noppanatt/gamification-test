export const dateToStringDDMMYYYY = (date: Date | null | undefined) =>
  date
    ? date.toLocaleDateString("en-GB", {
        timeZone: "Asia/Bangkok",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

export const dateTimeToString = (date: Date | null | undefined) =>
  date
    ? date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";
