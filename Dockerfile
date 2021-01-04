FROM centos:8

# Create app directory
WORKDIR /usr/src/backend-web

ADD . ./
COPY package.json /usr/src/backend-web/

RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
RUN dnf install -y nodejs

RUN npm install
COPY . /usr/src/backend-web
EXPOSE 8000
CMD [ "npm","run", "dev"]
