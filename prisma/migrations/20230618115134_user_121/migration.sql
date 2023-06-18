/*
  Warnings:

  - Added the required column `auth_user_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "auth_user_id" STRING NOT NULL;
