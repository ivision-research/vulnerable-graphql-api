FROM ubuntu:18.04
MAINTAINER Aidan Noll (aidan.noll@carvesystems.com)

COPY . /app

RUN apt-get update && apt-get install -y nodejs npm python3 sqlite3

RUN cd /app && npm install sqlite3 && npm install && npm run tsc && npm run sequelize db:migrate && npm run sequelize db:seed:all

CMD cd /app && ./run.sh
