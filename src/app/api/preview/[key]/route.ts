// File: app/api/preview/[key]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({
	region: process.env.AWS_REGION || "us-east-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
	},
});

export async function GET(
	request: NextRequest,
	{ params }: { params: { key: string } },
) {
	const key = params.key;

	if (!key) {
		return NextResponse.json(
			{ error: "File key is required" },
			{ status: 400 },
		);
	}

	try {
		// Create the command
		const command = new GetObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: key,
		});

		// Generate presigned URL with short expiration
		const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

		// Get file metadata
		const metaCommand = new GetObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: key,
		});

		const metaResponse = await s3Client.send(metaCommand);
		const contentType = metaResponse.ContentType || "application/octet-stream";
		const contentLength = metaResponse.ContentLength || 0;

		// Return the signed URL and metadata
		return NextResponse.json({
			url: signedUrl,
			metadata: {
				contentType,
				contentLength,
				lastModified: metaResponse.LastModified,
				name: key.split("/").pop(),
			},
		});
	} catch (error) {
		console.error("Error generating preview:", error);
		return NextResponse.json(
			{ error: "Failed to generate preview" },
			{ status: 500 },
		);
	}
}
