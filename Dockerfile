# Use a lightweight Java runtime
FROM openjdk:17-jdk-alpine

# Copy the Jar file created by the "Package" stage
COPY target/*.jar app.jar

# Expose the port (Change 8089 if your app uses a different port)
EXPOSE 8089

# Run the app
ENTRYPOINT ["java", "-jar", "/app.jar"]
