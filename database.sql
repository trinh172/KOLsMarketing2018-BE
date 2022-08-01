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
START 30
),
  "full_name" varchar(255),
  "email" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "nick_name" varchar(50),
  "address" varchar(5),
  "phone" varchar(15),
  "gender" varchar(15),
  "avatar" varchar(255),
  "follows" int4 NOT NULL DEFAULT '0',
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
START 30
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
	"otp" int4,
  PRIMARY KEY ("id")
)
;
-- ----------------------------
-- Table structure for Posts
-- state: 1: đang active, 0: unactive
-- status: 1: ko bị block, 0: bị block
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
  "status" char NOT NULL DEFAULT '1',
  "content" varchar NOT NULL,
  "requirement" varchar,
  "benefit" varchar,
  "address" varchar(5),
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
    START 60
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
    START 60
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
-- type 1: chỉ thông báo, 2: có nút nộp bài
-- ----------------------------
CREATE TABLE "job_describe" (
   "id" int4 NOT NULL GENERATED ALWAYS AS IDENTITY (
    INCREMENT 1
    MINVALUE  1
    MAXVALUE 2147483647
    START 30
    ),
  "id_post" int4 NOT NULL,
  "id_brand" int4 NOT NULL,
  "content" varchar NOT NULL,
  "type" char NOT NULL DEFAULT '1',
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
  "id_job_describe" int4,
  "id_post_social" varchar(100),
  "url_image" varchar(150),
  "url_video" varchar(150),
  "url_post_social" varchar(150),
  "state" char NOT NULL DEFAULT '1',
  "content" varchar,
  "review" varchar,
  "type_social" char NOT NULL DEFAULT '1',
  "type_schedule" char NOT NULL DEFAULT '1',
  "type_accept" char NOT NULL DEFAULT '0',
  "count_like" int4 NOT NULL DEFAULT 0,
  "count_share" int4 NOT NULL DEFAULT 0,
  "count_comment" int4 NOT NULL DEFAULT 0,
  "update_time" timestamp,
  "schedule_time" timestamp,
  "create_time" timestamp NOT NULL,
  PRIMARY KEY ("id")
) 
;
ALTER TABLE "kol_social_post" ADD CONSTRAINT "kol_social_post_kol" FOREIGN KEY ("id_kol") REFERENCES "kols" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
--ALTER TABLE "kol_social_post" ADD CONSTRAINT "kol_social_post_page" FOREIGN KEY ("id_page") REFERENCES "kol_social_page" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "kol_social_post" ADD CONSTRAINT "kol_social_post_job" FOREIGN KEY ("id_job_describe") REFERENCES "job_describe" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
INSERT INTO categories OVERRIDING SYSTEM VALUE VALUES (1, 'Điện tử');
INSERT INTO categories OVERRIDING SYSTEM VALUE VALUES (2, 'Thời trang');
INSERT INTO categories OVERRIDING SYSTEM VALUE VALUES (3, 'Mỹ phẩm');
INSERT INTO categories OVERRIDING SYSTEM VALUE VALUES (4, 'Thực phẩm');
INSERT INTO categories OVERRIDING SYSTEM VALUE VALUES (5, 'Sức khỏe');
INSERT INTO categories OVERRIDING SYSTEM VALUE VALUES (6, 'Thể thao');
INSERT INTO categories OVERRIDING SYSTEM VALUE VALUES (7, 'Phương tiện');
INSERT INTO categories OVERRIDING SYSTEM VALUE VALUES (8, 'Dịch vụ');
INSERT INTO categories OVERRIDING SYSTEM VALUE VALUES (9, 'Đồ chơi');
INSERT INTO categories OVERRIDING SYSTEM VALUE VALUES (10, 'Kiến thức');
INSERT INTO categories OVERRIDING SYSTEM VALUE VALUES (11, 'Khác');
COMMIT;

-- ----------------------------
-- Records of user
-- kols pass: kols1234
-- brand pass: kols1234
-- admin pass: kols1234
-- ----------------------------
BEGIN;
INSERT INTO admins OVERRIDING SYSTEM VALUE VALUES (1, 'Admin1', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', '1', 'admin1@gmail.com','2022-04-21 13:15:42.579', -1);

INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (1, 'Phương Xuân', 'kol1@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '79', '0394940333', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658927849/16589278411940.26765664946749945.jpg', '0', 'Mình chuyên nhận review về thời trang và mỹ phẩm. Kênh tiktok của mình được 25k theo dõi và Facebook được 32k theo dõi. Liên hệ sđt của mình để bàn công việc.', '1997-07-03 13:12:18', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (2, 'Lan Anh', 'kol2@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '79', '0930394039', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658929523/16589295111350.4959667795929765.jpg', '0', 'Mình có tiktok 45k follows và fb 63k follows, mọi người muốn review thời trang và thức ăn hãy liên hệ với mình.', '1998-05-07 13:29:04', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (3, 'Ngọc Trúc', 'kol3@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '75', '093849023', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658929973/16589299704950.7629276568664676.jpg', '0','Kênh Facebook của mình đạt 67k follows và mình chuyên nhận review các sản phẩm mẹ và bé, sản phẩm gia dụng và thức ăn dinh dưỡng.', '2000-07-08 13:48:03', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (4, 'Trần Nam', 'kol4@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '79', '093832983', 'Nam', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658930294/16589302668110.1355361142774829.jpg', '0', 'Mình là Nam, nhận review các sản phẩm đồ điện tử, thời trang nam. Facebook của mình có lượt follows là 57k.', '1999-09-17 13:53:51', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (5, 'Phương Thảo', 'kol5@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '01', '094498930', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658930699/16589306970320.5092095196659232.jpg', '0', 'Mình là Phương Thảo, có tình yêu đặc biệt với sách và các thiết bị điện tử. Trang  fb mình với follows 27k và được nhiều bạn trẻ yêu thích sách cùng đồ điện tử theo dõi.', '1998-07-04 14:01:46', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (6, 'Ngọc Nga', 'kol6@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '01', '0323995635', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658930949/16589309490710.7962910043121307.jpg', '0', 'Mình là nữ ở Hà Nội, rất vui được hợp tác với các shop thời trang mỹ phẩm, facebook của mình đạt 56k follows, mỗi bài viết có tương tác trung bình là 5k like', '1999-09-03 14:09:43', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (7, 'Phương Anh', 'kol7@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '75', '094838938', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658931420/16589314169020.6188048474817163.jpg', '0', 'Liên hệ mình để book review thức ăn nhé các shop.', '1992-07-04 14:12:48', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (8, 'Bích Thảo', 'kol8@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '01', '0923902232', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658931805/16589318019970.16644202215635828.jpg', '0', 'Chuyên nhận review thời trang nữ, đã có kinh nghiệm quay chụp ở studio và review sản phẩm balo, quần áo nữ.', '1997-07-05 14:19:02', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (9, 'Anna Trương', 'ko9@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '75', '093748389', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658932207/16589321867050.04889468184257728.jpg', '0', 'Mình là nữ ở Đồng Nai, chuyên nhận review Mỹ phẩm và đồ điện tử.', '1994-07-09 14:27:00', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (10, 'Quỳnh Lan', 'kol10@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '79', '094349234', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658932663/16589326633900.1994807813931878.jpg', '0', 'Mình là Quỳnh Anh, từng tham gia diễn phụ cho 1 số phim truyền hình và từng nhận review phim ảnh chiếu rạp. Trang fb của mình được nhiều bạn trẻ yêu thích phim ảnh và thời trang theo dõi.', '1993-07-03 14:31:44', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (11, 'Hương Nga', 'kol11@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '77', '0943948993', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658932876/16589328675200.473639256209921.jpg', '0', 'Mọi người hãy contacr mình để booking review sản phẩm thời trang nhé, mình có nhận review về các quán ăn và du lịch.', '1997-07-17 14:38:48', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (12, 'Thảo Nhi', 'kol12@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '86', '036569899', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658933502/16589334965370.7331060945893042.jpg', '0', 'Mình là Thảo Nhi ở Vĩnh Long, chiều cao 1m68 cân nặng 54kg, nhận mẫu chụp hình cho các shop và studio, có kinh nghiệm làm việc 5 năm', '1993-07-16 14:48:54', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (13, 'Yaya Anh Nhi', 'kol13@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '79', '0368565632', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658933764/16589337372420.33154914201961483.jpg', '0', 'Mình chuyên review các thực phẩm chức năng và sản phẩm về sức khỏe.', '1995-07-15 14:52:52', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (14, 'Nguyễn Bích Anh', 'kol14@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '79', '093289438', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658934031/16589340310590.8541912876211155.jpg', '0', 'Mình là Nữ ở TP. HCM, nhận review các mặt hàng điện tử và trò chơi công nghệ. Mọi người hãy contact sđt mình để booking.', '1996-07-06 14:57:49', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (15, 'Jenny Huynh', 'kol15@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '79', '036466532', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658934575/16589345700820.6151001363706887.jpg', '0', 'Mình có lượt follows fb là 46k và tiktok là 34k, hiện mình nhận review các sản phẩm công nghệ và thời trang năng động.', '1998-07-09 15:06:12', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (16, 'Bảo Ngọc', 'kol16@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '01', '0326565663', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658935212/16589352033840.33379840509156966.jpg', '0', 'Mình chuyên nhận review các mỹ phẩm và thực phẩm chức năng.', '2001-07-17 15:15:42', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (17, 'Ngọc Châu', 'kol17@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '37', '069863223', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658935822/16589358233090.9341298275583791.jpg', '0', 'Trang facebook có 34k follows và tiktok có 25k follows, nhận chụp ảnh mẫu và đăng bài review sản phẩm trên mxh, liên hệ sđt hoặc email để booking.', '1997-07-03 15:27:28', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (18, 'Thủy Tiên', 'kol18@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '01', '093893233', 'Nữ', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658935985/16589359546170.1360150937008695.jpg', '0', 'Trang fb của mình đạt 56k follows, nhận feedback phim, truyện và review sách trên mxh', '2003-07-04 15:33:38', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (19, 'Ann Nguyễn', 'kol19@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '79', '0322323234', 'Nam', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658936385/16589363859480.4713604450719149.jpg', '0', 'Mình nhận chụp mẫu thời trang, thể thao và xe cộ, nhận review sản phẩm trên fb, lượt theo dõi là 67k', '1999-07-24 15:35:58', '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (20, 'Phúc Đào', 'kol20@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, '79', '032656562', 'Nam', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658936963/16589369631980.453577684882541.jpg', '0', 'Nhận chụp ảnh review đồ chơi điện tử, thể thao.', '1997-07-17 15:44:49', '2022-04-21 13:15:42.579', '1', -1);

INSERT INTO card_kols VALUES (1, 1, 1, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658928458/16589284467060.3290143672602215.jpg', 'Mình chuyên nhận review sản phẩm thời trang và mỹ phẩm, kênh FB của mình đạt được 25k theo dõi.', 1, 1);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 2);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 3);
INSERT INTO card_kols VALUES (1, 1, 1, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658930450/16589304216460.2682940639345759.jpg', 'Link facebook của mình: https://facebook.com/trannam.99, mình nhận review sản phẩm về đồ điện tử và thời trang nam.', 1, 4);
INSERT INTO card_kols VALUES (1, 1, 1, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658930778/16589307792430.9781201712865619.jpg', 'Mình nhận review sách và đồ điện tử nhé mọi người, hãy liên hệ mình để booking', 1, 5);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 6);
INSERT INTO card_kols VALUES (1, 1, 1, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658931481/16589314794090.25140290361649.jpg', 'Mình nhận review thời trang cho mẹ và bé và các sản phẩm gia dụng trong gia đình nhé.', 1, 7);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 8);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 9);
INSERT INTO card_kols VALUES (1, 1, 1, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658932685/16589326852440.4149641675894664.jpg', 'Mình có trang Fb được 34k theo dõi và tiktok được 42k theo dõi, mọi người hãy contact mình để booking nhé.', 1, 10);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 11);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 12);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 13);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 14);
INSERT INTO card_kols VALUES (1, 1, 1, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658934667/16589346669150.1785711963119645.jpg', 'Mọi người hãy liên hệ fb của mình để booking, lượt follows là 46k', 1, 15);
INSERT INTO card_kols VALUES (1, 1, 1, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658935406/16589353975310.24306205335698317.jpg', 'Mình có facebook có lượt follows là 34k và tiktok có 45k follows. Chuyên nhận review các sản phẩm cho sức khỏe.', 1, 16);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 17);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 18);
INSERT INTO card_kols VALUES (1, 1, 1, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658936467/16589364685310.7567864445579724.jpg', 'Nhận chụp ảnh review xe mô tô, đồ thể thao và thời trang nam. Facebook có lượt follows 67k', 1, 19);
INSERT INTO card_kols VALUES (1, 1, 1, 1, null, null, 0, 20);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (1,'brand1@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Trần Huy', 'Trà sữa Huy Tea', 'Q.7, TP.HCM', '0320232892',  '2022-04-21 13:15:42.579', '1', 'Mình là shop trà sữa đồ ăn vặt ở quận 7 TP. HCM cần tìm các bạn mẫu ảnh tới quán để quay và review trên fb.', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658943901/16589438994480.43058756986181.jpg', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658943887/16589438791820.041124404022665484.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (2,'brand2@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Ngọc Nga', 'Shop quần áo Ngọc Nga', 'Biên Hòa, Đồng Nai', '0849282903',  '2022-04-21 13:15:42.579', '1', 'Shop quần áo thời trang nữ cần tuyển các bạn mẫu nữ chụp ảnh và đăng feedback.', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945003/16589450014610.05557858010878025.jpg', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658944989/16589449800720.6954690270926882.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (3,'brand3@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Minh Anh', 'Thời trang Anh Anh', 'Thanh Xuân, Hà Nội', '0938292028',  '2022-04-21 13:15:42.579', '1', 'Thời trang nam và nữ ở Hà Nội, chuyên các dòng sản phẩm quần áo, túi xách và giày dép.', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945060/16589450577100.4126226498484442.jpg', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945042/16589450376910.22391716608301282.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (4,'brand4@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Trần Tiến', 'Shop Tiến Nguyễn', 'Hà Nội', '0282393844',  '2022-04-21 13:15:42.579', '1', 'Thời trang cho nam ở Hà Nội cần tuyển các bạn mẫu nam nhận sản phẩm về chụp và đăng bài review.', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945574/16589455738180.2771053847893825.jpg', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945548/16589455464940.11131413674076196.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (5,'brand5@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Minh Hậu', 'Gaming Hậu', 'Cần Thơ', '0928373912',  '2022-04-21 13:15:42.579', '1', 'Shop bán các sản phẩm cho game thủ: tai nghe, bàn phím, ghế ngồi, ...', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945662/16589456618460.2830640059638041.png', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945652/16589456523860.14043112778389366.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (6,'brand6@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Ngọc Anh', 'Quần áo Ngọc Anh', 'Phú Quốc', '0925782934',  '2022-04-21 13:15:42.579', '1', 'Shop quần áo cho nam và nữ đủ thể loại tại Phú Quốc cần tìm mẫu nam nữ chụp ảnh và review sản phẩm.', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945717/16589457181190.4399719856574509.jpg', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945693/16589456918770.6192436009538658.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (7,'brand7@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Trần Trà', 'Trà sữa Yoyo', 'Q10, TP.HCM', '0349501293',  '2022-04-21 13:15:42.579', '1', 'Quán trà sữa Yoyo với không gian quán thoáng mát, tươi đẹp cần tìm bạn mẫu tới quán quay chụp và đăng bài giới thiệu.', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945794/16589457951580.40828804262773777.jpg', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945783/16589457841320.22219724889251813.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (8,'brand8@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Trúc Nguyễn', 'Trúc Nguyễn restaurent', 'Đà Lạt', '0783920183',  '2022-04-21 13:15:42.579', '1', 'Quán phục vụ các món ăn châu Á trên Đà Lạt cần bạn mẫu tới quay chụp và đăng feedback lên mxh.', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945854/16589458549910.6216423350627616.jpg', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945843/16589458436770.16840906012337453.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (9,'brand9@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Long Phan', 'DoctorCare', 'Hà Nội', '0909234899',  '2022-04-21 13:15:42.579', '1', 'Tiệm chuyên bán các sản phẩm chức năng và hỗ trợ sức khỏe cho mọi lứa tuổi.', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945894/16589458920550.20569467745972192.jpg', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945941/16589459397310.8383545886482846.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (10,'brand10@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Minh Nguyễn', 'Thức ăn cho bé', 'Q3, TP.HCM', '0977734345',  '2022-04-21 13:15:42.579', '1', 'Cần tìm các hot mom review món ăn cho bé ở trong quán, đăng video và ảnh lên mxh.', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658945986/16589459858670.8576956983882666.png', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946012/16589460123180.6424796611192425.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (11,'brand11@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Nam Anh', 'Keyboard Shop Nam Anh', 'Thủ Đức', '0344455567',  '2022-04-21 13:15:42.579', '1', 'Quán bán các loại keyboard cho mọi người, đủ thể loại cần tìm mẫu nam lẫn nữ chụp ảnh và đăng bài feedback', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946097/16589460976440.3889159379351652.jpg', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946086/16589460865350.38887584529027275.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (12,'brand12@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Quỳnh Nga', 'Cháo Ngon QN', 'Bình Thạnh, TP.HCM', '0322122211',  '2022-04-21 13:15:42.579', '1', 'Cháo dinh dưỡng cho trẻ em và người lớn, các món cháo đa dạng và được làm theo yêu cầu từng khách hàng.', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946140/16589461403220.6786625824446559.png', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946122/16589461231750.5874886334774594.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (13,'brand13@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'An Nguyễn', 'Mama shop', 'TP. HCM', '0368686890',  '2022-04-21 13:15:42.579', '1', 'Shop bán các vật phẩm cho mẹ bầu, mới sinh và trẻ nhỏ, từ quần áo, vật dụng hằng ngày đến thức ăn, sữa bột,...', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946304/16589463035240.8911036083774304.png', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946292/16589462917210.0446648191863126.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (14,'brand14@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Trúc Quỳnh', 'Trúc Quỳnh Cosmetic and Spa', 'Hà Nội', '0232357843',  '2022-04-21 13:15:42.579', '1', 'Bán các sản phẩm làm đẹp da và son môi, hàng chính hãng được nhập từ nước ngoài có mã vạch đầy đủ.', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946411/16589464097850.20534096543460012.jpg', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946392/16589463936610.8259621178609271.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (15,'brand15@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Anh Anh', 'Anh Anh Books', 'Hà Nội', '0344466688',  '2022-04-21 13:15:42.579', '1', 'Tiệm sách ở Hà Nội với đầy đủ thể loại sách và dụng cụ học tập', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946454/16589464528310.21836932955158317.jpg', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946442/16589464406900.1784008810031037.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (16,'brand16@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Thanh Huỳnh', 'Gaming Huỳnh', 'Bắc Ninh', '0365668892',  '2022-04-21 13:15:42.579', '1', 'Chuyên bán các linh kiện điện tử cho game thủ và các vật dụng như ghế ngồi, tai nghe, lót chuột, bàn phím cơ,...', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946581/16589465808750.7055823726305244.png', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946570/16589465708660.3841719433521602.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (17,'brand17@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Uyên Nga', 'Nhà sách Cá Chép', 'Quận 5, TP.HCM', '0399988867',  '2022-04-21 13:15:42.579', '1', 'Nhà sách Cá Chép ở quận 5 TP.HCM bán các thể loại sách và dụng cụ học tập cần bạn mẫu tới nhà sách quay chụp và đăng feedback', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946633/16589466324380.5977786154451985.jpg', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946612/16589466096630.6435352476243206.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (18,'brand18@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Trần Thanh Quỳnh', 'Skiny Fashion shop', 'Đà Nẵng', '0685939888',  '2022-04-21 13:15:42.579', '1', 'Shop thời trang cho mọi lứa tuổi và giới tính, đầy đủ quần áo,giày dép, đồng hồ,...', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946679/16589466801230.8786956741906196.jpg', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946661/16589466615180.062130316963570076.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (19,'brand19@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Quyên Nguyễn', 'The Show Media', 'TP. HCM', '0983949833',  '2022-04-21 13:15:42.579', '1', 'Hãng phim ngắn đăng trên utube cần tìm các bạn nam nữ trẻ tuổi xem phim và đăng feedback về phim trên mxh', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946784/16589467857460.48434587632577397.jpg', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946776/16589467775170.07469887916610429.jpg', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (20,'brand20@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'Hoàng Ngọc An', 'RacingShop', 'Hà Nội', '0789553023',  '2022-04-21 13:15:42.579', '1', 'Quán bán xe đạp và xe gắn máy ở Hà Nội, nhiều dòng xe đạp đẹp mắt cho trẻ em cùng nhiều xe gắn máy cho người lớn.', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946848/16589468466560.533274898819549.png', 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658946814/16589468122470.5874669272417519.png', '1', -1);

INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940229/16589402148310.9297352870512761.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (2, 1, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940232/16589402311300.7184952004431984.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (3, 2, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940275/16589402767350.41779614285389677.jpg.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (4, 2, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940276/16589402774100.6318716219839804.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (5, 3, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940313/16589403136280.4042185830954734.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (6, 3, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940314/16589403152110.1224237281731082.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (7, 3, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940315/16589403161810.9433582468521291.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (8, 4, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940349/16589403491200.5987946755580671.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (9, 4, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940350/16589403510230.36028399947989875.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (10, 4, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940350/16589403516590.07014224888869247.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (11, 5, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658927960/16589279611280.4762560535337521.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (12, 5, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940447/16589404481670.5606790898281444.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (13, 6, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940500/16589405012870.8306255482586771.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (14, 6, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940501/16589405023020.9661455911584482.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (15, 7, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940543/16589405439960.2706965783966273.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (16, 7, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940543/16589405446610.0734538557995239.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (17, 8, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940589/16589405899580.016853592503907278.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (18, 8, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940589/16589405906260.5276738083291317.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (19, 8, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940590/16589405912650.8963934659249047.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (20, 9, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940624/16589406252330.06655666637683377.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (21, 9, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940624/16589406258970.5306226692318723.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (22, 9, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940625/16589406265180.7023242884696805.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (23, 10, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940659/16589406601920.7792801108191807.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (24, 10, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940660/16589406608860.7398532723611777.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (25, 11, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940691/16589406920390.5380436457736557.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (26, 11, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940691/16589406927630.7768236928617962.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (27, 11, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940692/16589406936060.09944395259276262.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (28, 12, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940756/16589407571850.7878124212850939.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (29, 12, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940756/16589407577700.2953791250543494.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (30, 13, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940852/16589408525180.7857635822192774.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (31, 13, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940853/16589408549160.848214640641358.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (32, 14, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940884/16589408852930.7711583396269468.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (33, 14, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940885/16589408859280.5496131455268947.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (34, 14, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940885/16589408865320.9508930122034212.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (35, 14, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940886/16589408872160.3126385434732166.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (36, 15, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940919/16589409205750.46482248483279687.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (37, 15, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940920/16589409211710.6285874501171667.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (38, 16, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940950/16589409516480.5384546329587916.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (39, 16, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940951/16589409523020.0673640360584633.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (40, 17, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940984/16589409858520.49834303331434704.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (41, 17, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940985/16589409865760.4024890408647035.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (42, 17, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658940986/16589409873100.10346186296120718.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (43, 18, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658941018/16589410192000.6448385254006248.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (44, 18, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658941018/16589410198070.4480500194884016.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (45, 19, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658941047/16589410481720.6499093078218872.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (46, 19, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658941048/16589410492340.9265879951879477.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (47, 20, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658941070/16589410716470.8952002733283444.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (48, 20, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658941071/16589410725010.9750296789484405.jpg', '2');
INSERT INTO image_user OVERRIDING SYSTEM VALUE VALUES (49, 20, 1, 'https://res.cloudinary.com/kolcloudinary/image/upload/v1658941072/16589410732000.9085484687948076.jpg', '2');

INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 'https://facebook.com/phuongxuan', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (2, 1, 1, 'https://tiktok.com/phuongxuan', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (3, 2, 1, 'https://facebook.com/lnanh', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (4, 2, 1, 'https://tiktok.com/lanhan', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (5, 3, 1, 'https://facebook.com/ngoctruc9', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (6, 3, 1, 'https://tiktok.com/ngoctruc9', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (7, 4, 1, 'https://facebook.com/trannam.99', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (8, 4, 1, 'https://tiktok.com/trannam.99', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (9, 5, 1, 'https://facebook.com/thaop.99', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (10, 5, 1, 'https://tiktok.com/thaop.99', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (11, 6, 1, 'https://facebook.com/nga.99', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (12, 6, 1, 'https://tiktok.com/nga.99', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (13, 7, 1, 'https://facebook.com/panh.82', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (14, 7, 1, 'https://tiktok.com/panh.82', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (15, 8, 1, 'https://facebook.com/thaop.82', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (16, 9, 1, 'https://facebook.com/annatr.82', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (17, 9, 1, 'https://tiktok.com/annatr.82', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (18, 10, 1, 'https://facebook.com/qanh.82', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (19, 11, 1, 'https://facebook.com/ngahuong', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (20, 12, 1, 'https://facebook.com/nhinhi', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (21, 13, 1, 'https://facebook.com/nhiyaya', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (22, 13, 1, 'https://tiktok.com/nhiyaya', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (23, 14, 1, 'https://facebook.com/anhbich.82', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (24, 14, 1, 'https://tiktok.com/anhbich.82', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (25, 15, 1, 'https://facebook.com/jenny.82', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (26, 15, 1, 'https://tiktok.com/jenny.82', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (27, 16, 1, 'https://facebook.com/ngocbao.82', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (28, 17, 1, 'https://facebook.com/chaungoc.82', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (29, 17, 1, 'https://tiktok.com/chaungoc.82', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (30, 18, 1, 'https://facebook.com/tienthuy.82', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (31, 19, 1, 'https://facebook.com/annaguyen.82', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (32, 20, 1, 'https://facebook.com/phucdao', '1');
INSERT INTO bio_url OVERRIDING SYSTEM VALUE VALUES (33, 20, 1, 'https://tiktok.com/phucdao', '1');

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

INSERT INTO message OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1, 'Chào bạn, bạn cho mình xin địa chỉ chi tiết của shop nhé', '2022-04-21 13:15:42.579');
INSERT INTO message OVERRIDING SYSTEM VALUE VALUES (2, 1, 1, 2, 'Shop mình ở quận 7, Sài Gòn', '2022-04-21 13:15:42.579');
INSERT INTO message OVERRIDING SYSTEM VALUE VALUES (3, 1, 1, 2, 'Khi bạn tới lấy sản phẩm quay review thì mình sẽ trả tiền luôn nhé.', '2022-04-21 13:15:42.579');

INSERT INTO message OVERRIDING SYSTEM VALUE VALUES (4, 2, 1, 1, 'Bạn ơi, bên bạn có còn nhận quay video để quảng cáo sản phẩm ko?', '2022-04-21 13:15:42.579');
INSERT INTO message OVERRIDING SYSTEM VALUE VALUES (5, 2, 3, 2, 'Hiện tại mình còn cần nhé, bạn cho mình xin thông tin chi tiết của bạn nha!', '2022-04-21 13:15:42.579');

INSERT INTO message OVERRIDING SYSTEM VALUE VALUES (6, 3, 1, 1, 'Chào shop, mình có chuyên review về sản phẩm thời trang makeup, có thiện ý muốn hợp tác chung với shop nhé!', '2022-04-21 13:15:42.579');
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
ALTER TABLE "posts" ADD CONSTRAINT "PostsAddress" FOREIGN KEY ("address") REFERENCES "vn_tinhthanhpho" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
