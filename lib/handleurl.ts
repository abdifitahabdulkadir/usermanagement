interface CreateQueryStringProps {
  key: string;
  value: string;
  currentSearchParams: URLSearchParams;
}

export function createQueryString({
  value,
  key,
  currentSearchParams,
}: CreateQueryStringProps) {
  try {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set(key, value);
    return params.toString();
  } catch (e) {
    console.log(e);
    throw new Error("Invalid URL");
  }
}
