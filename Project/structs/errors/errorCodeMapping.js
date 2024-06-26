// errorCodeMapping.js
const errorcodesenum = require('./errorcodes'); // adjust the path as needed

const errorCodes = {
  [errorcodesenum.CONTINUE]: 'Continue',
  [errorcodesenum.SWITCHING_PROTOCOLS]: 'Switching Protocols',
  [errorcodesenum.PROCESSING]: 'Processing',
  [errorcodesenum.EARLY_HINTS]: 'Early Hints',

  [errorcodesenum.OK]: 'OK',
  [errorcodesenum.CREATED]: 'Created',
  [errorcodesenum.ACCEPTED]: 'Accepted',
  [errorcodesenum.NON_AUTHORITATIVE_INFORMATION]: 'Non-Authoritative Information',
  [errorcodesenum.NO_CONTENT]: 'No Content',
  [errorcodesenum.RESET_CONTENT]: 'Reset Content',
  [errorcodesenum.PARTIAL_CONTENT]: 'Partial Content',
  [errorcodesenum.MULTI_STATUS]: 'Multi-Status',
  [errorcodesenum.ALREADY_REPORTED]: 'Already Reported',
  [errorcodesenum.IM_USED]: 'IM Used',

  [errorcodesenum.MULTIPLE_CHOICES]: 'Multiple Choices',
  [errorcodesenum.MOVED_PERMANENTLY]: 'Moved Permanently',
  [errorcodesenum.FOUND]: 'Found',
  [errorcodesenum.SEE_OTHER]: 'See Other',
  [errorcodesenum.NOT_MODIFIED]: 'Not Modified',
  [errorcodesenum.USE_PROXY]: 'Use Proxy',
  [errorcodesenum.TEMPORARY_REDIRECT]: 'Temporary Redirect',
  [errorcodesenum.PERMANENT_REDIRECT]: 'Permanent Redirect',

  [errorcodesenum.BAD_REQUEST]: 'Bad Request',
  [errorcodesenum.UNAUTHORIZED]: 'Unauthorized',
  [errorcodesenum.PAYMENT_REQUIRED]: 'Payment Required',
  [errorcodesenum.FORBIDDEN]: 'Forbidden',
  [errorcodesenum.NOT_FOUND]: 'Not Found',
  [errorcodesenum.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
  [errorcodesenum.NOT_ACCEPTABLE]: 'Not Acceptable',
  [errorcodesenum.PROXY_AUTHENTICATION_REQUIRED]: 'Proxy Authentication Required',
  [errorcodesenum.REQUEST_TIMEOUT]: 'Request Timeout',
  [errorcodesenum.CONFLICT]: 'Conflict',
  [errorcodesenum.GONE]: 'Gone',
  [errorcodesenum.LENGTH_REQUIRED]: 'Length Required',
  [errorcodesenum.PRECONDITION_FAILED]: 'Precondition Failed',
  [errorcodesenum.PAYLOAD_TOO_LARGE]: 'Payload Too Large',
  [errorcodesenum.URI_TOO_LONG]: 'URI Too Long',
  [errorcodesenum.UNSUPPORTED_MEDIA_TYPE]: 'Unsupported Media Type',
  [errorcodesenum.RANGE_NOT_SATISFIABLE]: 'Range Not Satisfiable',
  [errorcodesenum.EXPECTATION_FAILED]: 'Expectation Failed',
  [errorcodesenum.I_AM_A_TEAPOT]: 'I\'m a teapot',
  [errorcodesenum.MISDIRECTED_REQUEST]: 'Misdirected Request',
  [errorcodesenum.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
  [errorcodesenum.LOCKED]: 'Locked',
  [errorcodesenum.FAILED_DEPENDENCY]: 'Failed Dependency',
  [errorcodesenum.TOO_EARLY]: 'Too Early',
  [errorcodesenum.UPGRADE_REQUIRED]: 'Upgrade Required',
  [errorcodesenum.PRECONDITION_REQUIRED]: 'Precondition Required',
  [errorcodesenum.TOO_MANY_REQUESTS]: 'Too Many Requests',
  [errorcodesenum.REQUEST_HEADER_FIELDS_TOO_LARGE]: 'Request Header Fields Too Large',
  [errorcodesenum.UNAVAILABLE_FOR_LEGAL_REASONS]: 'Unavailable For Legal Reasons',

  [errorcodesenum.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [errorcodesenum.NOT_IMPLEMENTED]: 'Not Implemented',
  [errorcodesenum.BAD_GATEWAY]: 'Bad Gateway',
  [errorcodesenum.SERVICE_UNAVAILABLE]: 'Service Unavailable',
  [errorcodesenum.GATEWAY_TIMEOUT]: 'Gateway Timeout',
  [errorcodesenum.HTTP_VERSION_NOT_SUPPORTED]: 'HTTP Version Not Supported',
  [errorcodesenum.VARIANT_ALSO_NEGOTIATES]: 'Variant Also Negotiates',
  [errorcodesenum.INSUFFICIENT_STORAGE]: 'Insufficient Storage',
  [errorcodesenum.LOOP_DETECTED]: 'Loop Detected',
  [errorcodesenum.NOT_EXTENDED]: 'Not Extended',
  [errorcodesenum.NETWORK_AUTHENTICATION_REQUIRED]: 'Network Authentication Required',
  [errorcodesenum.FIELDS_MISSING]: 'Field missing',
};

module.exports = errorCodes;
