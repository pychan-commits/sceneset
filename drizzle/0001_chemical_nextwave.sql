CREATE TABLE `activityLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`actorId` int,
	`action` varchar(100) NOT NULL,
	`subject` varchar(240) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activityLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `budgetItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`name` varchar(180) NOT NULL,
	`category` varchar(100),
	`plannedAmount` decimal(12,2) NOT NULL DEFAULT '0',
	`actualAmount` decimal(12,2) NOT NULL DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `budgetItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`name` varchar(180) NOT NULL,
	`eventDate` timestamp NOT NULL,
	`venue` varchar(180),
	`city` varchar(120),
	`goal` text,
	`attendeeTarget` int NOT NULL DEFAULT 0,
	`readinessScore` int NOT NULL DEFAULT 0,
	`shareMode` enum('private','view-only','comment-only') NOT NULL DEFAULT 'private',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`company` varchar(180),
	`guestRole` varchar(140),
	`tag` enum('VIP','Media','Vendor','Staff') NOT NULL DEFAULT 'Staff',
	`rsvp` enum('Confirmed','Pending','Declined') NOT NULL DEFAULT 'Pending',
	`plusOne` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `guests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `layoutItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`venueId` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`label` varchar(100) NOT NULL,
	`x` decimal(7,2) NOT NULL DEFAULT '0',
	`y` decimal(7,2) NOT NULL DEFAULT '0',
	`color` varchar(20),
	CONSTRAINT `layoutItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`authorId` int,
	`title` varchar(200) NOT NULL,
	`body` text NOT NULL,
	`pinned` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplierId` int NOT NULL,
	`label` varchar(180),
	`amount` decimal(12,2) NOT NULL DEFAULT '0',
	`filePath` varchar(500),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scheduleItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`startTime` varchar(20) NOT NULL,
	`endTime` varchar(20),
	`title` varchar(240) NOT NULL,
	`owner` varchar(160),
	`location` varchar(160),
	`kind` enum('Milestone','Show flow','Crew','Guest') NOT NULL DEFAULT 'Show flow',
	`complete` boolean NOT NULL DEFAULT false,
	CONSTRAINT `scheduleItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`name` varchar(180) NOT NULL,
	`category` varchar(100),
	`contactName` varchar(160),
	`email` varchar(320),
	`status` enum('Inquiry','Quote received','Confirmed','Paid') NOT NULL DEFAULT 'Inquiry',
	`quoteAmount` decimal(12,2) NOT NULL DEFAULT '0',
	`paidAmount` decimal(12,2) NOT NULL DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`title` varchar(240) NOT NULL,
	`project` varchar(100),
	`ownerId` int,
	`status` enum('backlog','in-progress','review','done') NOT NULL DEFAULT 'backlog',
	`priority` enum('High','Medium','Low') NOT NULL DEFAULT 'Medium',
	`dueAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int,
	`name` varchar(160) NOT NULL,
	`description` text,
	`templateType` varchar(80),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `venues` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`name` varchar(180) NOT NULL,
	`address` text,
	`floorPlanPath` varchar(500),
	`layoutLocked` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `venues_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workspaceMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('owner','organiser','collaborator') NOT NULL DEFAULT 'collaborator',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workspaceMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workspaces_id` PRIMARY KEY(`id`)
);
