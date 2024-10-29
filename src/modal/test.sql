-- Active: 1728019028452@@myebsserver.in@3306@db_demo

SELECT o.`id`, DATE_FORMAT(o.`order_date`, '%d/%m/%Y') AS `dated`, DATE_FORMAT(o.`order_date`, '%Y-%m-%d') AS `order_date`, p.`party_name`, o.`party`, p.`party_id`, o.`inv_number`, o.`order_type`, qs.`qty_sold` AS `qty`, o.`subtotal`, o.`discount`, o.`totaltax` AS `tax`, o.`freight`, o.`alltotal` AS `total`, o.`manual_tax`, py.`pymt`, o.`adjustment`, o.`round_off`, o.`alltotal` - ( COALESCE(py.`pymt`, 0) + COALESCE(o.`adjustment`, 0) ) AS `balance`, o.`fin_year`, o.`category`, o.`location`, o.`disc_id`, o.`disc_percent`, o.`rewards`, o.`redeem`, o.`notes`, o.`ship_id`, o.`tax_type`, o.`gst_type`, o.`previous_due`, MONTH(o.`order_date`) AS `month`, YEAR(o.`order_date`) AS `year`, u.`username` AS `biller`, o.`order_id`, o.`timestamp`, o.`order_id` FROM `orders` o LEFT JOIN `party` p ON o.`party` = p.`id` LEFT JOIN ( SELECT `order_id`, SUM(`qty`) as `qty_sold` FROM `sold`  GROUP BY `order_id` ) qs ON qs.`order_id` = o.`id` LEFT JOIN ( SELECT sum(`amount`) `pymt`, `order_id` FROM `payments` GROUP BY `order_id` ) py ON o.`id` = py.`order_id` LEFT JOIN `users` u ON o.`user_id` = u.`id` WHERE p.party_name LIKE 'search'  ORDER BY o.`order_date` DESC, o.`id` DESC;


SELECT o.`id`, DATE_FORMAT(o.`order_date`, '%d/%m/%Y') AS `dated`, DATE_FORMAT(o.`order_date`, '%Y-%m-%d') AS `order_date`, p.`party_name`, o.`party`, p.`party_id`, o.`inv_number`, o.`order_type`, qs.`qty_sold` AS `qty`, o.`subtotal`, o.`discount`, o.`totaltax` AS `tax`, o.`freight`, o.`alltotal` AS `total`, o.`manual_tax`, py.`pymt`, o.`adjustment`, o.`round_off`, o.`alltotal` - ( COALESCE(py.`pymt`, 0) + COALESCE(o.`adjustment`, 0) ) AS `balance`, o.`fin_year`, o.`category`, o.`location`, o.`disc_id`, o.`disc_percent`, o.`rewards`, o.`redeem`, o.`notes`, o.`ship_id`, o.`tax_type`, o.`gst_type`, o.`previous_due`, MONTH(o.`order_date`) AS `month`, YEAR(o.`order_date`) AS `year`, u.`username` AS `biller`, o.`order_id`, o.`timestamp`, o.`order_id` FROM `orders` o LEFT JOIN `party` p ON o.`party` = p.`id` LEFT JOIN ( SELECT `order_id`, SUM(`qty`) as `qty_sold` FROM `sold`  GROUP BY `order_id` ) qs ON qs.`order_id` = o.`id` LEFT JOIN ( SELECT sum(`amount`) `pymt`, `order_id` FROM `payments` GROUP BY `order_id` ) py ON o.`id` = py.`order_id` LEFT JOIN `users` u ON o.`user_id` = u.`id` WHERE (p.`party_name` LIKE 'raj' OR o.`year` LIKE 'raj' OR o.`fin_year` LIKE 'raj' OR o.`dated` LIKE 'raj' OR o.`biller` LIKE 'raj')  ORDER BY o.`order_date` DESC, o.`id` DESC limit 50;


SELECT * FROM (
    SELECT o.`id`, DATE_FORMAT(o.`order_date`, '%d/%m/%Y') AS `dated`, DATE_FORMAT(o.`order_date`, '%Y-%m-%d') AS `order_date`, p.`party_name`, o.`party`, p.`party_id`, o.`inv_number`, o.`order_type`, qs.`qty_sold` AS `qty`, o.`subtotal`, o.`discount`, o.`totaltax` AS `tax`, o.`freight`, o.`alltotal` AS `total`, o.`manual_tax`, py.`pymt`, o.`adjustment`, o.`round_off`, o.`alltotal` - ( COALESCE(py.`pymt`, 0) + COALESCE(o.`adjustment`, 0) ) AS `balance`, o.`fin_year`, o.`category`, o.`location`, o.`disc_id`, o.`disc_percent`, o.`rewards`, o.`redeem`, o.`notes`, o.`ship_id`, o.`tax_type`, o.`gst_type`, o.`previous_due`, MONTH(o.`order_date`) AS `month`, YEAR(o.`order_date`) AS `year`, u.`username` AS `biller`, o.`order_id`, o.`timestamp` FROM `orders` o LEFT JOIN `party` p ON o.`party` = p.`id` LEFT JOIN ( SELECT `order_id`, SUM(`qty`) as `qty_sold` FROM `sold`  GROUP BY `order_id` ) qs ON qs.`order_id` = o.`id` LEFT JOIN ( SELECT sum(`amount`) `pymt`, `order_id` FROM `payments` GROUP BY `order_id` ) py ON o.`id` = py.`order_id` LEFT JOIN `users` u ON o.`user_id` = u.`id`
) x WHERE (x.`party_name` LIKE '2025' OR x.`year` LIKE '2025' OR x.`fin_year` LIKE '2025' OR x.`dated` LIKE '2025' OR x.`biller` LIKE '2025') ORDER BY x.`order_date` DESC, x.`id` DESC limit 50;


SELECT `id`, `sku`, `product`, `pcode`, `size`, `qty`, coalesce(`price`,`mrp`) as `price`, `disc`, `net`, `gross` FROM `sold` WHERE `order_id` = '5842';

SELECT id, sku, product, price, mrp FROM viewstock;

SELECT COUNT(*) cnt FROM sold;
select (55313-35712) cnt


SELECT `id`, `sku`, `hsn`, `product`, `pcode`, `size`, `unit`, `mrp`, `price`, `discount`, `gst`, `available`, `brand`, `category`, `colour`, `disc_type`, `label`, `section`, `season`, `sold` FROM `viewstock` WHERE `sku` = ? OR `ean` = ?;


SELECT id, sku, product, mrp, price, size, discount, disc_type, brand, supplier FROM viewstock ORDER BY id desc;

SELECT * FROM stock ORDER BY id DESC;

UPDATE `stock` SET `price` = `mrp` WHERE `price` IS NULL;


show tables;

SELECT * FROM pymtfyear ORDER BY id DESC;

SELECT `id`, `sku`, `product`, `pcode`, COALESCE(`price`, `mrp`) AS `price`, `qty`, `size`, `brand`, `section`, `season`, `label`, `category`, `colour`, `available`, DATE_FORMAT(`timestamp`, '%d-%m-%Y') AS `dated` FROM `viewstock` ORDER BY `id` DESC;

SELECT * FROM viewstock;

































SELECT * FROM sold WHERE order_id = 228;


SELECT * FROM pymts;

SELECT * FROM orders order by id desc limit 10;

SELECT `product`, `size`, `unit`, COALESCE(`price`, `mrp`) as `price`, SUM(`qty`) `qty`, SUM(`disc`) `disc`, SUM(`tax`) `tax`, `gst`, SUM(`gross`) `amount`, coalesce(`disc_val`, CONCAT(`disc_per`, '%'),'') `disc_type` FROM `sold` WHERE `order_id` = '239' group by `product`, `size`, `unit`, `mrp`, `price`, `gst`, `disc_val`, `disc_per`;


SELECT `product`, `size`, `unit`, COALESCE(`price`, `mrp`) as `price`, SUM(`qty`) `qty`, SUM(`disc`) `disc`, SUM(`tax`) `tax`, `gst`, SUM(`gross`) `amount`, `disc_val`, `disc_per`, coalesce(`disc_val`, CONCAT(`disc_per`, '%'),'') `disc_type` FROM `sold` WHERE `order_id` = '230' group by `product`, `mrp`, `price`, `size`, `unit`, `gst`, `disc_val`, `disc_per`;


SELECT s.`id`, s.`sku`, s.`hsn`, s.`product`, s.`pcode`, s.`unit`, s.`mrp` AS `price`, s.`gst`, s.`size`, NULL AS `disc`, s.`sold`, s.`avl_qty` AS `avl`, 1 AS qty, CASE WHEN s.`disc_type` = '%' THEN s.`discount` ELSE NULL END AS `disc_per`, CASE WHEN s.`disc_type` IS NULL THEN s.`discount` ELSE NULL END AS `disc_val`, NULL AS `emp_id`, s.`season`, s.`section`, s.`category`, s.`colour`, s.`ean`, s.`brand`, s.`image`, coalesce(s.`sold`, 0) AS `sold` FROM `stock_view` s WHERE s.`avl_qty` > 0 AND (s.`product` LIKE 'search' OR s.`pcode` LIKE 'search' OR s.`sku` LIKE 'search' OR s.`hsn` LIKE 'search' OR s.`supplier` LIKE 'search' OR s.`category` LIKE 'search' OR s.`section` LIKE 'search' OR s.`season` LIKE 'search' OR s.`ean` LIKE 'search' OR s.`colour` LIKE 'search' OR s.`brand` LIKE 'search') ORDER BY s.`avl_qty` DESC LIMIT 50;

SELECT s.`id`, s.`sku`, s.`hsn`, s.`product`, s.`pcode`, s.`unit`, s.`mrp` AS `price`, s.`gst`, s.`size`, NULL AS `disc`, s.`sold`, s.`avl_qty` AS `avl`, 1 AS qty, CASE WHEN s.`disc_type` = '%' THEN s.`discount` ELSE NULL END AS `disc_per`, CASE WHEN s.`disc_type` IS NULL THEN s.`discount` ELSE NULL END AS `disc_val`, NULL AS `emp_id`, s.`season`, s.`section`, s.`category`, s.`colour`, s.`ean`, s.`brand`, s.`image`, coalesce(s.`sold`, 0) AS `sold` FROM `stock_view` s WHERE (s.`product` LIKE 'search' OR s.`pcode` LIKE 'search' OR s.`sku` LIKE 'search' OR s.`hsn` LIKE 'search' OR s.`supplier` = 'search' OR s.`category` LIKE 'search' OR s.`section` LIKE 'search' OR s.`season` LIKE 'search' OR s.`ean` LIKE 'search' OR s.`colour` LIKE 'search' OR s.`brand` LIKE 'search') ORDER BY s.`avl_qty` DESC LIMIT 50;


select s.supplier from viewstock s order by id desc limit 50;
select * from viewstock;


SELECT s.`id`, s.`sku`, s.`hsn`, s.`product`, s.`pcode`, s.`unit`, s.`mrp` AS `price`, s.`gst`, s.`size`, NULL AS `disc`, s.`sold`, s.`available` AS `avl`, 1 AS qty, CASE WHEN s.`disc_type` = '%' THEN s.`discount` ELSE NULL END AS `disc_per`, CASE WHEN s.`disc_type` IS NULL THEN s.`discount` ELSE NULL END AS `disc_val`, NULL AS `emp_id`, s.`season`, s.`section`, s.`category`, s.`colour`, s.`ean`, s.`brand`, s.`image`, coalesce(s.`sold`, 0) AS `sold` FROM `viewstock` s WHERE s.`available` > 0;


SELECT s.`id`, s.`sku`, s.`hsn`, s.`product`, s.`pcode`, s.`unit`, s.`mrp` AS `price`, s.`gst`, s.`size`, NULL AS `disc`, s.`sold`, s.`available` AS `avl`, 1 AS qty, CASE WHEN s.`disc_type` = '%' THEN s.`discount` ELSE NULL END AS `disc_per`, CASE WHEN s.`disc_type` IS NULL THEN s.`discount` ELSE NULL END AS `disc_val`, NULL AS `emp_id`, s.`season`, s.`section`, s.`category`, s.`colour`, s.`ean`, s.`brand`, s.`image`, coalesce(s.`sold`, 0) AS `sold` FROM `viewstock` s WHERE s.`available` > 0; AND (s.`product` LIKE 'ts' OR s.`pcode` LIKE 'ts' OR s.`sku` LIKE 'ts' OR s.`hsn` LIKE 'ts' OR s.`supplier` LIKE 'ts' OR s.`category` LIKE 'ts' OR s.`section` LIKE 'ts' OR s.`season` LIKE 'ts' OR s.`ean` LIKE 'ts' OR s.`colour` LIKE 'ts' OR s.`brand` LIKE 'ts') ORDER BY s.`available` DESC LIMIT 50;

SELECT s.`id`, s.`sku`, s.`hsn`, s.`product`, s.`pcode`, s.`unit`, s.`mrp` AS `price`, s.`gst`, s.`size`, NULL AS `disc`, s.`sold`, s.`available` AS `avl`, 1 AS qty, CASE WHEN s.`disc_type` = '%' THEN s.`discount` ELSE NULL END AS `disc_per`, CASE WHEN s.`disc_type` IS NULL THEN s.`discount` ELSE NULL END AS `disc_val`, NULL AS `emp_id`, s.`season`, s.`section`, s.`category`, s.`colour`, s.`ean`, s.`brand`, s.`image`, coalesce(s.`sold`, 0) AS `sold` FROM `viewstock` s WHERE s.`available` > 0; AND (s.`product` LIKE 'ts' OR s.`pcode` LIKE 'ts' OR s.`sku` LIKE 'ts' OR s.`hsn` LIKE 'ts' OR s.`supplier` LIKE 'ts' OR s.`category` LIKE 'ts' OR s.`section` LIKE 'ts' OR s.`season` LIKE 'ts' OR s.`ean` LIKE 'ts' OR s.`colour` LIKE 'ts' OR s.`brand` LIKE 'ts') ORDER BY s.`available` DESC LIMIT 50;

SELECT s.`id`, s.`sku`, s.`hsn`, s.`product`, s.`pcode`, s.`unit`, s.`mrp` AS `price`, s.`gst`, s.`size`, NULL AS `disc`, s.`sold`, s.`available` AS `avl`, 1 AS qty, CASE WHEN s.`disc_type` = '%' THEN s.`discount` ELSE NULL END AS `disc_per`, CASE WHEN s.`disc_type` IS NULL THEN s.`discount` ELSE NULL END AS `disc_val`, NULL AS `emp_id`, s.`season`, s.`section`, s.`category`, s.`colour`, s.`ean`, s.`brand`, s.`image`, coalesce(s.`sold`, 0) AS `sold` FROM `viewstock` s WHERE s.`available` > 0 AND (s.`product` LIKE '%je%' OR s.`pcode` LIKE '%je%' OR s.`sku` LIKE '%je%' OR s.`hsn` LIKE '%je%' OR s.`supplier` LIKE '%je%' OR s.`category` LIKE '%je%' OR s.`section` LIKE '%je%' OR s.`season` LIKE '%je%' OR s.`ean` LIKE '%je%' OR s.`colour` LIKE '%je%' OR s.`brand` LIKE '%je%') ORDER BY s.`available` DESC LIMIT 50;


SELECT l.`id`, l.`product`, l.`pcode`, l.`hsn`, l.`size`, l.`unit`, l.`qty`, l.`price`, l.`gst`, l.`disc`, l.`disc_val`, l.`disc_per`, s.`brand`, s.`section`, s.`season`, s.`category`, s.`label`, s.`colour` FROM `sold` l LEFT JOIN `stock` s ON s.`sku` = l.`sku` WHERE l.`order_id` = 206;

SELECT * FROM sold WHERE order_id = 207;

SELECT product, qty, price, disc, gst, tax, net, gross FROM sold;


UPDATE stock SET `unit` = 'PCS', `brand` = 'CK' WHERE id IN (473,474,475,476,477,478,479);

EXPLAIN sold;

select * from employee;
UPDATE employee SET status = 'Active' WHERE status is NULL;


ALTER TABLE `lepmjkyuturs`.`sold` ADD COLUMN `category` VARCHAR(255) DEFAULT NULL AFTER `hsn`;
-- [byrrusmypims, dhiidjnlsyia, fwufpbbsvjqy, gzxynqgulilv, lepmjkyuturs, pavsnduvjvtk, rqekvcgzdzgc]


SELECT category FROM sold where order_id = 212;

EXPLAIN orders;

select * from `lepmjkyuturs`.`pymt_methods`;



SELECT id,  pymt_for, party, order_id FROM pymtfyear;
UPDATE payments SET pymt_for = 'Sales' WHERE order_id IS NOT NULL;



SELECT * FROM orders;
EXPLAIN party;
SELECT * FROM sold;

SELECT `product`, `size`, `unit`, COALESCE(`mrp`, `price`) as `price`, SUM(`qty`) `qty`, SUM(`disc`) `disc`, SUM(`tax`) `tax`, `gst`, SUM(`gross`) `amount`, `disc_val`, `disc_per` FROM `sold` WHERE `order_id` = 2 group by `product`, `mrp`, `price`, `size`, `unit`, `gst`, `disc_val`, `disc_per`;

SELECT l.`sku`, s.`pcode`, coalesce(l.`hsn`, s.`hsn`) `hsn`, l.`product`, l.`qty`, coalesce(l.`size`, s.`size`) `size`, coalesce(l.`unit`, s.`unit`) `unit`, COALESCE(l.`mrp`, l.`price`) as `price`, l.`disc`, l.`gst`, l.`tax`, l.`net`, l.`gross` AS `total` FROM `sold` l left JOIN `stock` s ON s.`sku` = l.`sku` WHERE l.`order_id`=?;

SELECT `product`, `size`, `unit`, COALESCE(`price`, `mrp`) as `price`, SUM(`qty`) `qty`, SUM(`disc`) `disc`, SUM(`tax`) `tax`, `gst`, SUM(`gross`) `amount`, coalesce(`disc_val`, CONCAT(`disc_per`, '%'),'') `disc_type` FROM `sold` WHERE `order_id` = 2 group by `product`, `size`, `unit`, `mrp`, `price`, `gst`, `disc_val`, `disc_per`;

SELECT l.`sku`, s.`pcode`, coalesce(l.`hsn`, s.`hsn`) `hsn`, l.`product`, l.`qty`, coalesce(l.`size`, s.`size`) `size`, coalesce(l.`unit`, s.`unit`) `unit`, COALESCE(l.`price`, l.`mrp`) as `price`, l.`disc`, l.`gst`, l.`tax`, l.`net`, l.`gross` AS `total` FROM `sold` l left JOIN `stock` s ON s.`sku` = l.`sku` WHERE l.`order_id`= 2;


SELECT l.`sku`, s.`pcode`, coalesce(l.`hsn`,s.`hsn`) `hsn`, l.`product`, SUM(l.`qty`) AS `qty`, coalesce(l.`size`, s.`size`) `size`, coalesce(l.`unit`, s.`unit`) `unit`, COALESCE(l.`price`, l.`mrp`) AS `price`, SUM(l.`disc`) AS `disc`, l.`gst`, SUM(l.`tax`) AS `tax`, SUM(l.`net`) AS `net`, SUM(l.`gross`) AS `total` FROM `sold` l left JOIN `stock` s ON s.`sku` = l.`sku` WHERE l.`order_id`= 2 group by l.`sku`, s.`pcode`, l.`hsn`, s.`hsn`, l.`product`, l.`qty`, l.`size`, s.`size`, l.`unit`, s.`unit`, l.`mrp`, l.price, l.`disc`, l.`gst`, l.`tax`,l.`net`, l.`gross`; ?


SELECT * FROM orders order by id desc;

SELECT qty, mrp, price FROM sold WHERE order_id = 226;



WITH params AS ( SELECT '2024-10-15' AS date_val ), pymtf_p AS ( SELECT y.`order_id`, o.`order_date`, SUM(y.`amount`) AS `payment`, SUM(y.`cash`) AS `cash`, SUM(y.`bank`) AS `bank`, SUM(y.`other`) AS `other` FROM `pymtfyear` y JOIN `orders` o ON y.`order_id` = o.`id` CROSS JOIN params WHERE y.`pymt_for` = 'Sales' AND o.`order_date` = params.date_val GROUP BY y.`order_id`, o.`order_date` ), sold_positive AS ( SELECT SUM(`qty`) AS `qty`, SUM(`gross`) AS `sold`, `order_id` FROM `sold` WHERE `qty` > 0 GROUP BY `order_id` ), sold_negative AS ( SELECT SUM(`qty`) AS `gr`, SUM(`gross`) AS `return`, `order_id` FROM `sold` WHERE `qty` < 0 GROUP BY `order_id` ), ws_table AS ( SELECT l.`order_id`, SUM(l.`gross`) AS `ws`, SUM(l.`qty`) AS `ws_qty` FROM `sold` l JOIN `orders` o ON l.`order_id` = o.`id` CROSS JOIN params WHERE o.`category` = 'WS' GROUP BY o.`order_id` ), union_sales_pymt AS ( SELECT o.`id`, o.`id` AS `order_id`, NULL AS `purch_id`, o.`order_date` AS `date`, o.`party`, o.`inv_number` AS `inv`, o.`subtotal`, q.`sold`, g.`return`, ws.`ws`, o.`discount` AS `disc`, o.`totaltax` AS `tax`, q.`qty`, g.`gr`, o.`freight`, o.`alltotal`, p.`payment`, p.`cash`, p.`bank`, 'Sale' AS `entry`, NULL AS `pymt_for`, o.`entity`, o.order_id AS `orderid` FROM `orders` o LEFT JOIN pymtf_p p ON o.`id` = p.`order_id` LEFT JOIN sold_positive q ON q.`order_id` = o.`id` LEFT JOIN sold_negative g ON g.`order_id` = o.`id` LEFT JOIN ws_table ws ON ws.`order_id` = o.`id` WHERE o.`order_date` = (SELECT date_val FROM params) UNION SELECT p.`id`, p.`order_id`, p.`purch_id`, p.`pymt_date` AS `date`, p.`party`, NULL AS `inv_no`, NULL AS `subtotal`, NULL AS `purch`, NULL AS `return`, NULL AS `WS`, p.`adjustment` AS `disc`, NULL AS `tax`, NULL AS `sold`, NULL AS `gr`, NULL AS `freight`, NULL AS `alltotal`, p.`amount` AS `payment`, p.`cash`, p.`bank`, 'Pymt' AS `entry`, p.`pymt_for`, p.`entity`, NULL AS `orderid` FROM `pymtfyear` p LEFT JOIN ( SELECT `id`, `order_date` FROM `orders` GROUP BY `id`, `order_date` ) o ON o.`id` = p.`order_id` CROSS JOIN params WHERE p.`pymt_for` = 'Sales' AND (o.`order_date` IS NULL OR o.`order_date` < (SELECT date_val FROM params)) ), x AS ( SELECT * FROM union_sales_pymt ), new_bal AS ( SELECT p.`id`, COALESCE(p.`opening_bal`, 0) + COALESCE(o.`total`, 0) - (COALESCE(y.`payments`, 0) + COALESCE(y.`adj`, 0)) AS `new_bal` FROM `party` p LEFT JOIN ( SELECT `party`, SUM(`alltotal`) AS `total` FROM `orders` WHERE `order_date` <= (SELECT date_val FROM params) GROUP BY `party` ) o ON o.`party` = p.`id` LEFT JOIN ( SELECT `party`, SUM(`amount`) AS `payments`, SUM(`adjustment`) AS `adj` FROM `pymtfyear` WHERE `pymt_for` = 'Sales' AND `pymt_date` <= (SELECT date_val FROM params) GROUP BY `party` ) y ON y.`party` = p.`id` ), old_bal AS ( SELECT p.`id`, COALESCE(p.`opening_bal`, 0) + COALESCE(o.`total`, 0) - (COALESCE(y.`payments`, 0) + COALESCE(y.`adj`, 0)) AS `old_bal` FROM `party` p LEFT JOIN ( SELECT `party`, SUM(`alltotal`) AS `total` FROM `orders` WHERE `order_date` < (SELECT date_val FROM params) GROUP BY `party` ) o ON o.`party` = p.`id` LEFT JOIN ( SELECT `party`, SUM(`amount`) AS `payments`, SUM(COALESCE(`adjustment`, 0)) AS `adj` FROM `pymtfyear` WHERE `pymt_for` = 'Sales' AND `pymt_date` < (SELECT date_val FROM params) GROUP BY `party` ) y ON y.`party` = p.`id` ) SELECT x.`id`, x.`inv`, p.`party_name` AS `party`, p.`id` AS `party_id`, x.`alltotal` AS `total`, x.`sold`, x.`return` AS `return`, x.ws, x.`disc`, x.`tax`, x.`qty`, x.`gr`, x.`payment` AS `pymt`, x.`cash`, x.`bank`, x.`freight`, x.`entry` AS `type`, x.`orderid` FROM x LEFT JOIN `party` p ON x.`party` = p.`id` LEFT JOIN new_bal y ON x.`party` = y.`id` LEFT JOIN old_bal z ON x.`party` = z.`id` WHERE x.`purch_id` IS NULL AND x.`date` = (SELECT date_val FROM params) AND x.`entity` = 1 ORDER BY x.`id` ASC;


SELECT SUM(alltotal) AS sale FORM orders WHERE fin_year = '2025';






SELECT * FROM orders ORDER BY id DESC;
SELECT * FROM expense ORDER BY id DESC;

EXPLAIN employee;


SELECT id, order_date as dated, subtotal, discount, freight, totaltax as tax, alltotal as total, y.payment, alltotal - COALESCE(y.payment, 0) as balance FROM orders o LEFT JOIN(SELECT order_id, sum(amount) as payment FROM pymtfyear GROUP BY order_id) y ON y.order_id = o.id WHERE o.party = 2;


SELECT party_name, party_id, p.opening_bal as opening, o.total, y.payment, COALESCE(p.opening_bal, 0) + COALESCE(o.total,0) - COALESCE(y.payment) AS balance FROM party p LEFT JOIN(SELECT party, SUM(alltotal) as total FROM orders GROUP BY party) o ON o.party = p.id LEFT JOIN (SELECT party, SUM(amount) as payment FROM pymtfyear GROUP BY party) y on y.party = p.id WHERE p.id = 2;

SELECT id, DATE_FORMAT(order_date, '%d/%m/%Y') as dated, subtotal, discount as disc, freight, totaltax as tax, alltotal as total, y.payment, alltotal - COALESCE(y.payment, 0) as balance FROM orders o LEFT JOIN(SELECT order_id, sum(amount) as payment FROM pymtfyear GROUP BY order_id) y ON y.order_id = o.id WHERE o.party = 2 AND o.order_date BETWEEN '2024-01-01' AND '2024-08-31';


SELECT * FROM pymtfyear;


EXPLAIN party;


SELECT * FROM sold ORDER BY id DESC LIMIT 3;
SELECT * FROM orders ORDER BY id DESC LIMIT 5;

SELECT * FROM empsales;

SELECT DATE_FORMAT(order_date, '%d/%m/%Y') AS dated, SUM(alltotal) AS sale FROM orders WHERE MONTH(order_date) = MONTH(NOW()) AND YEAR(order_date) = YEAR(NOW()) GROUP BY order_date ORDER BY order_date desc;


EXPLAIN empsales;

SELECT * FROM sold WHERE emp_id IS NOT NULL;

SELECT emp_name, s.sale, s.order_id FROM employee e LEFT JOIN(select emp_id, order_id, sum(gross) as sale from sold group by emp_id, order_id ) s ON s.emp_id = e.id ;

SELECT 
    e.emp_name AS employee,  -- Assuming there's a `name` column in the `employee` table
    SUM(s.gross) AS sales
FROM 
    sold s
JOIN 
    orders o ON s.order_id = o.id
JOIN 
    employee e ON s.emp_id = e.id
WHERE 
    MONTH(o.order_date) = MONTH(CURRENT_DATE())
    AND YEAR(o.order_date) = YEAR(CURRENT_DATE())
GROUP BY 
    e.id
ORDER BY 
    sales DESC;

SELECT e.id AS employee_id, e.name AS employee_name, SUM(s.gross) AS sales FROM sold s JOIN orders o ON s.order_id = o.id JOIN employee e ON s.emp_id = e.id WHERE MONTH(o.order_date) = MONTH(CURRENT_DATE()) AND YEAR(o.order_date) = YEAR(CURRENT_DATE()) GROUP BY e.id ORDER BY sales DESC;


EXPLAIN purchase;


EXPLAIN stock;

SELECT * FROM party WHERE party_type = 'supplier' AND id = (SELECT MAX(id) FROM party WHERE party_type = 'supplier');


DROP Table IF exists `purchase_items`;

CREATE TABLE IF NOT EXISTS `purchase_items` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `sku` VARCHAR(255) NOT NULL,
    `product` VARCHAR(255),
    `qty` DECIMAL(9,3),
    `cost` DECIMAL(9,2) DEFAULT NULL,
    `cost_gst` DECIMAL(5,2) DEFAULT NULL,
    `purch_price` DECIMAL(9,2) DEFAULT NULL,
    `price` DECIMAL(9,2) DEFAULT NULL,
    `wsp` DECIMAL(9,2) DEFAULT NULL,
    `mrp` DECIMAL(9,2) DEFAULT NULL,
    `gst` DECIMAL(2,2) DEFAULT NULL,
    `ean` VARCHAR(255) DEFAULT NULL,
    `purch_id` INT UNSIGNED,
    FOREIGN KEY (`purch_id`) REFERENCES `purchase`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

EXPLAIN stock;

EXPLAIN purchase;
SHOW CREATE TABLE purchase;

CREATE TABLE `purchase` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `supid` int unsigned DEFAULT NULL,
  `order_date` date DEFAULT (curdate()),
  `order_number` varchar(255) DEFAULT NULL,
  `bill_date` date DEFAULT NULL,
  `bill_type` varchar(255) DEFAULT NULL,
  `bill_number` varchar(255) DEFAULT NULL,
  `sub_total` decimal(9,2) DEFAULT NULL,
  `discount` decimal(9,2) DEFAULT NULL,
  `tax_amount` decimal(9,2) DEFAULT NULL,
  `freight` decimal(9,2) DEFAULT NULL,
  `bill_amount` decimal(9,2) DEFAULT NULL,
  `quantity` decimal(9,2) DEFAULT NULL,
  `ref_filename` varchar(255) DEFAULT NULL,
  `fin_year` varchar(4) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `entity` int DEFAULT '1',
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1

SELECT * FROM purchase;

SELECT * FROM payments;
SELECT * FROM orders;

SELECT y.id, y.amount AS payment, y.cash, y.bank, y.bank_mode AS `mode`, m.method, b.bank_name AS account, y.notes FROM pymtfyear y left JOIN bank b ON b.id = y.bank_id left JOIN pymt_methods m ON m.id = y.pymt_method WHERE y.order_id = 85;


ALTER TABLE `purchase_items` ADD COLUMN `ean` VARCHAR(255) DEFAULT NULL AFTER `gst`;
SHOW CREATE TABLE `purchase_items`;

drop table if exists testtbl;
CREATE TABLE IF NOT EXISTS `testtbl` ( `id` int auto_increment primary key, `name` VARCHAR(255) null, `order_date` date default (CURRENT_DATE));
INSERT INTO testtbl (name) VALUES ('raj');
SELECT * FROM testtbl;

SELECT CURRENT_DATE ;

SELECT temp_id, purch_price FROM viewstock ORDER BY id DESC LIMIT 1;

EXPLAIN payments;

SHOW TABLES;
SHOW CREATE TABLE stock;

CREATE TABLE `stock` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `sku` varchar(255) NOT NULL,
  `ean` varchar(255) DEFAULT NULL,
  `hsn` varchar(255) DEFAULT NULL,
  `upc` varchar(255) DEFAULT NULL,
  `pcode` varchar(255) DEFAULT NULL,
  `product` varchar(255) NOT NULL,
  `mrp` decimal(9,2) DEFAULT NULL,
  `price` decimal(9,2) DEFAULT NULL,
  `wsp` decimal(9,2) DEFAULT NULL,
  `sale_price` decimal(9,2) DEFAULT NULL,
  `gst` decimal(5,2) DEFAULT NULL,
  `purch_price` decimal(9,2) DEFAULT NULL,
  `cost` decimal(9,2) DEFAULT NULL,
  `cost_gst` decimal(5,2) DEFAULT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `qty` decimal(9,3) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `discount` decimal(9,2) DEFAULT NULL,
  `disc_type` varchar(255) DEFAULT NULL,
  `colour` varchar(255) DEFAULT NULL,
  `season` varchar(255) DEFAULT NULL,
  `section` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `vendor` varchar(255) DEFAULT NULL,
  `comments` text,
  `purch_id` int unsigned DEFAULT NULL,
  `purch_date` date DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `updated_qty` decimal(9,3) DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `temp_id` varchar(255) DEFAULT NULL,
  `entity` int DEFAULT '1',
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `purch_id` (`purch_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`purch_id`) REFERENCES `purchase` (`id`) ON DELETE SET NULL,
  CONSTRAINT `stock_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=latin1

SELECT * FROM payments order by id desc;


SELECT * FROM stock order by `id` desc;
DELETE FROM stock WHERE purch_id = 11;

SELECT id FROM stock WHERE sku = '1040';

SELECT * FROM stock WHERE id = 194;

SELECT CAST(`sku` AS UNSIGNED) FROM `stock` WHERE id = (SELECT MAX(`id`) FROM `stock`);

SELECT MAX(id) + 1001 AS `sku` FROM `stock`;


SELECT CAST(`sku` AS UNSIGNED) AS sku FROM stock;
SELECT max(`id`) from purchase;

INSERT INTO `stock`(`sku`,`ean`,`hsn`,`upc`,`pcode`,`product`,`mrp`,`price`,`wsp`,`gst`,`purch_price`,`cost`,`cost_gst`,`unit`,`size`,`qty`,`discount`,`disc_type`,`colour`,`season`,`section`,`category`,`label`,`brand`,`purch_id`,`temp_id`) VALUES  
('1195','','','TS','TSPN','TSHIRT PN',null,900,null,null,500,500,null,'PCS','',10,null,'','','ALL','','SPORTS','PREMIUM','USPA',undefined,'1726254969175'),
('1196','','','TS','TSPN','TSHIRT PN',null,900,null,null,500,500,null,'PCS','',10,null,'','','ALL','','SPORTS','PREMIUM','USPA',undefined,'1726254969175'),
('1197','','','TS','TSPN','TSHIRT PN',null,900,null,null,500,500,null,'PCS','',10,null,'','','ALL','','SPORTS','PREMIUM','USPA',undefined,'1726254969175'),
('1198','','','TS','TSPN','TSHIRT PN',null,900,null,null,500,500,null,'PCS','',10,null,'','','ALL','','SPORTS','PREMIUM','USPA',undefined,'1726254969175'),
('1199','','','TS','TSPN','TSHIRT PN',null,900,null,null,500,500,null,'PCS','',10,null,'','','ALL','','SPORTS','PREMIUM','USPA',undefined,'1726254969175'),
('1200','','','TS','TSPN','TSHIRT PN',null,900,null,null,500,500,null,'PCS','',10,null,'','','ALL','','SPORTS','PREMIUM','USPA',undefined,'1726254969175'),
('1201','','','TS','TSPN','TSHIRT PN',null,900,null,null,500,500,null,'PCS','',10,null,'','','ALL','','SPORTS','PREMIUM','USPA',undefined,'1726254969175'),
('1202','','','TS','TSPN','TSHIRT PN',null,900,null,null,500,500,null,'PCS','',10,null,'','','ALL','','SPORTS','PREMIUM','USPA',undefined,'1726254969175'),
('1203','','','TS','TSPN','TSHIRT PN',null,900,null,null,500,500,null,'PCS','',10,null,'','','ALL','','SPORTS','PREMIUM','USPA',undefined,'1726254969175'),
('1204','','','TS','TSPN','TSHIRT PN',null,900,null,null,500,500,null,'PCS','',10,null,'','','ALL','','SPORTS','PREMIUM','USPA',undefined,'1726254969175'),
('1205','','','TS','TSPN','TSHIRT PN',null,900,null,null,500,500,null,'PCS','',10,null,'','','ALL','','SPORTS','PREMIUM','USPA',undefined,'1726254969175'),
('1206','','','TS','TSPN','TSHIRT PN',null,900,null,null,500,500,null,'PCS','',10,null,'','','ALL','','SPORTS','PREMIUM','USPA',undefined,'1726254969175'),
('1207','','','TS','TSPN','TSHIRT PN',null,900,null,null,500,500,null,'PCS','',10,null,'','','ALL','','SPORTS','PREMIUM','USPA',undefined,'1726254969175'),
('1208','','','TS','TSPN','TSHIRT PN',null,900,null,null,500,500,null,'PCS','',10,null,'','','ALL','','SPORTS','PREMIUM','USPA',undefined,'1726254969175'),
('1209','','','TS','TSPN','TSHIRT PN',null,900,null,null,500,500,null,'PCS','',10,null,'','','ALL','','SPORTS','PREMIUM','USPA',undefined,'1726254969175');

SELECT `id` as `edit_id`, DATE_FORMAT(`order_date`, '%Y-%m-%d') AS `order_date`, `supid` as `sup_id`, date_format(`bill_date`, '%Y-%m-%d') AS `bill_date`, `bill_number`, `discount` AS `disc_val`, (`discount`/`sub_total`) * 100 AS `disc`, ROUND((`discount`/`sub_total`) * 100) AS `disc_per`, `bill_type` AS `order_type`, `order_number` as `tmp_id`, COALESCE(`gst_roundoff`, 0) as `round` FROM `purchase` WHERE `id` = ?;



SELECT `id`, `product`, `pcode`, `size`, `unit`, `qty`, `cost`, `cost_gst`, `price`, `gst`, `wsp`, `mrp`, `discount`, `disc_type`, `brand`, `section`, `season`, `category`, `colour`, `upc`, `label`, `hsn`, `ean`, `purch_price`, `purch_id`  FROM `stock` WHERE `purch_id` = 17;


SELECT `id`, `cash`, `bank`, `other`, `amount`, `bank_id`, `bank_mode`, `pymt_method`, `pymt_date`, `notes` FROM `payments` WHERE `purch_id` = 14;

UPDATE `discounts` SET `disc_type` = '%' WHERE `id` = 1;

EXPLAIN orders;
SELECT * FROM purchase;


DELETE FROM `stock` WHERE `id` = 373 AND `purch_id` IS NULL;

SELECT `id` FROM stock WHERE id = 373;

SELECT o.`inv_number` AS `inv_no`, p.`party_name`, l.`sku`, l.`product`, l.`pcode`, l.`size`, l.`qty`, l.`mrp` AS `price`, l.`disc`, l.`gst`, l.`tax`, l.`net`, l.`gross` FROM `sold` l JOIN `orders` o ON o.`id` = l.`order_id` JOIN `party` p ON p.id = o.`party` WHERE o.`order_date` = ? and l.qty > 0;


SELECT category from orders order by id desc;


SELECT o.inv_number AS inv_no, p.party_name, l.sku, l.product, l.pcode, l.size, l.qty, l.mrp AS price, l.disc, l.gst, l.tax, l.net, l.gross FROM sold l JOIN orders o ON o.id = l.order_id JOIN party p ON p.id = o.party WHERE o.order_date = '2024-09-19' and l.qty > 0;
SELECT o.inv_number AS inv_no, p.party_name, l.sku, l.product, l.pcode, l.size, l.qty, l.mrp AS price, l.disc, l.gst, l.tax, l.net, l.gross FROM sold l JOIN orders o ON o.id = l.order_id JOIN party p ON p.id = o.party WHERE o.order_date = '2024-09-19' and l.qty > 0 AND o.category = 'WS';

select * from sold l JOIN orders o on o.id = l.order_id WHERE o.category = '';

SELECT id, party_name, party_id from party order by id desc;

SELECT e.emp_name AS employee, SUM(s.gross) AS sales FROM sold s JOIN orders o ON s.order_id = o.id JOIN employee e ON s.emp_id = e.id WHERE MONTH(o.order_date) = MONTH(CURRENT_DATE()) AND YEAR(o.order_date) = YEAR(CURRENT_DATE()) GROUP BY e.id ORDER BY sales DESC;

EXPLAIN orders;

SELECT * FROM pymtfyear where order_id = 153;
SELECT `id`, `cash`, `bank`, `other`, `amount`, `bank_id`, `bank_mode`, `pymt_method` FROM `pymtfyear` WHERE `order_id` = 153 AND `pymt_date` = '2024-09-24';

SELECT * from sold WHERE order_id = 159;


EXPLAIN sold;
select * from orders order by id desc limit 1;

SELECT * from pymtfyear order by id desc limit 159;
SELECT * from payments where order_id = '159';

explain payments;

show create pymtfyear;

explain pymt_methods;

explain sold

select * from sold where order_id = 171;

select * from orders where id = 159;

SHOW CREATE TABLE payments;

INSERT INTO `sold`(`order_id`,`sku`,`hsn`,`qty`,`product`,`pcode`,`size`,`unit`,`mrp`,`price`,`disc`,`gst`,`tax`,`net`,`gross`,`emp_id`,`disc_val`,`disc_per`,`entity`) VALUES (166, '1001', null, '1', 'TSHIRT', 'TS', null, 'PCS', '800', '800', null, 5, 40, 800, 840, null, null, null, '1'),(166, '1001', null, '1', 'TSHIRT', 'TS', null, 'PCS', '800', '800', null, 5, 40, 800, 840, null, null, null, '1'),(166, '1001', null, '1', 'TSHIRT', 'TS', null, 'PCS', '800', '800', null, 5, 40, 800, 840, null, null, null, '1'),(166, '1001', null, '1', 'TSHIRT', 'TS', null, 'PCS', '800', '800', null, 5, 40, 800, 840, null, null, null, '1'),(166, '1001', null, '1', 'TSHIRT', 'TS', null, 'PCS', '800', '800', null, 5, 40, 800, 840, null, null, null, '1');


select * from sold where order_id = 167;

SELECT COUNT(*) as cnt FROM orders;

explain orders;

SELECT id, order_id, product FROM sold WHERE order_id = 176;


DELETE FROM `sold` WEHRE `id` = 1233;

SELECT DATE_FORMAT(`order_date`, '%d/%m/%Y') AS `dated`, SUM(`alltotal`) AS sale FROM `orders` WHERE MONTH(`order_date`) = MONTH(NOW()) AND YEAR(`order_date`) = YEAR(NOW()) GROUP BY `order_date` ORDER BY `order_date` desc;



SELECT * FROM purchase;

SELECT * FROM stock ORDER BY id desc limit 5;

SELECT * FROM stock WHERE purch_id = 20;

SELECT u.`id`, p.`party_name` as `supplier`, DATE_FORMAT(COALESCE(`bill_date`, `order_date`), '%d/%m/%Y') as `dated`, `order_number`, u.`quantity` as `qty`, `bill_type`, `bill_number`, `sub_total` as `subtotal`, `discount` as `disc`, `tax_amount` as `tax`, `freight`, `bill_amount` as `total`, y.`pymt`, `fin_year`, u.`notes`, `supid`, u.`timestamp` from `purchase` u LEFT JOIN `party` p on p.`id` = u.`supid` LEFT JOIN ( select `purch_id`, sum(`amount`) as `pymt` from `pymtfyear` group by `purch_id`) y on y.`purch_id` = u.`id` WHERE u.`id` =  20 order by u.`id`;


 SELECT u.`id`, u.`order_number`, DATE_FORMAT(COALESCE(u.`bill_date`, u.`order_date`), '%d/%m/%Y') AS `dated`, p.`party_name` AS `supplier`, u.`supid`, u.`bill_type`, u.`bill_number`, u.`quantity` AS `qty`, u.`sub_total` AS `subtotal`, u.`discount` AS `disc`, u.`tax_amount` AS `tax`, u.`freight`, u.`bill_amount` AS `total`, y.`pymt`, u.`fin_year` AS `fyear`, u.`ref_filename`, COALESCE(u.`bill_date`, u.`order_date`) AS `bdate` FROM `purchase` u LEFT JOIN `party` p ON p.id = u.`supid` LEFT JOIN ( SELECT `purch_id`, sum(`amount`) AS `pymt` FROM `pymtfyear` WHERE `pymt_for` = 'purchase' GROUP BY `purch_id` ) y ON y.`purch_id` = u.`id` WHERE u.`id` = ?;

SELECT `id`, `sku`, `product`, `pcode`, `mrp`, `price`, `wsp`, `gst`, `size`, `discount`, `disc_type`, `brand`, `colour`, `label`, `section`, `season`, `category`, `upc`, `hsn`, `unit`, `prchd_on`, `purch_id`, `bill_number`, `supid`, `supplier`, `ean`, COALESCE(`cost`, `purch_price`) AS `cost`, COALESCE(`purch_price`, `cost`) AS `purch_price`, `cost_gst`, `qty`, `sold`, `defect`, `returned`, `available`, `product` AS `original_name` FROM `viewstock` WHERE `purch_id` = 16;


INSERT INTO `stock`(`sku`,`ean`,`hsn`,`upc`,`pcode`,`product`,`mrp`,`price`,`wsp`,`gst`,`purch_price`,`cost`,`cost_gst`,`unit`,`size`,`qty`,`discount`,`disc_type`,`colour`,`season`,`section`,`category`,`label`,`brand`,`purch_id`,`temp_id`) VALUES 
('1727539350884',null,null,null,'TS','TS',null,1500,null,null,500,500,null,null,null,10,null,null,null,null,null,null,null,null,25,'1727536412384'),('1727539350885',null,null,null,'JNS','JEANS',null,2100,null,null,700,700,null,null,null,10,null,null,null,null,null,null,null,null,25,'1727536412384'),('1727539350886',null,null,null,'KU','KURTI',null,900,null,null,450,450,null,null,null,5,null,null,null,null,null,null,null,null,25,'1727536412384'),('1727539350887',null,null,null,null,'PLAZO',null,1800,null,null,600,600,null,null,null,15,null,null,null,null,null,null,null,null,25,'1727536412384');



SELECT * FROM pymtfyear where purch_id = '24'



SELECT * FROM sold where order_id = 184;

SELECT * FROM payments WHERE order_id = 184;

SELECT * FROM payments ORDER BY id desc LIMIT 5;


SHOW CREATE TABLE payments;

UPDATE `stock` s LEFT JOIN `sold` l on l.`sku` = s.`sku` SET s.`sku` = 1425 WHERE s.`id` = 425 AND l.`sku` IS NULL;

SELECT id, sku from stock where id = 425;
SELECT * FROM sold;


DELETE FROM `party` p LEFT JOIN `orders` o ON o.`party` = p.id LEFT JOIN `payments` y ON y.`party` = p.id WHERE o.`id` is null AND y.`id` IS NULL AND p.id =?;

DELETE FROM `party` WHERE id = 25 AND NOT EXISTS ( SELECT 1 FROM `orders` WHERE `party` = 25 ) AND NOT EXISTS ( SELECT 1 FROM `payments` WHERE `party` = 25 );




DELETE p FROM `party` p LEFT JOIN `orders` o ON o.`party` = p.id LEFT JOIN `payments` y ON y.`party` = p.id WHERE o.`id` IS NULL AND y.`id` IS NULL AND p.`id` = 18;

explain purchase;


SELECT date_format(`bill_date`, '%d/%m/%Y') AS `bill_date`, `bill_number`, `discount` AS `disc_val`, `bill_type` AS `order_type`, `quantity` AS `qty`, `sub_total` AS `subtotal`, `tax_amount` AS `tax`, `bill_amount` AS `total` FROM `purchase` WHERE `id` = 16;

SELECT bill_date from purchase WHERE id = 16;

SELECT date_format(`bill_date`, '%d/%m/%Y') AS `bill_date`, `bill_number`, `discount` AS `disc_val`, (`discount`/`sub_total`) * 100 AS `disc`, ROUND((`discount`/`sub_total`) * 100) AS `disc_per`, `bill_type` AS `order_type`, `quantity` AS `qty`, `sub_total` AS `subtotal`, `tax_amount` AS `tax`, `bill_amount` AS `total` FROM `purchase` WHERE `id` = 16;

SELECT order_number from purchase where id = 16;


select round(2.9999) as disc;


EXPLAIN stock;

EXPLAIN purchase;
EXPLAIN sold;

SELECT * from hold;
SELECT * from holditems;

EXPLAIN `address`;

SELECT id, DATE_FORMAT(order_date, '%d/%m/%Y') AS dated, alltotal AS total FROM orders ORDER BY id DESC LIMIT 10;
SELECT DATE_FORMAT(order_date, '%d/%m/%Y') AS dated, DATE_FORMAT(order_date, '%d') AS date, SUM(alltotal) AS sale FROM orders WHERE MONTH(order_date) = (MONTH(NOW()) -1) GROUP BY order_date ORDER BY order_date DESC;

SELECT MONTH(order_date) AS mnth, SUM(alltotal) sales FROM orders WHERE fin_year = CASE WHEN MONTH(NOW())>3 THEN YEAR(NOW())+1 ELSE YEAR(NOW()) END GROUP BY MONTH(order_date);

SELECT fin_year AS fy, SUM(alltotal) sale FROM orders GROUP BY fin_year LIMIT 5;

SELECT 
    MONTH(order_date) AS mnth, 
    SUM(CASE 
            WHEN fin_year = CASE 
                              WHEN MONTH(NOW()) > 3 THEN YEAR(NOW()) + 1 
                              ELSE YEAR(NOW()) 
                            END 
            THEN alltotal 
            ELSE 0 
        END) AS current_fy,
    SUM(CASE 
            WHEN fin_year = CASE 
                              WHEN MONTH(NOW()) > 3 THEN YEAR(NOW()) 
                              ELSE YEAR(NOW()) - 1 
                            END 
            THEN alltotal 
            ELSE 0 
        END) AS last_fy
FROM orders 
GROUP BY MONTH(order_date);

SELECT DATE_FORMAT(order_date, '%d/%m/%Y') AS dated, DATE_FORMAT(order_date, '%d') AS date, SUM(alltotal) AS sale FROM orders WHERE MONTH(order_date) = MONTH(NOW()) GROUP BY order_date ORDER BY order_date DESC;

update purchase set gst_roundoff = '0.03' where id = 16;

SELECT * FROM `stock` WHERE `purch_id` = 16;


SELECT u.`id`, p.`party_name` as `supplier`, DATE_FORMAT(COALESCE(`bill_date`, `order_date`), '%d/%m/%Y') as `dated`, `order_number`, u.`quantity` as `qty`, `bill_type`, `bill_number`, `sub_total` as `subtotal`, `discount` as `disc`, `tax_amount` as `tax`, `freight`, `bill_amount` as `total`, y.`pymt`, `fin_year`, u.`notes`, `supid`, u.`timestamp` from `purchase` u LEFT JOIN `party` p on p.`id` = u.`supid` LEFT JOIN ( select `purch_id`, sum(`amount`) as `pymt` from `pymtfyear` group by `purch_id`) y on y.`purch_id` = u.`id` WHERE u.`id` =  17 order by u.`id`;


DELETE FROM stock WHERE id > 1379;



SELECT 
    DATE(order_date) AS `date`,
    SUM(CASE 
            WHEN MONTH(order_date) = MONTH(CURDATE()) 
                 AND YEAR(order_date) = YEAR(CURDATE()) 
            THEN alltotal 
            ELSE 0 
        END) AS current_month_sales,
    SUM(CASE 
            WHEN MONTH(order_date) = MONTH(CURDATE() - INTERVAL 1 MONTH) 
                 AND YEAR(order_date) = YEAR(CURDATE() - INTERVAL 1 MONTH)
            THEN alltotal 
            ELSE 0 
        END) AS last_month_sales
FROM orders
WHERE (MONTH(order_date) = MONTH(CURDATE()) AND YEAR(order_date) = YEAR(CURDATE())) 
   OR (MONTH(order_date) = MONTH(CURDATE() - INTERVAL 1 MONTH) AND YEAR(order_date) = YEAR(CURDATE() - INTERVAL 1 MONTH))
GROUP BY DATE(order_date)
ORDER BY DATE(order_date);



SELECT 
    day_num.day AS day,
    SUM(CASE 
            WHEN MONTH(order_date) = MONTH(CURDATE()) 
                 AND YEAR(order_date) = YEAR(CURDATE()) 
                 AND DAY(order_date) = day_num.day
            THEN alltotal 
            ELSE 0 
        END) AS current_month_sales,
    SUM(CASE 
            WHEN MONTH(order_date) = MONTH(CURDATE() - INTERVAL 1 MONTH) 
                 AND YEAR(order_date) = YEAR(CURDATE() - INTERVAL 1 MONTH)
                 AND DAY(order_date) = day_num.day
            THEN alltotal 
            ELSE 0 
        END) AS last_month_sales
FROM 
    (SELECT 1 AS day UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL 
     SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL 
     SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL 
     SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL 
     SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL SELECT 25 UNION ALL 
     SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30 UNION ALL 
     SELECT 31) AS day_num
LEFT JOIN orders ON day_num.day = DAY(order_date)
GROUP BY day_num.day
ORDER BY day_num.day;



SELECT 
    day_num.day AS day,
    SUM(CASE 
            WHEN MONTH(order_date) = MONTH(NOW()) 
                 AND YEAR(order_date) = 2025 
                 AND fin_year = 2025
                 AND DAY(order_date) = day_num.day
            THEN alltotal 
            ELSE 0 
        END) AS fy_2025_sales,
    SUM(CASE 
            WHEN MONTH(order_date) = MONTH(NOW() - INTERVAL 1 YEAR) 
                 AND YEAR(order_date) = 2024 
                 AND fin_year = 2024
                 AND DAY(order_date) = day_num.day
            THEN alltotal 
            ELSE 0 
        END) AS fy_2024_sales
FROM 
    (SELECT 1 AS day UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL 
     SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL 
     SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL 
     SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL 
     SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL SELECT 25 UNION ALL 
     SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30 UNION ALL 
     SELECT 31) AS day_num
LEFT JOIN orders ON day_num.day = DAY(order_date)
WHERE fin_year IN (2025, 2024)
GROUP BY day_num.day
ORDER BY day_num.day;


SELECT 
    day_num.day AS day,
    SUM(CASE 
            WHEN MONTH(order_date) = 4 AND fin_year = 2025 AND DAY(order_date) = day_num.day 
            THEN alltotal 
            ELSE 0 
        END) AS April,
    SUM(CASE 
            WHEN MONTH(order_date) = 5 AND fin_year = 2025 AND DAY(order_date) = day_num.day 
            THEN alltotal 
            ELSE 0 
        END) AS May,
    SUM(CASE 
            WHEN MONTH(order_date) = 6 AND fin_year = 2025 AND DAY(order_date) = day_num.day 
            THEN alltotal 
            ELSE 0 
        END) AS June,
    SUM(CASE 
            WHEN MONTH(order_date) = 7 AND fin_year = 2025 AND DAY(order_date) = day_num.day 
            THEN alltotal 
            ELSE 0 
        END) AS July,
    SUM(CASE 
            WHEN MONTH(order_date) = 8 AND fin_year = 2025 AND DAY(order_date) = day_num.day 
            THEN alltotal 
            ELSE 0 
        END) AS August,
    SUM(CASE 
            WHEN MONTH(order_date) = 9 AND fin_year = 2025 AND DAY(order_date) = day_num.day 
            THEN alltotal 
            ELSE 0 
        END) AS September,
    SUM(CASE 
            WHEN MONTH(order_date) = 10 AND fin_year = 2025 AND DAY(order_date) = day_num.day 
            THEN alltotal 
            ELSE 0 
        END) AS October,
    SUM(CASE 
            WHEN MONTH(order_date) = 11 AND fin_year = 2025 AND DAY(order_date) = day_num.day 
            THEN alltotal 
            ELSE 0 
        END) AS November,
    SUM(CASE 
            WHEN MONTH(order_date) = 12 AND fin_year = 2025 AND DAY(order_date) = day_num.day 
            THEN alltotal 
            ELSE 0 
        END) AS December,
    SUM(CASE 
            WHEN MONTH(order_date) = 1 AND fin_year = 2025 AND DAY(order_date) = day_num.day 
            THEN alltotal 
            ELSE 0 
        END) AS January,
    SUM(CASE 
            WHEN MONTH(order_date) = 2 AND fin_year = 2025 AND DAY(order_date) = day_num.day 
            THEN alltotal 
            ELSE 0 
        END) AS February,
    SUM(CASE 
            WHEN MONTH(order_date) = 3 AND fin_year = 2025 AND DAY(order_date) = day_num.day 
            THEN alltotal 
            ELSE 0 
        END) AS March
FROM 
    (SELECT 1 AS day UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL 
     SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL 
     SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL 
     SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL 
     SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL SELECT 25 UNION ALL 
     SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30 UNION ALL 
     SELECT 31) AS day_num
LEFT JOIN orders ON day_num.day = DAY(order_date)
WHERE fin_year = 2025
GROUP BY day_num.day
ORDER BY day_num.day;


SELECT 
    day_num.day AS day,
    COALESCE(SUM(CASE WHEN MONTH(order_date) = 4 AND fin_year = 2024 THEN alltotal ELSE 0 END), 0) AS April,
    COALESCE(SUM(CASE WHEN MONTH(order_date) = 5 AND fin_year = 2024 THEN alltotal ELSE 0 END), 0) AS May,
    COALESCE(SUM(CASE WHEN MONTH(order_date) = 6 AND fin_year = 2024 THEN alltotal ELSE 0 END), 0) AS June,
    COALESCE(SUM(CASE WHEN MONTH(order_date) = 7 AND fin_year = 2024 THEN alltotal ELSE 0 END), 0) AS July,
    COALESCE(SUM(CASE WHEN MONTH(order_date) = 8 AND fin_year = 2024 THEN alltotal ELSE 0 END), 0) AS August,
    COALESCE(SUM(CASE WHEN MONTH(order_date) = 9 AND fin_year = 2024 THEN alltotal ELSE 0 END), 0) AS September,
    COALESCE(SUM(CASE WHEN MONTH(order_date) = 10 AND fin_year = 2024 THEN alltotal ELSE 0 END), 0) AS October,
    COALESCE(SUM(CASE WHEN MONTH(order_date) = 11 AND fin_year = 2024 THEN alltotal ELSE 0 END), 0) AS November,
    COALESCE(SUM(CASE WHEN MONTH(order_date) = 12 AND fin_year = 2024 THEN alltotal ELSE 0 END), 0) AS December,
    COALESCE(SUM(CASE WHEN MONTH(order_date) = 1 AND fin_year = 2024 THEN alltotal ELSE 0 END), 0) AS January,
    COALESCE(SUM(CASE WHEN MONTH(order_date) = 2 AND fin_year = 2024 THEN alltotal ELSE 0 END), 0) AS February,
    COALESCE(SUM(CASE WHEN MONTH(order_date) = 3 AND fin_year = 2024 THEN alltotal ELSE 0 END), 0) AS March
FROM 
    (SELECT 1 AS day UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL 
     SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL 
     SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL 
     SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL 
     SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL SELECT 25 UNION ALL 
     SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30 UNION ALL 
     SELECT 31) AS day_num
LEFT JOIN orders ON day_num.day = DAY(order_date)
WHERE fin_year = 2024
GROUP BY day_num.day
ORDER BY day_num.day;







SELECT 
    DAY(order_date) AS `dated`,
    SUM(CASE WHEN order_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01') THEN alltotal ELSE 0 END) AS current_month_sales,
    SUM(CASE WHEN order_date >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01') 
             AND order_date < DATE_FORMAT(CURDATE(), '%Y-%m-01') THEN alltotal ELSE 0 END) AS last_month_sales
FROM 
    orders
GROUP BY 
    `dated`
ORDER BY 
    `dated`;



SELECT DAY(order_date) AS `dated`, SUM(CASE WHEN order_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01') THEN alltotal ELSE 0 END) AS current_month_sales, SUM(CASE WHEN order_date >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01') AND order_date < DATE_FORMAT(CURDATE(), '%Y-%m-01') THEN alltotal ELSE 0 END) AS last_month_sales FROM orders GROUP BY `dated` ORDER BY `dated`;



SELECT 
    MONTH(order_date) AS mnth, 
    DATE_FORMAT(order_date, '%b') AS short_month,
    SUM(CASE 
            WHEN fin_year = CASE 
                              WHEN MONTH(NOW()) > 3 THEN YEAR(NOW()) + 1 
                              ELSE YEAR(NOW()) 
                            END 
            THEN alltotal 
            ELSE 0 
        END) AS current_fy,
    SUM(CASE 
            WHEN fin_year = CASE 
                              WHEN MONTH(NOW()) > 3 THEN YEAR(NOW()) 
                              ELSE YEAR(NOW()) - 1 
                            END 
            THEN alltotal 
            ELSE 0 
        END) AS last_fy
FROM orders 
GROUP BY MONTH(order_date), short_month;



SELECT p.`id`, p.`party_name` AS `name`, p.`party_id`, p.`contact`, o.`cnt` AS `orders`, p.`opening_bal` AS `opening`, o.`billing`, y.`pymt` AS `payments`, ( COALESCE(o.`billing`, 0) - COALESCE(y.`pymt`, 0) ) + COALESCE(p.`opening_bal`) AS `dues` FROM `party` p LEFT JOIN ( SELECT count(`party`) `cnt`, sum(`alltotal`) `billing`, `party` FROM `orders` GROUP BY `party` ) o ON o.`party` = p.`id` LEFT JOIN ( SELECT x.`party`, sum(x.`amount`) `pymt` FROM `pymtfyear` x INNER JOIN party p ON x.party = p.id WHERE p.party_type <> 'supplier' GROUP BY x.`party` ) y ON y.`party` = p.id WHERE p.`id` = (SELECT MAX(id) FROM party) ORDER BY p.`id` ASC;


select s.`id`, s.`sku`, s.`product`, s.`pcode`, s.`mrp`, s.`price`, s.`wsp`, s.`gst` as `tax`, s.`size`, s.`discount` as `disc`, s.`disc_type`, s.`brand`, s.`colour`, s.`label`, s.`section` as `sec`, s.`season` as `sea`, s.`category` as `cat`, s.`upc`, s.`hsn`, s.`unit`, u.`order_number` as `po#`, coalesce( date_format(u.`bill_date`, '%d-%m-%Y'), date_format(s.`purch_date`, '%d-%m-%Y') ) as `purch_on`, p.`party_name` as `supplier`, s.`ean`, s.`cost`, s.`qty`, ds.`dqty` as `ds`, s.`updated_qty` as `luq`, l.`sold`, sr.`gr`, s.`qty` - coalesce(ds.`dqty`, 0) - ( ifnull(l.`sold`, 0) + ifnull(sr.`gr`, 0) ) `avl`, s.`purch_id` as `puid`, s.`image` from `stock` s left join ( select s.`sku`, sum(s.`qty`) `sold` from `sold` s left join `orders` o on s.`order_id` = o.`id` where o.`entity` = 1 group by s.`sku` ) l on s.`sku` = l.`sku` left join ( select `sku`, sum(`qty`) as `gr` from `stockreturn` group by `sku` ) sr on s.`sku` = sr.`sku` left join ( select `sku`, sum(`qty`) as `dqty` from `defective_stock` where `dnote_id` is null GROUP BY `sku` ) ds on s.`sku` = ds.`sku` left join `purchase` u on u.`id` = s.`purch_id` left join `party` p on p.`id` = u.`supid` where s.`entity` = 1 and s.id = (SELECT MAX(id) FROM stock) order by s.`id` asc;


SELECT * FROM stock_view;

EXPLAIN stock_view;

SELECT
    `id`,
    `sku`,
    `product`,
    `pcode`,
    `mrp`,
    `price`,
    `wsp`,
    `gst`,
    `size`,
    `discount`,
    `disc_type`,
    `brand`,
    `colour`,
    `label`,
    `section`,
    `season`,
    `category`,
    `upc`,
    `hsn`,
    `unit`,
    `prchd_on`,
    `bill_number` as `prch_num`,
    `supid`,
    `supplier`,
    `ean`,
    `cost`,
    `qty`,
    `sold`,
    `defect`,
    `returned` as `gr`,
    `available` as `avl`,
    `product` as `original_name`
FROM `viewstock` WHERE id = (SELECT MAX(id) FROM stock);

EXPLAIN sold;



SELECT `id`, `sku`, `hsn` `product`, `pcode`, `size`, `unit`, `mrp`, `price`, `discount` as `disc`, `gst`, `available`, `brand`, `category`, `colour`, `disc_type`, `label`, `section`, `season`, `sold` FROM `viewstock`;




SELECT MONTH(order_date) AS mnth, SUM(alltotal) sales FROM orders WHERE fin_year = CASE WHEN MONTH(NOW())>3 THEN YEAR(NOW())+1 ELSE YEAR(NOW()) END GROUP BY MONTH(order_date), fin_year;

SELECT DATE_FORMAT(order_date, '%d/%m/%Y') AS dated, SUM(alltotal) AS sales FROM orders WHERE MONTH(order_date) = MONTH(NOW()) AND YEAR(order_date) = YEAR(NOW()) GROUP BY order_date ORDER BY order_date desc;




EXPLAIN sold;

CREATE TABLE IF NOT EXISTS test(`id` INT AUTO_INCREMENT PRIMARY KEY, `name` VARCHAR(255));

INSERT INTO test(`name`) VALUES('RAJ');




SELECT MONTH(order_date) AS mnth, SUM(alltotal) sales FROM orders WHERE fin_year = CASE WHEN MONTH(NOW())>3 THEN YEAR(NOW())+1 ELSE YEAR(NOW()) END GROUP BY MONTH(order_date), fin_year;

SELECT DATE_FORMAT(order_date, '%d/%m/%Y') AS dated, DATE_FORMAT(order_date, '%d') AS date, SUM(alltotal) AS sale FROM orders WHERE MONTH(order_date) = MONTH(NOW()) GROUP BY order_date ORDER BY order_date DESC;

SELECT DATE_FORMAT(order_date, '%d/%m/%Y') AS dated, SUM(alltotal) AS sales FROM orders WHERE MONTH(order_date) = MONTH(NOW()) AND YEAR(order_date) = YEAR(NOW()) GROUP BY order_date ORDER BY order_date desc;




SHOW FULL TABLES WHERE table_type = 'VIEW';

SELECT * FROM stock_view

EXPLAIN employee;

EXPLAIN party;



SELECT * FROM sold order BY id desc;


SELECT * FROM pymtfyear ORDER BY id DESC;

UPDATE payments SET pymt_for = 'Sales' WHERE pymt_for IS NULL;

show TABLES;

SELECT * FROM lepmjkyuturs.stock;

SHOW FULL TABLES;

SHOW FULL TABLES FROM lepmjkyuturs
WHERE table_type = 'VIEW';


-- INSERT INTO `entity` (`entity_id`,`entity_name`) VALUES ('epZVVD4gr769iuAghZtCTy', 'NEW ENTITY');

DELETE FROM entity WHERE id = 2;


SELECT * FROM entity


SELECT `id`, `inv_number`, MAX(`order_date`) `order_date` FROM `orders` WHERE `order_type` = 'cn' GROUP BY `id`, `inv_number` ORDER BY `id` DESC LIMIT 1;

INSERT INTO `stock`(`sku`,`ean`,`hsn`,`upc`,`pcode`,`product`,`mrp`,`price`,`wsp`,`gst`,`purch_price`,`cost`,`cost_gst`,`unit`,`size`,`qty`,`discount`,`disc_type`,`colour`,`season`,`section`,`category`,`label`,`brand`,`purch_id`,`temp_id`) VALUES 
('1727902805352',null,null,null,'TS','TS',1499,750,null,5,350,350,0,'PCS','XS',1,null,null,null,null,null,null,null,null,50,'1727902048865'),
('1727902805353',null,null,null,'TS','TS',1499,750,650,0,350,350,0,'PCS','M',1,null,null,null,null,null,null,null,null,50,'1727902048865'),
('1727902805354',null,null,null,'TS','TS',1499,750,650,0,350,350,0,'PCS','L',1,null,null,null,null,null,null,null,null,50,'1727902048865'),
('1727902805355',null,null,null,'TS','TS',1499,750,650,0,350,350,0,'PCS','2XL',1,null,null,null,null,null,null,null,null,50,'1727902048865'),
('1727902805356',null,null,null,'TS','TS',1499,750,650,0,350,350,0,'PCS','3XL',1,null,null,null,null,null,null,null,null,50,'1727902048865')


select * from byrrusmypims.`entity`;

UPDATE byrrusmypims.`entity` SET `status` = true WHERE id = 1;


show create table ebs_clients.`users`;



SELECT * FROM stock where purch_id is not null;

SELECT * FROM purchase;



EXPLAIN orders;

select
            `order_id`,
            sum(`amount`) as `pymt`,
            sum(`adjustment`) as `forfiet`
        from `payments`
        where `order_id` = 1;

SELECT * FROM orders;


SELECT p.`opening_bal`, y.`pymt`, o.`total`, co.`cot`, cp.`cpymt`, (o.`total` - co.`cot`) + ifnull(p.`opening_bal`,0) + ifnull(cp.`cpymt`, 0) - (ifnull(y.`pymt`,0) + ifnull(y.`adj`,0)) AS `current_due` FROM `party` p LEFT JOIN (SELECT `party`, SUM(`amount`) `pymt`, SUM(`adjustment`) `adj` FROM `payments` WHERE `pymt_for` = 'sales' GROUP BY `party`) y ON y.`party` = p.`id` LEFT JOIN (SELECT `party`, SUM(`alltotal`) `total` FROM `orders` GROUP BY `party`) o ON o.`party` = p.id LEFT JOIN (SELECT `party`, `alltotal` AS cot FROM `orders` WHERE id = 190) co ON co.`party` = p.`id` LEFT JOIN (SELECT `party`, SUM(`amount`) AS `cpymt` FROM `payments` WHERE `order_id` = 190 GROUP BY `party`) cp ON cp.`party` = p.`id` WHERE p.`id` = (SELECT `party` FROM `orders` WHERE `id` = 190);


SELECT * FROM orders WHERE party = 2;
SELECT * FROM pymtfyear WHERE party = 2;




SELECT * FROM sold;
SHOW tables;

SELECT * FROM entity;

SELECT * FROM hold;
EXPLAIN hold;
SHOW CREATE TABLE hold;


CREATE TABLE `hold` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `date` date NOT NULL,
  `bill_type` varchar(255) NOT NULL,
  `party` int NOT NULL,
  `mtax` decimal(9,2) DEFAULT NULL,
  `disc` decimal(9,2) DEFAULT NULL,
  `disc_type` varchar(255) DEFAULT NULL,
  `disc_percent` decimal(3,2) DEFAULT NULL,
  `disc_notes` varchar(255) DEFAULT NULL,
  `freight` decimal(9,2) DEFAULT NULL,
  `pymt_amount` decimal(9,2) DEFAULT NULL,
  `cash` decimal(9,2) DEFAULT NULL,
  `bank` decimal(9,2) DEFAULT NULL,
  `other` decimal(9,2) DEFAULT NULL,
  `bank_mode` varchar(255) DEFAULT NULL,
  `pymt_method` varchar(255) DEFAULT NULL,
  `bank_id` int DEFAULT NULL,
  `txnid` varchar(255) DEFAULT NULL,
  `pymt_notes` varchar(255) DEFAULT NULL,
  `entity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `hold_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
























SHOW CREATE TABLE purchase;


CREATE TABLE `purchase` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `supid` int unsigned DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `order_number` varchar(255) DEFAULT NULL,
  `bill_date` date DEFAULT NULL,
  `bill_type` varchar(255) DEFAULT NULL,
  `bill_number` varchar(255) DEFAULT NULL,
  `sub_total` decimal(9,2) DEFAULT NULL,
  `discount` decimal(9,2) DEFAULT NULL,
  `tax_amount` decimal(9,2) DEFAULT NULL,
  `freight` decimal(9,2) DEFAULT NULL,
  `bill_amount` decimal(9,2) DEFAULT NULL,
  `quantity` decimal(9,2) DEFAULT NULL,
  `ref_filename` varchar(255) DEFAULT NULL,
  `fin_year` varchar(4) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `entity` int DEFAULT '1',
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1


SELECT * from purchase;


-- CREATE TRIGGER before_insert_my_table
-- BEFORE INSERT ON my_table
-- FOR EACH ROW
-- BEGIN
--     IF MONTH(NEW.date) >= 4 THEN
--         SET NEW.fin_year = CONCAT(YEAR(NEW.date), '-', YEAR(NEW.date) + 1);
--     ELSE
--         SET NEW.fin_year = CONCAT(YEAR(NEW.date) - 1, '-', YEAR(NEW.date));
--     END IF;
-- END //

-- CREATE TRIGGER before_insert_my_table
-- BEFORE INSERT ON my_table
-- FOR EACH ROW
-- BEGIN
--     IF MONTH(NEW.date) >= 4 THEN
--         SET NEW.fin_year = CONCAT(YEAR(NEW.date), '-', YEAR(NEW.date) + 1);
--     ELSE
--         SET NEW.fin_year = CONCAT(YEAR(NEW.date) - 1, '-', YEAR(NEW.date));
--     END IF;
-- END //

SELECT * FROM pymt_methods;


SELECT total, pymt, (COALESCE(total,0) - COALESCE(pymt,0)) dueamt, (SELECT alltotal FROM orders WHERE id = (SELECT MAX(id) FROM orders WHERE party = p.id)) AS latest_order_total FROM party p LEFT JOIN (SELECT party, SUM(alltotal) total FROM orders GROUP BY party) o ON o.party = p.id LEFT JOIN (SELECT party, SUM(amount) pymt FROM pymtfyear GROUP BY party) y ON y.party = p.id WHERE p.id = 2;



SELECT * FROM users WHERE user_role = 'user';

SELECT * FROM restrictions;

SHOW CREATE TABLE restrictions;

SELECT * FROM discounts;
SELECT * FROM pymt_methods;
ALTER TABLE pymt_methods ADD FOREIGN KEY (`default_bank`) REFERENCES bank(`id`) ON DELETE SET NULL;


ALTER TABLE db_addboss.pymt_methods ADD COLUMN `default_bank` INT UNSIGNED DEFAULT NULL AFTER `method`;

-- addboss, db_addboss, db_collection, db_crew, db_crewmn, db_deepak, db_demo, db_fashion, 
-- db_hkimplex, db_saurab, db_sovereign, db_sparsh, db_styleworth, db_trident, local_pawan, 
-- pooja_samagri

DESCRIBE db_addboss.pymt_methods;
ALTER TABLE db_addboss.pymt_methods ADD COLUMN `default_bank` INT DEFAULT NULL AFTER `method`;
ALTER TABLE db_addboss.pymt_methods ADD FOREIGN KEY (`default_bank`) REFERENCES bank(`id`) ON DELETE SET NULL;
SELECT * FROM db_addboss.pymt_methods;

SELECT `product`, `size`, `unit`, `mrp` `price`, SUM(`qty`) `qty`, SUM(`disc`) `disc`, SUM(`tax`) `tax`, `gst`, SUM(`gross`) `amount`, `disc_val`, `disc_per` FROM `sold` WHERE `order_id` = 33 group by `product`, `size`, `unit`, `mrp`, `gst`, `disc_val`, `disc_per`;

SELECT `id`, product, `size` FROM sold;

UPDATE sold SET `size` = NULL WHERE `size` = 'null';

SELECT o.* FROM orders o LEFT JOIN pymtfyear p ON o.id = p.order_id WHERE p.order_id IS NULL;
SELECT o.id, DATE_FORMAT(o.order_date, '%d/%m/%Y') AS dated, o.alltotal AS total FROM orders o LEFT JOIN pymtfyear p ON o.id = p.order_id WHERE p.order_id IS NULL

SELECT id, order_date, now(), curdate() FROM orders;

SELECT o.id, p.party_name AS party, o.alltotal AS total FROM orders o LEFT JOIN party p ON p.id = o.party WHERE o.order_date = CURDATE();

SELECT DATE_FORMAT(order_date, '%d/%m/%Y') AS dated, SUM(alltotal) AS sale FROM orders GROUP BY order_date ORDER BY order_date DESC; 

SELECT * FROM pymt_methods;

SELECT * FROM stock ORDER BY id DESC;
UPDATE stock SET mrp = null  WHERE price is not null;

SELECT * FROM `orders`;
SELECT * FROM party;
SHOW CREATE TABLE `orders`;

DELETE FROM pymt_methods;

ALTER TABLE pymt_methods AUTO_INCREMENT 1;

INSERT INTO `pymt_methods`(`method`) VALUES('Google Pay'),('Phone Pay'),('PayTM'),('Card'),('UPI'),('IMPS'),('NEFT/RTGS');


SELECT s.`id`, s.`sku`, s.`hsn`, s.`product`, s.`pcode`, s.`unit`, s.`mrp` as `price`, s.`gst`, s.`size`, NULL as `disc`, s.`sold`, s.`avl_qty` as `avl`, 1 as qty, CASE WHEN s.`disc_type` = '%' THEN s.`discount` ELSE NULL END AS `disc_per`, CASE WHEN s.`disc_type` IS NULL THEN s.`discount` ELSE NULL END AS `disc_val`, NULL as `emp_id`, s.season, s.section, s.category, s.colour, s.ean, s.brand, s.`image`, coalesce(s.`sold`, 0) as `sold` FROM `stock_view` s ORDER BY s.id ASC;

SELECT s.`id`, s.`sku`, s.`hsn`, s.`product`, s.`product` as `original_name`, lcase(s.`product`) as `product_lowercase`, s.`pcode`, lcase(s.`pcode`) as `pcode_lowercase`, s.`unit`, s.`mrp` as `price`, s.`gst`, s.`size`, NULL as `disc`, s.`sold`, s.`avl_qty` as `avl`, 1 as qty, CASE WHEN s.`disc_type` = '%' THEN s.`discount` ELSE NULL END AS `disc_per`, CASE WHEN s.`disc_type` IS NULL THEN s.`discount` ELSE NULL END AS `disc_val`, NULL as `emp_id`, s.`season`, s.`section`, s.`category`, s.`colour`, s.`ean`, s.`brand`, s.`image`, coalesce(s.`sold`, 0) as `sold` FROM `stock_view` s ORDER BY s.id ASC;


SELECT default_character_set_name, default_collation_name
FROM information_schema.SCHEMATA
WHERE schema_name = 'mydatabase';

SELECT table_name, table_collation
FROM information_schema.TABLES
WHERE table_schema = 'db_demo' AND table_name = 'entity';

SELECT column_name, character_set_name, collation_name
FROM information_schema.COLUMNS
WHERE table_schema = 'db_demo' AND table_name = 'entity';

ALTER TABLE `entity` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `entity` MODIFY `entity_name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

SHOW CREATE TABLE entity;

CREATE TABLE `entity` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `entity_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tag_line` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reg_num` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pan_num` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gst_num` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reg_since` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `entity_id` (`entity_id`),
  UNIQUE KEY `entity_name` (`entity_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE DATABASE `mydatabase` CHARACTER SET utf8mb4;
DROP DATABASE IF EXISTS `mydatabase`;


CREATE TABLE `employee` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `party` int DEFAULT NULL,
  `emp_id` varchar(255) DEFAULT NULL,
  `emp_name` varchar(255) NOT NULL,
  `birthday` date DEFAULT NULL,
  `joining` date DEFAULT NULL,
  `bg` varchar(5) DEFAULT NULL,
  `deg` varchar(255) DEFAULT NULL,
  `father` varchar(255) DEFAULT NULL,
  `mother` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `aadhaar` varchar(255) DEFAULT NULL,
  `hometown` varchar(255) DEFAULT NULL,
  `ecd` varchar(255) DEFAULT NULL,
  `ref` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gender` varchar(25) DEFAULT NULL,
  `salary` decimal(9,2) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `exprience` varchar(255) DEFAULT NULL,
  `education` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `lwd` date DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



SHOW CREATE TABLE employee;


SELECT * FROM discounts;

SELECT COALESCE(sum(rewards), 0) - COALESCE(sum(redeem), 0) as rwds FROM orders WHERE party = 1;

SELECT * FROM orders;

SELECT * FROM party;

DELETE from discounts; 
ALTER TABLE discounts AUTO_INCREMENT 1;
INSERT INTO `discounts`(`disc_name`, `value`) VALUES('Rewards', 1),('Birthday', null),('Reference', null),('Commission', null),( 'Goodwill', null),('Other', null);



SELECT MAX(`id`) AS `last_id` FROM `orders`;
SELECT * FROM stock_view;

SELECT * FROM orders ORDER BY id desc limit 1;
SELECT `id`, `inv_number`, MAX(`order_date`) `order_date` FROM `orders` GROUP BY `id`, `inv_number` ORDER BY `id` DESC LIMIT 1;


SELECT * FROM orders ORDER BY id DESC LIMIT 2;
SELECT * FROM sold ORDER BY id DESC LIMIT 10;

SELECT SUM(o.alltotal) as billing, SUM(y.amount) AS pymt, (SELECT alltotal FROM orders WHERE id = (SELECT MAX(id) FROM orders WHERE party = p.id)) AS latest_order_total FROM party p LEFT JOIN orders o ON o.party = p.id LEFT JOIN pymtfyear y on y.party = p.id WHERE p.id = 10;

SELECT total, pymt, (COALESCE(total,0) - COALESCE(pymt,0)) dueamt, (SELECT alltotal FROM orders WHERE id = (SELECT MAX(id) FROM orders WHERE party = p.id)) AS latest_order_total FROM party p LEFT JOIN (SELECT party, SUM(alltotal) total FROM orders GROUP BY party) o ON o.party = p.id LEFT JOIN (SELECT party, SUM(amount) pymt FROM pymtfyear GROUP BY party) y on y.party = p.id WHERE p.id = 10;

SELECT * FROM orders WHERE party = 10;

SELECT alltotal FROM orders WHERE id = (SELECT MAX(id) FROM orders WHERE party = 2);

SELECT 
    SUM(o.alltotal) AS billing, 
    SUM(y.amount) AS pymt,
    (SELECT alltotal FROM orders WHERE id = (SELECT MAX(id) FROM orders WHERE party = p.id)) AS latest_order_total
FROM 
    party p
LEFT JOIN 
    orders o ON o.party = p.id
LEFT JOIN 
    pymtfyear y ON y.party = p.id
WHERE 
    p.id = 2;

SELECT * FROM users ORDER BY id DESC;

;

SELECT * FROM clients ORDER BY id DESC;

;

SELECT id + 1001 AS newsku FROM stock ORDER BY id DESC LIMIT 1;

select
    o.`id`,
    DATE_FORMAT(o.`order_date`, '%d/%m/%Y') AS date,
    p.`party_name` `party`,
    o.`party` `pid`,
    p.`party_id`,
    o.`inv_number` `invnum`,
    o.`order_type` `type`,
    o.`subtotal`,
    o.`discount` `disc`,
    o.`totaltax` `tax`,
    o.`freight` as `fc`,
    o.`alltotal` `total`,
    py.`pymt`,
    o.`adjustment` `adj`,
    o.`alltotal` - (
        COALESCE(py.`pymt`, 0) + COALESCE(o.`adjustment`, 0)
    ) as `balance`,
    o.`fin_year` `fyear`,
    u.`username` `biller`,
    o.order_id
from
    `orders` o
    left join `party` p on o.`party` = p.`id`
    left join (
        select sum(`amount`) `pymt`, `order_id`
        from `payments`
        GROUP BY
            `order_id`
    ) py on o.`id` = py.`order_id`
    inner join `users` u on o.`user_id` = u.`id`
where
    o.id > 4506
order by o.`order_date` desc
limit 100;

DELETE p
FROM
    party p
    LEFT JOIN orders o ON o.party = p.id
    LEFT JOIN payments y on y.party = p.id
    LEFT JOIN purchase u ON u.supid = p.id
WHERE
    p.id = 18
    AND o.party IS NULL
    AND y.party IS NULL
    AND u.supid IS NULL;

SELECT MAX(id) + 101 FROM party;

DROP TRIGGER after_party_insert;

CREATE TRIGGER before_party_insert
BEFORE INSERT ON party
FOR EACH ROW
BEGIN
    IF NEW.party_id IS NULL THEN
        SET NEW.party_id = NEW.id + 100;
    END IF;
END;

CREATE TRIGGER after_party_insert
AFTER INSERT ON party
FOR EACH ROW
BEGIN
    IF NEW.party_id IS NULL THEN
        UPDATE party
        SET party_id = NEW.id + 100
        WHERE id = NEW.id;
    END IF;
END;

SELECT * FROM party ORDER BY id DESC LIMIT 2;

UPDATE party set party_id = 120 where id = 20;

SELECT * FROM users;

SELECT id, name, username, contact
FROM users
WHERE
    user_role = 'user';

SELECT * FROM restrictions;

SELECT * FROM restrictions WHERE userid = 2;

UPDATE restrictions set edit_purchase = FALSE where id = 1;

select
    l.sku,
    s.pcode,
    coalesce(l.hsn, s.hsn) hsn,
    l.product,
    l.qty,
    coalesce(l.size, s.size) size,
    coalesce(l.unit, s.unit) unit,
    l.mrp as price,
    l.disc,
    l.gst,
    l.tax,
    l.net,
    l.gross as total
from sold l
    left join stock s on s.sku = l.sku
where
    l.order_id = 32

DESCRIBE restrictions;

DELIMITER / /

CREATE TRIGGER IF NOT EXISTS after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO restrictions (userid) VALUES (NEW.id);
END //

DELIMITER;

DELIMITER / /

CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO restrictions (userid) VALUES (NEW.id);
END ;

DELIMITER;

DROP TRIGGER IF EXISTS after_user_insert;

SHOW TRIGGERS;

UPDATE users SET password = MD5('269608') WHERE id = 2;

SELECT * FROM users;