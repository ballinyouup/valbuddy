//TODO: Create a fetch for dynamic users profile
//TODO: Create player not found page
//TODO: Create Loading states for this page
export default function Page({ params }: { params: { user: string } }) {
	return <div>User: {params.user}</div>;
}
