-- =====================================================================
--  BACKUP MODULE TABLES (run once on live DB if tables do not exist)
--  Safe to run: uses CREATE TABLE IF NOT EXISTS
-- =====================================================================

CREATE TABLE IF NOT EXISTS `backup_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tenant_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `zip_filename` varchar(255) DEFAULT NULL,
  `local_relative_path` varchar(512) DEFAULT NULL,
  `databases` json NOT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'pending',
  `size_bytes` bigint unsigned DEFAULT NULL,
  `gdrive_uploaded` tinyint(1) NOT NULL DEFAULT '0',
  `gdrive_remote_path` varchar(512) DEFAULT NULL,
  `error_message` text,
  `triggered_by` varchar(32) NOT NULL DEFAULT 'manual',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `backup_logs_tenant_id_index` (`tenant_id`),
  KEY `backup_logs_user_id_index` (`user_id`),
  KEY `backup_logs_status_index` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_backup_mail_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tenant_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `gmail` varchar(255) NOT NULL,
  `app_password_encrypted` text,
  `google_drive_refresh_token_encrypted` text,
  `google_drive_access_token_encrypted` text,
  `google_drive_token_expires_at` timestamp NULL DEFAULT NULL,
  `google_drive_folder_id` varchar(255) DEFAULT NULL,
  `google_drive_folder_name` varchar(255) DEFAULT NULL,
  `google_drive_connected_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_backup_mail_settings_user_id_unique` (`user_id`),
  KEY `user_backup_mail_settings_tenant_id_index` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- If tables already existed from an older backup install, add missing columns:
-- ALTER TABLE `backup_logs` ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `backup_logs_tenant_id_index` (`tenant_id`);
-- ALTER TABLE `user_backup_mail_settings` ADD COLUMN `tenant_id` BIGINT UNSIGNED NULL AFTER `id`, ADD INDEX `user_backup_mail_settings_tenant_id_index` (`tenant_id`);
-- ALTER TABLE `user_backup_mail_settings`
--     ADD COLUMN `google_drive_refresh_token_encrypted` TEXT NULL AFTER `app_password_encrypted`,
--     ADD COLUMN `google_drive_access_token_encrypted` TEXT NULL AFTER `google_drive_refresh_token_encrypted`,
--     ADD COLUMN `google_drive_token_expires_at` TIMESTAMP NULL AFTER `google_drive_access_token_encrypted`,
--     ADD COLUMN `google_drive_folder_id` VARCHAR(255) NULL AFTER `google_drive_token_expires_at`,
--     ADD COLUMN `google_drive_folder_name` VARCHAR(255) NULL AFTER `google_drive_folder_id`,
--     ADD COLUMN `google_drive_connected_at` TIMESTAMP NULL AFTER `google_drive_folder_name`;

UPDATE `backup_logs` SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
UPDATE `user_backup_mail_settings` SET `tenant_id` = 1 WHERE `tenant_id` IS NULL;
