SHELL:=/bin/bash
.DEFAULT_GOAL := dev

.PHONY: deps
####TEST BUILD####

dockerUpTests: kill-data-test
	docker-compose -f ../docker/docker-compose-tests.yml -p methodfittests up -d

dockerDownTests:
	docker-compose -f ../docker/docker-compose-tests.yml -p methodfittests kill

dockerUpTestsData: kill-data-test # kill-data-test
	docker-compose -f ../docker/docker-compose-tests.yml -p methodfittests up -d postgres
	docker-compose -f ../docker/docker-compose-tests.yml -p methodfittests up -d eventstore

dockerDownTestsData:
	docker-compose -f ../docker/docker-compose-tests.yml -p methodfittests kill postgres
	docker-compose -f ../docker/docker-compose-tests.yml -p methodfittests kill eventstore


kill-eventstore-test:
	- docker rm -v -f methodfittests_eventstore_1 || echo "No more containers to remove."

kill-postgres-test:
	- docker rm -v -f methodfittests_postgres_1  || echo "No more containers to remove."

kill-data-test: kill-eventstore-test kill-postgres-test

####END TEST BUILD####

