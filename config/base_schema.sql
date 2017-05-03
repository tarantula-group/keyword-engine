CREATE TABLE migrations
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    run_on DATETIME NOT NULL
);
CREATE TABLE business_filtered_keywords
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    keyword VARCHAR(255),
    originalKeywordId INT(11),
    clientId INT(11)
);
CREATE TABLE clients
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    siteName VARCHAR(255),
    viewId VARCHAR(255),
    mainDomain VARCHAR(255),
    searchDomain VARCHAR(255),
    searchUrlPrefix VARCHAR(255),
    searchUrlSuffix VARCHAR(255),
    strategy VARCHAR(255),
    `separator` VARCHAR(255)
);
CREATE TABLE keywords
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    keyword VARCHAR(255),
    clicks INT(11),
    impressions INT(11),
    ctr DECIMAL(10),
    position DECIMAL(10),
    pageId INT(11),
    keywordValue DECIMAL(10),
    clientId VARCHAR(255)
);
CREATE TABLE negative_keywords
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    keyword VARCHAR(255),
    clientId VARCHAR(255)
);
CREATE TABLE pages
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    pagePath VARCHAR(255),
    pageValue DECIMAL(10),
    sessions INT(11),
    clientId INT(11)
);
CREATE TABLE product_filtered_keywords
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    keyword VARCHAR(255),
    originalKeywordId INT(11),
    clientId VARCHAR(255)
);
CREATE TABLE products
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    description TEXT,
    name VARCHAR(255),
    clientId INT(11)
);
CREATE TABLE stop_keywords
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    keyword VARCHAR(255),
    clientId INT(11)
);
CREATE TABLE target_keywords
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    fromUrl VARCHAR(255),
    toUrl VARCHAR(255),
    originalKeywordId INT(11),
    clientId INT(11)
);
CREATE TABLE tokens
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    tokenLabel VARCHAR(255),
    token VARCHAR(255),
    description VARCHAR(255),
    clientId INT(11)
);
CREATE TABLE white_keywords
(
    id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    keyword VARCHAR(255),
    originalKeywordId INT(11),
    clientId INT(11)
);