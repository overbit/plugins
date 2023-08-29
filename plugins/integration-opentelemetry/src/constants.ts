export const placeholders = {
  serviceName: "${{ SERVICE_NAME }}",
  otelAgentGrpcEndpoint: "${{ OTEL_AGENT_GRPC_ENDPOINT }}",
  otelAgentHttpEndpoint: "${{ OTEL_AGENT_HTTP_ENDPOINT }}",
  jaegerAgentPort: "${{ JAEGER_AGENT_PORT }}",
};


export const packageJsonValues = {
  dependencies: {
    "@amplication/opentelemetry-nestjs": "^4.3.7",
  },
};

const JAEGER_NAME = "jaeger";
const OTEL_NAME = "opentelemetry";

export const dockerComposeValues = [{
  services: {
    server: {
      environment: {
        JAEGER_AGENT_HOST: "${JAEGER_AGENT_HOST}",
        JAEGER_AGENT_PORT: "${JAEGER_AGENT_PORT}",
        OTEL_COLLECTOR_HOST: "${OTEL_COLLECTOR_HOST}",
        OTEL_COLLECTOR_PORT_GRPC: "${OTEL_COLLECTOR_PORT_GRPC}",
        OTEL_COLLECTOR_PORT_HTTP: "${OTEL_COLLECTOR_PORT_HTTP}",
        OTEL_EXPORTER_OTLP_ENDPOINT: "${OTEL_EXPORTER_OTLP_ENDPOINT}",
      },
    },
    [JAEGER_NAME]: {
      image: "jaegertracing/all-in-one:latest",
      ports: [
        "${JAEGER_AGENT_PORT}:${JAEGER_AGENT_PORT}",               // Jaeger agent UI
        "14268:14268",
        "14250:14250",
      ]
    },
    [OTEL_NAME]: {
      image: "otel/opentelemetry-collector:latest",
      ports: [
        "${OTEL_COLLECTOR_PORT_GRPC}:${OTEL_COLLECTOR_PORT_GRPC}", // gRPC
        "${OTEL_COLLECTOR_PORT_HTTP}:${OTEL_COLLECTOR_PORT_HTTP}", // HTTP
        "1888:1888",                                               // pprof extension
        "13133:13133",                                             // health check extension
        "55670:55679",                                             // zpages debugging extension
      ],
      volumes: [
        "./otel-config.yaml:/etc/otel-config.yaml",
      ],
      command: [
        "--config=/etc/otel-config.yaml",
      ],
      depends_on: [
        JAEGER_NAME,
      ],
    },
  }
}];

