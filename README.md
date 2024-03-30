

# Custom API

This is a custom API built with Express.js and PostgreSQL. It provides endpoints for user authentication, profile management, and more.

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Aryanfour5/Custom-API-.git
Install dependencies:

```bash
cd Custom-API-
npm install
Set up environment variables:
```
Create a .env file in the root directory.

2.**Add the following variables to the .env file:**


```bash
POSTGRES_PASSWORD=your_postgres_password
```
Start the server:

```bash
Copy code
npm start
```
Endpoints
1. ***Invitation API***
```
Path: /api/invitation
```
Method: ***POST***

Description: Create a new user invitation.

Request Body:
```
json

{
  "name": "User Name",
  "email": "user@example.com",
  "phone": "1234567890",
  "alternate_email": "user_alt@example.com",
  "organization_name": "Company Name",
  "role_in_organization": "Role",
  "valid_till": "2024-12-31"
}
```
Response: Returns the inserted user object.

2. ***Sign-up API:-***
```
Path: /api/signup
```
Method: ***POST***

Description: Sign up a user.

Request Body:
```
json
{
  "id": "user_id",
  "password": "user_password"
}
```
Response: Returns a message confirming successful sign-up.

3. ***Login API***
```
Path: /api/login
```
Method: ***POST***

Description: Log in a user.

Request Body:
```
json

{
  "email": "user@example.com",
  "password": "user_password"
}
```
Response: Returns the user object if login is successful.

4. ***Logout API***
```
Path: /api/logout
```
Method: ***POST***

Description: Log out the current user.

Response: Returns a message confirming successful logout.

5. ***Edit User API***
```
Path: /api/edituser/:id
```
Method: ***POST***

Description: Edit user details.
```
Request Body:
{
  "name": "New Name",
  "email": "newemail@example.com",
  "phone": "9876543210",
  "alternate_email": "new_alt@example.com",
  "organization_name": "New Company Name",
  "role_in_organization": "New Role",
  "valid_till": "2025-12-31",
  "profile_picture": "new_profile_picture_url",
  "password": "new_password"
}
```
