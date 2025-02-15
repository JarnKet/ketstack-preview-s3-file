"use client";

import type React from "react";
import { useEffect } from "react";
import Image from "next/image";
import { Document, Page, pdfjs } from "react-pdf";
import { FileIcon, defaultStyles } from "react-file-icon";

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
		pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
	}, []);

	// Extract filename from key
	const fileName = fileKey.split("/").pop() || "";
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

	if (!fileUrl) {
		return (
			<div className="flex flex-col items-center p-4 bg-gray-100 rounded">
				<div className="w-16 h-16 mb-2">
					<FileIcon extension={fileExtension} {...defaultStyles} />
				</div>
				<p className="text-sm text-gray-600">{fileName}</p>
				<p className="text-xs text-red-500 mt-2">File URL not available</p>
			</div>
		);
	}

	// Handle different file types
	if (contentType.startsWith("image/")) {
		return (
			<div className="overflow-hidden rounded-lg shadow-md">
				<div className="relative w-full aspect-video">
					<Image
						src={fileUrl}
						alt={fileName}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="object-contain bg-gray-100"
					/>
				</div>
				<div className="p-2 bg-white border-t">
					<p className="text-sm font-medium truncate">{fileName}</p>
				</div>
			</div>
		);
	}

	if (contentType === "application/pdf") {
		return (
			<div className="overflow-hidden rounded-lg shadow-md">
				<div className="bg-gray-100 p-2">
					<Document file={fileUrl} error="Failed to load PDF">
						<Page pageNumber={1} width={300} />
					</Document>
				</div>
				<div className="p-2 bg-white border-t">
					<p className="text-sm font-medium truncate">{fileName}</p>
					<p className="text-xs text-gray-500">PDF</p>
				</div>
			</div>
		);
	}

	// Special handling for text-based files
	if (contentType === "text/plain" || contentType === "text/markdown") {
		return (
			<div className="overflow-hidden rounded-lg shadow-md">
				<div className="bg-gray-100 p-4 h-40 overflow-auto">
					<iframe src={fileUrl} className="w-full h-full" title={fileName} />
				</div>
				<div className="p-2 bg-white border-t">
					<p className="text-sm font-medium truncate">{fileName}</p>
					<p className="text-xs text-gray-500">{fileExtension.toUpperCase()}</p>
				</div>
			</div>
		);
	}

	// Default file preview for other types
	return (
		<div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
			<div className="w-16 h-16 mb-2">
				<FileIcon extension={fileExtension} {...defaultStyles} />
			</div>
			<p className="text-sm font-medium truncate">{fileName}</p>
			<p className="text-xs text-gray-500">{fileExtension.toUpperCase()}</p>
			<a
				href={fileUrl}
				target="_blank"
				rel="noopener noreferrer"
				className="mt-2 text-blue-500 text-sm hover:underline"
			>
				Download
			</a>
		</div>
	);
};

export default FilePreview;
