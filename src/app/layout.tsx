import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Lao } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const notoSansLao = Noto_Sans_Lao({
	variable: "--font-noto-sans-lao",
	subsets: ["lao"],
});

export const metadata: Metadata = {
	title: "S3 Previewer - Ketstack",
	description: "S3 Previewer",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${notoSansLao.className} antialiased`}>{children}</body>
		</html>
	);
}
