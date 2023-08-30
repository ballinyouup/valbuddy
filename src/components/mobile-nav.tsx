import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
export default function MobileNav() {
	return (
		<div className="fixed bottom-0 w-full h-fit px-2 py-2 bg-primary md:hidden">
			<DropdownMenu>
				<DropdownMenuTrigger className="w-full flex items-center justify-center gap-4 font-black text-2xl uppercase [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg]:transition-all [&[data-state=closed]>svg]:rotate-0 [&[data-state=closed]>svg]:transition-all">
					<span>Menu</span>
					<ChevronDown strokeWidth={4} className="w-10 h-10" />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					sideOffset={8}
					align="start"
					alignOffset={-20}
					className="w-screen md:hidden flex flex-col rounded-none"
				>
					<DropdownMenuItem className="text-lg font-extrabold uppercase">
						Duos
					</DropdownMenuItem>
					<DropdownMenuItem className="text-lg font-extrabold uppercase">
						Teams
					</DropdownMenuItem>
					<DropdownMenuItem className="text-lg font-extrabold uppercase">
						Scrims
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="text-lg font-extrabold uppercase">
						Events
					</DropdownMenuItem>
					<DropdownMenuItem className="text-lg font-extrabold uppercase">
						Coaches
					</DropdownMenuItem>
					<DropdownMenuItem className="text-lg font-extrabold uppercase">
						Communities
					</DropdownMenuItem>
					<DropdownMenuItem className="text-lg font-extrabold uppercase">
						Clips
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
