SELECT *
FROM (
        SELECT p.id, p.`party_name` AS `party`, p.`opening_bal` AS ob, o.`total`, y.`pymt`, (
                o.`total` + p.`opening_bal` - y.`pymt`
            ) AS `balance`
        FROM `party` p
            LEFT JOIN (
                SELECT `party`, SUM(`alltotal`) AS `total`
                FROM `orders`
                GROUP BY
                    `party`
            ) o ON o.`party` = p.id
            LEFT JOIN (
                SELECT `party`, SUM(`amount`) AS `pymt`
                FROM `pymtfyear`
                WHERE
                    `pymt_for` = 'Sales'
                GROUP BY
                    `party`
            ) y ON y.`party` = p.id
        WHERE
            p.`party_type` <> 'supplier'
    ) x
WHERE
    x.`balance` <> '0.00';