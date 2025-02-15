import React from "react";
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import FilePreview from "@/components/FilePreview";

interface FileMetadata {
	contentType: string;
	contentLength: number;
	lastModified?: Date;
	etag?: string;
}

const s3Client = new S3Client({
	region: process.env.AWS_REGION || "ap-southeast-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
	},
});

async function getFileMetadata(key: string): Promise<FileMetadata | null> {
	try {
		const command = new HeadObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME || "soe-storage",
			Key: key,
		});

		const response = await s3Client.send(command);

		return {
			contentType: response.ContentType || "application/octet-stream",
			contentLength: response.ContentLength || 0,
			lastModified: response.LastModified,
			etag: response.ETag?.replace(/"/g, ""),
		};
	} catch (error) {
		console.error("Error fetching S3 metadata:", error);
		return null;
	}
}

const Preview = async ({
	params,
}: {
	params: { key: string };
}) => {
	const key = decodeURIComponent(params.key);
	const metadata = await getFileMetadata(key);

	// Construct the full S3 URL
	const baseUrl = `https://${process.env.S3_BUCKET_NAME || "soe-storage"}.s3.${process.env.AWS_REGION || "ap-southeast-1"}.amazonaws.com`;
	const fileUrl = `${baseUrl}/${key}`;

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-xl font-semibold mb-4">File Preview</h1>
			<div className="border border-gray-200 rounded-lg overflow-hidden">
				<FilePreview fileKey={key} fileUrl={fileUrl} metadata={metadata} />
			</div>

			{metadata && (
				<div className="mt-4 p-4 bg-gray-50 rounded-lg">
					<h2 className="text-lg font-medium mb-2">File Metadata</h2>
					<dl className="grid grid-cols-2 gap-2 text-sm">
						<dt className="font-medium">Content Type:</dt>
						<dd>{metadata.contentType}</dd>

						<dt className="font-medium">Size:</dt>
						<dd>{(metadata.contentLength / 1024).toFixed(2)} KB</dd>

						{metadata.lastModified && (
							<>
								<dt className="font-medium">Last Modified:</dt>
								<dd>{metadata.lastModified.toLocaleString()}</dd>
							</>
						)}

						{metadata.etag && (
							<>
								<dt className="font-medium">ETag:</dt>
								<dd className="truncate">{metadata.etag}</dd>
							</>
						)}
					</dl>
				</div>
			)}
		</div>
	);
};

export default Preview;
