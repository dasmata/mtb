# mtb
Website for all4mtb
## Prerequisites
* An sequelize suported database: PostgreSQL, MySQL, SQLite, MSSQL
* node.js version >= 6.9.1
* npm package manager

## Installation
1. Clone the repository:

   ```
   git clone https://github.com/dasmata/mtb.git ./mtb
   ```
1. Install npm packages:

   ```
   cd mtb
   npm install
  ```
1. Create the ./app/config/config.local.js file. You can use the ./app/config/config.local.js.sample as an example
1. Install gulp:

   ```
   npm install --global gulp-cli
   npm install --save gulp
   ```
1. Build client files

   ```
   gulp production
   ```
1. Start site

   ```
   NODE_ENV=production node ./bin/www
   ```
