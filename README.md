# Event Driven Example

To start:

```
docker-compse up
```

To test:

```
curl --location --request POST 'localhost:8080/api/member' \
--header 'Content-Type: application/json' \
--data-raw '{
	"username": "username",
	"password": "password"
}'
```

To switch to queue-based:

```
// in lib/event-channel.js

export const stream = new QueuedEventChannel(new Logger());
// export const stream = new EmitterEventChannel(new Logger());
```

Then

```
docker-compse up --build
```
