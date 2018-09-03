SHELL:=/bin/bash
.DEFAULT_GOAL := dev

.PHONY: deps
yarnUp: \

	cd api && yarn && \
	cd ../data && yarn && \
	cd ../frontend && yarn && \
	cd ../cypress && yarn && \
	cd ../projections && yarn && \
	cd ../workflows && yarn

reInstallDeps:
	cd api && rm -rf node_modules yarn.lock && yarn && \
	cd ../data && rm -rf node_modules yarn.lock && yarn && \
	cd ../frontend && rm -rf node_modules yarn.lock && yarn && \
	cd ../cypress && rm -rf node_modules yarn.lock && yarn && \
	cd ../projections && rm -rf node_modules yarn.lock && yarn && \
	cd ../workflows && rm -rf node_modules yarn.lock && yarn

killModules:
	cd api && rm -rf node_modules yarn.lock && \
	cd ../data && rm -rf node_modules yarn.lock && \
	cd ../frontend && rm -rf node_modules yarn.lock && \
	cd ../cypress && rm -rf node_modules yarn.lock && \
	cd ../projections && rm -rf node_modules yarn.lock && \
	cd ../workflows && rm -rf node_modules yarn.lock

####LOCAL####

dockerUp: kill-data
	docker-compose -f docker/docker-compose.yml -p methodfit up

dockerDown:
	docker-compose -f docker/docker-compose.yml -p methodfit down --rmi local --remove-orphans

####END LOCAL####

####DEPLOY####

dockerDeployUp:
	docker-compose -f docker/docker-compose-build.yml -p methodfit up

dockerDeployDown:
	docker-compose -f docker/docker-compose-build.yml -p methodfit down --rmi local --remove-orphans

dockerBuild:
	docker-compose -f docker/docker-compose-deploy.yml build

####END DEPLOY####

####LOGGING####

dockerLoggingUp:
	docker-compose -f docker/docker-compose-logging.yml -p methodfit up -d

dockerLoggingDown:
	docker-compose -f docker/docker-compose-logging.yml -p methodfit down --rmi local --remove-orphans

####END LOGGING####

####NO VOLUME####

dockerUpNoVolume: kill-data-no-volume
	docker-compose -f docker/docker-compose-no-volume.yml -p methodfitnovolume up

commitNoVolume: commitNoVolumePostgres commitNoVolumeEventstore
commitNoVolumePostgres:
	docker commit methodfitnovolume_postgres_1 709865789463.dkr.ecr.us-east-2.amazonaws.com/postgres_novolume

commitNoVolumeEventstore:
	docker commit methodfitnovolume_eventstore_1 709865789463.dkr.ecr.us-east-2.amazonaws.com/eventstore_novolume


pushNoVolume: pushNoVolumePostgres pushNoVolumeEventstore
pushNoVolumePostgres:
	docker push 709865789463.dkr.ecr.us-east-2.amazonaws.com/postgres_novolume
pushNoVolumeEventstore:
	docker push 709865789463.dkr.ecr.us-east-2.amazonaws.com/eventstore_novolume

dockerDownNoVolume:
	docker-compose -f docker/docker-compose-no-volume.yml -p methodfitnovolume down

kill-data-no-volume: kill-eventstore-no-volume kill-postgres-no-volume
kill-eventstore-no-volume:
	- docker rm -f methodfitnovolume_eventstore_1 || echo "No more containers to remove."

kill-postgres-no-volume:
	- docker rm -v -f methodfitnovolume_postgres_1  || echo "No more containers to remove."

####END NO VOLUME####

####TEST BUILD####

dockerUpTests: kill-data-test
	docker-compose -f docker/docker-compose-tests.yml -p methodfittests up

dockerDownTests:
	docker-compose -f docker/docker-compose-tests.yml -p methodfittests down

kill-eventstore-test:
	- docker rm -f methodfittests_eventstore_1 || echo "No more containers to remove."

kill-postgres-test:
	- docker rm -v -f methodfittests_postgres_1  || echo "No more containers to remove."

kill-data-test: kill-eventstore-test kill-postgres-test

####END TEST BUILD####

####DOCKER CYPRESS BUILD#####
dockerUpCypress: kill-data-cypress-test
	docker-compose -f docker/docker-compose-cypress-tests.yml -p methodfitcypresstests up

dockerDownCypress:
	docker-compose -f docker/docker-compose-cypress-tests.yml -p methodfitcypresstests down

kill-eventstore-cypress-test:
	- docker rm -f methodfitcypresstests_eventstore_1 || echo "No more containers to remove."

kill-postgres-cypress-test:
	- docker rm -v -f methodfitcypresstests_postgres_1  || echo "No more containers to remove."

kill-data-cypress-test: kill-eventstore-cypress-test kill-postgres-cypress-test

####END DOCKER CYPRESS BUILD#####


dockerListServices:
	@docker-compose -f docker/docker-compose-build.yml -p methodfit config --services

rebuildAll: dockerDown removeBaseImagesNotNode dockerUp
	docker-compose -f docker/docker-compose-deploy.yml build

killAndRestartData:
	docker-compose -f docker/docker-compose-deploy.yml -p methodfit eventstore stop
	docker-compose -f docker/docker-compose-deploy.yml -p methodfit postgress stop


prettyLint:
	 echo "============= lint api =============" && \
	 cd api && yarn lint && \
    echo "============= lint frontend =============" && \
    cd ../frontend && yarn lint && \
    echo "============= lint workflows =============" && \
    cd ../workflows && yarn lint && \
    echo "============= lint projections =============" && \
    cd ../projections && yarn lint

.PHONY: lint
lint:
	parallel "cd {} && yarn lint" ::: api data frontend serve

exec:
	docker exec -it $(con) bash

kill-all-but-node:
	- docker rm -vf $$(docker ps -a -q) 2>/dev/null || echo "No more containers to remove."
#	- docker rmi $$(docker images | grep -v -e ^mf_node | awk '{print $3}' | sed -n '1!p') 2>/dev/null || echo "No more containers to remove."
	- docker rmi $$(docker images -aq) 2>/dev/null || echo "No more containers to remove."
	- docker volume rm $$(docker volume ls) 2>/dev/null || echo "No more volumes to remove."

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

build:
	- cd docker/provision && bash build.sh

ecr-login:
	$(shell aws ecr get-login --no-include-email --region us-east-2)

####################

removeBuildAndPushNode:
	docker images -q -f "label=name=base_mf_node" | while read -r image; do docker rmi -f $$image; done;
	 cd docker/base_mf_node && docker build --no-cache -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_node:latest .
	-t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_node:$$(git show -s --format=%h) .
	 docker push 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_node

removeBuildAndPushFirstParty:
	docker images -q -f "label=name=base_mf_firstparty" | while read -r image; do docker rmi -f $$image; done;
	cd docker/base_mf_firstparty && docker build --no-cache -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_firstparty:latest -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_firstparty:$$(git show -s --format=%h) .
	docker push 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_firstparty

removeBuildAndPushThirdParty:
	docker images -q -f "label=name=base_mf_thirdparty" | while read -r image; do docker rmi -f $$image; done;
	cd docker/base_mf_thirdparty && docker build --no-cache -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_thirdparty:latest -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_thirdparty:$$(git show -s --format=%h) .
	docker push 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_thirdparty

removeBuildAndPushFrontEnd:
	docker images -q -f "label=name=base_mf_frontend" | while read -r image; do docker rmi -f $$image; done;
	 cd docker/base_mf_frontend && docker build --no-cache -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_frontend:latest .
	 cd docker/base_mf_frontend && docker build --no-cache -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_frontend:$$(git show -s --format=%h) .
	 docker push 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_frontend

removeBuildAndPushCypress:
	docker images -q -f "label=name=base_mf_cypress" | while read -r image; do docker rmi -f $$image; done;
	 cd docker/base_mf_cypress && docker build --no-cache -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_cypress:latest -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_cypress:$$(git show -s --format=%h) .
	 docker push 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_cypress

removeBuildAndPushAll: dockerDown
	$(shell aws ecr get-login --no-include-email --region us-east-2)
	docker rm -vf $(docker ps -a -q) 2>/dev/null || echo "No more containers to remove."
	docker images -q -f "label=methodfitness=child" | while read -r image; do docker rmi -f $$image; done;
	docker images -q -f "label=methodfitness=base4" | while read -r image; do docker rmi -f $$image; done;
	docker images -q -f "label=methodfitness=base3" | while read -r image; do docker rmi -f $$image; done;
	docker images -q -f "label=methodfitness=base2" | while read -r image; do docker rmi -f $$image; done;

	 cd docker/base_mf_node && docker build --no-cache -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_node:latest .
	 -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_node:$$(git show -s --format=%h) .
	 docker push 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_node
################
	 cd docker/base_mf_thirdparty && docker build --no-cache -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_thirdparty:latest -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_thirdparty:$$(git show -s --format=%h) .
	 docker push 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_thirdparty
###############
	 cd docker/base_mf_firstparty && docker build --no-cache -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_firstparty:latest -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_firstparty:$$(git show -s --format=%h) .
	 docker push 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_firstparty
###############
	 cd docker/base_mf_frontend && docker build --no-cache -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_frontend:latest -t 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_frontend:$$(git show -s --format=%h) .
	 docker push 709865789463.dkr.ecr.us-east-2.amazonaws.com/base_mf_frontend

removeBaseImagesNotNode:
	docker images -q -f "label=methodfitness=base4" | while read -r image; do docker rmi -f $image; done;
	docker images -q -f "label=methodfitness=base3" | while read -r image; do docker rmi -f $image; done;
	docker images -q -f "label=methodfitness=base2" | while read -r image; do docker rmi -f $image; done;

####TESTS####

#integrationTests:  kill-data-tests
#	docker-compose -f docker/docker-compose.yml -p methodfittests up -d
#	-npx cypress run
#	#docker-compose -f docker/docker-compose.yml -p methodfittests down --rmi local --remove-orphans
#
#intTestsDown:
#	docker-compose -f docker/docker-compose.yml -p methodfittests down --rmi local --remove-orphans

#kill-eventstore-tests:
#	- docker rm -v -f methodfittests_eventstore_1 || echo "No more containers to remove."

#kill-postgres-tests:
#	- docker rm -v -f methodfittests_postgres_1  || echo "No more containers to remove."

#kill-data-tests: kill-eventstore-tests kill-postgres-tests

