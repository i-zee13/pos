ALTER TABLE `organization`
  ADD COLUMN `print_logo`    VARCHAR(255) NULL AFTER `logo_img`,
  ADD COLUMN `refund_policy` TEXT         NULL AFTER `print_logo`;
