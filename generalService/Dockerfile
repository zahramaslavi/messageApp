FROM node:21.4.0-alpine

# Set the working directory inside the container
# WORKDIR /app

WORKDIR /usr/app

COPY ./package.json ./yarn.lock ./
RUN yarn install

# Copy package.json and yarn.lock (or package-lock.json if you use npm) to the working directory
COPY ./ ./

RUN yarn global add nodemon


EXPOSE 3002

CMD ["yarn", "start"]