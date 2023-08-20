import { Icons } from '@/components/ui/icons';

export default function Messages() {
	return (
		<div className="fixed bottom-0 right-0 w-96 h-16 py-2 bg-neutral-700 justify-center items-center gap-4 hover:!cursor-pointer hover:ring ring-transparent hover:ring-black md:flex hidden">
			<Icons.chatMessage />
			<span className="font-black text-2xl">MESSAGES</span>
		</div>
	);
}
