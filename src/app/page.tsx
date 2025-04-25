export default async function Home() {
  try {
    const res = await fetch("http://localhost:5131/api/HelloWorld");
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return <div>{data.message}</div>;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return <div>Error connecting to API: {errorMessage}</div>;
  }
}
