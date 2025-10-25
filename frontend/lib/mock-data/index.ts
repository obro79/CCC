// Export all types
export type { User } from "./users"
export type { Team } from "./teams"
export type { TeamMember } from "./team-members"
export type { Repository } from "./repositories"
export type { Context } from "./contexts"

// Export all mock data
export { mockUsers } from "./users"
export { mockTeams } from "./teams"
export { mockTeamMembers } from "./team-members"
export { mockRepositories } from "./repositories"
export { mockContexts } from "./contexts"

// Utility functions for working with mock data

/**
 * Get contexts that have Claude conversation data (total_messages > 0)
 */
export function getContextsWithClaudeData() {
  const { mockContexts } = require("./contexts")
  return mockContexts.filter((ctx: any) => ctx.total_messages > 0)
}

/**
 * Get contexts without Claude data (regular git commits)
 */
export function getContextsWithoutClaudeData() {
  const { mockContexts } = require("./contexts")
  return mockContexts.filter((ctx: any) => ctx.total_messages === 0)
}

/**
 * Get context by commit SHA
 */
export function getContextByCommitSha(commitSha: string) {
  const { mockContexts } = require("./contexts")
  return mockContexts.find((ctx: any) => ctx.commit_sha === commitSha)
}

/**
 * Get context by session ID
 */
export function getContextBySessionId(sessionId: string) {
  const { mockContexts } = require("./contexts")
  return mockContexts.find((ctx: any) => ctx.session_id === sessionId)
}

/**
 * Get all contexts for a repository
 */
export function getContextsByRepository(repositoryId: string) {
  const { mockContexts } = require("./contexts")
  return mockContexts.filter((ctx: any) => ctx.repository_id === repositoryId)
}

/**
 * Get all contexts by a specific author
 */
export function getContextsByAuthor(authorEmail: string) {
  const { mockContexts } = require("./contexts")
  return mockContexts.filter((ctx: any) => ctx.author_email === authorEmail)
}

/**
 * Get user by email
 */
export function getUserByEmail(email: string) {
  const { mockUsers } = require("./users")
  return mockUsers.find((user: any) => user.email === email)
}

/**
 * Get user by ID
 */
export function getUserById(id: string) {
  const { mockUsers } = require("./users")
  return mockUsers.find((user: any) => user.id === id)
}

/**
 * Parse JSONL data into array of messages
 */
export function parseJsonlData(jsonlData: string) {
  if (!jsonlData || jsonlData.trim() === "") {
    return []
  }

  return jsonlData
    .split("\n")
    .filter(line => line.trim())
    .map(line => JSON.parse(line))
}

/**
 * Get commit timeline in chronological order
 */
export function getCommitTimeline() {
  const { mockContexts } = require("./contexts")
  return [...mockContexts].sort(
    (a: any, b: any) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
}
