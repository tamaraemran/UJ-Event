
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `eventTitle` varchar(255) NOT NULL,
  `eventDate` date NOT NULL,
  `eventTime` time NOT NULL,
  `eventLocation` varchar(255) NOT NULL,
  `eventCategory` varchar(255) NOT NULL,
  `eventDescription` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

=
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
