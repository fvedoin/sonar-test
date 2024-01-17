interface TtnGateway {
  ids: { gateway_id: string; eui: string }[];
  created_at: string;
  updated_at: string;
  name: string;
  gateway_server_address: string;
  frequency_plan_id: string;
  frequency_plan_ids: string[];
}
