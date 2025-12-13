# Use a standard, lightweight Java 17 image
FROM eclipse-temurin:17-jdk-alpine

# Set a working directory
WORKDIR /app

# Copy the generated JAR file from the 'target' folder and rename it
# The wildcard *.jar makes it work even if you change the version
COPY target/*.jar app.jar

# Expose the port your application runs on (we saw this in the logs)
EXPOSE 8089

# The command to run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]