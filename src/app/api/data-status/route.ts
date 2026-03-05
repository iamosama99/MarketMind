import { getDataSourceStatus } from "@/lib/market-data-service";

export async function GET() {
    return Response.json(getDataSourceStatus());
}
