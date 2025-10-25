export interface Team {
  id: string // UUID
  name: string
  slug: string
  created_by: string // UUID references users(id)
  created_at: string
  updated_at: string
}

export const mockTeams: Team[] = [
  {
    id: "660f9500-f39c-52e5-b827-557766551001",
    name: "My Team",
    slug: "my-team",
    created_by: "550e8400-e29b-41d4-a716-446655440001", // you@example.com
    created_at: "2025-01-01T10:30:00Z",
    updated_at: "2025-01-01T10:30:00Z",
  },
]
