"use client";

import type React from "react";
import { useEffect } from "react";
import Image from "next/image";

// PDF Render
import { Document, Page, pdfjs } from "react-pdf";
import { FileIcon, defaultStyles } from "react-file-icon";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// UI
import { Button } from "./ui/button";
import { styleDefObj } from "@/styles/style-customize";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "./ui/card";

// Icons
import { Download } from "lucide-react";

interface FileMetadata {
	contentType: string;
	contentLength: number;
	lastModified?: Date;
	etag?: string;
}

interface PreviewProps {
	fileKey: string;
	fileUrl: string;
	metadata: FileMetadata | null;
}

const FilePreview: React.FC<PreviewProps> = ({
	fileKey,
	fileUrl,
	metadata,
}) => {
	// Initialize PDF worker

	useEffect(() => {
		pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
	}, []);

	// Extract filename from key
	const fileName = fileKey.replace(/^f/, "").split("/").pop() || "";
	// Extract file extension
	const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

	// Use provided metadata or determine content type based on extension
	const getContentType = (ext: string): string => {
		const types: { [key: string]: string } = {
			pdf: "application/pdf",
			docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			odt: "application/vnd.oasis.opendocument.text",
			rtf: "application/rtf",
			txt: "text/plain",
			zip: "application/zip",
			epub: "application/epub+zip",
			md: "text/markdown",
			jpg: "image/jpeg",
			jpeg: "image/jpeg",
			png: "image/png",
			gif: "image/gif",
		};
		return types[ext] || "application/octet-stream";
	};

	const contentType = metadata?.contentType || getContentType(fileExtension);

	console.log("Content Type:", contentType);
	console.log("File Extension:", fileExtension);
	console.log("Style object for extension:", styleDefObj[fileExtension]);

	const customDefaultLabelColor = styleDefObj[fileExtension]
		? (styleDefObj[fileExtension].labelColor ?? "#777")
		: "#777";

	// Library defined default labelCOlor
	const libDefaultGlyphColor =
		defaultStyles[fileExtension as keyof typeof defaultStyles]?.labelColor;

	if (!fileUrl) {
		return (
			<Card className="w-full max-w-sm mx-auto">
				<CardHeader className="flex flex-row items-center justify-between p-2 space-y-0">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8">
							<FileIcon
								extension={fileExtension}
								{...defaultStyles[fileExtension as keyof typeof defaultStyles]}
								{...styleDefObj[fileExtension]}
								labelColor={
									styleDefObj[fileExtension]?.labelColor ||
									customDefaultLabelColor
								}
								glyphColor={
									styleDefObj[fileExtension]?.glyphColor ||
									libDefaultGlyphColor ||
									customDefaultLabelColor
								}
							/>
						</div>
						<div>
							<CardTitle className="text-sm font-medium truncate">
								{fileName}
							</CardTitle>
							<p className="text-xs text-gray-500">PDF</p>
						</div>
					</div>
					<a
						href={fileUrl}
						target="_blank"
						rel="noopener noreferrer"
						download={fileUrl}
					>
						<Button variant={"outline"} size={"icon"}>
							<Download />
						</Button>
					</a>
				</CardHeader>
				<CardContent className="flex flex-col items-center">
					<div className="w-16 h-16 mb-2">
						<FileIcon
							extension={fileExtension}
							{...defaultStyles[fileExtension as keyof typeof defaultStyles]}
							{...styleDefObj[fileExtension]}
							labelColor={
								styleDefObj[fileExtension]?.labelColor ||
								customDefaultLabelColor
							}
							glyphColor={
								styleDefObj[fileExtension]?.glyphColor ||
								libDefaultGlyphColor ||
								customDefaultLabelColor
							}
						/>
					</div>
					<p className="text-xs text-red-500 mt-2">File URL not available</p>
				</CardContent>
			</Card>
		);
	}

	if (contentType === "file/*; image/*") {
		// Image file type
		return (
			<Card className="w-full overflow-hidden">
				<CardHeader className="flex flex-row items-center justify-between p-2 space-y-0">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8">
							<FileIcon
								extension={fileExtension}
								{...defaultStyles[fileExtension as keyof typeof defaultStyles]}
								{...styleDefObj[fileExtension]}
								labelColor={
									styleDefObj[fileExtension]?.labelColor ||
									customDefaultLabelColor
								}
								glyphColor={
									styleDefObj[fileExtension]?.glyphColor ||
									libDefaultGlyphColor ||
									customDefaultLabelColor
								}
							/>
						</div>
						<div>
							<CardTitle className="text-sm font-medium truncate">
								{fileName}
							</CardTitle>
							<p className="text-xs text-gray-500">PDF</p>
						</div>
					</div>
					<a
						href={fileUrl}
						target="_blank"
						rel="noopener noreferrer"
						download={fileUrl}
					>
						<Button variant={"outline"} size={"icon"}>
							<Download />
						</Button>
					</a>
				</CardHeader>
				<CardContent className="p-0">
					<div className="relative w-full aspect-video">
						<Image
							src={fileUrl}
							alt={fileName}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="object-contain bg-gray-100"
						/>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (contentType === "application/pdf") {
		// PDF file type
		return (
			<Card className="w-full overflow-hidden">
				<CardHeader className="flex flex-row items-center justify-between p-2 space-y-0">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8">
							<FileIcon
								extension={fileExtension}
								{...defaultStyles[fileExtension as keyof typeof defaultStyles]}
								{...styleDefObj[fileExtension]}
								labelColor={
									styleDefObj[fileExtension]?.labelColor ||
									customDefaultLabelColor
								}
								glyphColor={
									styleDefObj[fileExtension]?.glyphColor ||
									libDefaultGlyphColor ||
									customDefaultLabelColor
								}
							/>
						</div>
						<div>
							<CardTitle className="text-sm font-medium truncate">
								{fileName}
							</CardTitle>
							<p className="text-xs text-gray-500">PDF</p>
						</div>
					</div>
					<a
						href={fileUrl}
						target="_blank"
						rel="noopener noreferrer"
						download={fileUrl}
					>
						<Button variant={"outline"} size={"icon"}>
							<Download />
						</Button>
					</a>
				</CardHeader>
				<CardContent className="p-0 bg-gray-100">
					<div className="p-2">
						<Document
							file={fileUrl}
							error="Failed to load PDF"
							className={"flex items-center justify-center"}
						>
							<Page pageNumber={1} />
						</Document>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (contentType === "text/plain" || contentType === "text/markdown") {
		// Text-based files
		return (
			<Card className="w-full overflow-hidden">
				<CardHeader className="flex flex-row items-center justify-between p-2 space-y-0">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8">
							<FileIcon
								extension={fileExtension}
								{...defaultStyles[fileExtension as keyof typeof defaultStyles]}
								{...styleDefObj[fileExtension]}
								labelColor={
									styleDefObj[fileExtension]?.labelColor ||
									customDefaultLabelColor
								}
								glyphColor={
									styleDefObj[fileExtension]?.glyphColor ||
									libDefaultGlyphColor ||
									customDefaultLabelColor
								}
							/>
						</div>
						<div>
							<CardTitle className="text-sm font-medium truncate">
								{fileName}
							</CardTitle>
							<p className="text-xs text-gray-500">PDF</p>
						</div>
					</div>
					<a
						href={fileUrl}
						target="_blank"
						rel="noopener noreferrer"
						download={fileUrl}
					>
						<Button variant={"outline"} size={"icon"}>
							<Download />
						</Button>
					</a>
				</CardHeader>
				<CardContent className="p-0">
					<div className="bg-gray-100 p-4 min-h-40 overflow-auto">
						<iframe src={fileUrl} className="w-full h-full" title={fileName} />
					</div>
				</CardContent>
			</Card>
		);
	}

	// Default file preview for other types
	return (
		<Card className="w-full max-w-sm mx-auto">
			<CardHeader>
				<CardTitle className="text-sm font-medium truncate text-center">
					{fileName}
				</CardTitle>
				<p className="text-xs text-gray-500 text-center">
					{fileExtension.toUpperCase()}
				</p>
			</CardHeader>
			<CardContent className="flex flex-col items-center">
				<div className="w-16 h-16">
					<FileIcon
						extension={fileExtension}
						{...defaultStyles[fileExtension as keyof typeof defaultStyles]}
						{...styleDefObj[fileExtension]}
						labelColor={
							styleDefObj[fileExtension]?.labelColor || customDefaultLabelColor
						}
						glyphColor={
							styleDefObj[fileExtension]?.glyphColor ||
							libDefaultGlyphColor ||
							customDefaultLabelColor
						}
					/>
				</div>
			</CardContent>
			<CardFooter className="flex justify-center pt-0">
				<a
					href={fileUrl}
					target="_blank"
					rel="noopener noreferrer"
					download={fileUrl}
				>
					<Button variant={"outline"}>
						<Download className="mr-2" /> Download
					</Button>
				</a>
			</CardFooter>
		</Card>
	);
};

export default FilePreview;
