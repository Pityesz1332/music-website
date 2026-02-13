export const formatTime = (seconds: number): string => {
    if (seconds == null || isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${min}:${secs.toString().padStart(2, "0")}`;
};