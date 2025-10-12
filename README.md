# FastAPI
## Version: 0.1.0

### /assets/

#### GET
##### Summary:

Get Assets

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

### /assets/stocks

#### GET
##### Summary:

Get Bonds

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

#### POST
##### Summary:

Add Stock

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

### /assets/stocks/{id}

#### DELETE
##### Summary:

Delete Stock

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

### /investments/user/{user_id}

#### GET
##### Summary:

Get Investments

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| user_id | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

### /investments/{id}

#### GET
##### Summary:

Get Investment

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| OAuth2PasswordBearer | |

#### DELETE
##### Summary:

Remove Investment

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

### /investments/

#### POST
##### Summary:

Add Investment

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| current_user_id | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

### /users/

#### GET
##### Summary:

Get Users

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

#### POST
##### Summary:

Create User

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

### /users/{id}

#### GET
##### Summary:

Get User

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

#### DELETE
##### Summary:

Delete User

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

### /users/{user_id}/update

#### POST
##### Summary:

Update Investments

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| user_id | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

### /users/{user_id}/portfolio_value

#### GET
##### Summary:

Get Portfolio Value

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| user_id | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

### /login

#### POST
##### Summary:

Login

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

### /

#### GET
##### Summary:

Root

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

### Models


#### AssetResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | integer |  | Yes |
| asset_type | string |  | Yes |
| symbol | string |  | Yes |
| stock |  |  | Yes |

#### Body_login_login_post

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| grant_type |  |  | No |
| username | string |  | Yes |
| password | password |  | Yes |
| scope | string |  | No |
| client_id |  |  | No |
| client_secret | undefined (password) |  | No |

#### HTTPValidationError

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| detail | [ [ValidationError](#validationerror) ] |  | No |

#### InvestmentAdd

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| asset_symbol | string |  | Yes |
| asset_type | string |  | Yes |
| quantity | number |  | Yes |
| purchase_price | number |  | Yes |
| purchase_date | dateTime |  | Yes |

#### InvestmentResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | integer |  | Yes |
| user_id | integer |  | Yes |
| asset_id | integer |  | Yes |
| quantity | number |  | Yes |
| purchase_price | number |  | Yes |
| purchase_date | dateTime |  | Yes |
| asset |  |  | Yes |

#### PortfolioValueResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| value | number |  | Yes |

#### StockCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| symbol | string |  | Yes |

#### StockResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | integer |  | Yes |
| symbol | string |  | Yes |
| name | string |  | Yes |
| exchange | string |  | Yes |
| currency | string |  | Yes |
| price | number |  | Yes |
| last_updated | dateTime |  | Yes |

#### UserCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| email | string (email) |  | Yes |
| password | string |  | Yes |

#### UserResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | integer |  | Yes |
| email | string (email) |  | Yes |
| created_date | dateTime |  | Yes |

#### ValidationError

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| loc | [  ] |  | Yes |
| msg | string |  | Yes |
| type | string |  | Yes |