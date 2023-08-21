migration-generate:
	npm run typeorm -- migration:generate ./src/migrations/${name} -d datasource.ts

migration-up:
	npm run typeorm -- migration:run -d datasource.ts

migration-down:
	npm run typeorm -- migration:revert -d datasource.ts