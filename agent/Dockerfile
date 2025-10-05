FROM python:3.11-slim

WORKDIR /app

# Install deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY agent.py .
COPY config.yaml .

ENV AGENT_CONFIG=/app/config.yaml

CMD ["python", "agent.py"]
