export interface Repository {
  id: string // UUID
  team_id: string // UUID references teams(id)
  path: string
  name: string
  created_by: string // UUID references users(id)
  created_at: string
  updated_at: string
}

export const mockRepositories: Repository[] = [
  {
    id: "880fb700-h59e-74g7-d049-779988773001",
    team_id: "660f9500-f39c-52e5-b827-557766551001", // My Team
    path: "github.com/yourorg/my-awesome-app",
    name: "my-awesome-app",
    created_by: "550e8400-e29b-41d4-a716-446655440001", // you@example.com
    created_at: "2025-01-05T10:00:00Z",
    updated_at: "2025-01-05T10:00:00Z",
  },
]
