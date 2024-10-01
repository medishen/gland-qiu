APP_NAME := qiu
DOCKER_IMAGE := qiu_
DOCKER_TAG := latest
build:
    docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .
run:
    docker run --name $(APP_NAME) -p 3000:3000 $(DOCKER_IMAGE):$(DOCKER_TAG)
stop:
    docker stop $(APP_NAME)
    docker rm $(APP_NAME)
rebuild: stop build run
logs:
    docker logs -f $(APP_NAME)
test:
    docker exec $(APP_NAME) npm test

.PHONY: build run stop rebuild logs test