import { ZodSchema } from "zod";

export const matchPathAndMethod = (
  req: Request,
  path: string,
  method: Request["method"]
) => {
  const { pathname } = new URL(req.url);
  return pathname === path && req.method === method;
};

export const getReqData = async (req: Request, schema: ZodSchema) => {
  try {
    if (!req.body) throw new Error("Invalid body");
    const data = await Bun.readableStreamToJSON(req.body);
    if (!data) throw new Error("Invalid body");
    const parsedData = schema.safeParse(data);
    if (!parsedData.success)
      throw new Error("Invalid body" + parsedData.error.message);
    return { data: parsedData.data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown";
    return { error: errorMessage };
  }
};
