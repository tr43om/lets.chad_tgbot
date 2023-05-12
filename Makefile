build:
	docker build -t letschad .

run:
	docker run -d -p 3000:3000 --name letschad --rm letschad