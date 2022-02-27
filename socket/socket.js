import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { findKOLsByID } from "../model/kols.model";
import { findBrandsByID } from "../model/brands.model";
export default (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    next(err);
                } else {
                    const user = await findKOLsByID(decoded.id);
                    if (user) {
                        socket.userId = user.id;
                        next();
                    }
                }
            }
        );
    });

    io.on("connection", (socket) => {
            socket.join("u/" + socket.userId);
        }
    );
};