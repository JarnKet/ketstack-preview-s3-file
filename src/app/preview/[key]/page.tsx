import React from "react";

import Link from "next/link";

// Third Party
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";

// UI
import FilePreview from "@/components/FilePreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Icons
import { Text } from "lucide-react";

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
		// Extract just the filename from the URL parameter
		const filename = key.replace(/^f/, ""); // Remove the 'f' prefix if present

		// Construct the S3 key with the proper folder
		const s3Key = `${process.env.S3_MAIN_FOLDER || "images"}/${filename}`;

		console.log("S3 Key:", s3Key);

		const command = new HeadObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME || "soe-storage",
			Key: s3Key,
		});

		const response = await s3Client.send(command);

		console.log(response, "Response");

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

// Format the date in a human-readable format
function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date);
}

// Function to get human readable file size
function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export default async function Preview({
	params,
}: {
	params: Promise<{ key: string }>;
}) {
	const keyPrams = (await params).key;

	const key = decodeURIComponent(keyPrams);

	// Extract just the filename, removing any 'f' prefix
	const filename = key.replace(/^f/, "");

	const metadata = await getFileMetadata(key);

	// Construct the full S3 URL with the correct path
	const baseUrl = `https://${process.env.S3_BUCKET_NAME || "soe-storage"}.s3.${process.env.AWS_REGION || "ap-southeast-1"}.amazonaws.com`;
	const s3Folder = process.env.S3_MAIN_FOLDER || "images";
	const fileUrl = `${baseUrl}/${s3Folder}/${filename}`;

	return (
		<div className="container mx-auto space-y-4 px-4 py-12 max-w-5xl">
			{/* <Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink>
							<Link href="/">Home</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink>
							<Link href="/components">Components</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Breadcrumb</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb> */}

			<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-14 max-w-screen-2xl items-center">
					<div className="flex gap-4 items-center mr-4">
						<div className="relative h-8 w-24 flex items-center transition-transform hover:scale-105">
							<img
								src={process.env.BANNER_LOGO}
								alt="logo"
								className="object-contain"
							/>
						</div>
						<div className="hidden md:flex">
							<h1 className="scroll-m-20 text-xl font-semibold tracking-tight transition-colors first:mt-0">
								{process.env.BANNER_TEXT || "YOUR_BANNER_TEXT"}
							</h1>
						</div>
					</div>
				</div>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-2">
					<FilePreview fileKey={key} fileUrl={fileUrl} metadata={metadata} />
				</div>

				{metadata && (
					<div className="md:col-span-1">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold flex items-center">
									<Text className="mr-2" /> File Details
								</CardTitle>
							</CardHeader>
							<CardContent>
								<dl className="space-y-4 text-sm">
									<div>
										<dt className="font-medium text-muted-foreground mb-1">
											Filename
										</dt>
										<dd className="break-all">{filename}</dd>
									</div>

									<div>
										<dt className="font-medium text-muted-foreground mb-1">
											Content Type
										</dt>
										<dd>{metadata.contentType}</dd>
									</div>

									<div>
										<dt className="font-medium text-muted-foreground mb-1">
											Size
										</dt>
										<dd>{formatFileSize(metadata.contentLength)}</dd>
									</div>

									{metadata.lastModified && (
										<div>
											<dt className="font-medium text-muted-foreground mb-1">
												Last Modified
											</dt>
											<dd>{formatDate(metadata.lastModified)}</dd>
										</div>
									)}

									{metadata.etag && (
										<div>
											<dt className="font-medium text-muted-foreground mb-1">
												ETag
											</dt>
											<dd className="font-mono text-xs truncate">
												{metadata.etag}
											</dd>
										</div>
									)}
								</dl>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
}
