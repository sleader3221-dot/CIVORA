import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { FraudEvent, Severity } from "@/lib/types";
import { getEnvironment } from "@/lib/config/env";

export function getDynamoDocumentClient() {
  const env = getEnvironment();
  if (!env.dynamoConfigured) return null;
  return DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION }));
}

export class DynamoDBEventAdapter {
  private readonly tableName = process.env.DYNAMODB_EVENTS_TABLE ?? "ProofPilotEvents";
  private readonly client = getDynamoDocumentClient();

  isConfigured() {
    return Boolean(this.client);
  }

  async putEvent(event: FraudEvent) {
    if (!this.client) throw new Error("DynamoDB adapter is not configured");
    await this.client.send(new PutCommand({
      TableName: this.tableName,
      Item: {
        PK: `ORG#${event.organizationId}`,
        SK: `EVENT#${event.createdAt}#${event.id}`,
        GSI1PK: `ENTITY#${event.entityId}`,
        GSI1SK: `EVENT#${event.createdAt}`,
        GSI2PK: `RISK#${event.severity}`,
        GSI2SK: `${event.createdAt}#${event.id}`,
        ...event
      }
    }));
  }

  async latestEvents(organizationId: string, limit = 50) {
    if (!this.client) throw new Error("DynamoDB adapter is not configured");
    const result = await this.client.send(new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": `ORG#${organizationId}` },
      ScanIndexForward: false,
      Limit: limit
    }));
    return (result.Items ?? []) as FraudEvent[];
  }

  async eventsBySeverity(severity: Severity, limit = 50) {
    if (!this.client) throw new Error("DynamoDB adapter is not configured");
    const result = await this.client.send(new QueryCommand({
      TableName: this.tableName,
      IndexName: "GSI2",
      KeyConditionExpression: "GSI2PK = :risk",
      ExpressionAttributeValues: { ":risk": `RISK#${severity}` },
      ScanIndexForward: false,
      Limit: limit
    }));
    return (result.Items ?? []) as FraudEvent[];
  }
}
