import { redirect } from "next/navigation";

// UI
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Icons
import { Eye } from "lucide-react";

const PreviewForm = () => {
	const formAction = async (formData: FormData) => {
		"use server";

		const fileName = formData.get("fileName") as string;

		redirect(`/preview/${fileName}`);
	};

	return (
		<form action={formAction} className="space-y-4 flex items-end gap-4">
			<div className="flex flex-col gap-2 items-start">
				<Label className="" htmlFor="fileName">
					File Name
				</Label>
				<Input
					name="fileName"
					id="fileName"
					type="text"
					placeholder="File Name"
					required
				/>
			</div>

			<Button>
				Preview Now <Eye className="ml-2" />
			</Button>
		</form>
	);
};

export default PreviewForm;
