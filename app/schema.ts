import {integer, pgTable, uuid, text, timestamp} from "drizzle-orm/pg-core"

export const pastes = pgTable("pastes", {
    id: uuid("id").defaultRandom().primaryKey(),
    content: text("content").notNull(),
    maxViews: integer("max_views"),
    remainingViews: integer("remaining_views"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow(),
})