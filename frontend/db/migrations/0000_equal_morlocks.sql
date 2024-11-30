CREATE TABLE `Exercise` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`muscle_group` text NOT NULL,
	`equipment` text NOT NULL,
	`custom` integer DEFAULT 0 NOT NULL,
	`difficulty` text,
	`instructions` text,
	`created_by` integer NOT NULL,
	`video_id` text
);
--> statement-breakpoint
CREATE TABLE `ExerciseSet` (
	`exercise_sets_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reps` integer NOT NULL,
	`weight` integer NOT NULL,
	`template_item_id` integer NOT NULL,
	`template_id` integer NOT NULL,
	FOREIGN KEY (`template_item_id`) REFERENCES `TemplateItem`(`template_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`template_id`) REFERENCES `Template`(`template_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `History` (
	`history_id` integer PRIMARY KEY NOT NULL,
	`template_name` text NOT NULL,
	`elapsed_time` text NOT NULL,
	`calories_burned` integer NOT NULL,
	`date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `HistoryExercise` (
	`history_exercise_id` integer PRIMARY KEY NOT NULL,
	`history_id` integer NOT NULL,
	`exercise_name` text NOT NULL,
	`template_item_id` integer NOT NULL,
	`template_id` integer NOT NULL,
	`reps` integer NOT NULL,
	`weight` integer NOT NULL,
	FOREIGN KEY (`history_id`) REFERENCES `History`(`history_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`template_item_id`) REFERENCES `TemplateItem`(`template_item_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`template_id`) REFERENCES `Template`(`template_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Template` (
	`template_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`template_name` text NOT NULL,
	`custom` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `TemplateItem` (
	`template_item_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`template_item_name` text NOT NULL,
	`muscle_group` text NOT NULL,
	`template_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `Template`(`template_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exercise_id`) REFERENCES `Exercise`(`id`) ON UPDATE no action ON DELETE no action
);
