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
import { CreatePost } from "@/api/post";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type Account } from "@/api/account";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { useState } from "react";

function AccountButton({ account }: { account: Account }) {
  const roles: string[] =
    account.roles != null ? JSON.parse(account.roles)["roles"] : [];
  const [usernameEdit, setUsernameEdit] = useState(false);
  return (
    <Popover>
      <div className="flex flex-col items-start gap-2">
        <PopoverTrigger asChild>
          <Button variant="outline" className={"flex h-20 justify-start gap-2"}>
            <Image
              src={account.image_url}
              alt={`${account.username}'s profile image`}
              height={48}
              width={48}
            />
            <span className="text-base tracking-wide text-white">
              {account.username}
            </span>
          </Button>
        </PopoverTrigger>
        <span className="text-sm text-muted-foreground">
          Click here to change profile information
        </span>
      </div>
      <PopoverContent className="w-[64vw] p-3 sm:w-[334px]">
        <form className="flex flex-col gap-4">
          <Label
            htmlFor="username"
            className="font-black uppercase tracking-wide"
          >
            VALORANT Username
            <span className="text-red-400">*</span>
          </Label>
          {usernameEdit ? (
            <>
              <Input id="username" name="username" className="w-full" />
              <Button type="button" onClick={() => setUsernameEdit((x) => !x)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <span>{account.username}</span>
              <Button type="button" onClick={() => setUsernameEdit((x) => !x)}>
                Edit
              </Button>
            </>
          )}
          <div className="flex flex-col gap-4">
            <Label
              htmlFor="region"
              className={"font-black uppercase tracking-wide"}
            >
              Region<span className="text-red-400">*</span>
            </Label>
            <Select name="region" required defaultValue={account.region}>
              <SelectTrigger className="w-full rounded-none" id="region">
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectGroup>
                  <SelectLabel>Select a region</SelectLabel>
                  <SelectItem className="rounded-none" value="NA">
                    NA
                  </SelectItem>
                  <SelectItem className="rounded-none" value="EU">
                    EU
                  </SelectItem>
                  <SelectItem className="rounded-none" value="AP">
                    AP
                  </SelectItem>
                  <SelectItem className="rounded-none" value="LAT">
                    LAT
                  </SelectItem>
                  <SelectItem className="rounded-none" value="BR">
                    BR
                  </SelectItem>
                  <SelectItem className="rounded-none" value="KR">
                    KR
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-4">
            <Label
              htmlFor="roles"
              className={"flex gap-1 font-black uppercase tracking-wide"}
            >
              Roles
              <span className="text-xs font-normal normal-case text-muted-foreground">
                (optional)
              </span>
            </Label>
            <fieldset className="flex flex-col gap-1" id="roles">
              <div className="flex gap-1">
                <Checkbox
                  id="duelist"
                  name="roles"
                  value="duelist"
                  checked={roles.includes("duelist")}
                />
                <Label htmlFor="duelist" className="text-white">
                  Duelist
                </Label>
              </div>
              <div className="flex gap-1">
                <Checkbox
                  id="initiator"
                  name="roles"
                  value="initiator"
                  checked={roles.includes("initiator")}
                />
                <Label htmlFor="initiator" className="text-white">
                  Initiator
                </Label>
              </div>
              <div className="flex gap-1">
                <Checkbox
                  name="roles"
                  value="sentinel"
                  id="sentinel"
                  checked={roles.includes("sentinel")}
                />
                <Label htmlFor="sentinel" className="text-white">
                  Sentinel
                </Label>
              </div>
              <div className="flex gap-1">
                <Checkbox
                  name="roles"
                  value="smokes"
                  id="smokes"
                  checked={roles.includes("smokes")}
                />
                <Label htmlFor="smokes" className="text-white">
                  Smokes
                </Label>
              </div>
              <div className="flex gap-1">
                <Checkbox
                  name="roles"
                  value="fill"
                  id="fill"
                  checked={roles.includes("fill")}
                />
                <Label htmlFor="fill" className="text-white">
                  Fill
                </Label>
              </div>
            </fieldset>
          </div>
          <Button>Submit</Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
export default function SheetForm({
  mobile = false,
  account
}: {
  mobile?: boolean;
  account: Account;
}) {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    await CreatePost(formData);
  }

  return (
    <Sheet>
      <Trigger mobile={mobile} />
      <SheetContent side={"left"} className="overflow-scroll">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Header />
          <AccountButton account={account} />
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
            ? "w-full items-center justify-start gap-2 px-2 text-xl font-black uppercase text-white"
            : "h-12 w-full items-center justify-start gap-2 px-6 text-xl font-black uppercase text-white"
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
    <SheetHeader className="text-start">
      <SheetTitle className="font-black uppercase tracking-wide">
        Create New Post
      </SheetTitle>
      <SheetDescription>
        Fill out the required fields to create a new post
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
// Form Name: region
function RegionSelect() {
  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="region" className={"font-black uppercase tracking-wide"}>
        Region<span className="text-red-400">*</span>
      </Label>
      <Select name="region" required>
        <SelectTrigger className="w-full rounded-none" id="region">
          <SelectValue placeholder="Select a region" />
        </SelectTrigger>
        <SelectContent className="rounded-none">
          <SelectGroup>
            <SelectLabel>Select a region</SelectLabel>
            <SelectItem className="rounded-none" value="NA">
              NA
            </SelectItem>
            <SelectItem className="rounded-none" value="EU">
              EU
            </SelectItem>
            <SelectItem className="rounded-none" value="AP">
              AP
            </SelectItem>
            <SelectItem className="rounded-none" value="LAT">
              LAT
            </SelectItem>
            <SelectItem className="rounded-none" value="BR">
              BR
            </SelectItem>
            <SelectItem className="rounded-none" value="KR">
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
        className={"flex gap-1 font-black uppercase tracking-wide"}
      >
        Roles
        <span className="text-xs font-normal normal-case text-muted-foreground">
          (optional)
        </span>
      </Label>
      <fieldset className="flex flex-col gap-1" id="roles">
        <div className="flex gap-1">
          <Checkbox id="duelist" name="roles" value="duelist" />
          <Label htmlFor="duelist" className="text-white">
            Duelist
          </Label>
        </div>
        <div className="flex gap-1">
          <Checkbox id="initiator" name="roles" value="initiator" />
          <Label htmlFor="initiator" className="text-white">
            Initiator
          </Label>
        </div>
        <div className="flex gap-1">
          <Checkbox name="roles" value="sentinel" id="sentinel" />
          <Label htmlFor="sentinel" className="text-white">
            Sentinel
          </Label>
        </div>
        <div className="flex gap-1">
          <Checkbox name="roles" value="smokes" id="smokes" />
          <Label htmlFor="smokes" className="text-white">
            Smokes
          </Label>
        </div>
        <div className="flex gap-1">
          <Checkbox name="roles" value="fill" id="fill" />
          <Label htmlFor="fill" className="text-white">
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
        className={"flex gap-1 font-black uppercase tracking-wide"}
      >
        Ranks
        <span className="text-xs font-normal normal-case text-muted-foreground">
          (optional)
        </span>
      </Label>
      <fieldset className="flex flex-col gap-1" id="ranks">
        {ranks.map((rank) => (
          <div className="flex gap-1" key={rank}>
            <Checkbox key={rank} name="ranks" value={rank.toLowerCase()} />
            <Label htmlFor={rank} className="text-white">
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
        className={"py-1 font-black uppercase tracking-wide"}
      >
        Category<span className="text-red-400">*</span>
      </Label>
      <RadioGroup defaultValue="duos" id="category" name="category" required>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="duos" id="r1" />
          <Label htmlFor="r1">Duos</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Teams" id="r2" />
          <Label htmlFor="r2">Teams</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Scrims" id="r3" />
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
        className={"py-1 font-black uppercase tracking-wide"}
      >
        Players Amount
        <span className="text-red-400">*</span>
      </Label>
      <Select name="amount" required>
        <SelectTrigger className="w-full rounded-none" id="amount">
          <SelectValue placeholder="Select players needed" />
        </SelectTrigger>
        <SelectContent className="rounded-none">
          <SelectGroup>
            <SelectLabel>Amount</SelectLabel>
            <SelectItem className="rounded-none" value="1">
              1
            </SelectItem>
            <SelectItem className="rounded-none" value="2">
              2
            </SelectItem>
            <SelectItem className="rounded-none" value="3">
              3
            </SelectItem>
            <SelectItem className="rounded-none" value="4">
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
        className={"py-1 font-black uppercase tracking-wide"}
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
