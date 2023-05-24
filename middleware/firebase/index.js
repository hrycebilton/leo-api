import admin from '../../config/firebase-config.js';

class Middleware {
    async decodeToken(req, res, next) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decodeValue = await admin.auth().verifyIdToken(token);

            if (decodeValue) {
                return next();
            }
            return res.json({ message: "Unauthorized" });
        } catch (error) {
            return res.json({ message: "Internal error" });
        }
    }
}

export default Middleware;