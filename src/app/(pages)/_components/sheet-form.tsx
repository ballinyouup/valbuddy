"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Icons } from "@/components/ui/icons";
import { CreatePost } from "@/api/post";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

export default function SheetForm({ mobile = false }: { mobile?: boolean }) {
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		await CreatePost(formData);
	}

	return (
		<Sheet>
			<Trigger mobile={mobile} />
			<SheetContent side={"left"} className="overflow-scroll">
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4"
				>
					<Header />
					<UsernameInput />
					<CategoryRadio />
					<RegionSelect />
					<RolesCheckbox />
					<RankCheckbox />
					<AmountSelect />
					<TextBox />
					<Footer />
				</form>
			</SheetContent>
		</Sheet>
	);
}
function Trigger({ mobile = false }: { mobile: boolean }) {
	return (
		<SheetTrigger asChild>
			<Button
				className={
					mobile
						? "text-white w-full text-xl items-center justify-start font-black uppercase px-2 gap-2"
						: "text-white w-full h-12 text-xl items-center justify-start font-black uppercase px-6 gap-2"
				}
				variant={"ghost"}
			>
				<Icons.plus />
				<span>Post</span>
			</Button>
		</SheetTrigger>
	);
}

function Header() {
	return (
		<SheetHeader>
			<SheetTitle className="font-black tracking-wide uppercase">
				Create New Post
			</SheetTitle>
			<SheetDescription>
				Fill out the required fields to create a new
				post
			</SheetDescription>
		</SheetHeader>
	);
}

function Footer() {
	return (
		<SheetFooter>
			<SheetClose asChild>
				<Button type="submit">Create Post</Button>
			</SheetClose>
		</SheetFooter>
	);
}
// Form Name: username
function UsernameInput() {
	return (
		<div className="flex flex-col gap-4">
			<Label
				htmlFor="username"
				className="uppercase font-black tracking-wide"
			>
				VAL Username
				<span className="text-red-400">*</span>
			</Label>
			<Input
				id="username"
				name="username"
				className="rounded-none"
				placeholder="Enter VALORANT Username"
				required
			/>
		</div>
	);
}
// Form Name: region
function RegionSelect() {
	return (
		<div className="flex flex-col gap-4">
			<Label
				htmlFor="region"
				className="uppercase font-black tracking-wide"
			>
				Region<span className="text-red-400">*</span>
			</Label>
			<Select name="region" required>
				<SelectTrigger
					className="w-full rounded-none"
					id="region"
				>
					<SelectValue placeholder="Select a region" />
				</SelectTrigger>
				<SelectContent className="rounded-none">
					<SelectGroup>
						<SelectLabel>
							Select a region
						</SelectLabel>
						<SelectItem
							className="rounded-none"
							value="NA"
						>
							NA
						</SelectItem>
						<SelectItem
							className="rounded-none"
							value="EU"
						>
							EU
						</SelectItem>
						<SelectItem
							className="rounded-none"
							value="AP"
						>
							AP
						</SelectItem>
						<SelectItem
							className="rounded-none"
							value="LAT"
						>
							LAT
						</SelectItem>
						<SelectItem
							className="rounded-none"
							value="BR"
						>
							BR
						</SelectItem>
						<SelectItem
							className="rounded-none"
							value="KR"
						>
							KR
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}

// Form Name: roles
function RolesCheckbox() {
	return (
		<div className="flex flex-col gap-4">
			<Label
				htmlFor="roles"
				className="uppercase font-black tracking-wide flex gap-1"
			>
				Roles
				<span className="font-normal normal-case text-muted-foreground text-xs">
					(optional)
				</span>
			</Label>
			<fieldset className="flex flex-col gap-1" id="roles">
				<div className="flex gap-1">
					<Checkbox
						id="duelist"
						name="roles"
						value="duelist"
					/>
					<Label
						htmlFor="duelist"
						className="text-white"
					>
						Duelist
					</Label>
				</div>
				<div className="flex gap-1">
					<Checkbox
						id="initiator"
						name="roles"
						value="initiator"
					/>
					<Label
						htmlFor="initiator"
						className="text-white"
					>
						Initiator
					</Label>
				</div>
				<div className="flex gap-1">
					<Checkbox
						name="roles"
						value="sentinel"
						id="sentinel"
					/>
					<Label
						htmlFor="sentinel"
						className="text-white"
					>
						Sentinel
					</Label>
				</div>
				<div className="flex gap-1">
					<Checkbox
						name="roles"
						value="smokes"
						id="smokes"
					/>
					<Label
						htmlFor="smokes"
						className="text-white"
					>
						Smokes
					</Label>
				</div>
				<div className="flex gap-1">
					<Checkbox
						name="roles"
						value="fill"
						id="fill"
					/>
					<Label
						htmlFor="fill"
						className="text-white"
					>
						Fill
					</Label>
				</div>
			</fieldset>
		</div>
	);
}

// Form Name: ranks
function RankCheckbox() {
	const ranks = [
		"Iron",
		"Bronze",
		"Silver",
		"Gold",
		"Platinum",
		"Diamond",
		"Ascendant",
		"Immortal",
		"Radiant"
	];
	return (
		<div className="flex flex-col gap-4">
			<Label
				htmlFor="ranks"
				className="uppercase font-black tracking-wide flex gap-1"
			>
				Ranks
				<span className="font-normal normal-case text-muted-foreground text-xs">
					(optional)
				</span>
			</Label>
			<fieldset className="flex flex-col gap-1" id="ranks">
				{ranks.map((rank) => (
					<div className="flex gap-1" key={rank}>
						<Checkbox
							key={rank}
							name="ranks"
							value={rank.toLowerCase()}
						/>
						<Label
							htmlFor={rank}
							className="text-white"
						>
							{rank}
						</Label>
					</div>
				))}
			</fieldset>
		</div>
	);
}
// Form Name: category
function CategoryRadio() {
	return (
		<div className="flex flex-col gap-4">
			<Label
				htmlFor="category"
				className="uppercase font-black tracking-wide py-1"
			>
				Category<span className="text-red-400">*</span>
			</Label>
			<RadioGroup
				defaultValue="duos"
				id="category"
				name="category"
				required
			>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="duos" id="r1" />
					<Label htmlFor="r1">Duos</Label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="Teams" id="r2" />
					<Label htmlFor="r2">Teams</Label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem
						value="Scrims"
						id="r3"
					/>
					<Label htmlFor="r3">Scrims</Label>
				</div>
			</RadioGroup>
		</div>
	);
}
// Form Name: amount
function AmountSelect() {
	return (
		<div className="flex flex-col gap-4">
			<Label
				htmlFor="amount"
				className="uppercase font-black tracking-wide py-1"
			>
				Players Amount
				<span className="text-red-400">*</span>
			</Label>
			<Select name="amount" required>
				<SelectTrigger
					className="w-full rounded-none"
					id="amount"
				>
					<SelectValue placeholder="Select players needed" />
				</SelectTrigger>
				<SelectContent className="rounded-none">
					<SelectGroup>
						<SelectLabel>
							Amount
						</SelectLabel>
						<SelectItem
							className="rounded-none"
							value="1"
						>
							1
						</SelectItem>
						<SelectItem
							className="rounded-none"
							value="2"
						>
							2
						</SelectItem>
						<SelectItem
							className="rounded-none"
							value="3"
						>
							3
						</SelectItem>
						<SelectItem
							className="rounded-none"
							value="4"
						>
							4
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
// Form Name: text
function TextBox() {
	return (
		<div className="flex flex-col gap-4">
			<Label
				htmlFor="text"
				className="uppercase font-black tracking-wide py-1"
			>
				Text<span className="text-red-400">*</span>
			</Label>
			<Textarea
				id="text"
				name="text"
				placeholder="Enter a short description about yourself! It'll help you find people with your interests."
				className="rounded-none"
				required
			/>
		</div>
	);
}
