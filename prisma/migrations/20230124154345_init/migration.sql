-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "discord_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "culprit_user_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "author_user_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Incident_culprit_user_id_fkey" FOREIGN KEY ("culprit_user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Incident_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Heartgram" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "receiver_user_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "author_user_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Heartgram_receiver_user_id_fkey" FOREIGN KEY ("receiver_user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Heartgram_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discord_id_key" ON "User"("discord_id");
