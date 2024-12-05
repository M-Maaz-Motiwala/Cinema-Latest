// src/middleware/showtimeValidation.js
import Showtime from '../models/Showtime.js';

export const checkShowtimeConflictMiddleware = async (req, res, next) => {
    const { hallId, date, time, movieDuration } = req.body;

    const existingShowtimes = await Showtime.find({ hallId, date });
    const [newShowStart, newShowEnd] = [
        new Date(`${date}T${time}`),
        new Date(new Date(`${date}T${time}`).getTime() + movieDuration * 60000),
    ];

    for (const show of existingShowtimes) {
        const showStart = new Date(`${date}T${show.time}`);
        const showEnd = new Date(showStart.getTime() + show.movieId.duration * 60000);

        if (!(newShowEnd <= showStart || newShowStart >= showEnd)) {
            return res.status(400).json({ message: 'Hall is not available at the selected time' });
        }
    }

    next();
};
