export async function solveSimplex(problem) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  const url = `${baseUrl.replace(/\/$/, "")}/api/solve`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(problem),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Backend solve failed (${res.status}): ${text || res.statusText}`);
  }

  return await res.json();
}

