FROM ubuntu:18.04
MAINTAINER Aidan Noll (aidan.noll@carvesystems.com)


RUN apt-get update && apt-get install -y nodejs npm python3 sqlite3

RUN useradd -m app
USER app

COPY --chown=app . /home/app/app

RUN cd /home/app/app && npm install sqlite3 && npm install && npm run tsc && npm run sequelize db:migrate && npm run sequelize db:seed:all

EXPOSE 3000/tcp

CMD cd /home/app/app && ./run.sh
