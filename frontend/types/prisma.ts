// ---- ENUMS ----
export enum Role {
  CREATOR = "CREATOR",
  PATRON = "PATRON",
    ADMIN = "ADMIN"
}

export enum Visibility {
  PUBLIC = "PUBLIC",
  PATRON_ONLY = "PATRON_ONLY",
  FOLLOWER_ONLY = "FOLLOWER_ONLY",
  PRIVATE = "PRIVATE",
}

// ---- BASE ENTITIES ----
export interface IUser {
  id: number
  email: string
  handle?: string | null
  bio?: string | null
  media?: string | null // JSON string or parsed [] in frontend
  createdAt: string
  updatedAt: string
  userRoles?: IUserRole[]
  posts?: IPost[]
  tiers?: ITier[]
  projects?: IProject[]
  subscriptions?: ISubscription[]
  payments?: IPayment[]
  followedProjects?: IProjectFollower[]
  portfolioItems?: IPortfolioItem[]
}

export interface IUserRole {
  id: number
  role: Role
  userId: number
}

// ---- PROJECTS ----
export interface IProject {
  id: number
  title: string
  description: string
  repoUrl?: string | null
  demoUrl?: string | null
  media?: string | null
  status?: string | null
  visibility: Visibility
  creatorId: number
  creator?: IUser
  createdAt: string
  updatedAt: string
  devlogs?: IDevlog[]
  followers?: IProjectFollower[]
  portfolioItems?: IPortfolioItem[]
  quotedInPosts?: IPost[]
}

export interface IDevlog {
  id: number
  title: string
  content: string
  version?: string | null
  buildLink?: string | null
  projectId: number
  project?: IProject
  createdAt: string
  updatedAt: string
}

export interface IProjectFollower {
  id: number
  userId: number
  projectId: number
  user?: IUser
  project?: IProject
}

export interface IPortfolioItem {
  id: number
  userId: number
  projectId: number
  order: number
  caption?: string | null
  user?: IUser
  project?: IProject
}

// ---- POSTS ----
export interface IPost {
  id: number
  title: string
  content: string
  isPaid: boolean
  quotedProjectId?: number | null
  creatorId: number
  creator?: IUser
  quotedProject?: IProject | null
  createdAt: string
  updatedAt: string
}

// ---- MONETIZATION ----
export interface ITier {
  id: number
  name: string
  price: number
  benefits: string
  creatorId: number
  creator?: IUser
  subscriptions?: ISubscription[]
}

export interface ISubscription {
  id: number
  patronId: number
  tierId: number
  startDate: string
  endDate?: string | null
  patron?: IUser
  tier?: ITier
  payments?: IPayment[]
}

export interface IPayment {
  id: number
  amount: number
  date: string
  subscriptionId: number
  userId: number
  subscription?: ISubscription
  user?: IUser
}

// ---- BLOG ----
export interface IBlog {
  id: number
  slug: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}