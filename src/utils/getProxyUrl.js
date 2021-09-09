const getProxyUrl = (openApi) => {
  const serviceUrl = [];
  if (openApi.host) {
    const host = openApi.baseUrl
      ? `${openApi.host}${openApi.baseUrl}`
      : openApi.host;
    if (openApi.schemes) {
      for (const scheme of openApi.schemes)
        serviceUrl.push(`${scheme}://${host}`);
    } else {
      serviceUrl.push(`http://${host}`);
    }
  } else {
    for (const server of openApi.servers) serviceUrl.push(server.url);
  }
  return serviceUrl;
};

module.exports = getProxyUrl;
