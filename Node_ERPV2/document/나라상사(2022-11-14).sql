-- 나라상사 ERP
CREATE DATABASE erpDBV2;
USE erpDBV2;

-- table 이 없을 때만 생성
CREATE TABLE IF NOT EXISTS tbl_buyer(
	b_code	VARCHAR(5)		PRIMARY KEY COMMENT "거래처코드",
	b_title	VARCHAR(125)	NOT NULL,	
	b_ceo	VARCHAR(50)	NOT NULL,	
	b_sid	VARCHAR(14),		
	b_tel	VARCHAR(15),		
	b_industry	VARCHAR(20),		
	b_business	VARCHAR(20),		
	b_ceo_tel	VARCHAR(14),		
	b_manager	VARCHAR(50)	NOT NULL,	
	b_man_tel	VARCHAR(14)	NOT NULL,	
	b_tax_addr	VARCHAR(50),		
	b_post_code	VARCHAR(10),		
	b_post_addr	VARCHAR(125),		
	b_etc_addr	VARCHAR(125)	
);

DESC tbl_buyer;

CREATE TABLE tbl_iolist(
	io_bcode VARCHAR(5),
    io_date VARCHAR(10),
    io_time VARCHAR(15)
);

DROP TABLE tbl_buyer;

INSERT INTO tbl_buyer(b_code, b_title, b_ceo, b_tel, b_manager, b_man_tel, b_post_addr) VALUES ("B0001","롯데상사","가나다","02-222-9999","홍길동","010-9999-8766","서울특별시 영등포구 여의도동 1번지");
INSERT INTO tbl_buyer(b_code, b_title, b_ceo, b_tel, b_manager, b_man_tel, b_post_addr) VALUES ("B0002","삼부상사","라마바","062-526-9988","이몽룡","010-9876-6781","");

SELECT * FROM tbl_buyer;

-- b_code 가 가장 큰 데이터 찾기
SELECT * FROM tbl_buyer ORDER BY b_code DESC LIMIT 1;


USE erpDBv2;

CREATE TABLE IF NOT EXISTS tbl_users (
username	VARCHAR(20)		PRIMARY KEY,
password	VARCHAR(125)	NOT NULL,	
real_name	VARCHAR(50),		
usertel	VARCHAR(15),		
nick_name	VARCHAR(50)	NOT NULL,	
user_role	INT	DEFAULT 9	
);

DESC tbl_users;

INSERT tbl_users (
	username, password, 
	real_name, nick_name, user_role)
VALUES (
	'polly', '12345', '홍길동', '길동아', 1
);


INSERT tbl_users (
	username, password, 
	real_name, nick_name, user_role)
VALUES (
	'pollor', '12345', '성춘향', '춘향아', 5
);

SELECT * FROM tbl_users;

CREATE TABLE IF NOT EXISTS tbl_product(
p_code	VARCHAR(13)		PRIMARY KEY,
p_title	VARCHAR(125)	NOT NULL,	
p_main_cat	VARCHAR(10),		
p_mid_cat	VARCHAR(10),		
p_sub_cat	VARCHAR(10),		
p_industry	VARCHAR(125),		
p_buyer	VARCHAR(125),		
p_iprice	INT,		
p_tax	INT	DEFAULT 1,	
p_oprice	INT	NOT NULL	
);
