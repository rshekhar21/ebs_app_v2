select
    e.`id`,
    date_format(e.`date`, '%d/%m/%Y') as `date`,
    e.`amount`,
    e.`description`,
    e.`pymt_mode` as `via`,
    e.`bank_mode` as `mode`,
    py.`method`,
    b.`bank_name` as `bank`,
    e.`exp_type` as `type`,
    SUM(e.`amount`) OVER ( PARTITION BY MONTH(e.date) ORDER BY `date`, `id` ) AS `total` 
from `expense` e
    left join `bank` b on b.`id` = e.`bank_id`
    left join `users` u on u.`id` = e.`user_id`
    left join `pymt_methods` py on e.`pymt_method` = py.`id`
where
    year(e.`date`) = YEAR(CURDATE())
order by e.`date` desc, e.`id` asc;