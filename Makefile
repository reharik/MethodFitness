.DEFAULT_GOAL := dev

.PHONY: deps
deps: \
	api/yarn.lock \
	data/yarn.lock \
	frontend/yarn.lock \
	projections/yarn.lock \
	workflows/yarn.lock
	cd api && yarn && \
	cd ../data && yarn && \
	cd ../frontend && yarn && \
	cd ../projections && yarn && \
	cd ../workflows && yarn

dockerDown:
	docker-compose -f docker/docker-compose.yml -p methodfit down --rmi local --remove-orphans

dockerLoggingDown:
	docker-compose -f docker/docker-compose-logging.yml -p methodfit down --rmi local --remove-orphans

dockerUp: ecr-login
	docker-compose -f docker/docker-compose.yml -p methodfit up

dockerLoggingUp: ecr-login
	docker-compose -f docker/docker-compose-logging.yml -p methodfit up -d

dockerListServices:
	@docker-compose -f docker/docker-compose-build.yml -p methodfit config --services

dockerBuild:
	docker-compose -f docker/docker-compose-deploy.yml build

prettyLint:
	cd api && yarn lint && \
    cd ../data && yarn lint && \
    cd ../frontend && yarn lint && \
    cd ../workflows && yarn lint && \
    cd ../projections && yarn lint

.PHONY: lint
lint:
	parallel "cd {} && yarn lint" ::: api data frontend serve

exec:
	docker exec -it $(con) bash

kill-all-but-node:
	- docker rm -vf $$(docker ps -a -q) 2>/dev/null || echo "No more containers to remove."
	- docker rmi $$(docker images | grep -v -e ^mf_node | awk '{print $3}' | sed -n '1!p') 2>/dev/null || echo "No more containers to remove."
	- docker rmi -f $$(docker images | grep "<none>" | awk "{print \$$3}")
	- docker volume rm docker_eventstore

kill-eventstore:  kill-orphans
	- docker rm -vf eventstore 2>/dev/null || echo "No more containers to remove."
	- docker rmi eventstore/eventstore
	- docker volume rm docker_eventstore

kill-postgres:  kill-orphans
	- docker rm -vf postgres 2>/dev/null || echo "No more containers to remove."
	- docker rmi postgres
	- docker volume rm docker_postgres_data
