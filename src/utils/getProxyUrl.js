//TODO: refactor this mess, it works but for sure it isn't pretty

const getProxyUrl = (openApi) => {
  const serviceUrl = [];
  if (openApi.host) {
    const host = openApi.basePath
      ? `${openApi.host}${openApi.basePath}`
      : openApi.host;
    if (openApi.schemes) {
      for (const scheme of openApi.schemes)
        serviceUrl.push(`${scheme}://${host}`);
    } else {
      serviceUrl.push(`http://${host}`);
    }
  } else {
    if (Array.isArray(openApi.servers))
      for (const server of openApi.servers) serviceUrl.push(server.url);
    else serviceUrl.push(openApi.servers.url);
  }
  return serviceUrl;
};

module.exports = getProxyUrl;
