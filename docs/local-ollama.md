# Working locally with open-llama and open-webui

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
