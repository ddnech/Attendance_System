export const plural = (count, word, many = `${word}s`) => `${count} ${count === 1 ? word : many}`;
