# SQL Statements

For this worksheet you will need to provide an example of your own SQL statement. The two given are examples.

## INSERT

Example:
```sql
INSERT INTO adOptions (optionId, companyId, audienceCount, cost) VALUES ${template};

--The variable template will be in the format of ($1, $2, $3, $4) in this case as there are 4 columns to insert.
```

## SELECT with Filtering and Pagination
Example:
```sql
SELECT * FROM adOptions ${whereClause} ${limitOffsetClause}

-- The variable whereClause will depend on the users input whether they want to filter data using both companyId and audienceCount or just one of them. 

E.g:

WHERE companyId = $1, 

WHERE audienceCount = $1,

WHERE companyId = $1 AND audienceCount = $2

-- The variable limitOffsetClause will be in the format of ($i++, $i++) because there are two parameters in it which are LIMIT and OFFSET.

E.g.:

-- If only one parameter is used for filtering:

LIMIT $2 OFFSET $3 

-- If two parameters are used for filtering:

LIMIT $3 OFFSET $4
```