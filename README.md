## Polarsec task

### Part 1 - Hands on



To run and serve locally on port port 9001
```
npm i
npm run serve
```
For Docker to build image
```
docker build -t polar_sec_task
```


### Part 2 - Theoretical 

_Lets Run!_ has become super popular which while obviously goods news, has surfaced a new problem.

Apparently, people really like running at 6AM, which causes spikes in the requests sent to the `/update` endpoint, overloading the network and causing slowdowns and unresponsiveness in the application. 

How would you solve this issue? Please provide 2 suggestions.

```
- Use an "in-memory/cache" database that will result in faster reads and writes of the data in certain peak hours, eventually, if some data isn't touched anymore, it will be moved back into the other database.
```

```
- Deploy the update "part" of the service into a different virtualization container, which will be assigned certain resources from the machine regarding the load each service-endpoint has.
```