# Running mongoDB service
service mongodb start
service mongodb status
# Running Node server
mkdir /vstore/foreverLogs
cd /vstore/server
forever start -l /vstore/foreverLogs/log.log -o /vstore/foreverLogs/out.log -e /vstore/foreverLogs/err.log server.js	
echo "[INFO] Running Client server..."
cd /vstore/client
ng serve --host 0.0.0.0 --public 10.137.89.7

