.PHONY: up down logs tidy build gateway-auth smoke

up:
	docker compose -f deploy/docker-compose.yml up --build -d

down:
	docker compose -f deploy/docker-compose.yml down

logs:
	docker compose -f deploy/docker-compose.yml logs -f

tidy:
	cd gateway && go mod tidy
	cd services/auth && go mod tidy
	cd services/content && go mod tidy
	cd services/activity && go mod tidy

build: tidy
	cd gateway && go build ./...
	cd services/auth && go build ./...
	cd services/content && go build ./...
	cd services/activity && go build ./...

smoke:
	@echo "== health =="
	curl -s http://localhost:8080/healthz
	@echo
	@echo "== register =="
	curl -s -X POST http://localhost:8080/auth/register \
		-H "Content-Type: application/json" \
		-d '{"email":"senpai@mnglib.io","username":"AnimeSenpai","password":"secret123"}'
	@echo
	@echo "== login =="
	curl -s -X POST http://localhost:8080/auth/login \
		-H "Content-Type: application/json" \
		-d '{"email":"senpai@mnglib.io","password":"secret123"}'
	@echo
