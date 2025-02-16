import Image from "next/image";

// UI
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Icons
import { Star } from "lucide-react";
import PreviewForm from "./_components/PreviewForm";

export default function Home() {
	return (
		<section className="container mx-auto relative overflow-hidden py-32">
			<div className="absolute inset-0 overflow-hidden">
				<div className="flex h-full flex-col items-center justify-end">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 1400 900"
						className="-mx-[theme(container.padding)] h-full w-[calc(100%+2*theme(container.padding))]"
					>
						<defs>
							<filter id="blur1" x="-20%" y="-20%" width="140%" height="140%">
								<feFlood floodOpacity="0" result="BackgroundImageFix" />
								<feBlend
									mode="normal"
									in="SourceGraphic"
									in2="BackgroundImageFix"
									result="shape"
								/>
								<feGaussianBlur
									stdDeviation="200"
									result="effect1_foregroundBlur"
								/>
							</filter>
							<pattern
								id="innerGrid"
								width="40"
								height="40"
								patternUnits="userSpaceOnUse"
							>
								<path
									d="M 40 0 L 0 0 0 40"
									fill="none"
									stroke="hsl(var(--background))"
									strokeWidth="0.5"
									strokeOpacity={0.6}
								/>
							</pattern>
							<pattern
								id="grid"
								width="160"
								height="160"
								patternUnits="userSpaceOnUse"
							>
								<rect width="160" height="160" fill="url(#innerGrid)" />
								<path
									d="M 70 80 H 90 M 80 70 V 90"
									fill="none"
									stroke="hsl(var(--background))"
									strokeWidth="1"
									strokeOpacity={0.3}
								/>
							</pattern>
						</defs>
						<g filter="url(#blur1)">
							<rect width="1400" height="900" fill="hsl(var(--background))" />
							<circle
								cx="400"
								cy="740"
								fill="hsl(var(--primary)/0.2)"
								r="300"
							/>
							<circle
								cx="1100"
								cy="600"
								fill="hsl(var(--primary)/0.3)"
								r="240"
							/>
						</g>
						<rect width="1400" height="900" fill="url(#grid)" />
					</svg>
				</div>
			</div>
			<div className="container relative flex flex-col items-center text-center">
				<h1 className="my-3 text-pretty text-2xl font-bold sm:text-4xl md:my-6 lg:text-5xl">
					Ketstack - S3 Previewer
				</h1>
				<p className="mb-6 max-w-xl text-muted-foreground md:mb-12 lg:text-xl">
					Stop accident and instant download file from S3 Bucket by preview
					first, download after
				</p>
				<div className="mb-16 space-y-8">
					{/* <div className="flex items-start gap-4">
						<div className="flex flex-col items-center gap-2">
							<Button variant="outline" disabled>
								{process.env.S3_BUCKET_NAME || "YOUR_BUCKET_NAME"}
							</Button>
							<p className="text-xs text-muted-foreground">
								process.env.S3_BUCKET_NAME
							</p>
						</div>
						<Button>Go To Preview</Button>
					</div> */}

					<PreviewForm />

					<div className="flex items-center justify-center gap-4">
						<Badge className="text-lg">
							{process.env.S3_BUCKET_NAME || "YOUR_BUCKET_NAME"}
						</Badge>

						<Badge variant={"outline"} className="text-lg">
							{process.env.S3_MAIN_FOLDER || "YOUR_FOLDER_NAME"}
						</Badge>
					</div>
				</div>
			</div>
			<div className="container relative -mb-48 overflow-hidden">
				<div className="mx-auto aspect-[4/3] max-w-3xl rounded-xl border border-background/40 bg-background/20 p-4">
					<img
						src="/images/s3.png"
						alt="placeholder hero"
						className="h-full w-full rounded-md object-contain grayscale"
					/>
				</div>
			</div>
		</section>
	);
}
