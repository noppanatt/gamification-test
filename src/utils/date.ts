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

export const dateToStringDDMMYYHHMM = (date: Date | null | undefined) => {
  if (!date) return "";

  const tzDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
  );

  const day = String(tzDate.getDate()).padStart(2, "0");
  const month = String(tzDate.getMonth() + 1).padStart(2, "0");
  const year = String(tzDate.getFullYear()).slice(-2);
  const hours = String(tzDate.getHours()).padStart(2, "0");
  const minutes = String(tzDate.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const dateWithoutTime = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const dateToStringYYYMMDD = (date: Date | null | undefined) => {
  if (!date) return "";

  const tzDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
  );

  const year = tzDate.getFullYear();
  const month = String(tzDate.getMonth() + 1).padStart(2, "0");
  const day = String(tzDate.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
};

export const addDay = (date: Date, numberOfDay: number) => {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return new Date(date.getTime() + numberOfDay * millisecondsPerDay);
};

export const dateWithoutTimeUTC = (date: Date) => {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
};
