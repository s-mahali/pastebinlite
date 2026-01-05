export function getEffectiveTime(request: Request): Date {
  const isTestMode = process.env.TEST_MODE === "1";
  const testHeader = request.headers.get("x-test-now-ms");

  if (isTestMode && testHeader) {
    return new Date(parseInt(testHeader));
  }

  return new Date();
}
