.DEFAULT_GOAL := dev

.PHONY: deps
yarnUp: \
	api/yarn.lock \
	data/yarn.lock \
	frontend/yarn.lock \
	projections/yarn.lock \
	workflows/yarn.lock
	cd api && yarn && \
	cd ../data && yarn && \
	cd ../frontend && yarn && \
	cd ../services && yarn && \
	cd ../projections && yarn && \
	cd ../workflows && yarn

reInstallDeps:
	cd api && rm -rf node_modules yarn.lock && yarn && \
	cd ../data && rm -rf node_modules yarn.lock && yarn && \
	cd ../frontend && rm -rf node_modules yarn.lock && yarn && \
	cd ../services && rm -rf node_modules yarn.lock && yarn && \
	cd ../projections && rm -rf node_modules yarn.lock && yarn && \
	cd ../workflows && rm -rf node_modules yarn.lock && yarn

dockerDown:
	docker-compose -f docker/docker-compose.yml -p methodfit down --rmi local --remove-orphans

dockerLoggingDown:
	docker-compose -f docker/docker-compose-logging.yml -p methodfit down --rmi local --remove-orphans

dockerDataDown:
	docker-compose -f docker/docker-compose-data.yml -p methodfit down

dockerUp:
	docker-compose -f docker/docker-compose.yml -p methodfit up

dockerDataUp:
	docker-compose -f docker/docker-compose-data.yml -p methodfit up

dockerLoggingUp:
	docker-compose -f docker/docker-compose-logging.yml -p methodfit up -d

dockerListServices:
	@docker-compose -f docker/docker-compose-build.yml -p methodfit config --services

dockerBuild:
	docker-compose -f docker/docker-compose-deploy.yml build

prettyLint:
	 echo "lint api" && \
	 cd api && yarn lint && \
    echo "lint frontend" && \
    cd ../frontend && yarn lint && \
    echo "lint service" && \
    cd ../services && yarn lint && \
    echo "lint workflows" && \
    cd ../workflows && yarn lint && \
    echo "lint projections" && \
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

kill-eventstore:
	- docker rm -v -f methodfit_eventstore_1 || echo "No more containers to remove."

kill-postgres:
	- docker rm -v -f methodfit_postgres_1  || echo "No more containers to remove."

kill-data: kill-eventstore kill-postgres

seedES:
	- cd data && make seedES

migration:
	- cd data && make migration

rebuildData:
	- cd data && make rebuildData

