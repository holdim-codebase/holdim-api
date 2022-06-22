# MAIN IMAGE
FROM node:16.13.1-alpine3.15

# copy all relevant files
COPY . .

# Install make
RUN apk add --update make g++

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# install dependencies
RUN rm -rf node_modules && yarn install --frozen-lockfile
# compile typescript
RUN yarn run build

EXPOSE 8080

USER node

CMD [ "yarn", "start"]
