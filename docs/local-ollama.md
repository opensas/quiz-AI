# Working locally with open-llama and open-webui

## ollama

install ollama

```shell
curl -fsSL https://ollama.com/install.sh | sh
```

```shell
ollama pull llama3.1
```

or test it with docker

```sh
# use -d for detached mode
# docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
docker run -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

docker exec -it ollama ollama run llama3.2:1b

docker exec -i ollama ollama pull qwen2:0.5b
```

test

```sh
curl http://localhost:11434/api/generate -d '{
	"model": "llama3.2:1b",
	"prompt": "contame un chiste corto",
	"stream": false
}' | jq -r '.response'
```

```shell
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.1",
  "prompt":"Why is the sky blue?"
}'
``

```

start service

```shell
$ sudo systemctl start ollama

$ systemctl status ollama
● ollama.service - Ollama Service
     Loaded: loaded (/etc/systemd/system/ollama.service; enabled; vendor preset: enabled)
     Active: activating (auto-restart) (Result: exit-code) since Fri 2024-09-06 11:12:55 -03; 1s ago
    Process: 990792 ExecStart=/usr/local/bin/ollama serve (code=exited, status=1/FAILURE)
   Main PID: 990792 (code=exited, status=1/FAILURE)
        CPU: 25ms
```

## open-webui

1. instalar e iniciar ollama
   bajar el modelo llama3.1

2. iniciar open-webui

see: https://docs.openwebui.com/troubleshooting/#open-webui-server-connection-error para conectarse a ollama local

```shell
docker run -d -p 3000:8080 --network=host -e OLLAMA_BASE_URL=http://127.0.0.1:11434 \
 -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

ir a localhost:8080

crear una clave

---

# resources

- video on youtube: https://www.youtube.com/watch?v=BzFafshQkWw
