DROP TABLE IF EXISTS post_categories;
DROP TABLE IF EXISTS image_recruitment;
DROP TABLE IF EXISTS image_post;
DROP TABLE IF EXISTS image_user;
DROP TABLE IF EXISTS recruitment;
DROP TABLE IF EXISTS posts;
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
  "id_writer" int4 NOT NULL,
  "state" char NOT NULL DEFAULT '0',
  "content" varchar NOT NULL,
  "abstract" varchar(1000) NOT NULL,
  "write_time" timestamp NOT NULL,
  "views" int4 NOT NULL DEFAULT '0',
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
-- Table structure for Image_Post
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
  "url" varchar(150) NOT NULL,
  "type" char NOT NULL DEFAULT '2',
  PRIMARY KEY ("id")
) 
;

ALTER TABLE "posts" ADD CONSTRAINT "UniqueTitle" UNIQUE ("title","id_writer");
ALTER TABLE "posts" ADD CONSTRAINT "PostBrands" FOREIGN KEY ("id_writer") REFERENCES "brands" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
