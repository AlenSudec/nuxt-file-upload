import jwt from "jsonwebtoken";
import { createError } from "h3";

const allowedRoutes = ["/"];

export default defineEventHandler(async (event) => {
	if (allowedRoutes.includes(event.path)) {
		return;
	}

	const token = event.node.req.headers["authorization"];
	console.log(event);
	if (!token) {
		throw createError({
			statusCode: 401,
			message: "Authorization token is required",
		});
	}

	try {
		// Extract the token value from 'Bearer <token>'
		const bearerToken = token.split(" ")[1];
		const decoded = jwt.verify(bearerToken, "your_secret_key");

		// Add the user information to the event context if needed
		event.context.user = decoded;
	} catch (error) {
		throw createError({
			statusCode: 401,
			message: "Invalid or expired token",
		});
	}
});
