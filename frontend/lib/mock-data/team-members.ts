export interface TeamMember {
  id: string // UUID
  team_id: string // UUID references teams(id)
  user_id: string // UUID references users(id)
  role: "owner" | "admin" | "member"
  joined_at: string
}

export const mockTeamMembers: TeamMember[] = [
  {
    id: "770fa600-g49d-63f6-c938-668877662001",
    team_id: "660f9500-f39c-52e5-b827-557766551001", // My Team
    user_id: "550e8400-e29b-41d4-a716-446655440001", // you@example.com
    role: "owner",
    joined_at: "2025-01-01T10:30:00Z",
  },
  {
    id: "770fa600-g49d-63f6-c938-668877662002",
    team_id: "660f9500-f39c-52e5-b827-557766551001", // My Team
    user_id: "550e8400-e29b-41d4-a716-446655440002", // teammate1@example.com
    role: "member",
    joined_at: "2025-01-02T15:00:00Z",
  },
  {
    id: "770fa600-g49d-63f6-c938-668877662003",
    team_id: "660f9500-f39c-52e5-b827-557766551001", // My Team
    user_id: "550e8400-e29b-41d4-a716-446655440003", // teammate2@example.com
    role: "member",
    joined_at: "2025-01-03T09:30:00Z",
  },
]
