DROP TABLE IF EXISTS post_categories;
DROP TABLE IF EXISTS kol_social_post;
DROP TABLE IF EXISTS kol_social_page;
DROP TABLE IF EXISTS kol_social_account;
DROP TABLE IF EXISTS card_kols;
DROP TABLE IF EXISTS check_read_room;
DROP TABLE IF EXISTS image_job;
DROP TABLE IF EXISTS job_comment;
DROP TABLE IF EXISTS job_describe;
DROP TABLE IF EXISTS job_member;
DROP TABLE IF EXISTS brands_like_kols;
DROP TABLE IF EXISTS kols_like_brands;
DROP TABLE IF EXISTS kols_like_post;
DROP TABLE IF EXISTS image_recruitment;
DROP TABLE IF EXISTS image_post;
DROP TABLE IF EXISTS image_user;
DROP TABLE IF EXISTS recruitment;
DROP TABLE IF EXISTS notifications;
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
  "gender" varchar(15),
  "avatar" varchar(255),
  "follows" int4,
  "introduce" varchar(1000),
  "birthday" timestamp,
	"create_time" timestamp NOT NULL,
  "state" char NOT NULL DEFAULT '1',
	"otp" int4,
	PRIMARY KEY ("id")
)
;

-- ----------------------------
-- Table structure for card_kols
-- ----------------------------
CREATE TABLE card_kols (
  "email" char NOT NULL DEFAULT '1',
  "address" char NOT NULL DEFAULT '1',
  "phone" char NOT NULL DEFAULT '1',
  "gender" char NOT NULL DEFAULT '1',
  "image" varchar(255),
  "describe" varchar(1000),
  "state" char NOT NULL DEFAULT '1',
  "id_kol" int4 NOT NULL,
	PRIMARY KEY ("id_kol"),
  CONSTRAINT "card_kols" FOREIGN KEY ("id_kol") REFERENCES "kols" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
START 15
),
  "email" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "full_name" varchar(255),
  "brand_name" varchar(50),
  "address" varchar(255),
  "phone" varchar(15),
	"create_time" timestamp,
  "gender" char,
  "introduce" varchar(1000),
  "cover" varchar(255),
  "avatar" varchar(255),
  "state" char NOT NULL DEFAULT '1',
	"otp" int4,
	PRIMARY KEY ("id")
)
;
-- ----------------------------
-- Table structure for Admin
-- is_super: 1: phải, 0: ko phải
-- ----------------------------
DROP TABLE IF EXISTS admins;
CREATE TABLE admins (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 5
),
  "full_name" varchar(255),
  "password" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "is_super" char NOT NULL DEFAULT '0',
  "email" varchar(255),
  "create_time" timestamp,
	"otp" int4
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
    START 40
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
    START 30
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
    START 40
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
-- Table structure for kols_like_brands
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
  "content" varchar(1000) NOT NULL,
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
    START 30
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
    START 30
    ),
  "id_job" int4 NOT NULL,
  "id_user" int4 NOT NULL,
  "role" char NOT NULL DEFAULT '1',
  "content" varchar(500) NOT NULL,
  "url" varchar(255),
  "create_time" timestamp NOT NULL,
  PRIMARY KEY ("id")
) 
;
ALTER TABLE "job_comment" ADD CONSTRAINT "jobcomment_describe" FOREIGN KEY ("id_job") REFERENCES "job_describe" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Table structure for job_member
-- ----------------------------
-- state 1: kol not done work, 2: kol done work, 3: brand 
CREATE TABLE "job_member" (
   "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 30
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
-- Table structure for kol_social_account
-- ----------------------------
-- state 1: đã login, 0 - logout 
-- type_schedule: 1: có lên lịch, 2: đăng ngay (ko lên lịch)
-- type_social: mạng xã hội (hiện tại support FB): 1 (Facebook)
CREATE TABLE "kol_social_account" (
  "id_kol" int4 NOT NULL,
  "state" char NOT NULL DEFAULT '1',
  "id_user_social" varchar(50),
  "account_token" varchar(255),
  "account_name" varchar(150),
  "time_expired" timestamp,
  "create_time" timestamp NOT NULL,
  PRIMARY KEY ("id_user_social")
) 
;
ALTER TABLE "kol_social_account" ADD CONSTRAINT "kol_social_account_kol" FOREIGN KEY ("id_kol") REFERENCES "kols" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Table structure for kol_social_page
-- ----------------------------
-- state 1: đã login, 0 - logout 
-- type_schedule: 1: có lên lịch, 2: đăng ngay (ko lên lịch)
-- type_social: mạng xã hội (hiện tại support FB): 1 (Facebook)
CREATE TABLE "kol_social_page" (
   "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 30
    ),
  "id_kol" int4 NOT NULL,
  "id_user_account" varchar(50),
  "state" char NOT NULL DEFAULT '1',
  "page_token" varchar(255),
  "id_page_social" varchar(50),
  "page_name" varchar(150),
  "time_expired" timestamp,
  "create_time" timestamp NOT NULL,
  PRIMARY KEY ("id")
) 
;
ALTER TABLE "kol_social_page" ADD CONSTRAINT "kol_social_page_kol" FOREIGN KEY ("id_kol") REFERENCES "kols" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "kol_social_page" ADD CONSTRAINT "kol_social_page_account" FOREIGN KEY ("id_user_account") REFERENCES "kol_social_account" ("id_user_social") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Table structure for kol_social_post
-- ----------------------------
-- state 1: đang chờ đăng, 2: đã đăng thành công, 0: bản nháp
-- type_accept: thể hiện bài đăng được brand duyệt chưa? 0: đang chờ duyệt, 1: được đồng ý, 2: từ chối
-- type_schedule: 1: có lên lịch, 2: đăng ngay (ko lên lịch)
-- type_social: mạng xã hội (hiện tại support FB): 1 (Facebook)
CREATE TABLE "kol_social_post" (
   "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 30
    ),
  "id_kol" int4 NOT NULL,
  "id_page" int4,
  "id_page_social" varchar(50),
  "id_post_job" int4,
  "id_post_social" varchar(100),
  "url_image" varchar(150),
  "url_video" varchar(150),
  "url_post_social" varchar(150),
  "state" char NOT NULL DEFAULT '1',
  "content" varchar,
  "type_social" char NOT NULL DEFAULT '1',
  "type_schedule" char NOT NULL DEFAULT '1',
  "type_accept" char NOT NULL DEFAULT '0',
  "schedule_time" timestamp,
  "create_time" timestamp NOT NULL,
  PRIMARY KEY ("id")
) 
;
ALTER TABLE "kol_social_post" ADD CONSTRAINT "kol_social_post_kol" FOREIGN KEY ("id_kol") REFERENCES "kols" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
--ALTER TABLE "kol_social_post" ADD CONSTRAINT "kol_social_post_page" FOREIGN KEY ("id_page") REFERENCES "kol_social_page" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
--ALTER TABLE "kol_social_post" ADD CONSTRAINT "kol_social_post_job" FOREIGN KEY ("id_job_describe") REFERENCES "job_describe" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ----------------------------
-- Records of categories
-- ----------------------------
-- Thông báo ở phía kol: 
--          khi recruitment được accept --> cần idpost; 
--          khi brand tạo task trong job --> cần idpost; 
-- Thông báo ở phía brand: 
--          khi có kol recruit --> cần idpost; 
--          khi có người comment --> cần có idpost;  
-- type thể hiện loại thông báo: 1-thông báo recruitment được accept, 2-thông báo brand tạo task mới, 3-thông báo khi có người cmt
-- status thể hiện người dùng đã đọc thông báo chưa: 1 - đọc rồi, 0 - chưa đọc
CREATE TABLE notifications (
  "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 10
),
  "id_user" int4 NOT NULL,
  "role" char NOT NULL,
  "id_post" int4,
  "id_job_describe" int4 DEFAULT NULL,
  "message" varchar(255),
  "create_time" timestamp,
	"status" char NOT NULL DEFAULT '0',
  "avatar" varchar(255),
  "name" varchar(150),
  "post_title" varchar(150),
  PRIMARY KEY ("id")
)
;
ALTER TABLE "notifications" ADD CONSTRAINT "noti_post" FOREIGN KEY ("id_post") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
-- admin pass: kols1234
-- ----------------------------
BEGIN;
INSERT INTO admins OVERRIDING SYSTEM VALUE VALUES (1, 'Admin1', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', '1', 'admin1@gmail.com','2022-04-21 13:15:42.579', -1);

INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (1, 'Phương Xuân', 'kol1@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, null, null, null, null, null, null, null, '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (2, 'Lan Anh', 'kol2@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, null, null, null, null, null, null, null, '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (3, 'Ngọc Trúc', 'kol3@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, null, null, null, null, null, null, null, '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (4, 'Trần Nam', 'kol4@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, null, null, null, null, null, null, null, '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (5, 'Phương Thảo', 'kol5@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, null, null, null, null, null, null, null, '2022-04-21 13:15:42.579', '1', -1);

INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 1);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 2);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 3);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 4);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 5);

INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (1,'brand1@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Trần Huy', 'Trà sữa Huy Tea', '79', '1111111111',  '2022-04-21 13:15:42.579', '1', null, null, null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (2,'brand2@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Ngọc Nga', 'Shop quần áo Ngọc Nga', '36', '2222222222',  '2022-04-21 13:15:42.579', '1', null, null, null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (3,'brand3@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Minh Anh', 'Thời trang Anh Anh', '01', '3333333333',  '2022-04-21 13:15:42.579', '1', null, null, null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (4,'brand4@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Trần Tiến', 'Shop Tiến Nguyễn', '01', '444444444',  '2022-04-21 13:15:42.579', '1', null, null, null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (5,'brand5@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Minh Hậu', 'Gaming Hậu', '92', '555555555',  '2022-04-21 13:15:42.579', '1', null, null, null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (6,'brand6@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Ngọc Anh', 'Quần áo Ngọc Anh', '92', '6666666666',  '2022-04-21 13:15:42.579', '1', null, null, null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (7,'brand7@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Trần Trà', 'Trà sữa Yoyo', '75', '7777777777',  '2022-04-21 13:15:42.579', '1', null, null, null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (8,'brand8@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Trúc Nguyễn', 'Trúc Nguyễn shop', '79', '888888888',  '2022-04-21 13:15:42.579', '1', null, null, null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (9,'brand9@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Long Phan', 'Long Fashion', '01', '0999999999',  '2022-04-21 13:15:42.579', '1', null, null, null, '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (10,'brand10@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Minh Nguyễn', 'Thức ăn cho bé', '79', '1010101010',  '2022-04-21 13:15:42.579', '1', null, null, null, '1', -1);
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
('01',	'Hà Nội',	'Thành phố Trung ương',	'HANOI'),
('02',	'Hà Giang',	'Tỉnh',	'HAGIANG'),
('04',	'Cao Bằng',	'Tỉnh',	'CAOBANG'),
('06',	'Bắc Kạn',	'Tỉnh',	'BACKAN'),
('08',	'Tuyên Quang',	'Tỉnh',	'TUYENQUANG'),
('10',	'Lào Cai',	'Tỉnh',	'LAOCAI'),
('11',	'Điện Biên',	'Tỉnh',	'DIENBIEN'),
('12',	'Lai Châu',	'Tỉnh',	'LAICHAU'),
('14',	'Sơn La',	'Tỉnh',	'SONLA'),
('15',	'Yên Bái',	'Tỉnh',	'YENBAI'),
('17',	'Hoà Bình',	'Tỉnh',	'HOABINH'),
('19',	'Thái Nguyên',	'Tỉnh',	'THAINGUYEN'),
('20',	'Lạng Sơn',	'Tỉnh',	'LANGSON'),
('22',	'Quảng Ninh',	'Tỉnh',	'QUANGNINH'),
('24',	'Bắc Giang',	'Tỉnh',	'BACGIANG'),
('25',	'Phú Thọ',	'Tỉnh',	'PHUTHO'),
('26',	'Vĩnh Phúc',	'Tỉnh',	'VINHPHUC'),
('27',	'Bắc Ninh',	'Tỉnh',	'BACNINH'),
('30',	'Hải Dương',	'Tỉnh',	'HAIDUONG'),
('31',	'Hải Phòng',	'Thành phố Trung ương',	'HAIPHONG'),
('33',	'Hưng Yên',	'Tỉnh',	'HUNGYEN'),
('34',	'Thái Bình',	'Tỉnh',	'THAIBINH'),
('35',	'Hà Nam',	'Tỉnh',	'HANAM'),
('36',	'Nam Định',	'Tỉnh',	'NAMDINH'),
('37',	'Ninh Bình',	'Tỉnh',	'NINHBINH'),
('38',	'Thanh Hóa',	'Tỉnh',	'THANHHOA'),
('40',	'Nghệ An',	'Tỉnh',	'NGHEAN'),
('42',	'Hà Tĩnh',	'Tỉnh',	'HATINH'),
('44',	'Quảng Bình',	'Tỉnh',	'QUANGBINH'),
('45',	'Quảng Trị',	'Tỉnh',	'QUANGTRI'),
('46',	'Thừa Thiên Huế',	'Tỉnh',	'THUATHIENHUE'),
('48',	'Đà Nẵng',	'Thành phố Trung ương',	'DANANG'),
('49',	'Quảng Nam',	'Tỉnh',	'QUANGNAM'),
('51',	'Quảng Ngãi',	'Tỉnh',	'QUANGNGAI'),
('52',	'Bình Định',	'Tỉnh',	'BINHDINH'),
('54',	'Phú Yên',	'Tỉnh',	'PHUYEN'),
('56',	'Khánh Hòa',	'Tỉnh',	'KHANHHOA'),
('58',	'Ninh Thuận',	'Tỉnh',	'NINHTHUAN'),
('60',	'Bình Thuận',	'Tỉnh',	'BINHTHUAN'),
('62',	'Kon Tum',	'Tỉnh',	'KONTUM'),
('64',	'Gia Lai',	'Tỉnh',	'GIALAI'),
('66',	'Đắk Lắk',	'Tỉnh',	'DAKLAK'),
('67',	'Đắk Nông',	'Tỉnh',	'DAKNONG'),
('68',	'Lâm Đồng',	'Tỉnh',	'LAMDONG'),
('70',	'Bình Phước',	'Tỉnh',	'BINHPHUOC'),
('72',	'Tây Ninh',	'Tỉnh',	'TAYNINH'),
('74',	'Bình Dương',	'Tỉnh',	'BINHDUONG'),
('75',	'Đồng Nai',	'Tỉnh',	'DONGNAI'),
('77',	'Bà Rịa - Vũng Tàu',	'Tỉnh',	'BARIAVUNGTAU'),
('79',	'TP. HCM',	'Thành phố Trung ương',	'HOCHIMINH'),
('80',	'Long An',	'Tỉnh',	'LONGAN'),
('82',	'Tiền Giang',	'Tỉnh',	'TIENGIANG'),
('83',	'Bến Tre',	'Tỉnh',	'BENTRE'),
('84',	'Trà Vinh',	'Tỉnh',	'TRAVINH'),
('86',	'Vĩnh Long',	'Tỉnh',	'VINHLONG'),
('87',	'Đồng Tháp',	'Tỉnh',	'DONGTHAP'),
('89',	'An Giang',	'Tỉnh',	'ANGIANG'),
('91',	'Kiên Giang',	'Tỉnh',	'KIENGIANG'),
('92',	'Cần Thơ',	'Thành phố Trung ương',	'CANTHO'),
('93',	'Hậu Giang',	'Tỉnh',	'HAUGIANG'),
('94',	'Sóc Trăng',	'Tỉnh',	'SOCTRANG'),
('95',	'Bạc Liêu',	'Tỉnh',	'BACLIEU'),
('96',	'Cà Mau',	'Tỉnh',	'CAMAU');
COMMIT;
ALTER TABLE "kols" ADD CONSTRAINT "KolsAddress" FOREIGN KEY ("address") REFERENCES "vn_tinhthanhpho" ("id") ON DELETE CASCADE ON UPDATE CASCADE;