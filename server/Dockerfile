FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /build
COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy

WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8080

ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

ENTRYPOINT ["java", "-jar", "app.jar"]
