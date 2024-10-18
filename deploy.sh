git reset --hard origin/release
npm ci
npm run build

pm2 stop 0
pm2 delete 0
pm2 start npm --name "0" -- start
echo "Successfully deployed"