# API Documentation

This document allows you to define your API schema.

Each API should include

1. HTTP Method
2. Endpoint
3. Request body/Parameters
4. Response body
5. Error Body
6. Sample Request
7. Sample Response
8. Sample Error

> Errors and it's corresponding code can be defined by yourself. You need not follow HTTP errors.

## Get Data

| attribute   | value       |
| ----------- | ----------- |
| HTTP Method | GET         |
| Endpoint    | /basic/data |

### Parameters

| parameter     | datatype        | example   |
| ------------- | --------------- | --------- |
| companyId     | 10 digit number | 123456789 |
| audienceCount |     INTEGER     |   10000   |
| page          |     INTEGER     |     1     |
| pageSize      |     INTEGER     |     5     |


### Response Body

```json
{ 
    "result": [
        {
            "id": number,
            "optionid": IDENTIFIER,
            "companyid": IDENTIFIER,
            "audiencecount": number,
            "cost": number
        }
    ]
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
GET /basic/data?companyId=1111111111&page=1&pageSize=1
```

### Sample Response

```json
{
    "result": [
        {
            "id": 3,
            "optionid": "1111111112",
            "companyid": "1111111111",
            "audiencecount": 1000,
            "cost": 100
        }
    ]
}
```

### Sample Error

```json
{
    "error": "invalid input syntax for integer: \"NaN\"",
    "code": 500
}
```


## Post Data

| attribute   | value       |
| ----------- | ----------- |
| HTTP Method | POST         |
| Endpoint    | /basic/insert |

### Parameters

| parameter     | datatype        | example   |
| ------------- | --------------- | --------- |
| optionId      | 10 digit number | 123456789 |
| companyId     | 10 digit number | 123456789 |
| audienceCount |     INTEGER     |   1500    |
| cost          |     INTEGER     |    200    |

### Request Body

```json
{
    "data": [
        {
            "optionId": number,
            "companyId": number ,
            "audienceCount": number,
            "cost": number
        }
    ]
}
```

### Response Body

```json
{
    "result": "success"
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
POST /basic/insert
```

### Request Body

```json
{
    "data": [
        {
            "optionId": 2222222222,
            "companyId": 2222222222 ,
            "audienceCount": 1500,
            "cost": 150
        }
    ]
}
```

### Sample Error

```json
{
    "error": "duplicate key value violates unique constraint \"adoptions_optionid_key\"",
    "code": 500
}
```
