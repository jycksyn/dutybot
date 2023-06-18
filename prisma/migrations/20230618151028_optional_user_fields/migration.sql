/*
  Warnings:

  - A unique constraint covering the columns `[auth_user_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "auth_user" DROP CONSTRAINT "auth_user_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "User" ALTER COLUMN "username" DROP NOT NULL;
ALTER TABLE "User" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "auth_user" ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_auth_user_id_key" ON "User"("auth_user_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "auth_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
