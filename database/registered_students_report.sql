SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `registered_students_report`  AS SELECT `e`.`eventTitle` AS `Event Name`, `r`.`studentName` AS `Student Name`, `r`.`studentID` AS `Student ID` FROM (`registrations` `r` join `events` `e` on(`r`.`eventID` = `e`.`id`)) ;

COMMIT;
