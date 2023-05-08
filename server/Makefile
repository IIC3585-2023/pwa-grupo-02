#!make
include .envs/.local/.postgres
export $(shell sed 's/=.*//' .envs/.local/.postgres)

up:
	docker compose -f local.yml up -d
build:
	docker compose -f local.yml up -d --build
down:
	docker compose -f local.yml down
restart:
	docker compose -f local.yml restart
logs:
	docker compose -f local.yml logs --follow app
install:
	docker compose -f local.yml run app yarn install
add:
	docker compose -f local.yml run app yarn add $(dep)
lint:
	docker compose -f local.yml run app yarn lint
lint-fix:
	docker compose -f local.yml run app yarn lint-fix
psql:
	docker compose -f local.yml exec postgres psql -U $(POSTGRES_USER) ${POSTGRES_DB}
create:
	docker compose -f local.yml run app yarn db:create
reset:
	docker compose -f local.yml run app yarn db:reset
migrate:
	docker compose -f local.yml run app yarn db:migrate
migrate-undo:
	docker compose -f local.yml run app yarn db:migrate:undo
seed:
	docker compose -f local.yml run app yarn db:seed
seed-undo:
	docker compose -f local.yml run app yarn db:seed:undo
prod:
	docker compose up -d --build
prod-down:
	docker compose down
prod-logs:
	docker compose logs --follow app