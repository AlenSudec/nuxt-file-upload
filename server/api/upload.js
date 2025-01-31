import { defineEventHandler, readMultipartFormData } from "h3";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
	const user = event.context.user;

	if (!user) {
		throw createError({
			statusCode: 401,
			message: "User not authenticated",
		});
	}

	const formData = await readMultipartFormData(event);

	const chunk = formData.find((field) => field.name === "file");
	const chunkIndex = formData.find(
		(field) => field.name === "chunkIndex"
	)?.data;
	const totalChunks = formData.find(
		(field) => field.name === "totalChunks"
	)?.data;
	const fileName = formData
		.find((field) => field.name === "fileName")
		?.data.toString();
	const action = formData
		.find((field) => field.name === "action")
		?.data?.toString();

	const uploadDir = path.join(process.cwd(), "server/uploads");

	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir);
	}

	if (action === "abort" && totalChunks && fileName) {
		for (let i = 0; i < totalChunks; i++) {
			const partPath = path.join(uploadDir, `${fileName}.part${i}`);
			if (fs.existsSync(partPath)) {
				fs.unlinkSync(partPath);
			}
		}
		return {
			success: true,
			message: "Upload aborted and parts deleted",
		};
	}

	if (!chunk || chunkIndex === undefined || !totalChunks || !fileName) {
		return { success: false, message: "Invalid request" };
	}

	try {
		const filePath = path.join(uploadDir, `${fileName}.part${chunkIndex}`);
		fs.writeFileSync(filePath, chunk.data);

		if (parseInt(chunkIndex) === parseInt(totalChunks) - 1) {
			const finalPath = path.join(uploadDir, fileName);
			const writeStream = fs.createWriteStream(finalPath);

			for (let i = 0; i < totalChunks; i++) {
				const partPath = path.join(uploadDir, `${fileName}.part${i}`);
				const data = fs.readFileSync(partPath);
				writeStream.write(data);
				fs.unlinkSync(partPath);
			}
			writeStream.end();
		}

		return { success: true, message: "Chunk uploaded successfully" };
	} catch (err) {
		console.log(err);
		if (err.name === "AbortError") {
			console.log("Request aborted by the client");
			return { success: false, message: "Request aborted" };
		}
		console.error("Upload failed:", err);
		return { success: false, message: "Internal server error" };
	}
});
