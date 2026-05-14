SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `registrations` (
  `id` int(11) NOT NULL,
  `studentName` varchar(150) NOT NULL,
  `studentID` varchar(20) NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `eventID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `registrations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_event_registration` (`eventID`);


ALTER TABLE `registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `registrations`
  ADD CONSTRAINT `fk_event_registration` FOREIGN KEY (`eventID`) REFERENCES `events` (`id`) ON DELETE CASCADE;
COMMIT;
