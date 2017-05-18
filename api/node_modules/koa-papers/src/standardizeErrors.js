
module.exports = (result) => {
  const status = result.details.statusCode ? result.details.statusCode : result.type === "fail"? 401 : 500;

  if (result.details.error instanceof Error) {
    return {
      errorMessage: result.details.error.message,
      statusCode:status,
      exception: result.details.error
    }
  }

  if (typeof result.details.error === 'string') {
    return {
      errorMessage: result.details.error,
      statusCode:status,
      exception:result.details.error
    }
  }

  return {
    errorMessage: result.details,
    statusCode:status,
    exception: result.details
  }
  
};