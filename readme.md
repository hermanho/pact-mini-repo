# PACT bug mini reproduction repo

## Install
```
$ pnpm install
```

## Start PACT broker
```
$ docker-compose up
```

## Run and publish PACT consumer
```
$ pnpm --filter pact-consumer run test
$ pnpm --filter pact-consumer run publish:pact-consumer
```

## Run PACT provider
```
$ pnpm --filter nestjs-api run test:pact-provider
```

## Testing by curl
```
$ pnpm --filter nestjs-api run start
```
```
$ curl --location --request PUT 'http://127.0.0.1:3000/hello' \
--header 'Contact-Type: application/json' \
--data '{}'
```
Result
```
{"message":["message should not be empty","message must be a string"],"error":"Bad Request","statusCode":400}
```