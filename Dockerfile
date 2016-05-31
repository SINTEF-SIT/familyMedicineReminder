FROM node:4-onbuild

RUN mkdir -p /usr/src/sails
COPY . /usr/src/sails
RUN npm -g install sails@0.12.1
RUN cd /usr/src/sails; npm install

EXPOSE 1337

CMD cd /usr/src/sails; sails lift