-- =====================================================================
--  ORGANIZATION PRINT SECTION
--  -------------------------------------------------------------------
--  `organization` table mein print logo aur refund policy ke columns.
--  Yeh values Organization page > "Print Section" se save hoti hain
--  aur invoice print par dynamically use hoti hain.
-- =====================================================================

ALTER TABLE `organization`
  ADD COLUMN `print_logo`    VARCHAR(255) NULL AFTER `logo_img`,
  ADD COLUMN `refund_policy` TEXT         NULL AFTER `print_logo`;
