export function formatDateTimeToYYYYMMDDHHMM(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0'); // Day of the month
    const hours = String(date.getHours()).padStart(2, '0'); // Hours
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutes
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  