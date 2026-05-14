-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 06 مايو 2026 الساعة 21:52
-- إصدار الخادم: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uj_event_db`
--

-- --------------------------------------------------------

--
-- بنية الجدول `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `dob` date NOT NULL,
  `language` varchar(30) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- بنية الجدول `events`
--

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

--
-- إرجاع أو استيراد بيانات الجدول `events`
--

INSERT INTO `events` (`id`, `eventTitle`, `eventDate`, `eventTime`, `eventLocation`, `eventCategory`, `eventDescription`, `created_at`) VALUES
(17, 'AI in Healthcare Workshop', '2026-05-08', '10:30:00', 'Conference Center University of Jeddah', 'Workshop', 'An interactive workshop exploring how artificial intelligence is transforming healthcare through smart diagnosis systems, medical imaging analysis, and patient data management.', '2026-05-06 19:37:47'),
(18, 'Mental Health Awareness Talk', '2026-05-14', '13:00:00', 'Online', 'Seminar', 'An open discussion about stress management, student wellbeing, and maintaining healthy study habits.', '2026-05-06 19:39:20'),
(19, 'University Talent Show', '2026-05-12', '17:15:00', 'Princess Al-Jawhara Hall University of Jeddah', 'other', 'A social event where students perform music, poetry, art, and other creative talents in front of the university community.', '2026-05-06 19:40:41'),
(21, 'GreenTech Sustainability Hackathon', '2026-05-20', '18:00:00', 'Conference Center University of Jeddah', 'Hackathon', 'A collaborative hackathon focused on creating technology-driven solutions for environmental and sustainability challenges. Teams will work on ideas related to renewable energy, waste reduction, smart recycling, and eco-friendly campus initiatives, ending with project demonstrations and judging sessions.', '2026-05-06 19:46:43'),
(22, 'Code Sprint Programming Competition', '2026-05-11', '22:00:00', 'Building 11 College of Computer Science and Engineering', 'Competition', 'A competitive coding event that tests participants’ problem-solving and programming skills through timed algorithmic challenges. Students compete individually or in teams to solve real-world inspired tasks, improve logical thinking, and rank on a live leaderboard throughout the event.', '2026-05-06 19:49:18'),
(23, 'Creative Photography Workshop', '2026-05-07', '11:00:00', 'Building 17', 'Workshop', 'A hands-on workshop covering photography basics, composition techniques, and mobile photo editing.', '2026-05-06 19:50:22');

-- --------------------------------------------------------

--
-- Stand-in structure for view `registered_students_report`
-- (See below for the actual view)
--
CREATE TABLE `registered_students_report` (
`Event Name` varchar(255)
,`Student Name` varchar(150)
,`Student ID` varchar(20)
);

-- --------------------------------------------------------

--
-- بنية الجدول `registrations`
--

CREATE TABLE `registrations` (
  `id` int(11) NOT NULL,
  `studentName` varchar(150) NOT NULL,
  `studentID` varchar(20) NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `eventID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure for view `registered_students_report`
--
DROP TABLE IF EXISTS `registered_students_report`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `registered_students_report`  AS SELECT `e`.`eventTitle` AS `Event Name`, `r`.`studentName` AS `Student Name`, `r`.`studentID` AS `Student ID` FROM (`registrations` `r` join `events` `e` on(`r`.`eventID` = `e`.`id`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registrations`
--
ALTER TABLE `registrations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_event_registration` (`eventID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `registrations`
--
ALTER TABLE `registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- قيود الجداول المُلقاة.
--

--
-- قيود الجداول `registrations`
--
ALTER TABLE `registrations`
  ADD CONSTRAINT `fk_event_registration` FOREIGN KEY (`eventID`) REFERENCES `events` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
