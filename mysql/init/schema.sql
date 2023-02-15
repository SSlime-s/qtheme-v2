DROP DATABASE IF EXISTS `qtheme`;

CREATE DATABASE `qtheme`;

USE `qtheme`;

CREATE TABLE IF NOT EXISTS `theme_types` (`name` VARCHAR(32) NOT NULL PRIMARY KEY) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO
  `theme_types` (`name`)
VALUES
  ('light'),
  ('dark');

CREATE TABLE IF NOT EXISTS `visibility_types` (`name` VARCHAR(32) NOT NULL PRIMARY KEY) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO
  `visibility_types` (`name`)
VALUES
  ('public'),
  ('private'),
  ('draft');

CREATE TABLE IF NOT EXISTS `theme_tags` (
  `id` CHAR(26) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `themes` (
  `id` CHAR(26) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `author_user_id` VARCHAR(32) NOT NULL,
  `visibility` VARCHAR(32) NOT NULL,
  `type` VARCHAR(32),
  `theme` JSON NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`type`) REFERENCES `theme_types` (`name`) ON DELETE
  SET
    NULL ON UPDATE CASCADE,
    FOREIGN KEY (`visibility`) REFERENCES `visibility_types` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE VIEW `users` AS
SELECT
  `author_user_id` AS `id`,
  COUNT(*) AS `count`
FROM
  `themes`
GROUP BY
  `author_user_id`;

CREATE TABLE IF NOT EXISTS `theme_versions` (
  `id` CHAR(26) NOT NULL PRIMARY KEY,
  `theme_id` CHAR(26) NOT NULL,
  `version` VARCHAR(255) NOT NULL,
  `theme` JSON NOT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `created_at` (`created_at`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `theme_tag_relations` (
  `theme_id` CHAR(26) NOT NULL,
  `tag_id` CHAR(26) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`theme_id`, `tag_id`),
  FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `theme_tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `likes` (
  `user_id` VARCHAR(32) NOT NULL,
  `theme_id` CHAR(26) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `theme_id`),
  FOREIGN KEY (`theme_id`) REFERENCES `themes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;