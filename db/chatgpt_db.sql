-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sty 04, 2025 at 04:23 PM
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
('8a994071-58b0-4b8c-8a56-a4cd062ac9f6', 12, 'Nowy czat', '2025-01-03 22:43:34', '2025-01-03 22:43:34'),
('c0d544f6-e7d4-498b-9ce9-fbf08d05d7ff', 12, 'Nowy czat', '2025-01-03 22:43:39', '2025-01-04 14:28:39'),
('e38c538a-9ccb-47e8-ba55-57e1e819465f', 12, 'Nowy czat', '2025-01-03 22:40:23', '2025-01-03 22:40:23');

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
(4, 'c0d544f6-e7d4-498b-9ce9-fbf08d05d7ff', 'user', 'ile to 2+2?', '2025-01-04 14:26:33'),
(5, 'c0d544f6-e7d4-498b-9ce9-fbf08d05d7ff', 'assistant', '2 + 2 equals 4.', '2025-01-04 14:26:33'),
(6, 'c0d544f6-e7d4-498b-9ce9-fbf08d05d7ff', 'user', 'Napisz jedno zdanie po polsku', '2025-01-04 14:27:34'),
(7, 'c0d544f6-e7d4-498b-9ce9-fbf08d05d7ff', 'assistant', 'Pogoda dzisiaj jest piękna i słoneczna.', '2025-01-04 14:27:34'),
(8, 'c0d544f6-e7d4-498b-9ce9-fbf08d05d7ff', 'user', 'Pamiętasz swoje odpowiedzi na 2 poprzednie pytania?', '2025-01-04 14:28:36'),
(9, 'c0d544f6-e7d4-498b-9ce9-fbf08d05d7ff', 'assistant', 'Tak, pamiętam. Odpowiedziałem, że 2 + 2 równa się 4, a następnie napisałem zdanie po polsku: \"Pogoda dzisiaj jest piękna i słoneczna.\" Jak mogę nadal pomóc?', '2025-01-04 14:28:39');

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
(12, 'triv', 'triv@example.com', '$2a$10$0FBqGiqg2PzPHkPye2AmquzRojRBGz6LfnByVL.8bGaARj/HrLj9m', '67dd5bb05bca7948f538ab5a46f7e7a0ca64076e', 1, '2024-12-29 19:57:34', 7);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
