CREATE TABLE `Exercise` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`muscleGroup` text NOT NULL,
	`equipment` text NOT NULL,
	`custom` integer,
	`instructions` text
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
CREATE TABLE `Template` (
	`template_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`template_name` text NOT NULL,
	`custom` integer
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
