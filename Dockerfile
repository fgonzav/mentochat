FROM openjdk:8-jdk

MAINTAINER francisco.gv@globant.com

ARG USER_HOME_DIR="/root"

COPY target/mentochat-1.0-SNAPSHOT.jar /root

EXPOSE 8080

