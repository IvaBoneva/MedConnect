.PHONY: build-and-up

build-and-up:
	@echo "Running Maven clean package..."
	mvn clean package -DskipTests
	@echo "Starting Docker containers..."
	docker-compose up --build