DROP TABLE IF EXISTS post_categories;
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
  "address" varchar(150),
  "phone" varchar(15),
  "gender" char,
  "follows" int4,
  "introduce" varchar(500),
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
  "address" varchar(150),
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
-- Table structure for Recruitment
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
  "url" varchar(150) NOT NULL,
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
  "url" varchar(150) NOT NULL,
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
  "url" varchar(150) NOT NULL,
  "type" char NOT NULL DEFAULT '2',
  PRIMARY KEY ("id")
) 
;

-- ----------------------------
-- Table structure for room
-- ----------------------------
-- role 1: kol, 2: brand
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
  PRIMARY KEY ("id")
) 
;

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
INSERT INTO kols OVERRIDING SYSTEM VALUE VALUES (1, 'kols1', 'kol1@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', null, null, null, null, null, null, '2022-04-21 13:15:42.579', '1', -1);
INSERT INTO brands OVERRIDING SYSTEM VALUE VALUES (1,'brand1@gmail.com', '$2a$10$JCrQY2/RUY.v.jMYkpTr.OckqqALYwMldyUw2E52C1jsLI.i4swYW', 'brand1', 'Brand 1', 'Thành phố Hồ Chí Minh', '123123123',  '2022-04-21 13:15:42.579', '1', null, '1', -1);

COMMIT;

-- ----------------------------
-- Records of room and message
-- ----------------------------
BEGIN;
INSERT INTO room OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1, 2);
INSERT INTO message OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1, 'đây là tin nhắn của id 1 role 1', '2022-04-21 13:15:42.579');
INSERT INTO message OVERRIDING SYSTEM VALUE VALUES (2, 1, 1, 2, 'đây là tin nhắn thứ nhất của id 1 role 2', '2022-04-21 13:15:42.579');
INSERT INTO message OVERRIDING SYSTEM VALUE VALUES (3, 1, 1, 2, 'đây là tin nhắn thứ 2 của id 1 role 2', '2022-04-21 13:15:42.579');
COMMIT;