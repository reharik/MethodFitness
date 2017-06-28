
echo "Uploading artifacts"
scp docker-compose-deploy.yml $USERNAME@$TARGET:~/docker-compose.yml
scp .env $USERNAME@$TARGET:~/.env
scp deploy.sh $USERNAME@$TARGET:~/deploy.sh
ssh $USERNAME@$TARGET chmod a+x docker-compose.yml
ssh $USERNAME@$TARGET chmod a+x deploy.sh


