-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sty 27, 2025 at 04:44 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chatgpt_db`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `chats`
--

CREATE TABLE `chats` (
  `id` char(36) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT 'Nowy czat',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`id`, `user_id`, `title`, `created_at`, `updated_at`) VALUES
('04ebaf93-b46b-4226-a2a1-97f39185cb44', 12, 'Napisz jedno zdanie po polsku', '2025-01-26 23:16:21', '2025-01-26 23:16:23');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `chat_id` char(36) NOT NULL,
  `role` enum('user','assistant','system') NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `chat_id`, `role`, `content`, `created_at`) VALUES
(14, '04ebaf93-b46b-4226-a2a1-97f39185cb44', 'user', 'Napisz jedno zdanie po polsku', '2025-01-26 23:16:21'),
(15, '04ebaf93-b46b-4226-a2a1-97f39185cb44', 'assistant', 'Księżyc świeci jasno na nocnym niebie, oświetlając mroczne zakątki świata.', '2025-01-26 23:16:23');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `payment_history`
--

CREATE TABLE `payment_history` (
  `id` int(11) NOT NULL,
  `payment_id` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `tokens_added` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_history`
--

INSERT INTO `payment_history` (`id`, `payment_id`, `user_id`, `tokens_added`, `created_at`) VALUES
(54, 'cs_test_a1L44aOVodtwu3au6LMCy6Ik5t0dV2RrWEjVgxti1DzuakXlCShXH1Byzc', 12, 50, '2025-01-20 23:03:56'),
(56, 'cs_test_a1XcjQf3EXb6eMqJqXa0OdqpsvEmsEN1c9cYLCGfRXgFiyR2XABng57dba', 12, 50, '2025-01-20 23:06:27'),
(58, 'cs_test_a1hhv3XdQfOjC7fDYsVxhiok0dY40XlTGSMy9eh5CBsxDOMQjxaNQznzAZ', 12, 50, '2025-01-20 23:07:46'),
(60, 'cs_test_a1OAxHvszipC1tqL1ujJ1svjTfVOI7hXSzaMS83Rombjoh5eLfshnxIDze', 12, 50, '2025-01-20 23:13:37'),
(61, 'cs_test_a1PLpaFYirGUkHfQQt02AZPnMTMzYZNSFNWjlOODtQwQkjAyxtKAK42edn', 12, 50, '2025-01-20 23:18:34'),
(62, 'cs_test_a1BPmASGgcMuJUEXiSr2d5ybV6M6BX3MQDdrjMBb1Gij6PXR8nRR66wjsc', 12, 50, '2025-01-20 23:27:10'),
(63, 'cs_test_a15gYcnwPtD5LsJ56IyQVXRhoEad1x4G1LbweFPS4FPP7eBC8PflICKkZm', 12, 50, '2025-01-21 04:45:37'),
(64, 'cs_test_a19rtG53AcLPanfK7ZGj8hoo8cGqtFxvtNHXAiUQSiqnV8VYBcfq6Wh9z7', 12, 50, '2025-01-21 04:58:44'),
(65, 'cs_test_a1H3nRWp6UMCYui4Sdl8kMYMNI6J7QckHtM0C0KB1iLdhelO7UpIAY34Ro', 12, 150, '2025-01-21 05:01:39'),
(66, 'cs_test_a1fTMbwcaBDexPN3NtzWj1dbuIJ1ifmBMF1H7izlbt1ms5W5am8d2O84U5', 12, 50, '2025-01-21 14:20:55');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `activation_token` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `tokens` int(11) DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `activation_token`, `is_active`, `created_at`, `tokens`) VALUES
(12, 'triv', 'triv@example.com', '$2a$10$0FBqGiqg2PzPHkPye2AmquzRojRBGz6LfnByVL.8bGaARj/HrLj9m', '67dd5bb05bca7948f538ab5a46f7e7a0ca64076e', 1, '2024-12-29 19:57:34', 4);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeksy dla tabeli `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_id` (`chat_id`);

--
-- Indeksy dla tabeli `payment_history`
--
ALTER TABLE `payment_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_id` (`payment_id`),
  ADD UNIQUE KEY `payment_id_2` (`payment_id`),
  ADD UNIQUE KEY `unique_payment` (`payment_id`),
  ADD UNIQUE KEY `idx_payment_id` (`payment_id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `payment_history`
--
ALTER TABLE `payment_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
