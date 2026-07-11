const trimTrailingSlash = (url) => url?.replace(/\/+$/, "");

const getFrontendUrl = () => {
  return trimTrailingSlash(process.env.FRONTEND_URL || process.env.FrontEND_URL);
};

const getBackendUrl = () => {
  return trimTrailingSlash(
    process.env.BACKEND_URL ||
      process.env.SERVER_URL ||
      process.env.RENDER_EXTERNAL_URL ||
      (process.env.NODE_ENV === "production" ? undefined : "http://localhost:4000")
  );
};

const buildFrontendUrl = (path = "/") => {
  const frontendUrl = getFrontendUrl();

  if (!frontendUrl) {
    throw new Error("FRONTEND_URL environment variable is required");
  }

  return `${frontendUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

const buildBackendUrl = (path = "/") => {
  const backendUrl = getBackendUrl();

  if (!backendUrl) {
    throw new Error("BACKEND_URL or GOOGLE_CALLBACK_URL environment variable is required");
  }

  return `${backendUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

module.exports = {
  getFrontendUrl,
  getBackendUrl,
  buildBackendUrl,
  buildFrontendUrl,
};
