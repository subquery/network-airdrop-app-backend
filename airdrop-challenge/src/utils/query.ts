import axios from "axios";

export type SubqueryListOptions = {
  method: "GET" | "POST";
  url: string;
  timeout: number;
  variables: {
    [key: string]: any;
  };
  query: string;
  type: string;
  list: any[];
};

export async function querySubqueryList(
  options: SubqueryListOptions
): Promise<any[]> {
  const result = await axios.request({
    method: options.method,
    url: options.url,
    timeout: options.timeout,
    data: {
      variables: {
        ...options.variables,
        offset: options.list.length,
      },
      query: options.query,
    },
  });
  options.list.push(...result.data.data[options.type].nodes);
  if (options.list.length >= result.data.data[options.type].totalCount) {
    return options.list;
  }
  return await querySubqueryList(options);
}
