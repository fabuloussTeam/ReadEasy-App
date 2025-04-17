// Lirre a la une
export const getRandomBooks = (books, count) => {
    const shuffled = books.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

