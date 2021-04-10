FROM node:lts-buster

ENV PORT 3000
# ENV DATABASE_URL postgres://root:t2z00a8y@172.21.58.237:5432/apotek
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY ./package*.json .
#RUN apt-get install libpq-dev g++ make \
RUN npm install

COPY . .
#COPY ./node_modules/slonik-interceptor-field-name-transformation/dist/index.d.ts /usr/src/app/node_modules/slonik-interceptor-field-name-transformation/dist/index.d.ts
#COPY ./node_modules/slonik-interceptor-query-normalisation/dist/index.d.ts /usr/src/app/node_modules/slonik-interceptor-query-normalisation/dist/index.d.ts
RUN npm run build

# Copying source files
# COPY . /usr/src/app

FROM node:lts-buster
ENV PORT 3000
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY --from=0 /usr/src/app .
# Building app
EXPOSE 3000

# Running the app
CMD "npm" "run" "start"
