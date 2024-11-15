export function formatDateStr(dateStr: string): string {
    const date = new Date(dateStr);

    return  date.toLocaleString('en-US', {
        year: 'numeric', // "2024"
        month: 'long',   // "November"
        day: 'numeric',  // "11"
        hour: 'numeric', // "11"
        minute: 'numeric', // "43"
        second: 'numeric', // "36"
        hour12: false,
    });
}