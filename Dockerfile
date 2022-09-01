FROM node:16.17.0-alpine3.16
COPY ./ /home/node/app

WORKDIR /home/node/app
RUN cd /home/node/app
CMD ["npm","start"]

EXPOSE 5432