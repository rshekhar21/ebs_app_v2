-- Active: 1728019028452@@ebsserver.in@3306@pooja_samagri
DESCRIBE `stock`;
ALTER TABLE `stock` RENAME COLUMN `cost_tax` TO `cost_gst`;
ALTER TABLE `stock` ADD COLUMN `cost_tax` DECIMAL(5,2) DEFAULT NULL AFTER `cost_gst`;
ALTER TABLE `stock` ADD COLUMN `cost_gst` DECIMAL(5,2) DEFAULT NULL AFTER `cost_tax`;
-- ALTER TABLE `stock` MODIFY COLUMN `cost_gst` DECIMAL(5, 2);

ALTER TABLE `stock` ADD COLUMN `temp_id` VARCHAR(255) NULL AFTER `user_id`;

ALTER TABLE `stock` MODIFY COLUMN `gst` DECIMAL(5, 2);

-- ALTER TABLE `stockreturn` RENAME COLUMN `cost_tax` TO `cost_gst`;
ALTER TABLE `stockreturn` ADD COLUMN `cost_gst` DECIMAL(5,2) DEFAULT NULL AFTER `cost_tax`;

-- ALTER TABLE `stockreturn` MODIFY COLUMN `cost_gst` DECIMAL(5, 2);

ALTER TABLE `purchase` MODIFY COLUMN `order_date` DATE DEFAULT(CURRENT_DATE);
ALTER TABLE `purchase` ADD COLUMN `gst_roundoff` DECIMAL(2,2) DEFAULT NULL AFTER `tax_amount`;

ALTER TABLE `discounts` ADD COLUMN `disc_type` VARCHAR(15) DEFAULT '%' AFTER `disc_name`;

ALTER TABLE `orders` ADD COLUMN `location` VARCHAR(255) DEFAULT NULL AFTER `category`;
ALTER TABLE `orders` ADD COLUMN `previous_due` DECIMAL(9,2) DEFAULT NULL AFTER `alltotal`;
ALTER TABLE `sold` ADD COLUMN `category` VARCHAR(255) DEFAULT NULL AFTER `hsn`;

use pooja_samagri;
DESCRIBE party;


[byrrusmypims, dhiidjnlsyia, fwufpbbsvjqy, gzxynqgulilv, lepmjkyuturs, pavsnduvjvtk, rqekvcgzdzgc]

CREATE TABLE IF NOT EXISTS `emp_advance` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `emp_id` INT,
    `pymt_date` DATE NOT NULL,
    `amount` DECIMAL(9,3) NOT NULL,
    `pymt_mode` VARCHAR(255), 
    `purpose` VARCHAR(255),
    FOREIGN KEY (`emp_id`) REFERENCES `employee`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT COUNT(*) FROM `party`;
ALTER TABLE `party` ADD COLUMN `reward_percent` VARCHAR(4) DEFAULT '1' AFTER `rewards`;

UPDATE party SET reward_percent = '1' WHERE party_type NOT IN ('exempt', 'staff', 'Supplier');
UPDATE party SET enable_rewards = 1 WHERE party_type NOT IN ('exempt', 'staff', 'Supplier');


SHOW DATABASES;

SELECT * FROM `stock`;
SELECT * FROM `purchase`;


[addboss, db_addboss, db_collection, db_crew, db_crewmn, db_deepak, db_demo, db_fashion, db_hkimplex, db_poojasamigri, db_rockon, db_saurab, db_sovereign, db_sparsh, db_styleworth, db_trident, db_twn, local_pawan, pooja_samagri];

select * from stock order by id desc limit 10;

SELECT * FROM discounts;

select disc_id from orders where disc_id is not null order by id desc;

SELECT * FROM stock;