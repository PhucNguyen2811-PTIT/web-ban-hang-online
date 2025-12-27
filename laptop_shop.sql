-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: laptop_shop
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `categoryID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitems`
--

DROP TABLE IF EXISTS `orderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitems` (
  `orderItemID` int NOT NULL AUTO_INCREMENT,
  `orderID` int NOT NULL,
  `productID` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`orderItemID`),
  KEY `orderID` (`orderID`),
  KEY `productID` (`productID`),
  CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`orderID`) REFERENCES `orders` (`orderID`),
  CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `products` (`productID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitems`
--

LOCK TABLES `orderitems` WRITE;
/*!40000 ALTER TABLE `orderitems` DISABLE KEYS */;
INSERT INTO `orderitems` VALUES (1,2,3,5,NULL),(2,2,5,2,NULL),(3,2,7,1,NULL),(4,2,8,1,NULL),(5,3,6,1,NULL),(6,3,12,1,NULL),(7,4,6,1,NULL),(8,4,17,1,NULL),(9,5,5,1,27990000.00);
/*!40000 ALTER TABLE `orderitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `orderID` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `totalPrice` decimal(10,2) DEFAULT NULL,
  `shippingAddress` text,
  `paymentMethod` enum('COD','bank','momo','vnpay') DEFAULT NULL,
  `status` enum('pending','in_progress','cancelled','completed') DEFAULT 'pending',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`orderID`),
  KEY `userID` (`userID`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (2,2,NULL,NULL,'COD','pending','2025-12-13 21:15:35','2025-12-22 10:12:55'),(3,2,NULL,NULL,'COD','pending','2025-12-22 11:37:51','2025-12-22 11:37:51'),(4,2,NULL,NULL,'COD','pending','2025-12-27 20:06:13','2025-12-27 20:06:13'),(5,2,27990000.00,NULL,'COD','pending','2025-12-27 21:14:31','2025-12-27 21:14:31');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productimage`
--

DROP TABLE IF EXISTS `productimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productimage` (
  `imageID` int NOT NULL AUTO_INCREMENT,
  `productID` int NOT NULL,
  `imageURL` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`imageID`),
  KEY `productID` (`productID`),
  CONSTRAINT `productimage_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `products` (`productID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productimage`
--

LOCK TABLES `productimage` WRITE;
/*!40000 ALTER TABLE `productimage` DISABLE KEYS */;
/*!40000 ALTER TABLE `productimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `productID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT '0',
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `categoryID` int DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `discountPrice` int DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`productID`),
  KEY `categoryID` (`categoryID`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `category` (`categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'HP Victus 15','HP',0,'Laptop gaming tầm trung, hiệu năng ổn định.',15000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_d_i_6_35.png\"]',NULL,2,'2025-11-21 18:55:11','2025-12-22 10:23:27',13500000,0),(2,'Lenovo Legion Pro','Lenovo',0,'Laptop gaming cao cấp, dành cho sáng tạo nội dung',55000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/plain/https://cellphones.com.vn/media/catalog/product//t/e/text_d_i_8_3.png\"]',NULL,2,'2025-11-21 18:55:11','2025-12-22 10:24:01',13500000,0),(3,'Asus TUF F15','Asus',1,'Laptop gaming tầm trung, hiệu năng tốt hơn.',16000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_d_i_5_6.png\"]',NULL,4,'2025-11-21 18:46:05','2025-12-22 10:24:16',15000000,0),(4,'Dell Vostro 3530','Dell',0,'Laptop văn phòng cấu hình mạnh, pin trâu.',18000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_659_2__8.png\"]',NULL,5,'2025-11-22 21:47:38','2025-12-22 10:29:21',17000000,0),(5,'ASUS TUF Gaming F16','Asus',1,'Laptop gaming cao cấp',27990000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_d_i_1__4_13.png\"]',NULL,7,'2025-12-06 13:51:30','2025-12-22 10:29:37',23990000,0),(6,'HP Pavilion 15','HP',0,'Laptop văn phòng bền bỉ',18990000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_659_5__2_2_1.png\"]',NULL,5,'2025-12-06 19:55:22','2025-12-22 10:29:52',16990000,0),(7,'HP Omen 16','HP',1,'Laptop gaming hiệu năng vượt trội',30000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_d_i_2__2_37.png\"]',NULL,6,'2025-12-06 19:58:50','2025-12-22 10:30:23',28000000,0),(8,'Lenovo ThinkPad E14 Gen 7','Lenovo',1,'Laptop văn phòng hiệu năng vượt trội',28999000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_69.png\"]',NULL,4,'2025-12-06 20:03:42','2025-12-22 10:33:49',27999000,0),(9,'Dell Gaming G15 5515','Dell',0,'Laptop gaming hiệu năng vượt trội',28999000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/r/g/rg.jpg\"]',NULL,4,'2025-12-06 21:05:12','2025-12-22 10:34:05',18999000,0),(10,'Dell Inspiron 14 5440','Dell',0,'Laptop văn phòng hiệu năng mạnh mẽ',28999000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_d_i_1__3_6.png\"]',NULL,9,'2025-12-06 21:08:03','2025-12-22 10:34:24',19999000,0),(11,'Dell XPS 13 9350','Dell',0,'Laptop cảm ứng hiệu năng mạnh mẽ',58999000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_659_40.png\"]',NULL,4,'2025-12-06 21:10:49','2025-12-22 10:34:39',39999000,0),(12,'ASUS VivoBook Go 14','Asus',0,'Laptop văn phòng mỏng nhẹ',18999000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_32.png\"]',NULL,5,'2025-12-06 21:13:04','2025-12-22 10:34:54',12999000,0),(13,'HP Victus 16','HP',0,'Laptop gaming giá rẻ, hiệu năng ổn định',28999000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_d_i_7_81.png\"]',NULL,1,'2025-12-06 21:15:40','2025-12-22 10:35:08',22999000,0),(14,'ASUS ROG Zephyrus G16','Asus',0,'Laptop gaming cao cấp, hiệu năng vượt trội',68999000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_d_i_1__4_18.png\"]',NULL,2,'2025-12-06 21:18:38','2025-12-22 10:22:48',62999000,0),(15,'ASUS TUF Gaming F17','Asus',0,'Laptop gaming hiệu năng vượt trội',28999000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/1/11h46.png\"]',NULL,1,'2025-12-06 21:32:14','2025-12-22 10:30:41',20999000,0),(16,'ASUS Gaming V16 ','Asus',0,'Laptop gaming mỏng nhẹ',25000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_d_i_1__4_12.png\"]',NULL,5,'2025-12-21 23:24:52','2025-12-22 09:53:59',23999998,0),(17,'Lenovo LOQ 15ARP9','Lenovo',0,'Laptop gaming giá rẻ',19000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_d_i_7_108.png\"]',NULL,3,'2025-12-22 00:11:31','2025-12-22 00:11:31',18000000,0),(18,'ASUS ROG Strix G16 G615JMR','Asus',0,'Laptop gaming cao cấp',45000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_874_1__2.png\"]',NULL,10,'2025-12-22 09:56:31','2025-12-22 09:56:31',41000000,0),(19,' HP 14-EP0220TU','HP',0,'Laptop văn phòng bền bỉ',14000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_659_3__6.png\"]',NULL,6,'2025-12-22 09:58:48','2025-12-22 09:58:48',12000000,0),(20,'HP Omnibook X Flip 14','HP',0,'Laptop cảm ứng cao cấp',50000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_823_5.png\"]',NULL,4,'2025-12-22 10:01:37','2025-12-22 10:01:37',45000000,0),(21,'Dell Alienware X15 R2','Dell',0,'Laptop gaming bền bỉ',50000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_-_2023-07-19t110021.996.png\"]',NULL,2,'2025-12-22 10:03:39','2025-12-22 10:03:39',30000000,0),(22,'Dell Inspiron 14 5441','Dell',0,'Laptop văn phòng AI',28000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_3__9_29.png\"]',NULL,3,'2025-12-22 10:05:49','2025-12-22 10:05:49',27000000,0),(23,'Dell 15 DC15255 ','Dell',0,'Laptop văn phòng giá rẻ',12000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_68.png\"]',NULL,12,'2025-12-22 10:08:14','2025-12-22 10:08:14',11000000,0),(24,'Lenovo IdeaPad Slim 3 14IRH10','Lenovo',0,'Laptop văn phòng giá rẻ',12300000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_659_1__8.png\"]',NULL,5,'2025-12-22 10:10:32','2025-12-22 10:10:32',12000000,0),(25,'Lenovo IdeaPad Slim 5 14Q8X9 ','Lenovo',0,'Laptop văn phòng AI',20000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_d_i_7_125.png\"]',NULL,6,'2025-12-22 10:12:24','2025-12-22 10:12:24',18000000,0),(26,'Lenovo ThinkBook 16 G8','Lenovo',0,'Laptop văn phòng mỏng nhẹ',18000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_744_1_61.png\"]',NULL,6,'2025-12-22 10:14:41','2025-12-22 10:14:41',16000000,0),(27,'Lenovo Legion 5 15IRX10','Lenovo',0,'Laptop gaming cao cấp',45000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_902_1_.png\"]',NULL,7,'2025-12-22 10:16:29','2025-12-22 10:16:29',40000000,0),(28,'Lenovo LOQ Essential 15IRX11','Lenovo',0,'Laptop gaming mỏng nhẹ',35000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_d_i_8_4.png\"]',NULL,5,'2025-12-22 10:18:23','2025-12-22 10:18:23',34000000,0),(29,'Lenovo Yoga Slim 7 14ILL10','Lenovo',0,'Laptop văn phòng AI',22000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_20__5_123.png\"]',NULL,6,'2025-12-22 10:20:11','2025-12-22 10:20:11',21000000,0),(30,'Lenovo ThinkPad X9-15 Gen 1 Aura Edition','Lenovo',0,'Laptop văn phòng AI cao cấp',50000000.00,'[\"https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_d_i_8_14.png\"]',NULL,3,'2025-12-22 10:22:05','2025-12-22 10:22:05',40000000,0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productspecs`
--

DROP TABLE IF EXISTS `productspecs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productspecs` (
  `specID` int NOT NULL AUTO_INCREMENT,
  `productID` int NOT NULL,
  `attribute` varchar(100) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`specID`),
  KEY `productID` (`productID`),
  CONSTRAINT `productspecs_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `products` (`productID`)
) ENGINE=InnoDB AUTO_INCREMENT=249 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productspecs`
--

LOCK TABLES `productspecs` WRITE;
/*!40000 ALTER TABLE `productspecs` DISABLE KEYS */;
INSERT INTO `productspecs` VALUES (80,17,'cpu','R5-7235HS'),(81,17,'ram','16GB'),(82,17,'gpu','NVIDIA GeForce RTX 3050 6GB'),(83,17,'battery','60Wh'),(84,17,'screen','15.6 inches'),(85,16,'cpu','CORE 7-240H'),(86,16,'ram','16GB'),(87,16,'gpu','NVIDIA GeForce RTX 5060 8GB'),(88,16,'battery','63Wh'),(89,16,'screen','16 inches'),(90,18,'cpu','I7-14650HX'),(91,18,'ram','32GB'),(92,18,'gpu','NVIDIA GeForce RTX 5060 8GB '),(93,18,'battery','90Wh'),(94,18,'screen','16 inches'),(95,19,'cpu','I3-1315U'),(96,19,'ram','16GB'),(97,19,'gpu','Intel UHD Graphics'),(98,19,'battery','41Wh'),(99,19,'screen','14 inches'),(100,20,'cpu','U5-226V'),(101,20,'ram','16GB'),(102,20,'gpu','Intel Arc 130V GPU (8GB)'),(103,20,'battery','59Wh'),(104,20,'screen','14 inches'),(105,21,'cpu','Intel Core i9-12900H'),(106,21,'ram','16GB'),(107,21,'gpu','NVIDIA GeForce RTX 3070 Ti'),(108,21,'battery','67Wh'),(109,21,'screen','15.6 inches'),(110,22,'cpu','Snapdragon X Plus X1P-64-100'),(111,22,'ram','16GB'),(112,22,'gpu','Qualcomm Adreno'),(113,22,'battery','54Wh'),(114,22,'screen','14 inches'),(115,23,'cpu','R7-7730U'),(116,23,'ram','16GB'),(117,23,'gpu','AMD Radeon Graphics'),(118,23,'battery','41Wh'),(119,23,'screen','15.6 inches'),(120,24,'cpu','I5-13420H'),(121,24,'ram','16GB'),(122,24,'gpu','Intel UHD Graphics'),(123,24,'battery','60Wh'),(124,24,'screen','14 inches'),(125,25,'cpu','Snapdragon X X1-26-100'),(126,25,'ram','16GB'),(127,25,'gpu','Qualcomm Adreno'),(128,25,'battery','57Wh'),(129,25,'screen','14 inches'),(130,26,'cpu','CORE 5-210H'),(131,26,'ram','16GB'),(132,26,'gpu','Intel Graphics'),(133,26,'battery','45Wh'),(134,26,'screen','16 inches'),(135,27,'cpu','I7-13650HX'),(136,27,'ram','16GB'),(137,27,'gpu','NVIDIA GeForce RTX 5060 8GB '),(138,27,'battery','80Wh'),(139,27,'screen','15.3 inches'),(140,28,'cpu','I5-13450HX'),(141,28,'ram','16GB'),(142,28,'gpu','NVIDIA GeForce RTX 5050 8GB'),(143,28,'battery','60Wh'),(144,28,'screen','15.6 inches'),(145,29,'cpu','U5-226V'),(146,29,'ram','16GB'),(147,29,'gpu','Intel Arc Graphics 130V'),(148,29,'battery','70Wh'),(149,29,'screen','14 inches'),(150,30,'cpu','U5-228V'),(151,30,'ram','32GB'),(152,30,'gpu','Intel Arc Graphics 130V'),(153,30,'battery','80Wh'),(154,30,'screen','15.3 inches'),(160,14,'cpu','Intel Core Ultra 9 285H'),(161,14,'ram','64GB LPDDR5X'),(162,14,'gpu','NVIDIA GeForce RTX 5070 Ti 12GB '),(163,14,'battery','90Wh'),(164,14,'screen','16 inches'),(165,1,'cpu','Intel Core i5-12450H'),(166,1,'ram','16GB DDR5 4800MHz'),(167,1,'gpu','NVIDIA RTX 2050 4GB'),(168,1,'battery','70Wh — dùng 6–7 tiếng'),(169,1,'screen','15.6 inches'),(170,2,'cpu','Intel Core i7-13650HX'),(171,2,'ram','16GB DDR5 4800MHz'),(172,2,'gpu','NVIDIA RTX 5050 8GB'),(173,2,'battery','70Wh — dùng 6–7 tiếng'),(174,2,'screen','15.3 inches'),(185,3,'cpu','Intel Core i7-13620HX'),(186,3,'ram','16GB DDR5 4800MHz'),(187,3,'gpu','NVIDIA RTX 4050 6GB'),(188,3,'battery','70Wh — dùng 6–7 tiếng'),(189,3,'screen','15.6 inches'),(190,4,'cpu','Intel Core i5-1334U'),(191,4,'ram','16GB DDR4 2666 MHz'),(192,4,'gpu','Intel UHD Graphics'),(193,4,'battery','80Wh — dùng 7–8 tiếng'),(194,4,'screen','15.6 inches'),(195,5,'cpu','Intel Core I5-13450HX'),(196,5,'ram','16GB DDR5'),(197,5,'gpu','NVIDIA GeForce RTX 5050 8GB'),(198,5,'battery','56Wh'),(199,5,'screen','16 inches'),(204,6,'cpu','Intel Core i5-1335U'),(205,6,'ram','16GB DDR4'),(206,6,'gpu','Intel Iris Xe'),(207,6,'battery','41Wh'),(208,6,'screen','15.6 inches'),(209,7,'cpu','Intel Core Ultra 7 255H '),(210,7,'ram','32GB DDR5'),(211,7,'gpu','NVIDIA GeForce RTX 5070 (8 GB GDDR7)'),(212,7,'battery','75Wh'),(213,7,'screen','16 inches'),(214,15,'cpu','Intel® Core™ i5-11400H '),(215,15,'ram','8GB DDR4'),(216,15,'gpu','NVIDIA® GeForce RTX™ 3050 '),(217,15,'battery','48Wh'),(218,15,'screen','17.3 inches'),(219,8,'cpu','Intel Core Ultra 7 255H '),(220,8,'ram','16GB DDR5'),(221,8,'gpu','Intel Arc 140T '),(222,8,'battery','48Wh'),(223,8,'screen','16 inches'),(224,9,'cpu','AMD Ryzen™ R5-5600H '),(225,9,'ram','8GB DDR4'),(226,9,'gpu','NVIDIA® GeForce RTX™ 3050 4GB '),(227,9,'battery','56Wh'),(228,9,'screen','15.6 inches'),(229,10,'cpu','Intel Core i5-1334U '),(230,10,'ram','16GB DDR4'),(231,10,'gpu','Intel Iris Xe Graphics '),(232,10,'battery','56Wh'),(233,10,'screen','14 inches'),(234,11,'cpu','Intel Core Ultra 5 226V '),(235,11,'ram','16GB LPDDR5X'),(236,11,'gpu','Intel Arc graphics '),(237,11,'battery','56Wh'),(238,11,'screen','13.4 inches'),(239,12,'cpu','AMD Ryzen 5 7520U'),(240,12,'ram','16GB LPDDR5'),(241,12,'gpu','AMD Radeon Graphics '),(242,12,'battery','56Wh'),(243,12,'screen','14 inches'),(244,13,'cpu','AMD Ryzen 5 7640HS'),(245,13,'ram','32GB DDR5'),(246,13,'gpu','NVIDIA GeForce RTX 4050 6 GB '),(247,13,'battery','70Wh'),(248,13,'screen','16.1 inches');
/*!40000 ALTER TABLE `productspecs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tempcart`
--

DROP TABLE IF EXISTS `tempcart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tempcart` (
  `cartID` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `productID` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cartID`),
  KEY `userID` (`userID`),
  KEY `productID` (`productID`),
  CONSTRAINT `tempcart_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`),
  CONSTRAINT `tempcart_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `products` (`productID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tempcart`
--

LOCK TABLES `tempcart` WRITE;
/*!40000 ALTER TABLE `tempcart` DISABLE KEYS */;
/*!40000 ALTER TABLE `tempcart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'abd','abd@gmail.com','$2b$10$sK69WYtUzO5RpMsSlCKrnu3Cm5zVJFqkawA7xWruc5GaDggW4/kyq','0123','user','2025-11-23 21:06:56','2025-11-23 21:06:56'),(2,'ert','nhp@gmail.com','$2b$10$OZ0Ma9osHRqHwIiI3p4icOG.v/gXyv9pEim4OFXv3X1PMuo7DHRc6','2233','user','2025-11-23 22:43:48','2025-11-23 22:43:48'),(3,'Nguyễn Hoàng Phúc','ak47@gmail.com','$2b$10$64hSmBek.iemN51r3YA2x.7/Vq/rzUsZNONoJASc3rxObdR8KSH6O','0123','admin','2025-12-18 20:51:48','2025-12-18 21:13:26');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-27 23:54:46
