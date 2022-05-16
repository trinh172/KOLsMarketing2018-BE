DROP TABLE IF EXISTS post_categories;
DROP TABLE IF EXISTS check_read_room;
DROP TABLE IF EXISTS image_job;
DROP TABLE IF EXISTS job_describe;
DROP TABLE IF EXISTS job_comment;
DROP TABLE IF EXISTS job_member;
DROP TABLE IF EXISTS kols_like_brands;
DROP TABLE IF EXISTS kols_like_post;
DROP TABLE IF EXISTS brands_like_kols;
DROP TABLE IF EXISTS image_recruitment;
DROP TABLE IF EXISTS image_post;
DROP TABLE IF EXISTS image_user;
DROP TABLE IF EXISTS recruitment;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS message;
-- ----------------------------
-- Table structure for KOLs/Influencers
-- ----------------------------
DROP TABLE IF EXISTS kols;
CREATE TABLE kols (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 10
),
  "full_name" varchar(255),
  "email" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "nick_name" varchar(50),
  "address" varchar(5),
  "phone" varchar(15),
  "gender" char,
  "follows" int4,
  "introduce" varchar(500),
  "birthday" timestamp,
	"create_time" timestamp NOT NULL,
  "state" char NOT NULL DEFAULT '1',
	"otp" int4,
	PRIMARY KEY ("id")
)
;

-- ----------------------------
-- Table structure for Brands
-- ----------------------------
DROP TABLE IF EXISTS brands;
CREATE TABLE brands (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 10
),
  "email" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "full_name" varchar(255),
  "brand_name" varchar(50),
  "address" varchar(5),
  "phone" varchar(15),
	"create_time" timestamp,
  "gender" char,
  "introduce" varchar(500),
  "state" char NOT NULL DEFAULT '1',
	"otp" int4,
	PRIMARY KEY ("id")
)
;

-- ----------------------------
-- Table structure for Posts
-- ----------------------------
CREATE TABLE "posts" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 10
    ),
  "title" varchar(255) NOT NULL,
  "gender" varchar(50),
  "id_writer" int4 NOT NULL,
  "amount" int4,
  "min_cast" int4 NOT NULL,
  "max_cast" int4,
  "state" char NOT NULL DEFAULT '1',
  "content" varchar NOT NULL,
  "requirement" varchar,
  "benefit" varchar,
  "address" varchar(50),
  "write_time" timestamp NOT NULL,
  "views" int4 NOT NULL DEFAULT '0',
  "hot" char NOT NULL DEFAULT '0',
  PRIMARY KEY ("id")
)
;
-- ----------------------------
-- Table structure for Categories
-- ----------------------------
DROP TABLE IF EXISTS "categories";
CREATE TABLE "categories" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 10
    ),
  "name" varchar(50) NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("name")
) 
;

-- ----------------------------
-- Table structure for bio_url
-- ----------------------------
DROP TABLE IF EXISTS "bio_url";
CREATE TABLE "bio_url" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 10
    ),
  "id_user" int4 NOT NULL,
  "role" char NOT NULL DEFAULT '1',
  "url" varchar(255) NOT NULL,
  "type" char NOT NULL DEFAULT '1',
  PRIMARY KEY ("id")
) 
;

-- ----------------------------
-- Table structure for Recruitment
-- State 1: chua duyet, 2: reject, 3: accept 
-- ----------------------------
CREATE TABLE "recruitment" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 10
    ),
  "id_post" int4 NOT NULL,
  "id_kols" int4 NOT NULL,
  "id_brands" int4 NOT NULL,
  "content" varchar(1000) NOT NULL,
  "state" char NOT NULL DEFAULT '1',
  "create_time" timestamp,
  "url" varchar(255),
  PRIMARY KEY ("id"),
  UNIQUE ("id_post","id_kols", "id_brands"),
  CONSTRAINT "recruit_kols" FOREIGN KEY ("id_kols") REFERENCES "kols" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "recruit_posts" FOREIGN KEY ("id_post") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "recruit_brands" FOREIGN KEY ("id_brands") REFERENCES "brands" ("id") ON DELETE CASCADE ON UPDATE CASCADE
) 
;
-- ----------------------------
-- Table structure for PostCate
-- ----------------------------
CREATE TABLE "post_categories" (
  "id_post" int4 NOT NULL,
  "id_cate" int4 NOT NULL,
  PRIMARY KEY ("id_post","id_cate"),
  CONSTRAINT "PostCate1" FOREIGN KEY ("id_post") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "PostCate2" FOREIGN KEY ("id_cate") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
) 
;
-- ----------------------------
-- Table structure for Image_Recruitment
-- ----------------------------
CREATE TABLE "image_recruitment" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 10
    ),
  "id_recruitment" int4 NOT NULL,
  "url" varchar(255) NOT NULL,
  "type" char NOT NULL DEFAULT '1',
  PRIMARY KEY ("id"),
  CONSTRAINT "recruit_image" FOREIGN KEY ("id_recruitment") REFERENCES "recruitment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
) 
;
-- ----------------------------
-- Table structure for Image_Post, type = 2: cover, type = 1: detail picture
-- ----------------------------
CREATE TABLE "image_post" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 10
    ),
  "id_post" int4 NOT NULL,
  "url" varchar(255) NOT NULL,
  "type" char NOT NULL DEFAULT '1',
  PRIMARY KEY ("id"),
  CONSTRAINT "post_image" FOREIGN KEY ("id_post") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
) 
;

-- ----------------------------
-- Table structure for PostCate
-- ----------------------------
CREATE TABLE "kols_like_post" (
  "id_kol" int4 NOT NULL,
  "id_post" int4 NOT NULL,
  PRIMARY KEY ("id_post","id_kol"),
  CONSTRAINT "KolLikePost1" FOREIGN KEY ("id_post") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "KolLikePost2" FOREIGN KEY ("id_kol") REFERENCES "kols" ("id") ON DELETE CASCADE ON UPDATE CASCADE
) 
;

-- ----------------------------
-- Table structure for PostCate
-- ----------------------------
CREATE TABLE "kols_like_brands" (
  "id_kol" int4 NOT NULL,
  "id_brand" int4 NOT NULL,
  PRIMARY KEY ("id_kol","id_brand"),
  CONSTRAINT "KolLikeBrand1" FOREIGN KEY ("id_kol") REFERENCES "kols" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "KolLikeBrand2" FOREIGN KEY ("id_brand") REFERENCES "brands" ("id") ON DELETE CASCADE ON UPDATE CASCADE
) 
;

-- ----------------------------
-- Table structure for PostCate
-- ----------------------------
CREATE TABLE "brands_like_kols" (
  "id_brand" int4 NOT NULL,
  "id_kol" int4 NOT NULL,
  PRIMARY KEY ("id_brand","id_kol"),
  CONSTRAINT "BrandLikeKol1" FOREIGN KEY ("id_brand") REFERENCES "brands" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "BrandLikeKol2" FOREIGN KEY ("id_kol") REFERENCES "kols" ("id") ON DELETE CASCADE ON UPDATE CASCADE
) 
;

-- ----------------------------
-- Table structure for Image_Recruitment
-- ----------------------------
-- type 1: avatar, 2: gioi thieu
CREATE TABLE "image_user" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 10
    ),
  "id_user" int4 NOT NULL,
  "role" char NOT NULL DEFAULT '1',
  "url" varchar(255) NOT NULL,
  "type" char NOT NULL DEFAULT '2',
  PRIMARY KEY ("id")
) 
;

-- ----------------------------
-- Table structure for room
-- ----------------------------
-- role 1: kol, 2: brand
-- state: 1 - read all message, 0 - not read all message
DROP TABLE IF EXISTS "room";
CREATE TABLE "room" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 10
    ),
  "id_user1" int4 NOT NULL,
  "role1"  char NOT NULL DEFAULT '1',
  "id_user2" int4 NOT NULL,
  "role2" char NOT NULL DEFAULT '1',
  "time" timestamp,
  PRIMARY KEY ("id")
) 
;
-- ----------------------------
-- Table structure for check_read_room
-- ----------------------------
-- role 1: kol, 2: brand
-- state: 1 - read all message, 0 - not read all message

CREATE TABLE "check_read_room" (
  "id_room" int4 NOT NULL,
  "id_user" int4 NOT NULL,
  "role" char NOT NULL DEFAULT '1',
  "state" char NOT NULL DEFAULT '1',
  PRIMARY KEY ("id_room", "id_user", "role")
) 
;
ALTER TABLE "check_read_room" ADD CONSTRAINT "read_room" FOREIGN KEY ("id_room") REFERENCES "room" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- ----------------------------
-- Table structure for message
-- ----------------------------
-- role 1: kol, 2: brand
CREATE TABLE "message" (
   "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 10
    ),
  "id_room" int4 NOT NULL,
  "id_user" int4 NOT NULL,
  "role" char NOT NULL DEFAULT '1',
  "content" varchar(500) NOT NULL,
  "create_time" timestamp NOT NULL,
  PRIMARY KEY ("id")
) 
;

ALTER TABLE "posts" ADD CONSTRAINT "UniqueTitle" UNIQUE ("title","id_writer");
ALTER TABLE "posts" ADD CONSTRAINT "PostBrands" FOREIGN KEY ("id_writer") REFERENCES "brands" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "message" ADD CONSTRAINT "message_room" FOREIGN KEY ("id_room") REFERENCES "room" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Table structure for job_describe
-- ----------------------------
CREATE TABLE "job_describe" (
   "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 10
    ),
  "id_post" int4 NOT NULL,
  "id_brand" int4 NOT NULL,
  "content" varchar(500) NOT NULL,
  "create_time" timestamp NOT NULL,
  PRIMARY KEY ("id")
) 
;
ALTER TABLE "job_describe" ADD CONSTRAINT "jobdescribe_post" FOREIGN KEY ("id_post") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "job_describe" ADD CONSTRAINT "jobdescribe_brand" FOREIGN KEY ("id_brand") REFERENCES "brands" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- ----------------------------
-- Table structure for image_job, type 1
-- ----------------------------
CREATE TABLE "image_job" (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 10
    ),
  "id_job" int4 NOT NULL,
  "url" varchar(255) NOT NULL,
  "type" char NOT NULL DEFAULT '1',
  PRIMARY KEY ("id"),
  CONSTRAINT "jobimage_job" FOREIGN KEY ("id_job") REFERENCES "job_describe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
) 
;
-- ----------------------------
-- Table structure for job_comment
-- ----------------------------
-- role 1: kol, 2: brand
CREATE TABLE "job_comment" (
   "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 10
    ),
  "id_post" int4 NOT NULL,
  "id_user" int4 NOT NULL,
  "role" char NOT NULL DEFAULT '1',
  "content" varchar(500) NOT NULL,
  "url" varchar(255),
  "create_time" timestamp NOT NULL,
  PRIMARY KEY ("id")
) 
;
ALTER TABLE "job_comment" ADD CONSTRAINT "jobcomment_post" FOREIGN KEY ("id_post") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Table structure for job_comment
-- ----------------------------
-- state 1: kol not done work, 2: kol done work, 3: brand 
CREATE TABLE "job_member" (
   "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 10
    ),
  "id_post" int4 NOT NULL,
  "id_user" int4 NOT NULL,
  "role" char NOT NULL DEFAULT '1',
  "state" char NOT NULL DEFAULT '1',
  "create_time" timestamp NOT NULL,
  PRIMARY KEY ("id")
) 
;
ALTER TABLE "job_member" ADD CONSTRAINT "jobmember_post" FOREIGN KEY ("id_post") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Records of categories
-- ----------------------------
BEGIN;
INSERT INTO categories OVERRIDING SYSTEM VALUE VALUES (1, 'Video');
INSERT INTO categories OVERRIDING SYSTEM VALUE VALUES (2, 'PR');
INSERT INTO categories OVERRIDING SYSTEM VALUE VALUES (3, 'Chụp ảnh');
INSERT INTO categories OVERRIDING SYSTEM VALUE VALUES (4, 'Livestream');
COMMIT;

-- ----------------------------
-- Records of user
-- kols pass: kols1234
-- brand pass: kols1234
-- ----------------------------
BEGIN;
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (1, 'Phương Xuân', 'kol1@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, null, null, null, null, null, null, '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (2, 'Lan Anh', 'kol2@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, null, null, null, null, null, null, '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (3, 'Ngọc Trúc', 'kol3@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, null, null, null, null, null, null, '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (4, 'Trần Nam', 'kol4@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, null, null, null, null, null, null, '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (5, 'Phương Thảo', 'kol5@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, null, null, null, null, null, null, '2022-04-21 13:15:42.579', '1', -1);

INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (1,'brand1@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Trần Huy', 'Trà sữa Huy Tea', '79', '1111111111',  '2022-04-21 13:15:42.579', '1', null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (2,'brand2@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Ngọc Nga', 'Shop quần áo Ngọc Nga', '36', '2222222222',  '2022-04-21 13:15:42.579', '1', null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (3,'brand3@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Minh Anh', 'Thời trang Anh Anh', '01', '3333333333',  '2022-04-21 13:15:42.579', '1', null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (4,'brand4@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Trần Tiến', 'Shop Tiến Nguyễn', '01', '444444444',  '2022-04-21 13:15:42.579', '1', null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (5,'brand5@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Minh Hậu', 'Gaming Hậu', '92', '555555555',  '2022-04-21 13:15:42.579', '1', null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (6,'brand6@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Ngọc Anh', 'Quần áo Ngọc Anh', '92', '6666666666',  '2022-04-21 13:15:42.579', '1', null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (7,'brand7@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Trần Trà', 'Trà sữa Yoyo', '75', '7777777777',  '2022-04-21 13:15:42.579', '1', null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (8,'brand8@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Trúc Nguyễn', 'Trúc Nguyễn shop', '79', '888888888',  '2022-04-21 13:15:42.579', '1', null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (9,'brand9@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Long Phan', 'Long Fashion', '01', '0999999999',  '2022-04-21 13:15:42.579', '1', null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (10,'brand10@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Minh Nguyễn', 'Thức ăn cho bé', '79', '1010101010',  '2022-04-21 13:15:42.579', '1', null, '1', -1);
COMMIT;

-- ----------------------------
-- Records of room and message
-- ----------------------------
BEGIN;
INSERT INTO room OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1, 2, '2022-04-21 13:15:42.579');
INSERT INTO room OVERRIDING SYSTEM VALUE VALUES (2, 1, 1, 3, 2, '2022-04-20 13:15:42.579');
INSERT INTO room OVERRIDING SYSTEM VALUE VALUES (3, 1, 1, 2, 1, '2022-04-22 13:15:42.579');
INSERT INTO room OVERRIDING SYSTEM VALUE VALUES (4, 2, 1, 3, 2);

INSERT INTO check_read_room OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1);
INSERT INTO check_read_room OVERRIDING SYSTEM VALUE VALUES (1, 1, 2, 0);
INSERT INTO check_read_room OVERRIDING SYSTEM VALUE VALUES (2, 1, 1, 1);
INSERT INTO check_read_room OVERRIDING SYSTEM VALUE VALUES (2, 3, 2, 1);
INSERT INTO check_read_room OVERRIDING SYSTEM VALUE VALUES (3, 1, 1, 0);
INSERT INTO check_read_room OVERRIDING SYSTEM VALUE VALUES (3, 2, 1, 1);
INSERT INTO check_read_room OVERRIDING SYSTEM VALUE VALUES (4, 3, 2, 0);
INSERT INTO check_read_room OVERRIDING SYSTEM VALUE VALUES (4, 2, 1, 1);

INSERT INTO message OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1, 'đây là tin nhắn của id 1 role 1', '2022-04-21 13:15:42.579');
INSERT INTO message OVERRIDING SYSTEM VALUE VALUES (2, 1, 1, 2, 'đây là tin nhắn thứ nhất của id 1 role 2', '2022-04-21 13:15:42.579');
INSERT INTO message OVERRIDING SYSTEM VALUE VALUES (3, 1, 1, 2, 'đây là tin nhắn thứ 2 của id 1 role 2', '2022-04-21 13:15:42.579');

INSERT INTO message OVERRIDING SYSTEM VALUE VALUES (4, 2, 1, 1, 'đây là tin nhắn thứ 2 của id 1 role 1', '2022-04-21 13:15:42.579');
INSERT INTO message OVERRIDING SYSTEM VALUE VALUES (5, 2, 3, 2, 'đây là tin nhắn thứ 2 của id 3 role 2', '2022-04-21 13:15:42.579');

INSERT INTO message OVERRIDING SYSTEM VALUE VALUES (6, 3, 1, 1, 'đây là tin nhắn thứ 2 của id 1 role 1', '2022-04-21 13:15:42.579');
COMMIT;

DROP TABLE IF EXISTS "vn_tinhthanhpho";
CREATE TABLE "vn_tinhthanhpho" (
  "id" varchar(5) NOT NULL,
  "name" varchar(100) NOT NULL,
  "type" varchar(30) NOT NULL,
  "slug" varchar(30) DEFAULT NULL,
  PRIMARY KEY ("id")
)
;
BEGIN;
INSERT INTO "vn_tinhthanhpho" ("id", "name", "type", "slug") VALUES
('00',	'Khác',	'Toàn quốc',	'KHAC'),
('01',	'Thành phố Hà Nội',	'Thành phố Trung ương',	'HANOI'),
('02',	'Tỉnh Hà Giang',	'Tỉnh',	'HAGIANG'),
('04',	'Tỉnh Cao Bằng',	'Tỉnh',	'CAOBANG'),
('06',	'Tỉnh Bắc Kạn',	'Tỉnh',	'BACKAN'),
('08',	'Tỉnh Tuyên Quang',	'Tỉnh',	'TUYENQUANG'),
('10',	'Tỉnh Lào Cai',	'Tỉnh',	'LAOCAI'),
('11',	'Tỉnh Điện Biên',	'Tỉnh',	'DIENBIEN'),
('12',	'Tỉnh Lai Châu',	'Tỉnh',	'LAICHAU'),
('14',	'Tỉnh Sơn La',	'Tỉnh',	'SONLA'),
('15',	'Tỉnh Yên Bái',	'Tỉnh',	'YENBAI'),
('17',	'Tỉnh Hoà Bình',	'Tỉnh',	'HOABINH'),
('19',	'Tỉnh Thái Nguyên',	'Tỉnh',	'THAINGUYEN'),
('20',	'Tỉnh Lạng Sơn',	'Tỉnh',	'LANGSON'),
('22',	'Tỉnh Quảng Ninh',	'Tỉnh',	'QUANGNINH'),
('24',	'Tỉnh Bắc Giang',	'Tỉnh',	'BACGIANG'),
('25',	'Tỉnh Phú Thọ',	'Tỉnh',	'PHUTHO'),
('26',	'Tỉnh Vĩnh Phúc',	'Tỉnh',	'VINHPHUC'),
('27',	'Tỉnh Bắc Ninh',	'Tỉnh',	'BACNINH'),
('30',	'Tỉnh Hải Dương',	'Tỉnh',	'HAIDUONG'),
('31',	'Thành phố Hải Phòng',	'Thành phố Trung ương',	'HAIPHONG'),
('33',	'Tỉnh Hưng Yên',	'Tỉnh',	'HUNGYEN'),
('34',	'Tỉnh Thái Bình',	'Tỉnh',	'THAIBINH'),
('35',	'Tỉnh Hà Nam',	'Tỉnh',	'HANAM'),
('36',	'Tỉnh Nam Định',	'Tỉnh',	'NAMDINH'),
('37',	'Tỉnh Ninh Bình',	'Tỉnh',	'NINHBINH'),
('38',	'Tỉnh Thanh Hóa',	'Tỉnh',	'THANHHOA'),
('40',	'Tỉnh Nghệ An',	'Tỉnh',	'NGHEAN'),
('42',	'Tỉnh Hà Tĩnh',	'Tỉnh',	'HATINH'),
('44',	'Tỉnh Quảng Bình',	'Tỉnh',	'QUANGBINH'),
('45',	'Tỉnh Quảng Trị',	'Tỉnh',	'QUANGTRI'),
('46',	'Tỉnh Thừa Thiên Huế',	'Tỉnh',	'THUATHIENHUE'),
('48',	'Thành phố Đà Nẵng',	'Thành phố Trung ương',	'DANANG'),
('49',	'Tỉnh Quảng Nam',	'Tỉnh',	'QUANGNAM'),
('51',	'Tỉnh Quảng Ngãi',	'Tỉnh',	'QUANGNGAI'),
('52',	'Tỉnh Bình Định',	'Tỉnh',	'BINHDINH'),
('54',	'Tỉnh Phú Yên',	'Tỉnh',	'PHUYEN'),
('56',	'Tỉnh Khánh Hòa',	'Tỉnh',	'KHANHHOA'),
('58',	'Tỉnh Ninh Thuận',	'Tỉnh',	'NINHTHUAN'),
('60',	'Tỉnh Bình Thuận',	'Tỉnh',	'BINHTHUAN'),
('62',	'Tỉnh Kon Tum',	'Tỉnh',	'KONTUM'),
('64',	'Tỉnh Gia Lai',	'Tỉnh',	'GIALAI'),
('66',	'Tỉnh Đắk Lắk',	'Tỉnh',	'DAKLAK'),
('67',	'Tỉnh Đắk Nông',	'Tỉnh',	'DAKNONG'),
('68',	'Tỉnh Lâm Đồng',	'Tỉnh',	'LAMDONG'),
('70',	'Tỉnh Bình Phước',	'Tỉnh',	'BINHPHUOC'),
('72',	'Tỉnh Tây Ninh',	'Tỉnh',	'TAYNINH'),
('74',	'Tỉnh Bình Dương',	'Tỉnh',	'BINHDUONG'),
('75',	'Tỉnh Đồng Nai',	'Tỉnh',	'DONGNAI'),
('77',	'Tỉnh Bà Rịa - Vũng Tàu',	'Tỉnh',	'BARIAVUNGTAU'),
('79',	'Thành phố Hồ Chí Minh',	'Thành phố Trung ương',	'HOCHIMINH'),
('80',	'Tỉnh Long An',	'Tỉnh',	'LONGAN'),
('82',	'Tỉnh Tiền Giang',	'Tỉnh',	'TIENGIANG'),
('83',	'Tỉnh Bến Tre',	'Tỉnh',	'BENTRE'),
('84',	'Tỉnh Trà Vinh',	'Tỉnh',	'TRAVINH'),
('86',	'Tỉnh Vĩnh Long',	'Tỉnh',	'VINHLONG'),
('87',	'Tỉnh Đồng Tháp',	'Tỉnh',	'DONGTHAP'),
('89',	'Tỉnh An Giang',	'Tỉnh',	'ANGIANG'),
('91',	'Tỉnh Kiên Giang',	'Tỉnh',	'KIENGIANG'),
('92',	'Thành phố Cần Thơ',	'Thành phố Trung ương',	'CANTHO'),
('93',	'Tỉnh Hậu Giang',	'Tỉnh',	'HAUGIANG'),
('94',	'Tỉnh Sóc Trăng',	'Tỉnh',	'SOCTRANG'),
('95',	'Tỉnh Bạc Liêu',	'Tỉnh',	'BACLIEU'),
('96',	'Tỉnh Cà Mau',	'Tỉnh',	'CAMAU');
COMMIT;
ALTER TABLE "kols" ADD CONSTRAINT "KolsAddress" FOREIGN KEY ("address") REFERENCES "vn_tinhthanhpho" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "brands" ADD CONSTRAINT "BrandsAddress" FOREIGN KEY ("address") REFERENCES "vn_tinhthanhpho" ("id") ON DELETE CASCADE ON UPDATE CASCADE;