FROM  node:14 as angular
LABEL maintainer="Manish Prakash<manish@excellencetechnologies.in"

WORKDIR /workspace

# VOLUME [ "/workspace/src" ]
COPY src /workspace/src

COPY package.json /workspace/package.json
COPY karma.conf.js /workspace
COPY angular.json /workspace/angular.json
COPY tslint.json /workspace.tslint.json
COPY tsconfig.app.json /workspace
COPY tsconfig.json /workspace/tsconfig.json
COPY tsconfig.spec.json /workspace
COPY tslint.json /workspace
COPY browserslist /workspace/browserslist

RUN npm install -g @angular/cli

RUN npm install

RUN ng build --prod


# base image
FROM nginx:alpine

# copy artifact build from the 'build environment'
COPY --from=angular /workspace/dist/recruitment /usr/share/nginx/html

# expose port 80
EXPOSE 80

ENV TZ=Asia/Kolkata
RUN echo $TZ > /etc/timezone && \
apt-get update && apt-get install -y tzdata && \
rm /etc/localtime && \
ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
dpkg-reconfigure -f noninteractive tzdata && \
apt-get clean

# run nginx
CMD ["nginx", "-g", "daemon off;"]
