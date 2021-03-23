-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 23, 2021 at 06:11 PM
-- Server version: 10.3.28-MariaDB-log
-- PHP Version: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nevilmil_nodemysql`
--

-- --------------------------------------------------------

--
-- Table structure for table `answer`
--

CREATE TABLE `answer` (
  `questionnumber` int(5) NOT NULL,
  `answerletter` char(1) NOT NULL,
  `answertext` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `answer`
--

INSERT INTO `answer` (`questionnumber`, `answerletter`, `answertext`) VALUES
(1, 'a', '10'),
(1, 'b', '25'),
(1, 'c', '-10'),
(1, 'd', '-25'),
(2, 'a', 'undefined'),
(2, 'b', 'Not defined'),
(2, 'c', '5');

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `questionnumber` int(5) NOT NULL,
  `questiontext` varchar(512) DEFAULT NULL,
  `correctanswer` char(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`questionnumber`, `questiontext`, `correctanswer`) VALUES
(1, 'What will the console print?\nconst foo = function(a, b) {\n  a  = b;\n  return a * (a - b);\n};\nconst num = foo(2, 3);\nconsole.log(num);\n', 'a'),
(2, 'What will the console print?\nconst arr = [1, 2, 3, 4, 5];\nconst obj = { 1: arr.length };\nconsole.log(obj[1]);', 'c');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answer`
--
ALTER TABLE `answer`
  ADD PRIMARY KEY (`questionnumber`,`answerletter`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`questionnumber`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answer`
--
ALTER TABLE `answer`
  ADD CONSTRAINT `fk_questionnumber` FOREIGN KEY (`questionnumber`) REFERENCES `question` (`questionnumber`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
