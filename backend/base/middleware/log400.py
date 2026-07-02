import logging

logger = logging.getLogger(__name__)

class Log400Midleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request_body = b""
        if request.body:
            request_body = request.body

        response = self.get_response(request)

        if response.status_code == 400:
            self._log_bad_request(request, request_body, response)

        return response

    def _log_bad_request(self, request, request_body, response):
        headers = {k: v for k, v in request.META.items() if k.startswith('HTTP_')}

        try:
            response_body = response.content.decode('utf-8', errors='replace')
        except AttributeError:
            response_body = "[Streaming/Large Response or Unreadable Content]"

        log_data = {
            'log_source': 'middleware',
            "path": request.path,
            "method": request.method,
            'query_string': request.GET.urlencode(),
            "request_headers": headers,
            "request_body": request_body.decode('utf-8', errors='replace'),
            "response_body": response_body,
        }
        logger.warning(f"HTTP 400 Bad Request", extra=log_data)
