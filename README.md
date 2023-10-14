# social-media-clone

![Static Badge](https://img.shields.io/badge/Language-TypeScript-blue)
![Static Badge](https://img.shields.io/badge/18.13.0-Node.Js-green)
![Static Badge](https://img.shields.io/badge/4.18.2-Express.Js-blue)
![Static Badge](https://img.shields.io/badge/DB-MySQL-blue)
![Static Badge](https://img.shields.io/badge/5.3.1-prisma-blue)
![Static Badge](https://img.shields.io/badge/1.41.0-cloudinary-blue)
![Static Badge](https://img.shields.io/badge/29.7.0-jest-red)
![Static Badge](https://img.shields.io/badge/3.0.1-nodemon-red)
![Static Badge](https://img.shields.io/badge/2.8.5-cors-red)
![Static Badge](https://img.shields.io/badge/1.7.4-compression-red)
![Static Badge](https://img.shields.io/badge/16.3.1-dotenv-red)
![Static Badge](https://img.shields.io/badge/7.0.1-express--validator-red)
![Static Badge](https://img.shields.io/badge/1.2.0-express--async--handler-red)
![Static Badge](https://img.shields.io/badge/5.1.0-bcrypt-red)
![Static Badge](https://img.shields.io/badge/9.0.1-jsonwebtoken-red)
![Static Badge](https://img.shields.io/badge/6.9.4-nodemailer-red)
![Static Badge](https://img.shields.io/badge/1.10.0-morgan-red)
![Static Badge](https://img.shields.io/badge/1.4.5--lts.1-multer-red)

## Description
Social media RESTful API clone.

## Key feature

  - Authentication
  - Authorization
  - User management
  - Post management
  - Comment management
  - Like management
  - Story management
  - Followers management
  - Unit testing
  - Pagination

## Installation
First, clone a fresh copy:

```Bash
git clone https://github.com/the-fayed/e-commerce.git
```

Then, you need to run `npm install` to install app dependencies.

Finally, you need to set up the environment variables:
```env
#APP_SETTINGS
MODE   : Development, Poduction or Test
PORT   : app listening port
BASEURL: app basurl

# DB
DATABASE_URL : mysql connection string

# JWT
JWT_SECRET        : should be at lest 32 character
EXPIRATION_PERIOD : priod in min or h

# NODEMAILER
HOST         : e.g. smtp.google.com
SERVICE_PORT : 2525
EMAIL_USER   : sender email address
EMAIL_PASS   : sender email password

#CLOUDINARY
CLOUD_NAME : from cluodinary docs
API_KEY    : from cluodinary docs
API_SECRET : from cluodinary docs
```

_note that you can use any sql connection string but you must change the db provider in prisma file._

## Project stucture

![GitHub Logo](/readme_images/app_structure.png)
![GitHub Logo](/readme_images/app_structure_2.png)
![GitHub Logo](/readme_images/app_structure_3.png)
![GitHub Logo](/readme_images/app_structure_4.png)

### Tests results
![GitHub Logo](/readme_images/auth_tests.png)
![GitHub Logo](/readme_images/user_tests.png)
![GitHub Logo](/readme_images/relationship_tests.png)
![GitHub Logo](/readme_images/post_tests.png)
![GitHub Logo](/readme_images/comment_tests.png)
![GitHub Logo](/readme_images/like_tests.png)
![GitHub Logo](/readme_images/story_tests.png)

