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
	`exercise_id` integer NOT NULL,
	`sets` integer NOT NULL,
	`reps` integer NOT NULL,
	`weight` integer NOT NULL,
	FOREIGN KEY (`history_id`) REFERENCES `History`(`history_id`) ON UPDATE no action ON DELETE no action
);
