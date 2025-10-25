export interface User {
  id: string // UUID
  email: string
  display_name: string | null
  created_at: string
  updated_at: string
}

export const mockUsers: User[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "you@example.com",
    display_name: "You",
    created_at: "2025-01-01T10:00:00Z",
    updated_at: "2025-01-01T10:00:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    email: "teammate1@example.com",
    display_name: "Alice Chen",
    created_at: "2025-01-02T14:30:00Z",
    updated_at: "2025-01-02T14:30:00Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    email: "teammate2@example.com",
    display_name: "Bob Johnson",
    created_at: "2025-01-03T09:15:00Z",
    updated_at: "2025-01-03T09:15:00Z",
  },
]
