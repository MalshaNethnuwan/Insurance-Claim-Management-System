

# Stage 1: Build Application Artifact
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /build

# Cache Maven dependencies separately from source changes
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build executable Spring Boot JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal Production JRE Image
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

# Security: Create non-root system user and group
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Install wget for container healthcheck
RUN apk add --no-cache wget

# Copy compiled JAR from builder stage
COPY --from=builder /build/target/*.jar /app/app.jar

# Enforce non-root ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose Spring Boot HTTP port
EXPOSE 8080

# Environment Defaults
ENV PORT=8080 \
    JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

# Docker Healthcheck targeting Spring Actuator
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=5 \
  CMD wget -q --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
