type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
	logo: (props: IconProps) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 256 256"
			{...props}
		>
			<rect width="256" height="256" fill="none" />
			<line
				x1="208"
				y1="128"
				x2="128"
				y2="208"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="16"
			/>
			<line
				x1="192"
				y1="40"
				x2="40"
				y2="192"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="16"
			/>
		</svg>
	),
	discord: (props: IconProps) => (
		<svg
			viewBox="0 -28.5 256 256"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			preserveAspectRatio="xMidYMid"
			fill="#ffffff"
			{...props}
		>
			<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
			<g
				id="SVGRepo_tracerCarrier"
				strokeLinecap="round"
				strokeLinejoin="round"
			></g>
			<g id="SVGRepo_iconCarrier">
				<g>
					<path
						d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
						fill="#ffffff"
						fillRule="nonzero"
					></path>
				</g>
			</g>
		</svg>
	),
	twitch: (props: IconProps) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-twitch"
			{...props}
		>
			<path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" />
		</svg>
	),
	spinner: (props: IconProps) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<path d="M21 12a9 9 0 1 1-6.219-8.56" />
		</svg>
	),
	users: (props: IconProps) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			className="lucide lucide-users"
			{...props}
		>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	),
	swords: (props: IconProps) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			className="lucide lucide-swords"
			{...props}
		>
			<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
			<line x1="13" x2="19" y1="19" y2="13" />
			<line x1="16" x2="20" y1="16" y2="20" />
			<line x1="19" x2="21" y1="21" y2="19" />
			<polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
			<line x1="5" x2="9" y1="14" y2="18" />
			<line x1="7" x2="4" y1="17" y2="20" />
			<line x1="3" x2="5" y1="19" y2="21" />
		</svg>
	),
	gamepad: (props: IconProps) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			className="lucide lucide-gamepad-2"
			{...props}
		>
			<line x1="6" x2="10" y1="11" y2="11" />
			<line x1="8" x2="8" y1="9" y2="13" />
			<line x1="15" x2="15.01" y1="12" y2="12" />
			<line x1="18" x2="18.01" y1="10" y2="10" />
			<path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
		</svg>
	),
	bookUp: (props: IconProps) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			className="lucide lucide-book-up-2"
			{...props}
		>
			<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2" />
			<path d="M18 2h2v20H6.5a2.5 2.5 0 0 1 0-5H20" />
			<path d="M12 13V7" />
			<path d="m9 10 3-3 3 3" />
			<path d="m9 5 3-3 3 3" />
		</svg>
	),
	clapperBoard: (props: IconProps) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			className="lucide lucide-clapperboard"
			{...props}
		>
			<path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4Z" />
			<path d="m4 11-.88-2.87a2 2 0 0 1 1.33-2.5l11.48-3.5a2 2 0 0 1 2.5 1.32l.87 2.87L4 11.01Z" />
			<path d="m6.6 4.99 3.38 4.2" />
			<path d="m11.86 3.38 3.38 4.2" />
		</svg>
	),
	calendarSearch: (props: IconProps) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			className="lucide lucide-calendar-search"
			{...props}
		>
			<path d="M21 12V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h7.5" />
			<path d="M16 2v4" />
			<path d="M8 2v4" />
			<path d="M3 10h18" />
			<path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6v0Z" />
			<path d="m22 22-1.5-1.5" />
		</svg>
	),
	chatMessage: (props: IconProps) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			className="lucide lucide-message-square"
			{...props}
		>
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
		</svg>
	)
};
