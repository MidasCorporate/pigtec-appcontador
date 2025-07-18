export async function updateFarmLinks(data: {
  role_id: string
  add_farm_ids: string[]
  remove_farm_ids: string[]
}) {
  const response = await fetch("/api/roles/update-farm-links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update farm links")
  }

  return response.json()
}
