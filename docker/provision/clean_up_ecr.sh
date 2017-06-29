#!/bin/bash

TAG=$(git rev-parse --short HEAD)

SERVICES=("data" "api" "workflows" "projections" "frontend")
for IMG in ${SERVICES[@]}

    IMAGES = $(aws ecr list-images --repository-name wk/$IMG)

    for TAGGED_IMG in ${IMAGES[@]}
        do
            IMG_CHECK=$TAGGED_IMG grep -w "$TAG"
            if [ -z "${IMAGE_CHECK}" ]; then



