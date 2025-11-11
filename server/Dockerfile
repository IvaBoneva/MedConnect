# Use the multi-arch Eclipse Temurin JDK 17
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copy the compiled JAR from Maven target
COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
